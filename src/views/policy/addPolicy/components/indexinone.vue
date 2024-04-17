<template>
  <el-dialog
    id="companyAdd"
    :title="projectFlay ? '项目信息添加' : '项目信息修改'"
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
      >
        <el-form-item prop="infoa" label="项目名称">
          <el-input
            v-model="ruleForm.projectName"
            class="w250"
            placeholder="请输入内容"
            size="mini"
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
  props: {
    projectFlay: ''
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
      }

      // visible: false,

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
      if (this.projectFlay) {
        console.log(this.$parent.projectList, 'this.$parent.projectList');
        let obj = {
          projectName: this.ruleForm.projectName,
          detailAddress: this.ruleForm.detailAddress,
          provinceCode: this.ruleForm.address[0],
          cityCode: this.ruleForm.address[1],
          countyCode: this.ruleForm.address[2],
          provinceName: this.areaMap[this.ruleForm.address[0]],
          cityName: this.areaMap[this.ruleForm.address[1]],
          countyName: this.areaMap[this.ruleForm.address[2]],
        }
        this.$parent.projectList.push(obj)
        this.$parent.projectList1.push(obj)
        this.$parent.flag1 = true
        this.dialogVisible = false
      } else {
        this.$parent.projectList[this.ids].projectName = this.ruleForm.projectName
        this.$parent.projectList[this.ids].detailAddress = this.ruleForm.detailAddress
        this.$parent.projectList[this.ids].provinceCode = this.ruleForm.address[0]
        this.$parent.projectList[this.ids].cityCode = this.ruleForm.address[1]
        this.$parent.projectList[this.ids].countyCode = this.ruleForm.address[2]
        this.$parent.projectList[this.ids].provinceName = this.areaMap[this.ruleForm.address[0]],
          this.$parent.projectList[this.ids].cityName = this.areaMap[this.ruleForm.address[1]],
          this.$parent.projectList[this.ids].countyName = this.areaMap[this.ruleForm.address[2]],
         

          this.$parent.projectList1[0].projectName = this.ruleForm.projectName
        this.$parent.projectList1[0].detailAddress = this.ruleForm.detailAddress
        this.$parent.projectList1[0].provinceCode = this.ruleForm.address[0]
        this.$parent.projectList1[0].cityCode = this.ruleForm.address[1]
        this.$parent.projectList1[0].countyCode = this.ruleForm.address[2]
        this.$parent.projectList1[0].provinceName = this.areaMap[this.ruleForm.address[0]],
          this.$parent.projectList1[0].cityName = this.areaMap[this.ruleForm.address[1]],
          this.$parent.projectList1[0].countyName = this.areaMap[this.ruleForm.address[2]],
          this.dialogVisible = false
      }

    },
  },
}
</script>

<style lang="scss" scoped>
#highRiskDetails {
  background-color: #fff;
  width: 90%;
  margin: 0 auto;
  // .stitle {
  //   font-weight: bold;
  //   color: #000;
  // }
  // .downloadfile {
  //   color: #fa8c16;
  //   cursor: pointer;
  //   text-decoration: underline;
  // }
}
</style>
<style >
/* #highRiskDetails .el-form-item__label {
  color: #919191;
}
#highRiskDetails .el-form-item {
  margin-bottom: 5px;
} */
</style>
