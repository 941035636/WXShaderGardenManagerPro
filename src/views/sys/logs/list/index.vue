<template>
  <div id="logsList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">操作类型：</span>
            <el-select
              v-model="form.bizType"
              class="w300"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in operationOptions"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">操作时间：</span>
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
            <Label1 long="操作人姓名：" />
            <el-input
              v-model="form.operatorName"
              class="w300"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="操作人账号：" />
            <el-input
              v-model="form.operatorAccount"
              class="w300"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="数据编号" />
            <el-input
              v-model="form.bizId"
              class="w300"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
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
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="getRowClass"
        >
          <el-table-column label="操作时间/IP">
            <template slot-scope="scope">
              <div>{{ scope.row.operateDate }}</div>
              <div>
                <span>IP：</span>
                {{ scope.row.requestIp }}
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作人">
            <template slot-scope="scope">
              <div>
                {{ scope.row.operatorName }}
                <span v-if="scope.row.operatorAccount">
                  ({{ scope.row.operatorAccount }})
                </span>
              </div>
              <div>
                <span>数据编号：</span>
                {{ scope.row.bizId }}
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="用户行为">
            <template slot-scope="scope">
              <div>
                {{ scope.row.bizType }}
                <span v-if="scope.row.tag">/</span>
                {{ scope.row.tag }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200" label="操作结果">
            <template slot-scope="scope">
              <span v-if="scope.row.success" class="color-blue">成功</span>
              <span v-else class="color-FF9228">失败</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作详情">
            <template slot-scope="scope">
              <span v-if="scope.row.success">
                {{ scope.row.msg }}
              </span>
              <span v-else>{{ scope.row.exception }}</span>
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
  </div>
</template>

<script>
import { getLogsList } from '@/api/Logs.js'
import Label1 from '@/components/label/index'
export default {
  name: 'LogsList',
  components: { Label1 },
  data() {
    return {
      operationOptions: [],
      rewardsType: [],
      dataType: [],
      dateArray: [],
      DataStatusEnum: [], // 状态 有效 无效
      stateValue: '',
      // 分页
      total: 0,
      tableData: [],
      form: {
        bizId: '',
        bizType: '',
        desc: true,
        operateDateBegin: '',
        operateDateEnd: '',
        operatorAccount: '',
        operatorId: '',
        operatorName: '',
        orderby: '',
        pn: 1,
        ps: 10,
        requestIp: '',
      },
    }
  },
  computed: {},
  activated() {
    this.getLogsList()
  },
  created() {
    this.init()
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;color:#000;'
      } else {
        return ''
      }
    },
    // 初始化
    init() {
      this.getLogsList()
      this.operationOptions = [
        '登录模块',
        '保单管理',
        '理赔管理',
        '事故预防管理',
        '投诉管理',
        '奖惩管理',
        '评估管理',
        '账号管理',
        '生产经营单位管理',
        '服务机构管理',
        '安全专家管理',
      ]
      // this.rewardsType = this.enumData.PunishmentTypeEnum // 奖惩类型 奖励 处罚
      // this.DataStatusEnum = this.enumData.DataStatusEnum
    },
    // 分页变更
    handleCurrentChange(val) {
      this.form.pn = val
      this.getLogsList()
    },
    // 获取列表
    async getLogsList() {
      let { code, list, total } = await getLogsList(this.form)
      if (code === '0000') {
        this.total = total
        this.tableData = list
      }
    },
    // 搜索
    search() {
      this.form.operateDateBegin =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.form.operateDateEnd =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      this.getLogsList()
    },

    // 删除奖惩
    async delRewards(id) {
      let { code } = await delRewards(id)
      if (code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.getLogsList()
      }
    },
    del(val) {
      let text = '确定要删除吗？'
      this.$baseConfirm(text, '', () => {
        this.delRewards(val.id)
      })
    },
    // 更新奖惩
    async updateRewards(val) {
      let status = val.dataStatus === 1 ? 0 : 1
      let { code } = await updateRewards(val.id, {
        dataStatus: status,
      })
      if (code === '0000') {
        this.getLogsList()
      }
    },
    // 状态改变
    async switchChange(val) {
      let text = '确定要启用吗？'
      if (val.dataStatus === 1) {
        text = '确认要禁用吗？'
      }
      this.$baseConfirm(text, '', () => {
        this.updateRewards(val)
      })
    },
    // 编辑奖惩
    edit(val) {
      // this.$router.push({
      //   path: 'addRewards',
      //   query: {
      //     id: val.id,
      //   },
      // })
      this.$refs.Add.initData(val)
    },
    // 重置
    reset() {
      this.dateArray = []
      this.form = {
        desc: true,
        name: '',
        objectName: '',
        objectType: '',
        rwdPhbType: '',
        pn: 1,
        ps: 10,
        rwdPhbStartTime: '',
        rwdPhbEndTime: '',
      }
      this.getLogsList()
    },
  },
}
</script>

<style lang="scss" scoped>
#logsList {
  .elsaerch {
    margin: 20px;
    line-height: 40px;
  }

  .row-bg {
    margin-bottom: 20px;
    line-height: 40px;
  }

  .table-list {
    margin: 20px;
  }
  ::v-deep .el-table__cell {
    font-weight: 800;
    color: red;
  }

  .operation {
    text-align: center;
    span {
      padding: 0 5px;
    }
  }
}
</style>
