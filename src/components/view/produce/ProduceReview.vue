<template>
  <div>
    <!-- 查询条件 -->
    <el-form :inline="true" :model="chafrom" class="demo-form-inline" size="mini">
      <el-form-item label="菜单">
        <el-cascader  v-model="chafrom.value" :options="chafrom.options"  :props="{checkStrictly: true }" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="chafrom.registerTime"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00','08:00:00']"
          value-format=" yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="字段">
        <el-input
          placeholder="请输入查询内容"
          v-model="chafrom.tjname"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="manufactureId"
        label="派工单编号">
      </el-table-column>
      <el-table-column
        prop="productId"
        label="产品编号">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="productDescribe"
        label="产品描述">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="投产数量">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间">
      </el-table-column>
      <el-table-column label="审核">
        <template slot-scope="scope">
          <a href="#" @click.prevent='openeditwin(scope.row.id)'>审核</a>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageno"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 查询模态框 -->
    <el-dialog  title="生产派工单" width="70%"  :visible="editwinshow">
      <el-dialog
        width="30%"
        title="合格数量"
        :visible.sync="innerVisible"
        append-to-body>
        <el-input placeholder="请输合格数量" v-model="jiaojieSl" clearable></el-input>

        <div slot="footer" class="dialog-footer">
          <el-button   @click="innerVisible = false" size="medium" round>取 消</el-button>
          <el-button  @click="jiaojieshenghe()" size="medium" round>审核通过</el-button>
        </div>
      </el-dialog>


      <el-form :inline="true"  :modal="editform">
        <el-form-item label="设计单编号:" style="width:35%" >
          <span style="color: midnightblue">{{editform.productId}}</span>
        </el-form-item>
        <el-form-item label="产品名称:" style="width:35%"  >
          <span style="color: midnightblue">{{editform.productName}}</span>
        </el-form-item>
        <el-form-item label="数量:" style="width:25%">
          <span style="color: midnightblue">{{editform.amount}}</span>
        </el-form-item>
        <br>
        <el-form-item label=" 派工单编号: " style="width:35%">
          <span style="color: midnightblue" >{{editform.manufactureId}}</span>
        </el-form-item>
        <el-form-item label="登记人:" style="width:35%">
          <span style="color: midnightblue">{{editform.register}}</span>
        </el-form-item>
        <el-form-item label="审核人:" style="width:25%">
          <span style="color: midnightblue">{{editform.checker}}</span>
        </el-form-item>
        <br>
        <el-form-item label=" 设计物料总成本:">
          <span style="color:green" >{{editform.moduleCostPriceSum}}</span>
        </el-form-item>
        <el-form-item label="实际物料总成本:">
          <span style="color:orange">{{editform.realModuleCostPriceSum}}</span>
        </el-form-item>
        <el-form-item label="设计工时总成本:">
          <span style="color:green">{{editform.labourCostPriceSum}}</span>
        </el-form-item>
        <el-form-item label="实际工时总成本:" >
          <span style="color:orange">{{editform.realLabourCostPriceSum}}</span>
        </el-form-item>
        <br>
        <!--表格-->
        <el-table  ref="multipleSelection" :data="editform.procedureList" stripe  border style="width: 100%">

          <el-table-column prop="procedureName"  label="工序名称" ></el-table-column>

          <el-table-column prop="labourHourAmount" label="设计工时数" ></el-table-column>

          <el-table-column prop="realLabourHourAmount" label="实际工时数" ></el-table-column>

          <el-table-column prop="subtotal" label="设计工时成本" ></el-table-column>

          <el-table-column prop="realSubtotal" label="实际工时成本" ></el-table-column>

          <el-table-column prop="moduleSubtotal" label="设计物料成本" ></el-table-column>

          <el-table-column prop="realModuleSubtotal" label="实际物料成本"></el-table-column>


          <el-table-column  label="工序复核">
            <template slot-scope="scope">
              <span v-if="scope.row.procedureFinishTag=='G004-1'" style="color: orange">
                <a href="#" @click.prevent='openChouti(scope.row)'>审核</a>
              </span>
              <span v-else-if="scope.row.procedureFinishTag=='G004-3'"  style="color: green" >已完成</span>
            </template>
          </el-table-column>
          <el-table-column  label="工序交接复核">
            <template slot-scope="scope">
              <span v-if="scope.row.procedureTransferTag=='G005-1'" style="color:orange">
                <a href="#" @click.prevent='openJiaojieChouti(scope.row)'>交接审核</a>
              </span>
              <span v-else-if="scope.row.procedureTransferTag=='G005-2'" style="color: green">交接完成</span>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-form-item label="登记时间:" style="width:35%">
          <span style="color: midnightblue">{{editform.registerTime}}</span>
        </el-form-item>
        <el-form-item label="审核时间:" style="width:35%">
          <span style="color: midnightblue">{{editform.checkTime}}</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editwinshow = false">取 消</el-button>
      </div>

    </el-dialog>

    <!--查询所以工序的抽屉-->
    <el-dialog width="80%" title="" :visible="table">
      <el-form :inline="true"  :modal="gongxu">
        <el-form-item label="工序名称:" style="width: 20%">
          <span style="color: midnightblue">{{gongxu.procedureName}}</span>
        </el-form-item>
        <el-form-item label="设计工时数:" style="width: 20%" >
          <span style="color: midnightblue">设计:{{gongxu.labourHourAmount}}</span>
          <span style="color: midnightblue">实际:{{gongxu.realLabourHourAmount}}</span>
        </el-form-item>
        <el-form-item label="实际工时数:" style="width: 30%" >
          <span  v-model="gongxu.gss"></span>
        </el-form-item>
        <br>
        <el-form-item label="审核人:" style="width: 20%" >
          <el-input  v-model="shr"></el-input>
        </el-form-item>
        <el-form-item  style="width: 15%" >
          <el-button  @click="table = false">取 消</el-button>
        </el-form-item>
        <el-form-item style="width:15%">
          <el-button type="success"  @click="ShengHeYes()" >审核通过</el-button>
        </el-form-item>


        <el-table style="margin:auto;width: 70%"  border :data="gridData">
          <el-table-column property="detailsNumber"   label="序号"></el-table-column>
          <el-table-column property="productName" label="物料名称"></el-table-column>
          <el-table-column property="productId" label="物料编号"></el-table-column>
          <el-table-column property="amount" label="设计数量"></el-table-column>
          <el-table-column property="realAmount" label="补充数量"></el-table-column>
          <el-table-column property="realAmount" label="已使用数量"></el-table-column>
        </el-table>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "ProduceReview",
    data() {
      return {
        chafrom: {//查询表单
          value: '',//选中的菜单值
          tjname: "",//产品名称
          options: [],//三级联动菜单
          registerTime: "",//时间
        },
        tableData: [],//表格数据
        pageno: 1,//页号
        pagesize: 5,//页大小
        total: 1,//总数据量
        editform: {},//工序数据
        gongxu: {},//打开抽屉保存当前工序
        editwinshow: false,//添加的模态框
        table: false,//抽屉
        gridData: [],//所有物料集合
        jiaojieSl:'',//交接数量
        shr:"",
        innerVisible:false,//交接合格输入框
      };
    },
    methods: {
      onSubmit() {//查询
        this.getdata();
      },
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);//页号
        params.append("pagesize", this.pagesize);//页大小
        // 请求地址
        this.$axios.post("mManufacture/selectByzt3", params).then(function (response) {
          _this.tableData = response.data;
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

      openeditwin(id) {  //打开编辑页面
        this.editwinshow = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", id);
        this.$axios.post("mManufacture/SelectId", params).then(function (response) {
          _this.editform = response.data;
        }).catch();
      },

      openChouti(row){ //打开抽屉
        this.gongxu=row
        this.table = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", row.id);
        this.$axios.post("mProcedureModule/SelectByParentId", params).then(function (response) {
          _this.gridData = response.data;
        }).catch();
      },
      ShengHeYes(){
        this.motaiTijiao();
      },

      motaiTijiao(){//模态框 登记 提交按钮
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", this.gongxu.id);
        this.$axios.post("mProcedureModule/Shenghe", params).then(function (response) {
          if (response.data == true){
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
          } else {
            _this.$notify({
              title: '失败',
              message: '操作失败',
              type: 'danger'
            });
          }
          _this.pageno = 1;
          _this.editwinshow=false;
          _this.table=false;
          _this.getdata();
        }).catch();

      },

      openJiaojieChouti(row){//交接提交 确认合格数量
        this.innerVisible=true;
        this.jiaojieSl=row.realAmount;
        this.gongxu=row
      },

      jiaojieshenghe(){

        this.editwinshow = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id",this.gongxu.id);
        this.$axios.post("mProcedureModule/ShengheJiaojie", params).then(function (response) {
          if (response.data == true){
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
          } else {
            _this.$notify({
              title: '失败',
              message: '操作失败',
              type: 'danger'
            });
          }
          _this.pageno = 1;
          _this.editwinshow=false;
          _this.table=false;
          _this.innerVisible=false;
          //刷新表格数据
          _this.getdata();
        }).catch();
      },

      handleClose(){
        this.table=false;

      },
    },
    created(){
      this.getdata();
    },
  }
</script>

<style scoped>

</style>
