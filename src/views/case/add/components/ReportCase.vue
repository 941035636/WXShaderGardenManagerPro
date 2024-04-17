<template>
  <div id="ReportCase">
    <Title :title="title"></Title>
    <div class="content_item ml30 lh30">
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="180px"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item label="保单号：" prop="policyNo">
              <el-autocomplete
                v-model="form.policyNo"
                class="w250"
                :fetch-suggestions="querySearch"
                placeholder="请输入保单号"
                :trigger-on-focus="false"
                clearable
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="报案人姓名：" prop="reportName">
              <el-input
                v-model="form.reportName"
                size="small"
                placeholder="请输入报案人姓名"
                class="w250"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="报案人联系电话：" prop="reportPhone">
              <el-input
                v-model="form.reportPhone"
                size="small"
                placeholder="请输入报案人联系电话"
                class="w250"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="9">
            <el-form-item label="报案时间：" prop="reportTime">
              <el-date-picker
                v-model="form.reportTime"
                :picker-options="reportCaseTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                class="wd250"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="事故发生时间：" prop="lossTime">
              <el-date-picker
                v-model="form.lossTime"
                :picker-options="startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请输入事故发生时间"
                class="wd250"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <div style="display: flex">
              <el-form-item label="事故发生地点：" prop="areaCascaser">
                <el-cascader
                  v-model="form.areaCascaser"
                  placeholder="请选择地区"
                  class="w250"
                  filterable
                  :options="allArea"
                  :props="{ checkStrictly: false }"
                  clearable
                  @change="changeArea"
                ></el-cascader>
              </el-form-item>
              <el-form-item prop="riskAddr">
                <el-input
                  v-model="form.riskAddr"
                  size="small"
                  placeholder="请输入具体地址"
                  class="w250"
                  clearable
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh30">
          <el-col :span="9">
            <el-form-item label="死亡人数：" prop="deathNum">
              <el-input-number
                v-model="form.deathNum"
                :min="0"
                :max="99999999"
                class="w250"
                size="medium"
              ></el-input-number>
              <!-- <el-input
                v-model="form.deathNum"
                size="small"
                placeholder="请输入死亡人数"
                class="w250"
                clearable
              /> -->
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="受伤人数：" prop="injuryNum">
              <el-input-number
                v-model="form.injuryNum"
                :min="0"
                :max="99999999"
                class="w250"
                size="medium"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="lh30">
          <el-col :span="12">
            <el-form-item label="事故描述：" prop="lossProcess">
              <el-input
                v-model="form.lossProcess"
                size="small"
                type="textarea"
                placeholder="请输入事故描述"
                class="w400"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh30">
          <el-col :span="9">
            <el-form-item label="立案号：" prop="caseNo">
              <el-input
                v-model="form.caseNo"
                size="small"
                placeholder="请输入立案号"
                class="w250"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="立案时间：" prop="caseTime">
              <el-date-picker
                v-model="form.caseTime"
                :picker-options="endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="wd250"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="lh30">
          <el-col :span="9">
            <el-form-item
              label="决案时间："
              :rules="
                finalFlag
                  ? [
                      {
                        required: true,
                        message: '请选择决案时间',
                        trigger: 'blur',
                      },
                    ]
                  : []
              "
              prop="closeCaseTime"
            >
              <el-date-picker
                v-model="form.closeCaseTime"
                :picker-options="endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                class="wd250"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="9">
            <el-form-item
              label="特殊行业领域事故类型："
              :rules="
                finalFlag
                  ? [
                      {
                        required: true,
                        message: '请选择特殊行业领域事故类型',
                        trigger: 'change',
                      },
                    ]
                  : []
              "
              prop="specAccidentTypeIds"
            >
              <el-cascader
                ref="editCascader"
                v-model="form.specAccidentTypeIds"
                placeholder="请选择"
                class="w250"
                clearable
                filterable
                :options="specAcdtype"
                :props="{
                  label: 'itemText',
                  value: 'id',
                  children: 'sysDictItemEntitys',
                }"
                @change="() => designerChange()"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh30">
          <el-col :span="9">
            <el-form-item
              label="事故类型："
              :rules="
                finalFlag
                  ? [
                      {
                        required: true,
                        message: '请选择事故类型',
                        trigger: 'change',
                      },
                    ]
                  : []
              "
              prop="accidentTypeIds"
            >
              <el-cascader
                ref="editCascader2"
                v-model="form.accidentTypeIds"
                placeholder="请选择事故类型"
                class="w250"
                filterable
                clearable
                :options="acdType"
                :props="{
                  label: 'itemText',
                  value: 'id',
                  children: 'sysDictItemEntitys',
                }"
                @change="() => designerChange2()"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item
              label="事故原因："
              prop="accidentReason"
              :rules="
                finalFlag
                  ? [
                      {
                        required: true,
                        message: '请选择事故原因',
                        trigger: 'blur',
                      },
                    ]
                  : []
              "
            >
              <el-select
                ref="editCascader3"
                v-model="form.accidentReason"
                class="w250"
                filterable
                clearable
                placeholder="请选择事故原因"
                @change="() => designerChange3()"
              >
                <el-option
                  v-for="(item, key) in reasonArr"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item
              label="事故调查报告："
              :rules="
                finalFlag
                  ? [
                      {
                        required: true,
                        message: '请上传事故调查报告',
                        trigger: 'blur',
                      },
                    ]
                  : []
              "
              prop="accidentReportIds"
            >
              <el-upload
                :on-success="handleAvatarSuccess"
                :http-request="changeImg"
                class="upload-demo"
                :on-exceed="exceed"
                :before-remove="beforeRemove"
                :before-upload="beforeAvatarUpload"
                :on-remove="
                  (file, fileList) => {
                    handleRemove(file, fileList)
                  }
                "
                action="#"
                accept=".jpg, .png, PNG,.word,.docx,.doc,.pdf,.xlsx,.xls"
                multiple
                :limit="3"
              >
                <el-button size="small" type="primary">上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import Title from '@/components/NewTitle'
import { mapGetters } from 'vuex'
import { getAreaInfo, getStreet, getAreaDetail } from '@/api/Areas'
import { uploadFile, dictItem, getPolicyNo } from '@/api/policyManagement'
import {
  validateTelephone,
  validatePhone,
  validateCharger,
  validateName,
  validateContactName,
  validateCon,
  validateCaseNo,
  validatePolicyNo,
  validateNum,
} from '@/utils/validateFrom'

export default {
  name: 'ReportCase',
  components: { Title },

  props: {
    finalFlag: {
      type: Boolean,
      required: true,
      default: () => {
        return true
      },
    },
  },
  data() {
    return {
      title: '报案信息',
      acdType: [], //事故类型
      allArea: [], //地区下拉框
      specAcdtype: [], //特殊行业事故类型
      form: {
        reportName: '', //报案人姓名
        reportPhone: '', //报案电话
        reportTime: '', //报案时间
        lossTime: '', //事故时间
        caseTime: '', //报案时间
        closeCaseTime: '', //决案时间
        riskAddr: '', //事故发生详细地
        caseNo: '', //事故单号
        policyNo: '', //保单号
        accidentProvinceCode: '', //事故发生省编码
        accidentProvinceName: '', //事故发生省名称
        accidentCityCode: '', //事故发生市编码
        accidentCityName: '', //事故发生市名称
        accidentCountyCode: '', //事故发生县编码
        accidentCountyName: '', //事故发生县名称
        accidentAreaCode: '', //事故发生街道编码
        accidentAreaName: '', //事故发生街道名称
        accidentTypeIds: [], //事故类型
        accidentTypeName: '',
        specAccidentTypeIds: [], //特殊行业领域事故类型
        specAccidentTypeName: '',
        injuryNum: 0, //受伤人数
        deathNum: 0, //死亡人数
        lossProcess: '', //事故描述
        accidentReason: '', //事故原因
        reason: '',
        accidentReportIds: [], //事故报告
        areaCascaser: [], //地区
      },
      reasonArr: [],
      photoCopyList: [], //文件暂存
      rules: {
        reportName: [
          {
            required: true,
            validator: validateCharger,
            trigger: 'blur',
          },
        ],
        reportPhone: [
          {
            required: true,
            validator: validatePhone,
            trigger: 'blur',
          },
        ],
        reportTime: [
          {
            required: true,
            message: '请输入报案时间',
            trigger: 'blur',
          },
        ],
        lossTime: [
          {
            required: true,
            message: '请输入事故发生时间',
            trigger: 'blur',
          },
        ],
        areaCascaser: [
          {
            required: true,
            message: '请输入事故发生地点',
            trigger: 'change',
          },
        ],
        riskAddr: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur',
          },
        ],
        caseNo: [
          {
            required: true,
            validator: validateCaseNo,
            trigger: 'blur',
          },
        ],
        policyNo: [
          {
            required: true,
            validator: validatePolicyNo,
            trigger: 'blur',
          },
        ],
        caseTime: [
          {
            required: true,
            message: '请输入立案时间',
            trigger: 'blur',
          },
        ],
        // accidentTypeIds: [
        //   {
        //     required: true,
        //     message: '请选择事故类型',
        //     trigger: 'change',
        //   },
        // ],
        // specAccidentTypeIds: [
        //   {
        //     required: true,
        //     message: '请选择特殊行业领域事故类型',
        //     trigger: 'change',
        //   },
        // ],
        injuryNum: [
          {
            required: true,

            message: '请输入受伤人数！',
            trigger: 'blur',
          },
        ],
        deathNum: [
          {
            required: true,
            message: '请输入死亡人数！',
            trigger: 'change',
          },
        ],
        lossProcess: [
          {
            required: true,
            validator: validateCon,
            trigger: 'change',
          },
        ],
      },

      reportCaseTime: {
        disabledDate: (time) => {
          if (this.form.lossTime) {
            return (
              time.getTime() < new Date(this.form.lossTime).getTime() ||
              time.getTime() > Date.now() // 加- 8.64e7则表示包当天
            )
          }
          if (this.form.closeCaseTime) {
            return (
              time.getTime() > new Date(this.form.closeCaseTime).getTime() ||
              time.getTime() > Date.now() // 加- 8.64e7则表示包当天
            )
          }
          if (this.form.caseTime) {
            return (
              time.getTime() > new Date(this.form.caseTime).getTime() ||
              time.getTime() > Date.now() // 加- 8.64e7则表示包当天
            )
          } else {
            return time.getTime() > Date.now() // 加- 8.64e7则表示包当天
          }
        },
      },
      startTime: {
        disabledDate: (time) => {
          if (this.form.reportTime) {
            return (
              time.getTime() > new Date(this.form.reportTime).getTime() ||
              time.getTime() > Date.now()
            )
          }
          if (this.form.closeCaseTime) {
            return (
              time.getTime() > new Date(this.form.closeCaseTime).getTime() ||
              time.getTime() > Date.now() // 加- 8.64e7则表示包当天
            )
          }
          if (this.form.caseTime) {
            return (
              time.getTime() > new Date(this.form.caseTime).getTime() ||
              time.getTime() > Date.now() // 加- 8.64e7则表示包当天
            )
          } else {
            return time.getTime() > Date.now() // 加- 8.64e7则表示包当天
          }
        },
      },
      endTime: {
        disabledDate: (time) => {
          if (this.form.reportTime) {
            return (
              time.getTime() < new Date(this.form.reportTime).getTime() // 加- 8.64e7则表示包当天
            )
          }
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      getEnumAll: 'enums/getEnumAll',
      enumList: 'enums/getStrEnumAll',
    }),
  },

  activated() {
    this.InitData()
  },
  mounted() {
    this.InitData()
  },

  methods: {
    handleSelect() {
      this.$refs.ruleForm.validateField('policyNo')
    },
    /* fetch-suggestions 是一个返回输入建议的方法属性，在该方法中你可以在输入建议数据准备好时通过 cb(data) 返回到 autocomplete 组件中. */
    querySearch(queryString, cb) {
      getPolicyNo(queryString).then((res) => {
        var List = []
        setTimeout(() => {
          if (!res.data.length != 0) {
            this.$baseMessage('查询不到该保单号', 'warning')
            cb(List)
          }
        }, 2000)
        if (res.data) {
          List = res.data.map((item) => {
            return { value: item }
          })
          cb(List) // 调用 callback 返回建议列表的数据
        }
      })
    },
    async changeArea(e) {
      //选中地区

      if (e) {
        this.form.accidentProvinceCode = e[0]
        this.form.accidentCityCode = e[1]
        this.form.accidentCountyCode = e[2]
        this.form.accidentAreaCode = e[3] || ''
        if (e[3]) {
          let res = await getStreet(e[3], { levels: '4' })
          if (res.code == '0000') {
            this.form.accidentAreaName = res.data[e[3]]
          }
        }
      } else {
        return
      }
      this.form.accidentProvinceName =
        this.areaMap[this.form.accidentProvinceCode] || '' // 省编码转中文
      this.form.accidentCityName = this.areaMap[this.form.accidentCityCode] // 市编码转中文
      this.form.accidentCountyName = this.areaMap[this.form.accidentCountyCode] // 区编码转中文
    },
    InitData() {
   
      this.getEnum()
      this.getAcdType()
      this.getSpecAcdType()
    },
  
    getEnum() {
      let arr1 = []
      Object.keys(this.enumList.CauseEnum).forEach((key) => {
        let obj = {
          label: this.enumList.CauseEnum[key].label,
          value: this.enumList.CauseEnum[key].strCode,
        }
        arr1.push(obj)
      })
      this.reasonArr = arr1
    },
    async getAcdType() {
      let res = await dictItem(true, '20001')

      if (res.code == '0000') {
        this.acdType = res.data
      }
    },
    async getSpecAcdType() {
      //获取特殊行业领域事故类型
      let res = await dictItem(true, '20002')
      if (res.code == '0000') {
        this.specAcdtype = res.data
      }
    },
    handleAvatarSuccess() {
      this.$refs.ruleForm.validateField('accidentReportIds')
    },
    beforeAvatarUpload: function (file) {
      const isLt2M = file.size / 1024 / 1024 < 10 //限制图片大小

      if (!isLt2M) {
        this.$baseMessage('上传头像图片大小不能超过10MB!', 'error')
      }
      return isLt2M
    },
    exceed() {
      this.$baseMessage('文件最多上传10个！', 'error')
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      //删除文件
      if (file.id) {
        this.form.accidentReportIds.splice(
          this.form.accidentReportIds.findIndex((item) => item === file.id),
          1
        )
      } else {
        let delItem = this.photoCopyList.filter((item) => {
          return item.uid == file.uid
        })
        this.form.accidentReportIds.splice(
          this.form.accidentReportIds.findIndex((item) => item === delItem.id),
          1
        )
        this.photoCopyList.splice(
          this.photoCopyList.findIndex((item) => item === delItem.id),
          1
        )
      }

      this.$baseMessage('删除成功', 'success')
    },
    designerChange() {
      setTimeout(() => {
        this.form.specAccidentTypeName = this.$refs.editCascader.inputValue
      }, 100)
    },
    designerChange2() {
      setTimeout(() => {
        this.form.accidentTypeName = this.$refs.editCascader2.inputValue
      }, 200)
    },
    designerChange3() {
      setTimeout(() => {
        this.form.reason = this.$refs.editCascader3.query
        console.log(this.form.reason, 'reason')
      }, 200)
    },
    async changeImg(file) {
      let data = new FormData()
      data.append('file', file.file)
      const res = await uploadFile(data)
      if (res.code == '0000') {
        this.form.accidentReportIds.push(res.data.id)
        this.photoCopyList.push({ uid: file.file.uid, id: res.data.id })
      }
    },
    save() {
      let flag = false
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // this.$store.commit('formDatas/caseInfoEntity', this.form)
          flag = true
        }
      })
      return flag
    },
  },
}
</script>
<style lang="scss" scoped>
#ReportCase {
  padding: 0;
  margin: 10px 0;
  background-color: #fff;
}
.wd250 {
  width: 250px !important;
}
.red {
  color: #f00;
}
</style>
