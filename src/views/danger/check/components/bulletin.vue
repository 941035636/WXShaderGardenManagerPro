<template>
  <div id="hazardReg">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="岗位清单" prop="standard">
        <el-select
          v-model="ruleForm.standard"
          class="w280"
          placeholder="请选择岗位清单"
          @change="standardChange"
        >
          <el-option
            v-for="item in standardList"
            :key="item.id"
            :label="item.standardName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查标准" prop="standardInfo">
        <el-select
          v-model="ruleForm.standardInfo"
          class="w280"
          placeholder="请选择检查标准"
          no-data-text="请先选择岗位清单"
        >
          <el-option
            style="width: 300px"
            v-for="item in standardInfoList"
            :key="item.id"
            :label="item.checkStandard"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="隐患描述" prop="hiddenDangerDescribe">
        <el-input
          class="w280"
          type="textarea"
          v-model="ruleForm.hiddenDangerDescribe"
          maxlength="1000"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="隐患图片" prop="hiddenDangerImg">
        <Uploading1 @imageData="imageData" ref="deleteRef" />
      </el-form-item>
      <el-form-item label="隐患类型" prop="hiddenDangerType">
        <el-cascader
          v-model="ruleForm.hiddenDangerType"
          :options="hiddenDangerType"
          filterable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="发现日期" prop="discoverDate">
        <el-date-picker
          v-model="ruleForm.discoverDate"
          class="w280"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="隐患级别" prop="hiddenDangerLevel">
        <el-select
          v-model="ruleForm.hiddenDangerLevel"
          class="w280"
          placeholder="请选择隐患级别"
        >
          <el-option
            v-for="item in hiddenDangerRanks"
            :key="item.itemValue"
            :label="item.itemText"
            :value="item.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="divide"></div>
      <el-form-item label="是否立即整改" prop="code">
        <span :class="isRec == '0' ? 'btnA' : 'btnB'" @click="getBtn('0')">
          否
        </span>
        <span :class="isRec == '1' ? 'btnA' : 'btnB'" @click="getBtn('1')">
          是
        </span>
      </el-form-item>
      <el-form-item
        label="整改部门"
        prop="abarbeitungDepartment"
        v-if="isRec == '0'"
      >
        <el-cascader
          v-model="ruleForm.abarbeitungDepartment"
          :options="department"
          filterable
        ></el-cascader>
      </el-form-item>
      <el-form-item
        label="限时整改日期"
        prop="timeLimitAbarbeitungDate"
        v-if="isRec == '0'"
      >
        <el-date-picker
          v-model="ruleForm.timeLimitAbarbeitungDate"
          class="w280"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="整改情况"
        prop="abarbeitungCondition"
        v-if="isRec == '1'"
      >
        <el-input
          class="w280"
          type="textarea"
          v-model="ruleForm.abarbeitungCondition"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="整改附件"
        prop="uploadingAttachment"
        v-if="isRec == '1'"
      >
        <Uploading1 @imageData="upAttachment" ref="deleteRef" />
      </el-form-item>
      <el-form-item
        label="验收部门"
        prop="acceptanceCheckDepartment"
        v-if="isRec == '1'"
      >
        <el-cascader
          v-model="ruleForm.acceptanceCheckDepartment"
          :options="department"
          filterable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <div class="text-right">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" shape="round" @click="affirm">
        确认提交
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getStandardListByUserPost, addReport } from '@/api/checkApi'
import { getStandardInfoList } from '@/api/listManage'
import { getItems } from '@/api/user'
import { sysDeptList, getByEntNo } from '@/api/branchManage'
import Uploading1 from '../../components/uploading1.vue'

const validateSecondLevel = (rule, value, callback) => {
  if (value.length === 2) {
    callback()
  } else {
    callback(new Error('部门必须确认到二级'))
  }
}
export default {
  components: {
    Uploading1,
  },
  data() {
    return {
      isRec: '0',
      ruleForm: {
        standard: '', //岗位清单
        standardInfo: '', //检查标准
        hiddenDangerDescribe: '', //隐患描述
        hiddenDangerImg: [], //隐患图片
        hiddenDangerType: [], //隐患类型
        discoverDate: '', //发现日期
        hiddenDangerLevel: '', //隐患级别
        abarbeitungDepartment: [], //整改部门
        timeLimitAbarbeitungDate: '', //限时整改日期
        abarbeitungCondition: '', //整改情况
        attachment: [], //整改附件
        acceptanceCheckDepartment: '', //验收部门
      },
      rules: {
        standard: [
          {
            required: true,
            message: '请选择岗位清单',
            trigger: 'change',
          },
        ],
        standardInfo: [
          {
            required: true,
            message: '请选择检查标准',
            trigger: 'change',
          },
        ],
        hiddenDangerDescribe: [
          { required: true, message: '请输入隐患描述', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '长度在 2 到 1000 个字符',
            trigger: 'blur',
          },
        ],
        hiddenDangerImg: [
          { required: true, validator: this.validateImage, trigger: 'blur' },
        ],
        hiddenDangerType: [
          {
            required: true,
            message: '请选择隐患类型',
            trigger: 'change',
          },
        ],
        discoverDate: [
          {
            required: true,
            message: '请选择发现日期',
            trigger: 'change',
          },
        ],
        hiddenDangerLevel: [
          {
            required: true,
            message: '请选择隐患级别',
            trigger: 'change',
          },
        ],
        abarbeitungDepartment: [
          {
            required: true,
            message: '请选择整改部门',
            trigger: 'change',
          },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ],
        timeLimitAbarbeitungDate: [
          {
            required: true,
            message: '请选择限时整改日期',
            trigger: 'change',
          },
        ],
        abarbeitungCondition: [
          { required: true, message: '请输入整改情况', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '长度在 2 到 1000 个字符',
            trigger: 'blur',
          },
        ],
        uploadingAttachment: [
          {
            required: true,
            validator: this.validateAttachment,
            trigger: 'blur',
          },
        ],
        acceptanceCheckDepartment: [
          {
            required: true,
            message: '请选择验收部门',
            trigger: 'change',
          },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ],
      },
      standardList: [],
      standardInfoList: [],
      hiddenDangerType: [],
      hiddenDangerRanks: [],
      department: [],
      rectificationDept: [],
    }
  },
  computed: {
    ...mapGetters({
      enumList: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.getStandardListByUserPost()
    this.dictTrue()
    this.getItems()
    this.sysDeptList()
    if (this.isRec === '0') {
      this.rules.abarbeitungCondition = []
      this.rules.uploadingAttachment = []
      this.rules.acceptanceCheckDepartment = []
    } else {
      this.rules.abarbeitungDepartment = []
      this.rules.timeLimitAbarbeitungDate = []
    }
  },
  methods: {
    async getStandardListByUserPost() {
      let res = await getStandardListByUserPost()
      if (res.code === '0000') {
        this.standardList = res.data
      }
    },
    standardChange(e) {
      this.getStandardInfoList(e)
    },
    async getStandardInfoList(e) {
      let data = {
        standardId: e,
      }
      let res = await getStandardInfoList(data)
      if (res.code === '0000') {
        this.standardInfoList = res.data
      }
    },
    imageData(e) {
      this.ruleForm.hiddenDangerImg = e
    },
    async dictTrue() {
      let res = await getItems('50002')
      if (res.code == '0000') {
        this.hiddenDangerType = this.recursion(res.data)
      }
    },
    recursion(data) {
      data.forEach((e) => {
        e.label = e.itemText
        e.value = e.itemValue
        e.children = e.sysDictItemEntitys
        if (e.children && e.children.length > 0) {
          this.recursion(e.children)
        }
      })
      return data
    },
    async getItems() {
      let res = await getItems('50001')
      if (res.code == '0000') {
        this.hiddenDangerRanks = res.data
      }
    },
    async sysDeptList() {
      let No = window.sessionStorage.getItem('enpNo')
      let res = await getByEntNo(No)
      if (res.code === '0000') {
        let departmentArr = []
        res.data.forEach((element) => {
          if (element.children && element.children.length > 0) {
            departmentArr.push(element)
          }
        })
        this.department = this.recursion1(departmentArr)
        this.rectificationDept = this.setDiGuiDataObj(this.department)
      }
    },
    recursion1(data) {
      data.forEach((e) => {
        e.label = e.deptName
        e.value = e.deptNo
        if (e.children && e.children.length > 0) {
          this.recursion1(e.children)
        } else {
          e.children = undefined
        }
      })
      return data
    },
    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].children) {
          obj[list[i].deptNo] = list[i].deptName
          this.setDiGuiDataObj(list[i].children, obj)
        } else {
          obj[list[i].deptNo] = list[i].deptName
        }
      }
      return obj
    },
    upAttachment(e) {
      this.ruleForm.attachment = e
    },
    getBtn(val) {
      this.isRec = val
      if (this.isRec === '0') {
        this.rules.abarbeitungDepartment = [
          {
            required: true,
            message: '请选择整改部门',
            trigger: 'change',
          },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ]
        this.rules.timeLimitAbarbeitungDate = [
          {
            required: true,
            message: '请选择限时整改日期',
            trigger: 'change',
          },
        ]
        this.rules.abarbeitungCondition = []
        this.rules.uploadingAttachment = []
        this.rules.acceptanceCheckDepartment = []
      } else {
        this.rules.abarbeitungDepartment = []
        this.rules.timeLimitAbarbeitungDate = []

        this.rules.abarbeitungCondition = [
          { required: true, message: '请输入整改情况', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '长度在 2 到 1000 个字符',
            trigger: 'blur',
          },
        ]
        this.rules.uploadingAttachment = [
          {
            required: true,
            validator: this.validateAttachment,
            trigger: 'blur',
          },
        ]
        this.rules.acceptanceCheckDepartment = [
          {
            required: true,
            message: '请选择验收部门',
            trigger: 'change',
          },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ]
      }
    },
    validateImage(rule, value, callback) {
      if (this.ruleForm.hiddenDangerImg.length > 0) {
        callback()
      } else {
        callback(new Error('请上传隐患图片'))
      }
    },
    validateAttachment(rule, value, callback) {
      if (this.ruleForm.attachment.length > 0) {
        callback()
      } else {
        callback(new Error('请上传整改附件'))
      }
    },
    //取消事件
    cancel() {
      this.$emit('cutClick')
    },
    //确认按钮事件
    affirm() {
      let standardName = ''
      this.standardList.forEach((item) => {
        if (item.id === this.ruleForm.standard) {
          standardName = item.standardName
        }
      })
      let standardInfoList = {}
      this.standardInfoList.forEach((element) => {
        if (element.id === this.ruleForm.standardInfo) {
          standardInfoList = element
        }
      })
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submit(standardName, standardInfoList)
        }
      })
    },
    async submit(standardName, standardInfoList) {
      let data = {
        standardName: standardName, //清单名称
        checkProjectTypeOne: standardInfoList.checkProjectTypeOne,
        checkStandard: standardInfoList.checkStandard,
        checkType: standardInfoList.checkType,
        hazardDescription: this.ruleForm.hiddenDangerDescribe, //隐患描述,
        hazardFileIds: this.ruleForm.hiddenDangerImg, //隐患图片
        hazardTypeOne: this.ruleForm.hiddenDangerType[0], //隐患类型1
        hazardTypeTwo: this.ruleForm.hiddenDangerType[1], //隐患类型2
        hazardFindTime: this.ruleForm.discoverDate, //隐患发现日期
        hazardLevel: this.ruleForm.hiddenDangerLevel, //隐患级别
        isImmediately: this.isRec, //是否立即整改
        rectificationDeptNoTop: this.ruleForm.abarbeitungDepartment[0], //整改部门1
        rectificationDeptNoTopName:
          this.rectificationDept[this.ruleForm.abarbeitungDepartment[0]],
        rectificationDeptNo: this.ruleForm.abarbeitungDepartment[1], //整改部门2
        rectificationDeptName:
          this.rectificationDept[this.ruleForm.abarbeitungDepartment[1]],
        rectificationLimited: this.ruleForm.timeLimitAbarbeitungDate, //限时整改日期
        rectificationRemark: this.ruleForm.abarbeitungCondition, //整改情况
        rectificationFileIds: this.ruleForm.attachment, //整改附件
        acceptDeptNoTop: this.ruleForm.acceptanceCheckDepartment[0], //验收部门1
        acceptDeptNoTopName:
          this.rectificationDept[this.ruleForm.acceptanceCheckDepartment[0]],
        acceptDeptNo: this.ruleForm.acceptanceCheckDepartment[1], //验收部门2
        acceptDeptName:
          this.rectificationDept[this.ruleForm.acceptanceCheckDepartment[0]],
      }
      let res = await addReport(data)
      if (res.code === '0000') {
        this.$message({
          message: '新增隐患快报成功',
          type: 'success',
        })
        this.cancel()
        // this.$router.push({
        //   path: 'planDetails',

        // })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#hazardReg {
  margin: 30px;
  .btnA {
    display: inline-block;
    width: 100px;
    border: 1px solid #1890ff;
    text-align: center;
    background: #1890ff;
    color: #fff;
  }
  .btnB {
    display: inline-block;
    width: 100px;
    border: 1px solid #1684fc;
    text-align: center;
    color: #1684fc;
  }
  .divide {
    border: 1px dashed #bbbbbb;
    margin: 20px 30px;
  }
}
</style>