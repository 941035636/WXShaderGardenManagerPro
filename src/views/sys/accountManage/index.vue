<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">登录账号：</span>
            <el-input
              v-model="ruleForm.userAccount"
              class="w300"
              size="small"
              placeholder="请输入登录账号"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">姓名：</span>
            <el-input
              v-model="ruleForm.name"
              class="w300"
              size="small"
              placeholder="请输入姓名"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">账号类型：</span>
            <el-select
              v-model="ruleForm.type"
              filterable
              class="w300"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeData"
                :key="item.strCode"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">创建时间：</span>
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
            <span class="item3">状态：</span>
            <el-select
              v-model="ruleForm.status"
              class="w300"
              clearable
              placeholder="请选择"
            >
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>

      <div style="text-align: center">
        <el-button class="ml20" type="primary" shape="round" @click="seach">
          查询
        </el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <el-button
          v-if="$hasBtn('user-add')"
          type="primary"
          shape="round"
          @click="add"
        >
          添加
        </el-button>
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <!-- <el-col :span="14" style="text-align: right">
          <el-button v-if="$hasBtn('user-add')" class="ml20" @click="add">
            添加账号
          </el-button>
        </el-col> -->
      </el-row>
      <div class="mt8">
        <el-table
          :data="tableList"
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
          <el-table-column label="账号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <p>{{ scope.row.name }}</p>
                <p>账号：{{ scope.row.userName }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="150" label="角色" align="center">
            <template slot-scope="scope">
              {{ scope.row.roleName || '/' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="账号类型"
            width="150"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="orgName"
            label="关联机构"
            align="center"
          ></el-table-column>
          <el-table-column width="100" label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
                @change="switchChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="操作时间"
            align="center"
            width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{ scope.row.updateTime }}</p>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="120"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="$hasBtn('user-update')"
                type="text"
                class="updateBtn"
                @click="update(scope.row)"
              >
                编辑
              </el-button>

              <el-dropdown trigger="click">
                <!-- <span style="font-size: 12px" class="el-dropdown-link">
                    更多
                  </span> -->
                <el-button type="text" class="moreBtn ml20">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="$hasBtn('password-update')"
                    @click.native="Modify(scope.row)"
                  >
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$hasBtn('password-reset')"
                    @click.native="resetPass(scope.row)"
                  >
                    重置密码
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$hasBtn('user-delete')"
                    class="color-red"
                    @click.native="delet(scope.row)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="ruleForm.pn"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>

    <add-account
      ref="AddAccountRef"
      :role-data="roleData"
      :type-data="typeData"
    />
    <reset-pass ref="ResetPass" />
    <!-- <user-detail
      ref="userDetailRef"
      :role-data="roleData"
      :type-data="typeData"
    /> -->
    <modify-pass ref="ModifyPass" />
  </div>
</template>

<script>
import { getList } from '@/api/roleManagement'
import {
  getUserList,
  updateUserStatus,
  delAccount,
  putUserStatus,
} from '@/api/userManagement'
import AddAccount from './components/AddAccount'
import ResetPass from './components/ResetPass'
import ModifyPass from './components/ModifyPass'
import { mapGetters } from 'vuex'
export default {
  name: 'UserList',
  components: {
    AddAccount,
    ResetPass,
    ModifyPass,
  },
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        beginCreateTime: '',
        endCreateTime: '',
        name: '',
        status: '',
        type: '',
        userAccount: '',
      },
      // 时间数组
      dateArray: [],
      tableList: [],
      total: 0, // 分页
      roleData: [],
      branchData: [], // 机构
      roleList: [], // 角色集合
      typeData: [],
    }
  },
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.typeData = this.getStrEnumAll.UserCheckTypeEnum
      await this.initRole()
      await this.getUserList()
    },
    async initRole() {
      let data = {
        pn: 1,
        ps: 500,
        // flag: false,
      }
      let res = await getList(data)
      if (res.code === '0000') {
        this.roleData = res.list
      }
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        beginCreateTime: '',
        endCreateTime: '',
        name: '',
        status: '',
        type: '',
        userAccount: '',
      }
      this.dateArray = []
    },
    async switchStatus(val) {
      let status = val.status == '1' ? '0' : '1'
      let res = await putUserStatus(val.userCode, status)
      if (res.code === '0000') {
        this.$baseMessage('成功', 'success')
        val.status = status
      }
    },
    switchChange(val) {
      let text = '确定要启用？'
      if (val.status === '1') {
        text = '确定要禁用？'
      }
      this.$baseConfirm(
        text,
        '',
        () => {
          this.switchStatus(val)
        },
        () => {
          // this.$baseMessage('已取消', 'info')
        }
      )
    },
    async getUserList() {
      let res = await getUserList(this.ruleForm)
      if (res.code === '0000') {
        res.list.map((item) => {
          if (this.typeData.find((it) => it.strCode == item.type)) {
            item.typeName = this.typeData.find(
              (it) => it.strCode == item.type
            ).label
          }
        })
        this.tableList = res.list
        this.total = res.total
      }
    },
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.beginCreateTime =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.ruleForm.endCreateTime =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      this.getUserList()
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getUserList()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center'
      } else {
        return ''
      }
    },
    detail(row) {
      if (row.status === '0') {
        this.$baseMessage('当前账号被停用无法查询详情！', 'warning')
        return false
      }
      this.$refs.userDetailRef.dialogVisible = true
      this.$refs.userDetailRef.userCode = row.userCode
    },
    update(row) {
      if (row.status === '0') {
        this.$baseMessage('当前账号被停用无法编辑！', 'warning')
        return false
      }
      this.$refs.AddAccountRef.dialogVisible = true
      this.$refs.AddAccountRef.userCode = row.userCode
    },
    async deleteUser(code) {
      let res = await delAccount(code)
      if (res.code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.getUserList()
      }
    },
    Modify(row) {
      this.$refs.ModifyPass.dialogModifyPass = true
      this.$refs.ModifyPass.ruleForm.userCode = row.userCode
      this.$refs.ModifyPass.ruleForm.loginAccount = row.userName
    },
    resetPass(row) {
      this.$refs.ResetPass.dialogResetPass = true
      this.$refs.ResetPass.ruleForm.userCode = row.userCode
      this.$refs.ResetPass.ruleForm.loginAccount = row.userName
    },
    delet(val) {
      this.$baseConfirm(
        '确定要删除所选用户？',
        '',
        () => {
          this.deleteUser(val.userCode)
        },
        () => {
          // this.$baseMessage('已取消', 'info')
        }
      )
    },
    add() {
      this.$refs.AddAccountRef.dialogVisible = true
    },
  },
}
</script>

<style lang="scss" scoped>
#userList {
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }
  .teble-list {
    margin: 8px 20px 20px 20px;
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
html body .el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
</style>
