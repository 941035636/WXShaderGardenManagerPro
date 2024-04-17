<template>
  <div id="EnterpriseList">
    <div class="elsearch">
      <el-row class="row-bg" style="margin-bottom: 20px">
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患级别：</span>
            <el-select v-model="ruleForm.hiddenDangerRank" placeholder="请选择">
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
              v-model="ruleForm.discoverDepartment"
              :options="discoverDepartmentList"
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患状态：</span>

            <el-select
              v-model="ruleForm.companyIndystryIds"
              placeholder="请选择"
            >
              <el-option
                v-for="item in hiddenDangerState"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">发现日期：</span>
            <el-date-picker
              v-model="ruleForm.dateArray"
              class="w300"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患描述：</span>
            <el-input
              v-model="ruleForm.policyNo"
              size="small"
              class="w300"
              placeholder="请输入"
            />
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
          label="序号"
          min-width="20"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="隐患描述" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.hazardDescription }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发现人/发现部门" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.findUserName }}/{{ scope.row.findDeptName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发现日期" min-width="40" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.findTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="隐患级别" min-width="40" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.hazardLevel === '01'" style="color: #f9c182">
              {{ testIsValue(scope.row.hazardLevel) }}
            </div>
            <div v-if="scope.row.hazardLevel === '02'" style="color: red">
              {{ testIsValue(scope.row.hazardLevel) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="隐患状态" min-width="40" align="center">
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.nowFlow === '001' ||
                scope.row.nowFlow === '002' ||
                scope.row.nowFlow === '003' ||
                scope.row.nowFlow === '004'
              "
              style="color: #2a6edc"
            >
              {{ translate(scope.row.nowFlow) }}
            </div>
            <div v-if="scope.row.nowFlow === '005'" style="color: #71ca19">
              {{ translate(scope.row.nowFlow) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="40"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="operationClass">
              <el-button
                type="text"
                @click="examine(scope.row.batchId)"
                v-if="$hasBtn('rectifica-detail')"
              >
                查看
              </el-button>
              <div
                class="middle"
                v-if="
                  scope.row.nowFlow === '001' ||
                  scope.row.nowFlow === '002' ||
                  $hasBtn('rectifica-assign') ||
                  $hasBtn('rectifica-modify')
                "
              >
                |
              </div>
              <!-- <el-button
                type="text"
                v-if="$hasBtn('rectifica-assign')"
                @click="designate(scope.row)"
              >
                指派岗位
              </el-button> -->
              <el-button
                type="text"
                v-if="
                  scope.row.nowFlow === '001' && $hasBtn('rectifica-assign')
                "
                @click="designate(scope.row)"
              >
                指派岗位
              </el-button>
              <el-button
                type="text"
                @click="write(scope.row)"
                v-if="
                  scope.row.nowFlow === '002' && $hasBtn('rectifica-modify')
                "
              >
                填写整改
              </el-button>
              <!-- <el-button
                type="text"
                v-if="scope.row.flowType === '002'"
                @click="write"
              >
                修改整改
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

    <el-dialog title="隐患指派" width="40%" :visible.sync="designateShow">
      <div class="formClass">
        <el-form
          :model="dangerForm"
          :rules="dangerRule"
          ref="ruleForm1"
          label-width="160px"
        >
          <el-form-item label="隐患描述：" prop="hazardDescription">
            <el-input
              type="textarea"
              :rows="4"
              :disabled="true"
              placeholder="请输入"
              v-model="dangerForm.hazardDescription"
              maxlength="2400"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="整改部门：" prop="rectificationList">
            <el-cascader
              ref="nationalAddr"
              class="w280"
              :options="discoverDepartmentList"
              v-model.trim="dangerForm.rectificationList"
              disabled
              @change="userTypeChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="整改岗位：" prop="rectificationPostNo">
            <el-select
              v-model="dangerForm.rectificationPostNo"
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
          <el-form-item label="验收部门：" prop="acceptDeptNo">
            <el-cascader
              ref="nationalAddr"
              class="w280"
              :options="discoverDepartmentList"
              v-model.trim="dangerForm.acceptDeptNo"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <div class="formButtonClass">
        <div></div>
        <div class="buttonNameClass">
          <div class="cancel" style="cursor: pointer" @click="cancelClick1">
            取消
          </div>
          <div class="submit" style="cursor: pointer" @click="submitFill">
            确认提交
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="隐患整改" width="40%" :visible.sync="writeShow">
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="160px"
        >
          <el-form-item label="整改情况：" prop="condition">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入"
              v-model="ruleForm.condition"
              maxlength="2400"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="整改日期：" prop="TimeDate">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.TimeDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="上传整改附件：" prop="attachment">
            <Uploading @imageData="upAttachment" />
          </el-form-item>
        </el-form>
      </div>
      <div class="formButtonClass">
        <div></div>
        <div class="buttonNameClass">
          <div class="cancel" style="cursor: pointer" @click="cancelClick2">
            取消
          </div>
          <div class="submit" style="cursor: pointer" @click="rectification">
            确认提交
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRectificaList } from '@/api/rectificaApi'
import { getItems } from '@/api/user'
import { assign, rectification, getDangerParams } from '@/api/checkApi'
import Uploading from '../../components/uploading.vue'
import { sysDeptList, getPostByDept } from '@/api/branchManage'
const validateSecondLevel = (rule, value, callback) => {
  if (value.length === 2) {
    callback()
  } else {
    callback(new Error('部门必须确认到二级'))
  }
}
export default {
  components: {
    Uploading,
  },
  data() {
    return {
      pn: 1,
      ps: 10,
      total: 50,
      hiddenDangerRankList: [],
      discoverDepartmentList: [],
      hiddenDangerState: [],
      ruleForm: {
        hiddenDangerRank: '',
        discoverDepartment: [],
        hiddenDangerState: '',
        companyIndystryIds: '',
        dateArray: [],
        policyNo: '',
      },
      industryData: [],
      dataList: [],
      designateShow: false,
      writeShow: false,
      branchList: [],
      jobList: [],
      fileList: [],
      dangerForm: {
        hazardDescription: '', // 隐患描述
        rectificationList: [], // 整改部门集合（一二级）
        rectificationDeptNo: '', // 整改部门
        rectificationPostNo: '', // 整改岗位
        acceptDeptNo: '', // 验收部门
        id: '',
        batchId: '',
      },
      ruleForm: {
        id: '',
        batchId: '',
        condition: '',
        TimeDate: '',
        attachment: [],
      },
      ruleForm1: { describe: '', department: '', station: '', acceptance: '' },
      dangerRule: {
        rectificationPostNo: [
          { required: true, message: '请选择整改岗位', trigger: 'change' },
        ],
        acceptDeptNo: [
          { required: true, message: '请选择验收部门', trigger: 'change' },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ],
      },
      rules: {
        condition: [
          { required: true, message: '请输入整改情况', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '整改情况字符串长度2-1000字',
            trigger: 'blur',
          },
        ],
        TimeDate: [
          {
            type: 'date',
            required: true,
            message: '请选择整改日期',
            trigger: 'change',
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
      acceptDept: [],
    }
  },
  created() {
    this.getInit()
    this.getBranchList()
    this.getHiddenDangerRankList()
    this.getDiscoverDepartmentList()
    // this.getHiddenDangerState()
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
        if (res.key === e) {
          text = res.val
        }
      })
      return text
    },
    testIsValue(e) {
      let test = ''
      this.hiddenDangerRankList.forEach((item) => {
        if (item.itemValue === e) {
          test = item.itemText
        }
      })
      return test
    },
    async getHiddenDangerRankList() {
      let res = await getItems('50001')
      if (res.code === '0000') {
        this.hiddenDangerRankList = res.data
      }
    },
    // async getHiddenDangerState() {
    //   let res = await getItems('50004')
    //   if (res.code === '0000') {
    //     this.hiddenDangerState = res.data
    //   }
    // },
    async getDiscoverDepartmentList() {
      let res = await getDangerParams()
      if (res.code === '0000') {
        this.hiddenDangerState = res.data.flowTypes
        this.discoverDepartmentList = this.recursion1(res.data.findDept)
        this.acceptDept = this.setDiGuiDataObj(this.discoverDepartmentList)
      }
    },
    search() {
      ;(this.ps = 10), (this.pn = 1), this.getInit()
    },
    async getInit() {
      let data = {
        ps: this.ps,
        pn: this.pn,
        hazardDescription: this.ruleForm.policyNo, //隐患描述
        hazardFindTimeBe:
          this.ruleForm.dateArray && this.ruleForm.dateArray.length > 0
            ? this.ruleForm.dateArray[0] + ' 00:00:00'
            : '', //隐患发现日期开始时间
        hazardFindTimeLa:
          this.ruleForm.dateArray && this.ruleForm.dateArray.length > 0
            ? this.ruleForm.dateArray[1] + ' 23:59:59'
            : '', //隐患发现日期结束时间
        hazardState: this.ruleForm.companyIndystryIds || '', //隐患状态
        findDeptNo:
          this.ruleForm.discoverDepartment &&
          this.ruleForm.discoverDepartment.length > 0
            ? this.ruleForm.discoverDepartment[1]
            : '', //发现部门
        hazardLevel: this.ruleForm.hiddenDangerRank, //隐患级别
      }
      let res = await getRectificaList(data)
      if (res.code === '0000') {
        this.total = res.data.total
        this.dataList = res.data.records
      }
    },
    async getBranchList() {
      let data = {
        createBy: '',
        createTime: '',
      }
      let res = await sysDeptList(data)
      if (res.code == '0000') {
        this.branchList = res.data
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
    async getOrgList(code, key) {
      // 获取部门下的岗位信息
      let res = await getPostByDept(code)
      if (res.code == '0000') {
        this.jobList = res.data
        this.dangerForm.rectificationPostNo = key
      }
    },
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          this.getTreeData(data[i].children)
        }
      }
      return data
    },
    userTypeChange(val) {
      // 选中部门
      this.dangerForm.rectificationTopDeptNo = val[0]
      this.dangerForm.rectificationDeptNo = val[val.length - 1]
      this.dangerForm.rectificationPostNo = ''
      this.getOrgList(this.dangerForm.rectificationDeptNo)
    },
    submitFill() {
      this.$refs['ruleForm1'].validate((valid) => {
        if (valid) {
          this.assign()
        }
      })
    },
    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].children) {
          obj[list[i].deptNo] = list[i].deptName
          this.setDiGuiDataObj(list[i].children, obj)
        } else {
          obj[list[i].deptNo] = list[i].deptName
        }
      }
      return obj
    },
    async assign() {
      let rectificationPostTest = ''
      this.jobList.forEach((item) => {
        if (item.postNo === this.dangerForm.rectificationPostNo) {
          rectificationPostTest = item.postName
        }
      })
      let data = {
        batchId: this.dangerForm.batchId,
        id: this.dangerForm.id,
        rectificationPostNo: this.dangerForm.rectificationPostNo,
        rectificationPostName: rectificationPostTest,
        acceptDeptNoTop: this.dangerForm.acceptDeptNo[0],
        acceptDeptNoTopName: this.acceptDept[this.dangerForm.acceptDeptNo[1]],
        acceptDeptNo: this.dangerForm.acceptDeptNo[1],
        acceptDeptName: this.acceptDept[this.dangerForm.acceptDeptNo[1]],
      }
      let res = await assign(data)
      if (res.code === '0000') {
        this.designateShow = false
        this.getInit()
        this.$message({
          message: '指派岗位成功',
          type: 'success',
        })
      }
    },
    reset() {
      this.ps = 10
      this.pn = 1
      this.ruleForm.policyNo = ''
      this.ruleForm.dateArray = []
      this.ruleForm.companyIndystryIds = ''
      this.ruleForm.discoverDepartment = []
      this.ruleForm.hiddenDangerRank = ''
      this.getInit()
    },
    Upload() {},
    beforeAvatarUpload() {},
    fileChange() {},
    fileRemove() {},
    onExceed() {},
    handleCurrentChange(e) {
      this.pn = e
      this.getInit()
    },
    examine(e) {
      this.$router.push({
        name: 'abarbeitungParticulars',
        query: {
          batchId: e,
        },
      })
    },
    cancelClick2() {
      this.writeShow = false
    },
    write(e) {
      this.writeShow = true
      this.ruleForm.id = e.id
      this.ruleForm.batchId = e.batchId
    },
    rectification() {
      this.$refs.ruleForm.validate((e) => {
        if (e) {
          this.$confirm(
            '提交后，整改信息将不可变更，请确认！',
            '确认整改信息',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }
          )
            .then(() => {
              this.writeAbarbeitung()
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交',
              })
            })
        }
      })
    },
    async writeAbarbeitung() {
      let data = {
        rectificationRemark: this.ruleForm.condition,
        rectificationTime: this.ruleForm.TimeDate,
        rectificationFileIds: this.ruleForm.attachment,
        id: this.ruleForm.id,
        batchId: this.ruleForm.batchId,
      }
      let res = await rectification(data)
      if (res.code === '0000') {
        this.writeShow = false
        this.getInit()
        this.$message({
          message: '填写整改成功',
          type: 'success',
        })
      }
    },
    cancelClick1() {
      this.designateShow = false
    },
    designate(e) {
      this.dangerForm.id = e.id
      this.dangerForm.hazardDescription = e.hazardDescription
      this.dangerForm.rectificationList = e.rectificationDeptNo
      this.dangerForm.acceptDeptNo = [e.acceptDeptNoTop, e.acceptDeptNo]
      this.dangerForm.batchId = e.batchId
      this.getOrgList(e.rectificationDeptNo, e.rectificationPostNo)
      this.designateShow = true
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
    width: 300px !important;
  }
  .el-cascader {
    width: 300px;
  }
}
</style>