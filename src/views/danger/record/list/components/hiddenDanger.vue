<template>
  <div>
    <div class="elsearch">
      <el-row class="row-bg" style="margin-bottom: 20px">
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">发现部门：</span>
            <el-cascader
              class="w280"
              v-model="ruleForm.discoverDepartment"
              :options="discoverDepartmentList"
              clearable
            ></el-cascader>
          </div>
        </el-col>

        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">发现人：</span>
            <el-input
              v-model="ruleForm.findUserName"
              size="small"
              class="w280"
              placeholder="请输入"
              clearable
            />
          </div>
        </el-col>

        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患状态：</span>

            <el-select
              class="w280"
              v-model="ruleForm.companyIndystryIds"
              placeholder="请选择"
              clearable
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
      </el-row>
      <el-row class="row-bg" style="margin-bottom: 20px">
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患描述：</span>
            <el-input
              v-model="ruleForm.policyNo"
              size="small"
              class="w280"
              placeholder="请输入"
              clearable
            />
          </div>
        </el-col>

        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患级别：</span>
            <el-select
              class="w280"
              v-model="ruleForm.hiddenDangerRank"
              placeholder="请选择"
              clearable
            >
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
            <span class="item3">发现日期：</span>
            <el-date-picker
              v-model="ruleForm.dateArray"
              class="w280"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>

      <div class="ml20 text-center">
        <el-button class="ml20" type="primary" shape="round" @click="getInit">
          查询
        </el-button>

        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
      </div>
    </div>

    <div class="mt8">
      <div class="numberOfBranches">
        <div>共{{ total }}条记录</div>
        <!-- <div class="buttonClass" style="cursor: pointer">导出</div> -->
      </div>
      <el-table
        :data="dataList"
        border
        header-row-class-name="headName"
        :header-cell-style="getRowClass"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="隐患描述" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.hazardDescription }}</div>
          </template>
        </el-table-column>
        <el-table-column label="隐患级别" min-width="40" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.hazardLevel === '01'" style="color: #fbaa48">
              {{ testIsValue(scope.row.hazardLevel) }}
            </div>
            <div v-if="scope.row.hazardLevel === '02'" style="color: #f12530">
              {{ testIsValue(scope.row.hazardLevel) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="隐患状态" min-width="40" align="center">
          <template slot-scope="scope">
            <div style="color: #64b835" v-if="scope.row.hazardState === '005'">
              {{ translate(scope.row.hazardState) }}
            </div>
            <div style="color: #1784fc" v-else>
              {{ translate(scope.row.hazardState) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发现部门" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.findDeptName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发现人" min-width="40" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.findUserName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发现日期" min-width="40" align="center">
          <template slot-scope="scope">
            <div>{{ disposeDate(scope.row.hazardFindTime) }}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          min-width="40"
        >
          <template slot-scope="scope">
            <div
              style="cursor: pointer"
              class="examineClass"
              @click="examine(scope.row.batchId)"
            >
              查看
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { sysDeptList } from '@/api/branchManage'
import { getItems } from '@/api/user'
import { hazardRecords } from '@/api/listManage'
export default {
  data() {
    return {
      ruleForm: {
        ps: 10,
        pn: 1,
        policyNo: '', //隐患描述
        dateArray: [], //发现日期
        companyIndystryIds: '', //隐患状态
        discoverDepartment: [], //发现部门
        hiddenDangerRank: '', //隐患级别
        findUserName: '', //发现人
      },
      industryData: [],
      dataList: [{ id: 1, name: '测试数据' }],
      total: 20,

      discoverDepartmentList: [], //部门集合
      hiddenDangerRankList: [], //隐患级别
      hiddenDangerState: [], //隐患状态
    }
  },
  created() {
    this.initData()
  },

  methods: {
    examineClick(e) {
      this.$router.push({
        name: 'particulars',
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
    tapClick(e) {
      this.tapPitchOn = e.key
    },
    disposeDate(e) {
      if (e) {
        return e.slice(0, 10)
      } else {
        return '——'
      }
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

    // 初始化页面
    async initData() {
      await this.getDiscoverDepartmentList()
      await this.getHiddenDangerRankList()
      await this.getHiddenDangerState()
      await this.getInit()
    },
    // 部门集合
    async getDiscoverDepartmentList() {
      let data = {
        createBy: '',
        createTime: '',
      }
      let res = await sysDeptList(data)
      if (res.code === '0000') {
        this.discoverDepartmentList = this.recursion1(res.data)
      }
    },

    // 隐患级别
    async getHiddenDangerRankList() {
      let res = await getItems('50001')
      if (res.code === '0000') {
        this.hiddenDangerRankList = res.data
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

    // 隐患状态
    async getHiddenDangerState() {
      let res = await getItems('50004')
      if (res.code === '0000') {
        this.hiddenDangerState = res.data
      }
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

    // 查看
    examine(e) {
      this.$router.push({
        name: 'abarbeitungParticulars',
        query: {
          batchId: e,
        },
      })
    },

    // 重置
    reset() {
      this.ruleForm = {
        ps: 10,
        pn: 1,
        policyNo: '', //隐患描述
        dateArray: [], //发现日期
        companyIndystryIds: '', //隐患状态
        discoverDepartment: [], //发现部门
        hiddenDangerRank: '', //隐患级别
        findUserName: '', //发现人
      }
      this.getInit()
    },

    async getInit() {
      let data = {
        ps: this.ruleForm.ps,
        pn: this.ruleForm.pn,
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
        findUserName: this.ruleForm.findUserName || '', //发现人
      }
      let res = await hazardRecords(data)
      if (res.code === '0000') {
        this.total = res.data.total
        this.dataList = res.data.records
      } else {
        this.dataList = []
        this.total = res.data.total || 0
      }
    },
    handleCurrentChange(e) {
      this.ruleForm.pn = e
      this.getInit()
    },
  },
}
</script>
<style lang="scss" scoped>
.numberOfBranches {
  display: flex;
  align-items: center;
  height: 60px;
  .buttonClass {
    background-color: #ffa940;
    width: 85px;
    height: 35px;
    border-radius: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    color: #fff;
    font-weight: 500;
  }
}
.examineClass {
  color: #1990ff;
}
</style>