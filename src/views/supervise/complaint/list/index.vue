<template>
  <div id="complaintList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">投诉时间：</span>
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
            <span class="item3">投诉人名称：</span>
            <el-input
              v-model="form.name"
              class="w300"
              placeholder="请输入投诉人名称"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">被投诉人：</span>
            <el-select
              v-model="form.respondentType"
              filterable
              class="w100"
              placeholder="请选择"
            >
              <el-option
                v-for="item in respondentType"
                :key="item.strCode"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
            <el-input
              v-model="form.respondentName"
              class="w200"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="投诉办理单位：" />
            <el-input
              v-model="form.complaintHandlingUnit"
              class="w300"
              placeholder="请输入投诉办理单位"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">投诉确认：</span>
            <el-select
              v-model="form.complaintHandlingConfirm"
              filterable
              class="w300"
              placeholder="请选择"
            >
              <el-option
                v-for="item in confirmOptions"
                :key="item.strCode"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
          </div>
        </el-col>
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
                v-for="item in stateoOptions"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button class="ml20" type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button
          v-if="$hasBtn('complaint-add')"
          type="primary"
          size="small"
          @click="add"
        >
          新增
        </el-button>
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
          header-row-class-name="tableHead"
          :data="tableData"
          border
          style="width: 100%"
        >
          <!-- <el-table-column
            align="center"
            type="index"
            label="序号"
          ></el-table-column> -->
          <el-table-column
            align="center"
            prop="name"
            label="投诉人名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            prop="respondentName"
            show-overflow-tooltip
            label="被投诉人"
          >
            <template slot-scope="scope">
              {{ scope.row.respondentName }}（{{
                getResponseType(scope.row.respondentType)
              }}）
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="complainTime"
            show-overflow-tooltip
            label="投诉时间"
          ></el-table-column>
          <!-- <el-table-column
            align="center"
            prop="remark"
            show-overflow-tooltip
            label="投诉内容及述求"
          ></el-table-column> -->
          <el-table-column
            align="center"
            prop="complaintHandlingUnit"
            show-overflow-tooltip
            label="投诉办理单位"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="complaintHandlingConfirm"
            show-overflow-tooltip
            label="投诉人确认"
          ></el-table-column>
          <!-- <el-table-column
            align="center"
            prop="complaintHandlingResult"
            show-overflow-tooltip
            label="投诉办理结果"
          ></el-table-column> -->
          <el-table-column
            align="center"
            prop="updateTime"
            show-overflow-tooltip
            label="操作时间"
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
          <el-table-column width="150" align="center" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  v-if="$hasBtn('complaint-detail')"
                  type="text"
                  class="detailBtn"
                  @click="check(scope.row)"
                >
                  查看
                </el-button>
                <el-dropdown trigger="click">
                  <el-button type="text" class="moreBtn ml20">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="$hasBtn('complaint-edit')"
                      class="updateBtn"
                      @click.native="edit(scope.row)"
                    >
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$hasBtn('complaint-del')"
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
    <Add ref="Add" @successCb="getComplaintList" />
  </div>
</template>

<script>
import {
  getComplaintList,
  updateComplaint,
  delComplaint,
} from '@/api/supervise.js'
import { mapGetters } from 'vuex'
import Label1 from '@/components/label/index'
import Details from '../detail/Details.vue'
import Add from '../add/add.vue'
export default {
  name: 'ComplanitList',
  components: { Label1, Details, Add },
  data() {
    return {
      // 状态
      stateoOptions: [],
      dateArray: [],
      // 投诉确认
      confirmOptions: [],
      // 投诉人类型
      respondentType: [],
      RespondentEnum: [],
      complaintcconfirmOptions: [],
      coverComplaintTypeOptions: [],
      stateValue: '',
      start: '',
      end: '',
      // 分页
      total: 10,
      tableData: [],
      form: {
        blCode: '',
        complaintHandlingConfirm: '',
        dataStatus: null,
        desc: true,
        name: '',
        orderby: '',
        pn: 1,
        ps: 10,
        complaintHandlingUnit: '',
        respondentName: '',
        respondentType: '',
        complainStartTime: '',
        complainEndTime: '',
      },
      rules: {
        name: [
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'change',
          },
        ],
        respondentName: [
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'change',
          },
        ],
        complaintHandlingUnit: [
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'change',
          },
        ],
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
   
  },
  created() {
    this.init()
     this.getComplaintList()
  },
  methods: {
    // 初始化
    init() {
      this.getComplaintList()
      this.RespondentEnum = this.enumData.RespondentEnum
      this.coverComplaintTypeOptions = this.enumData.RespondentEnum
      this.complaintcConfirmOptions = this.enumData.SolveStatusEnums
      this.stateoOptions = this.enumData.DataStatusEnum
      this.confirmOptions = this.enumData.SolveStatusEnums
      this.respondentType = this.enumData.RespondentEnum
    },
    // 分页变更
    handleCurrentChange(val) {
      this.form.pn = val
      this.getComplaintList()
    },
    getResponseType(type) {
      let obj = this.RespondentEnum.find((item) => {
        return item.strCode == type
      })
      return obj.label
    },
    // 新增投诉
    add() {
      this.$refs.Add.initData()
    },
    // 查看详情
    check(val) {
      this.$refs.Details.initData(val)
    },
    // 删除投诉
    async delComplaint(id) {
      let { code } = await delComplaint(id)
      if (code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.getComplaintList()
      }
    },
    // 获取投诉列表
    async getComplaintList() {
      let { code, total, list } = await getComplaintList(this.form)
      if (code === '0000') {
        this.total = total
        let newList = list.map((item) => {
          if (
            this.confirmOptions.find(
              (it) => item.complaintHandlingConfirm === it.strCode
            )
          ) {
            return {
              ...item,
              complainTime: item.complainTime,
              complaintHandlingConfirm: this.confirmOptions.find(
                (it) => it.strCode === item.complaintHandlingConfirm
              ).label,
            }
          }
        })
        this.tableData = newList
      }
    },
    // 更新投诉
    async updateComplaint(val) {
      let status = val.dataStatus === 1 ? 0 : 1
      let { code } = await updateComplaint(val.id, {
        dataStatus: status,
      })
      if (code === '0000') {
        this.getComplaintList()
      }
    },
    // 状态改变
    switchChange(val) {
      let text = '确定要启用吗？'
      if (val.dataStatus === 1) {
        text = '确认要禁用吗？'
      }
      this.$baseConfirm(text, '', () => {
        this.updateComplaint(val)
      })
    },
    // 搜索
    search() {
      this.form.complainStartTime =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.form.complainEndTime =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      this.getComplaintList()
    },

    // 编辑投诉
    edit(val) {
      this.$refs.Add.initData(val)
    },
    del(val) {
      let text = '确定要删除吗？'
      this.$baseConfirm(text, '', () => {
        this.delComplaint(val.id)
      })
    },
    // 重置
    reset() {
      this.dateArray = []
      this.form = {
        blCode: '',
        complaintHandlingConfirm: '',
        desc: true,
        dataStatus: '',
        name: '',
        orderby: '',
        pn: 1,
        ps: 10,
        respondentType: '',
      }
      this.getComplaintList()
    },
  },
}
</script>

<style lang="scss" scoped>
#complaintList {
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
}
</style>
<style>
html body .el-table .tableHead .cell {
  font-weight: 800;
}
/* #complaintList .el-form-item--small.el-form-item {
  width: 86%;
}

#complaintList .el-form-item--small .el-form-item__content {
  width: 100%;
  margin-left: 0 !important;
} */
html body .el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
</style>
