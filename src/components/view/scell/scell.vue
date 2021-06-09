<template>
  <div>

    <!--  条件查询-->
    <el-form :inline="true">
      <el-form-item label="请选择产品I级分类">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
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
        <el-input placeholder="请输入备注" clearable v-model="remark"></el-input>
      </el-form-item>
      <el-form-item label="请选择工序设计单状态">
        <el-input placeholder="请输入备注" clearable v-model="remark"></el-input>
      </el-form-item>
      <el-form-item label="请输入登记时间">
        <div class="block">
          <el-date-picker
            v-model="value2"
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

      <el-button type="success" @click="searchcartype">查询</el-button>
    </el-form>


    <!--表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
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
        prop="productName"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="checkTag"
        label="设计单状态">
        <template slot-scope="scope">
                    <span v-if="scope.row.checkTag =='S001-0'"
                          style="color:lawngreen"
                    >执行</span>
          <span
            v-else-if="scope.row.checkTag == 'S001-1'"
            style="color:black"
          >完成</span>
          <span
            v-else
            style="color:orange"
          >等待</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkTag"
        label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.checkTag =='S001-0'" style="color:lawngreen">等待</span>
          <span v-else-if="scope.row.checkTag == 'S001-1'" style="color:black">通过</span>
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
  </div>
</template>

<script>
  export default {
    name: "scell",
    data() {
      return {
        tableData: [],
        options:[],
        pageno: 1,
        pagesize: 5,
        total: 0,
        name: "",
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


        this.$axios.post("queryallcartype.action", params).then(function (response) {
          _this.tableData = response.data.records;

          //修改图片地址  追加前缀
          _this.tableData.forEach((item) => {
            item.img = "http://localhost:8888/" + item.img;
          })


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
      }
    },
    created() {
      this.getdata();
    }
  }
</script>

<style scoped>

</style>
