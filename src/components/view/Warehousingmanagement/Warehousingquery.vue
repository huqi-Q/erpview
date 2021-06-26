<template>
  <div>
    <!--  条件查询-->
    <el-form :model="productFrom" ref="productFrom"  :inline="true">
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
      <el-button type="danger" @click="resetproduct()">重置</el-button>
    </el-form>


    <!--表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="gatherId"
        label="入库单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="入库理由">
      </el-table-column>
      <el-table-column
        prop="checkTime"
        label="完成时间">
      </el-table-column>
      <el-table-column
        prop="amountsum"
        label="应入库总件数">
      </el-table-column>
      <el-table-column
        prop="gatheredAmountSum"
        label="已入库总件数">
      </el-table-column>
      <el-table-column
        prop="gatherTag"
        label="入库单状态">
        <template slot-scope="scope">
                    <span v-if="scope.row.gatherTag =='K003-2'"
                          style="color:orange"
                    >等待</span>
          <span
            v-else-if="scope.row.gatherTag == 'K003-1'"
            style="color:greenyellow"
          >执行</span>
          <span
            v-else
            style="color:red"
          >不通过</span>
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
  </div>
</template>

<script>
  export default {
    name: "Warehousingquery",
    data() {
      return {
        tableData: [],
        productFrom:{},
        options:[],
        value:"",
        pageno: 1,
        pagesize: 5,
        total: 0,
        firstKindId:"",
        firstKindName:"",
        name:"",
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
        registerTime: ''
      }
    },
    methods: {
      getdata() {   //获取数据
        var _this = this;
        this.$axios.post("/sGather/querySGatherDetails.action").then(function (response) {
          _this.tableData = response.data;
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
      searchproduct() {   //条件查询
        this.getdata();
      },
      resetproduct(){
        this.$refs.productFrom.resetFields();
      }
    },
    created() {
      this.getdata();
    }
  }
</script>

<style scoped>

</style>
