<template>
  <div id="EditExpress">

    <div class="ibox-content">
      <el-form :inline="true" :rules="rules" ref="ruleForm" :model="ruleForm">
        <el-form-item label="标题：" prop="title" label-width="166px">
          <el-input placeholder="请输入标题名称" class="wit40" v-model.trim="ruleForm.title" maxlength="100"></el-input>
          <span @click="addTopic"></span>
          <!-- <i class="el-icon-circle-plus-outline f24"></i> -->
        </el-form-item>
        <ul style="width:617px;">
          <li class="li-box" v-for="(item, index) in ruleForm.list" :key="index">
            <el-form-item :prop="'list.' + index + '.flag'"
              :rules="{ required: true, message: '请选择选项', trigger: 'change' }">
              <!-- <el-switch
                v-model="item.flag"
                active-color="#6783D6"
                active-text=""
                inactive-color="#999999"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
              <span v-if="item.flag">正确</span>
              <span v-if="!item.flag">错误</span> -->
              <el-select style="width:112px" v-model="item.flag" placeholder="请选择" disabled>
                <el-option v-for="item in flafList" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选项：" label-width="68px" :prop="'list.' + index + '.option'"
              :rules="{ required: true, message: '请输入选项', trigger: 'change' }">
              <el-input v-model.trim="item.option" placeholder="请输入选项" class="wit51" maxlength="5"></el-input>
              <span @click="deleteTopic(index)"></span>
              <!-- <i class="el-icon-remove-outline f24"></i> -->
            </el-form-item>

            <el-form-item v-if="item.flag == '2'" label="隐患级别：" label-width="194px" :required="true">
              <!-- <el-button @click="newhidFu(index)" style="display:block;">增加</el-button>
              <el-input v-for="(listItem, listIndex) in item.hiddlist" :key="listIndex" placeholder="请输入选项"
                class="wit51" maxlength="30" v-model.trim="listItem.hiddenName"></el-input> -->


              <el-radio-group class="wit51">
                <el-radio v-for="(listItem, index) in item.hiddlist" :key="listItem.hiddenFlag"
                  :label="listItem.hiddenName" disabled>

                  
                  {{ listItem.hiddenName }}
                </el-radio>
              </el-radio-group>



            </el-form-item>

            <el-form-item v-if="item.flag == '2'" label="整改意见：" label-width="194px" :prop="'list.' + index + '.idea'"
              :rules="{ required: true, message: '输入整改意见', trigger: 'blur' }">
              <el-input v-model.trim="item.idea" placeholder="请输入整改意见" class="wit51" type="textarea"
                maxlength="300"></el-input>
            </el-form-item>
            <el-form-item v-if="item.flag == '2'" label="依据：" label-width="194px" :prop="'list.' + index + '.basis'"
              :rules="{ required: true, message: '请输入依据', trigger: 'blur' }">
              <el-input v-model.trim="item.basis" placeholder="请输入依据" class="wit51" type="textarea"
                maxlength="300"></el-input>
            </el-form-item>
          </li>
        </ul>
      </el-form>
    </div>
  </div>
</template>
<script>
import accidentCheckService from "@/service/accidentCheckService.js";
export default {
  props: {
    ruleForm: {
      default: function () {
        return {}
      },
      required: true,
    },
  },
  data() {
    return {
      title: "创建检查内容",
      accidentCheck: new accidentCheckService(), // Service
      flafList: [{ name: "不涉及项", code: 0 }, { name: "正确项", code: 1 }, { name: "问题项", code: 2 }],
      rules: {
        title: [{ required: true, message: "请输入标题名称", trigger: "change" }],
      },

      fileList: [],
    }
  },
  mounted() {
    console.log("123123---------", this.ruleForm.list)
  },
  methods: {

    //增加隐患级别
    newhidFu(index) {
      let questionList = {
        hiddenName: "",
        hiddenFlag: this.ruleForm.list[index].hiddlist.length + 1,
      }
      console.log(index, this.ruleForm.list, '---------');
      this.ruleForm.list[index].hiddlist.push(questionList);
    },

    addTopic() { // 添加试题
      this.ruleForm.list.push({
        flag: "",
        option: "",
        idea: "",
        basis: "",
        trou: "",//隐患级别
      })
    },
    deleteTopic(index) { // 删除试题
      this.ruleForm.list.splice(index, 1)
    },
    sava() {  //验证页面必填项
      let flag = false
      this.$refs['ruleForm'].validate((valid) => {
        flag = valid
      })

      // if (this.ruleForm.list[1].hiddlist.length == 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '请输入隐患级别,最少两个,最多不可超过五个!',
      //   });
      //   flag = false
      // } else {
      //   if (this.ruleForm.list[1].hiddlist.length < 2) {
      //     this.$message({
      //       type: 'error',
      //       message: '隐患级别,最少两个,最多不可超过五个!',
      //     });
      //     flag = false
      //   } else if (this.ruleForm.list[1].hiddlist.length > 5) {
      //     this.$message({
      //       type: 'error',
      //       message: '隐患级别,最少两个,最多不可超过五个!',
      //     });
      //     flag = false
      //   }
      // }

      console.log(this.ruleForm.list[1], 'sava');

      return flag
    }
  }
}
</script>
<style lang="less">
#EditExpress {
  .wit40 {
    width: 397px;
  }

  .li-box {
    margin-left: 54px;
  }

  .wit51 {
    width: 316px;
  }
}
</style>
