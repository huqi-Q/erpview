<template>
<div>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>出库申请登记</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <el-form  :modal="scFrom">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <strong style="margin-right: 20px">出库人
            <input class="xhx" style="width:300px"></input>
          </strong>
          <br>
          <br>
          <strong >设计人:</strong>
          <input class="xhx" style="width:300px"></input>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <strong>出库理由

            <select name="" id="">
              <option>亲选择</option>
              <option>赠送</option>
            </select>
          </strong>
        </div>
      </el-col>
    </el-row>
    <br>
    <!--生产工序-->
    <div>
      <el-table :data="scgxtableData" stripe border :cell-style="changeCellStyle" style="width: 100%">
        <el-table-column prop="typeName" label="工序名称" width="180">
        </el-table-column>
        <el-table-column prop="typeId" label="工序编号"></el-table-column>
        <el-table-column prop="register" label="描述"></el-table-column>
        <el-table-column label="工时数">
          <template slot-scope="scope">
            <input class="mbk" type="text"></input>
          </template>
        </el-table-column>
        <el-table-column
          label="工时单位">
          <template slot-scope="scope">
            <input class="mbk" type="text"></input>
          </template>
        </el-table-column>
        <el-table-column
          label="单位工时成本">
          <template slot-scope="scope">
            <input class="mbk" type="text"></input>
          </template>
        </el-table-column>
        <el-table-column
          prop="responsiblePerson"
          label="工时成本小计(元)">
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

    <div>
      <el-button @click="tjgxtb">添加工序</el-button>
      <el-button @click="scgx">sc</el-button>
    </div>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="zdwinshow = false">取 消</el-button>
    <el-button type="primary" @click="scgx">确 定</el-button>
  </div>
  </el-card>
</div>
</template>

<script>
    export default {
        name: "Outboundapplicationregistration",
      data() {
        return {
          scFrom: [],
          zdwinshow: false,
          currentTime: "",
          scgxtableData: [],
          CapacityAmount: ""
        }
        }, methods: {
        scgx(){ //确定

        },tjgxtb(){ //添加工序

        },scgx(){ //scgx

        }

      }
    }
</script>

<style>

</style>
