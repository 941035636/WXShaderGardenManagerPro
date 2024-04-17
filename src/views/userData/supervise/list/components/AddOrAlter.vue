<template>
  <el-dialog
    :title="ruleForm['id'] ? '编辑机构' : '添加机构'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="1000px"
    @close="close"
    @open="initData"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
    >
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">基本信息</span>
      </div>
      <el-form-item label="机构名称：" prop="name">
        <el-input
          v-model="ruleForm.name"
          class="w280"
          placeholder="请输入机构名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="机构类型：" prop="orgType">
        <el-select
          v-model="ruleForm.orgType"
          class="w280"
          filterable
          clearable
          placeholder="请选择机构类型"
        >
          <el-option
            v-for="(item, key) in typeDataorgtypeData"
            :key="key"
            :label="item.label"
            :value="item.strCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监管行业：" prop="industryList">
        <el-select
          class="w280"
          v-model="ruleForm.industryList"
          multiple
          placeholder="请选择监管行业"
          @change="handchangeselect"
        >
          <el-option
            v-for="item in industryData"
            :key="item.value"
            :label="item.itemText"
            :value="item.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管辖区域：" prop="jurisdictionSelected">
        <el-cascader
          v-model="ruleForm.jurisdictionSelected"
          filterable
          class="w280"
          :options="AreaGZ"
          :props="{ checkStrictly: true }"
          placeholder="请选择区域"
          @change="handleChangeJurisdiction"
          style="line-height: 32px !important"
        ></el-cascader>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item label="联系地址：" prop="selectedOptions">
            <el-cascader
              v-model="ruleForm.selectedOptions"
              filterable
              class="w280"
              :options="areaList"
              placeholder="请选择联系地址"
              @change="handleChangeArea"
              style="line-height: 32px !important"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="address" style="margin-left: -70px">
            <el-input
              v-model="ruleForm.address"
              class="w280"
              placeholder="请输入详细地址"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">联系人</span>
      </div>
      <el-row>
        <el-col :span="10">
          <el-form-item label="姓名：">
            <el-input
              v-model="ruleForm.contactName"
              class="w280"
              placeholder="请输入联系人"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="电话：">
            <el-input
              v-model="ruleForm.contactPhone"
              class="w280"
              placeholder="请输入联系电话"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="职务：">
        <el-select
          v-model="ruleForm.duty"
          class="w280"
          placeholder="请选择职务"
        >
          <el-option
            v-for="item in typeData"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="授权key">
        <el-input
          v-model="ruleForm.urlKey"
          class="w280"
          placeholder="请输入授权key"
        ></el-input>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addYingJiZhanghao,
  putYingJiZhanghao,
  getYingJiZhanghaoDetail,
} from '@/api/userManagement'
import { dictItem } from '@/api/policyManagement'
import {
  validateOrgName,
  validatePhone,
  validateCharger,
  validateAddress,
} from '@/utils/validateFrom'
import { mapGetters } from 'vuex'
import { getAreaDetail, getAreaInfo, getStreet } from '@/api/Areas'
export default {
  name: 'AddOrAlter',
  props: {
    typeData: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    roleData: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    AreaGZ: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      industryData: [],
      typeDataorgtypeData: [], //机构类型
      dialogVisible: false,
      allArea: [], //联系地址
      ruleForm: {
        name: '',
        selectedOptions: [], // 区域
        orgType: '', //机构类型
        industryList: [], // 监管行业
        supervisionIndustry: [],
        jurisdictionSelected: [], // 管辖区域
        address: '',
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        countyCode: '',
        countyName: '',
        streetCode: '',
        streetName: '',
        contactName: '',
        contactPhone: '',
        duty: '',
        id: '',
        dataType: '', //  1 省 2 市 3 区"
        urlKey: '',
        dataStatus: '1',
        addressAreaCode: '', // 联系人地址省市区最后一级
      },
      id: '',
      rules: {
        name: [{ required: true, validator: validateOrgName, trigger: 'blur' }],
        selectedOptions: [
          { required: true, message: '请选择区域', trigger: 'change' },
        ],
        address: [
          { required: true, validator: validateAddress, trigger: 'blur' },
        ],
        contactName: [
          { required: true, validator: validateCharger, trigger: 'blur' },
        ],
        contactPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' },
        ],
        duty: [{ required: true, message: '请选择职务', trigger: 'change' }],
        jurisdictionSelected: [
          { required: true, message: '请选择管辖区域', trigger: 'change' },
        ],
        orgType: [
          { required: true, message: '请选择机构类型', trigger: 'change' },
        ],
        industryList: [
          { required: true, message: '请选择监管行业', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      areaListAll: 'areas/areaListAll',
      areaMap: 'areas/areaMap',
      enumObj: 'enums/getStrEnumAll',
    }),
    getCurrentArea() {
      let currentAreaList = []
      if (this.areaList && this.areaList.length !== 0) {
        let areaObj = this.areaList.find(
          (item) => item.value === sysConfig.street_code
        )
        currentAreaList[0] = areaObj
      }
      return currentAreaList[0] ? currentAreaList : []
    },
  },
  created() {
    // this.getAllArea()
  },
  mounted() {},
  methods: {
    handchangeselect(e) {
      this.$forceUpdate() // 解决修改是数据层太多无法修改
      this.ruleForm.supervisionIndustry = []
      e.forEach((element) => {
        let obj = this.industryData.find((v1) => v1.itemValue == element)
        if (obj) {
          let data = {
            industryCode: obj.itemValue,
            industryName: obj.itemText,
          }
          this.ruleForm.supervisionIndustry.push(data)
        }
      })
      console.log(
        this.ruleForm.industryList,
        this.ruleForm.supervisionIndustry,
        '='
      )
    },
    // async getAllArea() {
    //   //获取地区四级下拉框
    //   let res = await getAreaInfo(0, { levels: '1,2,3' })
    //   if (res.code == '0000') {
    //     this.AreaGZ = res.data
    //     this.allArea = res.data
    //   }
    // },
    async getDictItem() {
      //获取管理分类信息
      let res = await dictItem(true, 20003)
      console.log(res, '--00')
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async initData() {
      this.typeDataorgtypeData = this.createorptype()
      this.getDictItem()
      if (!this.id) return
      let res = await getYingJiZhanghaoDetail(this.id)
      if (res.code === '0000') {
        this.ruleForm = res.data
        this.ruleForm.industryList = res.data.supervisionIndustry.map(
          (element) => element.industryCode
        )
        let selectedOptions = []
        console.log(res.data.addressAreaCode.substring(6, 12), '---===')
        if (res.data.addressAreaCode.substring(6, 12) == '000000') {
          let countyCode = res.data.addressAreaCode

          let cityCode = res.data.addressAreaCode.substring(0, 4) + '00000000'
          let provinceCode =
            res.data.addressAreaCode.substring(0, 2) + '0000000000'
          selectedOptions = [provinceCode, cityCode, countyCode]
        } else {
          let streetCode = res.data.addressAreaCode
          let countyCode = res.data.addressAreaCode.substring(0, 6) + '000000'
          let cityCode = res.data.addressAreaCode.substring(0, 4) + '00000000'
          let provinceCode =
            res.data.addressAreaCode.substring(0, 2) + '0000000000'
          selectedOptions = [provinceCode, cityCode, countyCode, streetCode]
        }
        console.log(selectedOptions, 'selectedOptions')
        if (res.data.streetCode) {
          let jurisdictionSelected = [
            res.data.provinceCode,
            res.data.cityCode,
            res.data.countyCode,
            res.data.streetCode,
          ]
          this.$set(this.ruleForm, 'jurisdictionSelected', jurisdictionSelected)
        } else {
          let areaArr = [
            res.data.provinceCode,
            res.data.cityCode,
            res.data.countyCode,
          ]
          let jurisdictionSelected = areaArr.filter(function (n) {
            return n
          })
          this.$set(this.ruleForm, 'jurisdictionSelected', jurisdictionSelected)
        }

        this.ruleForm.contactPhone = res.data.phoneNum
        this.$set(this.ruleForm, 'selectedOptions', selectedOptions)

        console.log(this.ruleForm.jurisdictionSelected, 'jurisdictionSelected')
      }
    },
    createorptype() {
      return this.enumObj['SupervisionOrgTypeEnum'] || []
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.ruleForm.id = ''
      this.id = ''
    },
    cancel() {
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
      this.ruleForm.id = ''
      this.ruleForm.contactName = ''
      this.ruleForm.contactPhone = ''
      this.ruleForm.duty = ''
      this.id = ''
    },
    close() {
      this.clear()
    },
    async configRegister() {
      let data = JSON.parse(JSON.stringify(this.ruleForm))

      let res = ''
      if (this.ruleForm.id) {
        res = await putYingJiZhanghao(data)
      } else {
        res = await addYingJiZhanghao(data)
      }
      if (res.code === '0000') {
        this.$baseMessage(this.ruleForm.id ? '修改成功' : '添加成功', 'success')
        this.$parent.getList()
        this.dialogVisible = false
      }
    },
    register() {
      let text = '确认添加政府机构？'
      if (this.ruleForm.id) {
        text = '确定要修改政府机构？'
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
    handleChangeArea(e) {
      this.ruleForm.addressAreaCode = e[e.length - 1]
    },
    // 处理选中应急局管辖区域省市区方法
    async handleChangeJurisdiction(e) {
      this.ruleForm.cityCode = ''
      this.ruleForm.cityName = ''
      this.ruleForm.countyCode = ''
      this.ruleForm.countyName = ''
      this.ruleForm.streetCode = ''
      this.ruleForm.streetName = ''
      this.ruleForm.provinceCode = e[0]
      this.ruleForm.provinceName = this.areaMap[e[0]] || ''
      this.ruleForm.cityCode = e[1] || ''
      this.ruleForm.cityName = this.areaMap[e[1]] || ''
      this.ruleForm.countyCode = e[2] || ''

      this.ruleForm.countyName = this.areaMap[e[2]] || ''
      console.log(this.ruleForm, '3333')
      if (e[3]) {
        this.ruleForm.streetCode = e[3]
        let res = await getStreet(e[3], { levels: '4' })
        if (res.code == '0000') {
          this.ruleForm.streetName = res.data[e[3]]
        }
      } else {
        this.ruleForm.streetCode = ''
        this.ruleForm.streetNames = ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
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
</style>
