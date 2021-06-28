<template>
  <div>
    <!--产品工序设计单-->
    <!--表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="180" v-if="false">
      </el-table-column>
      <el-table-column
        prop="designId"
        label="工序设计单编号"
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
        prop="designer"
        label="设计人">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间">
      </el-table-column>
      <el-table-column
        prop="costPriceSum"
        label="工时总成本">
      </el-table-column>
      <el-table-column
        label="审核">
        <template slot-scope="scope">
          <a href="#" @click.prevent='zd(scope.row.id)'>审核</a>
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
    <el-dialog width="80%" title="工序物料设计单" :before-close="handleClose" :visible="zdwinshow">

      <el-form  :modal="scFrom">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong style="margin-right: 220px">工  序  单  编  号  :  {{scFrom.designId}}</strong>
              <br>
              <br>
              <strong style="margin-right: 220px">产   品   名    称  :  {{scFrom.productName}}</strong>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>设   计   人   :  {{scFrom.designer}}</strong>
              <br>
              <br>
              <strong>产   品   编   号  :  {{scFrom.productId}}</strong>
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
            :cell-style="changeCellStyle"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="序号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="procedureName"
              label="工序名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="procedureId"
              label="工序编号">
            </el-table-column>
            <el-table-column
              prop="procedureDescribe"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="labourHourAmount"
              label="工时数（小时）">
            </el-table-column>
            <el-table-column
              prop="subtotal"
              label="工时成本小计（元）">
            </el-table-column>
            <el-table-column
              prop="moduleSubtotal"
              label="物料成本小计">
            </el-table-column>
            <el-table-column
              prop="register"
              label="登记人" v-if="false">
            </el-table-column>
            <el-table-column
              label="审核">
              <template slot-scope="scope">
                <a href="#" @click.prevent='wf1(scope.row)'>审核</a>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong>工   时   总   成   本   :  {{scFrom.costPriceSum}}</strong>
            <br>
            <strong>设    计   要   求    :  {{scFrom.procedureDescribe}}</strong>
            <br>
            <strong>审    核    人   :  {{scFrom.checker}}</strong>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            <strong>物   料    总   成   本:  {{scFrom.moduleCostPriceSum}}</strong>
            <br>
            <br>
            <strong>审    核    时    间   :  {{scFrom.checkTime}}</strong>
          </div></el-col>
        </el-row>
        <br>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tjgx">不通过</el-button>
        <el-button type="primary" @click="scgx">通 过</el-button>
      </div>
    </el-dialog>

    <!--工序物料设计-->
    <el-dialog width="80%" :title="''+this.vcs+'工序物料设计'" :before-close="biubiu" :visible="gxwinshow">
      <el-form  :modal="scFrom">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong style="margin-right: 220px">设  计  单  编  号  :  {{scFrom.designId}}</strong>
              <br>
              <br>
              <strong style="margin-right: 220px">登      记      人  :  {{this.djr}}</strong>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong style="margin-right: 220px">工   序   名    称  :  {{this.vcs}}</strong>
              <br>
              <br>
              <strong style="margin-right: 220px">登     记     时      间 :  {{this.currentTime}}</strong>
            </div>
          </el-col>
        </el-row>
        <br>

      <!--生产工序物料明细-->
      <div>
        <el-table
          :data="manufactureData"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="物料名称">
          </el-table-column>
          <el-table-column
            prop="productId"
            label="物料编号">
          </el-table-column>
          <el-table-column
            prop="productDescribe"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="amountUnit"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="costPrice"
            label="单价">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="本工序数量">
          </el-table-column>
          <el-table-column
            prop="subtotal"
            label="小计">
          </el-table-column>
        </el-table>
      </div>

      </el-form>

      <div>
        <el-button @click="gxwinshow = false">返回</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "GxdShList",
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
        vcs:"",
        pid:"",
        djr:"",
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
        this.$axios.post("/mDesignProcedure/loadWlysjMDesignProcedure.action", params).then(function (response) {
          _this.tableData = response.data.data;
          _this.total = response.data.count;
          // _this.firstKindName = response.data.records[0].firstKindName;
          // _this.firstKindId = response.data.records[0].firstKindId;
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
      handleClose(done) { this.$confirm('确认关闭？') .then(_ => { this.zdwinshow=false; }) .catch(_ => {}); },
      biubiu(done) { this.$confirm('确认关闭？') .then(_ => { this.gxwinshow=false; }) .catch(_ => {}); },

      wf1(row){
        var _this = this;
        this.gxwinshow = true;
        this.vcs=row.procedureName;
        this.pid=row.id;
        this.djr=row.register;
        var params = new URLSearchParams();
        params.append("id",_this.pid);
        this.$axios.post("/mDesignProcedure/loadGXwlMDesignProcedureModuleById.action",params).then(function (response) {
          _this.manufactureData = response.data;
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
        this.$axios.post("/mDesignProcedure/loadMDesignProcedureById.action",params).then(function (response) {
          _this.scFrom=response.data;
        }).catch();
        var params1 = new URLSearchParams();
        params1.append("id",id);
        this.$axios.post("/mDesignProcedure/loadAllMDesignProcedureDetailsById.action",params1).then(function (response) {
          _this.scgxtableData=response.data;
        }).catch();
      },
      tjgx(){
        var _this = this;
        var params = new URLSearchParams();
        params.append("id",this.scFrom.id);
        this.$axios.post("/mDesignProcedure/updateGXwlMDesignProcedureById1.action",params).then(function (response) {
          _this.$message({
            type: 'success',
            message: _this.scFrom.productName+'工序物料设计审核不通过，请重新设计!'
          });
          _this.zdwinshow=false;
          _this.getdata();
        }).catch();

      },
      scgx(){
        var _this = this;
        var params = new URLSearchParams();
        params.append("id",this.scFrom.id);
        this.$axios.post("/mDesignProcedure/updateGXwlMDesignProcedureById.action",params).then(function (response) {
          _this.$message({
            type: 'success',
            message: _this.scFrom.productName+'工序物料设计审核通过!'
          });
          _this.zdwinshow=false;
          _this.getdata();
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
