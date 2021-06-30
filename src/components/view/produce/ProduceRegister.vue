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
        prop="id"
        label="派工单编号">
      </el-table-column>
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
      <el-table-column label="登记">
        <template slot-scope="scope">
          <a href="#" @click.prevent='openeditwin(scope.row.id)'>登记</a>
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
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button @click="jiaojiesltj" >提交</el-button>
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
          <el-table-column prop="id"  label="工序名称" ></el-table-column>

          <el-table-column prop="labourHourAmount" label="设计工时数" ></el-table-column>

          <el-table-column prop="realLabourHourAmount" label="实际工时数" ></el-table-column>

          <el-table-column prop="subtotal" label="设计工时成本" ></el-table-column>

          <el-table-column prop="realSubtotal" label="实际工时成本" ></el-table-column>

          <el-table-column prop="moduleSubtotal" label="设计物料成本" ></el-table-column>

          <el-table-column prop="realModuleSubtotal" label="实际物料成本"></el-table-column>


          <el-table-column  label="工序登记">
            <template slot-scope="scope">
              <span v-if="scope.row.procedureFinishTag =='G004-0'" style="color:lawngreen">
                        <a href="#" @click.prevent='openChouti(scope.row)'>登记</a>
                      </span>
              <span v-else-if="scope.row.procedureFinishTag == 'G004-3'" style="color:black">
                          完成
                      </span>
              <span v-else style="color:orange">
                          等待审核
                      </span>
            </template>
          </el-table-column>
          <el-table-column  label="工序交接" >
            <template slot-scope="scope">
                       <span v-if="scope.row.procedureTransferTag == 'G005-0'&&scope.row.procedureFinishTag =='G004-3'" style="color:black">
                         <a href="#" @click.prevent='openJiaojieChouti(scope.row)'>交接登记</a>
                      </span>
              <span v-else-if="scope.row.procedureTransferTag == 'G005-1'" style="color:orange">
                          等待审核
                      </span>
              <span v-else-if="scope.row.procedureTransferTag == 'G005-2'" style="color:black">
                          完成
                      </span>
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
        <el-button @click="motaiTijiao" >提交</el-button>
      </div>

    </el-dialog>

    <!--查询所以工序的抽屉-->
      <el-dialog width="80%" title="" :visible="table">
      <el-form :inline="true"  :modal="gongxu">
        <el-form-item label="工序名称:" style="width: 20%">
          <span style="color: midnightblue">{{gongxu.procedureName}}</span>
        </el-form-item>
        <el-form-item label="负责人:" style="width: 30%" >
          <el-input class="xhx"  v-model="shr"></el-input>
        </el-form-item>
        <el-form-item style="width: 20%">
          <el-button  @click="table = false">取 消</el-button>
          <el-button @click="motaiTijiao">确定</el-button>
        </el-form-item>
        <br>
        <el-form-item label="设计工时数:" style="width: 20%" >
          <span style="color: midnightblue">{{gongxu.labourHourAmount}}</span>
        </el-form-item>
        <el-form-item label="实际工时数:" style="width: 30%" >
          <el-input class="xhx"   v-model="gss"></el-input>
        </el-form-item>
        <el-form-item style="width:20%">
          <el-popover
            placement="bottom"
            width="20%"
            v-model="visible">


          </el-popover>
        </el-form-item>


        <el-table style="margin:auto;width: 70%"  border :data="gridData">
          <el-table-column property="detailsNumber"   label="序号"></el-table-column>
          <el-table-column property="productName" label="物料名称"></el-table-column>
          <el-table-column property="productId" label="物料编号"></el-table-column>
          <el-table-column property="amount" label="设计数量"></el-table-column>
          <el-table-column property="realAmount" label="补充数量"></el-table-column>
          <el-table-column property="realAmount" label="已使用数量"></el-table-column>
          <el-table-column label="本次数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sl"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "InternalProductionAdd",
    data(){
      return  {
        chafrom:{//查询表单
          value: '',//选中的菜单值
          tjname:"",//产品名称
          options:[],//三级联动菜单
          registerTime:"",//时间
        },
        tableData: [],//表格数据
        pageno: 1,//页号
        pagesize: 5,//页大小
        total: 1,//总数据量
        gss:"",
        shr:"",
        id:'',//保存id
        editform:{},//工序数据
        gongxu:{},//打开抽屉保存当前工序
        editwinshow: false,//添加的模态框
        table: false,//抽屉
        gridData: [],//所有物料集合
        jiaojieSl:'',//交接数量
        innerVisible:false,//交接合格输入框
        visible:false,
        gxtable:[]
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
        this.$axios.post("/mManufacture/selectByzt2", params).then(function (response) {
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
        this.id=id;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", id);
        this.$axios.post("mManufacture/SelectId", params).then(function (response) {
          _this.editform = response.data;
          _this.gxtable= _this.editform.procedureList;
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
      motaiTijiao(leix){//模态框 登记提交按钮
        var _this=this;
        var arr = this.gridData;
        var newArr = [];
        console.log(arr.length);
        if(arr.length<=0){
          console.log(arr.length);
            var dx = {};
            dx.parentId=_this.id
            dx.procedureId=_this.gongxu.procedureId
            dx.detailsNumber=_this.gongxu.id
            dx.procedureName=_this.gongxu.procedureName
            dx.labourHourAmount=_this.gss
            dx.costPrice=_this.gongxu.subtotal/_this.gongxu.labourHourAmount
            dx.subtotal=_this.gongxu.subtotal
            dx.procedureResponsiblePerson=_this.shr
            console.log(arr.length);
            newArr.push(dx)
        }else {
          arr.forEach(function (item, index) {
            var dx = {};
            dx.parentId = _this.id
            dx.procedureId = _this.gongxu.procedureId
            dx.detailsNumber = _this.gongxu.id
            dx.procedureName = _this.gongxu.procedureName
            dx.labourHourAmount = _this.gss
            dx.costPrice = _this.gongxu.subtotal / _this.gongxu.labourHourAmount
            dx.subtotal = _this.gongxu.subtotal
            dx.procedureResponsiblePerson = _this.shr
            dx.detailsNumber1 = item.detailsNumber;
            dx.productId = item.productId;
            dx.productName = item.productName;
            dx.amount = item.sl
            dx.costPrice1 = item.costPrice
            dx.subtotal1 = item.subtotal1
            newArr.push(dx)
          })
        }
        console.log(newArr);

        this.$axios.post("mProcedureModule/Add",JSON.stringify(newArr),
          {
            headers: {"Content-Type": "application/json"}
          }).then(function (response) {
          if (response.data == true){
            _this.$notify({
              title: '成功',
              message: '工序操作成功,请去审核',
              type: 'success'
            });
          } else {
            _this.$notify({
              title: '失败',
              message: '操作失败',
              type: 'danger'
            });
          }
          _this.editwinshow=false;
          _this.visible=false;
          _this.table=false;
          _this.pageno=1;
          _this.getdata();
        }).catch();

      },

      openJiaojieChouti(row){//交接提交 输入合格数量
        this.innerVisible=true;
        this.gongxu=row
      },
      jiaojiesltj(){//交接提交
        if (this.editform.amount<this.jiaojieSl){
          this.$message.error("你确定合格数量大于实际数量");
          return false;
        }
        if(this.gongxu.procedureId==this.gxtable[this.gxtable.length-1].procedureId){
          var _this = this;
          var params = new URLSearchParams();
          params.append("id",this.gongxu.id);
          params.append("shuliang",this.jiaojieSl);
          this.$axios.post("mProcedureModule/JiaojieAdd1", params).then(function (response) {
            if (response.data == true) {
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
          })
        }
        var _this = this;
        var params = new URLSearchParams();
        params.append("id",this.gongxu.id);
        params.append("shuliang",this.jiaojieSl);
        this.$axios.post("mProcedureModule/JiaojieAdd", params).then(function (response) {
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
      // this.getcaidan();
      this.getdata();
    },
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
