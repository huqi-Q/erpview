<template>
  <div id="app" class="homeWrap">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>


<style>
  .inputDeep>>>.el-input__inner {
    border: 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button
  {
    -webkit-appearance:none ;
  }
  input[type="number"]{
    -moz-appearance:textfield ;
  }
</style>
