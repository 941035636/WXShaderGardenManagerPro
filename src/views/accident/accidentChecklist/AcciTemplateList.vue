<template>
  <div id="AcciTemplateList">
    <div class="elesearch">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-input placeholder="请输入安全排查表名称" v-model.trim="ruleForm.title" class="item2" clearable></el-input>
        </el-col>

        <el-col :span="8">

          <el-select v-model="ruleForm.templateType"  class="item2" multiple :multiple-limit="10"
             placeholder="请选择检查表类型"  @change="$forceUpdate()">
            <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>

        </el-col>

        <span class="query-button" @click="getDate">搜索</span>
      </el-row>

    </div>
    <div class="content">
      <div class="stBtn">
        <span class="query-button" @click="goCreate">创建检查表</span>
      </div>
      <el-table :data="tableData" style="width: 100%;border:1px solid #ECECEC" :header-cell-style="getRowClass" stripe>
        <el-table-column prop="title" label="模板名称" min-width="250">
          <template slot-scope="scope">
            <el-button @click="goConfig(scope.row.id)" type="text">{{ scope.row.title }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="templateType" label="检查表类型" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            
            <span v-if="scope.row.templateTypeList.indexOf(1) != -1">专家检查表</span>
            <span v-if="scope.row.templateTypeList.indexOf(2) != -1">企业检查表</span>
            <span v-if="scope.row.templateTypeList.indexOf(4) != -1">行管检查表</span>
          </template>
        </el-table-column>
        <el-table-column prop="templateStatus" label="模板状态" min-width="80">
          <template slot-scope="scope">
            <span class="btn_stu">{{ scope.row.templateStatus == '1' ? "启用" : "停用" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Ind" label="适用行业" show-overflow-tooltip width="250"></el-table-column>
        <el-table-column prop="provinceName" label="适用区域" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="createName" label="操作人" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button @click="shenhe(scope.row)" type="text">编辑</el-button>
            <el-button @click="open(scope.row.id)" type="text" style="color:#000">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <BasePagenations :tolnum="tolnum" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </BasePagenations>
    </div>

    <AcciInventory ref="AcciInventory" @upData="upData"></AcciInventory>

  </div>
</template>
<script>
import AcciInventory from "./AcciInventory";
import accidentCheckService from "@/service/accidentCheckService.js";
import { CodeToText, } from 'element-china-area-data'
export default {
  data() {
    return {
      tolnum: 0,
      accidentCheck: new accidentCheckService(), // Service
      ruleForm: {
        title: "",
        pn: "1",
        ps: "10",
        templateType: []
      },
      tableData: [],
      typeList: [{ name: "专家检查表", code: 1 }, { name: "企业检查表", code: 2 }, { name: "行管检查表", code: 4 }],
    };
  },
  components: {
    AcciInventory,
  },
  created() {
    this.getDate();
  },
  methods: {

    templateTypeAll() { //获取检查表类型
      let arr = 0;
      this.ruleForm.templateType.map(item => {
        arr = arr + Number(item)
      })
      return arr;
    },


    async getDate() { // 初始化列表数据
      let obj = {
        title:this.ruleForm.title,
        pn: this.ruleForm.pn,
        ps: this.ruleForm.ps,
        templateType:this.ruleForm.templateType.length!=0?this.templateTypeAll():''
      }
      
      let res = await this.accidentCheck.getCheckTep(obj) // 请求列表接口
      if (res.data.code == "0000") {
        this.tolnum = res.data.total;
        res.data.list.forEach(item => {
          // let areaMap = JSON.parse(sessionStorage.getItem('areaMap'));
          item['provinceName'] = CodeToText[item.areaCode]  // 转换地区编码为中文；
          if (item.areaCode == "000000") {    // 自定义全国编码
            item['provinceName'] = "全国"
          }
          let industry = JSON.parse(item.industry)  //  行业集合获取行业名称用逗号拼接
          console.log(industry)
          if (industry) {
            item['Ind'] = industry.map(it => {
              return it.name
            }).join(",")
          }
        })
        this.tableData = res.data.list;
        console.log(this.ruleForm,'this.ruleForm')
      }
    },
    async delTemp(id) { // 删除接口调用
      let res = await this.accidentCheck.delCheckTep(id)
      if (res.data.code == "0000") {  // 删除成功后调用初始化方法
        this.getDate();
      }
    },
    goCreate() {  // 创建检查表
      let obj = {
        templateType: [1],
        title: "",
        templateStatus: 1,
        areaCode: "", // 选择的省市区集合
        oneInd: "", // 选择的一级行业类型
        twoInd: [], // 选择的二级行业类型（数组）
      }
      this.$refs.AcciInventory.centerDialogVisible = true;
      this.$refs.AcciInventory.title = "创建检查表";
      this.$refs.AcciInventory.ruleForm = obj;
    },
    shenhe(val) { // 编辑检查表
      console.log(val, '--117--val');
      this.$refs.AcciInventory.centerDialogVisible = true;
      this.$refs.AcciInventory.title = "编辑检查表";
      let obj = JSON.parse(JSON.stringify(val));  // 深拷贝赋值
      obj.templateType =val.templateTypeList // 编辑检查表回显使用
      let arr = JSON.parse(obj.industry);  // 后台返回为一级加二级行业组合的json
      obj.oneInd = arr[0].code;  // 第0个永远是一级行业，赋值给字段回显
      obj.twoInd = arr.filter(item => obj.oneInd != item.code).map(it => { return it.code }) // 剩下的味二级行业，赋值给字段
      this.$refs.AcciInventory.oldForm = obj;
    },
    upData(val) {  //  修改或者创建成功以后，重新调用列表
      this.getDate();
    },
    goConfig(id) {  // 点击名称跳转模板信息页面
      this.$router.push({
        path: "/AccModConfig",
        query: {
          id: id
        }
      })
    },
    open(id) {
      this.$confirm('删除该检查表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.delTemp(id)
      }).catch(() => { });
    },
    handleSizeChange(val) {
      this.ruleForm.ps = val;
      this.getDate();
    },
    handleCurrentChange(val) {
      this.ruleForm.pn = val;
      this.getDate();
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F0F1F6";
      } else {
        return "";
      }
    },
  }
};
</script>

<style lang="less">
#AcciTemplateList {
  box-sizing: border-box;
  background-color: #ffffff;

  .elesearch {
    width: 100%;
    margin: 20px 0;
    background-color: #fff;
    padding: 20px 30px;
    box-sizing: border-box;

    .row-bg {
      line-height: 40px;

      .item1 {
        display: block;
        width: 10%;
        text-align: center;
      }

      .item2 {
        width: 90%;
      }

      .item3 {
        font-size: 14px;
        color: #666666;
        display: block;
        width: 25%;
        text-align: right;
        padding-right: 10px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item5 {
        width: 30%;
      }
    }
  }

  .query-button {
    display: inline-block;
    width: 120px;
    height: 40px;
    background-color: #6783D6;
    text-align: center;
    line-height: 40px;
    color: #ffffff;
    font-weight: 600;
    cursor: pointer;
    border-radius: 60px;
  }

  .el-input--prefix .el-input__inner {
    padding: 0 15px !important;
  }

  .el-input__prefix {
    display: none;
  }

  .stBtn {
    float: right;
    margin: 0 20px 20px 0;
  }
}
</style>
