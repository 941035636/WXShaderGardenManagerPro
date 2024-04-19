<template>
  <div id="safetyAdd">
    <Title title="安全专家信息" class="mb30"></Title>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-position="left"
      :rules="rules"
      label-width="180px"
      :inline="true"
    >
      <el-form-item label="姓名：" prop="safetyTechniciansName">
        <el-input
          v-model="ruleForm.safetyTechniciansName"
          class="w250"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="safetyTechniciansPhone">
        <el-input
          v-model="ruleForm.safetyTechniciansPhone"
          class="w250"
          placeholder="请输入联系电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="证件类型：" prop="safetyTechniciansCertificateType">
        <el-select
          v-model="ruleForm.safetyTechniciansCertificateType"
          class="w250"
          placeholder="请选择证件类型"
        >
          <el-option
            v-for="item in certificateType"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码：" prop="safetyTechniciansCertificate">
        <el-input
          v-model="ruleForm.safetyTechniciansCertificate"
          class="w250"
          placeholder="请输入证件号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="职务/职称：" prop="safetyTechniciansPost">
        <el-select
          v-model="ruleForm.safetyTechniciansPost"
          class="w250"
          placeholder="请选择职务/职称"
        >
          <el-option
            v-for="item in safetyPostEnum"
            :key="item.strCode"
            :label="item.label"
            :value="item.strCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最高学历：" prop="safetyTechniciansEducation1">
        <el-input
          v-model="ruleForm.safetyTechniciansEducation1"
          class="w250"
          placeholder="请输入最高学历"
        ></el-input>
      </el-form-item>
      <el-form-item label="专业：" prop="safetyTechniciansMajor">
        <el-input
          v-model="ruleForm.safetyTechniciansMajor"
          class="w250"
          placeholder="请输入专业"
        ></el-input>
      </el-form-item>
      <el-form-item label="所在单位:" prop="safetyTechniciansCompany">
        <el-input
          v-model="ruleForm.safetyTechniciansCompany"
          class="w250"
          placeholder="请输入所在单位"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="从事安全生产工作年限：	"
        prop="safetyTechniciansSeniority"
      >
        <el-input
          v-model="ruleForm.safetyTechniciansSeniority"
          class="w250"
          placeholder="请输入生产工作年限"
        ></el-input>
      </el-form-item>
      <el-form-item label="主要服务项目：" prop="serviceAccidentType">
        <el-select
          v-model="ruleForm.serviceAccidentType"
          class="w250"
          multiple
          placeholder="请选择主要服务项目"
          @change="changeService"
          @remove-tag="removeTag"
        >
          <el-option
            v-for="item in serviceItems"
            :key="item.strCode"
            :label="item.label"
            :value="item.strCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="other"
        label="其他有关事故预防工作：	"
        prop="otherType"
      >
        <el-input
          v-model="ruleForm.otherType"
          class="w250"
          placeholder="请输入其他有关事故预防工作"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="主要服务行业领域：" prop="industryParam">
        <el-select
          v-model="ruleForm.industryParam"
          class="w250"
          multiple
          placeholder="请选择职行业领域"
          @change="changeIndustry"
        >
          <el-option
            v-for="item in industryData"
            :key="item.itemValue"
            :label="item.itemText"
            :value="item.itemValue"
          ></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div style="text-align: center; margin: 30px 0">
      <el-button @click="goBack">返 回</el-button>
      <el-button type="primary" @click="register">提 交</el-button>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
import {
  validateCharger,
  validatePersonCard,
  validateYears,
  validateAddress,
  validatePhone,
  checkPhone,
} from "@/util/validateForm";
  export default {
    name: 'SafetyAdd',
    components: {
      Title,
    },
    data() {
      return {
        other: false,
        typeData: [
          {
            code: 1,
            label: '总部',
          },
          {
            code: 2,
            label: '分公司',
          },
          {
            code: 3,
            label: '支公司',
          },
          {
            code: 4,
            label: '支公司及以下',
          },
        ],
        serviceItems: [], // 服务项目
        safetyPostEnum: [], // 职务
        ruleForm: {
          id: '',
          safetyTechniciansCertificate: '', // 证件号码 ,
          safetyTechniciansCertificateType: '', // 证件类型 ,
          safetyTechniciansCompany: '', // 所在单位 ,
          safetyTechniciansEducation1: '', // 最高学历 ,
          safetyTechniciansName: '', // 姓名 ,
          safetyTechniciansPhone: '', // 电话 ,
          safetyTechniciansPost: '', // 职务 ,
          safetyTechniciansMajor: '', // 专业
          safetyTechniciansSeniority: '', //  工作年限 ,
          serviceAccidentType: [], // 服务类型 ,
          otherType: '', //其他有关事故预防
          serviceAccidentTypes: [], // 服务类型集合 ,
          dataStatus: 1, // 状态
          industryParam: [], // 服务行业
          serviceIndustrys: [], // 接口入参行业集合
        },
        userCode: '',
        industryData: [], // 行业
        certificateType: [], // 证件类型
        rules: {
          safetyTechniciansName: [
            { required: true, validator: validateCharger, trigger: 'blur' },
          ],
          safetyTechniciansPhone: [
            { required: true, validator: checkPhone, trigger: 'blur' },
          ],

          safetyTechniciansCertificateType: [
            { required: true, message: '请选择证件类型', trigger: 'change' },
          ],
          safetyTechniciansCertificate: [
            { required: true, validator: validatePersonCard, trigger: 'blur' },
          ],
          safetyTechniciansPost: [
            { required: true, message: '请选择职务', trigger: 'change' },
          ],
          safetyTechniciansEducation1: [
            { required: true, message: '请填写最高学历', trigger: 'blur' },
            {
              min: 1,
              max: 30,
              message: '最高学历只支持1到30位',
              trigger: 'blur',
            },
          ],
          safetyTechniciansMajor: [
            { required: true, message: '请填写专业', trigger: 'blur' },
            { min: 1, max: 30, message: '专业只支持1到30位', trigger: 'blur' },
          ],
          safetyTechniciansCompany: [
            { required: true, message: '请填写所在单位', trigger: 'blur' },
            {
              min: 1,
              max: 30,
              message: '所在单位只支持1到30位',
              trigger: 'blur',
            },
          ],
          safetyTechniciansSeniority: [
            {
              required: true,
              validator: validateYears,
              trigger: 'blur',
            },
          ],
          serviceAccidentType: [
            { required: true, message: '请选择服务项目', trigger: 'change' },
          ],
          industryParam: [
            { required: true, message: '请选择服务行业', trigger: 'change' },
          ],
          otherType: [
            { required: true, message: '请填写其他服务行业', trigger: 'blur' },
          ],
        },
      }
    },
    computed: {},
    mounted() {
    },
    methods: {
      changeService(e) {
        console.log(e, 'change')
        if (e.lastIndexOf('07') != '-1') {
          this.other = true
        }
      },
      removeTag(e) {
        if (e == '07') {
          this.other = false
          this.ruleForm.otherType = ''
        }
      },
      async getInitData() {
        await this.getDict()
        if (this.$route.query.code) {
          this.initData(this.$route.query.code)
        }
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      async getDict() {
        // 获取字段表和枚举类
        console.log(this.getStrEnumAll)
        this.safetyPostEnum = this.getStrEnumAll.SafetyTechniciansPostEnum
        this.certificateType = this.getStrEnumAll.CertificateTypeEnum
        this.serviceItems = this.getStrEnumAll.ServiceItemsEnum
        let res = await getDictData(true, '20003')
        if (res.code == '0000') {
          this.industryData = res.data
        }
      },
      changeIndustry() {},
      async initData(code) {
        // 初始化数据
        let res = await getExpertDetail(code)
        if (res.code === '0000') {
          // res.data.industryParam = res.data.serviceIndustryCode.split(',')
          if (res.data.serviceAccidentTypes) {
            let result = res.data.serviceAccidentTypes.findIndex(
              (it) => it.serviceAccidentType == '07'
            )
            if (result != '-1') {
              this.other = true
              let obj = res.data.serviceAccidentTypes[result]
              this.$nextTick(() => {
                this.$set(
                  this.ruleForm,
                  'otherType',
                  obj.serviceAccidentTypeName
                )
              })
            }
            res.data.serviceAccidentType = res.data.serviceAccidentTypes.map(
              (item, index) => {
                return item.serviceAccidentType
              }
            )
          }

          res.data.serviceIndustrys = []
          res.data.serviceAccidentTypes = []
          res.data.dataStatus = res.data.expertStatus
          this.ruleForm = res.data
        }
      },

      async configRegister() {
        // 提交和修改方法
        let res = ''
        this.ruleForm.serviceIndustrys = getIndustrys(
          this.industryData,
          []
        )
        this.ruleForm.serviceAccidentTypes = getEnumslist(
          this.serviceItems,
          this.ruleForm.serviceAccidentType,
          this.ruleForm.otherType
        )
        if (this.ruleForm.id) {
          res = await putExpertinfo(this.ruleForm)
        } else {
          res = await addExpert(this.ruleForm)
        }
        if (res.code === '0000') {
          this.$baseMessage(
            this.ruleForm.id ? '修改成功' : '添加成功',
            'success'
          )
          this.toThisTag()
        }
      },

      register() {
        let text = '确定要新增安全专家基本信息？'
        if (this.ruleForm['id']) {
          text = '确定要修改安全专家基本信息？'
        }
        this.$confirm(
          text,
          '',
          () => {
            this.$refs['ruleForm'].validate((valid) => {
              if (valid) {
                this.configRegister()
              } else {
                return false
              }
            })
          },
          () => {
            // this.$baseMessage('已取消', 'info')
          }
        )
        return
      },
      goBack() {
        this.$router.go(-1)
      },
      // 设置路由
      async toThisTag() {
        const view = this.visitedRoutes.filter((item, index) => {
          if (item.path !== this.$route.fullPath) {
            return item
          }
        })
        await this.$store.dispatch('tabsBar/delOthersRoutes', view)
        this.$router.push({
          path: 'safety',
        })
        return view
      },
    },
  }
</script>

<style scoped lang="less">
  #safetyAdd {
    margin: 0 20px;
    padding: 20px 30px;
    .tips {
      margin-left: 30px;
      color: #de1e29;
    }
  }
</style>
