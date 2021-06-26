<template>
  <!--产品工序设计审核-->
  <div>
    <!--  条件查询-->
    <el-form v-model="productFrom" ref="productFrom"  :inline="true">
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
        <el-input placeholder="请输入类型名字" clearable v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="请选择产品III级分类">
        <el-input placeholder="请输入类型名字" clearable v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="请选择产品">
        <el-input placeholder="请输入备注" clearable v-model="productName"></el-input>
      </el-form-item>
      <el-form-item label="请选择工序设计单状态">
        <el-input placeholder="请输入备注" clearable v-model="remark"></el-input>
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
        prop="gatherId"
        label="入库单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="入库理由">
      </el-table-column>
      <el-table-column
        prop="reasonexact"
        label="入库详细理由">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间">
      </el-table-column>
      <el-table-column
        prop="costPriceSum"
        label="总件数">
      </el-table-column>
      <el-table-column
        prop="costPriceSum"
        label="总金额">
      </el-table-column>
      <el-table-column
        label="复核">
        <template slot-scope="scope">
          <a href="#" @click.prevent='shsjd(scope.row)'>复核</a>
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


    <el-dialog width="80%" title="入库单复核" :visible="jhwinshow">

      <el-form  :modal="scFrom">
        <el-row>
          <br>
          <br>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong >入库单编号: {{scgData.gatherId}}</strong><br><br>
            <strong >入库理由: {{scgData.reason}}</strong>
            <br>
            <br>
          </div></el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>入库详细理由: {{scgData.reasonexact}}</strong>
            </div>
          </el-col>
        </el-row>
        <!--生产工序-->
        <div>
          <el-table :data="scgxtableData" stripe border style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="productId" label="产品编号" width="180"></el-table-column>
            <el-table-column prop="productName" label="产品名称"></el-table-column>
            <el-table-column prop="warehouseName" label="库房名称"></el-table-column>
            <el-table-column prop="thirdKindName" label="存放地址"></el-table-column>
            <el-table-column prop="productName" label="应入库数量"></el-table-column>
            <el-table-column prop="productName" label="已库数量"></el-table-column>
            <el-table-column prop="productName" label="本次库数量">
              <input type="text">
            </el-table-column>
          </el-table>
        </div>

        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong >应入库总件数: {{scgxtabs.amount}}</strong>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            <strong>:  {{scgxtabs.registerTime}}</strong>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong >应入库总成本: {{scgxtabs.subtotal}}</strong>
            </div>
            <div class="grid-content bg-purple">
              <strong >登计人:</strong>
              <input class="xhx" value="dd" disabled="disabled" style="width:300px"></input>
            </div>
          </el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            <strong>已入库总件数:  {{scgxtabs.gatheredAmount}}</strong><br>
            <strong>已入库总成本:  {{scgxtabs.shurusum}}</strong><br>
            <strong>登计时间:  {{currentTime}}</strong>
          </div></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qx">取 消</el-button>
        <el-button type="primary" @click="tjsh">通过</el-button>
        <el-button type="primary" >驳回</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Warehousingaudit",
    data() {
      return {
        tableData: [],
        productFrom:{},
        options:[],
        scgxtabs:[],
        scgxtableData:[],
        scgData:[],
        value:"",
        pageno: 1,
        scFrom:{},
        applyId:"",
        pagesize: 5,
        total: 0,
        firstKindId:"",
        firstKindName:"",
        designer:"hh",
        jhwinshow:false,
        name:"",
        currentTime:new Date(),
        productName: "",
        remark: "",
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
        registerTime: '',
      }
    },
    methods: {
      getdata() {   //获取数据
        var _this = this;
        this.$axios.post("/sGather/queryscheduled.action").then(function (response) {
          _this.tableData = response.data;
        }).catch();
      },
      qx(){
        this.jhwinshow = false;
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
        this.$refs[name].resetFields()
        this.dialogVisible = false;
      },
      shsjd(row){
        var _this = this;
        this.jhwinshow=true;
        var params = new URLSearchParams();
        params.append("gatherId", row.gatherId);
        this.$axios.post("/sGather/querysbySGather.action",params).then(function (response) {
          _this.scgData = response.data[0];

        }).catch();
        var paramss = new URLSearchParams();
        paramss.append("gatherId", row.gatherId);
        this.$axios.post("/sGather/querysbySGathers.action",paramss).then(function (response) {
          _this.scgxtableData = response.data;
          _this.scgxtabs = response.data[0];
        }).catch();


      },
      tjsh(){
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", _this.scgData.id);
        this.$axios.post("/sGather/Auditofwarehousingaccount.action",params).then(function (response) {
          if(response.data==true){
            _this.$message.success({
              message: '恭喜你,审核成功',
              type: 'success'
            });
            _this.jhwinshow=false;
            _this.getdata();
          }else {
            _this.$message({
              message: '审核失败',
              type: 'warning'
            });
          }
        }).catch();
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
