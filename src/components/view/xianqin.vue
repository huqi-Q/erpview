<template>
    <div class="cssys">
      <el-card class="box-card">
      <el-page-header @back="goBack" content="详情页面">
        <br><br>
      </el-page-header>
      </el-card>
      <el-card class="box-card">
        <div class="text item">
          <h1 style="color: red">登记成功请等待审核成功</h1>
        </div>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "xianqin",
        methods: {
          goBack() {
            console.log('go back');
          }
        }
    }
</script>

<style>
.cssys{
  color: black;
}
.text {
  font-size: 14px;
}

.item {
  padding: 28px 0;
}
/*.box-card {*/
/*width: 480px;*/
/*}*/
</style>
