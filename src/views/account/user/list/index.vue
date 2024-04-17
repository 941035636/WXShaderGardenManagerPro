<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">名称：</span>
            <el-input
              v-model="ruleForm.name"
              size="small"
              placeholder="small size"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">登录账号：</span>
            <el-input
              v-model="ruleForm.userAccount"
              size="small"
              placeholder="small size"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">账号类型：</span>
            <el-select
              v-model="ruleForm.type"
              class="w450"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeData"
                :key="item.code"
                :label="item.label"
                :value="item.code"
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
              class="w450"
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
              class="w450"
              clearable
              placeholder="请选择"
            >
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button type="primary" shape="round" @click="seach">查询</el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <!-- <div class="icons-list">
          <span class="col-org">展开 <a-icon type="star" theme="filled"/></span>
          <span class="col-org">收起 <a-icon type="up"/></span>
        </div> -->
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span>查询列表</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
          <el-button class="ml20" @click="add">新增</el-button>
        </el-col>
      </el-row>
      <div class="mt20">
        <el-table :data="tableList" border :header-cell-style="getRowClass">
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="userName"
            label="账号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="角色" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.roleName || '/' }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="time"
            label="地区"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="endTime"
            label="详细地址"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column prop="type" label="企业类型" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ typeData.find((item) => item.code === scope.row.type).label }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
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
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="detail(scope.row)">详情</el-button>
              <el-button type="text" @click="update(scope.row)">编辑</el-button>
              <el-button type="text" @click="delet(scope.row)">删除</el-button>
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

    <add-or-alter
      ref="addOrAlterRef"
      :role-data="roleData"
      :type-data="typeData"
    />
    <user-detail
      ref="userDetailRef"
      :role-data="roleData"
      :type-data="typeData"
    />
  </div>
</template>

<script>
import { getList } from '@/api/roleManagement'
import {
  getUserList,
  updateUserStatus,
  deleteUserInfo,
} from '@/api/userManagement'
import AddOrAlter from './components/AddOrAlter'
import UserDetail from './components/Detail'
export default {
  name: 'UserList',
  components: {
    UserDetail,
    AddOrAlter,
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
      typeData: [
        {
          code: '00',
          label: '企业用户',
        },
        {
          code: '01',
          label: '专家用户',
        },
        {
          code: '02',
          label: '应急局用户',
        },
        {
          code: '03',
          label: '服务机构用户',
        },
        {
          code: '04',
          label: '保险公司用户',
        },
      ],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.initRole()
      this.getUserList()
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
    },
    async switchStatus(val) {
      let status = val.status === '1' ? '0' : '1'
      let res = await updateUserStatus(val.userCode, status)
      if (res.code === '0000') {
        this.$baseMessage(
          val.status === '0' ? '启用成功' : '禁用成功',
          'success'
        )
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
      console.log(res)
      if (res.code === '0000') {
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
        return 'background:#f5f5f5'
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
      this.$refs.addOrAlterRef.dialogVisible = true
      this.$refs.addOrAlterRef.userCode = row.userCode
    },
    async deleteUser(code) {
      let res = await deleteUserInfo(code)
      if (res.code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.getUserList()
      }
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
      this.$refs.addOrAlterRef.dialogVisible = true
    },
  },
}
</script>

<style lang="scss" scoped>
#userList {
  .row-bg {
    margin-bottom: 20px;
    line-height: 40px;
  }
  .teble-list {
    margin: 20px;
  }
}
</style>
