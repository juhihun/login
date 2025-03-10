const express = require('express');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const app = express();

const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(session({
  secret: 'secret key', //암호화하는 데 쓰일 키
  resave: false, // 세션에 변경사항이 없어도 항상 다시 저장할지 여부
  saveUninitialized: true, // 초기화되지 않은 세션을 스토어(저장소)에 강제로 저장할지 여부
  cookie: { // 세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
     httpOnly: true, // true 이면 클라이언트 자바스크립트에서 document.cookie로 쿠키 정보를 볼 수 없음
     secure: true, // true 이면 https 환경에서만 쿠키 정보를 주고 받도록 처리,
     maxAge: 60000 // 쿠키가 유지되는 시간 (밀리세컨드 단위)
  },
  store: new fileStore() // 세션 저장소로 fileStore 사용
  }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const memebers = [
  { userid: "user1", userpw: "1111" },
  { userid: "user2", userpw: "2222" },
  { userid: "user3", userpw: "3333" }
]

app.get("/api/account",(req,res)=>{
//  if(req.cookies && req.cookies.account){
console.log(req.session.is_logined)
  if(req.session.is_logined){
//    const member = JSON.parse(req.cookies.account);

    const member = JSON.parse({userid : req.session.userid});
    return res.send(member);
    // if(member.userid){
    //   return res.send(member)
    // }
  }
  res.send(401);
})

app.post('/api/logout',(req,res)=>{
 // res.clearCookie("account")
  req.session.destroy();
  res.send(200);
})



app.post('/api/login',(req,res)=>{
  const userid = req.body.userid;
  const userpw = req.body.userpw;
  console.log(userid,userpw);
  const member = memebers.find(u=> u.userid == userid
    && u.userpw == userpw );
  
  if(member){
    // const options = {
    //   damain:'localhost',
    //   path:"/",
    //  // maxAge:10000, //쿠키유효시간
    //   httpOnly:true
    // }
    //쿠키에 값 저장
   // res.cookie("account",JSON.stringify(member),options);
    req.session.userid = userid; // 세션에 사용자 이메일 정보 저장
    req.session.is_logined = true; // 세션에 로그인 여부 저장
    req.session.save(err => { // 세션 저장
        if(err) throw err;
       
        }); 
    //프론트로 값 전달
        res.send(member);
         }else{
          res.send(401); //권한없음에러
           }
      });

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})