<template>
  <div id="selectOrg">
    <el-dialog
      class="selOrg"
      title="选择投保人"
      :visible.sync="dialogVisible"
      width="1200px"
      @close="close"
    >
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="150px"
        :model="ruleForm"
        :rules="rules"
      >
        <div>
          <Title borderStyle="6px solid #096dd9" title="基本信息"></Title>
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
          <el-form-item prop="businessLicenseFileId" label="上传营业执照">
            <el-upload
              :file-list="ruleForm.businessFile"
              class="upload-demo"
              action="#"
              accept=".jpg, .png, PNG,.pdf"
              :on-exceed="exceed"
              :before-remove="beforeRemove"
              :on-remove="deleteBsp"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :http-request="changeBsp"
              :limit="1"
            >
              <el-button size="small">
                <i class="el-icon-upload2"></i>
                上传文件
              </el-button>
              <span class="tailTip ml10" @click.stop>
                支持拓展名 .pdf .png .jpg
              </span>
            </el-upload>
          </el-form-item>
          <br />
          <div style="display: flex">
            <el-form-item label="经营地址" prop="areaCascaser">
              <el-cascader
                :disabled="isdisabled"
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
                :disabled="isdisabled"
                style="position: relative; left: -140px"
                v-model="ruleForm.detailAddress"
                class="w300"
                size="mini"
                clearable
                placeholder="请输入详细地址"
              ></el-input>
            </el-form-item>
          </div>
          <br />
          <div style="display: flex">
            <el-form-item prop="industryId2" label="所属行业">
              <el-cascader
                :disabled="isdisabled"
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
            <el-form-item prop="manageId2" label="国民经济行业">
              <el-cascader
                :disabled="isdisabled"
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
          </div>
          <div style="display: flex">
            <el-form-item prop="annualTurnover" label="年营业额/工程造价">
              <Money-input
                v-model.trim="ruleForm.annualTurnover"
                template="append"
                class="w250"
                :billion="true"
                placeholder="请输入年营业额 / 工程造价"
              ></Money-input>
            </el-form-item>
            <el-form-item prop="employeeNum" label="从业人员总数">
              <el-input
                v-model="ruleForm.employeeNum"
                clearable
                class="w250"
                placeholder="请输入"
                size="mini"
              >
                <template slot="append">人</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item v-if="!isInsured" prop="orgStatus" label="经营状态">
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
          <el-form-item v-if="!isInsured" prop="businessScope" label="经营范围">
            <el-input
              :disabled="isdisabled"
              v-model="ruleForm.businessScope"
              clearable
              type="textarea"
              class="w524"
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </el-form-item>
          <Title
            borderStyle="6px solid #096dd9"
            title="法人代表/主要负责人"
          ></Title>
          <div style="display: flex">
            <el-form-item prop="lawMan" label="姓名">
              <el-input
                v-model="ruleForm.lawMan"
                clearable
                class="w250"
                placeholder="请输入内容"
                size="mini"
              ></el-input>
            </el-form-item>

            <el-form-item prop="lawManPhone" label="联系电话">
              <el-input
                v-model="ruleForm.lawManPhone"
                clearable
                class="w250"
                placeholder="请输入内容"
                size="mini"
              ></el-input>
            </el-form-item>
          </div>
          <br />
          <div style="display: flex">
            <el-form-item prop="dutyTelephone" label="应急值班电话">
              <el-input
                v-model="ruleForm.dutyTelephone"
                clearable
                class="w250"
                placeholder="请输入内容"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item prop="securityChargerEmail" label="邮箱">
              <el-input
                v-model="ruleForm.securityChargerEmail"
                clearable
                class="w250"
                placeholder="请输入内容"
                size="mini"
              ></el-input>
            </el-form-item>
          </div>
          <Title borderStyle="6px solid #096dd9" title="安全负责人"></Title>
          <div style="display: flex">
            <el-form-item prop="securityCharger" label="姓名">
              <el-input
                v-model="ruleForm.securityCharger"
                clearable
                class="w250"
                placeholder="请输入内容"
                size="mini"
              ></el-input>
            </el-form-item>

            <el-form-item prop="securityChargerPhone" label="联系电话">
              <el-input
                v-model="ruleForm.securityChargerPhone"
                clearable
                class="w250"
                placeholder="请输入内容"
                size="mini"
              ></el-input>
            </el-form-item>
          </div>
          <Title borderStyle="6px solid #096dd9" title="安全生产许可证"></Title>

          <el-form-item prop="safetyProdLicense" label="许可证号">
            <el-input
              v-model="ruleForm.safetyProdLicense"
              clearable
              class="w300"
              maxlength="30"
              minlength="4"
              show-word-limit
              placeholder="请输入内容"
              size="mini"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item prop="safetyProdLicenseFileId" label="上传许可证附件">
            <el-upload
              class="upload-demo"
              action="#"
              accept=".jpg, .png, PNG,.pdf"
              :file-list="ruleForm.prodLicenseFile"
              :on-exceed="exceed"
              :before-remove="beforeRemove"
              :on-remove="deleteLsp"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :http-request="changeLsp"
              :limit="1"
            >
              <el-button size="small">
                <i class="el-icon-upload2"></i>
                上传文件
              </el-button>
              <span class="tailTip ml10" @click.stop>
                支持拓展名 .pdf .png .jpg
              </span>
            </el-upload>
          </el-form-item>
          <br />
          <div style="display: flex">
            <el-form-item prop="safetyProdLicenseStart" label="许可证有效期">
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
            </el-form-item>
            <el-form-item
              style="position: relative; left: -140px"
              prop="safetyProdLicenseEnd"
            >
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
          </div>
          <br />
          <el-form-item prop="safetyProdLevel" label="标准化等级">
            <el-select
              v-model="ruleForm.safetyProdLevel"
              class="w300"
              clearable
              placeholder="请选择等级"
            >
              <el-option
                v-for="item in currentEnum('SafetyLevelEnum')"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="register('ruleForm')">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getHolder, dictItem, uploadFile } from '@/api/policyManagement'
import { getOrgDetails, addOrg, editOrg } from '@/api/userDataManagement'
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
  name: 'InsuranceFactor',
  props: {},
  components: {},
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
    // industryObj() {
    //   let result = []
    //   if (this.industryData) {
    //     result = this.setDiGuiDataObj(this.industryData)
    //   }
    //   return result
    // },
    title() {
      let result = '新增生产经营单位'
      if (this.userCode) {
        result = '修改生产经营单位'
      } else if (this.isInsured) {
        result = '填写被保人信息'
      }
      return result
    },
  },
  mounted() {
    this.initData()
  },

  data() {
    return {
      projectFlay: true,
      searchData1: [],
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页显示的行数
      projectList: [],
      flag1: false,
      flag2: false,
      projectList1: [],
      isdisabled: false,
      isInsured: false, //经营状态 经营范围
      dialogVisible: false,
      dialogVisible: false,
      industryData: [],
      holderName: '',
      ruleForm: {
        projectName: '', //项目名称
        address: '', //经营地址
        detailAddres: '', //详细地址
        holderName: '',
        custFullName: '',
        blCode: '',
        businessFile: [],
        businessLicenseFileId: '',
        areaCascaser: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
        provinceName: '',
        cityName: '',
        countyName: '',
        detailAddress: '',
        industryId2: '',
        industryOne: '',
        industryTwo: '',
        industryOneName: '',
        industryTwoName: '',
        manageId2: '',
        economyFieldOne: '',
        economyFieldTwo: '',
        economyNameOne: '',
        economyNameTwo: '',
        annualTurnover: '',
        employeeNum: '',
        orgStatus: '',
        businessScope: '',
        lawMan: '',
        lawManPhone: '',
        securityChargerEmail: '',
        dutyTelephone: '',
        securityCharger: '',
        securityChargerPhone: '',
        safetyProdLicense: '',
        safetyProdLicenseFileId: '',
        safetyProdLicenseStart: '',
        safetyProdLicenseEnd: '',
        safetyProdLevel: '',
      },
      manageData: [], //管理数据
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
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'change',
          },
        ],
        address: [
          {
            required: true,
            message: '请选择省市区',
            trigger: 'change',
          },
        ],
        detailAddres: [
          {
            required: true,
            message: '请输入具体地址',
            trigger: 'change',
          },
        ],
        holderName: [
          {
            required: true,
            message: '请填写',
            trigger: ['blur'],
          },
        ],

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
        annualTurnover: [
          { required: true, validator: validateMoney, trigger: 'blur' },
        ],
        employeeNum: [
          { required: true, validator: validatePositiveNum, trigger: 'blur' },
        ],
        orgStatus: [
          { required: true, message: '请选择经营状态', trigger: 'blur' },
        ],
        businessScope: [
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
        lawMan: [
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
        securityCharger: [
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
        lawManPhone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],

        securityChargerPhone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
        dutyTelephone: [
          { required: true, validator: validateTelephone, trigger: 'blur' },
        ],
        securityChargerEmail: [
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
      List: [], //模糊查询列表
      form: {},
    }
  },
  methods: {
    queryCX(queryString, cb) {
      console.log(queryString, 'queryString')
      var List = []
      if (queryString) {
        List = this.projectList.filter((item) => {
          if (item.projectName.indexOf(queryString) != -1) {
            // this.flag2 = false;
            return { value: item.projectName, ...item }
          }
        })
        if (List.length == 0) {
          this.flag2 = true
          this.$message.error('暂无项目信息，请添加或者重新搜索')
        } else {
          this.flag2 = false
        }
        cb(List) // 调用 callback 返回建议列表的数据
      }
    },
    // 页面切换方法
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleAreaList(e) {
      console.log(e, 'handleAreaList')
    },
    dele(index) {
      //删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.projectList1.splice(index, 1)
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
    detail(index, row) {
      //修改
      let arr = [row.provinceCode, row.cityCode, row.countyCode]
      // arr.push(row.)
      console.log(row, index, 'this.$refs.detail')
      this.$refs.detail.ruleForm = JSON.parse(JSON.stringify(row))
      console.log(this.$refs.detail.ruleForm, 'this.$refs.detail.ruleForm')
      this.$refs.detail.ruleForm.address = arr
      this.$refs.detail.ids = index
      this.$refs.detail.dialogVisible = true
      this.projectFlay = false
    },
    add() {
      //添加
      this.$refs.detail.dialogVisible = true
      this.projectFlay = true
    },
    addList(item) {
      console.log(item, 'cityNamecityName')
      this.flag1 = true
      // let obj = {
      //   // 省编码转中文
      //   provinceName: this.areaMap[this.ruleForm.address[0]] || '',
      //   countyName: this.areaMap[this.ruleForm.address[2]] || '',
      //   cityName: this.areaMap[this.ruleForm.address[1]] || '',
      //   provinceCode: this.ruleForm.address[0] || '',
      //   countyCode: this.ruleForm.address[2] || '',
      //   cityCode: this.ruleForm.address[1] || '',
      //   projectName: this.ruleForm.projectName,//项目名称
      //   // address: this.ruleForm.address,//地址
      //   detailAddress: this.ruleForm.detailAddres,//详细地址
      //   dataStatus: true//状态
      // }
      if (this.searchData1.length > 0) {
        this.$message.error('只能添加一条项目')
      } else {
        this.searchData1.push(item)
        this.projectList1 = this.searchData1
      }

      // if (this.ruleForm.projectName == '' || this.ruleForm.address == '' || this.ruleForm.detailAddres == '') {
      //   this.$message.error('请先添加项目信息！');
      // } else {
      //   console.log(obj, 'cityName');
      //   this.projectList.push(obj)
      // }
    },
    async getIndustryData() {
      //获取行业分类数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
        this.industryObj = this.setDiGuiDataObj(res.data)
      }
    },
    async initData() {
      //初始化
      this.getManageData()
      this.getIndustryData()
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
    // handleRemove(file, fileList) {},
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
    // 处理选中省市区方法
    async handleChangeArea(e) {
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
      this.isInsured = false
      this.holderName = ''
      this.ruleForm = {
        custFullName: '',
        blCode: '',
        businessLicenseFileId: '',
        areaCascaser: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
        provinceName: '',
        cityName: '',
        countyName: '',
        detailAddress: '',
        industryId2: '',
        industryOne: '',
        industryTwo: '',
        industryOneName: '',
        industryTwoName: '',
        manageId2: '',
        economyFieldOne: '',
        economyFieldTwo: '',
        economyNameOne: '',
        economyNameTwo: '',
        annualTurnover: '',
        employeeNum: '',
        orgStatus: '',
        businessScope: '',
        lawMan: '',
        lawManPhone: '',
        securityChargerEmail: '',
        dutyTelephone: '',
        securityCharger: '',
        securityChargerPhone: '',
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
      let { code, data } = await getOrgDetails(this.userCode)
      if (code === '0000') {
        this.ruleForm = data
        this.projectList = data.constructionProjectRespList
        this.ruleForm.areaCascaser = [
          data.provinceCode,
          data.cityCode,
          data.countyCode,
        ]
        this.ruleForm.businessFile = [data.businessFile]
        this.ruleForm.prodLicenseFile = [data.prodLicenseFile]
        this.ruleForm.industryId2 = [data.industryOne]
        if (data.industryTwo) {
          this.ruleForm.industryId2 = [data.industryOne, data.industryTwo]
        }
        this.ruleForm.manageId2 = [data.economyFieldOne, data.economyFieldTwo]
      }
    },
    // 处理选中行业类型
    handleChangeIndustry(e) {
      console.log(e)
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
    register(ruleForm) {
      if (!this.ruleForm.custFullName) {
        return false
      }

      // if (this.projectList1 <= 0 && this.ruleForm.industryOne == '15') {
      //   this.$message.error('请先添加项目信息！');
      //   return false
      // }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$confirm('即将提交, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            this.$store.commit('formDatas/projectList1', this.projectList1)
            this.$store.commit('formDatas/id', this.ruleForm.id)
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
      console.log(this.userCode)
      if (this.ruleForm.id) {
        this.ruleForm['projectList'] = this.projectList
        this.ruleForm['projectList1'] = this.projectList1
        // let res = await editOrg(this.ruleForm, this.ruleForm.id)
        // if (res.code == '0000') {
        this.$message.success('修改生产经营单位成功')
        // this.$emit('sucessCb', '刷新')
        this.dialogVisible = false
        console.log(this.ruleForm, ' this.ruleForm this.ruleForm this.ruleForm')
        await this.$store.commit('policyInfo/organizationEntity', this.ruleForm)
        this.$emit('getMsg', '1122')
        // this.$parent.$refs.addHolder.data = this.ruleForm
        // }
      } else if (this.isInsured) {
        await this.$store.commit(
          '/api/organization/v1/mation/?id=' + this.ruleForm.id,
          this.ruleForm
        )
        this.$emit('sucessCb', '')
      } else {
        let res = await addOrg(this.ruleForm)
        if (res.code == '0000') {
          this.$message.success('添加生产经营单位成功')
          await this.$store.commit(
            'policyInfo/organizationEntity',
            this.ruleForm
          )
          this.$emit('sucessCb', '刷新')
        }
      }
    },
    querySearch(queryString, cb) {
      getHolder(queryString).then((res) => {
        console.log(res.data, '社会信用代码：')
        var List = []
        setTimeout(() => {
          if (!res.data) {
            // this.$set(this.FormData, 'holderName', '')
            // this.$baseMessage('无该企业信息！', 'warning')
            cb(List)
          }
        }, 2000)
        if (res.data) {
          List = res.data.map((item) => {
            return { value: item.custFullName, ...item }
          })
          cb(List) // 调用 callback 返回建议列表的数据
        }
      })
    },

    async handleSelect(item) {
      console.log(item, 'nameInfos1111')
      this.projectList = item.constructionProjectRespList
      item['holderName'] = this.holderName
      // if (item.isComplete) {
      // businessType == '01'为应保，不能修改
      this.isdisabled = item.businessType == '01' ? true : false
      this.ruleForm = item
      // this.ruleForm.areaCascaser
      if (item.provinceCode) {
        this.ruleForm.areaCascaser = [item.provinceCode]
        if (item.cityCode) {
          this.ruleForm.areaCascaser = [item.provinceCode, item.cityCode]
          if (item.countyCode) {
            this.ruleForm.areaCascaser = [
              item.provinceCode,
              item.cityCode,
              item.countyCode,
            ]
          }
        }
      }
      this.ruleForm.businessFile = item.businessFile ? [item.businessFile] : []
      this.ruleForm.prodLicenseFile = item.prodLicenseFile
        ? [item.prodLicenseFile]
        : []
      this.ruleForm.industryId2 = [item.industryOne]
      if (item.industryTwo) {
        this.ruleForm.industryId2 = [item.industryOne, item.industryTwo]
      }
      this.ruleForm.manageId2 = [item.economyFieldOne, item.economyFieldTwo]
      // }
      // else {
      //   console.log(item)
      //   this.isdisabled = false
      //   this.ruleForm = item
      //   // this.ruleForm.areaCascaser
      //   if (item.provinceCode) {
      //     this.ruleForm.areaCascaser = [item.provinceCode]
      //     if (item.cityCode) {
      //       this.ruleForm.areaCascaser = [item.provinceCode, item.cityCode]
      //       if (item.countyCode) {
      //         this.ruleForm.areaCascaser = [
      //           item.provinceCode,
      //           item.cityCode,
      //           item.countyCode,
      //         ]
      //       }
      //     }
      //   }
      //   this.ruleForm.businessFile = item.businessFile
      //     ? [item.businessFile]
      //     : []
      //   this.ruleForm.prodLicenseFile = item.prodLicenseFile
      //     ? [item.prodLicenseFile]
      //     : []
      //   this.ruleForm.industryId2 = [item.industryOne]
      //   if (item.industryTwo) {
      //     this.ruleForm.industryId2 = [item.industryOne, item.industryTwo]
      //     console.log('industryId2:', this.ruleForm.industryId2)
      //   }
      //   this.ruleForm.manageId2 = [item.economyFieldOne, item.economyFieldTwo]
      //   console.log(this.ruleForm, '-0-0-0')
      // }
    },
    // close() {
    //   this.form = {}
    //   this.$nextTick(() => {
    //     this.$refs.ruleForm.resetFields()
    //   })
    // },
    confirm() {
      console.log(
        this.ruleForm,
        Object.getOwnPropertyNames(this.ruleForm).length,
        '--0---'
      )
      if (Object.getOwnPropertyNames(this.ruleForm).length == 1) {
        this.$baseMessage('请先选择企业！', 'warning')
        return
      }
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          console.log('wen')
          await this.$store.commit(
            '/api/organization/v1/mation/{id}',
            this.ruleForm
          )
          this.$emit('getMsg', '1122')
          this.dialogVisible = false
        }
      })
    },
    cancle() {
      this.form = {}
      this.dialogVisible = false
    },
  },
}
</script>

<style lang='scss' >
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
.orgTip {
  background-color: #dbf9ef;
  color: #34c697;
  width: 450px;
  box-sizing: border-box;
  padding-left: 10px;
  i {
    font-size: 16px;
    margin-right: 5px;
  }
}
</style>
