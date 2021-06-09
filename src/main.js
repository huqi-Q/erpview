import Vue from 'vue'
import App from './App.vue'
import router from 'vue-router'

//导入elementui
import  'element-ui/lib/theme-chalk/index.css'
import  ElementUI from 'element-ui'

//导入axios
import Axios from 'axios'
//设置baseurl   指定为后端的访问路径
Axios.defaults.baseURL="http://localhost:8888";
Vue.prototype.$axios = Axios;

Vue.use(ElementUI)
Vue.use(router);

new Vue({
  el: '#app',
  // router,
  render: h => h(App)
})
