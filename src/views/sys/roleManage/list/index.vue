<template>
  <div id="roleManageList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">角色名称：</span>
            <el-input
              v-model="ruleForm.roleName"
              size="small"
              class="w300"
              placeholder="请输入角色名称"
            />
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
      <div class="ml20 text-center">
        <el-button type="primary" shape="round" @click="seach">查询</el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <el-button type="primary" @click="add">新增</el-button>
        <!-- <div class="icons-list">
          <span class="col-org">展开 <a-icon type="star" theme="filled"/></span>
          <span class="col-org">收起 <a-icon type="up"/></span>
        </div> -->
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <el-col :span="14" style="text-align: right"></el-col>
      </el-row>
      <div class="mt8">
        <el-table
          :data="tableList"
          border
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="userCount"
            label="用户数量"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createName"
            label="创建人"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            show-overflow-tooltip
          ></el-table-column>
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
              <el-button
                class="detailBtn"
                type="text"
                @click="update(scope.row)"
              >
                编辑
              </el-button>
              <el-button class="detailBtn" type="text" @click="menu(scope.row)">
                配置菜单
              </el-button>
              <el-button
                class="detailBtn"
                type="text"
                @click="releUser(scope.row)"
              >
                关联用户
              </el-button>
              <el-button
                class="detailBtn"
                type="text"
                @click="delet(scope.row)"
              >
                删除
              </el-button>
              <!-- <el-button type="text" @click="delet(scope.row)">删除</el-button> -->
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
    <add-or-alter ref="addOrAlterRef" :role-data="roleData" />
    <config-menu ref="configMenu" :role-data="roleData" />
    <corre-users ref="correUsers" :role-data="roleData" />
  </div>
</template>

<script>
import AddOrAlter from './components/AddOrAlter'
import ConfigMenu from './components/ConfigMenu'
import CorreUsers from './components/CorreUsers'
import { getList, updateStatus,doDeleteRole } from '@/api/roleManagement'
export default {
  name: 'RoleManageList',
  components: {
    AddOrAlter,
    ConfigMenu,
    CorreUsers,
  },
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        roleName: '',
        status: '',
      },
      total: 0, // 分页
      tableList: [],
      roleData: {},
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      let res = await getList(this.ruleForm)
      if (res.code === '0000') {
        this.tableList = res.list
        this.total = res.total
      }
    },
    seach() {
      this.ruleForm.pn = 1
      this.init()
    },
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.init()
    },
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        roleName: '',
        status: '',
      }
    },
    async switchStatus(val) {
      let status = val.status === '1' ? '0' : '1'
      let res = await updateStatus(val.roleCode, status)
      if (res.code === '0000') {
        this.$baseMessage(
          val.status === '0' ? '启用成功' : '禁用成功',
          'success'
        )
        val.status = status
      }
    },
    // 修改状态
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
    add() {
      this.$refs.addOrAlterRef.dialogVisible = true
    },
    update(val) {
      this.roleData = {}
      this.$nextTick((_) => {
        this.roleData = val
        this.$refs.addOrAlterRef.dialogVisible = true
      })
    },
    menu(val) {
      this.$refs.configMenu.dialogVisible = true
      this.roleData = val
    },
    releUser(val) {
      this.$refs.correUsers.dialogVisible = true
      this.roleData = val
    },
    async delet(row) {
      this.$baseConfirm(
        '确定要删除？',
        '',
        () => {
          this.deleteRole(row.id)
        },
        () => {
          // this.$baseMessage('已取消', 'info')
        }
      )
    },
    async deleteRole(id) {
      let res = await doDeleteRole(id)
      if (res.code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.init()
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center'
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#roleManageList {
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
</style>
