<template>
  <div id="servicrAdd">
    <el-dialog
      :title="projectId ? '编辑项目' : '添加项目'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="close"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="180px"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="ruleForm.projectName"
            class="w280"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <el-input
            v-model="ruleForm.contractNo"
            class="w280"
            placeholder="请输入合同编号"
          ></el-input>
          <!-- <div v-if="ruleForm.contractNo" class="contractNo-box">
            <span>{{ contractNoUpperCase }}</span>
          </div> -->
        </el-form-item>
        <div class="display-flex">
          <el-form-item label="项目期间" prop="startTime">
            <el-date-picker
              v-model="ruleForm.startTime"
              class="w150"
              :picker-options="startDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择起期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-row class="mr10 ml10">至</el-row>
          </el-form-item>
          <el-form-item prop="endTime" label-width="0px">
            <el-date-picker
              v-model="ruleForm.endTime"
              class="w150"
              :picker-options="endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择止期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <!-- <el-form-item label="服务费金额（元）" prop="accidentPreFund">
          <el-input
            v-model="ruleForm.accidentPreFund"
            class="w280"
            placeholder="请输入服务费金额"
          ></el-input>
          <span class="ml10 color-red-F5222D">
            ( {{ accidentPreFundBig }} )
          </span>
        </el-form-item> -->
        <el-form-item label="服务机构" prop="serviceAgencyCode">
          <el-select
            v-model="ruleForm.serviceAgencyCode"
            class="w50"
            clearable
            filterable
            placeholder="请选择服务机构"
            @change="setServiceBranch"
          >
            <el-option
              v-for="(item, key) in tableList"
              :key="key"
              :label="item.nameAndLinkNameAndLinkPhone"
              :value="item.businessCode"
            ></el-option>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pagesize"
              layout="total, prev, pager, next"
              :total="totalnum"
            ></el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item label="项目服务说明" prop="remark">
          <el-input
            v-model="ruleForm.remark"
            class="w50"
            type="textarea"
            placeholder="请输入项目服务说明"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogVisible = false">取 消</el-button>
        <el-button type="warning" round @click="register">确认提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getServiceList } from '@/api/userDataManagement'
import { smalltoBIG } from '@/utils/validate'
import { addProject } from '@/api/accidentManagement'
import { updateProject } from '@/api/accidentManagement'
import { getProjectDetails } from '@/api/accidentManagement'
import { dateTest } from '@/utils/validate'
import {
  validateContractNo,
  validateProjectRemarks,
} from '@/utils/validateFrom'
import { baseMixin } from '@/mixins/baseMixins'
import { mapGetters } from 'vuex'
export default {
  name: 'ServiceAdd',
  components: {},
  mixins: [baseMixin],
  data() {
    return {
      dealDateStartOptions: this.beginDate(),
      dialogVisible: false,
      projectId: '',
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
        serviceAgencyId: '',
      },
      pagesize: 10,
      totalnum: 0,
      currentPage: 1,
      accidentPreFundBig: '零',
      userCode: '',
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '字符1-100位',
          },
        ],
        contractNo: [
          { required: true, message: '请输入合同编号', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '字符1-50位',
          },
        ],
        startTime: [
          {
            required: true,
            message: '请选择起期',
            trigger: 'change',
          },
        ],
        endTime: [
          {
            required: true,
            message: '请选择止期',
            trigger: 'change',
          },
        ],
        accidentPreFund: [
          { required: true, message: '请输入服务费金额', trigger: 'blur' },
        ],
        serviceAgencyCode: [
          { required: true, message: '请选择服务机构', trigger: 'change' },
        ],
        remark: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 500,
            message: '字符2-500位',
          },
        ],
      },
      tableList: [],
      startDate: {
        disabledDate: (time) => {
          if (this.ruleForm.endTime) {
            return time.getTime() > new Date(this.ruleForm.endTime).getTime()
          }
        },
      },
      endDate: {
        disabledDate: (time) => {
          if (this.ruleForm.startTime) {
            return (
              time.getTime() <
              new Date(this.ruleForm.startTime).getTime() - 8.64e7
            )
          }
        },
      },
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
    this.getServiceList()
  },
  methods: {
    initData(row) {
      this.dialogVisible = true
      this.projectId = row || ''
      // this.getNewData()
      this.getServiceList()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    async getServiceList() {
      let from = {
        pn: this.currentPage,
        ps: this.pagesize,
      }
      let res = await getServiceList(from)
      if (res.code === '0000') {
        this.totalnum = res.total
        this.tableList = res.list.map((item) => {
          return {
            ...item,
            nameAndLinkNameAndLinkPhone: `${item.orgName}   ${item.safetyCharger}  ${item.safetyChargerPhone}`,
          }
        })
        if (this.projectId) {
          this.initDataDetails(this.projectId)
        }
      }
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pagesize = val
      this.getServiceList()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getServiceList()
    },

    async initDataDetails(id) {
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
        this.$baseMessage('止起不能大于起期，请重新选择', 'error')
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
    // 设置路由
    async toThisTag() {
      this.dialogVisible = false
      this.$emit('successCb')
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
    // 处理选中服务机构
    setServiceBranch(e) {
      if (!e) {
        return
      }
      let { orgName, safetyCharger, safetyChargerPhone, id } =
        this.tableList.find((item) => item.businessCode == e)
      this.ruleForm.serviceAgencyName = orgName
      this.ruleForm.serviceAgencyId = id
      this.ruleForm.contactName = safetyCharger
      this.ruleForm.contactNum = safetyChargerPhone
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
    close() {
      this.clear()
    },
    clear() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.ruleForm.id = ''
      console.log(this.ruleForm)
    },
  },
}
</script>

<style scoped lang="scss">
#servicrAdd {
  margin: 10px;
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
  .w50 {
    width: 85%;
  }
}
</style>
