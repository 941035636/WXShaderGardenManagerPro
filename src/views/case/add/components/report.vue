<template>
  <div id="report">
    <div class="content_item lh30">
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="150px"
        :inline="true"
        :model="form"
        :rules="rules"
      >
        <div class="conBox">
          <div class="title">
            <span></span>
            <span class="color-blue f16 ml10 mr20">报案/出险信息</span>
          </div>
          <div class="mainCon">
            <div class="sTitle fb">报案信息</div>
            <el-row>
              <el-col :span="9">
                <el-form-item label="报案人" prop="reportName">
                  <el-input
                    v-model="form.reportName"
                    size="small"
                    placeholder="请输入报案人"
                    class="w300"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="联系电话" prop="reportPhone">
                  <el-input
                    v-model="form.reportPhone"
                    size="small"
                    placeholder="请输入联系电话"
                    class="w300"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="报案号" prop="reportNo">
                  <el-input
                    v-model="form.reportNo"
                    size="small"
                    placeholder="请输入报案号"
                    class="w300"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="报案时间" prop="reportTime">
                  <el-date-picker
                    v-model="form.reportTime"
                    :picker-options="reportCaseTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    class="w300"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="立案号" prop="caseNo">
                  <el-input
                    v-model="form.caseNo"
                    size="small"
                    placeholder="请输入立案号"
                    class="w300"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="立案时间" prop="caseTime">
                  <el-date-picker
                    v-model="form.caseTime"
                    :picker-options="endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    class="w300"
                    type="datetime"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="sTitle fb">出险信息</div>
            <el-row>
              <el-col :span="20">
                <div style="display: flex">
                  <el-form-item label="出险地点" prop="areaCascaser">
                    <el-cascader
                      v-model="form.areaCascaser"
                      placeholder="请选择地区"
                      class="w300"
                      filterable
                      :options="areaList"
                      :props="{ checkStrictly: false }"
                      clearable
                      @change="changeArea"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item prop="riskAddr">
                    <el-input
                      v-model="form.riskAddr"
                      size="small"
                      placeholder="请输入详细地址"
                      class="w450 mt2"
                      clearable
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="出险时间" prop="riskTime">
                  <el-date-picker
                    v-model="form.riskTime"
                    :picker-options="startTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="请输入出险时间"
                    class="w300"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="出险经过" prop="riskProcess">
                  <el-input
                    v-model="form.riskProcess"
                    rows="2"
                    type="textarea"
                    placeholder="请输入出险经过"
                    class="w600"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="conBox">
          <div class="title">
            <span></span>
            <span class="color-blue f16 ml10 mr20">事故信息</span>
          </div>
          <div class="mainCon">
            <el-row>
              <el-col :span="9">
                <el-form-item label="事故类型" prop="accidentTypeCode">
                  <el-select
                    v-model="form.accidentTypeCode"
                    class="w300"
                    filterable
                    clearable
                    @change="cahngeType"
                    placeholder="请选择事故类型"
                  >
                    <el-option
                      v-for="(item, key) in acdType"
                      :key="key"
                      :label="item.itemText"
                      :value="item.itemValue"
                    ></el-option>
                  </el-select>
                  <!-- <el-cascader
                    ref="editCascader2"
                    v-model="form.accidentTypeCode"
                    placeholder="请选择事故类型"
                    class="w300"
                    filterable
                    @change="cahngeType"
                    clearable
                    :options="acdType"
                    :props="{
                      label: 'itemText',
                      value: 'itemValue',
                    }"
                  ></el-cascader> -->
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="特殊行业领域" prop="specAccidentTypeIds">
                  <el-cascader
                    ref="editCascader"
                    v-model="form.specAccidentTypeIds"
                    placeholder="请选择"
                    class="w300"
                    clearable
                    filterable
                    :options="specAcdtype"
                    :props="{
                      label: 'itemText',
                      value: 'itemValue',
                      children: 'sysDictItemEntitys',
                    }"
                    @change="designerChange"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="事故原因" prop="accidentReason">
                  <el-select
                    ref="editCascader3"
                    v-model="form.accidentReason"
                    class="w300"
                    filterable
                    clearable
                    placeholder="请选择事故原因"
                    @change="designerChange3"
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
              <el-col :span="9">
                <el-form-item label="事故等级" prop="accidentLevel">
                  <el-select
                    v-model="form.accidentLevel"
                    class="w300"
                    filterable
                    clearable
                    placeholder="请选择事故等级"
                  >
                    <el-option
                      v-for="(item, key) in levelArr"
                      :key="key"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item
                  style="width: 100%s"
                  prop="accidentReportIds"
                  label="事故调查报告"
                >
                  <div style="display: flex">
                    <el-upload
                      class="upload-demo mb20"
                      :action="this.baseURL + `/files/v1/upload/file`"
                      :data="upLoadData2"
                      :file-list="fileList2"
                      :headers="headers"
                      :on-success="handleAvatarSuccess"
                      name="file"
                      accept=".pdf,.zip,.rar,.png,.jpg"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload2"
                      multiple
                      :limit="9"
                      :on-exceed="handleExceed"
                    >
                      <el-button size="mini" class="w100" type="primary">
                        选择附件
                      </el-button>
                    </el-upload>
                    <span class="ml20 color-blue">
                      只支持PDF/ZIP/RAR/PNG/JPG，大小不超过20M（最多可上传9件）
                    </span>
                  </div>
                  <el-table
                    :data="files"
                    border
                    style="width: 900px"
                    header-row-class-name="headName"
                    :header-cell-style="getRowClass"
                  >
                    <el-table-column
                      type="index"
                      width="70"
                      label="序号"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="name"
                      label="文件名"
                    ></el-table-column>

                    <el-table-column
                      prop="createTime"
                      label="上传时间"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column align="center" width="150" label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="dowmLoad(scope.row.id)">
                          下载
                        </el-button>
                        <el-button
                          type="text"
                          @click="del(scope.row.id, scope.$index)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="conBox">
          <div class="title">
            <span></span>
            <span class="color-blue f16 ml10 mr20">估损信息</span>
          </div>
          <div class="mainCon">
            <el-row>
              <el-col :span="9">
                <el-form-item label="估损金额" prop="lossAmount">
                  <el-input
                    v-model="form.lossAmount"
                    size="small"
                    placeholder="请输入估损金额"
                    class="w300"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="估损日期" prop="lossTime">
                  <el-date-picker
                    v-model="form.lossTime"
                    :picker-options="lossTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    class="w300"
                    type="datetime"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="conBox">
          <div class="title">
            <span></span>
            <span class="color-blue f16 ml10 mr20">查勘信息</span>
            <span>
              <el-switch @change="changeSite" v-model="hasSite"></el-switch>
              （可选）
            </span>
          </div>
          <div v-if="hasSite" class="mainCon">
            <el-form-item prop="caseSiteSurveyParams ">
              <el-button
                @click="openSite"
                size="mini"
                class="w100 ml30"
                type="primary"
              >
                添加记录
              </el-button>
            </el-form-item>

            <br />
            <el-table
              :data="form.caseSiteSurveyParams"
              border
              class="ml30 mt10"
              style="width: 80%"
              header-row-class-name="headName"
              :header-cell-style="getRowClass"
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="time" label="查勘时间"></el-table-column>

              <el-table-column label="查勘描述" show-overflow-tooltip>
                <template slot-scope="scoped">
                  <moreCon :data="scoped.row.remark" :length="20" />
                </template>
              </el-table-column>
              <el-table-column label="查勘人员姓名" show-overflow-tooltip>
                <template slot-scope="scoped">
                  {{ scoped.row.name }}
                  <span v-if="scoped.row.phone">
                    （{{ scoped.row.phone }}）
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="查勘报告或图片" show-overflow-tooltip>
                <template slot-scope="scoped">
                  <span v-if="scoped.row.fileRecordIds.length">
                    共{{ scoped.row.fileRecordIds.length }}个附件，
                    <el-button
                      type="text"
                      @click="dowmLoadFile(scoped.row)"
                      class="ckBtn"
                    >
                      点击查看
                    </el-button>
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="edt(scope.row, scope.$index)">
                    修改
                  </el-button>
                  <el-button type="text" @click="delet(scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="conBox">
          <div class="title">
            <span></span>
            <span class="color-blue f16 ml10 mr20">垫付预付快付信息</span>
            <span>
              <el-switch @change="changePay" v-model="hasPay"></el-switch>
              （可选）
            </span>
          </div>
          <div v-if="hasPay" class="mainCon">
            <el-form-item prop="casePaymentRecordParams">
              <el-button
                @click="openPay"
                size="mini"
                class="w100 ml30"
                type="primary"
                v-model="hasPay"
              >
                添加记录
              </el-button>
            </el-form-item>

            <br />
            <el-table
              :data="form.casePaymentRecordParams"
              border
              class="ml30 mt10"
              style="width: 80%"
              header-row-class-name="headName"
              :header-cell-style="getRowClass"
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="paymentTime"
                label="付款时间"
              ></el-table-column>

              <el-table-column label="付款类型" show-overflow-tooltip>
                <template slot-scope="scoped">
                  <span v-if="scoped.row.paymentType == 1">预付</span>
                  <span v-if="scoped.row.paymentType == 2">垫付</span>
                  <span v-if="scoped.row.paymentType == 3">快付</span>
                </template>
              </el-table-column>
              <el-table-column
                label="付款金额"
                prop="paymentAmount"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column label="付款凭证" show-overflow-tooltip>
                <template slot-scope="scoped">
                  <span v-if="scoped.row.fileRecordIds.length">
                    共{{ scoped.row.fileRecordIds.length }}个附件，
                    <el-button
                      type="text"
                      @click="dowmLoadFile(scoped.row)"
                      class="ckBtn"
                    >
                      点击查看
                    </el-button>
                  </span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="edtPay(scope.row, scope.$index)"
                  >
                    修改
                  </el-button>
                  <el-button type="text" @click="deletPay(scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
    </div>
    <add-site @siteCb="siteCb(arguments)" ref="addSite" />
    <add-pay @payCb="payCb(arguments)" ref="addPay" />
    <voucher-list ref="voucherList" />
  </div>
</template>
<script>
import moreCon from '@/components/moreCon'
import { mapGetters } from 'vuex'
import { loginRSA, tokenName, baseURL } from '@/config'
import { getImgFile, getFile } from '@/api/resources'
import addSite from './addSite.vue'
import addPay from './addPay.vue'
import { uploadFile, dictItem, getPolicyNo } from '@/api/policyManagement'
import store from '@/store'
import {
  validateTelephone,
  validateCharger,
  validateMoney2,
  validateContactName,
  validateCon,
  validateCaseNo,
  validatePolicyNo,
  validateNum,
} from '@/utils/validateFrom'
import VoucherList from '../../caseDetail/VoucherList.vue'

export default {
  name: 'report',
  components: { moreCon, addSite, addPay, VoucherList },
  data() {
    return {
      baseURL: baseURL,
      upLoadData2: {},
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      hasSite: false,
      hasPay: false,
      fileList2: [], // 图片回显地址
      acdType: [], //事故类型
      allArea: [], //地区下拉框
      specAcdtype: [], //特殊行业事故类型
      form: {
        caseSiteSurveyParams: [],
        casePaymentRecordParams: [],
        reportName: '', //报案人姓名
        reportPhone: '', //报案电话
        reportNo: '',
        reportTime: '', //报案时间
        lossTime: '', //事故时间
        lossAmount: 0,
        caseTime: '', //报案时间
        closeCaseTime: '', //决案时间
        riskAddr: '', //事故发生详细地
        riskTime: '',
        caseNo: '', //事故单号

        accidentProvinceCode: '', //事故发生省编码
        accidentProvinceName: '', //事故发生省名称
        accidentCityCode: '', //事故发生市编码
        accidentCityName: '', //事故发生市名称
        accidentCountyCode: '', //事故发生县编码
        accidentCountyName: '', //事故发生县名称

        accidentTypeCode: '', //事故类型

        specAccidentTypeIds: [], //特殊行业领域事故类型
        specAccidentTypeName: '',
        injuryNum: 0, //受伤人数
        deathNum: 0, //死亡人数
        riskProcess: '', //事故描述
        accidentReason: null, //事故原因
        accidentLevel: null, //事故原因
        reason: '',
        accidentReportIds: [], //事故报告
        areaCascaser: [], //地区
      },
      files: [],
      reasonArr: [],
      levelArr: [],
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
            validator: validateTelephone,
            trigger: 'blur',
          },
        ],
        lossAmount: [
          {
            required: true,
            validator: validateMoney2,
            trigger: 'blur',
          },
        ],
        reportNo: [
          {
            required: true,
            message: '请输入报案号',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符1-30位',
          },
        ],
        reportTime: [
          {
            required: true,
            message: '请输入报案时间',
            trigger: 'blur',
          },
        ],
        caseSiteSurveyParams: [
          {
            required: true,
            message: '请填写查勘信息',
            trigger: 'blur',
          },
        ],
        casePaymentRecordParams: [
          {
            required: true,
            message: '请填写',
            trigger: 'blur',
          },
        ],
        riskTime: [
          {
            required: true,
            message: '请输入出险时间',
            trigger: 'blur',
          },
        ],
        lossTime: [
          {
            required: true,
            message: '请输入估损时间',
            trigger: 'blur',
          },
        ],
        accidentReason: [
          {
            required: true,
            message: '请选择事故原因',
            trigger: 'blur',
          },
        ],
        accidentLevel: [
          {
            required: true,
            message: '请选择事故等级',
            trigger: 'blur',
          },
        ],
        areaCascaser: [
          {
            required: true,
            message: '请输入出险地点',
            trigger: 'change',
          },
        ],
        riskAddr: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 100,
            message: '字符1-100位',
          },
        ],
        caseNo: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符1-30位',
          },
        ],

        caseTime: [
          {
            required: true,
            message: '请输入立案时间',
            trigger: 'blur',
          },
        ],
        accidentTypeCode: [
          {
            required: true,
            message: '请选择事故类型',
            trigger: 'change',
          },
        ],
        specAccidentTypeIds: [
          {
            required: true,
            message: '请选择特殊行业领域事故类型',
            trigger: 'change',
          },
        ],
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
        riskProcess: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'change',
          },
          {
            min: 1,
            max: 300,
            message: '字符1-300位',
          },
        ],
      },

      reportCaseTime: {
        disabledDate: (time) => {
          // if (this.form.lossTime) {
          //   return time.getTime() > new Date(this.form.lossTime).getTime()
          // }
          // if (this.form.caseTime) {
          //   return time.getTime() > new Date(this.form.caseTime).getTime()
          // }
          if (this.form.riskTime) {
            return time.getTime() < new Date(this.form.riskTime).getTime()
          }
        },
      },
      startTime: {
        disabledDate: (time) => {
          if (this.form.lossTime) {
            return time.getTime() > new Date(this.form.lossTime).getTime()
          }
          if (this.form.caseTime) {
            return time.getTime() > new Date(this.form.caseTime).getTime()
          }
          if (this.form.reportTime) {
            return time.getTime() > new Date(this.form.reportTime).getTime()
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
          if (this.form.riskTime) {
            return (
              time.getTime() < new Date(this.form.riskTime).getTime() // 加- 8.64e7则表示包当天
            )
          }
          if (this.form.lossTime) {
            return (
              time.getTime() > new Date(this.form.lossTime).getTime() // 加- 8.64e7则表示包当天
            )
          }
        },
      },
      lossTime: {
        disabledDate: (time) => {
          if (this.form.riskTime) {
            return (
              time.getTime() < new Date(this.form.riskTime).getTime() // 加- 8.64e7则表示包当天
            )
          }
          if (this.form.caseTime) {
            return (
              time.getTime() < new Date(this.form.caseTime).getTime() // 加- 8.64e7则表示包当天
            )
          }
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
      areaList: 'areas/areaList',
      getEnumAll: 'enums/getEnumAll',
      enumList: 'enums/getStrEnumAll',
    }),
  },

  mounted() {
    this.InitData()
  },

  methods: {
    dowmLoadFile(row) {
      let data = row.fileRecord.map((item) => {
        return {
          name: item.name,
          id: item.id,
        }
      })

      this.$refs.voucherList.tableData = data
      this.$refs.voucherList.dialogVisible = true
    },
    cahngeType(e) {
      console.log(e, 'eee')
    },
    openPay() {
      this.$refs.addPay.limitTime = this.form.caseTime
      this.$refs.addPay.dialogFormVisible = true
    },
    payCb(data) {
      console.log(data, 'data')
      if (data[2]) {
        this.form.casePaymentRecordParams.push(data[0])
      } else {
        this.form.casePaymentRecordParams[data[1]] = data[0]
      }
    },
    changePay(e) {
      if (e) {
      } else {
        this.$confirm('将会清除付款信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.form, 'casePaymentRecordParams', [])
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasPay = true
          })
      }
    },
    changeSite(e) {
      if (e) {
      } else {
        this.$confirm('将会清除查勘信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.form, 'caseSiteSurveyParams ', [])
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.hasSite = true
          })
      }
    },
    openSite() {
      this.$refs.addSite.limitTime = this.form.caseTime
      this.$refs.addSite.dialogFormVisible = true
    },
    siteCb(data) {
      console.log(data, 'data')
      if (data[2]) {
        this.form.caseSiteSurveyParams.push(data[0])
      } else {
        this.form.caseSiteSurveyParams[data[1]] = data[0]
      }
    },
    edt(row, index) {
      this.$refs.addSite.limitTime = this.form.caseTime
      this.$refs.addSite.dialogFormVisible = true
      this.$refs.addSite.index = index
      this.$refs.addSite.flag = false
      this.$refs.addSite.form = row
    },
    delet(index) {
      this.form.caseSiteSurveyParams.splice(index, 1)
    },
    edtPay(row, index) {
      this.$refs.addPay.dialogFormVisible = true
      this.$refs.addPay.index = index
      this.$refs.addPay.limitTime = this.form.caseTime
      this.$refs.addPay.flag = false
      this.$refs.addPay.form = row
    },
    deletPay(index) {
      this.form.casePaymentRecordParams.splice(index, 1)
    },
    dowmLoad(id) {
      let res = getFile('/files/downloadfile/' + id)
    },
    del(id, index) {
      this.form.accidentReportIds.splice(index, 1)
      this.files.splice(index, 1)
    },

    handleAvatarSuccess(res) {
      //上传成功调用

      if (res.code == '0000') {
        let obj = {
          id: res.data.id,
          name: res.data.name,
          createTime: res.data.createTime,
        }
        this.files.push(obj)
        this.form.accidentReportIds.push(res.data.id)
      } else if (res.code == '9999') {
        this.$baseMessage(res.msg, 'error')
      }
    },
    handleExceed() {
      this.$baseMessage('最多支持上传9个文件', 'error')
    },
    beforeAvatarUpload2(file) {
      console.log(file, 'file')
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      /* const isPNG = file.type === 'image/png'; */
      const isLt4M = file.size / 1024 / 1024 < 20
      // if (!isJPGorPNG) {
      //   this.$baseMessage('只支持DOC/DOCX/PDF/ZIP/RAR格式', 'error')
      // }

      if (!isLt4M) {
        this.$baseMessage('上传文件大小不能超过 20MB!', 'error')
      }
      // return isJPGorPNG && isLt4M
      return isLt4M
    },
    async changeArea(e) {
      //选中地区

      if (e) {
        this.form.accidentProvinceCode = e[0]
        this.form.accidentCityCode = e[1]
        this.form.accidentCountyCode = e[2]
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
          value: this.enumList.CauseEnum[key].code,
        }
        arr1.push(obj)
      })
      this.reasonArr = arr1
      let arr2 = []
      Object.keys(this.enumList.AccidentLevelEnum).forEach((key) => {
        let obj = {
          label: this.enumList.AccidentLevelEnum[key].label,
          value: this.enumList.AccidentLevelEnum[key].code,
        }
        arr2.push(obj)
      })
      this.levelArr = arr2
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

    designerChange(e) {
      if (!e) {
        return
      }
      this.form.specAccidentTypeOne = e[0] || ''
      this.form.specAccidentTypeTwo = e[1] || ''
    },

    designerChange3() {
      // setTimeout(() => {
      //   this.form.reason = this.$refs.editCascader3.query
      //   console.log(this.form.reason, 'reason')
      // }, 200)
    },

    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;color:#0050b3'
      } else {
        return ''
      }
    },
    save() {
      let flag = false
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('formDatas/caseInfoEntity', this.form)
          flag = true
        }
      })
      return flag
    },
  },
}
</script>
<style lang="scss" scoped>
#report {
  padding: 0;

  background-color: #f6f8f9;
  .conBox {
    border-radius: 6px;
    margin-top: 10px;
    overflow: hidden;

    background-color: #fff;
    .mainCon {
      padding: 20px 30px;
    }
    .emptyBox {
      height: 160px;
      display: flex;

      justify-content: center;
      align-items: center;
    }
    .title {
      display: flex;
      height: 40px;
      width: 96%;
      margin: 0 auto;
      align-items: center;
      padding: 0 20px;
      font-size: 12px;
      border-bottom: 1px solid #e9e9e9;

      span:nth-child(1) {
        display: inline-block;
        width: 5px;
        height: 16px;
        background-color: #096dd9;
      }

      span:nth-child(4) {
        color: #ffa940;
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
  .ckBtn {
    color: #096dd9;
    text-decoration: underline;
  }
}
.w300 {
  width: 250px !important;
}
.red {
  color: #f00;
}
</style>
