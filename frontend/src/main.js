import { createApp } from 'vue'
import App from './App.vue'
import store from './strore'

createApp(App)
.use(store)
.mount('#app')
