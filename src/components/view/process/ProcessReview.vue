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
        prop="id"
        label="设计单序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="designId"
        label="设计单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productId"
        label="产品编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="register"
        label="设计人">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        label="登记时间">
      </el-table-column>
      <el-table-column
        prop="costPriceSum"
        label="工时成本">
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
  </div>
</template>

<script>
    export default {
        name: "ProcessReview",
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
          var params = new URLSearchParams();
          params.append("pageno", this.pageno);
          params.append("pagesize", this.pagesize);

          // params.append("name", this.name);
          // params.append("productName", this.productName);


          this.$axios.post("/mDesignProcedure/queryallProcedure1", params).then(function (response) {
            _this.tableData = response.data.records;
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
