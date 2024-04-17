<template>
  <el-dialog
    :title="id ? '修改保险机构' : '新增保险机构'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false" width="1000px"
    @open="initData" @close="close">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" id="addOrAlert">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">基本信息</span>
      </div>
      <el-form-item label="机构类型：" prop="orgType">
        <el-radio-group v-model="ruleForm.orgType" @change="orgChange">
          <el-radio v-for="item in typeData" :key="item.code" :label="item.code">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="机构名称：" prop="orgName">
        <el-input v-model="ruleForm.orgName" class="w250" placeholder="请输入机构名称"></el-input>
        <span class="tips">{{ getOrgName }}</span>
      </el-form-item>
      <el-form-item label="机构代码：" prop="orgCode">
        <el-input v-model="ruleForm.orgCode" class="w250" placeholder="请输入机构代码"></el-input>
        <span class="tips">{{ getOrgCode }}</span>
      </el-form-item>
      <el-form-item label="社会信用代码：" prop="businessCode">
        <el-input v-model="ruleForm.businessCode" class="w250" placeholder="请输入社会信用代码"></el-input>
        <span class="tips">{{ getBusinessCode }}</span>
      </el-form-item>
      <el-form-item v-if="totalCom" label="绑定总公司：" prop="headquartersName">
        <el-input v-model="ruleForm.headquartersName" class="w250" placeholder="请输入总公司名称"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item label="经营地址：" prop="selectedOptions">
            <el-cascader v-model="ruleForm.selectedOptions" filterable class="w250" :options="areaList"
              placeholder="请选择区域" @change="handleChangeArea"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="detailAddr" style="margin-left: -105px">
            <el-input v-model="ruleForm.detailAddr" class="w300" placeholder="请输入详细地址" style="line-height: 40px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="ruleForm.orgType != 1" label="总部名称">
        <el-input v-model="ruleForm.headquartersName" class="w250" placeholder="请输入总部名称"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.orgType != 1" label="总部编码">
        <el-input v-model="ruleForm.headquartersCode" class="w250" placeholder="请输入总部编码"></el-input>
      </el-form-item>
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">法人代表/主要负责人</span>
      </div>
      <el-row>
        <el-col :span="10">
          <el-form-item label="姓名:">
            <el-input v-model="ruleForm.safetyCharger" class="w250" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话:">
            <el-input v-model="ruleForm.safetyChargerPhone" class="w250" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getBranchDetails,
  putBranch,
  addInsuranceBranch,
} from '@/api/userDataManagement'
import { getDictData } from '@/api/userManagement'
import {
  validatePhone,
  validateOrgName,
  validateAddress,
  validateBusiness,
  validateCharger,
} from '@/utils/validateFrom'
import { getIndustrys } from '@/utils/index'
import { getAreaDetail, getStreet } from '@/api/Areas'
import { mapGetters } from 'vuex'
export default {
  name: 'AddOrAlter',

  data() {
    return {
      totalCom: false,
      typeData: [],
      serviceItems: [], // 服务项目
      allArea: [], //地址
      dialogVisible: false,
      ruleForm: {
        orgType: 1, // 机构类型
        orgName: '', // 机构名称
        // headquartersName: '', //总公司名称
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
        streetCode: '',
        streetName: '',
        // headquartersName: '',
        dataStatus: '1', // 状态
        servicename: 'insuranceCompanySvc',
        // serviceAccidentType: '', //服务项目
        // industryParam: [], // 服务行业
        // serviceIndustrys: [], // 接口入参行业集合
      },
      id: '',
      industryData: [], // 行业
      userCode: '',
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
  created() {

    this.getDict()

  },
  mounted() { },
  methods: {
    orgChange(value) {
      console.log(value);
    },

    loge(e) {
      if (e != 1) {
        this.totalCom = true
      } else {
        this.ruleForm.headquartersName = ''
        this.totalCom = false
      }
    },
    async getDict() {
      // 获取字典表行业和机构类型、服务项目
      console.log(this.getStrEnumAll)
      this.typeData = this.getStrEnumAll.OrganizationTypeEnum
      this.serviceItems = this.getStrEnumAll.ServiceItemsEnum
      let res = await getDictData(true, '20003')
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async initData() {
      // 初始化加载
      if (!this.id) {
        return
      }
      let data = {
        servicename: 'insuranceCompanySvc',
        code: this.id,
      }
      let res = await getBranchDetails(data)
      if (res.code === '0000') {
        // res.data.industryParam = res.data.serviceIndustryCode.split(',')
        if (res.data.headquartersName) {
          this.totalCom = true
        }
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
    async getAllArea() {
      //获取地区四级下拉框
      let res = await getAreaInfo(0, { levels: '1,2,3,4' })
      if (res.code == '0000') {
        this.allArea = res.data
      }
    },

    clear() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.id = ''
      this.dialogVisible = false
      this.ruleForm.safetyCharger = ''
      this.ruleForm.safetyChargerPhone = ''
      this.$emit('refresh', '1')
    },
    close() {
            this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.id = ''
      this.dialogVisible = false
      this.ruleForm.safetyCharger = ''
      this.ruleForm.safetyChargerPhone = ''
    },
    async configRegister() {
      // 修改和新增提交
      let res = ''

      if (this.id) {
        ; (this.ruleForm.servicename = 'insuranceCompanySvc'),
          (res = await putBranch(this.ruleForm))
      } else {
        res = await addInsuranceBranch(this.ruleForm)
      }
      if (res.code === '0000') {
        this.$baseMessage(this.id ? '修改成功' : '添加成功', 'success')
      }
      this.clear()
    },
    register() {
      let text = '确定要新增保险机构基本信息？'
      if (this.id) {
        text = '确定要修改保险机构基本信息？'
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
  },
}
</script>

<style lang="scss">
.tips {
  margin-left: 30px;
  color: #de1e29;
}

#addOrAlert {
  .title {
    display: flex;
    height: 40px;
    width: 96%;
    margin: 0 auto;
    align-items: center;
    padding: 0 20px;
    font-size: 12px;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 20px;

    span:nth-child(1) {
      display: inline-block;
      width: 5px;
      height: 16px;
      background-color: #096dd9;
    }

    span:nth-child(2) {
      line-height: 14px;
    }
  }
}
</style>
