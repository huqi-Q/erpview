<template>
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
        name: "ProcessFormulate"
    }
</script>

<style scoped>

</style>
