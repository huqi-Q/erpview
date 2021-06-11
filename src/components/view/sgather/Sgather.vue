<template>
  <div>

<!--    &lt;!&ndash;  条件查询&ndash;&gt;-->
<!--    <el-form :inline="true">-->
<!--      <el-form-item label="入库人">-->
<!--        <el-input placeholder="请输入入库人" clearable v-model="name"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="入库理由">-->
<!--        <el-select v-model="value" placeholder="请选择">-->
<!--          <el-option-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="是否退回">-->
<!--        <el-select v-model="value" placeholder="请选择">-->
<!--          <el-option-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="退回时间">-->
<!--        <el-input placeholder="请输入备注" clearable v-model="remark"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="请输入登记时间">-->
<!--        <div class="block">-->
<!--          <el-date-picker-->
<!--            v-model="value2"-->
<!--            type="daterange"-->
<!--            align="right"-->
<!--            unlink-panels-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            :shortcuts="shortcuts"-->
<!--          >-->
<!--          </el-date-picker>-->
<!--        </div>-->
<!--      </el-form-item>-->
<!--      <el-button type="primary" round @click="add">添加产品</el-button>-->
<!--      <el-button type="success"  round @click="searchcartype">查询</el-button>-->
<!--      <el-button type="success" round @click="commit">提交</el-button>-->
<!--    </el-form>-->
    <el-button type="primary" round @click="add">添加产品</el-button>
<!--   空表格-->
    <el-table
      :data="nulltable"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="productName"
        label="产品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productId"
        label="产品编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productDescribe"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="amountUnit"
        label="单位">
      </el-table-column>
      <el-table-column
        prop="realCostPrice"
        label="成本单价(元)">
      </el-table-column>
      <el-table-column
        prop="subtotal"
        label="小记(元)">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <a href="#" @click.prevent='del(scope.row)'>删除</a>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <el-col :span="12"><div>
        <strong >登记人:</strong>
        <input class="xhx" value="dd" disabled="disabled" style="width:300px"></input>
      </div></el-col>
      <el-col :span="12"><div>
        <strong>登  记  时  间:  {{currentTime}}</strong>
      </div></el-col>
    </el-row>
    <br>
    <div style="margin-right:40px">
      <strong>设计要求</strong>
      <textarea style="width:950px;height: 100px">

      </textarea>
    </div>


    <el-dialog width="80%" title="入库申请单" :visible="zdwinshow">
      <el-form  :modal="scFrom">
        <br>
        <!--生产工序-->
        <div>
          <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%">
            <el-table-column
              prop="productName"
              label="产品名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="productId"
              label="产品编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="productDescribe"
              label="描述"
              width="180">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="数量">
            </el-table-column>
            <el-table-column
              prop="amountUnit"
              label="单位">
            </el-table-column>
            <el-table-column
              prop="realCostPrice"
              label="成本单价(元)">
            </el-table-column>
            <el-table-column
              prop="subtotal"
              label="小记(元)">
            </el-table-column>
            <el-table-column
              label="入库">
              <template slot-scope="scope">
                <a href="#" @click.prevent='tian(scope.row)'>入库</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>


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

      <div slot="footer" class="dialog-footer">
        <el-button @click="zdwinshow = false">取 消</el-button>
        <el-button type="primary" @click="scgx">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>


<script>
  import  axios from 'axios'
  export default {
    name: "sgather",
    data() {
      return {
        tableData: [],
        options:[],
        nulltable:[],
        pageno: 1,
        pagesize: 5,
        total: 0,
        scFrom:{},
        sgatherData:[],
        zdwinshow:false,
        name: "",
        remark: "",
        scgx:"",
        value: "",
        currentTime:"",
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
        value1: '',
        value2: ''
      }
    },
    methods: {
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);

        params.append("name", this.name);
        params.append("remark", this.remark);


        axios.post("/sGather/queryallsgather.action", params).then(function (response) {
          _this.tableData = response.data.data;

          //修改图片地址  追加前缀
          _this.tableData.forEach((item) => {
            item.img = "http://localhost:8888/" + item.img;
          })


          _this.total = response.data.total;
        }).catch();
      },
      add(){
        var _this = this;
        this.zdwinshow=true;
        this.$axios.post("/sGather/queryallsgather.action").then(function (response) {
          _this.scFrom = response.data;
        }).catch();
      },
      tian(row){
          this.nulltable.push(row);
      },
      del(){

      },
      commit(){},
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
      }
    },
    created() {
      this.getdata();
    }
  }
</script>

