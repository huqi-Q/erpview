<template>
  <div>
    <!--制定物料组成设计单-->
    <!--  条件查询-->
    <el-form ref="productFrom"  :inline="true">
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
        <el-select v-model="value" placeholder="请选择">
          <el-option
            :key="firstKindId"
            :label="firstKindName"
            :value="firstKindId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择产品III级分类">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            :key="firstKindId"
            :label="firstKindName"
            :value="firstKindId">
          </el-option>
        </el-select>
      </el-form-item><br>
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
        prop="productId"
        label="产品编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="productClass"
        label="档次级别">
        <template slot-scope="scope">
          <span v-if="scope.row.productClass =='D001-1'">高档</span>
          <span v-else-if="scope.row.productClass == 'D001-2'">中档</span>
          <span v-else="scope.row.productClass == 'D001-3'">低档</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="firstKindName"
        label="I级分类">
      </el-table-column>
      <el-table-column
        prop="secondKindName"
        label="II级分类">
      </el-table-column>
      <el-table-column
        prop="thirdKindName"
        label="III级分类">
      </el-table-column>
      <el-table-column
        prop="type"
        label="用途类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type =='Y001-1'">商品</span>
          <span v-else="scope.row.type == 'Y001-2'">物料</span>
        </template>
      </el-table-column>
      <el-table-column
        label="制定设计单">
        <template slot-scope="scope">
          <a href="#" @click.prevent='zd(scope.row)'>制定设计单</a>
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
    <el-dialog width="80%" title="制定物料组成设计单" :visible="zdwinshow">

      <el-form  :modal="scFrom">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong style="margin-right: 220px">产  品  名  称  :  {{scFrom.productName}}</strong>
              <br>
              <br>
              <strong >设计人:</strong>
              <input v-model="designer" class="xhx" style="width:300px"></input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>产  品   编 号  :  {{scFrom.productId}}</strong>
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
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="id"
              label="物料编号">
            </el-table-column>
            <el-table-column
              prop="productId"
              label="物料编号">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="物料名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="type"
              label="用途类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type =='Y001-1'">商品</span>
                <span v-else="scope.row.type == 'Y001-2'">物料</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="productDescribe"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="数量">
              <template slot-scope="scope">
                <input class="mbk" v-model="addmodulemount" type="text"></input>
              </template>
            </el-table-column>
            <el-table-column
              prop="amountUnit"
              label="单位">
            </el-table-column>
            <el-table-column
              prop="costPrice"
              label="计划成本单价(元)">
            </el-table-column>
            <el-table-column
              prop="subtotal"
              label="小计(元)">
              <template slot-scope="scope">
                {{addmodulemount*scope.row.costPrice}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <a href="#" @click.prevent='del(index)'>删除</a>
              </template></el-table-column>

          </el-table>
        </div>

        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong >登记人:</strong>
            <input class="xhx" value="dd" disabled="disabled" style="width:300px"></input>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            <strong>登  记  时  间:  {{currentTime}}</strong>
          </div></el-col>
        </el-row>
        <br>
        <div style="margin-right:40px">
          <strong>设计要求</strong>
          <textarea style="width:950px;height: 100px">

      </textarea>
        </div>
        <br>

        <div>
          <el-button @click="addwuliao">添加物料</el-button>
          <!--<el-button @click="scmodule">删除物料</el-button>-->
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="zdwinshow = false">取 消</el-button>
        <el-button type="primary" @click="addmodule">确 定</el-button>
      </div>
    </el-dialog>

    <!--弹出添加物料的模态框-->
    <el-dialog width="80%" title="添加物料" :visible="tjmoduletb1">
      <el-form  :modal="addmoduleFrom">
        <!--生产工序-->
        <div>
          <el-table
            :data="manufactureData"
            stripe
            border
            :cell-style="changeCellStyle"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="productId"
              label="物料编号">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="物料名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="type"
              label="用途类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type =='Y001-1'">商品</span>
                <span v-else="scope.row.type == 'Y001-2'">物料</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="productDescribe"
              label="物料描述">
            </el-table-column>
            <el-table-column
              prop="amountUnit"
              label="单位">
            </el-table-column>
            <el-table-column
              prop="costPrice"
              label="计划成本单价(元)">
            </el-table-column>
            <el-table-column
              label="添加">
              <template slot-scope="scope">
                <a href="#" @click.prevent='tjwl(scope.row)'>添加</a>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong >登记人:</strong>
            <input class="xhx" value="dd" disabled="disabled" style="width:300px"></input>
          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light">
            <strong>登  记  时  间:  {{currentTime}}</strong>
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
        <el-button @click="tjmoduletb1 = false">返 回</el-button>
        <el-button type="primary">添 加</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Zdmodule",
    data() {
      return {
        tableData: [],
        tjmoduletb1:false,
        scgxtableData:[],
        addmoduleFrom:[],
        currentTime:new Date(),
        zdwinshow: false,
        gxwinshow:false,
        addmodulemount:1,
        scFrom:{},
        manufactureData:[],
        options:[],
        index:"",
        cp:{},
        designer:"jj",
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
        this.$axios.post("/dFile/queryallDFileShop", params).then(function (response) {
          _this.tableData = response.data.records;
          _this.total = response.data.total;
          _this.firstKindName = response.data.records[0].firstKindName;
          _this.firstKindId = response.data.records[0].firstKindId;
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
      addwuliao(){
        this.tjmoduletb1 = true;
        var _this = this;
        this.tjmoduletb1 = true;
        //异步查询所有物料
        this.$axios.post("/dModule/queryallwl").then(function (response) {
          _this.manufactureData = response.data.records;
        }).catch();
      },
      tjwl(row){
        this.scgxtableData.push(row);
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
      addmodule(){

        var _this = this;
        var arr = this.scgxtableData;
        let newArr = [];

        arr.forEach(function (item,index) {
          console.log(item);
          var wl = {};
          wl.productId=item.productId
          wl.id=item.id
          wl.productName=item.productName
          wl.designer=item.designer
          wl.subtotal=item.subtotal
          wl.productId1=_this.cp.productId
          wl.productName1=_this.cp.productName
          wl.designer1=_this.cp.designer
          wl.register1=_this.cp.register
          wl.register=item.register
          wl.type=item.type
          wl.productDescribe=item.productDescribe
          wl.amountUnit=item.amountUnit
          wl.amount=_this.addmodulemount
          wl.costPrice=item.costPrice
          newArr.push(wl)
        })
        this.$axios.post("/dModule/addModule",JSON.stringify(newArr)
          ,{headers:{"Content-Type":"application/json"}}
        ).then(function (response) {}).catch();
        this.getdata();
        this.$message({
          type: 'success',
          message: '制定成功!'
        });
        this.scgxtableData=[];
        this.zdwinshow = false;

      },
      zd(row){
        this.zdwinshow = true;
        this.cp=row;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id",row.productId);
        this.$axios.post("/dFile/selectById",params).then(function (response) {
          _this.scFrom=response.data;
        }).catch();
      },
      tjgx(row){
        this.scgxtableData.push(row);
      },del(index) {//删除
        this.scgxtableData.splice(index, 1);
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
