<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" ref="loginForm" :rules="rules"  label-position="left" label-width="0px" autoComplete="on">
      <h3 class="login_title">系统登录</h3>
      <div class="login-body">
        <el-form-item prop="username">
          <el-input type="text" v-model="loginForm.loginName" auto-complete="off" placeholder="账号"></el-input>
          <div class="login-username" slot="prepend"></div>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.pwd" auto-complete="off" placeholder="密码"></el-input>
          <template slot="prepend"><div class="login-password"></div></template>
        </el-form-item>
        <!--<el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>-->
        <el-form-item style="width: 100%">
          <el-button type="primary" @click="doLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </div>
    </el-form>
    <component v-bind:is="indexs"></component>
  </div>
</template>

<script>
  import axios from 'axios';
  import { mapGetters } from 'vuex'
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
  import ElAside from "../../../node_modules/element-ui/packages/aside/src/main";
  import ElFooter from "../../../node_modules/element-ui/packages/footer/src/main";
  import index from "../index"
  import login from "../login/login"
  export default {
    data() {
      return {
        displayLoading: false,
        indexs:'login',
        loginForm: {
          loginName: '',
          pwd: ''
        },
        rules: {
          loginName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          pwd: [{ required: true, message: '请输入口令', trigger: 'blur' }]
        },

      };
    },
    methods: {
      doLogin(){
        let _this = this;
        if (this.loginForm.loginName === '' || this.loginForm.pwd === ''){
          _this.$message({
            message: '不能为空',
            type: 'warning'
          });
        }else {
          var params = new URLSearchParams();
          params.append("loginId", this.loginForm.loginName);
          params.append("password", this.loginForm.pwd);

          axios.post("sysUsers/syslogin",params).then(function (response) {
            if (response.data==true){
              _this.$message({
                message: '登录成功',
                type: 'success'
              });
              _this.indexs='index'  //跳转 主页面
            }else {
              _this.$message.error('用户名或密码错误');
            }
          })
        }
      }
    },components: {
      ElFooter,
      login,
      index,
      ElAside,
      ElCard
    }
  }
</script>

<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
