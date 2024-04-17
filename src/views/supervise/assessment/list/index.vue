<template>
  <div id="assessmentList">
    <div class="elsearch">
      <el-row class="row-bg" :gutter="20">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">评估时间：</span>
            <el-date-picker
              v-model="dateArray"
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
          <div style="display: flex">
            <span class="item3">评估类型：</span>
            <el-select
              v-model="form.superviseType"
              filterable
              class="w400"
              placeholder="请选择"
            >
              <el-option
                v-for="item in assessTypeEnum"
                :key="item.strCode"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="评估项目委托单位：" />
            <el-input
              v-model="form.superviseCompany"
              class="w300"
              minlength="2"
              maxlength="100"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select
              v-model="form.dataStatus"
              filterable
              class="w300"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dataStatusEnum"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="ml20 text-center">
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button
        v-if="$hasBtn('assessment-add')"
        type="primary"
        size="small"
        @click="add"
      >
        新增
      </el-button>
    </div>
    <div class="table-list">
      <el-row class="el-row">
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <el-col :span="14" style="text-align: right"></el-col>
      </el-row>
      <div class="mt20">
        <el-table
          header-row-class-name="tableHead"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="name"
            show-overflow-tooltip
            label="评估项目名称"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="superviseType"
            label="评估类型"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="superviseTime"
            show-overflow-tooltip
            label="评估时间"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="superviseCompany"
            show-overflow-tooltip
            label="评估项目委托单位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="exploitingWorkUnit"
            show-overflow-tooltip
            label="评估项目实施单位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="updateTime"
            show-overflow-tooltip
            label="操作日期"
          ></el-table-column>
          <el-table-column align="center" prop="dataStatus" label="状态">
            <template slot-scope="scope">
              <el-switch
                active-color="#13ce66"
                :value="scope.row.dataStatus"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="switchChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  v-if="$hasBtn('assessment-detail')"
                  type="text"
                  size="small"
                  class="detailBtn"
                  @click="check(scope.row)"
                >
                  查看
                </el-button>
                <el-dropdown trigger="click">
                  <el-button type="text" class="moreBtn ml20">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="$hasBtn('assessment-edit')"
                      class="updateBtn"
                      @click.native="edit(scope.row)"
                    >
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$hasBtn('assessment-del')"
                      class="deleteBtn"
                      @click.native="del(scope.row)"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="form.pn"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <Details ref="Details" />
    <Add ref="Add" @successCb="getAssessmentList" />
  </div>
</template>
<!--  -->
<script>
import {
  getAssessmentList,
  delAssessment,
  updateAssessment,
} from '@/api/supervise.js'
import Label1 from '@/components/label/index'
import Details from '../detail/Details.vue'
import Add from '../add/add.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'AssessmentList',
  components: { Label1, Details, Add },
  data() {
    return {
      dataStatusEnum: [], // 状态
      assessTypeEnum: [], // 评估类型
      timer: '',
      total: 10, // 分页
      tableData: [],
      dateArray: [],
      form: {
        desc: 'true', // 是否为倒序
        name: '',
        dataStatus: null,
        orderby: '', // 排序字段
        pn: 1,
        ps: 10,
        superviseCompany: '',
        superviseType: '',
        superviseStartTime: null,
        superviseEndTime: null,
      },
    }
  },
  computed: {
    ...mapGetters({
      visitedRoutes: 'tabsBar/visitedRoutes',
      enumData: 'enums/getStrEnumAll',
    }),
  },
  activated() {
    this.getAssessmentList()
  },
  created() {
    this.init()
  },
  methods: {
    timeBlur(val) {},
    // 初始化
    init() {
      this.getAssessmentList()
      this.dataStatusEnum = this.enumData.DataStatusEnum // 状态
      this.assessTypeEnum = this.enumData.AssessTypeEnum // 评估类型
    },
    // 新增评估
    add() {
      // this.$router.push({
      //   path: 'addAssessment',
      // })
      this.$refs.Add.initData()
    },
    // 删除评估
    async delAssessment(id) {
      let { code } = await delAssessment(id)
      if (code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.getAssessmentList()
      }
    },
    del(val) {
      let text = '确定要删除吗？'
      this.$baseConfirm(text, '', () => {
        this.delAssessment(val.id)
      })
    },
    // 修改评估
    async updateAssessment(val) {
      let status = val.dataStatus === 1 ? 0 : 1
      let { code } = await updateAssessment(val.id, {
        dataStatus: status,
      })
      if (code === '0000') {
        this.getAssessmentList()
      }
    },
    // 状态更改
    switchChange(val) {
      let text = '确定要启用吗？'
      if (val.dataStatus === 1) {
        text = '确认要禁用吗？'
      }
      this.$baseConfirm(text, '', () => {
        this.updateAssessment(val)
      })
    },
    // 获取评估列表 默认返回 10条/根据条件查询
    async getAssessmentList() {
      let { code, total, list } = await getAssessmentList(this.form)
      if (code === '0000') {
        this.total = total
        let newList = list.map((item) => {
          if (
            this.assessTypeEnum.find((it) => item.superviseType === it.strCode)
          ) {
            return {
              ...item,
              superviseTime: item.superviseTime.split(' ')[0],
              superviseType: this.assessTypeEnum.find(
                (it) => it.strCode === item.superviseType
              ).label,
            }
          }
        })
        this.tableData = newList
      }
    },
    // 分页变更
    handleCurrentChange(val) {
      this.form.pn = val
      this.getAssessmentList()
    },
    // 编辑评估
    edit(val) {
      this.$refs.Add.initData(val)
    },
    // 查看详情
    check(val) {
      // this.$router.push({
      //   path: 'assessmentDetail',
      //   query: {
      //     id: val.id,
      //   },
      // })
      this.$refs.Details.initData(val)
    },
    // 搜索
    search() {
      this.form.superviseStartTime =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.form.superviseEndTime =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      this.getAssessmentList()
    },

    // 重置
    reset() {
      this.dateArray = []
      this.form = {
        desc: 'true',
        name: '',
        dataStatus: '',
        orderby: '',
        pn: 1,
        ps: 10,
        superviseCompany: '',
        superviseType: '',
        complainStartTime: null,
        complainEndTime: null,
      }
      this.getAssessmentList()
    },
  },
}
</script>

<style lang="scss" scoped>
#assessmentList {
  .row-bg {
    margin-bottom: 20px;
    line-height: 40px;
  }

  .table-list {
    margin: 20px;
  }

  .operation {
    text-align: center;
    span {
      padding: 0 5px;
    }
  }
  .bname .el-form-item {
    margin-bottom: 0;
  }
}
</style>
<style>
/* html body .el-table td .cell, html body .el-table th .cell */
html body .el-table .tableHead .cell {
  font-weight: 800;
}
#assessmentList .el-form-item--small.el-form-item {
  width: 86%;
}
/* #assessmentList .el-form-item--small .el-form-item__content {
  width: 100%;
  margin-left: 0 !important;
} */
html body .el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
</style>
