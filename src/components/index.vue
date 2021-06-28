<template>
  <div id="app" class="homeWrap">
    <el-container style="height: 100%;">
      <el-header style="height: 80px; position: fixed; z-index: 1; width: 100%">ERP管理系统
      </el-header>
      <el-container style="padding-top: 80px; height: 100%;">
        <el-aside style="width: 260px " >
          <!-- 左侧菜单-->
          <el-menu default-active="0"  class="el-menu-vertical-demo" background-color="#1e222d" text-color="#c1c6c8" font="16px" contrast="3.97" active-text-color="#ffd04b">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu :index="parentmenu.id+''" v-for="parentmenu in menutable">
              <template slot="title">
                <i :class="parentmenu.imageurl"></i>
                <span>{{parentmenu.name}}</span>
              </template>
              <el-submenu :index="childmenu.id+''" v-for="childmenu in parentmenu.childMenu">

                <template #title>
                  <i :class="childmenu.imageurl"></i>
                  {{childmenu.name}}
                </template>
                <el-menu-item-group>
                  <el-menu-item  @click="addTab(childmenu1.name,childmenu1.linkurl)" :index="childmenu1.id+''" v-for="childmenu1 in childmenu.childMenu">
                    <i :class="childmenu1.imageurl"></i>{{childmenu1.name}}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main >
          <el-card class="box-card">
          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
              <el-card class="box-card">
              <component :is="item.content"></component>
              </el-card>
            </el-tab-pane>
          </el-tabs>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import ProcessList from "./view/process/ProcessList";
  import ProcessFormulate from "./view/process/ProcessFormulate";
  import ProcessReview from "./view/process/ProcessReview";
  import Welcome from "./view/Welcome";
  import ProcessChange from "./view/process/ProcessChange";
  import Sgather from "./view/sgather/Sgather";
  import scell from "./view/scell/scell";
  import QueryallDFile from "./view/dfile/queryallDFile";
  import updateDFile from "./view/dfile/updateDFile";
  import addDFile from "./view/dfile/addDFile";
  import SafetyStockAudit from "./view/scell/SafetyStockAudit";
  import SafetyStockConfigurationChange from "./view/scell/SafetyStockConfigurationChange";
  import SafetyStockConfigurationQuery from "./view/scell/SafetyStockConfigurationQuery";
  import recheckDFile from "./view/dfile/recheckDFile";
  import delDFile from "./view/dfile/delDFile";
  import delRecover from "./view/dfile/delRecover";
  import Zdmoduletoexamine from "./view/module/Zdmoduletoexamine";
  import xianqin from "../components/view/xianqin"
  import GxdList from "./view/gxwl/GxdList";
  import GxdShList from "./view/gxwl/GxdShList";
  import GxdBgList from "./view/gxwl/GxdBgList";
  import GxdCxList from "./view/gxwl/GxdCxList";
  import ProcessRegister from "./view/processPlan/ProcessRegister";
  import SgatherAudit from "./view/sgather/SgatherAudit";
  import Makestockinorder from "./view/Dispatchingmanagement/Makestockinorder";
  import Makedeliveryorder from "./view/Dispatchingmanagement/Makedeliveryorder";
  import PlanReview from "./view/processPlan/PlanReview";
  import PlanList from "./view/processPlan/PlanList";
  import DevelopDispatch from "./view/dispatch/DevelopDispatch";
  import DispatchList from "./view/dispatch/DispatchList";
  import DispatchReview from "./view/dispatch/DispatchReview";
  import Outboundapplicationregistration from "./view/Issueapplicationmanagement/Outboundapplicationregistration";
  import SgatherQuery from "./view/sgather/SgatherQuery";
  import Dynamicinventoryquery from "./view/Dynamicinventory/Dynamicinventoryquery";
  import Zdmodule from "./view/module/Zdmodule";
  import Zdmodulechange from "./view/module/Zdmodulechange";
  import Warehousingregistration from "./view/Warehousingmanagement/Warehousingregistration";
  import Warehousingaudit from "./view/Warehousingmanagement/Warehousingaudit";
  import Warehousingquery from "./view/Warehousingmanagement/Warehousingquery";
  import Outboundregistration from "./view/Outboundmanagement/Outboundregistration";
  import Deliveryaudit from "./view/Outboundmanagement/Deliveryaudit";
  import Deliveryquery from "./view/Outboundmanagement/Deliveryquery";
  import wew from "./"
  import ProduceRegister from "./view/produce/ProduceRegister";
  import ProduceReview from "./view/produce/ProduceReview";
  import ProduceList from "./view/produce/ProduceList";

  export default {
    name: 'index',
    data(){
      return {
        menutable:[],
        editableTabsValue: '1',  // 设置选中的
        editableTabs: [{   //tab选项卡显示的数据内容
          title: '首页',
          name: '1',
          content: 'Welcome'
        }],
        tabIndex: 1   // 设置到name属性的值
      };
    },
    methods: {
      getmenudata(){
        this.$axios.get("sysMenus/queryallmenus.action").then((response)=>{
          this.menutable=response.data;
        }).catch();
      },
      addTab(titlename,linkurl) {

        //判断当前页面是否存在
        var tempobj = this.editableTabs.find((item)=>{return item.title==titlename});

        //存在  active
        if(tempobj!=undefined){
          this.editableTabsValue =tempobj.name ;
        }else {
          //不存在 添加
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: titlename,
            name: newTabName,
            content: linkurl
          });
          this.editableTabsValue = newTabName;
        }

      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }

    },
    created(){
      this.getmenudata();
    },
    components:{
      Sgather,SgatherAudit,Warehousingregistration,
      Warehousingaudit,Warehousingquery,Outboundregistration
      ,Deliveryaudit,Deliveryquery,
      Zdmodulechange,Zdmoduletoexamine,updateDFile,
      QueryallDFile,delDFile,delRecover,recheckDFile,
      addDFile,xianqin,
      Zdmodule,ProcessChange,ProcessRegister,GxdCxList,
      GxdBgList,GxdShList,GxdList,Dynamicinventoryquery,SgatherQuery,
      Outboundapplicationregistration,Makestockinorder,Makedeliveryorder,
      ProcessList,Welcome,ProcessFormulate,ProcessReview,scell,SafetyStockAudit,
      SafetyStockConfigurationChange,SafetyStockConfigurationQuery,PlanReview,PlanList
      ,DevelopDispatch,DispatchList,DispatchReview,ProduceRegister,ProduceReview,ProduceList
    }
  }
</script>


<style>
  /*.el-menu-vertical-demo:not(.el-menu--collapse) {*/
    /*width: 100%;*/
    /*min-height: 100%;*/
  /*}*/
  /*头部*/
  .el-header, .el-footer {
    background-color: #262f3e;
    color: white;
    border-bottom: 1px #262f3e solid;
    line-height: 60px;

  }

  .el-aside {
    background-color: #262f3e;
    /*color: white;*/
  }

  .el-main {
    background-color: white;
    color: white;
    border-left: 1px white solid;
    /*text-align: center;*/
  }


  .homeWrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
