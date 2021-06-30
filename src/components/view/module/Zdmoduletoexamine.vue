<template>
  <div>
    <!--物料组成设计单审核-->
    <!--  条件查询-->
    <el-form ref="productFrom"  :inline="true">
      <el-form-item label="请选择产品I级分类">
        <el-select v-model="value" placeholder="请选择">
          <el-option :key="firstKindId" :label="firstKindName" :value="firstKindId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择产品II级分类">
        <el-select v-model="value" placeholder="请选择">
          <el-option :key="firstKindId" :label="firstKindName" :value="firstKindId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择产品III级分类">
        <el-select v-model="value" placeholder="请选择">
          <el-option :key="firstKindId" :label="firstKindName" :value="firstKindId"></el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item label="请输入登记时间">
        <div class="block">
          <el-date-picker v-model="registerTime" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :shortcuts="shortcuts"></el-date-picker>
        </div>
      </el-form-item>

      <el-button type="success" @click="searchproduct">查询</el-button>
      <el-button type="danger" @click="resetproduct(productFrom)">重置</el-button>
    </el-form>


    <!--表格 -->
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="designId" label="设计单编号" width="180"></el-table-column>
      <el-table-column prop="productId" label="产品编号"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="designer" label="设计人"></el-table-column>
      <el-table-column prop="registerTime" label="登记时间"></el-table-column>
      <el-table-column prop="costPriceSum" label="物料成本"></el-table-column>
      <el-table-column prop="type" label="用途类型"></el-table-column>
      <el-table-column label="审核">
        <template slot-scope="scope">
          <a href="#" @click.prevent='zd(scope.row.designId)'>审核</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageno" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <!--  设计单-->
    <el-dialog width="80%" title="物料组成设计单审核" :visible="zdwinshow">

      <el-form  :modal="scFrom">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong style="margin-right: 220px">设计单编号  :  {{scFrom.designId}}</strong>
              <br>
              <br>
              <strong >设计人:</strong>
              <input v-model="scFrom.designer" class="xhx" style="width:300px"></input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>产  品   编 号  :  {{scFrom.productId}}</strong>
            </div>
            <div class="grid-content bg-purple-light">
              <strong>产  品   名称  :  {{scFrom.productName}}</strong>
            </div>
          </el-col>
        </el-row>
        <br>
        <!--生产工序-->
        <div>
          <el-table :data="scFrom1" stripe border style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="detailsNumber" label="物料编号"></el-table-column>
            <el-table-column prop="productName" label="物料名称" width="180"></el-table-column>
            <el-table-column prop="type" label="用途类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type =='Y001-1'">商品</span>
                <span v-else="scope.row.type == 'Y001-2'">物料</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="productDescribe"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="数量">
              <template slot-scope="scope">
                <input class="mbk" v-model="scope.row.addmodulemount" type="text"></input>
              </template>
            </el-table-column>
            <el-table-column prop="amountUnit" label="单位"></el-table-column>
            <el-table-column prop="costPrice" label="计划成本单价(元)"></el-table-column>
            <el-table-column prop="subtotal" label="小计(元)">
              <template slot-scope="scope">
                {{scope.row.addmodulemount*scope.row.costPrice}}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-row>
          <!--<el-col :span="6">
            <div class="grid-content bg-purple">
              <strong >物料总成本: {{sumWl}}</strong>
            </div>
          </el-col>-->
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong >登记人:</strong>
              <input class="xhx" value="dd" v-model="scFrom.register" style="width:300px"></input>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <strong>登  记  时  间:  {{scFrom.registerTime}}</strong>
            </div></el-col>
        </el-row>
        <br>
        <div style="margin-right:40px">
          <strong>设计要求</strong>
          <textarea v-model="scFrom.moduleDescribe" style="width:950px;height: 100px">

      </textarea>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="zdwinshow = false">返回</el-button>
        <el-button type="primary" @click="shenhei">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: "Zdmoduletoexamine",
    data() {
      return {
        tableData: [],
        scFrom1:[],
        addmodule:"",
        tjmoduletb1:false,
        scgxtableData:[],
        addmoduleFrom:[],
        currentTime:new Date(),
        zdwinshow: false,
        gxwinshow:false,
        addmodulemount:1,
        scFrom:{},
        manufactureData:[],
        options:[],
        designer:"jj",
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
        this.$axios.post("/dModule/queryalldModule.action", params).then(function (response) {
          _this.tableData = response.data.records;
          _this.total = response.data.total;
        }).catch();
      },
      tjwl(row){
        this.scgxtableData.push(row);
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
      shenhei(){
        var _this = this;
        var paramss = new URLSearchParams();
        paramss.append("designId",this.scFrom.designId);
        this.$axios.post("/dModule/approvedchecktag.action",paramss).then(function (response) {
          if (response.data == true) {
            _this.$notify({
              title: '成功',
              message: '复核成功',
              type: 'success'
            });
            _this.zdwinshow = false;
            _this.getdata();
          } else {
            _this.$notify({
              title: '失败',
              message: '服务端请求超时 请重试',
              type: 'danger'
            });}
        }).catch();
      },
      resetproduct(name){
        this.$refs.productFrom.resetFields()
        this.dialogVisible = false;
      },
      zd(designId){
        this.zdwinshow = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("designId",designId);
        this.$axios.post("/dModule/selectBydesignId.action",params).then(function (response) {
          _this.scFrom=response.data[0];
        }).catch();
        var paramss = new URLSearchParams();
        paramss.append("designId",designId);
        this.$axios.post("/dModuleDetails/selectbyproductId",paramss).then(function (response) {
          console.log(response.data);
          _this.scFrom1=response.data;
        }).catch();
      },
      tjgx(row){
        this.scgxtableData.push(row);
      },
      scmodule(){

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
