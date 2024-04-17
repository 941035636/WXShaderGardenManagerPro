<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">清单名称：</span>
            <el-input
              v-model="ruleForm.standardName"
              size="small"
              class="w300"
              placeholder="请输入清单名称"
            />
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button class="ml20" type="primary" shape="round" @click="seach">
          查询
        </el-button>

        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
          <el-button round type="primary" @click="add()">添加</el-button>
          <!-- <el-button round type="primary">
            导入岗位清单
          </el-button>
          <el-button round type="primary">
            导出岗位清单
          </el-button> -->
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table
          class="elTable"
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
          <el-table-column
            prop="standardName"
            label="清单名称"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="color: rgb(64, 158, 255)">
                {{ scope.row.standardName || '0' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="checkNum"
            label="检查项数"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="color: rgb(64, 158, 255)">
                {{ scope.row.checkNum || '0' }}项
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="postName"
            label="岗位名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="deptName"
            label="部门名称"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>{{ scope.row.deptName || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="frequencyName"
            label="排查频次"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>{{ scope.row.frequencyName || '--' }}</div>
              <div class="moreBtn">
                <span class="underline" @click="manualPush(scope.row)">
                  手动推送
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="moreBtn ml10"
                @click.native="edit(scope.row)"
              >
                清单编辑
              </el-button>
              <el-button
                type="text"
                class="detailBtn ml10"
                @click="update(scope.row)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                class="moreBtn ml10"
                @click="delet(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <Add ref="add" />
    <edit ref="edit" />
  </div>
</template>

<script>
import {
  getStandardList,
  delStandardList,
  createStandardHiddenDangerById,
  dictTrue,
} from '@/api/listManage'
import {
  getByEntNo, //部门列表查询
} from '@/api/branchManage'
import { mapGetters } from 'vuex'
import Add from '../add/index'
import edit from '../edit/index'
export default {
  name: 'SafetyList',
  components: { Add, edit },
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        desc: false, //是否倒叙
        deptNo: '', // 部门编号
        frequency: '', //排查频次
        impNo: '', // 导入批次号
        orderby: '', //排序字段
        postNo: '', // 岗位编号
        standardName: '', //清单名称
      },
      tableList: [],
      total: 0,
      checkList: [], //清单集合
      departmentList: [], //部门集合
    }
  },
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  onLoad() {},
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      await this.getDictTrue()
      await this.sysListFu()
      await this.getList()
    },
    async getDictTrue() {
      let res = await dictTrue('50003')
      if (res.code == '0000') {
        res.data.forEach((obj) => {
          obj.name = obj.itemText // 添加新属性名
          obj.code = obj.itemValue // 添加新属性名
          delete obj.itemText // 删除旧属性名
          delete obj.itemValue // 删除旧属性名
        })
        this.checkList = JSON.parse(JSON.stringify(res.data))
      }
    },

    // 获取部门信息
    async sysListFu() {
      let No = window.sessionStorage.getItem('enpNo')
      let res = await getByEntNo(No)
      if (res.code == '0000') {
        let arr = res.data
        // 去除一级未空的数据
        const filteredArr = arr.filter((obj) => obj.children.length > 0)
        // 最后一级children 为空时 替换为null
        function formatCascaderData(data) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].children.length < 1) {
              // children若为空数组，则将children设为undefined
              data[i].children = undefined
            } else {
              // children若不为空数组，则继续 递归调用 本方法
              formatCascaderData(data[i].children)
            }
          }
          return data
        }
        this.departmentList = formatCascaderData(filteredArr)
      }
    },

    async getList() {
      let res = await getStandardList(this.ruleForm)
      if (res.code === '0000') {
        if (res.data.records) {
          res.data.records.forEach((item, index) => {
            item.frequencyName = this.checkList.find(
              (item1) => item1.code == item.frequency
            )
              ? this.checkList.find((item1) => item1.code == item.frequency)
                  .name
              : item.frequency
          })
          this.tableList = res.data.records
          this.total = res.data.total
        } else {
          this.tableList = []
          this.total = res.data.total || 0
        }
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;'
      } else {
        return ''
      }
    },
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.getList()
    },
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        desc: false, //是否倒叙
        deptNo: '', // 部门编号
        frequency: '', //排查频次
        impNo: '', // 导入批次号
        orderby: '', //排序字段
        postNo: '', // 岗位编号
        standardName: '', //清单名称
      }
      // 重置
      this.getList()
    },

    async delet(row) {
      if (row.checkNum > 0) {
        // this.$baseMessage(
        //   '',
        //   'error'
        // )
        this.$message({
          message: '该清单中有清单记录，请先删除清单记录',
          type: 'error',
        })
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          hj: '取消',
          type: 'warning',
        })
          .then(async () => {
            let res = await delStandardList(row.id)
            if (res.code === '0000') {
              this.$baseMessage('删除成功', 'success')
              this.getList()
            }
          })
          .catch(() => {
            this.$baseMessage('已取消删除', 'info')
          })
      }
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },
    // 修改
    update(row) {
      this.$refs.add.dialogVisible = true
      this.$refs.add.inventoryId = row.id //清单id = this.orgName
      this.$refs.add.ruleForm = {
        depList: findAncestorsById(this.departmentList, row.deptNo) || [], //部门一级 二级编码
        deptName: row.deptName, //部门名称 ,
        deptNo: row.deptNo, // 部门编号 ,
        frequency: row.frequency, //排查频次 ,
        frequencyName: row.frequencyName, //排查频次名称
        postName: row.postName, // 岗位名称 ,
        postNo: row.postNo, // 岗位编号 ,
        standardName: row.standardName, //清单名称
      }

      // 反查一级部门code
      function findAncestorsById(data, deptNo) {
        let result = []
        function dfs(node, path) {
          if (node.deptNo === deptNo) {
            result = [...path, node.deptNo]
          } else if (node.children) {
            for (let child of node.children) {
              dfs(child, [...path, node.deptNo])
            }
          }
        }
        for (let item of data) {
          dfs(item, [])
        }
        return result
      }
    },
    // 新增
    add(row) {
      this.$refs.add.dialogVisible = true
    },
    // 清单编辑
    edit(row) {
      this.$router.push({
        path: '/postList/editList',
        query: {
          id: row.id,
          postNo: row.postNo,
          postName: row.postName,
          deptNo: row.deptNo,
          deptName: row.deptName,
          frequency: row.frequency,
          frequencyName: row.frequencyName,
        },
      })
    },

    // 手动推送
    async manualPush(row) {
      let res = await createStandardHiddenDangerById(row.id)
      if (res.code === '0000') {
        this.$baseMessage('推送成功', 'success')
      }
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

  .elTable {
    p {
      margin: 0;
    }
  }
  .underline {
    display: inline-block;
    text-decoration: underline;
    text-decoration-color: #fa843b;
    cursor: pointer;
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
