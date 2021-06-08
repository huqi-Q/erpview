<template>
    <div>
      权限管理

      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="checkarr"
        :props="defaultProps">
      </el-tree>

    </div>
</template>

<script>
    export default {
        name: "PerList",
      data(){
          return {
            data:[],
            defaultProps: {
              children: 'childMenu',
              label: 'name'
            },
            checkarr:[4,5,6]
          }
      },
      methods:{
        getmenudata(){
          this.$axios.get("queryallmenus.action").then((response)=>{
            this.data=response.data;
          }).catch();
        },
      },
      created(){
          this.getmenudata();
      }
    }
</script>

<style scoped>

</style>
