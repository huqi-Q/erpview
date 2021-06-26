<template>
  <div>
    <!--表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="manufactureId"
        label="生产派工单编号"
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
        prop="amount"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间">
      </el-table-column>
      <el-table-column
        label="登记">
        <template slot-scope="scope">
          <a href="#" @click.prevent='shsjd(scope.row)'>登记</a>
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

    <el-dialog width="80%" title="生产派工单" :visible="gxwinshow">
      <el-button style="margin-left:1200px" @click="qx1">返回</el-button>
      <el-card style="width:1200px;margin-left:150px" class="box-card">
        <div>
          <el-main>
            <el-form  :modal="scFrom">
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <strong style="margin-right: 220px">派 工 单 编 号 : {{scFrom.manufactureId}}</strong>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                    <strong style="margin-right: 220px"> 产 品 编 号:{{scFrom.productId}} </strong>
                  </div>
                </el-col>
              </el-row>
              <br>
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <strong style="margin-right:340px">产  品  名  称 : {{scFrom.productName}}</strong>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                    <strong style="margin-right: 310px"> 数 量 :{{scFrom.amount}}.00 </strong>
                  </div>
                </el-col>
              </el-row>


              <br>
              <!--产品-->
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
                    label="审核物料">
                    <template slot-scope="scope">
                      <a href="#" @click.prevent='tjgx(scope.row)'>审核物料</a>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <br>
            </el-form>

            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <strong style="margin-right: 220px">设计工时总成本: {{scFrom.manufactureId}}</strong>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <strong style="margin-right: 220px">设计物料总成本:{{scFrom.productId}} </strong>
                </div>
              </el-col>
            </el-row>
            <br>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <strong style="margin-right:340px">登记人  : {{scFrom.productName}}</strong>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <strong style="margin-right: 310px"> 登记时间 :{{scFrom.amount}}.00 </strong>
                </div>
              </el-col>
            </el-row>
            <br>
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <strong style="margin-right:340px">复核人  : {{scFrom.productName}}</strong>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <strong style="margin-right: 310px"> 复核时间 :{{scFrom.amount}}.00 </strong>
                </div>
              </el-col>
            </el-row>

          </el-main>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "ProduceRegister",
      data() {
        return {
          tableData: [],
          wlData:[],
          productFrom:{},
          scgxtableData:[],
          options:[],
          value:"",
          pageno: 1,
          pagesize: 5,
          total: 0,
          firstKindId:"",
          firstKindName:"",
          name:"",
          scFrom:{},
          productName: "",
          gxwinshow:false,
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
          this.$axios.post("/mManufacture/selectByzt1").then(function (response) {
            _this.tableData = response.data;
            // _this.total = response.data.total;
          }).catch();
        },
        handleSizeChange(val) {  //页size变更
          this.pagesize = val;
          this.pageno = 1;
          this.getdata();
        },
        handleCurrentChange(val){  //页码变更
          this.pageno = val;
          this.getdata();
        },
        searchproduct() {   //条件查询
          this.getdata();
        },
        resetproduct(name) {
          this.$refs[name].resetFields()
          this.dialogVisible = false;
        },
        qx(){
          this.zdwinshow=false;
        },qx1(){
          this.gxwinshow=false;
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
      },
        shsjd(row){

          this.scFrom.productName=row.productName;
          this.scFrom.productId=row.productId;
          this.scFrom.amount=row.amount;
          this.scFrom.manufactureId=row.manufactureId;

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
          this.gxwinshow=true;

        },
      },
      created() {
        this.getdata();
      }
    }
</script>

<style scoped>

</style>
