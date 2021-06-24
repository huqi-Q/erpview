<template>
  <!--产品工序设计审核-->
  <div>
    <!--  条件查询-->
    <el-form v-model="productFrom" ref="productFrom"  :inline="true">
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
      <el-form-item label="请选择工序设计单状态">
        <el-input placeholder="请输入备注" clearable v-model="remark"></el-input>
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
      <el-button type="danger" @click="resetproduct(productFrom)">重置</el-button>
    </el-form>


    <!--表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="applyId"
        label="生产计划编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="designer"
        label="登记人">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="备注">
      </el-table-column>
      <el-table-column
        label="审核">
        <template slot-scope="scope">
          <a href="#" @click.prevent='shsjd(scope.row)'>审核</a>
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


    <el-dialog width="80%" title="生产计划单" :visible="jhwinshow">

      <el-form  :modal="scFrom">
        <div style="margin-right:800px">
         <strong>计 划 单 编 号:  {{applyId}}</strong>
        </div>
        <br>
        <!--生产工序-->
        <div>
          <el-table
            :data="scgxtableData"
            stripe
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
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
              prop="productDescribe"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="数量">
            </el-table-column>
          </el-table>
        </div>

        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong >登记人:</strong>
            <input class="xhx" value="dd" disabled="disabled" style="width:300px"></input>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            <strong>登  记  时  间:  {{registerTime}}</strong>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong >复核人:</strong>
            <input class="xhx" value="dd" disabled="disabled" style="width:300px"></input>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            <strong>审  核  时  间:  {{currentTime}}</strong>
          </div></el-col>
        </el-row>
        <br>
        <div style="margin-right:40px">
          <strong>设计要求</strong>
          <textarea style="width:950px;height: 100px">

      </textarea>
        </div>
        <br>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qx">取 消</el-button>
        <el-button type="primary" @click="tjsh">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "PlanReview",
      data() {
        return {
          tableData: [],
          productFrom:{},
          options:[],
          scgxtableData:[],
          value:"",
          pageno: 1,
          scFrom:{},
          applyId:"",
          pagesize: 5,
          total: 0,
          firstKindId:"",
          firstKindName:"",
          designer:"hh",
          jhwinshow:false,
          name:"",
          currentTime:new Date(),
          productName: "",
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

          this.$axios.post("/mApply/queryallReviewMApply").then(function (response) {
            _this.tableData = response.data;
            // _this.total = response.data.total;
          }).catch();
        },
        qx(){
          this.jhwinshow = false;
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
          this.$refs[name].resetFields()
          this.dialogVisible = false;
        },
        shsjd(row){
          var _this = this;
          this.jhwinshow=true;
           var params = new URLSearchParams();
           params.append("applyId", row.applyId);

          this.$axios.post("/mApply/queryMApplyById",params).then(function (response) {
            _this.scgxtableData = response.data;
            _this.applyId=_this.scgxtableData[0].applyId;
            _this.registerTime=_this.scgxtableData[0].registerTime;
            // _this.total = response.data.total;
          }).catch();


        },
        tjsh(){
          var _this = this;
          var params = new URLSearchParams();
          params.append("applyId", this.applyId);
          this.$axios.post("/mApply/updateMApplyById",params).then(function (response) {
                if(response.data==true){
                  _this.$message.success({
                    message: '恭喜你,审核成功',
                    type: 'success'
                  });
                  _this.jhwinshow=false;
                  _this.getdata();
                }else {
                  _this.$message({
                    message: '审核失败',
                    type: 'warning'
                  });
                }
          }).catch();
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
