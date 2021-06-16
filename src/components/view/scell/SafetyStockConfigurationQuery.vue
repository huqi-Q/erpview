<template>
  <div>

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
      <el-table-column prop="productId" label="产品编号" width="180"></el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="type" label="用途类型"></el-table-column>
      <el-table-column prop="firstKindName" label="档次级别"></el-table-column>
      <el-table-column prop="firstKindName" label="一级分类"></el-table-column>
      <el-table-column prop="secondKindName" label="二级分类"></el-table-column>
      <el-table-column prop="thirdKindName" label="三级分类"></el-table-column>

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
    <el-dialog width="80%" title="生产工序设计单" :visible="zdwinshow">

      <el-form  :modal="scFrom1">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <strong style="margin-right: 220px">产  品  名  称  :  {{scFrom1.productName}}</strong>
              <br>
              <br>
              <strong >警报下限次数:</strong>
              <input class="xhx" style="width:200px" value="dwef" v-model="minAmount"></input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>产  品   编 号  :  {{scFrom1.productId}}</strong>
            </div>
          </el-col><el-col :span="12">
          <div class="grid-content bg-purple">
            <br>
            <strong >警报上限次数:</strong>
            <input class="xhx" style="width:200px" v-model="maxAmount"></input>
          </div>
          </el-col>
          <el-col :span="12">
          <div class="grid-content bg-purple">
            <br>
            <strong >设计人:</strong>
            <input class="xhx" style="width:200px" v-model="register"></input>
          </div>
        </el-col>
        </el-row>
        <br>
        <!--生产工序-->
        <div>
          <el-table :data="scFrom" stripe border style="width: 100%">
            <el-table-column prop="id" label="序号" width="180"></el-table-column>
            <el-table-column prop="warehouseName" label="库房名称"></el-table-column>
            <el-table-column prop="thirdKindId" label="存储地址编号"></el-table-column>
            <el-table-column prop="thirdKindName" label="存储地址名称"></el-table-column>
            <el-table-column prop="maxCapacityAmount" label="最大存储量"><input type="text" v-model="maxCapacity"/></el-table-column>
            <!--<el-table-column prop="responsiblePerson" label="工时成本小计(元)">-->
            <!--</el-table-column>-->
          </el-table>
        </div>

        <el-row>
          <br>
          <br>
          <el-col :span="12"><div class="grid-content bg-purple">
            <strong >登记人:</strong>
            <input class="xhx" type="text"  style="width:200px" v-model="register"></input>
          </div></el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <strong>登  记  时  间: </strong>
              {{scFrom1.registerTime}}
          </div>
          </el-col>
        </el-row>
        <br>
        <br>
        <div style="margin-right:40px">
          <el-form-item label="设计要求">
            <el-input type="textarea" v-model="config"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="zdwinshow = false">取 消</el-button>
        <el-button type="primary" @click.prevent="tianjia">确 定</el-button>
      </div>
    </el-dialog>

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
        options:[],
        zdwinshow: false,
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


        axios.post("/sCell/selectall.action", params).then(function (response) {
          _this.tableData = response.data.data;
          console.log(_this.tableData = response.data.data)
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
        this.zdwinshow = false;
        var _this = this;
        var params = new URLSearchParams();
        params.append("id",_this.scFrom1.id)
        params.append("minAmount",_this.minAmount)
        params.append("maxAmount",_this.maxAmount)
        params.append("register",_this.register)
        params.append("maxCapacityAmount",_this.maxCapacity)
        params.append("config",_this.config)
        axios.post("/sCell/addSCell.action",params).then(function (response) {
            console.log(response)
        }).catch();
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
</style>
