<template>
  <div id="rewardsList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">奖惩时间：</span>
            <el-date-picker
              v-model="dateArray"
              class="w300"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <!-- <el-date-picker
              v-model="form.rwdPhbStartTime"
              class="w180"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
            <div style="padding: 0 20px">至</div>
            <el-date-picker
              v-model="form.rwdPhbEndTime"
              class="w180"
              type="date"
              placeholder="选择日期"
            ></el-date-picker> -->
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">奖惩类型：</span>
            <el-select
              v-model="form.rwdPhbType"
              class="w300"
              placeholder="请选择"
            >
              <el-option
                v-for="item in rewardsType"
                :key="item.strCode"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <!-- <span class="item3">被奖惩机构名称</span> -->
            <Label1 long="被奖惩机构名称：" />
            <el-input
              v-model="form.objectName"
              class="w300"
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
                v-for="item in DataStatusEnum"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button
          v-if="$hasBtn('rewards-add')"
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
          :data="tableData"
          border
          style="width: 100%"
          header-row-class-name="tableHead"
        >
          <el-table-column
            align="center"
            type="index"
            width="80"
            label="序号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="objectName"
            show-overflow-tooltip
            label="被奖惩机构名称"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="objectType"
            show-overflow-tooltip
            label="被奖惩机构类型"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="rwdPhbType"
            label="奖惩类型"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="rwdPhbTime"
            show-overflow-tooltip
            label="奖惩时间"
          ></el-table-column>
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
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  v-if="$hasBtn('rewards-detail')"
                  type="text"
                  class="detailBtn"
                  size="small"
                  @click="check(scope.row)"
                >
                  查看
                </el-button>
                <el-dropdown trigger="click">
                  <el-button type="text" class="moreBtn ml20">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="$hasBtn('rewards-edit')"
                      class="updateBtn"
                      @click.native="edit(scope.row)"
                    >
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$hasBtn('rewards-del')"
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
    <Add ref="Add" @successCb="getRewardsList" />
  </div>
</template>

<script>
import { getRewardsList, updateRewards, delRewards } from '@/api/supervise.js'
import Label1 from '@/components/label/index'
import Add from '../add/add.vue'
import Details from '../detail/Details.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'RewardsList',
  components: { Label1, Add, Details },
  data() {
    return {
      coverRewardsTypeOptions: [],
      rewardsType: [],
      dataType: [],
      dateArray: [],
      DataStatusEnum: [], // 状态 有效 无效
      stateValue: '',
      // 分页
      total: 0,
      tableData: [],
      form: {
        dataStatus: '',
        desc: true,
        name: '',
        objectName: '',
        objectType: '',
        rwdPhbType: '',
        pn: 1,
        ps: 10,
        rwdPhbStartTime: null,
        rwdPhbEndTime: null,
      },
      // rules: {
      //   objectName: [
      //     {
      //       min: 2,
      //       max: 100,
      //       message: '长度在 2 到 100 个字符',
      //       trigger: 'change',
      //     },
      //   ],
      // },
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',
    }),
  },
  activated() {
    this.getRewardsList()
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getRewardsList()
      this.coverRewardsTypeOptions = this.enumData.RespondentEnum
      this.rewardsType = this.enumData.PunishmentTypeEnum // 奖惩类型 奖励 处罚
      this.DataStatusEnum = this.enumData.DataStatusEnum
    },
    // 分页变更
    handleCurrentChange(val) {
      this.form.pn = val
      this.getRewardsList()
    },
    // 新增奖惩
    add() {
      this.$refs.Add.initData()
    },
    // 查看详情
    check(val) {
      // this.$router.push({
      //   path: 'rewardsDetail',
      //   query: {
      //     id: val.id,
      //   },
      // })
      this.$refs.Details.initData(val)
    },
    // 获取奖惩列表
    async getRewardsList() {
      let { code, list, total } = await getRewardsList(this.form)
      if (code === '0000') {
        this.total = total
        let newList = list.map((item) => {
          return {
            ...item,
            rwdPhbTime: item.rwdPhbTime.split(' ')[0],
            objectType: this.coverRewardsTypeOptions.find(
              (it) => it.strCode === item.objectType
            ).label,
            rwdPhbType: this.rewardsType.find(
              (it) => it.strCode === item.rwdPhbType
            ).label,
          }
        })
        this.tableData = newList
      }
    },
    // 搜索
    search() {
      this.form.rwdPhbStartTime =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.form.rwdPhbEndTime =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      this.getRewardsList()
    },
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.getRewardsList()
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
    // 删除奖惩
    async delRewards(id) {
      let { code } = await delRewards(id)
      if (code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.getRewardsList()
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
        this.getRewardsList()
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
      this.getRewardsList()
    },
  },
}
</script>

<style lang="scss" scoped>
#rewardsList {
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
<style>
/* html body .el-table td .cell, html body .el-table th .cell */
html body .el-table .tableHead .cell {
  font-weight: 800;
}
html body .el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
</style>
