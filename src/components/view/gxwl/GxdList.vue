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
        label="制定设计单">
        <template slot-scope="scope">
          <a href="#" @click.prevent='zd(scope.row.id)'>制定设计单</a>
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
    <el-dialog width="80%" title="工序物料设计单" :before-close="biubiu" :visible="zdwinshow">

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
              prop="register"
              label="登记人" v-if="false">
            </el-table-column>
            <el-table-column
              prop="moduleSubtotal"
              label="物料成本小计">
            </el-table-column>
            <el-table-column
              prop="designModuleTag"
              label="设计">
              <template slot-scope="scope">
                    <span v-if="scope.row.designModuleTag =='D002-0'"
                          style="color:lawngreen"
                    ><a href="#" @click.prevent='wf1(scope.row)'>设计</a>
                    </span>
                <span
                  v-else-if="scope.row.designModuleTag == 'D002-1'"
                  style="color:black"
                ><a href="#" @click.prevent='wf2(scope.row)'>重新设计</a>
                </span>
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
        <el-button @click="zdwinshow = false">取 消</el-button>
        <el-button type="primary" @click="scgx">确 定</el-button>
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
              <el-input type="number"  placeholder="请输入本工序数量" v-model="scope.row.sl" clearable  oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>

              <!--<input type="text" v-model="sl"></input>-->
            </template>
          </el-table-column>
          <el-table-column
            label="小计">
            <template slot-scope="scope">
              <span  v-if="scope.row.sl==null"></span>
             {{scope.row.sl*scope.row.costPrice}}
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
        <el-button style="width: 100px" @click="gxwinshow2 = false">  取   消  </el-button>
        <el-button type="primary" @click="qqsb">重新设计</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
  export default {
    name: "GxdList",
    data() {
      return {
        tableData: [],
        scgxtableData:[],
        currentTime:new Date(),
        zdwinshow: false,
        gxwinshow:false,
        gxwinshow2:false,
        scFrom:{},
        vcs:"",
        sl:"",
        djr:"",
        register:"",
        manufactureData:[],
        manufactureData1:[],
        options:[],
        value:"",
        pageno: 1,
        id:"",
        pagesize: 5,
        pid:"",
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
      biubiu(done) { this.$confirm('确认关闭？') .then(_ => { this.zdwinshow=false; }) .catch(_ => {}); },
      biubiu1(done) { this.$confirm('确认关闭？') .then(_ => { this.gxwinshow=false; }) .catch(_ => {}); },
      biubiu2(done) { this.$confirm('确认关闭？') .then(_ => { this.gxwinshow2=false; }) .catch(_ => {}); },
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);
        //产品档案
        this.$axios.post("/mDesignProcedure/loadAllMDesignProcedure.action", params).then(function (response) {
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
      qqsb(){
        var _this=this;
        this.$confirm('重新设计将首先清除原有本工序物料的设计，您确认进行重新设计吗？', '提示', {
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
            _this.zd(_this.id);
          }).catch();
          _this.gxwinshow2 = false;


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设计'
          });
        });

      },
      momo(){
        var _this=this;
        var arr = this.manufactureData;
        let newArr = [];
        arr.map((item, index) => {
          console.log(this.manufactureData[index].sl);
          newArr.push(
            Object.assign({}, item, {
              "productId":item.productId,
              "productName":item.productName,
              "productDescribe":item.productDescribe,
              "amount":_this.manufactureData[index].sl,
              "amountUnit":item.amountUnit,
              "costPrice":item.costPrice,
              "detailsNumber":item.id,
              "parentId":_this.pid,
              "productId1":_this.scFrom.productId
            })
          )
        })

        if(this.manufactureData.sl==""){
          this.$message({
            message: '工序数量不能为空！',
            type: 'warning'
          });
        }else {
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

        this.vcs=row.procedureName;
        this.pid=row.id;
        this.djr=row.register;
        var params = new URLSearchParams();
        params.append("id",_this.scFrom.productId);
        this.$axios.post("/mDesignProcedure/loadAllDModuleDetailsById.action",params).then(function (response) {
          _this.manufactureData = response.data;
          if(_this.manufactureData.length>0){
            _this.gxwinshow = true;
          }else {
            _this.$confirm('物料组成设计尚未完成，不能进行工序物料设计', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {}).catch(() => {});
          }
        }).catch();
      },
      wf2(row){
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
     gglx (row, column, rowIndex, columnIndex) {
        if(row.column.label === "本工序数量"){
          return 'background-color: blanchedalmond'  // 修改的样式
        } else{
          return ''
        }
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
        this.id=id;
        var params = new URLSearchParams();
        params.append("id",id);
        this.$axios.post("/mDesignProcedure/loadMDesignProcedureById.action",params).then(function (response) {
          _this.scFrom=response.data;
        }).catch();
        this.$axios.post("/mDesignProcedure/loadAllMDesignProcedureDetailsById.action",params).then(function (response) {
          _this.scgxtableData=response.data;
        }).catch();
      },
      tjgx(row){

      },
      scgx(){
        var _this = this;

        var params = new URLSearchParams();
        params.append("id",this.scFrom.id);

        var arr = this.scgxtableData;

        arr.map((item, index) => {
          if (item.designModuleTag!="D002-1"){
            this.$message({
              message: '还有工序未设计',
              type: 'warning'
            });
            arr.length=0;
          }
          if(index==arr.length-1){
            this.$axios.post("/mDesignProcedure/updateMDesignProcedureById.action",params).then(function (response) {
              _this.$message({
                type: 'success',
                message: '设计成功!'
              });
              _this.zdwinshow=false;
              _this.getdata();
            }).catch();

          }

        })
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
