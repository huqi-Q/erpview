<template>
  <div id="app" class="homeWrap">
    <el-container style="height: 100%;">
      <el-header style="height: 80px; position: fixed; z-index: 1; width: 100%">ERP管理系统</el-header>
<!--      <el-header height="60px" id="admintp">admin</el-header>-->

      <el-container style="padding-top: 80px; height: 100%;">
        <el-aside style="width: 240px;">
          <!-- 左侧菜单-->
          <el-menu default-active="0" class="el-menu-vertical-demo" background-color="white" text-color="black" active-text-color="#ffd04b">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu :index="parentmenu.id+''" v-for="parentmenu in menutable">
              <template slot="title">
                <i :class="parentmenu.iconUrl"></i>
                <span>{{parentmenu.name}}</span>
              </template>
              <el-submenu :index="childmenu.id+''" v-for="childmenu in parentmenu.childMenu">
                <template #title>{{childmenu.name}}</template>
                <el-menu-item-group>
                  <el-menu-item  @click="addTab(childmenu1.name,childmenu1.linkurl)" :index="childmenu1.id+''" v-for="childmenu1 in childmenu.childMenu">
                    <i :class="childmenu1.iconUrl"></i>{{childmenu1.name}}
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main >

          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
              <component :is="item.content"></component>
            </el-tab-pane>
          </el-tabs>


        </el-main>
      </el-container>


    </el-container>
  </div>
</template>

<script>
import ProcessList from "./components/view/process/ProcessList";
import ProcessFormulate from "./components/view/process/ProcessFormulate";
import ProcessReview from "./components/view/process/ProcessReview";
import Welcome from "./components/view/Welcome";

export default {
  name: 'app',
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
      this.$axios.get("/sysMenus/queryallmenus.action").then((response)=>{
        console.log(response.data);
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
    ProcessList,Welcome,ProcessFormulate,ProcessReview
  }
}
</script>


<style scoped>

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 100%;
    min-height: 100%;
  }
  .el-header, .el-footer {
    background-color: white;
    color: deepskyblue;
    border-bottom: 1px deepskyblue solid;
    line-height: 60px;

  }

  .el-aside {
    background-color: white;
    color: deepskyblue;
  }

  .el-main {
    background-color: white;
    color: deepskyblue;
    border-left: 1px deepskyblue solid;
    text-align: center;

  }


  .homeWrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
