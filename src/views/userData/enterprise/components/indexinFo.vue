<template>
  <el-dialog
    id="companyAdd"
    title="项目信息修改"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="60%"
    append-to-body
    @open="getInit"
  >
    <div id="highRiskDetails">
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
        <el-form-item prop="belongToYear" label="所属年份：">
          <el-date-picker
            class="w300"
            v-model="ruleForm.belongToYear"
            type="year"
            value-format="yyyy"
            placeholder="请选择"
          ></el-date-picker>
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
          ></el-cascader>
          <!--  @change="handleChangeArea" -->
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="register">
          提交
        </el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
// import { getFile } from '@/api/resources.js'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      ids: '',
      userCode: '',
      dialogVisible: false,
      ruleForm: {
        projectName: '',
        address: [],
        detailAddress: '',
        belongToYear: ''
      },

      // visible: false,
      rules: {
        belongToYear: [
          {
            required: true,
            message: '请选择所属年份',
            trigger: 'blur',
          },
        ],
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur',
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
      }
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      // enumData: 'enums/getStrEnumAll',
      // getStrEnumAll: 'enums/getStrEnumAll',
      // branchId: 'user/branchId',
      // accountType: 'user/accountType',
      areaList: 'areas/areaList',
    }),
  },
  created() {

  },
  methods: {
    async getInit() {

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
        }
      })
    },
    submit() {
      // let date = new Date()
      // let year = date.getFullYear()
      console.log(this.ruleForm, 'this.ruleForm');
      console.log(this.$parent.projectList[this.ids], 'this.$parent.projectList[this.ids]');
      this.$parent.projectList[this.ids].belongToYear = this.ruleForm.belongToYear
      this.$parent.projectList[this.ids].projectName = this.ruleForm.projectName
      this.$parent.projectList[this.ids].detailAddress = this.ruleForm.detailAddress
      this.$parent.projectList[this.ids].provinceCode = this.ruleForm.address[0]
      this.$parent.projectList[this.ids].cityCode = this.ruleForm.address[1]
      this.$parent.projectList[this.ids].countyCode = this.ruleForm.address[2]
      this.$parent.projectList[this.ids].provinceName = this.areaMap[this.ruleForm.address[0]],
        this.$parent.projectList[this.ids].cityName = this.areaMap[this.ruleForm.address[1]],
        this.$parent.projectList[this.ids].countyName = this.areaMap[this.ruleForm.address[2]],

        //如果
        this.$parent.projectList[this.ids].projectDetailAddress = this.ruleForm.detailAddress
      this.$parent.projectList[this.ids].projectProvinceCode = this.ruleForm.address[0]
      this.$parent.projectList[this.ids].projectCityCode = this.ruleForm.address[1]
      this.$parent.projectList[this.ids].projectCountyCode = this.ruleForm.address[2]
      this.$parent.projectList[this.ids].projectProvinceName = this.areaMap[this.ruleForm.address[0]],
        this.$parent.projectList[this.ids].projectCityName = this.areaMap[this.ruleForm.address[1]],
        this.$parent.projectList[this.ids].projectCountyName = this.areaMap[this.ruleForm.address[2]],
        this.dialogVisible = false
    }
  },
}
</script>

<style lang="scss" scoped>
#highRiskDetails {
  background-color: #fff;
  width: 90%;
  margin: 0 auto;
  .el-form-item {
    margin-bottom: 20px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: right;
}
</style>
