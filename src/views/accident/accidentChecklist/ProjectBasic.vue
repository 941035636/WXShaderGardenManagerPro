<template>
  <div id="ProjectBasic" class="wrapper">
    <div class="wrap-content">
      <div class="right-bottm">
        <el-scrollbar style="height:100%">
          <div class="bottom-conten">
            <div class="t-box">



              <div class="t-title" style="display: flex; align-items: center; justify-content: space-between;">模板信息
                <el-button class="button" @click="backClick()">
                  返回上一页
                </el-button>
              </div>
              <div class="t-content">
                <el-row>
                  <el-col :span="24">
                    <span class="question">模板名称：</span>
                    <span>{{ topicBasic.title }}</span>
                  </el-col>
                  <el-col :span="24">
                    <span class="question">检查表类型：</span>
                    <span>专家检查表</span>
                  </el-col>
                  <el-col :span="24">
                    <span class="question">适用行业：</span>
                    <span>{{ topicBasic.Ind }}</span>
                  </el-col>
                  <el-col :span="24">
                    <span class="question">适用地区：</span>
                    <span>{{ topicBasic.areaName }}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="site-box">
              <div class="t-title">
                <div class="fl-left">
                  <h2 class="title-hig">检查项目信息</h2>
                </div>
                <div v-if="!psState" class="fl-right">
                  <div class="button skyblue" @click="configProject">创建检查项目
                    <i class="el-icon-plus f24 icon-col"></i>
                  </div>
                </div>
              </div>
              <div class="t-content" v-if="topicList != []">
                <ul>
                  <li v-for="(item, index) in topicList" :key="index" class="sites" draggable="true"
                    @dragstart="drag(index)" @dragend="dragend(index)" @dragenter="dragenter(index)">
                    <div class="icon-error" v-if="!psState" @click="open(item.id, item.questionNum)"><i
                        class="el-icon-close f24 icon-ft"></i></div>
                    <div class="s-box">
                      <div style="text-align: center;">
                        <p>
                          <el-tooltip class="fl" :content="item.name" placement="top">
                            <span class="skyblue row-factor" @click="creatProgram(item)">{{ item.name }}</span>
                          </el-tooltip>
                          <span class="skyblue" v-if="!psState" @click="siteTopic(item)"><i
                              class="el-icon-edit-outline f24 pl10 icon-col"></i></span>
                          <span class="skyblue" v-else><i class=" f24 pl10 icon-col"></i></span>
                        </p>
                        <p><span class="question">共{{ item.questionNum }}个题目</span></p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import accidentCheckService from "@/service/accidentCheckService.js";

export default {
  props: {
    topicList: {
      type: Array,
      required: true,
      default: () => {
        return {}
      }
    },
    topicBasic: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    psState: {
      type: String,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      accidentCheck: new accidentCheckService(), // Service
      dialogFormVisible: false,
      title: "",
      state: "",
      current: 0,
      active: 0,
      list: [],
      siteForm: {
        placeName: "",
      }
    }
  },
  created() {
    console.log("999999", this.$route.query.state)
    console.log(this.topicList)
  },
  methods: {

    backClick() {
      this.$router.go(-1)
    },

    configProject() {  // 创建检查项
      this.$emit("creatInfo", '2')
    },
    creatProgram(val) {
      this.$router.push({
        path: "/QuestionsList",
        query: {
          id: this.$route.query.id,
          topicId: val.id
        }
      })
    },
    siteTopic(val) {  // 编辑检查项，val为当前项集合
      console.log(val)
      this.$emit("creatInfo", val)
    },
    async delTopic(id) { // 删除检查项
      let res = await this.accidentCheck.delCheckGroup(id);
      if(res.code == '0000') {
        let arry = this.topicList;
        for (let i = 0; i < arry.length; i++) {
          if (arry[i].id == id) {  // 删除的指定项
            arry.splice(i, 1);
          }
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        await this.sortList(arry)
      }
    },
    async sortList(arry) {   // 输出以后的数组赋值字段
      for (let i = 0; i < arry.length; i++) {
        arry[i].sort = i + 1;  // 从新给sort赋值
        arry[i].templateCode = this.topicBasic.templateCode; // 模板code
      }
      this.$parent.getTopList();  // 调用父组件的列表接口
      if(arry.length) {
        this.siteData(arry)
      }
    },
    open(id, num) {
      let firmName = ""
      if (num) {
        firmName = `<p class="firmCol">该项目下存在试题，删除后试题将会全部删除，是否继续</p>`
      } else {
        firmName = "删除模板项目，是否继续？"
      }
      this.$confirm(firmName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        center: true,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.delTopic(id)
      }).catch(() => { });
    },
    drag(k) {
      this.current = k
      console.log('来了第' + k + '个')
    },
    dragend() {
      var current_sortId = this.topicList[this.current].sort;
      var active_sortId = this.topicList[this.active].sort;
      var current = this.topicList[this.current];
      var active = this.topicList[this.active];
      current.sort = active_sortId;
      active.sort = current_sortId;
      this.topicList[this.active] = current_sortId;
      this.topicList[this.current] = active_sortId
      this.$set(this.topicList, this.active, current)
      this.$set(this.topicList, this.current, active)
      var arry = JSON.parse(JSON.stringify(this.topicList));
      for (let i = 0; i < arry.length; i++) {
        arry[i].templateCode = this.topicBasic.templateCode; // 模板code
      }
      this.siteData(arry)
      console.log(arry, '拖拽排序数据')
    },
    async siteData(Array) {  // 编辑检查项
      let res = await this.accidentCheck.putCheckGroup(Array)  // 修改接口
      console.log("7878", res)
    },
    dragenter(k) {
      this.active = k;
      console.log('进入了第' + k + '个')
    },
  }
};
</script>
<style lang='less'>
.firmCol {
  color: #F56C6C;
}

#ProjectBasic {
  .wrap-content {
    background: #fff;
  }

  .t-box {
    line-height: 42px;

    .t-title {
      padding: 0 30px;
      font-size: 20px;
    }

    .t-content {
      padding: 0 30px 20px;
    }
  }

  .site-box {
    padding: 0 30px;
    padding-bottom: 20px;

    .t-title {
      width: 300px;
      overflow: hidden;
      margin-bottom: 15px;
      
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

    .t-content {
      ul {
        max-width: 900px;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-wrap: wrap;

        .sites {
          padding: 10px 10px;
          margin-right: 30px;
          width: 250px;
          position: relative;

          .s-box {
            // height: 80px;
            border: 1px solid #DDDDDD;
            padding: 15px 20px;
            line-height: 40px;
            color: #606266;
          }

          .icon-error {
            background: #F5F5F5;
            position: absolute;
            top: 11px;
            right: 11px;
            border-radius: 0 0 0 10px;
          }

          .icon-ft {
            font-weight: 800;
            color: #666666;
            cursor: pointer;
          }
        }
      }
    }
  }

  .row-factor {
    width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 50px;
  }

  .skyblue {
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
  }

  .icon-col {
    color: #6882D7;
  }

  .question {
    color: #A1A1A1;
  }
}
</style>