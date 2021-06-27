import Vue from 'vue'
import VueRouter from "vue-router";
import Login from "../components/login/login";
import err from "../components/404";
import xianqin from "../components/view/xianqin";

Vue.use(VueRouter);

export default new VueRouter({
  mode:'history',
  routes:[
    {
      path:'/',
      name:'登录',
      component:Login
    },{
      path:'/login',
      name:'登录',
      component:Login
    },{
      path:'/xianqin',
      name:'登录',
      component:xianqin
    },
    {
      path: '*',
      name: '404',
      component: err
    }
  ]
})
