<template>
  <div>
    <!--  条件查询-->
    <el-form :model="productFrom" ref="productFrom"  :inline="true">
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
      <el-button type="danger" @click="resetproduct()">重置</el-button>
    </el-form>


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
        label="设计单编号"
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
        label="变更">
        <template slot-scope="scope">
          <a href="#" @click.prevent='zd(scope.row.id)'>变更</a>
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
              label="变更">
              <template slot-scope="scope">
                  <a href="#" @click.prevent='wf1(scope.row)' v-text="vvc"></a>
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
        <el-button style="width: 100px" @click="zdwinshow=false">取消</el-button>
        <el-button type="primary" @click="scgx">重新提交</el-button>
      </div>
    </el-dialog>


    <!--工序物料设计-->
    <el-dialog width="80%" :title="''+this.vcs+'工序物料设计'" :before-close="biubiu2" :visible="gxwinshow2">
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
            :data="manufactureData1"
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
        <el-button @click="gxwinshow2 = false">  取   消  </el-button>
        <el-button type="primary" @click="qqsb">变更</el-button>
      </div>
    </el-dialog>


    <!--物料表格-->
    <el-dialog width="80%" :title="'('+scFrom.productName+')产品制造'+this.vcs+'工序物料设计'" :before-close="biubiu1" :visible="gxwinshow">
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
        <!--物料-->
        <div>
          <el-table
            :data="manufactureData"
            stripe
            border
            :cell-style="gglx"
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
              prop="amount"
              label="设计数量">
            </el-table-column>
            <el-table-column
              prop="residualAmount"
              label="可用数量">
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
              label="本工序数量">
              <template slot-scope="scope">
                <input type="text" v-model="sl"></input>
              </template>
            </el-table-column>
            <el-table-column
              label="小计">
              <template slot-scope="scope">
                {{sl*scope.row.costPrice}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div>
        <el-button @click="gxwinshow = false">取消</el-button>
        <el-button type="primary" @click="momo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "GxdBgList",
    data() {
      return {
        tableData: [],
        scgxtableData:[],
        manufactureData:[],
        manufactureData1:[],
        currentTime:new Date(),
        productFrom:{},
        options:[],
        value:"",
        vcs:"",
        pid:"",
        id:"",
        sl:"",
        djr:"",
        vvc:"变更",
        vvx:"重新变更",
        zdwinshow: false,
        gxwinshow:false,
        gxwinshow2:false,
        scFrom:{},
        pageno: 1,
        pagesize: 5,
        total: 0,
        firstKindId:"",
        firstKindName:"",
        name:"",
        productName: "",
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
      biubiu1(done) { this.$confirm('确认关闭？') .then(_ => { this.gxwinshow=false; }) .catch(_ => {}); },
      biubiu2(done) { this.$confirm('确认关闭？') .then(_ => { this.gxwinshow2=false; }) .catch(_ => {}); },
      handleClose(done) { this.$confirm('确认关闭？') .then(_ => { this.zdwinshow=false; }) .catch(_ => {}); },
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);

        // params.append("name", this.name);
        params.append("productName", this.productName);


        this.$axios.post("/mDesignProcedure/queryallProcedureGx1.action", params).then(function (response) {
          _this.tableData = response.data.records;
          _this.total = response.data.total;
          // _this.firstKindName = response.data.records[0].firstKindName;
          // _this.firstKindId = response.data.records[0].firstKindId;
        }).catch();
      },
      handleSizeChange(val) {  //页size变更
        this.pagesize = val;
        this.pageno = 1;
        this.getdata();
      },
      gglx (row, column, rowIndex, columnIndex) {
        if(row.column.label === "本工序数量"){
          return 'background-color: blanchedalmond'  // 修改的样式
        } else{
          return ''
        }
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
      momo(){
        var _this=this;
        var arr = this.manufactureData;
        let newArr = [];
        arr.map((item, index) => {
          newArr.push(
            Object.assign({}, item, {
              "productId":item.productId,
              "productName":item.productName,
              "productDescribe":item.productDescribe,
              "amount":this.sl,
              "amountUnit":item.amountUnit,
              "costPrice":item.costPrice,
              "detailsNumber":item.id,
              "parentId":this.pid,
              "productId1":this.scFrom.productId
            })
          )
        })

        if(this.sl==""){
          this.$message({
            message: '工序数量不能为空！',
            type: 'warning'
          });}else {
          this.$confirm('确定设计工序:  '+this.vcs+' ?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            this.$axios.post("/mDesignProcedure/addMDesignProcedureModule.action",JSON.stringify(newArr)
              ,{headers:{"Content-Type":"application/json"}}
            ).then(function (response) {
              _this.zd(_this.id);
            }).catch();
            this.getdata();

            this.$message({
              type: 'success',
              message: '设计成功!'
            });
            this.gxwinshow = false;
            this.sl="";

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消设计'
            });
          });
        }


      },
      wf1(row){
        var _this = this;
        this.gxwinshow2 = true;
        this.vcs=row.procedureName;
        this.pid=row.id;
        this.djr=row.register;
        var params = new URLSearchParams();
        params.append("id",_this.pid);
        this.$axios.post("/mDesignProcedure/loadGXwlMDesignProcedureModuleById.action",params).then(function (response) {
          _this.manufactureData1 = response.data;
        }).catch();
      },
      wf2(){

      },
      scgx(){
        var _this = this;
        var params = new URLSearchParams();
        params.append("id",this.scFrom.id);
        this.$axios.post("/mDesignProcedure/updateMDesignProcedureById.action",params).then(function (response) {
          _this.$message({
            type: 'success',
            message: '提交成功,请重新审核!'
          });
          _this.zdwinshow=false;
          _this.getdata();
        }).catch();
      },
      qqsb(){
        var _this=this;
        this.$confirm('变更将首先清除原有本工序物料的设计，您确认进行变更吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params2 = new URLSearchParams();
          params2.append("id",_this.id);
          this.$axios.post("/mDesignProcedure/GgLgLs.action",params2).then(function (response) {
          }).catch();

          var params = new URLSearchParams();
          params.append("id",_this.pid);
          this.$axios.post("/mDesignProcedure/GxWlCxSj.action",params).then(function (response) {
            _this.$message({
              type: 'success',
              message: '已清除原有本工序物料的设计,请重新设计!'
            });
          }).catch();
          _this.gxwinshow2 = false;

          this.gxwinshow = true;
          var params9 = new URLSearchParams();
          params9.append("id",_this.scFrom.productId);
          this.$axios.post("/mDesignProcedure/loadAllDModuleDetailsById.action",params9).then(function (response) {
            _this.manufactureData = response.data;
          }).catch();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消变更'
          });
        });
      },
      zd(id){
        this.zdwinshow = true;
        var _this = this;
        this.id=id;
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
      handleCurrentChange(val) {  //页码变更

        this.pageno = val;
        this.getdata();
      },
      searchproduct() {   //条件查询
        this.getdata();
      },
      resetproduct(){
        this.$refs.productFrom.resetFields();
      }
    },
    created() {
      this.getdata();
    }
  }
</script>

<style scoped>

</style>
