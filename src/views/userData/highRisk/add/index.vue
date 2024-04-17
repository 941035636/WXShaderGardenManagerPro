<template>
  <div id="highRiskAdd">
    <el-form
      ref="ruleForm"
      label-position="left"
      label-width="250px"
      :inline="true"
      :model="ruleForm"
      :rules="rules"
    >
      <div class="box">
        <Title title="企业基本信息"></Title>
        <div class="content_item ml30 box lh30">
          <Table
            :valid="true"
            :box-one="true"
            lable-left="单位名称"
            lable-right="类型"
          >
            <template #left>
              <el-form-item prop="custFullName" class="form-class">
                <el-input
                  v-model="ruleForm.custFullName"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="orgNature" class="form-class">
                <el-select
                  v-model="orgNature"
                  class="w250"
                  size="mini"
                  placeholder="请选择类型"
                  @change="selOrg"
                >
                  <el-option
                    v-for="item in orgNatureData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </Table>
          <Table
            v-if="orgNature == '1'"
            :valid="true"
            :box-two="true"
            lable-left="社会信用代码"
          >
            <template #rightTwo>
              <el-form-item prop="blCode" class="form-class">
                <el-input
                  v-model="ruleForm.blCode"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>
          <Table
            v-if="orgNature == '2'"
            :valid="true"
            :box-one="true"
            lable-left="主要负责人姓名："
            value-left=""
            lable-right="主要负责人联系电话："
            value-right=""
          >
            <template #left>
              <el-form-item prop="lawMan" class="form-class">
                <el-input
                  v-model="ruleForm.lawMan"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="lawManPhone" class="form-class">
                <el-input
                  v-model="ruleForm.lawManPhone"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>
          <Table
            v-if="orgNature == '2'"
            :valid="true"
            :box-one="true"
            lable-left="主要负责人证件类型"
            lable-right="主要负责人证件号码"
          >
            <template #left>
              <el-form-item prop="lawManType" class="form-class">
                <el-select
                  v-model="ruleForm.lawManType"
                  clearable
                  size="mini"
                  class="w250"
                  placeholder="请选择负责人证件类型"
                >
                  <el-option
                    v-for="item in lawType"
                    :key="item.strCode"
                    :label="item.label"
                    :value="item.strCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="lawManBlCode" class="form-class">
                <el-input
                  v-model="ruleForm.lawManBlCode"
                  clearable
                  class="w250"
                  placeholder="请输入主要负责人证件号码"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>

          <Table
            :valid="true"
            :box-one="true"
            lable-left="行业分类"
            lable-right="管理分类"
          >
            <template #left>
              <el-form-item prop="industryId" class="form-class">
                <el-cascader
                  v-model="ruleForm.industryId"
                  filterable
                  class="w250"
                  clearable
                  size="mini"
                  :options="industryData"
                  placeholder="请选择行业分类"
                  :props="{
                    label: 'itemText',
                    value: 'id',
                    children: 'sysDictItemEntitys',
                  }"
                  @change="handleChangeIndustry"
                ></el-cascader>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="manageId" class="form-class">
                <el-cascader
                  v-model="ruleForm.manageId"
                  filterable
                  placeholder="请选择管理分类"
                  clearable
                  size="mini"
                  class="w250"
                  :options="manageData"
                  :props="{
                    label: 'itemText',
                    value: 'id',
                    children: 'sysDictItemEntitys',
                  }"
                  @change="handleChangeManage"
                ></el-cascader>
              </el-form-item>
            </template>
          </Table>
          <Table
            v-if="orgNature == '1'"
            :valid="true"
            :box-one="true"
            lable-left="从业人员总数（人）："
            lable-right="年营业额/工程造价："
          >
            <template #left>
              <el-form-item prop="employeeNum" class="form-class">
                <el-input
                  v-model="ruleForm.employeeNum"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="annualTurnover" class="form-class">
                <Money-input
                  v-model.trim="ruleForm.annualTurnover"
                  template="append"
                  class="w250"
                  placeholder="请输入年营业额 / 工程造价"
                ></Money-input>
              </el-form-item>
            </template>
          </Table>
          <Table
            :valid="true"
            :box-one="true"
            lable-left="实际经营地址："
            lable-right="详细地址："
            value-right=""
          >
            <template #left>
              <el-form-item prop="areaId" class="form-class">
                <el-cascader
                  v-model="ruleForm.areaId"
                  filterable
                  class="w250"
                  clearable
                  size="mini"
                  :options="allArea"
                  placeholder="请选择区域"
                  @change="handleChangeArea"
                ></el-cascader>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="detailAddress" class="form-class">
                <el-input
                  v-model="ruleForm.detailAddress"
                  clearable
                  class="w250"
                  type="textarea"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>
          <Table
            v-if="orgNature == '1'"
            :valid="true"
            :box-two="true"
            lable-left="经营范围："
            value-left=""
            lable-right=""
            value-right=""
            :border-bot-flag="true"
          >
            <template #rightTwo>
              <el-form-item prop="businessScope" class="form-class">
                <el-input
                  v-model="ruleForm.businessScope"
                  clearable
                  type="textarea"
                  class="w800"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>
        </div>
      </div>
      <div class="box" v-if="orgNature == '1'">
        <Title title="企业关系人信息" class="mt25"></Title>
        <div class="content_item ml30 box lh30">
          <Table
            :valid="true"
            :box-one="true"
            lable-left="法定代表人/主要负责人："
            value-left=""
            lable-right="法定代表人/主要负责人电话："
            value-right=""
          >
            <template #left>
              <el-form-item prop="lawMan" class="form-class">
                <el-input
                  v-model="ruleForm.lawMan"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="lawManPhone" class="form-class">
                <el-input
                  v-model="ruleForm.lawManPhone"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>
          <Table
            :valid="true"
            :box-one="true"
            lable-left="安全负责人姓名："
            lable-right="安全负责人联系电话："
            :border-bot-flag="true"
          >
            <template #left>
              <el-form-item prop="securityCharger" class="form-class">
                <el-input
                  v-model="ruleForm.securityCharger"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="securityChargerPhone" class="form-class">
                <el-input
                  v-model="ruleForm.securityChargerPhone"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>
          <Table
            :valid="true"
            :box-two="true"
            lable-left="应急值班电话："
            :border-bot-flag="true"
          >
            <template #rightTwo>
              <el-form-item prop="dutyTelephone" class="form-class">
                <el-input
                  v-model="ruleForm.dutyTelephone"
                  clearable
                  class="w250"
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>
        </div>
      </div>
      <div class="box" v-if="orgNature == '1'">
        <Title title="证件信息" class="mt25"></Title>
        <div class="content_item ml30 box lh30">
          <Table
            :box-one="true"
            lable-left="营业执照："
            lable-right="安全生产许可证："
          >
            <template #left>
              <el-form-item class="form-class">
                <el-upload
                  class="avatar-uploader"
                  multiple
                  action="#"
                  :before-upload="beforeAvatarUpload"
                  :http-request="changeBsp"
                  :show-file-list="false"
                  :limit="10"
                  accept=".jpg, .jpeg, .png, PNG"
                >
                  <span v-if="imageUrl.Bsp">
                    <img :src="imageUrl.Bsp" class="avatar" />
                    <span class="right" @click.stop="deleteBsp">X</span>
                  </span>

                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item class="form-class">
                <el-upload
                  class="avatar-uploader"
                  multiple
                  :before-upload="beforeAvatarUpload"
                  action="#"
                  :show-file-list="false"
                  :http-request="changeLsp"
                  accept=".jpg, .jpeg, .png, PNG"
                >
                  <span v-if="imageUrl.Lsp">
                    <img :src="imageUrl.Lsp" class="avatar" />
                    <span class="right" @click.stop="deleteLsp">X</span>
                  </span>

                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </template>
          </Table>
          <Table
            :box-one="true"
            lable-left="安全生产许可证有效期："
            lable-right="安全生产许可证号码："
          >
            <template #left>
              <el-form-item class="form-class">
                <el-date-picker
                  v-model="ruleForm.safetyProdLicenseStart"
                  type="date"
                  class="w130"
                  clearable
                  :picker-options="startTime"
                  value-format="yyyy-MM-dd 00:00:00"
                  placeholder="开始时间"
                ></el-date-picker>
                至
                <el-date-picker
                  v-model="ruleForm.safetyProdLicenseEnd"
                  class="w130"
                  type="date"
                  clearable
                  :picker-options="endTime"
                  value-format="yyyy-MM-dd 23:59:59"
                  placeholder="结束时间"
                ></el-date-picker>
              </el-form-item>
            </template>
            <template #right>
              <el-form-item prop="safetyProdLicense" class="form-class">
                <el-input
                  v-model="ruleForm.safetyProdLicense"
                  clearable
                  class="w250"
                  maxlength="30"
                  minlength="4"
                  show-word-limit
                  placeholder="请输入内容"
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </Table>
          <Table
            :box-two="true"
            lable-left="安全生产标准化等级："
            value-left=""
            lable-right=""
            value-right=""
            :border-bot-flag="true"
          >
            <template #rightTwo>
              <el-form-item prop="safetyProdLevel" class="form-class">
                <el-select
                  v-model="ruleForm.safetyProdLevel"
                  class="w250"
                  clearable
                  placeholder="请选择等级"
                  @change="log"
                >
                  <el-option
                    v-for="item in riskLevelData"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </Table>
        </div>
      </div>
    </el-form>

    <div class="btn-bottom">
      <el-button type="info" round @click="toThisTag">返回</el-button>
      <el-button type="primary" round @click="register">提交</el-button>
    </div>
  </div>
</template>

<script>
import {
  getOrgDetails,
  addOrg,
  editOrg,
  getNational,
} from '@/api/userDataManagement'
import MoneyInput from '@/components/MoneyInput'
import { getAreaDetail, getStreet } from '@/api/Areas'
import { uploadFile, dictItem } from '@/api/policyManagement'
import Title from '@/components/NewTitle'
import Table from './components/Table'
import { getImgFile } from '@/api/resources'
import { mapGetters } from 'vuex'
import {
  validateQiYeName,
  validateBlCode,
  validateNumber,
  validatePersonCard,
  validateIdCard,
  validatePositiveNum,
  validateMoney,
  validateLsp,
  validateDWName,
  validateAddress,
  validateBussinessScope,
  validateLawName,
  validateContactName,
  validateTelephone,
} from '@/utils/validateFrom'
export default {
  name: 'HighRiskAdd',
  components: {
    Title,
    Table,
    MoneyInput,
  },
  data() {
    var validateFLsp = (rlue, value, callback) => {
      if (value === '') {
        callback()
      } else if (!/^.{4,30}$/i.test(value)) {
        callback(new Error('请输入4-30位许可证号!'))
      } else {
        callback()
      }
    }
    return {
      data: {},
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

      imageUrl: {
        Bsp: '', //营业执照
        Lsp: '', //生产经营执照
      },
      allArea: [], //地区下拉框
      ruleForm: {
        blCode: '', // 统一社会信用代码
        areaId: '', // 区域
        businessType: '', //企业类型
        custFullName: '', // 单位名称
        detailAddress: '', // 详细地址，除省市县外，例如某某路多少号，可为空
        businessScope: '', // 经营范围
        industryId: [], // 行业分类
        industryName: [], //行业分类名字
        manageId: [], // 管理分类
        manageName: [], //管理名字
        employeeNum: '', // 从业人员总数
        annualTurnover: '', // 年营业额
        lawMan: '', // 企业法人名称
        lawManPhone: '', // 企业法人手机号码
        lawManType: '', //主要负责人证件类型
        lawManBlCode: '', //主要负责人证件号码
        securityCharger: '', //安全负责人
        securityChargerPhone: '', //安全负责人电话号码
        dutyTelephone: '', //应急值班电话
        businessLicenseFileId: '', //营业执照扫描件
        safetyProdLicenseFileId: '', //安全生产许可证扫描件
        safetyProdLicenseStart: '', //安全生产许可证有效期开始
        safetyProdLicense: '', //安全生产许可证号码
        safetyProdLicenseEnd: '', //安全生产许可证有效期结束
        safetyProdLevel: '', //安全生产标准化等级
        provinceCode: '', // 省代码,依照国家颁发行政代码标准
        provinceName: '', // 省名称，全称
        cityCode: '', // 所在市代码
        cityName: '', // 市名称，全称，可为空
        // contactName: '', // 企业联系人名称
        // contactPhone: '', // 企业联系人电话
        countyCode: '', // 县代码,依照国家颁发行政代码标准，可为空
        countyName: '', // 县名称，全称，可为空
        areaCode: '', // 区代码,依照国家颁发行政代码标准，可为空
        areaName: '', // 区名称，全称，可为空
        // economicNature: '', // 经济类型：01-私营经济、02-有限责任公司、03-国有经济
      },
      orgNature: '1', // 1是企业，2是个人
      industryData: [], // 行业下拉框数据
      industryObj: [], // 行业数据
      manageData: [], //管理数据
      manageObj: [], //管理名字
      nationalData: [], // 国民经济
      riskLevelData: [], // 风险等级
      orgNatureData: [
        {
          label: '企业',
          value: '1',
        },
        {
          label: '个人',
          value: '2',
        },
      ], // 企业类型
      lawType: [], // 个人类型
      nationalObj: {},

      rules: {
        custFullName: [
          { required: true, validator: validateDWName, trigger: 'blur' },
        ],
        orgNature: [
          { required: false, message: '请选择企业类型', trigger: 'change' },
        ],
        blCode: [
          { required: true, validator: validateBlCode, trigger: 'blur' },
        ],
        lawManType: [
          {
            required: true,
            message: '请选择主要负责人证件类型',
            trigger: 'blur',
          },
        ],
        lawManBlCode: [
          { required: true, validator: validatePersonCard, trigger: 'blur' },
        ],

        economicNature: [
          { required: true, message: '请选择经济类型', trigger: 'change' },
        ],
        manageId: [
          { required: true, message: '请选择管理分类', trigger: 'blur' },
        ],
        industryId: [
          { required: true, message: '请选择行业分类', trigger: 'change' },
        ],
        employeeNum: [
          { required: true, validator: validatePositiveNum, trigger: 'blur' },
        ],
        annualTurnover: [
          { required: true, validator: validateMoney, trigger: 'blur' },
        ],

        areaId: [{ required: true, message: '请选择区域', trigger: 'change' }],
        detailAddress: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
        industryId: [
          { required: true, message: '请选择行业类型', trigger: 'change' },
        ],
        nationalOptions: [
          {
            required: true,
            message: '请选择国民经济类型',
            trigger: 'change',
          },
        ],
        detailAddress: [
          { required: true, validator: validateAddress, trigger: 'blur' },
        ],
        businessScope: [
          {
            required: true,
            validator: validateBussinessScope,
            trigger: 'blur',
          },
        ],
        safetyProdLicense: [
          {
            required: false,
            validator: validateFLsp,
            trigger: 'blur',
          },
        ],
        lawMan: [
          { required: true, validator: validateLawName, trigger: 'blur' },
        ],
        lawManPhone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
        securityCharger: [
          { required: true, validator: validateContactName, trigger: 'blur' },
        ],
        securityChargerPhone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
        dutyTelephone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
        contactName: [
          { required: true, validator: validateContactName, trigger: 'blur' },
        ],
        contactPhone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      visitedRoutes: 'tabsBar/visitedRoutes',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.initData()
    if (this.$route.query.userCode) {
      this.setCompany()
    }
  },

  methods: {
    setCompany() {
      setTimeout(() => {
        if (this.ruleForm.blCode) {
          this.orgNature = '1'
        } else {
          this.orgNature = '2'
        }
      }, 800)
    },
    selOrg(e) {
      if (e == 1) {
        //企业
        this.ruleForm.lawManType = ''
        this.ruleForm.lawManBlCode = ''
      } else if (e == 2) {
        this.ruleForm.blCode = ''
        this.ruleForm.employeeNum = ''
        this.ruleForm.annualTurnover = ''
        this.ruleForm.businessScope = ''
        this.ruleForm.securityCharger = ''
        this.ruleForm.securityChargerPhone = ''
        this.ruleForm.dutyTelephone = ''
        this.ruleForm.safetyProdLicenseStart = ''
        this.ruleForm.safetyProdLicenseEnd = ''
        this.ruleForm.safetyProdLicense = ''
        this.ruleForm.safetyProdLevel = ''
        this.ruleForm.businessLicenseFileId = ''
        this.ruleForm.safetyProdLicenseFileId = ''
        this.ruleForm.lawMan = this.ruleForm.custFullName
      }
    },
    log(e) {
      console.log(e)
    },
    async initData() {
      //初始化
      this.getIndustryData()
   
      this.getManageData()
      this.lawType = this.currentEnum('CertificateTypeEnum')
      this.riskLevelData = this.currentEnum('SafetyLevelEnum')
      if (this.$route.query.userCode) {
        this.getOrgList()
      }
    },

    deleteBsp() {
      //删除营业执照
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.imageUrl.Bsp = ''
          this.ruleForm.businessLicenseFileId = ''
          this.$baseMessage('删除成功', 'success')
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    deleteLsp() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.imageUrl.Lsp = ''
          this.ruleForm.safetyProdLicenseFileId = ''
          this.$baseMessage('删除成功', 'success')
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    beforeAvatarUpload: function (file) {
      const isLt2M = file.size / 1024 / 1024 < 10 //限制图片大小

      if (!isLt2M) {
        this.$baseMessage('上传头像图片大小不能超过 10MB', 'error')
      }
      return isLt2M
    },
    async changeBsp(file) {
      //上传营业执照
      let data = new FormData()
      data.append('file', file.file)
      const res = await uploadFile(data)
      if (res.code == '0000') {
        this.ruleForm.businessLicenseFileId = res.data.id
      }
      this.imageUrl.Bsp = window.URL.createObjectURL(file.file)
    },
    async changeLsp(file) {
      //上传生产许可证
      let data = new FormData()
      data.append('file', file.file)
      const res = await uploadFile(data)
      if (res.code == '0000') {
        this.ruleForm.safetyProdLicenseFileId = res.data.id
      }
      this.imageUrl.Lsp = window.URL.createObjectURL(file.file)
    },
    async getIndustryData() {
      //获取行业分类数据
      let res = await dictItem(true, 20005)
      if (res.code == '0000') {
        this.industryData = res.data
        this.industryObj = this.setDiGuiDataObj(res.data)
      }
    },
    async getManageData() {
      //获取营业执照数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.manageData = res.data
      }
    },
    async getNational() {
      let res = await getNational()
      if (res.code == '0000') {
        this.nationalData = res.data
        this.nationalObj = this.setDiGuiDataObj(res.data)
      }
    },
    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].sysDictItemEntitys) {
          obj[list[i].id] = list[i].itemText
          this.setDiGuiDataObj(list[i].sysDictItemEntitys, obj)
        } else {
          obj[list[i].id] = list[i].itemText
        }
      }
      return obj
    },
    async getOrgList() {
      let res = await getOrgDetails(this.$route.query.userCode)
      if (res.code == '0000') {
        this.ruleForm = res.data

        if (res.data.sysDictItemEntitys) {
          this.ruleForm.industryId = new Array()
          res.data.sysDictItemEntitys.map((item) => {
            this.ruleForm.industryId.unshift(item.id)
          })
        }
        if (res.data.safetyProdLevel) {
          this.ruleForm.safetyProdLevel = parseInt(res.data.safetyProdLevel)
        }
        let Bspuid = res.data.businessLicenseFileId
        let Lspuid = res.data.safetyProdLicenseFileId

        if (Bspuid) {
          let res0 = await getImgFile('/files/downloadfile/' + Bspuid)
          this.imageUrl.Bsp = res0.data
        }
        if (Lspuid) {
          let res1 = await getImgFile('/files/downloadfile/' + Lspuid)
          this.imageUrl.Lsp = res1.data
        }
        if (res.data.administrations) {
          this.ruleForm.manageId = new Array()
          res.data.administrations.map((item) => {
            this.ruleForm.manageId.unshift(item.id)
          })
        }
        this.ruleForm.areaId = new Array()
        this.ruleForm.areaId = [
          res.data.provinceCode,
          res.data.cityCode,
          res.data.countyCode,
        ]
        if (res.data.areaCode) {
          this.ruleForm.areaId = [
            res.data.provinceCode,
            res.data.cityCode,
            res.data.countyCode,
            res.data.areaCode,
          ]
        }
      }
    },
    // 处理选中省市区方法
    async handleChangeArea(e) {
      if (e) {
        this.ruleForm.provinceCode = e[0] || ''
        this.ruleForm.provinceName = this.areaMap[e[0]] || ''
        this.ruleForm.cityCode = e[1] || ''
        this.ruleForm.cityName = this.areaMap[e[1]] || ''
        this.ruleForm.countyCode = e[2] || ''
        this.ruleForm.countyName = this.areaMap[e[2]] || ''
        this.ruleForm.areaCode = e[3] || ''
        if (e[3]) {
          let res = await getStreet(e[3], { levels: '4' })
          if (res.code == '0000') {
            this.ruleForm.areaName = res.data[e[3]]
          }
        } else {
          this.ruleForm.areaName = ''
        }
      }
    },
    // 处理选中行业类型
    handleChangeIndustry(e) {
      if (!e) {
        return
      }
      this.ruleForm.industryOne = e[0] || ''
      this.ruleForm.industryOneName = this.industryObj[e[0]] || ''
      this.ruleForm.industryTwo = e[1] || ''
      this.ruleForm.industryTwoName = this.industryObj[e[1]] || ''
      this.ruleForm.industryThree = e[2] || ''
      this.ruleForm.industryThreeName = this.industryObj[e[2]] || ''
      this.ruleForm.industryFour = e[3] || ''
      this.ruleForm.industryFourName = this.industryObj[e[3]] || ''
    },
    handleChangeManage(e) {
      //处理选中管理分类数据
      if (!e) {
        return
      }

      this.ruleForm.manageName[0] = this.manageObj[e[0]] || ''
      this.ruleForm.manageName[1] = this.manageObj[e[1]] || ''
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
          this.$baseMessage('请完整填写信息', 'error')
          return false
        }
      })
    },
    async submit() {
      if (this.$route.query.userCode) {
        let res = await editOrg(this.ruleForm, this.$route.query.userCode)
        if (res.code == '0000') {
          this.$baseMessage('修改生产经营单位成功', 'success')
          await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
          this.$router.push({
            path: 'operation',
          })
        }
      } else {
        let res = await addOrg(this.ruleForm)
        if (res.code == '0000') {
          this.$baseMessage('添加生产经营单位成功', 'success')
          await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
          this.$router.push({
            path: 'operation',
          })
        }
      }
    },

    // 设置路由
    async toThisTag() {
      this.$router.push({
        path: 'operation',
      })
    },
    currentEnum(key) {
      return this.getStrEnumAll[key] || []
    },
  },
}
</script>

<style lang="scss" scoped>
#highRiskAdd {
  background-color: #f6f8f9;

  .box {
    padding: 0 0 20px;

    background-color: #fff;
  }
  .form-class {
    margin-bottom: 0 !important;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .right {
    position: absolute;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    right: 0;
    top: 0;
    line-height: 16px;
    color: #000;
    background: #f00;
  }
  .btn-bottom {
    margin-top: 20px;
    text-align: center;
  }
  .w130 {
    width: 130px;
  }
}
</style>
