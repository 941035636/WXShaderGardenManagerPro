<template>
  <div id="brokerAdd">
    <Title title="保险经纪机构信息" class="mb30"></Title>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="200px"
    >
      <el-form-item label="机构类型：" prop="orgType">
        <el-select
          v-model="ruleForm.orgType"
          class="w250"
          placeholder="请选择企业类型"
          @change="loge"
        >
          <el-option
            v-for="item in typeData"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称：" prop="orgName">
        <el-input
          v-model="ruleForm.orgName"
          class="w250"
          placeholder="请输入机构名称"
        ></el-input>
        <span class="tips">{{ getOrgName }}</span>
      </el-form-item>
      <el-form-item label="机构代码：" prop="orgCode">
        <el-input
          v-model="ruleForm.orgCode"
          class="w250"
          placeholder="请输入机构代码"
        ></el-input>
        <span class="tips">{{ getOrgCode }}</span>
      </el-form-item>
      <el-form-item label="社会信用代码：" prop="businessCode">
        <el-input
          v-model="ruleForm.businessCode"
          class="w250"
          placeholder="请输入社会信用代码"
        ></el-input>
        <span class="tips">{{ getBusinessCode }}</span>
      </el-form-item>
      <el-form-item
        v-if="totalCom"
        label="绑定总公司："
        prop="headquartersName"
      >
        <el-input
          v-model="ruleForm.headquartersName"
          class="w250"
          placeholder="请输入总公司名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="安责险业务责任人姓名:" prop="safetyCharger">
        <el-input
          v-model="ruleForm.safetyCharger"
          class="w250"
          placeholder="请输入联系人名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="安责险业务责任人联系电话:" prop="safetyChargerPhone">
        <el-input
          v-model="ruleForm.safetyChargerPhone"
          class="w250"
          placeholder="请输入企业联系人电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="地址信息：" prop="selectedOptions">
        <el-cascader
          v-model="ruleForm.selectedOptions"
          class="w250"
          :options="allArea"
          placeholder="请选择区域"
          @change="handleChangeArea"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址：" prop="detailAddr">
        <el-input
          v-model="ruleForm.detailAddr"
          class="w250"
          placeholder="请输入详细地址"
        ></el-input>
      </el-form-item>
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
  getBranchDetails,
  putBranch,
  addInsuranceBranch,
} from '@/api/userDataManagement'
import { getAreaDetail, getStreet } from '@/api/Areas'
import { getDictData } from '@/api/userManagement'
import {
  validatePhone,
  validateOrgName,
  validateAddress,
  validateBusiness,
  validateCharger,
} from '@/utils/validateFrom'
import { getIndustrys } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'BrokerAdd',
  components: {
    Title,
  },
  data() {
    return {
      totalCom: false,
      typeData: [],
      allArea: [], //地区
      serviceItems: [], // 服务项目
      ruleForm: {
        orgType: '', // 机构类型
        orgName: '', // 机构名称
        orgCode: '', // 机构代码
        headquartersName: '', //总公司名称
        businessCode: '', //社会信用代码
        orgCode: '', // 是01：总部，依据《保险行业机构代码编 码规范（JR/T 0035-2007）》填写；如是02-04， 依据本单位内部编', ,
        safetyCharger: '', //负责人姓名
        safetyChargerPhone: '', // 负责人电话
        detailAddr: '', // 经营地址
        headquartersCode: '', //总部名称编码 如是02-04，应填写此信息；如是“01：总部”, 可不填 ,
        headquartersName: '', //总部名称 如是02-04，应填写此信息；如是“01：总部”, 可不填 ,=
        selectedOptions: [], // 区域
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        countryCode: '',
        countyName: '',
        id: '',
        dataStatus: '1', // 状态
        servicename: 'insuranceBrokerSvc',
        // serviceAccidentType: '', //服务项目
        // industryParam: [], // 服务行业
        // serviceIndustrys: [], // 接口入参行业集合
      },
      userCode: '',
      industryData: [], // 行业
      rules: {
        orgType: [
          { required: true, message: '请选择机构类型', trigger: 'change' },
        ],
        orgName: [
          { required: true, validator: validateOrgName, trigger: 'blur' },
        ],
        headquartersName: [
          { required: true, validator: validateOrgName, trigger: 'blur' },
        ],
        orgCode: [
          { required: true, validator: validateBusiness, trigger: 'blur' },
        ],
        businessCode: [
          { required: true, validator: validateBusiness, trigger: 'blur' },
        ],
        selectedOptions: [
          { required: true, message: '请选择区域', trigger: 'change' },
        ],
        detailAddr: [
          { required: true, validator: validateAddress, trigger: 'blur' },
        ],
        safetyCharger: [
          { required: true, validator: validateCharger, trigger: 'blur' },
        ],
        safetyChargerPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' },
        ],
        // serviceAccidentType: [
        //   { required: true, message: '请选择服务项目', trigger: 'change' },
        // ],
        // industryParam: [
        //   { required: true, message: '请选择服务行业', trigger: 'change' },
        // ],
      },
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      areaListAll: 'areas/areaListAll',
      areaMap: 'areas/areaMap',
      visitedRoutes: 'tabsBar/visitedRoutes',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
    getOrgName() {
      return this.ruleForm.orgType == 1
        ? '总部机构名称'
        : this.ruleForm.orgType == 2
        ? '分公司机构名称'
        : this.ruleForm.orgType == 3 || this.ruleForm.orgType == 4
        ? '支公司机构名称'
        : ''
    },
    getOrgCode() {
      return this.ruleForm.orgType == 1
        ? '总部机构代码'
        : this.ruleForm.orgType == 2
        ? '分公司机构代码'
        : this.ruleForm.orgType == 3 || this.ruleForm.orgType == 4
        ? '支公司机构代码'
        : ''
    },
    getBusinessCode() {
      return this.ruleForm.orgType == 1
        ? '总部社会信用代码'
        : this.ruleForm.orgType == 2
        ? '分公司社会信用代码'
        : this.ruleForm.orgType == 3 || this.ruleForm.orgType == 4
        ? '支公司社会信用代码'
        : ''
    },
  },
  mounted() {
    this.getInitData()
  },
  methods: {
    loge(e) {
      if (e != 1) {
        this.totalCom = true
      } else {
        this.ruleForm.headquartersName = ''
        this.totalCom = false
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
      // 获取字典表行业类型和枚举类下拉框选项
      this.typeData = this.getStrEnumAll.OrganizationTypeEnum
      this.serviceItems = this.getStrEnumAll.ServiceItemsEnum
      let res = await getDictData(true, '20003')
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    changeIndustry(val) {},
    async initData(code) {
      let data = {
        servicename: 'insuranceBrokerSvc',
        code: code,
      }
      let res = await getBranchDetails(data)
      if (res.code === '0000') {
        // if (res.data.serviceIndustryCode) {
        //   res.data.industryParam = res.data.serviceIndustryCode.split(',')
        // }
        if (res.data.headquartersName) {
          this.totalCom = true
        }
        res.data.serviceIndustrys = []
        this.ruleForm = res.data
        this.ruleForm.selectedOptions = [
          res.data.provinceCode,
          res.data.cityCode,
          res.data.countryCode,
        ]
        if (res.data.streetCode) {
          this.ruleForm.selectedOptions = [
            res.data.provinceCode,
            res.data.cityCode,
            res.data.countryCode,
            res.data.streetCode,
          ]
        }
      }
    },
    async configRegister() {
      // 提交或者修改请求接口
      let res = ''
      // this.ruleForm.serviceIndustrys = getIndustrys(
      //   this.industryData,
      //   this.ruleForm.industryParam
      // )
      if (this.ruleForm.id) {
        this.ruleForm.servicename = 'insuranceBrokerSvc'
        res = await putBranch(this.ruleForm)
      } else {
        res = await addInsuranceBranch(this.ruleForm)
      }
      if (res.code === '0000') {
        this.$baseMessage(this.ruleForm.id ? '修改成功' : '添加成功', 'success')
        this.toThisTag()
      }
    },

    register() {
      let text = '确定要新增保险经纪机构基本信息？'
      if (this.ruleForm['id']) {
        text = '确定要修改保险经纪机构基本信息？'
      }
      this.$baseConfirm(
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
    // 处理选中省市区方法
    async handleChangeArea(e) {
      this.ruleForm.provinceCode = e[0]
      this.ruleForm.provinceName = this.areaMap[e[0]] || ''
      this.ruleForm.cityCode = e[1]
      this.ruleForm.cityName = this.areaMap[e[1]] || ''
      this.ruleForm.countryCode = e[2]
      this.ruleForm.countyName = this.areaMap[e[2]] || ''
      this.ruleForm.streetCode = e[3] || ''
      if (e[3]) {
        let res = await getStreet(e[3], { levels: '4' })
        if (res.code == '0000') {
          this.ruleForm.streetName = res.data[e[3]]
        }
      }
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
        path: 'brokerList',
      })
      return view
    },
  },
}
</script>

<style scoped lang="scss">
#brokerAdd {
  margin: 0 20px;
  padding: 20px 30px;
  .tips {
    margin-left: 30px;
    color: #de1e29;
  }
}
</style>
