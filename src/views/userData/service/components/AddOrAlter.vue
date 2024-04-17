<template>
  <el-dialog class="serviceDialog" :title="id ? '修改服务机构' : '新增服务机构'" :visible.sync="dialogVisible"
    :close-on-click-modal="false" width="1000px" @open="initData" @close="close">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="210px">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">基本信息</span>
      </div>
      <el-form-item label="机构名称：" prop="orgName">
        <el-input v-model="ruleForm.orgName" class="w250" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item label="社会信用代码：" prop="businessCode">
        <el-input v-model="ruleForm.businessCode" class="w250" placeholder="请输入社会信用代码"></el-input>
      </el-form-item>
      <el-form-item prop="businessLicenseFileId" label="上传营业执照">
        <el-upload :file-list="ruleForm.businessFile" class="upload-demo" action="#" accept=".jpg, .png, PNG,.pdf"
          multiple :on-exceed="exceed" :before-remove="beforeRemove" :on-remove="deleteBsp"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :http-request="changeBsp" :limit="1">
          <el-button size="small">
            <i class="el-icon-upload2"></i>
            上传文件
          </el-button>
          <span class="tailTip ml10" @click.stop>
            支持拓展名 .pdf .png .jpg
          </span>
        </el-upload>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item label="经营地址：" prop="selectedOptions">
            <el-cascader v-model="ruleForm.selectedOptions" filterable class="w250" :options="areaList"
              placeholder="请选择区域" @change="handleChangeArea"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="detailAddr" class="detailAddr">
            <el-input v-model="ruleForm.detailAddr" class="w300 area" placeholder="请输入详细地址" style="line-height: 40px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="主要服务项目：" prop="serviceAccidentTypes">
        <el-select v-model="serviceAccidentType" class="w250" multiple placeholder="请选择主要服务项目" @change="changeService"
          @remove-tag="removeTag">
          <el-option v-for="item in serviceItems" :key="item.strCode" :label="item.label" :value="item.strCode">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item v-if="other" label="其他有关事故预防工作：	" prop="otherType">
        <el-input v-model="ruleForm.otherType" class="w250" placeholder="请输入其他有关事故预防工作"></el-input>
      </el-form-item> -->
      <el-form-item label="主要服务行业领域：" prop="industryParams">
        <el-select v-model="ruleForm.industryParams" class="w250" @change="changeIN" multiple placeholder="请选择职行业领域">
          <el-option v-for="item in industryData" :key="item.itemValue" :label="item.itemText" :value="item.itemValue">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">法定代表人</span>
      </div>
      <el-row>
        <el-col :span="10">
          <el-form-item label="姓名：" prop="legalPersonName">
            <el-input v-model="ruleForm.legalPersonName" class="w250" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话：" prop="legalPersonPhone">
            <el-input v-model="ruleForm.legalPersonPhone" class="w250" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">业务负责人</span>
      </div>
      <el-row>
        <el-col :span="10">
          <el-form-item label="姓名：" prop="safetyCharger">
            <el-input v-model="ruleForm.safetyCharger" class="w250" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话：" prop="safetyChargerPhone">
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
import { getIndustrys, getEnumslist } from '@/utils/index'
import {
  validatePhone,
  validateOrgName,
  validateAddress,
  validateBusiness,
  validateCharger,
} from '@/utils/validateFrom'
// import { getIndustrys } from '@/utils/index'
import { getAreaDetail, getStreet } from '@/api/Areas'
import { mapGetters } from 'vuex'
import { dictItem, uploadFile } from '@/api/policyManagement'
export default {
  name: 'ServiceAdd',

  data() {
    return {
      other: false,
      serviceItems: [], // 服务项目
      allArea: [], //地址
      dialogVisible: false,
      id: '',
      ruleForm: {
        businessLicenseFileId: '',
        orgName: '', // 机构名称
        otherType: '', //其他有关事故预防
        businessCode: '', //社会信用代码
        orgCode: '', // 是01：总部，依据《保险行业机构代码编 码规范（JR/T 0035-2007）》填写；如是02-04， 依据本单位内部编', ,
        legalPersonName: '', // 法人
        legalPersonPhone: '', // 法人电话
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
        agencyNature: '', // 企业性质
        servicename: 'safetyOrganizationSvc',
        orgType: 1,
        dataStatus: '1', // 状态
        serviceAccidentTypes: [],
        industryParams: [], // 服务行业
        // serviceAccidentType: '', //服务项目
        // industryParam: [], // 服务行业
        // serviceIndustrys: [], // 接口入参行业集合
      },
      serviceAccidentType: [],
      userCode: '',
      serviceItems: [],
      industryData: [], // 行业
      rules: {
        orgName: [
          { required: true, validator: validateOrgName, trigger: 'blur' },
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
        legalPersonName: [
          { required: true, validator: validateCharger, trigger: 'blur' },
        ],
        legalPersonPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' },
        ],
        safetyCharger: [
          { required: true, validator: validateCharger, trigger: 'blur' },
        ],
        safetyChargerPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' },
        ],
        serviceAccidentTypes: [
          { required: true, message: '请选择服务项目', trigger: 'change' },
        ],
        industryParams: [
          { required: true, message: '请选择服务行业', trigger: 'change' },
        ],
        otherType: [
          { required: true, message: '请填写其他服务行业', trigger: 'blur' },
        ],
        businessLicenseFileId: [
          {
            required: true,
            message: '请上传文件',
            trigger: 'change',
          },
        ],
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
  },
  created() {
    // this.getArea()

    // this.getAllArea()
  },
  mounted() { },
  methods: {
    changeIN(value) {
      console.log(this.ruleForm.industryParams);
    },
    exceed() {
      this.$baseMessage('文件最多上传1个！', 'error')
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    deleteBsp() {
      this.ruleForm.businessLicenseFileId = ''
      this.$baseMessage('删除成功', 'success')
    },
    changeService(e) {
      console.log(e, 'change')
      if (e.lastIndexOf('07') != '-1') {
        this.other = true
      }
      this.ruleForm.serviceAccidentTypes = getEnumslist(
        this.serviceItems,
        this.serviceAccidentType,
        this.ruleForm.otherType
      )
    },
    handleAvatarSuccess() {
      this.$refs.ruleForm.validateField('businessLicenseFileId')
    },
    beforeAvatarUpload: function (file) {
      const isLt2M = file.size / 1024 / 1024 < 50 //限制图片大小

      if (!isLt2M) {
        this.$baseMessage('上传文件大小不能超过 50MB', 'error')
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
        this.ruleForm.businessFile = [{ name: res.data.name }]
      }
    },
    removeTag(e) {
      if (e == '07') {
        this.other = false
        this.ruleForm.otherType = ''
      }
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
        console.log("🚀 ~ file: AddOrAlter.vue ~ line 289 ~ getDict ~ this.industryData", this.industryData)
      }
    },
    async initData() {
      this.getDict()
      this.serviceItems = this.getStrEnumAll.ServiceItemsEnum
      // 初始化加载
      if (!this.id) {
        return
      }
      let data = {
        servicename: 'safetyOrganizationSvc',
        code: this.id,
      }
      let res = await getBranchDetails(data)
      if (res.code === '0000') {
        // res.data.industryParam = res.data.serviceIndustryCode.split(',')
        if (res.data.headquartersName) {
          this.totalCom = true
        }
        // if (res.data.serviceAccidentTypes.length != 0) {
        //   // this.serviceAccidentType
        //   res.data.serviceAccidentTypes.forEach(element => {
        //     this.serviceAccidentType.push(element.serviceAccidentType)
        //   });
        // }
        res.data.industryParams = res.data.serviceIndustryCode.split(',')
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
            this.serviceAccidentType = res.data.serviceAccidentTypes.map(
              (item, index) => {
                return item.serviceAccidentType
              }
            )
          }
        // industryParams

        this.ruleForm = res.data
        this.ruleForm.businessFile = [res.data.businessFile]
        this.ruleForm.prodLicenseFile = [res.data.prodLicenseFile]
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
        console.log(this.ruleForm);
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
      this.ruleForm.legalPersonName = ''
      this.ruleForm.legalPersonPhone = ''
      this.ruleForm.businessFile = []
      this.serviceAccidentType = []
      this.$emit('refresh', '1')
    },
    close() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
        this.$emit('refresh', '1')
      })
      this.id = ''
      this.dialogVisible = false
      this.ruleForm.safetyCharger = ''
      this.ruleForm.safetyChargerPhone = ''
      this.ruleForm.legalPersonName = ''
      this.ruleForm.legalPersonPhone = ''
      this.ruleForm.businessFile = []
      this.serviceAccidentType = []
    },
    async configRegister() {
      // 修改和新增提交
      let res = ''
      this.ruleForm.serviceIndustrys = getIndustrys(this.industryData, this.ruleForm.industryParams)

      if (this.id) {
        ; (this.ruleForm.servicename = 'safetyOrganizationSvc'),
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
      let text = '确定要新增服务机构基本信息？'
      if (this.id) {
        text = '确定要修改服务机构基本信息？'
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

.serviceDialog {
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
.detailAddr {
  line-height: 32px;
  .el-form-item__content {
    margin-left: 100px!important;
    .area {
      line-height: 32px!important;
    }
  }
}
</style>
