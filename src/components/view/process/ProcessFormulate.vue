<template>
<div>
<!--产品工序设计-->
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
      prop="responsiblePerson"
      label="产品经理">
    </el-table-column>
    <el-table-column
      label="制定设计单">
      <template slot-scope="scope">
        <a href="#" @click.prevent='zd(scope.row.productId)'>制定设计单</a>
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

<!--  设计单-->
  <el-dialog width="80%" title="生产工序设计单" :visible="zdwinshow">

    <el-form  :modal="scFrom">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
          <strong style="margin-right: 220px">产  品  名  称  :  {{scFrom.productName}}</strong>
          <br>
          <br>
          <strong >设计人:</strong>
          <input class="xhx" style="width:300px"></input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
         <strong>产  品   编 号  :  {{scFrom.productId}}</strong>
          </div>
        </el-col>
          </el-row>
      <br>
          <!--生产工序-->
            <div>
              <el-table
                :data="tableData"
                stripe
                border
                style="width: 100%">
                <el-table-column
                  prop="productId"
                  label="工序名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="productName"
                  label="工序编号">
                </el-table-column>
                <el-table-column
                  prop="productClass"
                  label="描述">
                </el-table-column>
                <el-table-column
                  prop="firstKindName"
                  label="工时数">
                </el-table-column>
                <el-table-column
                  prop="secondKindName"
                  label="工时单位">
                </el-table-column>
                <el-table-column
                  prop="thirdKindName"
                  label="单位工时成本">
                </el-table-column>
                <el-table-column
                  prop="responsiblePerson"
                  label="工时成本小计(元)">
                </el-table-column>
              </el-table>
            </div>

      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
          <strong >登记人:</strong>
          <input class="xhx" value="dd" disabled="disabled" style="width:300px"></input>
        </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <strong>登  记  时  间:  {{currentTime}}</strong>
        </div></el-col>
      </el-row>
      <br>
      <div style="margin-right:40px">
      <strong>设计要求</strong>
      <textarea style="width:950px;height: 100px">

      </textarea>
      </div>
      <br>

      <div>
        <el-button @click="zdwinshow = false">添加工序</el-button>
        <el-button @click="scgx">删除工序</el-button>
      </div>

      </el-form>



              <div slot="footer" class="dialog-footer">
                <el-button @click="zdwinshow = false">取 消</el-button>
                <el-button type="primary" @click="scgx">确 定</el-button>
              </div>

            </el-dialog>
            </div>
          </template>

          <script>
              export default {
                  name: "ProcessFormulate",
                data() {
                  return {
                    tableData: [],
                    currentTime:new Date(),
                    zdwinshow: false,
                    scFrom:{},
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


                    this.$axios.post("/dFile/selectAll", params).then(function (response) {
                      _this.tableData = response.data;
                      // _this.total = response.data.total;
                      _this.firstKindName = response.data[0].firstKindName;
                      _this.firstKindId = response.data[0].firstKindId;
                    }).catch();
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
                  zd(id){
                    this.zdwinshow = true;
                    var _this = this;
                    var params = new URLSearchParams();
                    params.append("id",id);
                    this.$axios.post("/dFile/selectById",params).then(function (response) {
                        _this.scFrom=response.data;
                    }).catch();
                  },
                  scgx(){
                    alert("dd")
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
          </style>
