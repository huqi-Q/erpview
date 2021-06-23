<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>入库申请登记审核</span>
      </div>
    <!--  <div slot="header" class="grid-content bg-purple">
    &lt;!&ndash;  条件查询&ndash;&gt;
    <el-form :inline="true">
      <el-form-item label="请选择入库理由">
        <el-input placeholder="请输入备注" ></el-input>
      </el-form-item>
      <el-button type="success" @click="searchcartype">查询</el-button>
    </el-form>
      </div>-->
<!--  表格-->
  <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="gatherId" label="申请单编号" width="180"></el-table-column>
      <el-table-column prop="reason" label="入库理由" width="180"></el-table-column>
      <el-table-column prop="registerTime" label="登记时间" width="300"></el-table-column>
      <el-table-column prop="amountSum" label="总件数" width="220"></el-table-column>
      <el-table-column prop="costPriceSum" label="总金额" width="180"></el-table-column>
      <el-table-column label="审核">
        <template slot-scope="scope">
          <a href="#" @click.prevent='sh(scope.row.id)'>审核</a>
        </template>
      </el-table-column>
    </el-table>

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
            <strong style="margin-right: 220px">总件数  :  {{scFrom2.amountSum}}</strong>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong style="margin-right: 220px">总金额  :  {{scFrom2.costPriceSum}}</strong>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong style="margin-right: 220px">登记人  :  {{scFrom2.register}}</strong>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong style="margin-right: 220px">审核人  :  {{scFrom2.checker}}</strong>
          </div></el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>登  记  时  间: </strong>
              {{scFrom2.registerTime}}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>审 核  时  间: </strong>
              {{scFrom2.registerTime}}
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
        <el-button type="primary" @click.prevent="tianjia">通过</el-button>
        <el-button type="primary" @click.prevent="bohuei">驳回</el-button>
      </div>
    </el-dialog>
    <el-dialog width="80%" title="驳回理由" :visible="bohueidiv">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bohueidiv = false">取消</el-button>
        <el-button type="primary" @click.prevent="bohueitijiao">提交</el-button>
      </div>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "SgatherAudit",
      data() {
        return {
          value6: '',
          value7: '',
          textarea:"",
          tableData: [],
          options: [],
          scFrom1:{},
          scFrom2:{},
          goods: [],
          tableData1:[],
          pageno: 1,
          index: "",
          pagesize: 5,
          total: 0,
          scFrom: {},
          sgatherData: [],
          shwinshow: false,
          bohueidiv: false,
          storer: "",
          remaek: "",
          value: "",
          reason: "",
          registerTime: "",
          value1: '',
          amountSum: "",
        }
        },
      methods: {
        getdata() {//获取数据
          var _this = this;
          var params = new URLSearchParams();
          params.append("pageno", this.pageno);
          params.append("pagesize", this.pagesize);
          params.append("name", this.name);
          params.append("remaek", this.remaek);
          console.log(params)

          axios.post("/sGather/querycheckTag.action", params).then(function (response) {
            _this.tableData = response.data.data;
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
        },
        sh(id){//复核
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
        tianjia(){
          this.shwinshow = false;
          var _this = this;
          var params = new URLSearchParams();
          params.append("gatherId",_this.scFrom2.gatherId);
          axios.post("/sGather/changeSgather.action",params).then(function (response) {
            if (response.data == true) {
              _this.$notify({
                title: '成功',
                message: '复核成功',
                type: 'success'
              });
              _this.shwinshow = false;
            } else {
              _this.$notify({
                title: '失败',
                message: '服务端请求超时 请重试',
                type: 'danger'
              });}
            _this.getdata();
          }).catch();
        },
        bohuei(){

        },
      },created() {
        this.getdata();
      }
    }
</script>

<style >
  .xhx {
    height: 25px;
    border: none;
    border-bottom: 1px solid black;
    background-color: transparent;
    outline: none;
  }</style>
