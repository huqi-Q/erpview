<template>
  <!--产品工序设计审核-->
  <div>
    <br>
    <!--  条件查询-->
    <el-form v-model="productFrom" ref="productFrom"  :inline="true">
      <el-form-item label="请选择产品编号">
        <el-input placeholder="请选择产品编号" clearable v-model="productName"></el-input>
      </el-form-item>
      <el-form-item label="请选择关键词">
        <el-input placeholder="请选择关键词" clearable v-model="remark"></el-input>
      </el-form-item>
      <el-form-item label="请输入审核时间">
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
    <br>
    <!--表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="applyId"
        label="计划单编号"
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
        prop="productDescribe"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        label="审核时间">
      </el-table-column>
      <el-table-column
        label="生产派工单">
        <template slot-scope="scope">
          <a href="#" @click.prevent='shcpgd(scope.row)'>生产派工单</a>
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

    <el-dialog width="80%" title="生产派工单" :visible="zdwinshow">

      <el-form  :modal="scFrom">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <!--              <strong style="margin-right: 220px">产  品  名  称  :  {{scFrom.productName}}</strong>-->
              <!--              <br>-->
              <!--              <br>-->
              <strong >工单制定人：</strong>
              <input v-model="designer" class="xhx" style="width:200px"></input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong style="margin-right: 220px">产  品  名  称  :  {{scFrom.productName}}</strong>
              <br>
              <br>
              <strong style="margin-right: 250px">数量:{{scFrom.amount}}</strong>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong style="margin-right:120px">产  品   编 号  :  {{scFrom.productId}}</strong>
            </div>
          </el-col>
        </el-row>
        <br>
        <!--生产工序-->
        <div>
          <el-table
            :data="scgxtableData"
            stripe
            border
            style="width: 100%">
            <el-table-column
              prop="id"
              v-if="false"
              label="工序id">
            </el-table-column>
            <el-table-column
              prop="parentId"
              v-if="false"
              label="工序id">
            </el-table-column>
            <el-table-column
              prop="detailsNumber"
              v-if="false"
              label="工序id">
            </el-table-column>
            <el-table-column
              prop="procedureId"
              label="工序编号">
            </el-table-column>
            <el-table-column
              prop="procedureName"
              label="工序名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="procedureDescribe"
              label="工序描述">
            </el-table-column>
            <el-table-column
              prop="labourHourAmount"
              label="工时数(小时)">
            </el-table-column>
            <el-table-column
              prop="costPrice"
              label="单位工时成本（元）">
            </el-table-column>
            <el-table-column
              prop="subtotal"
              label="工时成本小计（元）">
            </el-table-column>
            <el-table-column
              label="查看物料">
              <template slot-scope="scope">
                <a href="#" @click.prevent='tjgx(scope.row)'>查看物料</a>
              </template>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qx">取 消</el-button>
        <el-button type="primary" @click="scgx">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="80%" title="物料列表" :visible="gxwinshow">
      <el-card style="width:1200px;margin-left:150px" class="box-card">
        <div>
          <el-header><h3>工序物料单</h3></el-header>
          <el-main>
            <el-form  :modal="scFrom">
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <strong style="margin-right: 220px">设 计 单 编 号  :{{sjId}} </strong>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                    <strong style="margin-right: 220px"> 工序名称:{{tname}} </strong>
                    <el-button @click="qx1">返回</el-button>
                  </div>
                </el-col>
              </el-row>


              <br>
              <!--产品-->
              <div>
                <el-table
                  :data="wlData"
                  stripe
                  border
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    label="点选"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="productName"
                    label="产品名称"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="productId"
                    label="产品编号">
                  </el-table-column>
                  <el-table-column
                    prop="register"
                    label="描述">
                  </el-table-column>
                  <el-table-column
                    prop="amount"
                    label="本工序数量">
                  </el-table-column>
                  <el-table-column
                    prop="amountUnit"
                    label="单位">
                  </el-table-column>
                  <el-table-column
                    prop="costPrice"
                    label="单价（元）">
                  </el-table-column>
                  <el-table-column
                    prop="subtotal"
                    label="小计(元)">
                  </el-table-column>
                </el-table>
              </div>
              <br>
            </el-form>

          </el-main>
        </div>
      </el-card>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "DevelopDispatch" ,
    data() {
      return {
        tableData: [],
        applyId:"",
        productFrom:{},
        options:[],
        scgxtableData:[],
        value:"",
        gxwinshow:false,
        scFrom:{},
        designer:"hh",
        currentTime:new Date(),
        zdwinshow:false,
        pageno: 1,
        pagesize: 5,
        sjId:"",
        wlData:[],
        total: 1,
        firstKindId:"",
        firstKindName:"",
        tname:"",
        name:"",
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
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);

        // params.append("name", this.name);
        // params.append("productName", this.productName);


        this.$axios.post("/mApply/queryAll", params).then(function (response) {
          _this.tableData = response.data;
          // _this.total = response.data.total;
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
        this.$refs[name].resetFields()
        this.dialogVisible = false;
      },
      shcpgd(row){
        this.scFrom.productName=row.productName;
        this.scFrom.productId=row.productId;
        this.scFrom.amount=row.amount;
        this.applyId=row.applyId;

        var _this = this;
        var params = new URLSearchParams();
        params.append("productId", row.productId);

        this.$axios.post("/mDesignProcedure/queryById", params).then(function (response) {

          _this.scgxtableData=response.data;
          if(_this.scgxtableData.length>0){
            _this.zdwinshow=true;
          }else {
            _this.$confirm('对不起，该产品的工序设计或工序物料设计尚未完成，不能制定生产派工单', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {}).catch(() => {});
          }

        }).catch();

      },
      qx(){
        this.zdwinshow=false;
      },qx1(){
        this.gxwinshow=false;
      },
      scgx(){

        var _this = this;
        var arr = this.scgxtableData;
        var newArr = [];
        arr.forEach(function(item, index){
          console.log(item);
          var dx = {};
          dx.productId=_this.scFrom.productId

          dx.id=_this.scFrom.id
          dx.id1=item.id
          dx.productName=_this.scFrom.productName
          dx.productDescribe=item.productDescribe
          dx.amount=_this.scFrom.amount
          dx.procedureId=item.procedureId
          dx.detailsNumber=item.detailsNumber
          dx.procedureName=item.procedureName
          dx.labourHourAmount=item.labourHourAmount
          dx.subtotal=item.subtotal
          dx.costPrice=item.costPrice
          dx.applyId=_this.applyId;
          newArr.push(dx)
        })
        this.$axios.post("/mManufacture/addfacture",JSON.stringify(newArr)
          ,{headers:{"Content-Type":"application/json"}}
        ).then(function (response) {
          if(response.data==true){
            _this.$message({
              type: 'success',
              message: '制定成功!'
            });
            _this.zdwinshow=false;
            _this.gxwinshow=false;
            _this.getdata();
          }else {
            _this.$message({
              type: 'warning',
              message: '已取消制定'
            });
          }
        }).catch();
      },
      tjgx(row){
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", row.id);
        this.tname=row.procedureName;

        this.$axios.post("/mDesignProcedureModule/selectByPid", params).then(function (response) {
          _this.wlData = response.data;
          // _this.total = response.data.total;
        }).catch();

        var params1 = new URLSearchParams();
        params1.append("id",  row.parentId);
        this.$axios.post("/mDesignProcedure/selectById", params1).then(function (response) {
          _this.sjId=response.data.designId;
          // _this.total = response.data.total;
        }).catch();

        this.gxwinshow=true;

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
