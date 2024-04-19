<template>
  <div id="servicrAdd">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
    >
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="ruleForm.projectName"
          class="w280"
          placeholder="请输入项目名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务合同编号" prop="contractNo">
        <el-input
          v-model="ruleForm.contractNo"
          class="w280"
          placeholder="请输入服务合同编号"
        ></el-input>
        <div v-if="ruleForm.contractNo" class="contractNo-box">
          <span>{{ contractNoUpperCase }}</span>
        </div>
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
      <el-form-item label="服务费金额（元）" prop="accidentPreFund">
        <el-input
          v-model="ruleForm.accidentPreFund"
          class="w280"
          placeholder="请输入服务费金额"
        ></el-input>
        <span class="ml10 color-red-F5222D">( {{ accidentPreFundBig }} )</span>
      </el-form-item>
      <el-form-item label="服务机构" prop="serviceAgencyCode">
        <el-table
          :data="tableList"
          border
          :header-cell-style="getRowClass"
          class="w800"
        >
          <el-table-column label="选择" width="50" align="center">
            <template slot-scope="scope">
              <el-radio
                v-model="ruleForm.serviceAgencyCode"
                :label="scope.row.code"
                @change="setServiceBranch(scope.row)"
              >
                <p style="display: none">{{ scope.row.code }}</p>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="服务机构名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="branchLinkMan"
            label="联系人"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="branchLinkPhone"
            label="联系电话"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="项目服务说明">
        <el-input
          v-model="ruleForm.remark"
          class="w800"
          type="textarea"
          placeholder="请输入项目服务说明"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="toThisTag">返回</el-button>
        <el-button type="primary" @click="register">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // import { getBranchList } from '@/api/userDataManagement'
  // import { addProject } from '@/service/accidentManagement'
  // import { updateProject } from '@/service/accidentManagement'
  // import { getProjectDetails } from '@/service/accidentManagement'
  import { smalltoBIG } from '@/util/validate'
  import { dateTest } from '@/util/validate'
  import { validateContractNo } from '@/util/validateFrom'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceAdd',
    components: {},
    data() {
      return {
        dealDateStartOptions: this.beginDate(),
        ruleForm: {
          accidentPreFund: 0, // 服务金额
          accidentPreFundRatio: '', // 事故预防费用占比
          contactName: '', // 联系人姓名
          contactNum: '', // 联系人电话
          contractNo: '', // 合同编号
          createBy: '',
          policyNo: '', // 保单号
          projectName: '',
          remark: '',
          serviceAgencyCode: '', // 安全服务机构编码
          serviceAgencyName: '', // 安全服务机构名称
          startTime: '',
          endTime: '',
        },
        accidentPreFundBig: '零',
        userCode: '',
        rules: {
          projectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ],
          contractNo: [
            { required: true, validator: validateContractNo, trigger: 'blur' },
          ],
          startTime: [
            {
              required: true,
              message: '请选择服务时间起期',
              trigger: 'change',
            },
          ],
          endTime: [
            {
              required: true,
              message: '请选择服务时间止期',
              trigger: 'change',
            },
          ],
          accidentPreFund: [
            { required: true, message: '请输入服务费金额', trigger: 'blur' },
          ],
          serviceAgencyCode: [
            { required: true, message: '请选择服务机构', trigger: 'change' },
          ],
        },
        tableList: [],
      }
    },
    computed: {
      ...mapGetters({
        areaList: 'areas/areaList',
        areaListAll: 'areas/areaListAll',
        areaMap: 'areas/areaMap',
        visitedRoutes: 'tabsBar/visitedRoutes',
      }),
      contractNoUpperCase() {
        let contractNo = this.ruleForm.contractNo || ''
        return contractNo.toUpperCase()
      },
    },
    watch: {
      'ruleForm.accidentPreFund': function (n, o) {
        console.log(n, o)
        this.accidentPreFundBig = smalltoBIG(n) || '零'
      },
    },
    mounted() {
      this.getBranchList()
    },
    methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      async getBranchList() {
        let from = {
          pn: 1,
          ps: 100,
          name: '',
          agencyNature: '',
          bl: '',
          status: '1',
          code: '',
          desc: false,
          orderby: '',
          type: '02',
        }
        let res = await getBranchList(from)
        if (res.code === '0000') {
          this.tableList = res.list
          if (this.$route.query.id) {
            this.initData(this.$route.query.id)
          }
        }
      },
      async initData(id) {
        let res = await getProjectDetails(id)
        if (res.code === '0000') {
          for (let key in this.ruleForm) {
            this.ruleForm[key] = res.data.accidentPreProjectEntity[key]
          }
          this.ruleForm.id = id
          this.ruleForm.startTime = this.ruleForm.startTime.split(' ')[0]
          this.ruleForm.endTime = this.ruleForm.endTime.split(' ')[0]
        }
      },
      async configRegister() {
        let data = JSON.parse(JSON.stringify(this.ruleForm))
        if (dateTest(this.ruleForm.startTime, this.ruleForm.endTime)) {
          this.$message.error('止起不能大于起期，请重新选择')
          return
        }
        data.startTime = `${data.startTime} 00:00:00`
        data.endTime = `${data.endTime} 23:59:59`
        data.contractNo = data.contractNo.toUpperCase()
        if (data.id) {
          let res = await updateProject(data, data.id)
          if (res.code === '0000') {
            this.toThisTag()
          }
        } else {
          let res = await addProject(data)
          if (res.code === '0000') {
            this.toThisTag()
          }
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
      // 处理选中省市区方法
      setServiceBranch(e) {
        this.ruleForm.serviceAgencyName = e.name
        this.ruleForm.contactName = e.branchLinkMan
        this.ruleForm.contactNum = e.branchLinkPhone
      },
      // 设置路由
      async toThisTag() {
        this.$router.push({
          path: '/prev/project',
        })
      },
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            let startDate = self.serviceData
              ? self.serviceData.split(' ')[0]
              : new Date()
            return time.getTime() < new Date(startDate)
          },
        }
      },
    },
  }
</script>

<style scoped lang="less">
  #servicrAdd {
    padding-top: 10px;
    margin: 10px;
    background-color: #fff;
    .btn-bottom {
      margin-top: 20px;
      text-align: center;
    }
    .contractNo-box {
      margin-top: 10px;
      font-size: 14px;
      span {
        display: inline-block;
        background-color: #0b8c1e;
        border-radius: 10px;
        box-sizing: border-box;
        min-width: 280px;
        padding: 0 10px;
      }
    }
  }
</style>
