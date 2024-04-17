<template>
  <div>
    <el-dialog
      id="companyAdd"
      :title="userCode ? '修改生产经营单位' : '添加生产经营单位'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="45%"
      append-to-body
      @close="close"
      @open="getInit"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        class="demo-ruleForm"
        label-position="right"
        label-width="180px"
        :rules="rules"
      >
        <el-form-item label="单位名称：" prop="custFullName">
          <el-input
            v-model.trim="ruleForm.custFullName"
            size="small"
            placeholder="请输入单位名称"
            class="item4"
            clearable
          ></el-input>
          <!-- <el-button
            size="small"
            type="primary"
            @click="search"
            class="search-icon"
          >
            查询
          </el-button>
          <el-button
            size="small"
            type="info"
            @click="setForm"
            class="search-icon"
          >
            重置
          </el-button> -->
          <!-- <span class="content-tips">
            <i class="el-icon-warning" style="margin-right: 8px"></i>
            输入完整企业名称，点击“查询”读取企业信息
          </span> -->
        </el-form-item>
        <el-form-item label="社会信用代码：" prop="blCode">
          <el-input
            v-model.trim="ruleForm.blCode"
            size="small"
            placeholder="请输入社会信用代码"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="industryId" label="行业分类：">
          <el-cascader
            v-model="ruleForm.industryId"
            class="item4"
            clearable
            size="small"
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
        <el-form-item prop="manageId" label="管理分类：">
          <el-cascader
            v-model="ruleForm.manageId"
            placeholder="请选择管理分类"
            clearable
            class="item4"
            size="small"
            :options="manageData"
            :props="{
              label: 'itemText',
              value: 'id',
              children: 'sysDictItemEntitys',
            }"
            @change="handleChangeManage"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="实际经营地址：" prop="areaId">
          <el-cascader
            v-if="showArea"
            v-model="ruleForm.areaId"
            filterable
            class="item4"
            size="small"
            :options="allArea"
            placeholder="请选择地区"
            @change="handleChangeArea"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细经营地址:" prop="detailAddress">
          <el-input
            v-model.trim="ruleForm.detailAddress"
            size="small"
            type="textarea"
            placeholder="请输入详细地址"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="contactName" label="企业联系人">
          <el-input
            v-model="ruleForm.contactName"
            clearable
            class="item4"
            size="small"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label="企业联系方式">
          <el-input
            v-model="ruleForm.contactPhone"
            clearable
            class="item4"
            size="small"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right; margin-left: -60px">
          <el-button type="info" round @click="dialogVisible = false">
            取消
          </el-button>
          <el-button type="warning" round @click="register">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
import { dictItem } from '@/api/policyManagement'
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
  name: 'AddUser',
  data() {
    return {
      data: {},
      showArea: false,
      userCode: '',
      dialogVisible: false,
      allArea: [], //地区下拉框
      ruleForm: {
        blCode: '', // 统一社会信用代码
        areaId: [], // 区域
        deliveryAreaName: '',
        custFullName: '', // 单位名称
        detailAddress: '', // 详细地址，除省市县外，例如某某路多少号，可为空
        industryId: [], // 行业分类
        manageId: [], // 管理分类
        provinceCode: '', // 省代码,依照国家颁发行政代码标准
        provinceName: '', // 省名称，全称
        cityCode: '', // 所在市代码
        cityName: '', // 市名称，全称，可为空
        contactName: '', // 企业联系人名称
        contactPhone: '', // 企业联系人电话
        countyCode: '', // 县代码,依照国家颁发行政代码标准，可为空
        countyName: '', // 县名称，全称，可为空
        streetCode: '', // 区代码,依照国家颁发行政代码标准，可为空
        streetName: '', // 区名称，全称，可为空
      },
      industryData: [], // 行业下拉框数据
      industryObj: [], // 行业数据
      manageData: [], //管理数据
      manageObj: [], //管理名字
      manageName: [],
      nationalData: [], // 国民经济
      nationalObj: {},
      rules: {
        custFullName: [
          { required: true, validator: validateDWName, trigger: 'blur' },
        ],

        blCode: [
          { required: true, validator: validateBlCode, trigger: 'blur' },
        ],

        manageId: [
          { required: true, message: '请选择管理分类', trigger: 'blur' },
        ],
        industryId: [
          { required: true, message: '请选择行业分类', trigger: 'change' },
        ],

        areaId: [{ required: true, message: '请选择区域', trigger: 'change' }],
        detailAddress: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
        contactName: [
          { required: true, validator: validateContactName, trigger: 'blur' },
        ],
        contactPhone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
      },
      value: [], // 多级联动的值 => 会是一个数组
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
    }),
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      //初始化
      this.getIndustryData()

      this.getManageData()
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
    // 监听数据变化
    // async handleChange(value) {
    //   if (value) {
    //     ;(this.ruleForm.provinceCode = value[0] || ''),
    //       (this.ruleForm.cityCode = value[1] || ''),
    //       (this.ruleForm.countyCode = value[2] || ''),
    //       (this.ruleForm.streetCode = value[3] || '')
    //     let res = await this.userManage.getAreaName(value[value.length - 1])
    //     if (res.code == '0000') {
    //       ;(this.ruleForm.provinceName = res.data[0].regionName || ''),
    //         (this.ruleForm.cityName = res.data[1].regionName || ''),
    //         (this.ruleForm.countyName = res.data[2].regionName || ''),
    //         (this.ruleForm.streetName = res.data[3].regionName || '')
    //     }
    //   }
    // },
    async search() {
      // if (this.ruleForm.custFullName) {
      //   let res = await this.policyentryService.getAccessinformation(
      //     this.ruleForm.custFullName
      //   )
      //   if (res.code == '0000') {
      //     this.$set(this.ruleForm, 'blCode', res.data.creditCode)
      //     if (res.data.phoneNumber) {
      //       this.$set(this.ruleForm, 'contactPhone', res.data.phoneNumber)
      //     }
      //   }
      // } else {
      //   this.$message.warning('请先填写单位名称')
      // }
    },
    setForm() {
      this.$refs['ruleForm'].resetFields()
    },
    close() {
      this.userCode = ''
      this.ruleForm = {
        blCode: '', // 统一社会信用代码
        areaId: [], // 区域
        deliveryAreaName: '',
        custFullName: '', // 单位名称
        detailAddress: '', // 详细地址，除省市县外，例如某某路多少号，可为空
        industryId: [], // 行业分类
        manageId: [], // 管理分类
        provinceCode: '', // 省代码,依照国家颁发行政代码标准
        provinceName: '', // 省名称，全称
        cityCode: '', // 所在市代码
        cityName: '', // 市名称，全称，可为空
        contactName: '', // 企业联系人名称
        manageName: [],
        contactPhone: '', // 企业联系人电话
        countyCode: '', // 县代码,依照国家颁发行政代码标准，可为空
        countyName: '', // 县名称，全称，可为空
        streetCode: '', // 区代码,依照国家颁发行政代码标准，可为空
        streetName: '', // 区名称，全称，可为空
      }
      this.showArea = false
      this.$refs.ruleForm.resetFields()
    },
    getInit() {
      this.initData()
      this.showArea = true
      if (this.userCode) {
        this.getOrgList()
      }
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
      //获取管理分类
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
      let res = await this.userManage.enterpriseDetail(this.userCode)
      if (res.code == '0000') {
        this.ruleForm = res.data
        if (res.data.sysDictItemEntitys) {
          this.ruleForm.industryId = new Array()
          res.data.sysDictItemEntitys.map((item) => {
            this.ruleForm.industryId.unshift(item.id)
          })
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
        if (res.data.streetCode) {
          this.ruleForm.areaId = [
            res.data.provinceCode,
            res.data.cityCode,
            res.data.countyCode,
            res.data.streetCode,
          ]
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
          this.$message.error('请完整填写信息')
          return false
        }
      })
    },

    async submit() {
      if (this.userCode) {
        let res = await editOrg(this.ruleForm, this.userCode)
        if (res.code == '0000') {
          this.$message.success('修改生产经营单位成功')
        }
      } else {
        let res = await addOrg(this.ruleForm)
        if (res.code == '0000') {
          this.$message.success('添加生产经营单位成功')
        }
      }
      this.dialogVisible = false
      this.$emit('getMsg', '刷新')
    },
  },
}
</script>

<style lang="scss">
#companyAdd {
  .el-dialog {
    width: 750px;
    .item4 {
      width: 280px;
    }
    .search-icon {
      margin-left: 10px;
    }
    .item1 {
      width: 260px;
      margin-right: 20px;
    }
    .item2 {
      width: 250px;
    }
    .item5 {
      width: 300px;
    }
    .content-tips {
      display: inline-block;
      height: 34px;
      line-height: 34px;
      background-color: #dbf9ef;
      color: #34c697;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
</style>
