<template>
  <div id="EnterpriseList">
    <div class="elsearch">
      <el-row class="row-bg" style="margin-bottom: 20px">
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患级别：</span>
            <el-select v-model="inquireCondition.rank" placeholder="请选择">
              <el-option
                v-for="item in hiddenDangerRankList"
                :key="item.itemValue"
                :label="item.itemText"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">发现部门：</span>
            <el-cascader
              v-model="inquireCondition.discoverDepartment"
              :options="discoverDepartmentList"
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">整改部门：</span>
            <el-cascader
              v-model="inquireCondition.abarbeitungDepartment"
              :options="discoverDepartmentListB"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患描述：</span>
            <el-input
              v-model="inquireCondition.describe"
              size="small"
              class="w300"
              placeholder="请输入"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患状态：</span>
            <el-select
              v-model="inquireCondition.hiddenState"
              placeholder="请选择"
            >
              <el-option
                v-for="item in hiddenDangerState"
                :key="item.itemValue"
                :label="item.itemText"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button class="ml20" type="primary" shape="round" @click="search">
            查询
          </el-button>
          <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="mt8">
      <div class="numberOfBranches">共{{ total }}条记录</div>
      <el-table
        :data="dataList"
        border
        header-row-class-name="headName"
        :header-cell-style="getRowClass"
      >
        <el-table-column
          type="index"
          min-width="20"
          align="center"
        ></el-table-column>
        <el-table-column label="隐患描述" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.hazardDescription }}</div>
          </template>
        </el-table-column>
        <el-table-column label="隐患级别" min-width="40" align="center">
          <template slot-scope="scope">
            <div style="color: red" v-if="scope.row.hazardLevel === '02'">
              {{ translate1(scope.row.hazardLevel) }}
            </div>
            <div style="color: #f6ae43" v-if="scope.row.hazardLevel === '01'">
              {{ translate1(scope.row.hazardLevel) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发现人/发现部门" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.findUserName + '/' + scope.row.findDeptName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="整改人/整改部门" align="center">
          <template slot-scope="scope">
            <div>
              {{
                (scope.row.rectificationUserName || '——') +
                '/' +
                (scope.row.rectificationDeptNo
                  ? scope.row.rectificationDeptName
                  : '——')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="隐患状态" min-width="40" align="center">
          <template slot-scope="scope">
            <div style="color: #64b835" v-if="scope.row.nowFlow === '005'">
              {{ translate(scope.row.nowFlow) }}
            </div>
            <div style="color: #1784fc" v-else>
              {{ translate(scope.row.nowFlow) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="40"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="operationClass">
              <el-button type="text" @click="examine(scope.row.batchId)">
                查看
              </el-button>
              <div
                class="middle"
                v-if="
                  scope.row.nowFlow === '003' ||
                  scope.row.nowFlow === '004' ||
                  $hasBtn('accep-assign') ||
                  $hasBtn('accep-check')
                "
              >
                |
              </div>
              <el-button
                type="text"
                v-if="scope.row.nowFlow === '003' && $hasBtn('accep-assign')"
                @click="designate(scope.row)"
              >
                指派岗位
              </el-button>
              <el-button
                type="text"
                v-if="scope.row.nowFlow === '004' && $hasBtn('accep-check')"
                @click="acceptanceCheck(scope.row)"
              >
                验收
              </el-button>
              <!-- <el-button type="text" v-if="scope.row.flowType === '005'">
                修改
              </el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog
      title="隐患验收"
      :visible.sync="acceptanceCheckShow"
      @close="onClose"
    >
      <div class="formClass">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="160px"
        >
          <el-form-item label="是否合格：" prop="whether">
            <div class="whetherClass">
              <div
                style="border-left: 1px solid #1684fc"
                class="whetherItemClass"
                :class="ruleForm.whether == '1' ? 'poItemClass' : ''"
                @click="poItemClick('1')"
              >
                是
              </div>
              <div
                class="whetherItemClass"
                :class="ruleForm.whether == '0' ? 'poItemClass' : ''"
                @click="poItemClick('0')"
              >
                否
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="打回步骤："
            prop="rollback"
            v-if="ruleForm.whether == '0'"
          >
            <div class="whetherClass">
              <div
                style="border-left: 1px solid #1684fc"
                class="whetherItemClass"
                :class="ruleForm.rollback == '1' ? 'poItemClass' : ''"
                @click="rollbackClick('1')"
              >
                确认指派
              </div>
              <div
                class="whetherItemClass"
                :class="ruleForm.rollback == '2' ? 'poItemClass' : ''"
                @click="rollbackClick('2')"
              >
                隐患整改
              </div>
            </div>
          </el-form-item>
          <el-form-item label="验收描述：" prop="describe">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入"
              v-model="ruleForm.describe"
              maxlength="1000"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="上传附件：" prop="attachment">
            <Uploading @imageData="upAttachment" />
          </el-form-item>
        </el-form>
      </div>
      <div class="formButtonClass">
        <div></div>
        <div class="buttonNameClass">
          <div class="cancel" style="cursor: pointer" @click="cancelClick">
            取消
          </div>
          <div class="submit" style="cursor: pointer" @click="submitClick">
            确认提交
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="验收指派" :visible.sync="designateStationShow">
      <div class="formClass">
        <el-form
          :model="designateStationForm"
          :rules="designateStationRules"
          ref="designateStationForm"
          label-width="160px"
        >
          <el-form-item label="整改情况：" prop="condition">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入"
              v-model="designateStationForm.condition"
              maxlength="2400"
              disabled
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="验收部门：" prop="department">
            <el-cascader
              ref="nationalAddr"
              class="w280"
              :options="discoverDepartmentList1"
              v-model.trim="designateStationForm.department"
              disabled
            ></el-cascader>
          </el-form-item>
          <el-form-item label="验收岗位：" prop="station">
            <el-select
              v-model="designateStationForm.station"
              class="w280"
              filterable
              placeholder="请选择岗位"
            >
              <el-option
                v-for="item in jobList"
                :key="item.postNo"
                :label="item.postName"
                :value="item.postNo"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="formButtonClass">
        <div></div>
        <div class="buttonNameClass">
          <div
            class="cancel"
            style="cursor: pointer"
            @click="esignateStationClick"
          >
            取消
          </div>
          <div
            class="submit"
            style="cursor: pointer"
            @click="esignateStationAffirm"
          >
            确认提交
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCheckList,
  acceptanceCheckCheckNoPass,
  acceptanceCheckCheckPass,
  checkAssign,
  getFindParams,
} from '@/api/checkApi'
import { getPostByDept, getByEntNo } from '@/api/branchManage'
import { getItems } from '@/api/user'
import Uploading from '../../components/uploading.vue'

export default {
  components: {
    Uploading,
  },
  data() {
    return {
      ruleForm: {
        name: '',
        policyNo: '',
        companyIndystryIds: '',
      },
      fileList: [],
      beforeAvatarUpload: [],
      industryData: [],
      dataList: [],
      total: 20,
      ps: 10,
      pn: 1,
      acceptanceCheckShow: false,
      ruleForm: {
        batchId: '',
        id: '',
        whether: '',
        rollback: '',
        describe: '',
        attachment: [],
      },
      rules: {
        whether: [
          { required: true, message: '请选择是否合格', trigger: 'change' },
        ],
        rollback: [
          { required: true, message: '请选择打会步骤', trigger: 'change' },
        ],
        describe: [
          { required: true, message: '请输入验收描述', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '验收描述字符串长度2-1000字',
            trigger: 'blur',
          },
        ],
        attachment: [
          {
            required: true,
            validator: this.validateAttachment,
            trigger: 'blur',
          },
        ],
      },
      designateStationShow: false,
      discoverDepartmentList: [],
      discoverDepartmentListB: [],
      discoverDepartmentList1: [],
      discoverDepartmentListB1: [],
      jobList: [],
      designateStationForm: {
        id: '',
        batchId: '',
        condition: '',
        department: [],
        station: '',
      },
      designateStationRules: {
        condition: [
          { required: true, message: '请输入整改情况', trigger: 'blur' },
          {
            min: 1,
            max: 2400,
            message: '最多2400个字符',
            trigger: 'blur',
          },
        ],
        department: [
          { required: true, message: '请选择验收岗位', trigger: 'change' },
        ],
        station: [
          { required: true, message: '请选择验收岗位', trigger: 'change' },
        ],
      },
      hiddenDangerRankList: [],
      hiddenDangerState: [],
      inquireCondition: {
        rank: '', //级别
        discoverDepartment: [], //发现部门
        abarbeitungDepartment: [], //整改部门
        describe: '', //隐患描述
        hiddenState: '', //隐患状态
      },
    }
  },
  created() {
    this.init()
    this.getDiscoverDepartmentList()
    this.sysDeptList()
    this.getHiddenDangerRankList()
    this.getHiddenDangerState()
  },
  methods: {
    validateAttachment(rule, value, callback) {
      if (this.ruleForm.attachment.length > 0) {
        callback()
      } else {
        callback(new Error('请上传整改附件'))
      }
    },
    upAttachment(e) {
      this.ruleForm.attachment = e
    },
    translate(e) {
      let text = '——'
      this.hiddenDangerState.forEach((res) => {
        if (res.itemValue === e) {
          text = res.itemText
        }
      })
      return text
    },
    translate1(e) {
      let text = '——'
      this.hiddenDangerRankList.forEach((res) => {
        if (res.itemValue === e) {
          text = res.itemText
        }
      })
      return text
    },
    search() {
      ;(this.ps = 10), (this.pn = 1), this.init()
    },
    reset() {
      this.inquireCondition.rank = ''
      this.inquireCondition.discoverDepartment = []
      this.inquireCondition.abarbeitungDepartment = []
      this.inquireCondition.describe = ''
      this.inquireCondition.hiddenState = ''
      this.init()
    },
    async getHiddenDangerState() {
      let res = await getItems('50005')
      if (res.code === '0000') {
        this.hiddenDangerState = res.data
      }
    },
    async getHiddenDangerRankList() {
      let res = await getItems('50001')
      if (res.code === '0000') {
        this.hiddenDangerRankList = res.data
      }
    },
    esignateStationAffirm() {
      this.$refs['designateStationForm'].validate((res) => {
        this.checkAssign()
      })
    },
    async checkAssign() {
      let acceptPostName = ''
      this.jobList.forEach((e) => {
        if (e.postNo === this.designateStationForm.station) {
          acceptPostName = e.postName
        }
      })
      let data = {
        acceptPostName: acceptPostName,
        acceptPostNo: this.designateStationForm.station,
        batchId: this.designateStationForm.batchId,
        id: this.designateStationForm.id,
      }
      let res = await checkAssign(data)
      if (res.code === '0000') {
        this.designateStationShow = false
        this.$message({
          message: '指派成功',
          type: 'success',
        })
        this.init()
      }
    },
    esignateStationClick() {
      this.designateStationShow = false
    },
    async getOrgList(code) {
      // 获取部门下的岗位信息
      let res = await getPostByDept(code)
      if (res.code == '0000') {
        this.jobList = res.data
      }
    },
    recursion1(data) {
      data.forEach((e) => {
        e.label = e.deptName
        e.value = e.deptNo
        if (e.children && e.children.length > 0) {
          this.recursion1(e.children)
        } else {
          e.children = undefined
        }
      })
      return data
    },
    async getDiscoverDepartmentList() {
      let res = await getFindParams()
      if (res.code === '0000') {
        console.log(res, '1-1=1=-12=-1-23=21-3=-12=3-12=3-12=-3=1-23=21')
        this.discoverDepartmentList = this.recursion1(res.data.findDeptList)
        this.discoverDepartmentListB = this.recursion1(
          res.data.rectificationDeptNoList
        )
      }
    },
    async sysDeptList() {
      let No = window.sessionStorage.getItem('enpNo')
      let res = await getByEntNo(No)
      if (res.code === '0000') {
        console.log(res, 'resresresresresresres')
        this.discoverDepartmentList1 = this.recursion1(res.data)
        this.discoverDepartmentListB1 = this.recursion1(res.data)
      }
    },
    designate(e) {
      this.designateStationForm.condition = e.rectificationRemark
      this.designateStationForm.department = [e.acceptDeptNoTop, e.acceptDeptNo]
      this.designateStationForm.id = e.id
      this.designateStationForm.batchId = e.batchId
      this.getOrgList(e.acceptDeptNo)
      this.designateStationShow = true
    },
    submitClick() {
      if (this.ruleForm.whether == '0') {
        this.rules.rollback = [
          { required: true, message: '请选择打会步骤', trigger: 'change' },
        ]
      } else {
        this.rules.rollback = []
      }
      this.$refs['ruleForm'].validate((res) => {
        if (res) {
          if (this.ruleForm.whether === '1') {
            //是
            this.acceptanceCheckCheckPass()
          } else {
            this.acceptanceCheckCheckNoPass()
          }
        }
      })
    },
    async acceptanceCheckCheckPass() {
      let data = {
        id: this.ruleForm.id,
        batchId: this.ruleForm.batchId,
        acceptRemark: this.ruleForm.describe,
        rectificationProgrammeFileIds: this.ruleForm.attachment,
      }
      let res = await acceptanceCheckCheckPass(data)
      if (res.code === '0000') {
        this.$message({
          message: '验收成功',
          type: 'success',
        })
        this.acceptanceCheckShow = false
        this.init()
      }
    },
    async acceptanceCheckCheckNoPass() {
      let data = {
        id: this.ruleForm.id,
        returnStep: this.ruleForm.rollback,
        batchId: this.ruleForm.batchId,
        acceptRemark: this.ruleForm.describe,
        rectificationProgrammeFileIds: this.ruleForm.attachment,
      }
      let res = await acceptanceCheckCheckNoPass(data)
      if (res.code === '0000') {
        this.$message({
          message: '验收成功',
          type: 'success',
        })
        this.acceptanceCheckShow = false
        this.init()
      }
    },
    async init() {
      let data = {
        hazardLevel: this.inquireCondition.rank,
        findDeptNo: this.inquireCondition.discoverDepartment[1],
        rectificationDeptNo: this.inquireCondition.abarbeitungDepartment[1],
        hazardDescription: this.inquireCondition.describe,
        hazardState: this.inquireCondition.hiddenState,
        ps: this.ps,
        pn: this.pn,
      }
      let res = await getCheckList(data)
      if (res.code === '0000') {
        this.dataList = res.data.records
        this.total = res.data.total
      }
    },
    poItemClick(e) {
      this.ruleForm.whether = e
    },
    rollbackClick(e) {
      this.ruleForm.rollback = e
    },
    acceptanceCheck(e) {
      this.ruleForm.id = e.id
      this.ruleForm.batchId = e.batchId
      this.acceptanceCheckShow = true
    },
    onClose() {
      this.acceptanceCheckShow = false
    },
    cancelClick() {
      this.acceptanceCheckShow = false
    },
    handleCurrentChange(e) {
      this.pn = e
      this.init()
    },
    examine(e) {
      // this.$router.push({
      //   name: 'checkAndAccParticulars',
      // })

      this.$router.push({
        name: 'abarbeitungParticulars',
        query: {
          batchId: e,
        },
      })
    },
    changeIns() {
      // console.log(this.ruleForm.companyIndystryIds)
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
    },
    Upload() {},
    fileRemove() {},
    onExceed() {},
    fileChange() {},
  },
}
</script>
<style lang="scss" scoped>
#EnterpriseList {
  padding: 30px;
  .numberOfBranches {
    line-height: 60px;
    font-size: 14px;
  }
  .operationClass {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0f54a9;
    .middle {
      margin: 0 10px;
    }
  }
  .formClass {
    width: 100%;
    .whetherClass {
      width: 180px;
      height: 32px;
      display: flex;
      .whetherItemClass {
        width: 140px;
        height: 30px;
        border-top: 1px solid #1684fc;
        border-bottom: 1px solid #1684fc;
        border-right: 1px solid #1684fc;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #1684fc;
      }
      .poItemClass {
        background-color: #1684fc;
        color: #fff;
        font-weight: 500;
      }
    }
  }
  .formButtonClass {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .buttonNameClass {
      width: 260px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cancel {
        width: 100px;
        height: 35px;
        background-color: #f5f5f5;
        border-radius: 19px;
        border: 1px solid #bbbbbb;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .submit {
        width: 130px;
        height: 35px;
        background-color: #ffa940;
        color: #fff;
        border-radius: 19px;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .el-select {
    width: 300px;
  }
  .el-cascader {
    width: 300px;
  }
}
</style>