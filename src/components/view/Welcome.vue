<template>
    <div>
     欢迎{{username}}登录
    </div>
</template>

<script>
    export default {
        name: "Welcome",
      data() {
        return {
          username: ''
        }
        },methods:{

          show(){
            var _this = this;
            this.$axios.post("/sysUsers/getname").then(function (response) {
              _this.username = response.data;
            }).catch();
          }
      }, created() {
        this.show();
      }
    }
</script>

<style>

</style>
