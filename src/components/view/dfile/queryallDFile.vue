<template>
<div>
<!--产品档案查询-->
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

  </div>
  </template>

          <script>
              export default {
                  name: "QueryallDFile",
                data() {
                  return {
                    tableData: [],
                    scgxtableData:[],
                    currentTime:new Date(),
                    zdwinshow: false,
                    gxwinshow:false,
                    scFrom:{},
                    manufactureData:[],
                    options:[],
                    value:"",
                    pageno: 1,
                    pagesize: 5,
                    total: 0,
                    firstKindId:"",
                    firstKindName:"",
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
                    this.$axios.post("/dFile/queryallDFile", params).then(function (response) {
                      _this.tableData = response.data.records;
                      _this.total = response.data.total;
                      _this.firstKindName = response.data.records[0].firstKindName;
                      _this.firstKindId = response.data.records[0].firstKindId;
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
                  /*tjgxtb(){
                    var _this = this;
                    this.gxwinshow = true;
                    this.$axios.post("/manufactureList/queryallmanufactureList.action").then(function (response) {
                      _this.manufactureData = response.data;
                    }).catch();
                  },*/
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
                  zd(id){
                    this.zdwinshow = true;
                    var _this = this;
                    var params = new URLSearchParams();
                    params.append("id",id);
                    this.$axios.post("/dFile/selectById",params).then(function (response) {
                        _this.scFrom=response.data;
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
