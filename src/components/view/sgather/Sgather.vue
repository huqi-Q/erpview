<template>
  <div>
    <component v-bind:is="addfie">
    <el-form :inline="true">
      <el-form-item label="入库人">
      <el-input placeholder="请输入入库人" clearable   v-model="storer" ></el-input>
      </el-form-item>
      <el-form-item label="入库理由">
        <el-select v-model="reason" placeholder="请选择">
          <el-option
            v-for="rkly in rkly"
            :key="rkly.value"
            :label="rkly.label"
            :value="rkly.value">
          </el-option>
        </el-select>
      </el-form-item>



      <el-button type="primary" round @click="add">添加产品</el-button>
      <el-button type="success" round @click="commit">提交</el-button>
    </el-form>
<!--   空表格-->
    <el-table :data="nulltable"  stripe border style="width: 100%">
      <el-table-column prop="parentId" label="编号" width="180"></el-table-column>
      <el-table-column prop="productName" label="产品名称" width="180"/>
      <el-table-column prop="productId" label="产品编号" width="180"></el-table-column>
      <el-table-column prop="productDescribe" label="描述" width="180"></el-table-column>
      <el-table-column prop="amount" label="数量">
        <template slot-scope="scope">
          <el-input type="number"  placeholder="请输入内容" v-model="scope.row.amount" clearable  oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>

          <!--<input type="text" v-model="scope.row.amount"/>-->
        </template>
      </el-table-column>
      <el-table-column prop="amountUnit" label="单位"></el-table-column>
      <el-table-column prop="realCostPrice" label="成本单价(元)"></el-table-column>
      <el-table-column prop="subtotal" label="小记(元)">
        <template slot-scope="scope">
          <strong> {{scope.row.amount*scope.row.realCostPrice}}</strong>
        </template>
      </el-table-column>
      <el-table-column label="操作"><template slot-scope="scope"><a href="#" @click.prevent='del(index)'>删除</a></template></el-table-column>
    </el-table>

    <el-row>
      <el-col :span="12"><div>
        <strong>总件数:  {{amountSum}}</strong>
      </div></el-col>

      <el-col :span="12"><div>
        <strong>登记人:</strong>
        <input class="xhx" style="width:200px" v-model="register"></input>
      </div></el-col>

      <el-col :span="12"><div>
        <strong>总金额:  {{costPriceSum}}</strong>
      </div></el-col>

      <el-col :span="12"><div>
        <strong>登  记  时  间: <input class="mbk" v-model="currentTime" style="width:300px"></input></strong>
      </div></el-col>
    </el-row>

    <br>
    <div style="margin-right:40px">
      <strong>备注</strong>
      <textarea style="width:950px;height: 100px" v-model="remaek">
      </textarea>
    </div>


    <el-dialog width="80%" title="入库申请单" :visible="zdwinshow">
      <el-form  :modal="scFrom">
        <br>
        <!--生产工序-->
        <div>
          <el-table :data="tableData" stripe border style="width: 100%">
            <el-table-column prop="productName" label="产品名称" width="180"></el-table-column>
            <el-table-column prop="productId" label="产品编号" width="180"></el-table-column>
            <el-table-column prop="productDescribe" label="描述" width="180"></el-table-column>
            <el-table-column prop="amountUnit" label="单位"></el-table-column>
            <el-table-column prop="realCostPrice" label="成本单价(元)"></el-table-column>
            <el-table-column label="入库">
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
    </component>
  </div>
</template>


<script>
  import  axios from 'axios'
  import xianqin from '../xianqin'
  export default {
    name: "sgather",
    data() {
      return {
        value6: '',
        value7: '',
        tableData: [],
        options: [],
        nulltable: [],
        goods: [],
        rkly: [{
          value: "R001-1",
          label: "生产入库"
        }, {
          value: "R001-2",
          label: "库存初始"
        }, {
          value: "R001-3",
          label: "赠送"
        }, {
          value: "R001-4",
          label: "内部归还"
        }, {
          value: "R001-5",
          label: "其他归还"
        }],
        returnOrnot: "",
        pageno: 1,
        index: "",
        pagesize: 5,
        total: 0,
        scFrom: {},
        sgatherData: [],
        zdwinshow: false,
        storer: "",
        addfie: "Sgather",
        remaek: "",
        value: "",
        reason: "",
        registerTime: "",
        register: "",
        subtotal:"",
        value1: '',
        amount: "",
        currentTime: new Date(),
        amountSum: "",
      }
    },components:{xianqin},
    methods: {
      getdata() {   //获取数据
        var _this = this;
        var params = new URLSearchParams();
        params.append("pageno", this.pageno);
        params.append("pagesize", this.pagesize);
        params.append("name", this.name);
        params.append("remaek", this.remaek);
      },
      add() {//添加产品
        var _this = this;
        this.zdwinshow = true;
        this.$axios.post("/sGather/queryallsgather.action").then(function (response) {
          _this.tableData = response.data;
        }).catch();
      },
      tian(row) {//入库
        var _this = this;
        this.nulltable.push(row);
        var arr = this.nulltable;
        this.amountSum=this.nulltable.length;
        var empNumber = []
        arr.map((item, index) => {
          empNumber.push()
          if ( item.productName.length>2){
            alert("不能添加重复的")
            return false;
          }

        })

      },
      del(index) {//删除
        this.nulltable.splice(index, 1);
      },
      commit() { //提交
        this.zdwinshow = false;
        var _this = this;
        var params = new URLSearchParams();
        params.append("storer",_this.storer)
        params.append("reason",_this.reason)
        params.append("amount",_this.amount)
        params.append("amountSum",_this.amountSum)
        params.append("costPriceSum",_this.costPriceSum)
        params.append("register",_this.register)
        params.append("registerTime",_this.currentTime)
        params.append("remark", _this.remaek);
        this.$axios.post("/sGather/addSgathers.action",params).then(function (response) {
        }).catch();


        var arr = this.nulltable;
        let newArr = [];
        arr.map((item, index) => {
          newArr.push(
            Object.assign({}, item, {
              "subtotal":_this.subtotal,
              "realCostPrice":item.realCostPrice,
              "amount":item.amount,

            })
          )
        })
        this.$confirm('确定提交吗!!!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/sGather/addSgatherdetails.action",JSON.stringify(newArr)
            ,{headers:{"Content-Type":"application/json"}}
          ).then(function (response) {
            _this.addfie='xianqin'
          }).catch();
          this.zdwinshow = false;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '提交失败'
          });
        });
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
      scgx() {
      },
      djsj() {//登记时间
        var _this = this;
        axios.post("/sGather/queryreGisterTime.action").then(function (response) {
          _this.scFrom = response.data;
        }).catch()
      },
      created() {
        this.getdata();
        this.djsj();
        var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
        _this.currentTime = //修改数据date
          new Date().getFullYear() +
          "-" +amount
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
    },
    computed:{
      costPriceSum() { //总金额
        var totalprice = 0;
        var _this = this;
        var shu= 0;
        this.nulltable.forEach(function (item,index) {
            shu= _this.nulltable[index].amount* item.realCostPrice;
          totalprice+=shu;
        })
        this.subtotal=shu;
        return totalprice;
      }
    }
  }
</script>
<style>
  .mbk{
    border: none;
    height: 20px;
  }

</style>

