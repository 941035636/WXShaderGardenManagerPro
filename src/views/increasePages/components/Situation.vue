<template>
  <div id="Situation">

    <!-- 外勤人员 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
      <el-form-item label="外勤人员" prop="fieldPersonnelArray">
        <el-select v-model="ruleForm.fieldPersonnelArray" placeholder="请选择外勤人员" class="item1" size="medium" filterable
          clearable>
          <el-option v-for="item in reasonWxEnum" :key="item.userCode" @click.native="handleSelectTeam(item)"
            :label="item.userName + '/' + item.userLoginId" :value="item.employeeNum"></el-option>
        </el-select>

        <div class="set-box" v-show="oneBranchName">
          <i class="PeoBj"></i>
          <span style="margin-right:8px">所属机构:</span>
          <span>{{ oneBranchName }}</span>
        </div>

      </el-form-item>


      <el-form-item label="加入时间" prop="sellTime">
        <el-date-picker format="yyyy-MM-dd" placeholder="选择日期时间" type="datetime" v-model="ruleForm.sellTime"
          value-format="yyyy-MM-dd" :picker-options="expireTimeOPtion">
        </el-date-picker>

      </el-form-item>


      <el-form-item label="是否有推荐人" prop="radioBlue">
        <el-radio-group v-model="ruleForm.radioBlue">
          <el-radio :label="1">有推荐人</el-radio>
          <el-radio :label="0">无推荐人</el-radio>
        </el-radio-group>

      </el-form-item>


      <el-form-item label="推荐人" prop="referrerBranchArray" v-if="ruleForm.radioBlue == 1">
        <el-select v-model="ruleForm.referrerBranchArray" placeholder="请输入推荐人" class="item1" size="medium" filterable
          clearable>
          <el-option v-for="item in reasonWxEnum" :key="item.userCode" @click.native="handleSelectTwo(item)"
            :label="item.userName + '/' + item.userLoginId" :value="item.employeeNum"></el-option>
        </el-select>


        <div class="set-box" v-show="twoBranchName">
          <i class="PeoBj"></i>
          <span style="margin-right:8px">所属机构:</span>
          <span>{{ twoBranchName }}</span>
        </div>

      </el-form-item>

    </el-form>

    <div class="submit-box">
      <el-button type="primary" size="small" round class="cancel" @click="onCancel">取消</el-button>
      <el-button type="success" size="small" round class="submit" @click="onSubmit('ruleForm')">确认提交</el-button>
    </div>
  </div>
</template>

<script>
import fieldPerson from "../../../service/fieldPerson.js";
export default {
  props: {
    params: {
      type: Object,
      required: true,
      default: function () {
        return {};
      },
    },
    reasonWxEnum: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      fieldPerson: new fieldPerson(),
      ruleForm: {
        fieldPersonnelArray: "",//外勤人员
        referrerBranchArray: "",//推荐人
        sellTime: "",//选择的时间
        radioBlue: "",//有无推荐人
      },

      expireTimeOPtion: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
        }
      },


      rules: {

        fieldPersonnelArray: [
          {
            required: true,
            message: "请选择外勤人员",
            trigger: "change",
          },
        ],



        sellTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],

        radioBlue: [
          {
            required: true,
            message: "请选择是否有推荐人",
            trigger: 'change'
          },
        ],

        referrerBranchArray: [
          {
            required: true,
            message: "请输入推荐人",
            trigger: "change",
          },
        ],

      },
      oneBranchName: "",
      twoBranchName: "",
    };
  },
  watch: {

    params: {
      handler(newValue) {
        this.oneBranchName = newValue.fieldPersonnelBranchName?newValue.fieldPersonnelBranchName : ""
        this.twoBranchName = newValue.referrerBranchName?newValue.referrerBranchName : ""

        this.ruleForm = {
          fieldPersonnelArray: newValue.fieldPersonnelJobNo ? newValue.fieldPersonnelJobNo : "",//外勤人员
          referrerBranchArray: newValue.referrerJobNo ? newValue.referrerJobNo : "",//推荐人
          sellTime: newValue.fieldPersonnelJoinTime ? newValue.fieldPersonnelJoinTime : "",//选择的时间
          radioBlue: newValue.hasReferrer==="" ?"":newValue.hasReferrer,//有无推荐人
        }

        
        console.log(newValue,'newValue');

      },
      immediate: true,
      deep: true,
    },


    show(newValue) {
      if (newValue) {
        this.$refs["ruleForm"].clearValidate();
      }
    },
  },
  mounted() {

  },
  methods: {

    handleSelectTeam(item) {
      console.log(item);
      this.oneBranchName = item.branchName
    },

    handleSelectTwo(item) {
      this.twoBranchName = item.branchName
    },


    onCancel() {
      this.$emit("sitCancel");
    },




    onSubmit(formName) {

      //1,如果有推荐人，推荐人不能等同于外勤人员


      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.radioBlue == 1) {
            if (this.ruleForm.fieldPersonnelArray == this.ruleForm.referrerBranchArray) {
              this.$message.error("推荐人不能等同于外勤人员");
              return
            }
          }
          console.log('添加或修改', this.params.id);
          if (this.params.id) {
            this.alterFieldPersonnel()
          } else {
            this.createFieldPersonnel()
          }

          this.$refs["ruleForm"].clearValidate();

        } else {
          return false;
        }
      });
    },


    async createFieldPersonnel() {
      let form = {
        "fieldPersonnelBranchCode": "",//外勤人员所属机构编码
        "fieldPersonnelBranchName": "",//外勤人员所属机构名称
        "fieldPersonnelJobNo": "",    //外勤人员员工号
        "fieldPersonnelJoinTime": this.ruleForm.sellTime.length>10?this.ruleForm.sellTime:this.ruleForm.sellTime+" 00:00:00", //外勤人员加入时间
        "fieldPersonnelName": "",    //外勤人员姓名
        "hasReferrer": this.ruleForm.radioBlue,//是否有推荐人标识
        "referrerBranchCode": "",   //推荐人所属机构编码
        "referrerBranchName": "",   //推荐人所属机构名称
        "referrerJobNo": "",        //推荐人员工号
        "referrerName": ""          //推荐人姓名
      }
      console.log('createFieldPersonnel', form, this.ruleForm.fieldPersonnelArray, this.ruleForm.referrerBranchArray);

      if (this.ruleForm.fieldPersonnelArray) {
        this.reasonWxEnum.forEach((item, index) => {
          if (this.ruleForm.fieldPersonnelArray == item.employeeNum) {
            form.fieldPersonnelBranchCode = item.branchCode
            form.fieldPersonnelBranchName = item.branchName
            form.fieldPersonnelJobNo = item.employeeNum
            form.fieldPersonnelName = item.userName
          }
        })
      }

      if (this.ruleForm.radioBlue == 1 && this.ruleForm.referrerBranchArray) {
        this.reasonWxEnum.forEach((item, index) => {
          if (this.ruleForm.referrerBranchArray == item.employeeNum) {
            form.referrerBranchCode = item.branchCode
            form.referrerBranchName = item.branchName
            form.referrerJobNo = item.employeeNum
            form.referrerName = item.userName
          }
        })
      }
      // 通过遍历查询数据
      // 员工号 employeeNum
     
      let res = await this.fieldPerson.createFieldPersonnel(form);
      if (res.code === "0000") {
        this.$message.success("添加外勤人员成功");

        this.ruleForm = {
          fieldPersonnelArray: "",
          referrerBranchArray: "",
          sellTime: "",//选择的时间
          radioBlue: "",//有无推荐人
        },

          this.oneBranchName = ''
        this.twoBranchName = ''

        this.$emit("onSubmit");
      }
    },


    async alterFieldPersonnel() {
      let form = {
        "fieldPersonnelBranchCode": "",//外勤人员所属机构编码
        "fieldPersonnelBranchName": "",//外勤人员所属机构名称
        "fieldPersonnelJobNo": "",    //外勤人员员工号
        "fieldPersonnelJoinTime": this.ruleForm.sellTime.length>10?this.ruleForm.sellTime:this.ruleForm.sellTime+" 00:00:00", //外勤人员加入时间
        "fieldPersonnelName": "",    //外勤人员姓名
        "hasReferrer": this.ruleForm.radioBlue,//是否有推荐人标识
        "referrerBranchCode": "",   //推荐人所属机构编码
        "referrerBranchName": "",   //推荐人所属机构名称
        "referrerJobNo": "",        //推荐人员工号
        "referrerName": ""          //推荐人姓名
      }
      console.log(form);
      if (this.ruleForm.fieldPersonnelArray) {
        this.reasonWxEnum.forEach((item, index) => {
          if (this.ruleForm.fieldPersonnelArray == item.employeeNum) {
            form.fieldPersonnelBranchCode = item.branchCode
            form.fieldPersonnelBranchName = item.branchName
            form.fieldPersonnelJobNo = item.employeeNum
            form.fieldPersonnelName = item.userName
          }
        })
      }

      if (this.ruleForm.radioBlue == 1 && this.ruleForm.referrerBranchArray) {
        this.reasonWxEnum.forEach((item, index) => {
          if (this.ruleForm.referrerBranchArray == item.employeeNum) {
            form.referrerBranchCode = item.branchCode
            form.referrerBranchName = item.branchName
            form.referrerJobNo = item.employeeNum
            form.referrerName = item.userName
          }
        })
      }
      // 通过遍历查询数据
      // 员工号 employeeNum
      let res = await this.fieldPerson.alterFieldPersonnel(this.params.id,form);
      if (res.code === "0000") {
        this.$message.success("修改外勤人员成功");

        this.ruleForm = {
          fieldPersonnelArray: "",
          referrerBranchArray: "",
          sellTime: "",//选择的时间
          radioBlue: "",//有无推荐人
        },

        this.oneBranchName = ''
        this.twoBranchName = ''

        this.$emit("onSubmit");
      }
    },









  },




};
</script>

<style lang="less" scoped>
#Situation {
  .set-box {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #096DD9;

    i {
      margin: 0px 15px 0px 0px;
      width: 18px;
      height: 18px;
    }

    .PeoBj {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAJ1BMVEUJbdkAAAALatoIbNcIbdkQcN8IbtkJbdkJbNkJbdgKbdkIbNkIbdsjbAF5AAAADXRSTlP/ADBA8BCA4M9wn38/+p3TzAAAAHpJREFUeJxjEIQDMFPnEJQpuoWBoToQzFRhAAInEFMIxGJgUAQyQxgYOBoYGFyBzAQGBmYDBgY2INOBgYFrAQMDuyADVClQMYMwkOScACQMwUyQWiATpADMVARrAzGB2pANQ7ICyWIk5wiKpjMwlEEcKSiobAT3BQQAAIHdEJ5YWam0AAAAAElFTkSuQmCC);
      background-repeat: no-repeat;
    }

    .set-num {
      width: 100px;
      text-align: right;

    }
  }

  .submit-box {
    text-align: right;
  }

  .cancel {
    border-color: #bbbbbb;
    color: #5a5a5a;
    background: #f5f5f5;
  }

  .submit {
    border-color: #ffa940;
    color: #fff;
    background: #ffa940;
  }

  .form-div-button {
    .w80 {
      min-width: 80px;
      border: 1px solid #e6a23c;
      color: #e6a23c;
    }

    .el-button--warning {
      background-color: #ffe7ba;
    }

    .check-button {
      display: inline-block;
      border: 1px solid #e6a23c;
      color: #e6a23c;
      height: 36px;
      line-height: 36px;
      border-radius: 20px;
      padding: 0 20px;
      margin-right: 20px;
      cursor: pointer;
      background-color: #fff;
    }

    .el-button:hover {
      background-color: #ffe7ba;
    }
  }
}
</style>