<template>
  <el-dialog
    title="添加服务计划"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="服务项目类型" prop="preTypeList">
        <el-cascader
          v-model="ruleForm.preTypeList"
          class="w450"
          size="small"
          placeholder="请选择服务项目类型"
          :options="typeData"
          :props="{
            value: 'itemValue',
            label: 'itemText',
            children: 'sysDictItemEntitys',
          }"
          filterable
          @change="setPerType"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="支出金额" prop="expendFund">
        <el-input
          v-model.trim="ruleForm.expendFund"
          class="w300"
          placeholder="请输入服务费金额"
        >
          <template slot="append">元</template>
        </el-input>
        <span class="ml10 color-red-F5222D">( {{ expendFundBig }} )</span>
      </el-form-item>
      <div class="display-flex">
        <el-form-item label="服务时间" prop="startTime">
          <el-date-picker
            v-model="ruleForm.startTime"
            class="w150"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="0px">
          <el-row class="mr10 ml10">至</el-row>
        </el-form-item>
        <el-form-item prop="endTime" label-width="0px">
          <el-date-picker
            v-model="ruleForm.endTime"
            class="w150"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </div>

      <el-form-item label="服务专家" prop="experts">
        <el-select
          v-model="ruleForm.expertsList"
          multiple
          class="w300"
          :multiple-limit="10"
          placeholder="请选择"
          size="small"
          @change="handleSelectionChange"
        >
          <el-option
            v-for="(item, key) in tableList"
            :key="key"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务描述" prop="checkRemark">
        <el-input
          v-model="ruleForm.checkRemark"
          class="w500"
          type="textarea"
          maxlength="200"
          placeholder="形式（线上/线下）、地点、人数、起止时间、主 题等"
        ></el-input>
      </el-form-item>
      <div style="border: 1px dashed #ccc; margin-bottom: 20px"></div>
      <div class="title mb10">
        <span></span>
        <span class="color-blue f16 ml10 mr20">服务信息</span>
        <el-switch
          v-model="ruleForm.isEnterprises"
          style="margin:10px; 0 20px 10px"
          active-color="#13ce66"
          active-text="多家企业"
          inactive-text="一家企业"
          inactive-color="#ff4949"
          @change="setUserFlag"
        ></el-switch>
      </div>

      <el-form-item
        class="mt10"
        v-if="!ruleForm.isEnterprises"
        label="被服务单位"
        prop="corporationCode"
      >
        <el-autocomplete
          v-model.trim="ruleForm.corporationName"
          class="w280"
          size="small"
          popper-class="my-autocomplete"
          :fetch-suggestions="querySearchOrg"
          placeholder="请输入企业名称"
          clearable
          :trigger-on-focus="false"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div class="item-sel">
              <p>{{ item.custFullName }}</p>
              <p>社会信用代码：{{ item.blCode }}</p>
              <p>
                行业领域：{{ item.administrations[0].itemText }}
                <span v-if="item.administrations[1]">
                  / {{ item.administrations[1].itemText }}
                </span>
              </p>
            </div>
          </template>
        </el-autocomplete>
        <el-button
          type="text"
          class="search-icon"
          icon="el-icon-plus"
          @click="addUser"
        >
          添加单位
        </el-button>
      </el-form-item>
      <el-form-item
        class="mt10"
        v-if="ruleForm.isEnterprises"
        label="服务名称"
        prop="planName"
      >
        <el-input
          v-model.trim="ruleForm.planName"
          class="w280"
          size="small"
          maxlength="100"
          placeholder="请输入服务名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.isEnterprises"
        label="服务地点"
        prop="selectedOptions"
      >
        <el-cascader
          v-model="ruleForm.selectedOptions"
          filterable
          class="w280"
          :options="areaList"
          :props="{
            checkStrictly: false,
            label: 'label',
            value: 'value',
            children: 'children',
          }"
          size="small"
          placeholder="请选择地区"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item v-if="currentUserDetails.id">
        <div>
          <span>单位名称：</span>
          <span>{{ currentUserDetails.custFullName }}</span>
        </div>
        <div>
          <span>社会统一信用代码：</span>
          <span>{{ currentUserDetails.blCode }}</span>
          <span class="ml35">行业分类：</span>
          <!-- 行业领域：{{ item.administrations[0].itemText }}
                <span v-if="item.administrations[1]">
                  / {{ item.administrations[1].itemText }}
                </span> -->
          <span>{{ currentUserDetails.administrations[0].itemText }}</span>
          <span v-if="currentUserDetails.administrations[1]">
            {{ currentUserDetails.administrations[1].itemText }}
          </span>
        </div>
        <div>
          <span>所在地区：</span>
          <span>
            {{ currentUserDetails.provinceName }}{{ currentUserDetails.cityName
            }}{{ currentUserDetails.countyName
            }}{{ currentUserDetails.areaName }}
          </span>
        </div>
        <!-- <div>
          <span>企业联系人：</span>
          <span>
            {{ currentUserDetails.contactName }} &nbsp;
            {{ currentUserDetails.contactPhone }}
          </span>
        </div> -->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确认提交</el-button>
    </span>

    <add-Org :industryData="industryData" ref="addOrg" />
  </el-dialog>
</template>

<script>
import { getOrgList } from '@/api/userDataManagement'
import { getOrgExpertList } from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import addOrg from '@/views/userData/highRisk/components/add.vue'
import { getEnum } from '@/api/caseManagement'
import { addPlan } from '@/api/accidentManagement'
import { dateTest, smalltoBIG } from '@/utils/validate'
import { validateBigMoney, validateRemarktextarea } from '@/utils/validateFrom'
import { getAreaDetail, getAreaName, getStreet } from '@/api/Areas'
import { dictItem, getHolder } from '@/api/policyManagement'
export default {
  name: 'AddOrAlter',
  components: {
    addOrg,
  },
  props: {
    projectDetails: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      dealDateStartOptions: this.beginDate(),
      dialogVisible: false,
      typeData: [],
      industryData: [],
      currentUserDetails: {},
      tableList: [], // 专家列表
      ruleForm: {
        accidentPreProjectId: '', // 合同id
        checkRemark: '', // 隐患检查情况综合说明
        corporationCode: '', // 企业编码
        corporationName: '', // 企业名称
        organizationId: '', // 企业id
        planName: '', // 服务名称
        selectedOptions: [], // 服务地点
        planProvinceCode: '',
        planProvinceName: '',
        planCityCode: '',
        planCityName: '',
        planCountyCode: '',
        planCountyName: '',
        planStreetCode: '',
        planStreetName: '',
        // 专家
        experts: [],
        expertsList: [],

        preType: '', // 服务项目类型 隐患排查 应急演练 安全培训
        reCheckRemark: '', // 复查隐患检查情况综合说明
        recheckRemark: '', // 复查服务内容
        startTime: '', // 有效期开始
        endTime: '', // 有效期 截至
        preTypeList: [],
        preFirstType: '',
        preFirstTypeName: '',
        preSecondType: '',
        preSecondTypeName: '',
        isEnterprises: false,
        expendFund: 0,
      },
      expendFundBig: '零',
      allArea: [], //地区下拉框
      isExpertsFlag: true, // 是否必选专家
      specialtyData: [
        {
          code: '00',
          label: '专业一',
        },
      ],
      rules: {
        agencyCode: [
          { required: true, message: '请输入机构代码', trigger: 'blur' },
        ],
        preTypeList: [
          { required: true, message: '请选择项目类型', trigger: 'change' },
        ],
        expendFund: [
          { required: true, validator: validateBigMoney, trigger: 'change' },
        ],
        corporationCode: [
          { required: true, message: '请选择服务企业', trigger: 'change' },
        ],
        planName: [{ required: true, message: '请填写', trigger: 'blur' }],
        experts: [
          { required: true, message: '请选择服务专家', trigger: 'change' },
        ],
        selectedOptions: [
          { required: true, message: '请选择地点', trigger: 'change' },
        ],
        startTime: [
          { required: true, message: '请选择服务起期', trigger: 'change' },
        ],
        endTime: [
          { required: true, message: '请选择服务止期', trigger: 'change' },
        ],
        checkRemark: [
          { required: true, message: '请输入服务描述', trigger: 'blur' },
          {
            required: true,
            validator: validateRemarktextarea,
            trigger: 'change',
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      enumList: 'enums/getStrEnumAll',
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
    }),
  },
  watch: {
    'ruleForm.expendFund': function (n, o) {
      this.expendFundBig = smalltoBIG(n) || '零'
    },
  },
  mounted() {
    // this.initRole()
    this.getArea()
    this.getIndustryData()
  },
  methods: {
    async initData(val) {
      console.log(val, 'val')
      this.dialogVisible = true
      // this.typeData = this.currentEnum('AccidentTypeEnum')
      let res = await dictItem(true, 20004)
      if (res.code == '0000') {
        this.typeData = res.data
      }

      await this.getOrgExpertList(val.serviceAgencyId)
      this.ruleForm.accidentPreProjectId = val.id
    },
    // 设置服务项目类型
    setPerType(e) {
      if (e.length !== 0) {
        let preFirstType = this.typeData.find((item) => item.itemValue == e[0])
        if (preFirstType.sysDictItemEntitys) {
          let preSecondType = preFirstType.sysDictItemEntitys.find(
            (item) => item.itemValue == e[1]
          )
          this.ruleForm.preSecondType = preSecondType.itemValue
          this.ruleForm.preSecondTypeName = preSecondType.itemText
        }
        this.ruleForm.preFirstType = preFirstType.itemValue
        this.ruleForm.preFirstTypeName = preFirstType.itemText
      } else {
        this.ruleForm.preFirstType = ''
        this.ruleForm.preFirstTypeName = ''
        this.ruleForm.preSecondType = ''
        this.ruleForm.preSecondTypeName = ''
      }
      this.changIsExperts()
    },
    // 处理是否必选专家方法
    changIsExperts() {
      // 1.安全生产科技推广应用 06
      // 2.其他有关事故预防工作 07
      // 3.每个类型里面的其他 二级类型的code 104 204 303 404 503
      // 以上情况专家均为非必填项
      let preFirstType = ['', '06', '07']
      let preSecondType = ['104', '204', '303', '404', '503']
      let preFirstTypeFlag = preFirstType.some(
        (item) => this.ruleForm.preFirstType == item
      )
      let preSecondTypeFlag = preSecondType.some(
        (item) => this.ruleForm.preSecondType == item
      )
      if (preFirstTypeFlag || preSecondTypeFlag) {
        this.isExpertsFlag = false
      } else {
        this.isExpertsFlag = true
      }
    },
    async getArea() {
      // this.allArea = this.areaList
      // this.allArea.unshift({
      //   label: '全部',
      //   value: '0',
      // })
      // console.log(this.allArea, this.areaList, 'allArea')
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    async handleChange(value) {
      // 地区选择
      if (value) {
        ;(this.ruleForm.planProvinceCode = value[0] || ''),
          (this.ruleForm.planCityCode = value[1] || ''),
          (this.ruleForm.planCountyCode = value[2] || ''),
          (this.ruleForm.planStreetCode = value[3] || '')
        this.ruleForm.planProvinceName = this.areaMap[value[0]] || ''
        this.ruleForm.planCityName = this.areaMap[value[1]] || ''
        this.ruleForm.planCountyName = this.areaMap[value[2]] || ''
        if (value[3]) {
          let res = await getStreet(value[value.length - 1], { levels: '4' })
          if (res.code == '0000') {
            this.ruleForm.planStreetName = res.data[value[3]]
          }
        }
      }
      console.log(this.ruleForm)
    },
    async getOrgExpertList(id) {
      let res = await getOrgExpertList(
        {
          pn: 1,
          ps: 999,
        },
        'safetyOrganizationSvc',
        id
      )
      if (res.code === '0000') {
        this.tableList = res.list.map((item) => {
          return {
            ...item,
            name: item.safetyTechniciansName,
            specialty: item.safetyTechniciansMajor,
          }
        })
      }
    },
    async querySearchOrg(queryString, cb) {
      getHolder(queryString).then((res) => {
        var List = []
        setTimeout(() => {
          if (!res.data) {
            this.$set(this.FormData, 'holderName', '')
            this.$baseMessage('无该企业信息！', 'warning')
            cb(List)
          }
        }, 2100)
        if (res.data) {
          List = res.data.map((item) => {
            return { value: item.custFullName, ...item }
          })
          cb(List) // 调用 callback 返回建议列表的数据
        }
      })
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.ruleForm.id = ''
      this.currentUserDetails = {}
      this.ruleForm.preTypeList = []
      this.ruleForm.expertsList = []
      this.ruleForm.corporationName = ''
    },
    close() {
      this.clear()
    },
    async configRegister() {
      let data = JSON.parse(JSON.stringify(this.ruleForm))
      if (dateTest(this.ruleForm.startTime, this.ruleForm.endTime)) {
        this.$baseMessage('起期不能大于止期', 'error')
        return
      } else if (dateTest(this.ruleForm.endTime, this.projectDetails.endTime)) {
        this.$message.error('服务时间不能超过合同期限')
        return
      } else if (
        dateTest(this.projectDetails.startTime, this.ruleForm.startTime)
      ) {
        this.$message.error('服务时间不能超过合同期限')
        return
      }
      if (data.corporationCode) {
        // 当选择企业时，赋值企业地址给服务地址
        data.planProvinceCode = this.currentUserDetails.provinceCode
        data.planCityCode = this.currentUserDetails.cityCode
        data.planCountyCode = this.currentUserDetails.countyCode
        data.planStreetCode = this.currentUserDetails.areaCode
        data.planProvinceName = this.currentUserDetails.provinceName
        data.planCityName = this.currentUserDetails.cityName
        data.planCountyName = this.currentUserDetails.countyName
        data.planStreetName = this.currentUserDetails.areaName
      }
      data.startTime = `${data.startTime} 00:00:00`
      data.endTime = `${data.endTime} 23:59:59`
      let res = await addPlan(data)
      if (res.code === '0000') {
        this.$baseMessage('添加成功', 'success')
        this.dialogVisible = false
        this.close()
        this.$emit('successCb')
      }
    },
    register() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.configRegister()
        } else {
          return false
        }
      })
    },
    handleSelect(item) {
      console.log(item)
      this.ruleForm.planName = item.custFullName
      this.ruleForm.corporationCode = item.blCode
      this.ruleForm.organizationId = item.id
      if (item.industryTypeItems) {
        item.orgNatureName =
          item.industryTypeItems[item.industryTypeItems.length - 1].itemText
      }
      this.currentUserDetails = item
    },
    handleSelectionChange(val) {
      this.ruleForm.experts = val.map((item) => {
        let obj = {
          name: this.tableList.find((v1) => v1.id == item).name,
          specialty: this.tableList.find((v1) => v1.id == item).specialty,
          expertInfoId: this.tableList.find((v1) => v1.id == item).id,
        }
        return obj
      })
    },
    beginDate() {
      let self = this
      return {
        disabledDate(time) {
          return time.getTime() < new Date(self.projectDetails.startTime)
        },
      }
    },
    currentEnum(key) {
      return this.enumList[key] || []
    },
    async getIndustryData() {
      //获取管理分类信息
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    // 被服务单位信息，为false的时候，清空被服务单位信息
    setUserFlag(e) {
      if (!e) {
        this.ruleForm.planName = ''
        this.ruleForm.selectedOptions = []
      } else {
        this.ruleForm.corporationName = ''
        this.ruleForm.corporationCode = ''
        this.ruleForm.organizationId = ''
        this.currentUserDetails = {}
      }
    },
    // 当重新搜索用户时，不管成功还是失败，都要清空之前的企业信息
    setUserDetails() {
      this.ruleForm.corporationCode = ''
      this.ruleForm.organizationId = ''
      this.currentUserDetails = {}
    },
    addUser() {
      this.$refs.addOrg.dialogVisible = true
      // this.$refs.addUser.getInit()
    },
  },
}
</script>

<style lang="scss" scoped>
.details-title {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 700;
}
.title {
  display: flex;
  height: 40px;
  width: 100%;
  margin: 0 auto;
  align-items: center;

  font-size: 12px;
  border-bottom: 1px solid #e9e9e9;
}
.title > span:nth-child(1) {
  display: inline-block;
  width: 5px;
  height: 16px;
  background-color: #096dd9;
}
.my-autocomplete li .item-sel {
  padding: 5px 10px 10px 10px;
  border-bottom: 1px solid #ccc;

  p {
    margin: 0;
    height: 26px;
    line-height: 26px;
    font-size: 13px;
  }
}
</style>
