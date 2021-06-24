<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>动态库存查询</span>
      </div>
      <div slot="header" class="grid-content bg-purple">
        <!--  条件查询-->
        <el-form :inline="true">

          <el-form-item label="请选择产品">
            <el-input placeholder="请输入备注" clearable v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="请选择工序设计单状态">
            <el-input placeholder="请输入备注" clearable v-model="remark"></el-input>
          </el-form-item>

          <el-button type="success" @click="searchcartype">查询</el-button>
        </el-form>
      </div>



    <!--表格 -->
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column prop="firstKindName" label="一级产品分类"></el-table-column>
      <el-table-column prop="secondKindName" label="二级产品分类"></el-table-column>
      <el-table-column prop="thirdKindName" label="三级产品分类"></el-table-column>
      <el-table-column prop="productName" label="产品编号/名称" width="180"></el-table-column>
      <el-table-column prop="amount" label="库存数量"></el-table-column>
      <el-table-column prop="maxAmount" label="安全库存上限"></el-table-column>
      <el-table-column prop="minAmount" label="安全库存下限"></el-table-column>
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
      },
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
