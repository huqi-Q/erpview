import Vue from 'vue'
import VueRouter from "vue-router";
import ProcessList from "../components/view/ProcessList";
import Welcome from "../components/view/Welcome";

Vue.use(VueRouter);

export default new VueRouter({
  routes:[
    {
     path:'/ProcessList',
     component:ProcessList
    },
    {
      path:'/Welcome',
      component:Welcome
    }
  ]
})
