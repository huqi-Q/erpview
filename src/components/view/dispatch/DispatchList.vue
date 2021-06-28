<template>
  <div>
    <!--表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="manufactureId"
        label="生产派工单序号"
        width="180">
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
        prop="amount"
        label="投产数量">
      </el-table-column>
      <el-table-column
        label="合格数量">
        <template>
          <span>生产中</span>
        </template>
      </el-table-column>
      <el-table-column
        label="派工单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.checkTag =='S001-0'" style="color:orange">等待</span>
          <span v-else-if="scope.row.checkTag == 'S001-1'" style="color:greenyellow">通过</span>
          <span v-else style="color:orange">等待</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.checkTag =='S001-0'" style="color:orange">等待</span>
          <span v-else-if="scope.row.checkTag == 'S001-1'" style="color:greenyellow">通过</span>
          <span v-else style="color:orange">等待</span>
        </template>
      </el-table-column>
      <el-table-column
        label="生产状态">
        <template slot-scope="scope">
          <span v-if="scope.row.manufactureProcedureTag =='S002-0'" style="color:orange">等待</span>
          <span v-else-if="scope.row.manufactureProcedureTag == 'S002-2'" style="color:black">执行</span>
          <span v-else style="color:orange">等待</span>
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
    name: "DispatchList",
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
        registerTime: '',
      }
    },
    methods: {
      getdata() {   //获取数据
        var _this = this;


        this.$axios.post("/mManufacture/selectAll").then(function (response) {
          _this.tableData = response.data;
          // _this.total = response.data.total;
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
      resetproduct(name){
        this.$refs[name].resetFields()
        this.dialogVisible = false;
      },
      shsjd(row){
        var _this = this;
        var params = new URLSearchParams();
        params.append("id", row.id);
        this.$confirm('确定审核产品:  '+row.productName+' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/mDesignProcedure/updateProcedure", params).then(function (response) {
            if(response.data==true){
              _this.$message.success({
                message: '恭喜你,审核成功',
                type: 'success'
              });
            }
          }).catch();

          _this.getdata();
          this.zdwinshow = false;
        }).catch(() => {
          _this.$message({
            message: '取消审核,审核失败',
            type: 'warning'
          });
        });


      }
    },
    created() {
      this.getdata();
    }
  }
</script>

<style scoped>

</style>

