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
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="manufactureId" label="派工单编号" width="200px"></el-table-column>
      <el-table-column prop="productId" label="产品编号" width="200px"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="amount" label="投产数量"></el-table-column>
      <el-table-column prop="testedAmount" label="合格数量"></el-table-column>
      <el-table-column label="登记审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.checkTag=='S001-0'" style="color:orange">等待审核</span>
          <span v-else-if="scope.row.checkTag=='S001-1'" style="color:green">审核通过</span>
          <span v-else="" style="color:red">审核未通过</span>
        </template>
      </el-table-column>
      <el-table-column label="交接审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.manufactureProcedureTag=='S002-0'" style="color:red">待登记</span>
          <span v-else-if="scope.row.manufactureProcedureTag=='S002-1'" style="color:orange">未审核</span>
          <span v-else="" style="color:green">已完工</span>
        </template>
      </el-table-column>
<!--      <el-table-column  label="审核">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="info" icon="el-icon-view" @click="openeditwin(scope.row.id)" plain>详细</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
    <el-dialog  title="生产派工单" width="70%"  :visible.sync="editwinshow">

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

          <el-table-column prop="procedureName"  label="工序名称" >
            <template slot-scope="scope">
              <el-button @click="openChouti(scope.row)" type="text">{{scope.row.procedureName}}</el-button>
            </template>
          </el-table-column>

          <el-table-column prop="labourHourAmount" label="设计工时数" ></el-table-column>

          <el-table-column prop="realLabourHourAmount" label="实际工时数" ></el-table-column>

          <el-table-column prop="subtotal" label="设计工时成本" ></el-table-column>

          <el-table-column prop="realSubtotal" label="实际工时成本" ></el-table-column>

          <el-table-column prop="moduleSubtotal" label="设计物料成本" ></el-table-column>

          <el-table-column prop="procedureTransferTag" label="实际物料成本"></el-table-column>


          <el-table-column  label="工序登记">
            <template slot-scope="scope">
              <span v-if="scope.row.procedureFinishTag==0" style="color:red">待登记</span>
              <span v-else-if="scope.row.procedureFinishTag==1" style="color:orange">登记完成待审核</span>
              <span v-else-if="scope.row.procedureFinishTag==2" style="color:orange">未完成登记待审核</span>
              <span v-else="" style="color:green">已审核</span>
            </template>
          </el-table-column>
          <el-table-column  label="工序交接">
            <template v-if="scope.row.procedureFinishTag==3" slot-scope="scope">
              <span v-if="scope.row.procedureTransferTag==0"  style="color:red">待交接</span>
              <span v-else-if="scope.row.procedureTransferTag==1"    style="color: orange" >待审核</span>
              <span v-else="" style="color:green">交接完成</span>
            </template>
            <template v-else="" slot-scope="scope">
              <span style="color:orange">待登记及审核</span>
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
        <el-button  type="primary" icon="el-icon-s-promotion" @click="motaiTijiao" round>提交</el-button>
      </div>

    </el-dialog>

    <!--查询所以工序的抽屉-->
    <el-drawer title="生产登记单!" :before-close="handleClose" :visible.sync="table"
               direction="ttb"
               custom-class="demo-drawer"
               size="60%">
      <el-form :inline="true"  :modal="gongxu">
        <el-form-item label="工序名称:" style="width: 20%">
          <span style="color: midnightblue">{{gongxu.procedureName}}</span>
        </el-form-item>
        <el-form-item label="设计工时数:" style="width: 20%" >
          <span style="color: midnightblue">{{gongxu.labourHourAmount}}</span>
        </el-form-item>
        <el-form-item label="实际工时数:" style="width: 30%" >
          <span  style="color: midnightblue">{{gongxu.realLabourHourAmount}}</span>
        </el-form-item>


        <el-table style="margin:auto;width: 70%"  border :data="gridData">
          <el-table-column property="detailsNumber"   label="序号"></el-table-column>
          <el-table-column property="productName" label="物料名称"></el-table-column>
          <el-table-column property="productId" label="物料编号"></el-table-column>
          <el-table-column property="amount" label="设计数量"></el-table-column>
          <el-table-column property="realAmount" label="补充数量"></el-table-column>
        </el-table>
      </el-form>
    </el-drawer>

  </div>
</template>

<script>
  export default {
    name: "ProduceList",
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
        // params.append("tjname", this.chafrom.tjname);//产品名称
        // params.append("firskindname", this.chafrom.value[0]);//I级菜单名称
        // params.append("secondkindname", this.chafrom.value[1]);//II级菜单名称
        // params.append("thirdkindname", this.chafrom.value[2]);//III级菜单名称
        //
        // if (this.chafrom.registerTime != "") {//时间
        //   params.append("starttime", this.chafrom.registerTime[0]);//开始时间()
        //   params.append("overtime", this.chafrom.registerTime[1]);//结束时间()
        // }
        // 请求地址
        this.$axios.post("mManufacture/selectSCAll", params).then(function (response) {
          _this.tableData = response.data.records;
          _this.total = response.data.total;
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
        this.$axios.post("ProcedureModule/SelectByParentId", params).then(function (response) {
          _this.gridData = response.data;
        }).catch();
      },

      motaiTijiao(){//模态框提交按钮
        if (this.gongxu.gss==undefined){

        }
        if (this.gongxu.shr==undefined){

        }
        for (let i = 0; i < this.gridData.length; i++) {
          if(this.gridData[i].realAmount==undefined){
            this.gridData[i].xuyao=0;
          }else {
            this.gridData[i].gss=this.gongxu.gss;
            this.gridData[i].shr=this.gongxu.shr;
          }
        }
        var _this = this;
        this.$axios.post("ProcedureModule/Add", JSON.stringify(this.gridData),
          {
            headers: {"Content-Type": "application/json"}
          }).then(function (response) {
          if (response.data == true) {
            _this.$message({
              message: '登记成功',
              type: 'success'
            });
          } else {
            _this.$message.error('登记错误');
          }
        }).catch();
        this.table = false;
      },

      Tijiao(type){
        this.editwinshow = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id",this.editform.id);
        params.append("checker",this.editform.checker);
        params.append("type",type);
        this.$axios.post("Manufacture/UpdateByid", params).then(function (response) {
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
