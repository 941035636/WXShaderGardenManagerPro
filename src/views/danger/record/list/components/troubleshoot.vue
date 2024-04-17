<template>
  <div>
    <div class="elsearch">
      <el-row class="row-bg" style="margin-bottom: 20px">
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">清单名称：</span>
            <el-input
              v-model="ruleForm.standardName"
              size="small"
              maxlength="50"
              placeholder="请输入清单名称"
              class="w300"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">所属部门：</span>
            <el-cascader
              class="w280"
              v-model="ruleForm.deptName"
              :options="departmentList"
              clearable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex; align-items: center">
            <span class="item3">所属岗位：</span>
            <el-select
              v-model="ruleForm.postName"
              class="w280"
              placeholder="请选择岗位名称"
              clearable
            >
              <el-option
                v-for="item in position"
                :key="item.id"
                :label="item.postName"
                :value="item.postNo"
              ></el-option>
            </el-select>
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
    <div class="mt8">
      <div class="numberOfBranches">
        <div>共{{ total }}条记录</div>

      </div>
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
        <el-table-column label="清单名称" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.standardName ? scope.row.standardName : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.deptName ? scope.row.deptName : '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属岗位" min-width="40" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.postName ? scope.row.postName : '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="排查频次" min-width="40" align="center">
          <template slot-scope="scope">
            <div style="color: rgb(64, 158, 255)">
              {{ scope.row.frequencyName ? scope.row.frequencyName : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已排查次数" min-width="40" align="center">
          <template slot-scope="scope">
            <div style="color: rgb(64, 158, 255)">
              {{ scope.row.total ? scope.row.total : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发现隐患数" min-width="40" align="center">
          <template slot-scope="scope">
            <div style="color: red">
              {{ scope.row.dangerNum ? scope.row.dangerNum : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          min-width="40"
        >
          <template slot-scope="scope">
            <div
              style="cursor: pointer"
              class="examineClass"
              @click="examineClick(scope.row)"
            >
              查看
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout=" prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  troubleshootingRecords,
  dictTrue,
  getListParams,
} from '@/api/listManage'

export default {
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        desc: false, //是否倒叙
        deptNo: '', //部门名称
        postName: '', // 岗位名称
        standardName: '', //清单名称
      },
      tableList: [],
      total: 0,
      departmentList: [], //部门集合
      position: [], //岗位集合
      checkList: [], //清单集合
    }
  },

  created() {
    this.initData()
  },

  methods: {
    // 跳转详情
    examineClick(row) {
      console.log(row, '000000')
      this.$router.push({
        name: 'checkAndAccept',
        query: {
          standardId: row.standardId, //清单id
        },
      })
    },
    changeIns() {
      // console.log(this.ruleForm.companyIndystryIds)
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
    },

    // 初始化
    async initData() {
      await this.getDictTrue()
      await this.getListParams()
      await this.getList()
    },

    // 反查部门集合 岗位集合
    async getListParams() {
      let res = await getListParams()
      if (res.code == '0000') {
        this.departmentList = res.data.sysDept
          ? this.recursion1(res.data.sysDept)
          : [] //部门
        this.position = res.data.sysPost || [] //岗位
      }
    },
    recursion1(data) {
      data.forEach((e) => {
        e.label = e.deptName
        e.value = e.deptNo
        if (e.children && e.children.length > 0) {
          this.recursion1(e.children)
        } else {
          e.children = undefined
        }
      })
      return data
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

    // 查询
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.getList()
    },
    // 重置
    reset() {
      ;(this.ruleForm = {
        pn: 1,
        ps: 10,
        desc: false, //是否倒叙
        deptName: [], //部门名称
        postName: '', // 岗位名称
        standardName: '', //清单名称
      }),
        this.getList()
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },

    async getList() {
      let form = { ...this.ruleForm }
      form.deptName =
        this.ruleForm.deptName && this.ruleForm.deptName.length > 0
          ? this.ruleForm.deptName[1]
          : '' //发现部门
      let res = await troubleshootingRecords(form)
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


  },
}
</script>
<style lang="scss" scoped>
.numberOfBranches {
  display: flex;
  align-items: center;
  height: 60px;
}
.examineClass {
  color: #1990ff;
}

</style>