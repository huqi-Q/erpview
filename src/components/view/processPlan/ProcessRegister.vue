<template>
  <div>
  <el-card style="width:1200px;margin-left:150px" class="box-card">
    <div>
      <el-header><h3>生产计划单</h3></el-header>
      <el-main>
        <el-form  :modal="scFrom">
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <strong style="margin-right: 220px">生  产  理  由  : 新发生</strong>
                <br>
                <br>
                <strong >登记人:</strong>
                <input value="hh" class="xhx" style="width:300px"></input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <strong>供  货  时  间 :</strong>
                <br>
                <br>
                <strong>登  记  时  间: </strong>
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
              :cell-style="changeCellStyle"
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
                label="数量">
                <template slot-scope="scope">
                  <input class="mbk" v-model="labourHourAmount" type="text"></input>
                </template>
              </el-table-column>
              <el-table-column
                prop="amountUnit"
                label="单位">
              </el-table-column>
              <el-table-column
                label="单价（元）">
                <template slot-scope="scope">
                  <input class="mbk" readonly="readonly" v-model="scope.row.realCostPrice" type="text"></input>
                </template>
              </el-table-column>
              <el-table-column
                label="小计(元)">
                <template slot-scope="scope">
                  {{labourHourAmount*scope.row.realCostPrice}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <br>
          <div style="margin-right:40px">
            <div style="margin: 20px 0;"></div>
              <el-form-item label="备注:">
                <el-input type="textarea" v-model="config" maxlength="300" show-word-limit  placeholder="请输入内容"></el-input>
              </el-form-item>
          </div>
          <br>

          <div>
            <el-button @click="tjgxtb">添加产品</el-button>
            <el-button @click="scgx">删除产品</el-button>
            <el-button type="primary" @click="scgx">确定</el-button>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="qx">取 消</el-button>
          <el-button type="primary" @click="scgx">确 定</el-button>
        </div>
      </el-main>
    </div>
  </el-card>

  <el-dialog width="80%" title="产品列表" :visible="gxwinshow">
    <!--生产工序-->
    <div>
      <el-table
        :data="manufactureData"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="productId"
          label="产品编号">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          width="180">
        </el-table-column>
        <el-table-column
          label="用途类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type =='Y001-1'">商品</span>
            <span v-else-if="scope.row.type == 'Y001-2'">物料</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amountUnit"
          label="单位"
          width="180">
        </el-table-column>
        <el-table-column
          prop="realCostPrice"
          label="单价"
          width="180">
        </el-table-column>
        <el-table-column
          label="生产">
          <template slot-scope="scope">
            <a href="#" @click.prevent='tjgx(scope.row)'>生产</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-button @click="gxwinshow = false">返回</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "ProcessRegister",
      data() {
        return {
          config:"",
          tableData: [],
          scgxtableData:[],
          currentTime:new Date(),
          zdwinshow: false,
          gxwinshow:false,
          scFrom:{},
          labourHourAmount:0,
          subtotal:0,
          amountUnit:"",
          costPrice:0,
          manufactureData:[],
          options:[],
          designer:"hh",
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
          this.$axios.post("/dFile/selectallDFile", params).then(function (response) {
            _this.tableData = response.data.records;
            _this.total = response.data.total;
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
        tjgxtb(){
          var _this = this;
          this.gxwinshow = true;
          this.$axios.post("/dFile/queryByType").then(function (response) {
            _this.manufactureData = response.data.records;
          }).catch();
        },
        qx(){
          this.zdwinshow = false;
          this.scgxtableData=[];
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
          this.$axios.post("/dFile/selectById",params).then(function (response) {
            _this.scFrom=response.data;
          }).catch();
        },
        tjgx(row){
          this.scgxtableData.push(row);
        },
        scgx(){
          var _this = this;
          var arr = this.scgxtableData;
          var newArr = [];

          arr.forEach(function(item, index){
            var dx = {};
            dx.productId=item.productId
            dx.productName=item.productName
            dx.productDescribe=item.productDescribe
            dx.amount=_this.labourHourAmount
            dx.type=item.type
            dx.designer=_this.designer
            newArr.push(dx)
          })

          this.$confirm('确定制定该计划单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post("/mApply/addMApply",JSON.stringify(newArr)
              ,{headers:{"Content-Type":"application/json"}}
            ).then(function (response) {}).catch();
            this.getdata();
            this.$message({
              type: 'success',
              message: '制定成功!'
            });
            this.scgxtableData=[];
            this.zdwinshow = false;
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消制定'
            });
          });




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
    background-color: tran  sparent;
    outline: none;
  }
  .mbk{
    border: none;
    height: 20px;
  }
</style>
