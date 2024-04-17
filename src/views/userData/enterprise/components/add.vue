<template>
  <div>
    <el-dialog
      id="companyAdd"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="900px"
      append-to-body
      @close="close"
      @open="getInit"
    >
      <el-form
        :inline="true"
        ref="ruleForm"
        :model="ruleForm"
        label-position="right"
        label-width="180px"
        :rules="rules"
      >
        <Title borderStyle="6px solid #096dd9" title="基本信息"></Title>
        <el-form-item prop="entName" label="企业名称">
          <el-input
            v-model="ruleForm.entName"
            clearable
            class="w450"
            maxlength="50"
            placeholder="请输入"
            size="mini"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="companyCode" label="社会信用代码">
          <el-input
            v-model="ruleForm.companyCode"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="经营地址" prop="areaCascaser">
          <el-cascader
            v-model="ruleForm.areaCascaser"
            placeholder="请选择省市区"
            class="w250"
            filterable
            :options="areaList"
            :props="{ checkStrictly: false }"
            clearable
            size="mini"
            @change="handleChangeArea"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="address">
          <el-input
            v-model="ruleForm.address"
            class="w300"
            size="mini"
            clearable
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
        <el-form-item prop="manageId2" label="国民经济行业">
          <el-cascader
            v-model="ruleForm.manageId2"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            class="w250"
            :options="manageData"
            :props="{
              label: 'itemText',
              value: 'itemValue',
              children: 'sysDictItemEntitys',
            }"
            @change="handleChangeManage"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="peopleNum" label="从业人员总数">
          <el-input
            v-model="ruleForm.peopleNum"
            clearable
            class="w300"
            placeholder="请输入"
            size="mini"
          >
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <Title
          borderStyle="6px solid #096dd9"
          title="法人代表/主要负责人"
        ></Title>
        <el-form-item prop="legalPerson" label="姓名">
          <el-input
            v-model="ruleForm.legalPerson"
            clearable
            class="w250"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>

        <el-form-item prop="legalPhone" label="联系电话">
          <el-input
            v-model="ruleForm.legalPhone"
            clearable
            class="w250"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="register">
          提交
        </el-button>
      </span>
    </el-dialog>
    <detail ref="detail" />
  </div>
</template>

<script>
import detail from './indexinFo.vue'
import { getOrgDetails, addOrg, editOrg } from '@/api/userDataManagement'
import { alterSave, getDetail } from '@/api/user'
import MoneyInput from '@/components/MoneyInput'
import { getAreaDetail, getStreet } from '@/api/Areas'
import { dictItem, uploadFile } from '@/api/policyManagement'
import { mapGetters } from 'vuex'
import {
  validatePositiveNum,
  validateMoney,
  validateBlCodeGZ,
  validateEmail,
  validateTelephone,
  validateTelephone2,
} from '@/utils/validateFrom'
export default {
  name: 'AddUser',
  components: {
    MoneyInput,
    detail,
  },
  data() {
    return {
      identification: '',
      cativeList: {},
      projectList: [],
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页显示的行数
      userCode: '',
      isInsured: false,
      dialogVisible: false,
      ruleForm: {
        belongToYear: '', //年份
        projectName: '', //项目名称
        areaList: '', //经营地址
        address: '', //详细地址
        entName: '',
        companyCode: '',
        businessLicenseFileId: '',
        areaCascaser: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        provinceName: '',
        cityName: '',
        areaName: '',
        address: '',
        industryId2: '',
        industryTypeOne: '',
        industryTypeTwo: '',
        industryTypeOneName: '',
        industryTypeTwoName: '',
        manageId2: '',
        industryTypeThree: '',
        industryTypeFour: '',
        industryTypeThreeName: '',
        industryTypeFourName: '',
        turnover: '',
        peopleNum: '',
        operateType: '0',
        operateRemark: '',
        legalPerson: '',
        legalPhone: '',
        legalEmail: '',
        dutyTelephone: '',
        safetyName: '',
        safetyPhone: '',
        safetyProdLicense: '',
        safetyProdLicenseFileId: '',
        safetyProdLicenseStart: '',
        safetyProdLicenseEnd: '',
        safetyProdLevel: '',
      },

      // industryObj: [], // 行业数据
      manageData: [], //管理数据
      manageObj: [], //管理名字
      manageName: [],

      value: [], // 多级联动的值 => 会是一个数组
      startTime: {
        disabledDate: (time) => {
          if (this.ruleForm.safetyProdLicenseEnd) {
            return (
              time.getTime() >
              new Date(this.ruleForm.safetyProdLicenseEnd).getTime()
            )
          } else {
            // 不能大于当前日期
            return time.getTime() > Date.now()
          }
        },
      },
      // 结束时间
      endTime: {
        disabledDate: (time) => {
          if (this.ruleForm.safetyProdLicenseStart) {
            return (
              time.getTime() <
              new Date(this.ruleForm.safetyProdLicenseStart).getTime() // 加- 8.64e7则表示包当天
            )
          } else {
            return time.getTime() < Date.now()
          }
        },
      },
      rules: {
        belongToYear: [
          {
            required: true,
            message: '请选择所属年份',
            trigger: 'blur',
          },
        ],
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 200,
            message: '字符长度1-200位',
            trigger: 'blur',
          },
        ],
        areaList: [
          {
            required: true,
            message: '请选择省市区',
            trigger: 'change',
          },
        ],
        address: [
          {
            required: true,
            message: '请输入具体地址',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 100,
            message: '字符长度1-100位',
            trigger: 'blur',
          },
        ],
        entName: [
          {
            required: true,
            message: '请输入企业名称',
            trigger: 'blur',
          },
          {
            min: 4,
            max: 200,
            message: '字符长度4-200位',
            trigger: 'blur',
          },
        ],
        companyCode: [
          {
            required: true,
            validator: validateBlCodeGZ,
            trigger: 'blur',
          },
        ],
        businessLicenseFileId: [
          {
            required: true,
            message: '请上传文件',
            trigger: 'change',
          },
        ],
        areaCascaser: [
          {
            required: true,
            message: '请选择省市区',
            trigger: 'change',
          },
        ],
        address: [
          {
            required: true,
            message: '请输入具体地址',
            trigger: 'blur',
          },
          {
            min: 4,
            max: 500,
            message: '字符长度4-500位',
            trigger: 'blur',
          },
        ],
        industryId2: [
          {
            required: true,
            message: '请选择所属行业',
            trigger: 'change',
          },
        ],
        manageId2: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
        turnover: [
          { required: true, validator: validateMoney, trigger: 'blur' },
        ],
        peopleNum: [
          { required: true, validator: validatePositiveNum, trigger: 'blur' },
        ],
        operateType: [
          { required: true, message: '请选择经营状态', trigger: 'change' },
        ],
        operateRemark: [
          {
            required: true,
            message: '请输入经营范围',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 200,
            message: '字符长度2-1000位',
            trigger: 'blur',
          },
        ],
        legalPerson: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: '字符长度1-50位',
            trigger: 'blur',
          },
        ],
        safetyName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: '字符长度1-50位',
            trigger: 'blur',
          },
        ],
        legalPhone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],

        safetyPhone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
        dutyTelephone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
        legalEmail: [
          // { required: false, validator: validateEmail, trigger: 'blur' },
          {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '请输入正确的邮箱',
            trigger: 'blur',
          },
        ],
        safetyProdLicense: [
          {
            required: false,
            message: '请输入许可证号',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符长度1-30位',
            trigger: 'blur',
          },
        ],
        safetyProdLicenseFileId: [
          {
            required: false,
            message: '请上传许可证件',
            trigger: 'change',
          },
        ],
        safetyProdLicenseStart: [
          {
            required: false,
            message: '请选择许可证起期',
            trigger: 'change',
          },
        ],
        safetyProdLicenseEnd: [
          {
            required: false,
            message: '请选择许可证止期',
            trigger: 'change',
          },
        ],
        safetyProdLevel: [
          {
            required: false,
            message: '请选择标准化等级',
            trigger: 'change',
          },
        ],
      },
    }
  },
  props: {
    industryData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
    industryObj() {
      let result = []
      if (this.industryData) {
        result = this.setDiGuiDataObj(this.industryData)
      }
      return result
    },
    title() {
      let result = '新增企业'
      if (this.userCode) {
        result = '修改企业'
      }
      return result
    },
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      //初始化

      this.getManageData()
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    deleteBsp() {
      this.ruleForm.businessLicenseFileId = ''
      this.$baseMessage('删除成功', 'success')
    },
    deleteLsp() {
      this.ruleForm.safetyProdLicenseFileId = ''
      this.$baseMessage('删除成功', 'success')
    },
    beforeAvatarUpload: function (file) {
      const isLt2M = file.size / 1024 / 1024 < 50 //限制图片大小

      if (!isLt2M) {
        this.$baseMessage('上传文件大小不能超过 50MB', 'error')
      }
      return isLt2M
    },
    handleAvatarSuccess() {
      this.$refs.ruleForm.validateField('businessLicenseFileId')
    },
    exceed() {
      this.$baseMessage('文件最多上传1个！', 'error')
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {},
    async changeBsp(file) {
      //上传营业执照
      let data = new FormData()
      data.append('file', file.file)
      const res = await uploadFile(data)
      if (res.code == '0000') {
        this.ruleForm.businessLicenseFileId = res.data.id
        this.ruleForm.businessFile = [{ name: res.data.name }]
      }
    },
    async changeLsp(file) {
      //上传生产许可证
      let data = new FormData()
      data.append('file', file.file)
      const res = await uploadFile(data)
      if (res.code == '0000') {
        this.ruleForm.safetyProdLicenseFileId = res.data.id
        this.ruleForm.prodLicenseFile = [{ name: res.data.name }]
      }
    },
    handleAreaList(e) {
      console.log(e, 'handleAreaList')
    },
    // 处理选中省市区方法
    async handleChangeArea(e) {
      if (e) {
        this.ruleForm.provinceCode = e[0]
        this.ruleForm.cityCode = e[1]
        this.ruleForm.areaCode = e[2]

        this.ruleForm.provinceName =
          this.areaMap[this.ruleForm.provinceCode] || '' // 省编码转中文
        this.ruleForm.cityName = this.areaMap[this.ruleForm.cityCode] // 市编码转中文
        this.ruleForm.areaName = this.areaMap[this.ruleForm.areaCode] // 区编码转中文
      } else {
        return
      }
    },
    currentEnum(key) {
      return this.getStrEnumAll[key] || []
    },
    setForm() {
      this.$refs['ruleForm'].resetFields()
    },
    close() {
      this.projectList = []
      this.userCode = ''
      this.isInsured = false
      this.ruleForm = {
        projectName: '', //项目名称
        areaList: '', //经营地址
        address: '', //详细地址
        entName: '',
        companyCode: '',
        businessLicenseFileId: '',
        areaCascaser: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        provinceName: '',
        cityName: '',
        areaName: '',
        address: '',
        industryId2: '',
        industryTypeOne: '',
        industryTypeTwo: '',
        industryTypeOneName: '',
        industryTypeTwoName: '',
        manageId2: '',
        industryTypeThree: '',
        industryTypeFour: '',
        industryTypeThreeName: '',
        industryTypeFourName: '',
        turnover: '',
        peopleNum: '',
        operateType: '0',
        operateRemark: '',
        legalPerson: '',
        legalPhone: '',
        legalEmail: '',
        dutyTelephone: '',
        safetyName: '',
        safetyPhone: '',
        safetyProdLicense: '',
        safetyProdLicenseFileId: '',
        safetyProdLicenseStart: '',
        safetyProdLicenseEnd: '',
        safetyProdLevel: '',
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    // 页面切换方法
    handleCurrentChange(val) {
      this.currentPage = val
    },
    detail(index, row) {
      console.log(row, 'provinceName')
      if (this.isInsured) {
        let arr = [
          row.projectProvinceCode,
          row.projectCityCode,
          row.projectCountyCode,
        ]
        console.log(arr, '99999---')

        this.$refs.detail.ruleForm = JSON.parse(JSON.stringify(row))
        this.$refs.detail.ruleForm.areaList = arr
        console.log(
          this.$refs.detail.ruleForm.areaList,
          'this.$refs.detail.ruleForm.areaList'
        )
        this.$refs.detail.ruleForm.address = row.projectDetailAddress
        this.$refs.detail.ids = index
        this.$refs.detail.dialogVisible = true
      } else {
        let arr = [row.provinceCode, row.cityCode, row.areaCode]
        this.$refs.detail.ruleForm = JSON.parse(JSON.stringify(row))
        this.$refs.detail.ruleForm.areaList = arr
        this.$refs.detail.ids = index
        this.$refs.detail.dialogVisible = true
      }
    },
    dele(index) {
      //删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.projectList.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      console.log(index, 'dele')
    },
    addList() {
      if (this.ruleForm.projectName.length >= 200) {
        this.$message.error('项目名称字符长度1-200位')
        return false
      }
      if (this.ruleForm.address.length >= 100) {
        this.$message.error('详细地址长度1-100位')
        return false
      }
      if (this.isInsured) {
        if (this.projectList.length >= 1) {
          this.$message.error('只支持一个项目投保，请删除后重新添加。')
          return false
        }
      }
      if (this.identification) {
        console.log(this.identification, 'this.identification')
        if (this.projectList.length >= 1) {
          this.$message.error('只支持一个项目投保，请删除后重新添加。')
          return false
        }
      }
      if (
        this.projectList &&
        this.projectList.find(
          (item) => this.ruleForm.projectName == item.projectName
        )
      ) {
        this.$message.error('项目名称不可重复')
        return false
      }
      // let date = new Date()
      // let year = date.getFullYear()
      let obj = {
        // 省编码转中文
        provinceName: this.areaMap[this.ruleForm.areaList[0]] || '',
        projectProvinceName: this.areaMap[this.ruleForm.areaList[0]] || '',

        areaName: this.areaMap[this.ruleForm.areaList[2]] || '',
        projectCountyName: this.areaMap[this.ruleForm.areaList[2]] || '',

        cityName: this.areaMap[this.ruleForm.areaList[1]] || '',
        projectCityName: this.areaMap[this.ruleForm.areaList[1]] || '',

        provinceCode: this.ruleForm.areaList[0] || '',
        projectProvinceCode: this.ruleForm.areaList[0] || '',

        areaCode: this.ruleForm.areaList[2] || '',
        projectCountyCode: this.ruleForm.areaList[2] || '',

        cityCode: this.ruleForm.areaList[1] || '',
        projectCityCode: this.ruleForm.areaList[1] || '',

        projectName: this.ruleForm.projectName, //项目名称
        // areaList: this.ruleForm.areaList,//地址
        address: this.ruleForm.address, //详细地址
        projectDetailAddress: this.ruleForm.address, //详细地址
        dataStatus: true, //状态
        belongToYear: this.ruleForm.belongToYear,
      }
      if (
        this.ruleForm.projectName == '' ||
        this.ruleForm.areaList == '' ||
        this.ruleForm.address == ''
      ) {
        this.$message.error('请先添加项目信息！')
      } else {
        console.log(obj, 'cityName')
        this.projectList.push(obj)
        this.ruleForm.belongToYear = ''
        this.ruleForm.projectName = ''
        this.ruleForm.address = ''
        this.ruleForm.areaList = ''
      }
    },
    getInit() {
      this.initData()
      this.showArea = true
      if (this.userCode) {
        console.log('userCode', this.userCode)
        this.getOrgDetail()
      }
    },

    async getManageData() {
      //获取管理分类
      let res = await dictItem(true, 20006)
      if (res.code == '0000') {
        this.manageData = res.data
        this.manageObj = this.setDiGuiDataObj(res.data)
      }
    },

    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].sysDictItemEntitys) {
          obj[list[i].itemValue] = list[i].itemText
          this.setDiGuiDataObj(list[i].sysDictItemEntitys, obj)
        } else {
          obj[list[i].itemValue] = list[i].itemText
        }
      }
      return obj
    },
    async getOrgDetail() {
      let { code, data } = await getDetail(this.userCode)
      console.log(data, '1111')
      if (code === '0000') {
        this.projectList = data.constructionProjectRespList
          ? data.constructionProjectRespList
          : []
        this.ruleForm = data
        this.ruleForm.turnover = data.turnover ? data.turnover.toFixed(2) : ''
        this.ruleForm.legalEmail = data.legalEmail ? data.legalEmail : ''
        this.ruleForm.areaCascaser = [
          data.provinceCode,
          data.cityCode,
          data.areaCode,
        ]
        this.ruleForm.businessFile = data.businessFile
          ? [data.businessFile]
          : []
        this.ruleForm.prodLicenseFile = data.prodLicenseFile
          ? [data.prodLicenseFile]
          : []
        this.ruleForm.industryId2 = [data.industryTypeOne]
        if (data.industryTypeTwo) {
          this.ruleForm.industryId2 = [
            data.industryTypeOne,
            data.industryTypeTwo,
          ]
        }
        this.ruleForm.manageId2 = [
          data.industryTypeThree,
          data.industryTypeFour,
        ]
      }
    },
    // 处理选中行业类型
    handleChangeIndustry(e) {
      if (this.isInsured) {
        this.projectList = []
      }
      if (!e) {
        return
      }

      this.ruleForm.industryTypeOne = e[0] || ''
      this.ruleForm.industryTypeOneName = this.industryObj[e[0]] || ''
      this.ruleForm.industryTypeTwo = e[1] || ''
      this.ruleForm.industryTypeTwoName = this.industryObj[e[1]] || ''
    },
    handleChangeManage(e) {
      //处理选中管理分类数据
      if (!e) {
        return
      }

      this.ruleForm.industryTypeThree = e[0] || ''
      this.ruleForm.industryTypeFour = e[1] || ''
      this.ruleForm.industryTypeThreeName = this.manageObj[e[0]] || ''
      this.ruleForm.industryTypeFourName = this.manageObj[e[1]] || ''
    },
    focusError() {
      setTimeout(() => {
        this.$message.error({
          title: '提示',
          message: document.getElementsByClassName('el-form-item__error')[0]
            .innerText,
        })
        let isError = document.getElementsByClassName('is-error')
        isError[0].querySelector('input').focus()
      }, 100)
    },
    register() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$confirm('即将提交, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            this.submit()
          })
        } else {
          this.focusError()
          return false
        }
      })
    },

    async submit() {
      console.log(this.ruleForm, '---==-==-')
      if (this.userCode) {
        this.ruleForm['projectList'] = this.projectList
        let res = await alterSave(this.ruleForm, this.userCode)
        if (res.code == '0000') {
          this.$message.success('修改成功')
          this.$emit('sucessCb', '刷新')
        }
      } else if (this.isInsured) {
        this.ruleForm['projectList'] = this.projectList
        console.log(this.projectList, 'this.projectList')
        console.log(this.ruleForm, 'this.ruleFormList')
        await this.$store.commit('policyInfo/insuredInfoParam', this.ruleForm)
        this.$emit('sucessCb', '')
      } else {
        this.ruleForm['projectList'] = this.projectList
        let res = await alterSave(this.ruleForm)
        if (res.code == '0000') {
          this.$message.success('添加成功')
          await this.$store.commit(
            'policyInfo/organizationEntity',
            this.ruleForm
          )
          this.$emit('sucessCb', '刷新')
        }
      }
      this.$nextTick(() => {
        this.dialogVisible = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#companyAdd {
  .el-dialog {
  }
}
.tailTip {
  color: #999;
  cursor: default;
}
</style>
