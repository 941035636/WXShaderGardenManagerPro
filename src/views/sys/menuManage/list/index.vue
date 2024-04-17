<template>
  <div class="menuManage">
    <el-container style="height: 100%">
      <el-aside width="300px">
        <div class="tree_div">
          <div class="seach_div">
            <el-input
              v-model="treekey"
              style="width: 250px"
              placeholder="请输入内容"
              clearable
            ></el-input>
          </div>
          <el-tree
            ref="treeMenu"
            :data="treeData"
            node-key="code"
            highlight-current
            :default-expand-all="false"
            :expand-on-click-node="false"
            :default-expanded-keys="['0']"
            :props="defaultProps"
            @node-click="handleNodeClick"
            @current-change="handleCurrentChange"
          >
            <span slot-scope="{ data }" class="custom-tree-node keywords_em">
              <span v-if="!treekey">{{ data.name }}</span>
              <span
                v-if="treekey"
                v-html="
                  data.name.replace(
                    new RegExp(treekey, 'g'),
                    `<span style='color: red'>${treekey}</span>`
                  )
                "
              ></span>
            </span>
          </el-tree>
        </div>
      </el-aside>
      <el-main>
        <div class="elsearch">
          <el-row class="row-bg">
            <el-col :span="8">
              <div style="display: flex">
                <span class="item3">菜单名称：</span>
                <el-input
                  v-model="ruleForm.roleName"
                  class="w300"
                  size="small"
                  placeholder="请输入菜单名称"
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
            <el-button type="primary" shape="round" @click="seach">
              查询
            </el-button>
            <el-button class="ml20" shape="round" @click="reset">
              重置
            </el-button>
            <el-button type="primary" class="ml20" @click="add">新增</el-button>
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
            <el-table :data="tableList" border :header-cell-style="getRowClass">
              <el-table-column
                type="index"
                label="序号"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="菜单名称"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="userNum"
                label="类型"
                show-overflow-tooltip
                width="60"
              >
                <template slot-scope="scoped">
                  {{ scoped.row.functionType === 'M' ? '菜单' : '按钮' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="functionUrl"
                label="跳转地址"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="parentName"
                label="上级名称"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="icon"
                label="图标"
                show-overflow-tooltip
                width="60"
              ></el-table-column>
              <el-table-column
                prop="componentName"
                label="组件名称"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="componentUrl"
                label="组件地址"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="是否显示"
                show-overflow-tooltip
                width="80"
              >
                <template slot-scope="scoped">
                  {{ scoped.row.isShow === '1' ? '显示' : '不显示' }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="70">
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
                align="center"
                label="操作"
                fixed="right"
                width="190"
              >
                <template slot-scope="scoped">
                  <el-button
                    class="detailBtn"
                    type="text"
                    @click="update(scoped.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    class="detailBtn"
                    type="text"
                    @click="sortHandler(scoped.row, '0')"
                  >
                    升序
                  </el-button>
                  <el-button
                    class="detailBtn"
                    type="text"
                    @click="sortHandler(scoped.row, '1')"
                  >
                    降序
                  </el-button>
                  <el-button
                    class="detailBtn"
                    type="text"
                    @click="deletes(scoped.row, scoped.$index)"
                  >
                    删除
                  </el-button>
                </template>
                <!-- <el-button type="text" @click="delet(scope.row)">删除</el-button> -->
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <AddOrAlter ref="addOrAlter" :data-menu="dataMenu" />
  </div>
</template>

<script>
import { getTree, sortMenu, doDelete, updateStatus } from '@/api/menuManagement'
import AddOrAlter from './components/AddOrAlter'
export default {
  name: 'MenuManageList',
  components: {
    AddOrAlter,
  },
  data() {
    return {
      ruleForm: {
        roleName: '',
        status: '',
      },
      total: 0, //总计
      treekey: '',
      treeData: [],
      tableList: [],
      dataMenu: {
        parentName: '根节点',
        parentCode: '0',
      }, // 用于新增
      updateDataMenu: {},
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      let res = await getTree()
      if (res.code === '0000') {
        this.total = res.data.allResourceMenu.length
        let objArray = [
          {
            code: '0',
            name: '根节点',
            children: res.data.allResourceMenu,
          },
        ]
        this.treeData = objArray
        this.getTableList()
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    seach() {
      if (this.tableList.length <= 0) {
        this.getTableList()
      }
      let tableTempList = this.tableList.filter((item) => {
        let s = true
        let ss = true
        if (this.ruleForm.roleName) {
          s = item.name.indexOf(this.ruleForm.roleName) != -1
        }
        if (this.ruleForm.status) {
          ss = item.status === this.ruleForm.status
        }
        return s && ss
      })
      this.total = tableTempList.length
      this.tableList = tableTempList
    },
    reset() {
      this.ruleForm = {
        roleName: '',
        status: '',
      }
      this.getTableList()
    },
    // 新增菜单
    add() {
      this.$refs.addOrAlter.dialogVisible = true
    },
    async deleteMenu(id, index) {
      let res = await doDelete(id)
      if (res.code === '0000') {
        this.$baseMessage('删除成功', 'success')
        this.initData()
        this.tableList.splice(index, 1)
      }
    },
    deletes(val, index) {
      this.$baseConfirm(
        '确定要删除？',
        '',
        () => {
          this.deleteMenu(val.id, index)
        },
        () => {
          // this.$baseMessage('已取消', 'info')
        }
      )
    },
    getTableList() {
      console.log(this.treeData)
      let treeTable = this.diguiTree(this.treeData, this.dataMenu.parentCode)
      let children = treeTable.children ? treeTable.children : []
      this.tableList = children.map((item) => {
        item['parentName'] = treeTable.name
        return item
      })
    },
    diguiTree(treeList, code) {
      let temp = {}
      for (var i = 0; i < treeList.length; i++) {
        let element = treeList[i]
        console.log(element)
        if (!code) {
          console.log(1)
          temp = element
          break
        } else if (element.code === code) {
          temp = element
          break
        } else {
          if (element.children) {
            temp = this.diguiTree(element.children, code)
          }
        }
      }
      // console.log(temp)
      return temp
    },
    update(val) {
      this.dataMenu = {}
      this.$nextTick((_) => {
        this.dataMenu = val
        this.$refs.addOrAlter.dialogVisible = true
      })
    },
    // 排序菜单接口
    async sortMenu(code, flag) {
      let res = await sortMenu(code, flag)
      if (res.code === '0000') {
        this.$baseMessage(flag === '1' ? '降序成功' : '升序成功', 'success')
        this.initData()
      }
    },
    async switchStatus(val) {
      let status = val.status === '1' ? '0' : '1'
      let res = await updateStatus(val.code, status)
      if (res.code === '0000') {
        this.$baseMessage(
          val.status === '0' ? '启用成功' : '禁用成功',
          'success'
        )
        val.status = status
      }
    },
    // 状态修改
    switchChange(val) {
      console.log(val.status, '!!!')
      let text = '确定要启用？'
      if (val.status === '1') {
        text = '确定要禁用？'
      }
      this.$baseConfirm(
        text,
        '',
        () => {
          this.switchStatus(val)
          console.log(val.status)
        },
        () => {
          // this.$baseMessage('已取消', 'info')
        }
      )
    },
    async sortHandler(val, flag) {
      let text = '确定要降序？'
      if (flag === '0') {
        text = '确定要升序？'
      }
      this.$baseConfirm(
        text,
        '',
        () => {
          this.sortMenu(val.code, flag)
        },
        () => {
          // this.$baseMessage('已取消', 'info')
        }
      )
    },
    handleNodeClick(data, node, o) {
      console.log(data, node, o)
      this.dataMenu = {
        parentName: data.name,
        parentCode: data.code,
      }
      let children = data.children ? data.children : []
      this.tableList = children.map((item) => {
        item['parentName'] = data.name
        return item
      })
    },
    handleCurrentChange(data) {
      console.log(data)
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.menuManage {
  // height: calc(100vh - 60px - 55px - 20px - 20px - 55px - 55px);
  // background: #f6f8f9;
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }
  .teble-list {
    margin: 8px 20px 20px 20px;
  }
  .tree_div {
    height: 100%;
    margin-right: 10px;
    // background: #fff;
    padding: 20px;
  }
  .seach_div {
    margin-bottom: 20px;
  }
  .el-main {
    // background: #fff;
  }
}
</style>
