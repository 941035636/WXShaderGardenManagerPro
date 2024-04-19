<template>
  <div id="QuestionsList">
    <div class="wrap-content">
      <ProjectBasic :topicBasic="basicForm" :topicList="detailList" :psState="state"></ProjectBasic>
      <div class="titles">
        <div class="fl-left">
          <h2 class="title-hig">检查内容信息</h2>
        </div>
        <div class="fl-right">
          <div class="button skyblue" @click="configProject">创建项目试题
            <i class="el-icon-plus f24 icon-col"></i>
          </div>
        </div>
      </div>

      <div class="content">
        <el-table :data="tableList" style="width: 96%;margin:0 2%;" border :header-cell-style="getRowClass" stripe>
          <el-table-column prop="title" label="标题" min-width="280">
          </el-table-column>
          <el-table-column prop="state" label="选项" min-width="580">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.list" :key="index">
                <span class="btn_stu">{{ index + 1 }};</span>
                <span class="btn_stu">
                  <el-tooltip :content="item.idea" placement="top">
                    <span class="wid12 row-factor">{{ item.option }};</span>
                  </el-tooltip>
                </span>

                <!-- <span class="btn_stu"><span class="te-col">隐患级别：</span>

                <el-tooltip  placement="top">
                  <span class="wid11 row-factor" 
                    v-for="(listItem, index) in item.hiddlist" :key="listItem.hiddenFlag"
                    :label="listItem.hiddenName"
                    >{{ listItem.hiddenName }};</span>
                  </el-tooltip>
                  
                    
                  
                </span> -->


                <span class="btn_stu"><span class="te-col" :style="item.flag!=2?'color:#fff;opacity:0;':''">整改意见：</span>
                  <el-tooltip :content="item.idea" placement="top">
                    <span class="wid11 row-factor" :style="item.flag!=2?'color:#fff;opacity:0;':''">{{ item.idea }};</span>
                  </el-tooltip>
                </span>
                <span class="btn_stu"><span class="te-col" :style="item.flag!=2?'color:#fff;opacity:0;':''" >依据：</span>
                  <el-tooltip :content="item.idea" placement="top">
                    <span class="wid11 row-factor" :style="item.flag!=2?'color:#fff;opacity:0;':''">
                      {{ item.basis }};
                    </span>
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button @click="shenhe(scope.row)" type="text">编辑</el-button>
              <el-button @click="open(scope.row.id)" type="text" style="color:#000">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <BasePagenations :tolnum="tolnum" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></BasePagenations> -->
      </div>
      <el-dialog class="box-aler" :title="dialogTitle" :visible.sync="centerDialogVisible" width="900px" center>
        <CreateTopic ref="createTopic" :detailList="detailList" :ruleForm="ruleForm"></CreateTopic>
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button round @click="centerDialogVisible = false">取 消</el-button>
          <el-button round type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ProjectBasic from "./ProjectBasic";  // 项目的基本信息
import CreateTopic from "./CreateTopic";  // 创建试题
import accidentCheckService from "@/service/accidentCheckService.js";
import { CodeToText, } from 'element-china-area-data'
export default {
  data() {
    return {
      accidentCheck: new accidentCheckService(), // Service
      centerDialogVisible: false,
      dialogTitle: "",
      detailList: [],
      tableList: [], //题目集合
      state: "1",
      basicForm: {},
      total: "", // 总条数，用于排序字段
      siteForm: {
        placeName: "",
      },
      oldForm: {}, // 编辑是暂存数据，为了对比数据是否修改过
      ruleForm: {
        title: "",
        list: [
          {
            flag: 1,  // 
            option: "符合",  // 选项
            // idea:"",  // 整改意见
            // basis:"",  // 依据
          }, {
            flag: 2,  // 
            option: "不符合",  // 选项
            idea: "",  // 整改意见
            basis: "",  // 依据
            hiddlist: [{
              hiddenName: "一般隐患",
              hiddenFlag: 1,
            },

            {
              hiddenName: "重大隐患",
              hiddenFlag: 2,
            }],//隐患级别
          }, {
            flag: 0,  // 
            option: "不涉及",  // 选项
            // idea:"",  // 整改意见
            // basis:"",  // 依据
          }],
      },
    }
  },
  watch: {
    centerDialogVisible: {
      handler(culVla, oldVal) {
        if (!culVla) {
          this.ruleForm = {
            title: "",
            list: [{
              flag: 1,  // 
              option: "",  // 选项
              // idea:"",  // 整改意见
              // basis:"",  // 依据
            }, {
              flag: 2,  // 
              option: "",  // 选项
              idea: "",  // 整改意见
              basis: "",  // 依据
              hiddlist: [{
                hiddenName: "一般隐患",
                hiddenFlag: 1,
              },

              {
                hiddenName: "重大隐患",
                hiddenFlag: 2,
              }],//隐患级别
            }, {
              flag: 0,  // 
              option: "",  // 选项
              // idea:"",  // 整改意见
              // basis:"",  // 依据
            }],
          }
        }
      }
    }
  },
  components: {
    ProjectBasic, CreateTopic,
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.accidentCheck.dilsCheckTep(this.$route.query.id) // 获取模板详情接口
      if (res.code == "0000") {
        var detail = res.data;
        let industry = JSON.parse(detail.industry)  // 转换返回的json字符串
        detail['Ind'] = industry.map(it => {  // 行业用逗号拼接，方便展示
          return it.name
        }).join(",")
        if (detail.areaCode == "000000") {    // 自定义全国编码
          detail['areaName'] = "全国"
        } else {
          detail['areaName'] = CodeToText[detail.areaCode];  // 地区编码转换，展示使用
        }
        this.basicForm = detail;
      }
      this.getTopList();
    },
    async getTopList() { // 获取题目列表
      let data = {
        templateCode: this.basicForm.templateCode
      }
      let rest = await this.accidentCheck.getChecList(data) // 获取添加的检查项列表
      if (rest.code == "0000") {
        let id = this.$route.query.topicId;
        this.detailList = rest.list.filter(item => item.id == id);
      }
      this.getList();
    },
    async getList() { // 请求试题列表
      let data = {
        groupCode: this.detailList[0].groupCode,
        questionCode: "",
        id: "",
      }
      let res = await this.accidentCheck.getQuestion(data)
      if (res.code == "0000") {
        res.list.forEach(item => {   // 转换后台返回的json为数组
          item.list = JSON.parse(item.options)
        })
        this.tableList = res.list;
        this.total = res.total;
      }
      console.log(this.tableList)
    },
    shenhe(val) { // 编辑
      this.centerDialogVisible = true;
      this.dialogTitle = "编辑检查内容"
      this.oldForm = JSON.parse(JSON.stringify(val));
      this.ruleForm = val;
    },
    sortField() {  // 排序字段
      let arr = this.tableList;
      for (let i = 0; i < arry.length; i++) {
        arry[i].sort = i + 1;  // 从新给sort赋值
      }
    },
    formContrast() {  // 表单对比
      let contrast = false;
      let oldForm = JSON.stringify(this.oldForm); // 旧表单数据
      let culForm = JSON.stringify(this.ruleForm); // 是否修改表单数据
      console.log("000", oldForm)
      console.log("111", culForm)
      if (oldForm != culForm) {
        contrast = true;
      }
      return contrast;
    },
    async subtopic() {  // 创建试题
      let data = [{
        createBy: sessionStorage.getItem("userName"), // 创建人 ,
        groupCode: this.detailList[0].groupCode, //  检查项code ,
        optionMaps: this.ruleForm.list,  // 问题选项map,
        options: "1", // 问题选项 ,
        sort: this.total + 1, // 问题排序 ,
        sort: this.detailList[0].sort, // 问题排序 ,
        title: this.ruleForm.title,  // 题目 ,
        type: "1", // 题目类型 ,
        fileIds: [],
      }]
      let res = await this.accidentCheck.subQuestion(data)
      if (res.code == "0000") {
        this.centerDialogVisible = false;
        this.$message({ message: '创建成功', type: 'success' })
        this.getData();  // 列表接口
      }
    },
    async editTopic() {
      let data = [{
        groupCode: this.detailList[0].groupCode, //  检查项code ,
        id: this.ruleForm.id, // 更新时传入 ,
        optionMaps: this.ruleForm.list,  // 问题集合,
        options: "1", // 问题选项 ,
        sort: this.ruleForm.questionSort, // 问题排序 ,
        title: this.ruleForm.title,  // 题目 ,
        type: "1", // 题目类型 ,
        questionCode: this.ruleForm.code,  // 试题code
        updateBy: sessionStorage.getItem("userName"),  //更新人
        fileIds: [],
      }]
      let res = await this.accidentCheck.putQuestion(data)
      if (res.code == "0000") {
        this.centerDialogVisible = false;
        this.$message({ message: '修改成功', type: 'success' })
        this.getData();  // 列表接口
      }
    },
    async delTopic(id) { // 删除试题
      let res = await this.accidentCheck.delQuestion(id);
      if (res.code == "0000") {
        this.getData(); // 列表接口 
      }
    },
    open(id) {
      this.$confirm('删除项目试题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        this.delTopic(id)
      }).catch(() => { });
    },
    configProject() {
      this.centerDialogVisible = true;
      this.dialogTitle = "创建检查内容"
    },
    ruleFlag() {  //判断选择的正确答案（正确答案只能有一个）
      let flag = ""
      let arr = this.ruleForm.list;
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (item.flag == "1") {
          flag++;
        }
      }
      return flag
    },
    submit() {
      if (this.ruleFlag() == "1") {   // 判断正确答案是否有几个(正确答案只能有一个)
        if (this.$refs.createTopic.sava()) {  // 判断页面填写是否符合规则
          if (this.ruleForm.id) {  // form中含有id字段，为编辑
            if (this.formContrast()) {
              this.editTopic(); // 编辑
            } else {
              this.$message({ message: '请修改内容再提交', type: 'error' })
            }
          } else {
            this.subtopic(); //  提交
          }
        }
      } else {
        this.$message({ message: '必须选择一个正确答案', type: 'error' })
      }
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
<style lang='less' scoped>
#QuestionsList {
  margin: 20px;
  .wrap-content {
    background: #fff;
  }

  .content {
    padding-bottom: 20px;
  }

  .titles {
    padding: 0 30px;
    margin-bottom: 15px;
    width: 300px;
    overflow: hidden;

    .fl-left {
      float: left;
    }

    .fl-right {
      float: right;
    }

    h2 {
      font-size: 20px;
      padding-top: 5px;
    }

    .button {
      width: 170px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #6584D7;
      border-radius: 5px;
      color: #6584D7;
    }
  }

  .wid7 {
    width: 70%;
  }

  .te-col {
    color: #6584D7;
  }

  .skyblue {
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
  }

  .wid11 {
    display: inline-block;
    width: 30%;
    vertical-align: top;
  }

  .wid12 {
    display: inline-block;
    width: 10%;
    vertical-align: top;
  }

  .row-factor {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>