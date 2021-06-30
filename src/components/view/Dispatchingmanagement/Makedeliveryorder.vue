<template>
  <div>
<h1>出库</h1>
    <!--  条件查询-->
    <el-form :inline="true">
      <!--<el-form-item label="请选择产品I级分类">-->
      <!--<el-select v-model="value" placeholder="请选择">-->
      <!--<el-option-->
      <!--v-for="item in options"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="请选择产品II级分类">-->
      <!--<el-input placeholder="请输入类型名字" clearable v-model="name"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="请选择产品III级分类">-->
      <!--<el-input placeholder="请输入类型名字" clearable v-model="name"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="请选择产品">
        <el-input placeholder="请输入备注" clearable v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="请选择工序设计单状态">
        <el-input placeholder="请输入备注" clearable v-model="remark"></el-input>
      </el-form-item>
      <!--<el-form-item label="请输入登记时间">-->
      <!--<div class="block">-->
      <!--<el-date-picker-->
      <!--v-model="value2"-->
      <!--type="daterange"-->
      <!--align="right"-->
      <!--unlink-panels-->
      <!--range-separator="至"-->
      <!--start-placeholder="开始日期"-->
      <!--end-placeholder="结束日期"-->
      <!--:shortcuts="shortcuts"-->
      <!--&gt;-->
      <!--</el-date-picker>-->
      <!--</div>-->
      <!--</el-form-item>-->

      <el-button type="success" @click="searchcartype">查询</el-button>
    </el-form>


    <!--表格 -->
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="payId" label="出库单编号" width="180"></el-table-column>
      <el-table-column prop="reason" label="出库理由">
        <template slot-scope="scope">
          <span v-if="scope.row.reason =='C002-1'" >生产入库</span>
          <span v-if="scope.row.reason =='C002-2'">库存开始</span>
          <span v-if="scope.row.reason =='C002-3'" >赠送</span>
          <span v-if="scope.row.reason =='C002-3'" >内部归还</span>
          <span v-if="scope.row.reason =='C002-3'" >其他归还</span>
        </template>
      </el-table-column>
      <el-table-column prop="reasonexact" label="出库详细理由"></el-table-column>
      <el-table-column prop="registerTime" label="登记时间"></el-table-column>
      <el-table-column prop="amountSum" label="总件数"></el-table-column>
      <el-table-column prop="costPriceSum" label="总金额"></el-table-column>

      <!--<el-table-column-->
      <!--prop="checkTag"-->
      <!--label="设计单状态">-->
      <!--<template slot-scope="scope">-->
      <!--<span v-if="scope.row.checkTag =='S001-0'"-->
      <!--style="color:lawngreen"-->
      <!--&gt;执行</span>-->
      <!--<span-->
      <!--v-else-if="scope.row.checkTag == 'S001-1'"-->
      <!--style="color:black"-->
      <!--&gt;完成</span>-->
      <!--<span-->
      <!--v-else-->
      <!--style="color:orange"-->
      <!--&gt;等待</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        label="制定">
        <template slot-scope="scope">
          <a href="#" @click.prevent='zhidin(scope.row)'>制定</a>
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

    <!--  预告出调度单-->
    <el-dialog width="80%" title="出调度单" :visible="zdwinshow">

      <el-form  :modal="scFrom1">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong style="margin-right: 220px">出库单编号:  {{scFrom1.payId}}</strong>
              <br>
              <br>
              <strong style="margin-right: 310px">出库理由:  {{scFrom1.reason}}</strong>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <br>
              <strong >出库详细理由: {{scFrom1.reasonexact}}</strong>
            </div>
          </el-col>
        </el-row>
        <br>
        <!--生产工序-->
        <div>
          <el-table :data="scFrom" stripe border style="width: 100%">
            <el-table-column prop="id" label="序号" width="180"></el-table-column>
            <el-table-column prop="productName" label="产品名称"></el-table-column>
            <el-table-column prop="productId" label="产品编号"></el-table-column>
            <el-table-column prop="amountSum" label="应入库数量"></el-table-column>
            <el-table-column prop="gatheredAmountSum" label="已入库数量"></el-table-column>
            <el-table-column  label="调度">
              <template slot-scope="scope">
                <a href="#" @click.prevent='diaodu(scope.row)'>出库调度</a>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-row>
          <br>
          <br>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong >应入库总jian数: {{register}}</strong>
          </div></el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>登  记  时  间: </strong>
              {{scFrom1.registerTime}}
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="zdwinshow = false">返回</el-button>
      </div>
    </el-dialog>

    <!--修改调度-->
    <el-dialog width="80%" title="入库调度单" :visible="diaodumode">

      <el-form  :modal="scFrom1">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong style="margin-right: 220px">出库单编号:  {{scFrom1.payId}}</strong>
              <br>
              <br>
              <strong style="margin-right: 310px">产品名称:  {{scFrom1.productName}}</strong>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong >产品编号: {{scFrom1.productId}}</strong>
              <br>
              <br>
              <strong >成本价格: {{scFrom3.realCostPrice}}</strong>
            </div>
          </el-col>
        </el-row>
        <br>
        <!--生产工序-->
        <div>
          <el-table :data="scFrom" stripe border style="width: 100%">
            <el-table-column prop="id" label="序号" width="180"></el-table-column>
            <el-table-column prop="warehouseName" label="库房名称"></el-table-column>
            <el-table-column prop="productId" label="存储地址编号"></el-table-column>
            <el-table-column prop="amountSum" label="存储地址名称"></el-table-column>
            <el-table-column prop="maxCapacityAmount" label="当前最大存储"></el-table-column>
            <el-table-column prop="gatheredAmountSum" label="本次入库数量">
              <template slot-scope="scope">
                <el-input type="number"  placeholder="请输入内容" v-model="CapacityAmount" clearable oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <el-row>
          <br>
          <br>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong style="margin-right: 280px">登记人: {{scFrom1.register}}</strong>
            <br>
            <br>
            <strong style="margin-right: 280px">应入库数: {{scFrom1.amountsum}}</strong>
            <br>
            <br>
            <strong style="margin-right: 280px">应入库成本: {{scFrom1.costPriceSum}}</strong>
          </div></el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong >登记时间: {{scFrom1.registerTime}}</strong>
              <br>
              <br>
              <strong >已入库数: {{scFrom4.amount}}</strong>
              <br>
              <br>
              <strong >已入库成本: {{scFrom4.subtotal}}</strong>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="zdwinshow = false">返回</el-button>-->

        <!--<el-button @click="diaodumode = false";>取消</el-button>-->
        <el-button @click.prevent="fanhuei">返回</el-button>
        <el-button type="primary" @click.prevent="tianjia">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: "Makestockinorder",
    data() {
      return {
        CapacityAmount: "",
        scFrom3:[],
        scFrom4:[],
        baocuen: "",
        register: "",
        tableData: [],
        options:[],
        zdwinshow: false,
        diaodumode: false,
        pageno: 1,
        pagesize: 5,
        total: 0,
        scFrom:[],
        scFrom1:{},
        name: "",
        remark: "",
        value: "",
        shortcuts: "",
        value1: '',
        value2: '',
        editform: "",
        config: "",
      }
    },
    methods: {
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);

        params.append("productId", this.name);
        params.append("remark", this.remark);


        axios.post("/sPay/querybyproductid.action", params).then(function (response) {
          _this.tableData = response.data.data;
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
      searchcartype() {   //条件查询

        this.getdata();
      },openeditwin(id) {  //打开编辑页面
        this.editwinshow = true;
        //根据id查询数据，显示在编辑页面
        // var _this = this;
        // var params = new URLSearchParams();
        // params.append("id", id);

        // this.$axios.post("selectbyid.action", params).then(function (response) {
        //   _this.editform=response.data;
        // }).catch();


      },btnsave(){
        this.editwinshow = false;

      },
      tianjia(){
        if (_this.CapacityAmount === ''){
          _this.$message({
            message: '不能为空',
            type: 'warning'
          });
          return false
        }
        if (_this.CapacityAmount>_this.scFrom.maxCapacityAmount) {
          alert(_this.CapacityAmount)
          alert(_this.scFrom.maxCapacityAmount)
          _this.$message({
            message: '已经大于最大存储',
            type: 'warning'
          });
          return false
        }
        this.diaodumode = false;
        var _this = this;
        var params = new URLSearchParams();
        params.append("paidAmount",_this.CapacityAmount);
        params.append("productId",_this.scFrom4.productId);

        if (_this.CapacityAmount.length<0){
          _this.$message({
            message: '不能为空',
            type: 'warning'
          });
        }
        axios.post("/sPay/savDeliverySGatherDetails.action",params).then(function (response) {
          if (response.data == true) {
            _this.$notify({
              title: '成功',
              message: '出库成功!',
              type: 'success'
            });
            _this.zdwinshow = false;
          } else {
            _this.$notify({
              title: '失败',
              message: '服务端请求超时 请重试',
              type: 'danger'
            });}
          _this.getdata();
        }).catch();
        // _this.CapacityAmount= '';
      },
      zhidin(row){
        this.zdwinshow = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("payId",row.payId);

        axios.post("/sPay/querybypayId.action",params).then(function (response) {
          _this.scFrom=response.data;
          _this.scFrom1=response.data[0];
        }).catch();
      },
      diaodu(row){
        this.diaodumode = true;
        var _this = this;
        var params = new URLSearchParams();
        params.append("productId",row.productId);
        params.append("id",row.id);
        console.log(row.id)

        axios.post("/dFile/querybyproductid.action",params).then(function (response) {
          _this.scFrom3=response.data[0];
        }).catch();
        axios.post("/sGatherDetails/querybyproductid.action",params).then(function (response) {
          _this.scFrom4=response.data[0];
        }).catch();
      },
      fanhuei(){
        this.diaodumode = false;
        this.zdwinshow = true;
      }
    },
    created() {
      this.getdata();
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
  .inputDeep>>>.el-input__inner {
    border: 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button
  {
    -webkit-appearance:none ;
  }
  input[type="number"]{
    -moz-appearance:textfield ;
  }
</style>
