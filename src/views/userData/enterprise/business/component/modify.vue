<template>
  <div>
    <el-dialog
      id="companyAdd"
      title="修改"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="70%"
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
        <el-form-item prop="custFullName" label="企业名称">
          <el-input
            v-model="ruleForm.custFullName"
            clearable
            class="w450"
            maxlength="50"
            placeholder="请输入"
            size="mini"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="blCode" label="社会信用代码">
          <el-input
            v-model="ruleForm.blCode"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
        <br />
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
        <el-form-item prop="detailAddress">
          <el-input
            v-model="ruleForm.detailAddress"
            class="w300"
            size="mini"
            clearable
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="industryId2" label="所属行业">
          <el-cascader
            v-model="ruleForm.industryId2"
            filterable
            class="w250"
            clearable
            size="mini"
            :options="industryData"
            placeholder="请选择"
            :props="{
              label: 'itemText',
              value: 'itemValue',
              children: 'sysDictItemEntitys',
            }"
            @change="handleChangeIndustry"
          ></el-cascader>
        </el-form-item>
        <br />
        <el-form-item prop="manageId2" label="民国经济行业">
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
        <br />
        <el-form-item prop="businessType" label="类型">
          <el-radio-group v-model="ruleForm.businessType">
            <el-radio
              :label="item.value"
              :value="item.value"
              v-for="(item, index) in currenTyle"
              :key="index"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="orgStatus" label="经营状态">
          <el-radio-group v-model="ruleForm.orgStatus">
            <el-radio
              :label="item.code"
              :value="item.code"
              v-for="(item, index) in currentEnum('BusinesStatus')"
              :key="index"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
        <el-form-item prop="belongToYear" label="所属年份">
          <el-date-picker
            class="w300"
            @change="handChangeyear"
            v-model="ruleForm.belongToYear"
            type="year"
            value-format="yyyy"
            placeholder="请选择"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <br />
        <el-form-item prop="dataStatus" label="是否有效">
          <el-radio-group v-model="ruleForm.dataStatus">
            <el-radio
              :label="item.value"
              :value="item.value"
              v-for="(item, index) in businessStatuss"
              :key="index"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
        <el-form-item prop="insureStatus" label="是否在保">
          <el-radio-group v-model="ruleForm.insureStatus">
            <el-radio
              :label="item.value"
              :value="item.value"
              v-for="(item, index) in currenInsurance"
              :key="index"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="register">
          提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getdetails, putupdate } from '@/api/userDataManagement'
import { dictItem } from '@/api/policyManagement'
import { mapGetters } from 'vuex'
import { validateBlCodeGZ } from '@/utils/validateFrom'
export default {
  name: 'AddUser',
  components: {

  },
  data() {
    return {
      pickerOptions: { //年份限制，只可以选择当前年之前的年份
        disabledDate: (time) => {
          if (this.belongToYear) {
            const date = new Date()
            const year = date.getFullYear()
            const timeYear = time.getFullYear()
            return timeYear > year - 1
            // return (
            //   time.getTime() >
            //   new Date().getTime()
            // )
          } else {
            // 不能大于当前日期
            return time.getTime() > Date.now()
          }
        },
      },
      belongToYear: '',//选择年份 避免双重绑定
      userCode: '',
      dialogVisible: false,
      ruleForm: {
        areaCascaser: [], //地区
        custFullName: '',//企业名称
        blCode: '',//社会信用代码
        provinceCode: '',//省市区
        provinceName: '',//省市区
        cityCode: '',//省市区
        cityName: '',//省市区
        countyCode: '',//省市区
        countyName: '',//省市区
        companyIndystryIds: [],//所属行业
        industryOne: '',//所属行业一级分类
        industryTwo: '',//所属行业二级分类
        orgStatus: '',//经营状态
        businessType: '', //企业类型
        dataStatus: '',//是否有效
        insureStatus: '',//是否在保
        belongToYear: '', //年份
        detailAddress: '',
        industryId2: [],
        industryOneName: '',
        industryTwoName: '',
        manageId2: [],
        economyFieldOne: '',
        economyFieldTwo: '',
        economyNameOne: '',
        economyNameTwo: '',

      },
      industryData: [],
      manageData: [], //管理数据
      manageObj: [], //管理名字
      currenTyle: [
        {
          label: '应保企业',
          value: '01',
        },
        {
          label: '鼓励企业',
          value: '02',
        },
      ],
      businessStatuss: [
        {
          label: '有效',
          value: true,
        },
        {
          label: '无效',
          value: false,
        },
      ],
      currenInsurance: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      value: [], // 多级联动的值 => 会是一个数组
      rules: {
        custFullName: [
          {
            required: true,
            message: '请输入企业名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: '字符长度1-50位',
            trigger: 'blur',
          },
        ],
        blCode: [
          {
            required: true,
            validator: validateBlCodeGZ,
            trigger: 'blur',
          },
        ],

        areaCascaser: [
          {
            required: true,
            message: '请选择省市区',
            trigger: 'change',
          },
        ],
        detailAddress: [
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
        belongToYear: [
          {
            required: true,
            message: '请选择所属年份',
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
            type: "array"
          },
        ],
        orgStatus: [
          { required: true, message: '请选择经营状态', trigger: 'change' },
        ],
        businessType: [
          { required: true, message: '请选择类型', trigger: 'change' },
        ],
        dataStatus: [
          { required: true, message: '请选择是否有效', trigger: 'change' },
        ],
        insureStatus: [
          { required: true, message: '请选择是否在保', trigger: 'change' },
        ],
      },
    }
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
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() { //初始化
      this.getIndustryData()
      this.getManageData()
    },
    // 处理选中年份
    handChangeyear(e) {
      console.log(e, 'getFullYear');
      let strtime = JSON.stringify(e)
      this.ruleForm.belongToYear = strtime.substring(1, 5)
    },
    // 处理选中省市区方法
    async handleChangeArea(e) {
      console.log(e, 't12312312312312ascaser');
      if (e) {
        this.ruleForm.provinceCode = e[0]
        this.ruleForm.cityCode = e[1]
        this.ruleForm.countyCode = e[2]

        this.ruleForm.provinceName =
          this.areaMap[this.ruleForm.provinceCode] || '' // 省编码转中文
        this.ruleForm.cityName = this.areaMap[this.ruleForm.cityCode] // 市编码转中文
        this.ruleForm.countyName = this.areaMap[this.ruleForm.countyCode] // 区编码转中文
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
      this.ruleForm = {
        areaCascaser: [], //地区
        custFullName: '',//企业名称
        blCode: '',//社会信用代码
        provinceCode: '',//省市区
        provinceName: '',//省市区
        cityCode: '',//省市区
        cityName: '',//省市区
        countyCode: '',//省市区
        countyName: '',//省市区
        companyIndystryIds: [],//所属行业
        industryOne: '',//所属行业一级分类
        industryTwo: '',//所属行业二级分类
        orgStatus: '',//经营状态
        businessType: '', //企业类型
        dataStatus: '',//是否有效
        insureStatus: '',//是否在保
        belongToYear: '', //年份
        detailAddress: '',//详细地址
        industryId2: [],
        industryOneName: '',
        industryTwoName: '',
        manageId2: [],
        economyFieldOne: '',
        economyFieldTwo: '',
        economyNameOne: '',
        economyNameTwo: '',
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    getInit() {
      if (this.userCode) {
        this.getOrgDetail()
      }
      this.initData()
    },
    async getOrgDetail() {
      let res = await getdetails(this.userCode)
      if (res.code == '0000') {
        res.data['areaCascaser'] = [
          res.data.provinceCode,
          res.data.cityCode,
          res.data.countyCode,
        ]
        res.data['industryId2'] = [res.data.industryOne]
        if (res.data.industryTwo) {
          res.data['industryId2'] = [res.data.industryOne, res.data.industryTwo]
        }
        res.data['manageId2'] = [res.data.economyFieldOne, res.data.economyFieldTwo]
        // this.ruleForm.businessType = res.data.businessType
        // this.ruleForm.insureStatus = res.data.insureStatus
        // this.ruleForm.dataStatus = res.data.dataStatus
        this.ruleForm = res.data
        this.belongToYear = JSON.parse(JSON.stringify(this.ruleForm.belongToYear))//选择年份 避免双重绑定
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
    async getIndustryData() {
      //获取管理分类信息
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
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
    // 处理选中行业类型
    handleChangeIndustry(e) {
      if (!e) {
        return
      }
      this.ruleForm.industryOne = e[0] || ''
      this.ruleForm.industryOneName = this.industryObj[e[0]] || ''
      this.ruleForm.industryTwo = e[1] || ''
      this.ruleForm.industryTwoName = this.industryObj[e[1]] || ''
    },
    handleChangeManage(e) {
      //处理选中管理分类数据
      if (!e) {
        return
      }
      this.ruleForm.economyFieldOne = e[0] || ''
      this.ruleForm.economyFieldTwo = e[1] || ''
      this.ruleForm.economyNameOne = this.manageObj[e[0]] || ''
      this.ruleForm.economyNameTwo = this.manageObj[e[1]] || ''
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
      console.log(this.ruleForm.industryId2, 'ruleForm.industryId2');
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
      // if (this.userCode) {
      let res = await putupdate(this.ruleForm, this.userCode)
      if (res.code == '0000') {
        this.$message.success('修改企业管理成功')
        this.$parent.$parent.$parent.postOrgList()
        this.$parent.$parent.$parent.yearLoadList()
        this.dialogVisible = false
      }
      // }
      // this.$nextTick(() => {
      // this.dialogVisible = false
      // })
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
