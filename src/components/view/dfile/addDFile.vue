<template>
  <div>
      <div class="text item">
    <p style="background-color: deepskyblue;color: white">主信息</p>
    <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="ruleForm.productName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制造商">
            <el-input v-model="ruleForm.factoryName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="I级分类" prop="firstKindId">
            <el-select v-model="ruleForm.firstKindId" @change="getdataConfig" placeholder="请选择分类">
              <el-option
                v-for="items in configs"
                :key="items.kindId"
                :s1="items"
                :label="items.kindName"
                :value="items.kindId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="II级分类" prop="secondKindId">
            <el-select v-model="ruleForm.secondKindId" @change="getdataConfig" placeholder="请选择分类">
              <el-option
                v-for="items in configs1"
                :key="items.kindId"
                :label="items.kindName"
                :value="items.kindId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="III级分类" prop="thirdKindId">
            <el-select v-model="ruleForm.thirdKindId" placeholder="请选择分类" @change="getdataConfig">
              <el-option
                v-for="items1 in configs2"
                :key="items1.kindId"
                :label="items1.kindName"
                :value="items1.kindId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="产品简称">
            <el-input v-model="ruleForm.productNick"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用途类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择分类">
              <el-option
                v-for="items in configs3"
                :key="items.typeid"
                :label="items.typename"
                :value="items.typeid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="档次级别" prop="productClass">
            <el-select v-model="ruleForm.productClass" placeholder="请选择分类">
              <el-option
                v-for="items in configs4"
                :key="items.productClassId"
                :label="items.productClassName"
                :value="items.productClassId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="计量单位">
            <el-input v-model="ruleForm.personalUnit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计量值">
            <el-input v-model="ruleForm.personalValue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="市场单价" prop="listPrice">
            <el-input v-model="ruleForm.listPrice"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划成本价" prop="costPrice">
            <el-input v-model="ruleForm.costPrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <hr/>
      <p style="background-color: deepskyblue;color: white">辅助信息</p>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="保修期">
            <el-input v-model="ruleForm.warranty"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="替代品名称">
            <el-input v-model="ruleForm.twinName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="替代品编号">
            <el-input v-model="ruleForm.twinId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="生产周期（年）" label-width="150px">
            <el-input v-model="ruleForm.lifecycle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位">
            <el-input v-model="ruleForm.amountUnit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品经理">
            <el-input v-model="ruleForm.responsiblePerson"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="供应商集合">
            <el-input v-model="ruleForm.providerGroup"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品描述">
            <el-input v-model="ruleForm.productDescribe"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="登记人">
            <el-input v-model="ruleForm.register"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建档时间">
            <el-input v-model="ruleForm.registerTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
      </div>
  </div>
</template>
<script>
  import xianqin from "../xianqin"
  export default {
    name:"Record",
    data() {
      return {
        addfie: "addDFile",
        ruleForm: {
          productName: '',
          ruleForm: {
            firstKindId:"",
            secondKindId:"",
            thirdKindId:"",
            listPrice:"",
            costPrice:""
          },

        },
        configs: [],
        configs1: [],
        configs2: [],
        configs3:[
          {"typeid":'Y001-1',"typename":"商品"},
          {"typeid":'Y001-2',"typename":"物料"}
        ],
        configs4:[
          {"productClassId":"D001-1","productClassName":"高档"},
          {"productClassId":"D001-2","productClassName":"中档"},
          {"productClassId":"D001-3","productClassName":"低档"}
        ],
        s1:{},
        rules: {
          productName: [{required: true, message: '产品名称不能为空', trigger: 'blur'}],
          firstKindId: [{required: true, message: '产品I级分类名称不能为空', trigger: 'change'}],
          secondKindId: [{required: true, message: '产品II级分类名称不能为空', trigger: 'change'}],
          thirdKindId: [{required: true, message: '产品III级分类名称不能为空', trigger: 'change'}],
          listPrice:[{required: true, message: '市场单价不能为空', trigger: 'blur'},
            /*{ type: 'number', message: '市场单价必须为数字值'}*/],
          costPrice:[{required: true, message: '计划成本单价不能为空', trigger: 'blur'},
            /*{ type: 'number', message: '计划成本单价必须为数字值'}*/]

        }
      }
    },
    components:{xianqin},
    methods:{
      getdataConfig(){
        this.$axios.post("/dConfigFileKind/queryconfig").then(response =>{
          this.configs = response.data;
          this.configs1 = this.configs[0].childConfig;
          this.configs2 = this.configs1[0].childConfig;
        }).catch();
        this.$forceUpdate();
      },
      submitForm(){
        var _this = this;

        if (_this.ruleForm.productName === '' || _this.ruleForm.factoryName === ''){
          _this.$message({
            message: '不能为空',
            type: 'warning'
          });
        } else {
        //组装数据(普通数据+特殊文件)   formData  html5提供的类型
        var params = new FormData();
        Object.keys(this.ruleForm).forEach(item=>{
          params.append(item,this.ruleForm[item]);
        })
        //异步请求    post   enctype
        this.$axios({
          method:'post',
          url:'/dFile/addDFile',
          data:params,
          headers:{
            'Content-Type':'multipart/form-data'
          }
        }).then(response=>{
          if (response.data == true) {
            _this.addfie='xianqin'
            // _this.$notify({
            //   title: '成功',
            //   message: '添加成功',
            //   type: 'success'
            // });
          } else {
            _this.$notify({
              title: '失败',
              message: '添加失败',
              type: 'danger'
            });
          }
          _this.pageno = 1;
        }).catch();
        //重置
      }} ,resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },

    created() {
      this.getdataConfig()
    }
  }
</script>

<style >
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  /*.box-card {*/
    /*width: 480px;*/
  /*}*/
</style>
