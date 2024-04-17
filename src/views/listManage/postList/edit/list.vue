<template>
  <div id="userEditList">
    <div class="headTitleA">
      <el-button size="mini" @click="back" class="mr20">返回上一级</el-button>
      <p style="float: right; line-height: 30px">
        <span class="color-blue mr30">
          清单编号：{{ $route.query.id || '-' }}
        </span>
        <span class="mr20">
          部门（岗位）：{{ $route.query.deptName || '-' }}（{{
            $route.query.postName || '-'
          }}）
        </span>
      </p>
    </div>
    <div class="split"></div>
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">检查项目：</span>

            <!-- <el-input
              v-model="ruleForm.checkProjectTypeOne"
              size="small"
              class="w300"
              placeholder="请输入清单名称"
              clearable
            /> -->

            <el-select
              v-model="ruleForm.checkProjectTypeOne"
              class="w280"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in checkProjectTypeOneList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">隐患级别：</span>
            <el-select
              v-model="ruleForm.hazardLevel"
              class="w280"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in hazardLevelList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">隐患类型：</span>
            <!-- 单个选择 -->
            <!-- <el-select
              v-model="ruleForm.hazardTypeOne"
              class="w200"
              placeholder="请选择隐患类型一级"
              @change="userTypeChange"
            >
              <el-option
                v-for="item in hazardTypeOneList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
            <el-select
              v-model="ruleForm.hazardTypeTwo"
              class="w200"
              placeholder="请选择隐患类型二级"
            >
              <el-option
                v-for="item in hazardTypeTwoList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select> -->
            <el-cascader
              v-model="hazardTypeList"
              :options="hazardTypeOneList"
              :props="optionProps"
              placeholder="请选择"
              class="w280"
              style="align-items: center"
              clearable
              filterable
            ></el-cascader>
          </div>
        </el-col>
      </el-row>

      <el-row class="row-bg" style="margin-top: 20px">
        <el-col :span="24">
          <div class="ml20 text-center">
            <el-button class="ml20" type="primary" shape="round" @click="seach">
              查询
            </el-button>
            <el-button class="ml20" shape="round" @click="reset">
              重置
            </el-button>
          </div>
        </el-col>
      </el-row>

      <div class="split"></div>
      <div class="ml20 text-center">
        <p class="f20 lh60">
          消防隐患排查清单-{{ $route.query.frequencyName || '-' }}
        </p>
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="totNum ml15">共{{ total }}条记录</span>
          <!-- <el-button round type="primary" @click="add()">导出</el-button> -->
        </el-col>
        <el-col :span="14" style="text-align: right">
          <el-button round type="primary" @click="edit()">添加</el-button>
          <el-button round type="primary" @click="delet(null, 'multiple')">
            批量删除
          </el-button>
          <!-- <el-button round type="primary" @click="add()">批量导入</el-button> -->
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table
          class="elTable"
          :data="tableList"
          border
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
          max-height="550"
          @selection-change="handleSelectionChangeRight"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="checkType"
            label="检查类别"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="checkProjectTypeOne"
            label="检查项目"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            type="selection"
            width="80px"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="checkStandard"
            label="检查标准"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="hazardLevel "
            label="隐患级别"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>{{ scope.row.hazardLevelName || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            width="280px"
            prop="hazardTypeOne"
            label="隐患类型"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="width: 100%" class="text-ellipsis">
                {{ scope.row.hazardTypeName || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="detailBtn"
                @click="modify(scope.row)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                class="moreBtn ml10"
                @click="delet(scope.row, 'single')"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination> -->
    </div>
    <edit ref="edit" />
  </div>
</template>

<script>
import {
  getStandardInfoList,
  deleteStandardInfo,
  getDbInfo,
  dictTrue,
} from '@/api/listManage'

import { mapGetters } from 'vuex'
import edit from '../edit/index'
export default {
  name: 'SafetyList',
  components: { edit },
  data() {
    return {
      ruleForm: {
        // pn: 1,
        // ps: 10,
        desc: false, //是否倒叙
        checkProjectTypeOne: '', // 检查项目大类 ,
        checkProjectTypeTwo: '', // 检查项目小类 ,
        checkStandard: '', // 检查标准 ,
        checkType: '', // 检查类别 ,
        hazardLevel: '', // 隐患级别 ,

        hazardTypeOne: '', // 隐患类型1 ,
        hazardTypeTwo: '', // 隐患类型2 ,
        impNo: '', // 导入批次 ,
        standardId: '', // 岗位标准清单id ,
      },
      tableList: [],
      roleData: [],
      typeData: [],
      total: 0,

      // 检查项目
      checkProjectTypeOneList: [],
      // 隐患级别
      hazardLevelList: [],
      hazardTypeList: [], //隐患类型选中集合
      // 隐患类型
      hazardTypeOneList: [],
      hazardTypeTwoList: [],

      //选中清单
      multipleSelectionRight: [],

      // el-cascader 相关
      optionProps: {
        value: 'code',
        label: 'name',
        children: 'children', //子元素字段名
      },
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
    async getDbInfo() {
      // 检查项目名称反查
      let res = await getDbInfo(this.$route.query.id, 'checkProjectTypeOne')
      if (res.code === '0000') {
        this.checkProjectTypeOneList = res.data
      }
    },
    async getDictTrue() {
      let res = await dictTrue('50001')
      if (res.code == '0000') {
        res.data.forEach((obj) => {
          obj.name = obj.itemText // 添加新属性名
          obj.code = obj.itemValue // 添加新属性名
          delete obj.itemText // 删除旧属性名
          delete obj.itemValue // 删除旧属性名
        })
        this.hazardLevelList = JSON.parse(JSON.stringify(res.data))
      }
      let res1 = await dictTrue('50002')
      if (res1.code == '0000') {
        this.hazardTypeOneList = replaceProperties(res1.data)
      }

      // 隐患级别 数据处理
      function replaceProperties(data) {
        console.log(data)
        function dfs(node) {
          if (node.itemText) {
            node.name = node.itemText
            delete node.itemText
          }
          if (node.itemValue) {
            node.code = node.itemValue
            delete node.itemValue
          }
          if (node.sysDictItemEntitys) {
            node.children = node.sysDictItemEntitys
            delete node.sysDictItemEntitys
          }
          if (node.children) {
            for (let child of node.children) {
              dfs(child)
            }
          }
        }
        for (let item of data) {
          dfs(item)
        }
        return data
      }
    },

    // 查询隐患二级数据
    userTypeChange(type = 'change') {
      if (type != 'init') {
        this.ruleForm.hazardTypeTwo = ''
      }
      this.hazardTypeTwoList = this.hazardTypeOneList.find(
        (item) => item.code == this.ruleForm.hazardTypeOne
      ).children
    },
    async initData() {
      await this.getDictTrue()
      await this.getDbInfo() //反查数据
      await this.getList() //列表数据
    },
    async getList() {
      let data = { ...this.ruleForm }
      data.standardId = this.$route.query.id
      if (this.hazardTypeList.length != 0) {
        data.hazardTypeOne = this.hazardTypeList[0].code // 隐患类型1 ,
        data.hazardTypeTwo = this.hazardTypeList[1].code // 隐患类型2 ,
      }
      let res = await getStandardInfoList(data)
      if (res.code === '0000') {
        if (res.data) {
          //  数据处理
          res.data.forEach((item, index) => {
            // 隐患级别名称
            item.hazardLevelName = this.hazardLevelList.find(
              (item1) => item1.code == item.hazardLevel
            )
              ? this.hazardLevelList.find(
                  (item1) => item1.code == item.hazardLevel
                ).name
              : item.hazardLevel

            //隐患类型名称
            let hazardType = findNameByCode(
              this.hazardTypeOneList,
              item.hazardTypeOne,
              item.hazardTypeTwo
            )
            item.hazardTypeName = hazardType.join(' - ')
          })

          this.tableList = res.data
          this.total = this.tableList.length //res.data.total
        } else {
          this.tableList = []
          this.total = this.tableList.length //res.data.total || 0
        }
      }

      // 反查隐患类别一级二级name
      function findNameByCode(tree, code1, code2) {
        // 遍历树状结构对象
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          // 判断当前节点code是否匹配一级code
          if (node.code === code1 && node.children) {
            // 若匹配，则继续遍历子节点
            for (let j = 0; j < node.children.length; j++) {
              const subNode = node.children[j]
              // 判断子节点code是否匹配二级code
              if (subNode.code === code2) {
                // 若匹配，则返回对应的name值
                return [node.name, subNode.name]
              } else if (subNode.children) {
                // 若不匹配，且存在子节点，则递归查找子节点
                const result = findNameByCode(subNode.children, code1, code2)
                if (result) {
                  // 若找到匹配的节点，则返回对应的name值
                  result.unshift(node.name)
                  return result
                }
              }
            }
            // 若一级code匹配失败，则继续遍历下一个节点
            continue
          } else if (node.children) {
            // 若一级code不匹配，且存在子节点，则递归查找子节点
            const result = findNameByCode(node.children, code1, code2)
            if (result) {
              // 若找到匹配的节点，则返回对应的name值
              result.unshift(node.name)
              return result
            }
          }
        }
        // 若未找到匹配的节点，则返回 null
        return null
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
      // this.ruleForm.pn = 1
      // this.ruleForm.ps = 10
      this.getList()
    },

    // 勾选框右侧
    handleSelectionChangeRight(val) {
      console.log(val)
      this.multipleSelectionRight = val
    },

    async delet(row, type) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        hj: '取消',
        type: 'warning',
      })
        .then(async () => {
          let ids = []
          if (type == 'single') {
            ids = [row.id]
          }
          if (type == 'multiple') {
            // 遍历数据，拿到所有选中的id

            const result = this.multipleSelectionRight.filter((item) => item.id)
            if (result.length == 0) {
              this.$baseMessage('请先选择要删除的数据', 'warning')
              return
            } else {
              ids = result.map((obj) => obj.id)
            }
          }
          let res = await deleteStandardInfo(ids)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.getList()
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },
    // 新增
    edit() {
      this.$refs.edit.dialogVisible = true
      this.$refs.edit.standardId = this.$route.query.id
    },
    // 修改
    modify(row) {
      this.$refs.edit.dialogVisible = true
      this.$refs.edit.standardId = this.$route.query.id
      this.$refs.edit.id = row.id

      this.$refs.edit.ruleForm = {
        checkType: row.checkType, // 检查类别 ,
        checkProjectTypeOne: row.checkProjectTypeOne, // 检查项目名称 ,
        checkStandard: row.checkStandard, // 检查标准 ,
        hazardLevel: row.hazardLevel, // 隐患级别 ,
        hazardTypeOne: row.hazardTypeOne, // 隐患类型1 ,
        hazardTypeTwo: row.hazardTypeTwo, // 隐患类型2 ,
      }
    },
    back() {
      this.$router.go(-1)
    },

    reset() {
      this.hazardTypeList = []
      this.ruleForm = {
        ruleForm: {
          // pn: 1,
          // ps: 10,
          desc: false, //是否倒叙
          checkProjectTypeOne: '', // 检查项目大类 ,
          checkProjectTypeTwo: '', // 检查项目小类 ,
          checkStandard: '', // 检查标准 ,
          checkType: '', // 检查类别 ,
          hazardLevel: '', // 隐患级别 ,

          hazardTypeOne: '', // 隐患类型1 ,
          hazardTypeTwo: '', // 隐患类型2 ,
          impNo: '', // 导入批次 ,
          standardId: '', // 岗位标准清单id ,
        },
      }
      // 重置
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
#userEditList {
  .headTitleA {
    line-height: 50px;
    padding-left: 20px;
  }
  .split {
    height: 10px;
    background-color: #f6f8f9;
  }
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
  .text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
