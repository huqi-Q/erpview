import Vue from 'vue'
import VueRouter from "vue-router";
import ProcessList from "../components/view/ProcessList";

Vue.use(VueRouter);

export default new VueRouter({
  routes:[
    {
     path:'/ProcessList',
     component:ProcessList
    }
  ]
})
