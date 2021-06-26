<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!--<span>安全库存配置查询</span>-->
      </div>
      <div slot="header" class="grid-content bg-purple">
        <!--  条件查询-->
        <el-form :inline="true">
          <!--<el-button type="success" @click="searchcartype">制定安全库存配置单</el-button>-->

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
      </div>



    <!--表格 -->
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="gatherId" label="申请单编号" width="180">
        <template  slot-scope="scope">
          <a @click="cancelDialog(scope.row.id)" style="color:blue;cursor:pointer">{{scope.row.gatherId}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="入库理由"></el-table-column>
      <el-table-column prop="registerTime" label="登记时间"></el-table-column>
      <el-table-column prop="amountSum" label="总件数"></el-table-column>
      <el-table-column prop="checkTag" label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.checkTag =='S001-0'" style="color:lawngreen">等待审核</span>
          <span v-else-if="scope.row.checkTag == 'S001-1'" style="color:black">审核通过</span>
          <span v-else style="color:orange">未通过</span>
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
      <el-dialog width="80%" title="入库申请登记复核" :visible="shwinshow">

        <el-form  :modal="scFrom1">
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <strong style="margin-right: 220px">申 请 单 编 号  :  {{scFrom2.gatherId}}</strong>
                <br>
                <br>
                <strong style="margin-right: 220px">入 库 人  :  {{scFrom2.storer}}</strong>
                <br>
                <br>
              </div>
            </el-col>
            <el-col :span="12">

              <div class="grid-content bg-purple-light">
                <strong>入 库 理 由  :
                  <span v-if="scFrom2.reason =='R001-1'" >生产入库</span>
                  <span v-else-if="scFrom2.reason == 'R001-2'">库存初始</span>
                  <span v-else-if="scFrom2.reason == 'R001-3'">赠送</span>
                  <span v-else-if="scFrom2.reason == 'R001-4'">内部归还</span>
                  <span v-else >其他归还</span>
                </strong>


              </div>
            </el-col>
          </el-row>
          <br>
          <!--生产工序-->
          <div>
            <el-table :data="tableData1" stripe border style="width: 100%">
              <el-table-column prop="productName" label="产品名称" width="180"></el-table-column>
              <el-table-column prop="productId" label="产品编号" width="180"></el-table-column>
              <el-table-column prop="productDescribe" label="描述" width="180"></el-table-column>
              <el-table-column prop="amount" label="数量"></el-table-column>
              <el-table-column prop="amountUnit" label="单位"></el-table-column>
              <el-table-column prop="realCostPrice" label="成本单价(元)"></el-table-column>
              <el-table-column prop="subtotal" label="小记(元)"></el-table-column>
            </el-table>
          </div>

          <el-row>
            <br>
            <br>
            <el-col :span="12"><div class="grid-content bg-purple">
              <strong style="margin-right: 240px">总件数  :  {{scFrom2.amountSum}}</strong>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">
              <strong style="margin-right: 240px">总金额  :  {{scFrom2.costPriceSum}}</strong>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">
              <strong style="margin-right: 220px">登记人  :  {{scFrom2.register}}</strong>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">
              <strong style="margin-right: 240px">审核人  :  {{scFrom2.checker}}</strong>
            </div></el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <strong style="margin-right: 80px">登  记  时  间: {{scFrom2.registerTime}} </strong>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <strong style="margin-right: 100px">审 核  时  间: {{scFrom2.registerTime}}</strong>
              </div>
            </el-col>
          </el-row>
          <br>
          <br>
          <div style="margin-right:40px">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="scFrom1.remaek"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="shwinshow = false">返回</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: "scell",
    data() {
      return {
        maxCapacity: "",
        baocuen: "",
        minAmount: "",
        maxAmount: "",
        register: "",
        tableData: [],
        tableData1: [],
        options:[],
        zdwinshow: false,
        shwinshow:false,
        pageno: 1,
        pagesize: 5,
        total: 0,
        scFrom:[],
        scFrom1:{},
        scFrom2:{},
        name: "",
        remark: "",
        value: "",
        shortcuts: "",
        value1: '',
        value2: '',
        editform: "",
        config: ""
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


        axios.post("/sGather/queryqll.action", params).then(function (response) {
          _this.tableData = response.data
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
      cancelDialog(id){
        var _this = this;
        _this.shwinshow = true;
        var params = new URLSearchParams();
        params.append("id",id);
        axios.post("/sGather/queryparentId.action",params).then(function (response) {
          _this.scFrom2=response.data[0];
          console.log(response.data[0])
        }).catch();
        this.$axios.post("/sGather/queryparentIdtable.action",params).then(function (response) {
          _this.tableData1 = response.data;
          console.log(response.data)
        }).catch()

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


      },
      btnsave(){
        this.zdwinshow = false;
      },
      zhidin(id){
      this.zdwinshow = true;
      var _this = this;
      var params = new URLSearchParams();
      params.append("id",id);
      axios.post("/sCell/selectSCellbyid.action",params).then(function (response) {
        _this.scFrom=response.data;
        _this.scFrom1=response.data[0];
      }).catch();
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
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: right;
  }

  .box-card {
    width: 100%;
  }
</style>
