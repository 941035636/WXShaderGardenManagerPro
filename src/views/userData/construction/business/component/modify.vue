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
        <el-form-item prop="projectName" label="项目名称">
          <el-input
            v-model="ruleForm.projectName"
            clearable
            class="w450"
            maxlength="50"
            placeholder="请输入"
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
        <el-form-item prop="licenseKey" label="施工许可证号：">
          <el-input
            v-model="ruleForm.licenseKey"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item prop="totalProjectCost" label="工程总造价（万元）：">
          <el-input
            v-model="ruleForm.totalProjectCost"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item prop="totalProjectArea" label="工程总面积（㎡）：">
          <el-input
            v-model="ruleForm.totalProjectArea"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item prop="buildOrgName" label="建设单位：">
          <el-input
            v-model="ruleForm.buildOrgName"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item prop="orgName" label="施工单位：">
          <el-input
            v-model="ruleForm.orgName"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item prop="orgBlCode" label="施工单位社会信用代码：">
          <el-input
            v-model="ruleForm.orgBlCode"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="supervisorOrgName" label="监理单位：">
          <el-input
            v-model="ruleForm.supervisorOrgName"
            clearable
            class="w450"
            placeholder="请输入内容"
            size="mini"
          ></el-input>
        </el-form-item>

        <br />
        <el-form-item label="更新项目状况：" prop="projectStatus">
          <el-select
            v-model="ruleForm.projectStatus"
            class="w250"
            clearable
            size="small"
            placeholder="请选择更新项目状况"
          >
            <el-option
              v-for="(item, index) in projectStatusList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="是否购买安责险：" prop="isBuy">
          <el-select
            v-model="ruleForm.isBuy"
            class="w250"
            clearable
            size="small"
            placeholder="请选择是否购买安责险"
          >
            <el-option
              v-for="(item, index) in isBuys"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
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
import { putProject } from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import { validateBlCodeGZ, validateMoneyNo } from '@/utils/validateFrom'
import { historiesList } from '@/api/userDataManagement'
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
      dialogVisible: false,
      isBuys: [
        {
          code: true,
          name: '是',
        },
        {
          code: false,
          name: '否',
        },
      ],
      projectStatusList: [
        {
          code: '01',
          name: '在建',
        },
        {
          code: '02',
          name: '不在建',
        },
      ],
      ruleForm: {
        id: '',
        projectName: '',//项目名称
        licenseKey: '',//施工许正号,
        projectStatus: '',//项目状况
        orgName: '',//施工单位
        orgBlCode: '',//施工单位信用代码
        isBuy: '',//是否购买安责险
        buildOrgName: '',//建设单位
        isRelation: '',//是否关连
        provinceName: '',//所在区域省
        cityName: '',//所在区域市
        countyName: '',//所在区域区
        provinceCode: '',//所在区域省 code
        cityCode: '',//所在区域市code
        countyCode: '',//所在区域区code
        areaCascaser: [], //地区
        totalProjectCost: '',//工程总造价（万元）
        totalProjectArea: '',//工程总面积（㎡）：
        supervisorOrgName: '',//监理单位
        insureStatus: '',//是否在保
        belongToYear: '',//年份
      },
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
        isBuy: [
          {
            required: true,
            message: '请选择是否购买安责险',
            trigger: 'blur',
          },
        ],
        projectStatus: [
          {
            required: true,
            message: '请输入项目状况',
            trigger: 'blur',
          },
        ],
        supervisorOrgName: [
          {
            required: true,
            message: '请输入监理单位',
            trigger: 'blur',
          },
        ],

        orgName: [
          {
            required: true,
            message: '请输入施工单位',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符长度1-30位',
            trigger: 'blur',
          },
        ],
        buildOrgName: [
          {
            required: true,
            message: '请输入建设单位',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符长度1-30位',
            trigger: 'blur',
          },
        ],
        totalProjectArea: [
          {
            required: true,
            message: '请输入工程总面积',
            trigger: 'blur',
          },
          {
            required: true,
            validator: validateMoneyNo,
            trigger: 'blur'
          }
        ],
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 100,
            message: '字符长度1-100位',
            trigger: 'blur',
          },
        ],
        orgBlCode: [
          {
            required: true,
            validator: validateBlCodeGZ,
            trigger: 'blur',
          },
        ],
        licenseKey: [
          {
            required: true,
            message: '请输入施工许可证号',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 100,
            message: '字符长度1-100位',
            trigger: 'blur',
          },
        ],
        totalProjectCost: [
          {
            required: true,
            message: '请输入工程总造价',
            trigger: 'blur',
          },
          {
            required: true,
            validator: validateMoneyNo,
            trigger: 'blur'
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
  },

  methods: {
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
      this.ruleForm = {
        id: '',
        projectName: '',//项目名称
        licenseKey: '',//施工许正号,
        projectStatus: '',//项目状况
        orgName: '',//施工单位
        orgBlCode: '',//施工单位信用代码
        isBuy: '',//是否购买安责险
        buildOrgName: '',//建设单位
        isRelation: '',//是否关连
        provinceName: '',//所在区域省
        cityName: '',//所在区域市
        countyName: '',//所在区域区
        provinceCode: '',//所在区域省 code
        cityCode: '',//所在区域市code
        countyCode: '',//所在区域区code
        areaCascaser: [], //地区
        totalProjectCost: '',//工程总造价（万元）
        totalProjectArea: '',//工程总面积（㎡）：
        supervisorOrgName: '',//监理单位
        insureStatus: '',//是否在保
        belongToYear: '',
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    getInit() {
      this.belongToYear = JSON.parse(JSON.stringify(this.ruleForm.belongToYear))//选择年份 避免双重绑定
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

    // async register() {
    //   this.$refs['ruleForm'].validate(async (valid) => {
    //     if (valid) {
    //       let pamrs = {
    //         pn: 1,
    //         ps: 1,
    //         licenseKey: this.ruleForm.licenseKey,
    //         projectName: this.ruleForm.projectName,
    //         belongToYear: this.ruleForm.belongToYear
    //       }
    //       let res = await historiesList(pamrs)
    //       if (res.code == '0000') {
    //         if (res.list.length > 0) {
    //           this.$confirm(`${res.list[0].projectName}项目（施工许可证）已存在，请确认是否修改，修改后原项目信息将被删除，请知悉！`, '提示', {
    //             confirmButtonText: '确定',
    //             cancelButtonText: '取消',
    //             type: 'warning',
    //           }).then(async () => {
    //             this.submit()
    //           })
    //         } else if (res.list.length == 0) {
    //           this.$confirm('即将提交, 是否继续?', '提示', {
    //             confirmButtonText: '确定',
    //             cancelButtonText: '取消',
    //             type: 'warning',
    //           }).then(async () => {
    //             this.submit()
    //           })
    //         }
    //       }
    //     } else {
    //       this.focusError()
    //       return false
    //     }
    //   })
    // },

    async submit() {
      let res = await putProject(this.ruleForm, this.ruleForm.id)
      if (res.code == '0000') {
        this.$message.success('修改企业管理成功')
        this.$parent.$parent.$parent.historiesList()
        this.$parent.$parent.$parent.getYearsList()
        this.dialogVisible = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#companyAdd {
}
.tailTip {
  color: #999;
  cursor: default;
}
</style>
