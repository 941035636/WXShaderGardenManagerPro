<template>
  <div id="selectOrg">
    <el-dialog
      class="selOrg"
      title="填写项目信息"
      :visible.sync="dialogFormVisible"
      width="1200px"
      @close="close"
      @open="initData"
    >
      <!-- <el-form
        ref="ruleForm"
        label-position="right"
        label-width="150px"
        :model="ruleForm"
        :rules="rules"
      > -->
      <!-- <el-form-item label="项目名称" required>
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="holderName"
            class="w450"
            size="small"
            :debounce="700"
            :fetch-suggestions="querySearch"
            placeholder="请输入项目名称"
            :trigger-on-focus="false"
            hide-loading
            clearable
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="item-sel">
                <p>{{ item.projectName }}</p>
                <p>
                  地区：{{ item.provinceName }}/{{ item.cityName }}/{{
                    item.countyName
                  }}
                </p>
                <p>详细地址：{{ item.detailAddress }}</p>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item> -->
      <!-- <el-form-item>
          <div class="orgTip">
            <i class="el-icon-warning"></i>
            请输入企业名称，并确认核对
          </div>
        </el-form-item> -->
      <!-- v-if="ruleForm.custFullName" -->
      <div id="highRiskDetails">
        <!-- v-if="CityList" -->
        <el-form
          :inline="true"
          ref="ruleForm"
          :model="ruleForm"
          label-position="right"
          label-width="180px"
          :rules="rules"
        >
          <el-form-item prop="projectName" label="项目名称">
            <el-input
              v-model="ruleForm.projectName"
              class="w300"
              placeholder="请输入内容"
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
            <!--  @change="handleChangeArea" -->
          </el-form-item>
          <el-form-item prop="projectDetailAddress">
            <el-input
              v-model="ruleForm.projectDetailAddress"
              class="w300"
              size="mini"
              clearable
              placeholder="请输入详细地址"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div id="highRiskDetails" v-else>
        <el-form
          :inline="true"
          ref="ruleForm"
          :model="ruleForm"
          label-position="right"
          label-width="180px"
          :rules="rules"
        >
          <el-form-item prop="projectName" label="项目名称">
            <el-input
              v-model="ruleForm.projectName"
              class="w300"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item label="经营地址" prop="address">
            <el-cascader
              v-model="ruleForm.address"
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
        </el-form>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="register('ruleForm')">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <detail ref="detail" />
  </div>
</template>

<script>
import detail from './indexinone.vue'
import { getHolder, dictItem, uploadFile } from '@/api/policyManagement'
import { getOrgDetails, addOrg, editOrg } from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import {

  project
} from '@/api/userDataManagement'
export default {
  name: 'InsuranceFactor',
  props: {},
  components: {
    detail
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
      insuredInfoParam: 'policyInfo/insuredInfoParam'
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

  },

  data() {
    return {

      // projectList: [],
      isdisabled: false,
      isInsured: false, //经营状态 经营范围
      dialogVisible: false,
      dialogFormVisible: false,
      industryData: [],
      holderName: '',
      CityList: false,
      ruleForm: {
        projectName: '',//项目名称
        // address: '',//经营地址
        // detailAddress: '',//详细地址
        // provinceCode: '',
        // cityCode: '',
        // countyCode: '',
        // provinceName: '',
        // cityName: '',
        // countyName: '',
        areaCascaser: [],
        projectCityCode: "",
        projectCityName: "",
        projectCountyCode: "",
        projectCountyName: "",
        projectDetailAddress: "",
        projectProvinceCode: "",
        projectProvinceName: "",
      },
      manageData: [], //管理数据
      value: [], // 多级联动的值 => 会是一个数组
      // startTime: {
      //   disabledDate: (time) => {
      //     if (this.ruleForm.safetyProdLicenseEnd) {
      //       return (
      //         time.getTime() >
      //         new Date(this.ruleForm.safetyProdLicenseEnd).getTime()
      //       )
      //     } else {
      //       // 不能大于当前日期
      //       return time.getTime() > Date.now()
      //     }
      //   },
      // },
      // 结束时间
      // endTime: {
      //   disabledDate: (time) => {
      //     if (this.ruleForm.safetyProdLicenseStart) {
      //       return (
      //         time.getTime() <
      //         new Date(this.ruleForm.safetyProdLicenseStart).getTime() // 加- 8.64e7则表示包当天
      //       )
      //     } else {
      //       return time.getTime() < Date.now()
      //     }
      //   },
      // },
      rules: {
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'change',
          },
          {
            min: 1,
            max: 200,
            message: '字符长度1-200位',
            trigger: 'blur',
          },
        ],
        address: [
          {
            required: true,
            message: '请选择省市区',
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
            trigger: 'change',
          },
          {
            min: 1,
            max: 100,
            message: '字符长度1-100位',
            trigger: 'blur',
          },
        ],
        projectDetailAddress: [
          {
            required: true,
            message: '请输入具体地址',
            trigger: 'change',
          },
          {
            min: 1,
            max: 100,
            message: '字符长度1-100位',
            trigger: 'blur',
          },
        ],
      },
      List: [], //模糊查询列表
      form: {},
    }
  },
  methods: {
    initData() {
      if (this.CityList) {
        this.ruleForm.areaCascaser = [this.ruleForm.projectProvinceCode, this.ruleForm.projectCityCode, this.ruleForm.projectCountyCode]
        console.log(this.ruleForm.areaCascaser, 'this.ruleForm.areaCascaser');
      }
    },
    // detail(index, row) { //修改
    //   let arr = [row.provinceCode,
    //   row.cityCode,
    //   row.countyCode,]
    //   // arr.push(row.)
    //   console.log(row, index, 'this.$refs.detail');
    //   this.$refs.detail.ruleForm = JSON.parse(JSON.stringify(row))
    //   console.log(this.$refs.detail.ruleForm, 'this.$refs.detail.ruleForm');
    //   this.$refs.detail.ruleForm.address = arr
    //   this.$refs.detail.ids = index
    //   this.$refs.detail.dialogVisible = true
    // },



    // 处理选中省市区方法
    async handleChangeArea(e) {
      console.log(e, '1122112122');
      if (e) {
        // this.ruleForm.provinceCode = e[0]
        // this.ruleForm.cityCode = e[1]
        // this.ruleForm.countyCode = e[2]

        // this.ruleForm.provinceName =
        //   this.areaMap[this.ruleForm.provinceCode] || '' // 省编码转中文
        // this.ruleForm.cityName = this.areaMap[this.ruleForm.cityCode] // 市编码转中文
        // this.ruleForm.countyName = this.areaMap[this.ruleForm.countyCode] // 区编码转中文
        this.ruleForm.projectProvinceCode = e[0]
        this.ruleForm.projectCityCode = e[1]
        this.ruleForm.projectCountyCode = e[2]

        this.ruleForm.projectProvinceName =
          this.areaMap[this.ruleForm.projectProvinceCode] || '' // 省编码转中文
        this.ruleForm.projectCityName = this.areaMap[this.ruleForm.projectCityCode] // 市编码转中文
        this.ruleForm.projectCountyName = this.areaMap[this.ruleForm.projectCountyCode] // 区编码转中文
      } else {
        return
      }
    },

    setForm() {
      this.$refs['ruleForm'].resetFields()
    },
    close() {
      // this.projectList = []
      this.userCode = ''
      this.isInsured = false
      this.holderName = ''
      this.ruleForm = {
        areaCascaser: [],
        projectCityCode: "",
        projectCityName: "",
        projectCountyCode: "",
        projectCountyName: "",
        projectDetailAddress: "",
        projectProvinceCode: "",
        projectProvinceName: "",
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
        // annualTurnover: '',
        // employeeNum: '',
        // orgStatus: '',
        // businessScope: '',
        // lawMan: '',
        // lawManPhone: '',
        // securityChargerEmail: '',
        // dutyTelephone: '',
        // securityCharger: '',
        // securityChargerPhone: '',
        // safetyProdLicense: '',
        // safetyProdLicenseFileId: '',
        // safetyProdLicenseStart: '',
        // safetyProdLicenseEnd: '',
        // safetyProdLevel: '',
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
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
      // if (!this.ruleForm.custFullName) {
      //   return false
      // }
      this.$refs[ruleForm].validate((valid) => {
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
      console.log(this.ruleForm, '//   this.$emit(item)');
      this.$emit('itemCative', this.ruleForm)
      this.$emit('epolicy', true)
      this.dialogFormVisible = false
      // console.log(this.ruleForm, '---==-==-')
      // console.log(this.userCode)
      // if (this.ruleForm.id) {
      //   // this.ruleForm['projectList'] = this.projectList
      //   let res = await editOrg(this.ruleForm, this.ruleForm.id)
      //   if (res.code == '0000') {
      //     this.$message.success('修改生产经营单位成功')
      //     // this.$emit('sucessCb', '刷新')
      //     this.dialogFormVisible = false
      //     console.log(
      //       this.ruleForm,
      //       ' this.ruleForm this.ruleForm this.ruleForm'
      //     )
      //     await this.$store.commit(
      //       'policyInfo/organizationEntity',
      //       this.ruleForm
      //     )
      //     this.$emit('getMsg', '1122')
      //     // this.$parent.$refs.addHolder.data = this.ruleForm
      //   }
      // } else if (this.isInsured) {
      //   await this.$store.commit(
      //     '/api/organization/v1/mation/?id=' + this.ruleForm.id,
      //     this.ruleForm
      //   )
      //   this.$emit('sucessCb', '')
      // } else {
      //   // this.ruleForm['projectList'] = this.projectList
      //   let res = await addOrg(this.ruleForm)
      //   if (res.code == '0000') {
      //     this.$message.success('添加生产经营单位成功')
      //     await this.$store.commit(
      //       'policyInfo/organizationEntity',
      //       this.ruleForm
      //     )
      //     this.$emit('sucessCb', '刷新')
      //   }
      // }

    },

    // querySearch(queryString, cb) {
    //   project(this.insuredInfoParam.blCode, queryString).then((res) => {
    //     console.log(res, 'TypeError: Cannot read properties of undefined (reading ');
    //     var List = []
    //     setTimeout(() => {
    //       if (!res.list) {
    //         // this.$set(this.FormData, 'holderName', '')
    //         // this.$baseMessage('无该企业信息！', 'warning')
    //         cb(List)
    //       }
    //     }, 2000)
    //     if (res.list) {
    //       List = res.list.map((item) => {
    //         return { value: item.projectName, ...item }
    //       })
    //       cb(List) // 调用 callback 返回建议列表的数据
    //     }
    //   })
    // },

    // async handleSelect(item) {
    //   console.log(item, 'nameInfos11111111111');
    //   this.$emit('itemCative', item)
    //   this.$emit('epolicy', true)
    //   this.dialogFormVisible = false
    //   this.projectList = item.constructionProjectRespList
    //   item['holderName'] = this.holderName
    //   // if (item.isComplete) {
    //   // businessType == '01'为应保，不能修改
    //   this.isdisabled = item.businessType == '01' ? true : false
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
    //   this.ruleForm.businessFile = item.businessFile ? [item.businessFile] : []
    //   this.ruleForm.prodLicenseFile = item.prodLicenseFile
    //     ? [item.prodLicenseFile]
    //     : []
    //   this.ruleForm.industryId2 = [item.industryOne]
    //   if (item.industryTwo) {
    //     this.ruleForm.industryId2 = [item.industryOne, item.industryTwo]
    //   }
    //   this.ruleForm.manageId2 = [item.economyFieldOne, item.economyFieldTwo]


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
          this.dialogFormVisible = false
        }
      })
    },
    cancle() {
      this.form = {}

      this.dialogFormVisible = false
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
