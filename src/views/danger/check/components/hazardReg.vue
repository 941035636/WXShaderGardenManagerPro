<!-- 隐患登记 -->
<template>
  <div id="hazardReg">
    <el-dialog
      title="隐患登记"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
      @closed="closed"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="隐患描述" prop="describe">
          <el-input
            class="w280"
            type="textarea"
            v-model="ruleForm.describe"
            minlength="2"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="隐患图片" prop="hiddenDangerImg">
          <Uploading1 @imageData="imageData" ref="deleteRef" />
        </el-form-item>
        <el-form-item label="隐患类型" prop="hiddenDangerType">
          <el-cascader
            v-model="hazardType"
            :options="hiddenDangerType"
            disabled
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="发现日期" prop="hiddenDangerDate">
          <el-date-picker
            v-model="ruleForm.hiddenDangerDate"
            class="w280"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="隐患级别" prop="hiddenDangerRank">
          <el-select
            v-model="hazardLevel"
            class="w280"
            disabled
            placeholder="请选择隐患级别"
          >
            <el-option
              v-for="item in hiddenDangerRanks"
              :key="item.id"
              :label="item.itemText"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="divide"></div>

        <el-form-item label="是否立即整改">
          <span :class="isRec == '0' ? 'btnA' : 'btnB'" @click="getBtn('0')">
            否
          </span>
          <span :class="isRec == '1' ? 'btnA' : 'btnB'" @click="getBtn('1')">
            是
          </span>
        </el-form-item>
        <el-form-item
          v-if="isRec === '0'"
          label="整改部门"
          prop="abarbeitungDepartment"
          :rules="[
            {
              required: true,
              message: '请选择整改部门',
              trigger: 'change',
            },
            {
              required: true,
              validator: this.validateSecondLevels,
              trigger: 'change',
            },
          ]"
        >
          <el-cascader
            v-model="ruleForm.abarbeitungDepartment"
            :options="department"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-if="isRec === '0'"
          label="限时整改日期"
          prop="abarbeitungDate"
          :rules="[
            {
              required: true,
              message: '请选择限时整改日期',
              trigger: 'change',
            },
          ]"
        >
          <el-date-picker
            v-model="ruleForm.abarbeitungDate"
            class="w280"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <div v-if="isRec === '1'">
          <el-form-item
            label="整改情况"
            prop="abarbeitungCondition"
            :rules="[
              { required: true, message: ' 请输入整改情况', trigger: 'blur' },
              {
                min: 2,
                max: 1000,
                message: '整改情况字符串长度2-1000字',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              class="w280"
              type="textarea"
              v-model="ruleForm.abarbeitungCondition"
              maxlength="1000"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 8 }"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="整改附件"
            prop="attachment"
            :rules="[
              {
                required: true,
                validator: this.validateAttachment,
                trigger: 'blur',
              },
            ]"
          >
            <Uploading1 @imageData="upAttachment" />
          </el-form-item>
          <el-form-item
            label="验收部门"
            prop="acceptanceCheckDepartment"
            :rules="[
              {
                required: true,
                message: '请选择验收部门',
                trigger: 'change',
              },
              {
                required: true,
                validator: validateSecondLevels,
                trigger: 'change',
              },
            ]"
          >
            <el-cascader
              v-model="ruleForm.acceptanceCheckDepartment"
              :options="department"
              filterable
            ></el-cascader>
          </el-form-item>
        </div>
      </el-form>
      <div class="text-right">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" shape="round" @click="submit">
          确认提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getItems } from '@/api/user'
import { getByEntNo } from '@/api/branchManage'
import { checkNoPass } from '@/api/checkApi'
import Uploading from '../../components/uploading.vue'
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
    Uploading,
    Uploading1,
  },
  props: {
    id: {
      type: String,
      requires: true,
    },
    hazardLevel: {
      type: String,
      requires: true,
    },
    hazardType: {
      type: Array,
      requires: true,
    },
  },
  data() {
    return {
      isRec: '0',
      dialogVisible: false,
      ruleForm: {
        describe: '',
        hiddenDangerImg: [],
        // hiddenDangerType: [],
        hiddenDangerDate: '',
        // hiddenDangerRank: '',
        abarbeitungDepartment: [],
        abarbeitungDate: '',
        abarbeitungCondition: '',
        attachment: [],
        acceptanceCheckDepartment: [],
      },
      typeData: [],
      fileList: [],
      rules: {
        describe: [
          { required: true, message: ' 请输入隐患描述', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '隐患描述最多可输入1000个字符',
            trigger: 'blur',
          },
        ],
        hiddenDangerImg: [
          { required: true, validator: this.validateImage, trigger: 'blur' },
        ],
        // hiddenDangerType: [
        //   {
        //     required: true,
        //     message: '请选择隐患类型',
        //     trigger: 'change',
        //   },
        // ],
        hiddenDangerDate: [
          {
            required: true,
            message: '请选择发现日期',
            trigger: 'change',
          },
        ],
        // hiddenDangerRank: [
        //   {
        //     required: true,
        //     message: '请选择隐患级别',
        //     trigger: 'change',
        //   },
        // ],
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
        abarbeitungDate: [
          {
            required: true,
            message: '请选择限时整改日期',
            trigger: 'change',
          },
        ],
        abarbeitungCondition: [
          { required: true, message: ' 请输入整改情况', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '整改情况字符串长度2-1000字',
            trigger: 'blur',
          },
        ],
        attachment: [
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
    this.getItems()
    this.getItems1()
    this.sysDeptList()
  },
  methods: {
    upAttachment(e) {
      this.ruleForm.attachment = e
    },
    imageData(e) {
      this.ruleForm.hiddenDangerImg = e
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
    validateImage(rule, value, callback) {
      if (this.ruleForm.hiddenDangerImg.length > 0) {
        callback()
      } else {
        callback(new Error('请上传隐患图片'))
      }
    },
    validateSecondLevels(rule, value, callback) {
      if (value.length === 2) {
        callback()
      } else {
        callback(new Error('部门必须确认到二级'))
      }
    },
    validateAttachment(rule, value, callback) {
      if (this.ruleForm.attachment.length > 0) {
        callback()
      } else {
        callback(new Error('请上传整改附件'))
      }
    },
    async getItems() {
      let res = await getItems('50002')
      if (res.code == '0000') {
        this.hiddenDangerType = this.recursion(res.data)
      }
    },
    async getItems1() {
      let res = await getItems('50001')
      if (res.code == '0000') {
        this.hiddenDangerRanks = res.data
      }
    },
    async sysDeptList() {
      let No = window.sessionStorage.getItem('enpNo')
      let res = await getByEntNo(No)
      if (res.code === '0000') {
        this.department = this.recursion1(res.data)
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
    getBtn(val) {
      this.isRec = val
      if (this.isRec === '1') {
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
        this.rules.abarbeitungDate = [
          {
            required: true,
            message: '请选择限时整改日期',
            trigger: 'change',
          },
        ]
        this.rules.abarbeitungCondition = []
        this.rules.attachment = []
        this.rules.acceptanceCheckDepartment = []
      } else {
        this.rules.abarbeitungDepartment = []
        this.rules.abarbeitungDate = []
        this.rules.abarbeitungCondition = [
          { required: true, message: ' 请输入整改情况', trigger: 'blur' },
          {
            min: 1,
            max: 21000,
            message: '整改情况最多可输入21000个字符',
            trigger: 'blur',
          },
        ]
        this.rules.attachment = [
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
    getStatusList() {
      this.typeData = this.enumList.RectificationStatusEnum
    },
    // 图片上传
    async Upload(file) {
      this.ruleForm.files = file
      const formData = new FormData()
      formData.append('files', file.file)

      console.log(formData)
    },
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 20
      if (!isLt10M) {
        this.$message.error('单文件上限20MB!')
      }
      return isLt10M
    },
    fileChange(file, fileList) {
      this.fileList = fileList
    },
    //检测文件删除
    fileRemove(file, fileList) {
      this.fileList = fileList
    },
    closed() {
      this.isRec = '0'
      this.ruleForm.describe = ''
      this.ruleForm.hiddenDangerImg = []
      this.ruleForm.hiddenDangerType = []
      this.ruleForm.hiddenDangerDate = ''
      // this.ruleForm.hiddenDangerRank = ''
      this.ruleForm.abarbeitungDepartment = []
      this.ruleForm.abarbeitungDate = ''
      this.ruleForm.abarbeitungCondition = ''
      this.ruleForm.attachment = []
      this.ruleForm.acceptanceCheckDepartment = []
      this.$emit('closed')
    },
    cancel() {
      this.dialogVisible = false
    },
    submit() {
      if (this.isRec === '1') {
        this.rules.abarbeitungDepartment = []
        this.rules.abarbeitungDate = []
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.checkNoPass()
        }
      })
    },
    async checkNoPass() {
      let data = {
        acceptDeptNo: this.ruleForm.acceptanceCheckDepartment[1], //验收部门2 ,
        acceptDeptName:
          this.rectificationDept[this.ruleForm.acceptanceCheckDepartment[1]],
        acceptDeptNoTop: this.ruleForm.acceptanceCheckDepartment[0], //验收部门1
        hazardDescription: this.ruleForm.describe, //隐患描述 ,
        hazardFileIds: this.ruleForm.hiddenDangerImg, //隐患图片 ,
        hazardFindTime: this.ruleForm.hiddenDangerDate, //隐患发现日期 ,
        hazardTypeOne: this.hazardType[0], //隐患类型1 ,
        hazardTypeTwo: this.hazardType[1], //隐患类型2 ,
        standardHiddenDangerInfoId: this.id,
        isImmediately: this.isRec, // 是否立即整改 ,
        rectificationDeptNo: this.ruleForm.abarbeitungDepartment[1], //整改部门2 需要确认
        rectificationDeptName:
          this.rectificationDept[this.ruleForm.abarbeitungDepartment[1]],
        rectificationDeptNoTop: this.ruleForm.abarbeitungDepartment[0], //整改部门1
        rectificationFileIds: this.ruleForm.attachment, //整改附件 ,
        rectificationLimited: this.ruleForm.abarbeitungDate, //限时整改日期 ,
        rectificationRemark: this.ruleForm.abarbeitungCondition, //整改情况 ,
      }
      let res = await checkNoPass(data)
      if (res.code === '0000') {
        this.dialogVisible = false
        this.$refs.deleteRef.fileList = []
        console.log(
          this.$refs.deleteRef.fileList,
          'this.$refs.deleteRef.fileList'
        )
        this.$message({
          message: '填写成功',
          type: 'success',
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#hazardReg {
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