<template>
<div>
<!--产品档案删除-->
  <!--  条件查询-->
  <el-form ref="productFrom"  :inline="true">
    <el-form-item label="请选择产品I级分类">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          :key="firstKindId"
          :label="firstKindName"
          :value="firstKindId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="请选择产品II级分类">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          :key="firstKindId"
          :label="firstKindName"
          :value="firstKindId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="请选择产品III级分类">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          :key="firstKindId"
          :label="firstKindName"
          :value="firstKindId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="请选择产品用途类型">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          :key="firstKindId"
          :label="firstKindName"
          :value="firstKindId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="请输入登记时间">
      <div class="block">
        <el-date-picker
          v-model="registerTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
        >
        </el-date-picker>
      </div>
    </el-form-item>

    <el-button type="success" @click="searchproduct">查询</el-button>
    <el-button type="danger" @click="resetproduct(productFrom)">重置</el-button>
  </el-form>


  <!--表格 -->
  <el-table
    :data="tableData"
    stripe
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="产品id"
      v-if="false"
      width="180">
    </el-table-column>
    <el-table-column
      prop="productId"
      label="产品编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="productName"
      label="产品名称">
    </el-table-column>
    <el-table-column
      prop="productClass"
      label="档次级别">
      <template slot-scope="scope">
        <span v-if="scope.row.productClass =='D001-1'">高档</span>
        <span v-else-if="scope.row.productClass == 'D001-2'">中档</span>
        <span v-else="scope.row.productClass == 'D001-3'">低档</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="firstKindName"
      label="I级分类">
    </el-table-column>
    <el-table-column
      prop="secondKindName"
      label="II级分类">
    </el-table-column>
    <el-table-column
      prop="thirdKindName"
      label="III级分类">
    </el-table-column>
    <el-table-column
      prop="type"
      label="用途类型">
      <template slot-scope="scope">
        <span v-if="scope.row.type =='Y001-1'">商品</span>
        <span v-else="scope.row.type == 'Y001-2'">物料</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="responsiblePerson"
      label="产品经理">
    </el-table-column>
    <el-table-column
      label="恢复">
      <template slot-scope="scope">
        <a href="#" @click.prevent='del(scope.row)'>恢复</a>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页-->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageno"
    :page-sizes="[5, 10, 15, 20]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>

  <!--弹出档案变更模态框-->
  <!--<el-dialog width="80%" title="档案变更" :visible="upwinshow">

    <p style="background-color: deepskyblue;color: white">主信息</p>
    <el-form :modal="ruleForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="ruleForm.productName" :disabled="true"></el-input>
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
            <el-select v-model="ruleForm.firstKindId" placeholder="请选择分类">
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
            <el-select v-model="ruleForm.secondKindId"  placeholder="请选择分类">
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
            <el-select v-model="ruleForm.thirdKindId" placeholder="请选择分类">
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
            <el-select v-model="ruleForm.type" placeholder="请选择分类" :disabled="true">
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
            <el-input v-model="ruleForm.listPrice" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划成本价" prop="costPrice">
            <el-input v-model="ruleForm.costPrice" :disabled="true"></el-input>
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
        <el-button type="primary" @click="submitFile">提交</el-button>
        <el-button @click="upwinshow = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>-->



  </div>
  </template>

          <script>
              export default {
                  name: "delRecover",
                data() {
                  return {
                    tableData: [],
                    scgxtableData:[],
                    currentTime:new Date(),
                    upwinshow: false,
                    gxwinshow:false,
                    ruleForm:{},
                    manufactureData:[],
                    options:[],
                    value:"",
                    pageno: 1,
                    pagesize: 5,
                    total: 0,
                    firstKindId:"",
                    firstKindName:"",
                    configs: [],
                    configs1:[],
                    configs2:[],
                    configs3:[
                      {"typeid":'Y001-1',"typename":"商品"},
                      {"typeid":'Y001-2',"typename":"物料"}
                    ],
                    configs4:[
                      {"productClassId":"D001-1","productClassName":"高档"},
                      {"productClassId":"D001-2","productClassName":"中档"},
                      {"productClassId":"D001-3","productClassName":"低档"}
                    ],
                    shortcuts: [{
                      text: '最近一周',
                      value: (() => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        return [start, end]
                      })(),
                    }, {
                      text: '最近一个月',
                      value: (() => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        return [start, end]
                      })(),
                    }, {
                      text: '最近三个月',
                      value: (() => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        return [start, end]
                      })(),
                    }],
                    registerTime: ''
                  }
                },
                methods: {
                  getdata() {   //获取数据
                    var _this = this;
                    var params = new URLSearchParams();
                    params.append("pageno", this.pageno);
                    params.append("pagesize", this.pagesize);
                    //产品档案
                    this.$axios.post("/dFile/delRecoverPage", params).then(function (response) {
                      _this.tableData = response.data.records;
                      _this.total = response.data.total;
                      //_this.firstKindName = response.data.records[0].firstKindName;
                      //_this.firstKindId = response.data.records[0].firstKindId;
                    }).catch();
                  },
                  changeCellStyle (row, column, rowIndex, columnIndex) {
                    if(row.column.label === "工时数"){
                      return 'background-color: blanchedalmond'  // 修改的样式
                    }else if(row.column.label === "工时单位"){
                      return 'background-color: blanchedalmond'
                    }else if(row.column.label === "单位工时成本"){
                      return 'background-color: blanchedalmond'
                    }
                    else{
                      return ''
                    }
                  },
                  handleSizeChange(val) {  //页size变更
                    this.pagesize = val;
                    this.pageno = 1;
                    this.getdata();
                  },
                  handleCurrentChange(val) {  //页码变更

                    this.pageno = val;
                    this.getdata();
                  },
                  searchproduct() {   //条件查询
                    this.getdata();
                  },
                  resetproduct(name){
                    this.$refs.productFrom.resetFields()
                    this.dialogVisible = false;
                  },
                  del(row){
                   // this.upwinshow = true;

                    var _this = this;
                    var params = new URLSearchParams();
                    params.append("id",row.id);

                    _this.$confirm('您确定要恢复'+row.productName+'这档案例吗?','恢复案例',{
                      confirmButtonText:'确定',
                      cancelButtonText:'取消',
                      type: 'warning'
                    }).then(()=>{
                      this.$axios.post("/dFile/delRecover",params).then(function (response) {
                        if (response.data==true) {
                          _this.$message({
                            type:'success',
                            message:'恢复成功!'
                          });
                          _this.pageno = 1;
                          _this.getdata();
                        }
                      }).catch();
                    }).catch(()=> {
                      this.$message({
                        type: 'info',
                        message: '已取消恢复'
                      });
                    });

                  },
                  //提交档案变更后的数据
                  submitFile(){
                    var _this =this;
                    //组装数据(普通数据+特殊文件)   formData  html5提供的类型
                    var params = new URLSearchParams();
                    Object.keys(_this.ruleForm).forEach(function (item) {

                      if (_this.ruleForm[item]!=null){
                        params.append(item,_this.ruleForm[item]);
                      }


                    })
                    this.$axios.post('/dFile/updateDFile',params).then(function (response) {
                      if (response.data == true) {
                        _this.$notify({
                          title: '成功',
                          message: '修改成功',
                          type: 'success'
                        });
                      } else {
                        _this.$notify({
                          title: '失败',
                          message: '修改失败',
                          type: 'danger'
                        });
                      }
                      _this.pageno = 1;
                      //刷新表格数据
                      _this.getdata();

                      //关闭产品变更模态框
                      _this.upwinshow=false;

                    }).catch();
                  },
                  tjgx(row){
                    this.scgxtableData.push(row);
                  },
                  scgx(){

                  }
                },
                created() {
                  this.getdata();
                  var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
                    _this.currentTime = //修改数据date
                      new Date().getFullYear() +
                      "-" +
                      (new Date().getMonth() + 1) +
                      "-" +
                      new Date().getDate() +
                      " " +
                      new Date().getHours() +
                      ":" +
                      new Date().getMinutes() +
                      ": " +
                      new Date().getSeconds();
                }
              }
          </script>

          <style>
            .xhx {
              height: 25px;
              border: none;
              border-bottom: 1px solid black;
              background-color: transparent;
              outline: none;
            }
            .mbk{
              border: none;
              height: 20px;
            }
          </style>
