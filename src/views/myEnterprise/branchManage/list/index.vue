<template>
  <div id="branchManageList">
    <div class="elsearch">
      <!-- <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">清单名称：</span>
            <el-input
              v-model="ruleForm.safetyTechniciansName"
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
      </div> -->
      <div class="ml20 text-right">
        <el-button
          class="ml20"
          type="primary"
          shape="round"
          @click="branchAddOen"
        >
          添加一级部门
        </el-button>
      </div>
    </div>
    <div class="teble-list">
      <el-table
        style="width: 100%; margin-bottom: 20px"
        :data="dataList"
        border
        row-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :header-cell-style="getRowClass"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="部门名称" min-width="250">
          <template slot-scope="scope">
            <div class="tbJump lh40">
              <span
                v-if="!scope.row.topDept"
                style="width: 32px; display: inline-block"
              ></span>
              <input
                class="inlineinput"
                type="text"
                v-model="scope.row.sortNo"
                @blur="changeNo(scope.row)"
                oninput="value=value.replace(/[^0-9且或()]/g, '')"
              />
              <span
                @click="goJob(scope.row.deptNo)"
                :class="!scope.row.topDept ? 'color-blue pointer' : ''"
              >
                {{ scope.row.deptName }}
              </span>
              <span
                class="pointer color-blue"
                style="float: right"
                @click="branchAddTwo(scope.row)"
              >
                {{ scope.row.topDept ? '添加二级部门' : '添加岗位' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.status == '1' ? '正常' : '关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="deptNum"
          label="部门人数"
          min-width="50"
        ></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              class="updateBtn pointer"
              style="padding-left: 20px"
              @click="editDept(scope.row)"
            >
              修改
            </span>
            <span
              class="updateBtn pointer"
              style="padding-left: 20px"
              @click="sysDeptDel(scope.row)"
            >
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="teble-list">
      <el-table
        style="width: 100%; margin: 20px 0"
        :data="jobList"
        border
        :header-cell-style="getRowClass"
      >
        <el-table-column prop="postName" label="岗位名称"></el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status == '1' ? '正常' : '关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="updateBtn pointer" @click="editPost(scope.row)">
              修改
            </span>
            <span
              class="updateBtn pointer"
              style="padding-left: 20px"
              @click="postDel(scope.row)"
            >
              删除
            </span>
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

    <AddOne ref="addOne" />
    <AddTwo ref="addTwo" />
    <AddJob ref="addJob" />
  </div>
</template>
<script>
import AddOne from '../addOne/index'
import AddTwo from '../addTwo/index'
import AddJob from '../addJob/index'
import {
  sysDeptList,
  getPostByDept,
  sysDeptDel,
  delSysPost,
  sysDeptSave,
  getAllPostByDept,
} from '@/api/branchManage'
import { CodeNode } from 'source-list-map'
export default {
  components: { AddOne, AddTwo, AddJob },
  data() {
    return {
      total: 0,
      ruleForm: {
        pn: 1,
        ps: 10,
        depCode: '',
      },

      dataList: [
        {
          id: 1,
          sort: '1',
          name: '技术部门',
          code: 'it0000',
          state: '正常',
          num: '4',
          date: '2016-05-01',
          btn: '2',
          children: [
            {
              id: 31,
              sort: '1',
              name: '前端部门',
              code: 'it0000',
              state: '正常',
              num: '4',
              date: '2016-05-01',
              btn: '3',
            },
            {
              id: 32,
              sort: '2',
              name: '运营部门',
              code: 'it0000',
              state: '正常',
              num: '4',
              date: '2016-05-01',
              btn: '3',
            },
          ],
        },
        {
          id: 2,
          sort: '2',
          name: '技术部门',
          code: 'it0000',
          state: '正常',
          num: '4',
          date: '2016-05-01',
          btn: '2',
          children: [
            {
              sort: '1',
              id: 33,
              name: '前端部门',
              code: 'it0000',
              state: '正常',
              num: '4',
              date: '2016-05-01',
              btn: '3',
            },
          ],
        },
      ],
      jobList: [],
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    async sysDeptDel(row) {
      console.log(row, 'dfdfdfdf')
      // 删除部门(二级部门人数等于0的可删除；一级部门无二级部门可删除；)
      if (!row.topDept && row.deptNum > 0) {
        this.$message.success('部门人员数不为0，无法删除')
        return false
      }
      if (row.topDept && row.children.length > 0) {
        this.$message.success('存在二级部门，无法删除')
        return false
      }
      let res = await sysDeptDel(row.id)
      if (res.code == '0000') {
        this.$message.success('删除成功')
        this.getInit()
      }
    },
    async goJob(code) {
      // 获取部门下的岗位信息
      console.log(code, this.ruleForm.depCode)
      if (this.ruleForm.depCode != code) {
        this.ruleForm.pn = 1
      }
      this.ruleForm.depCode = code
      let res = await getAllPostByDept(code, this.ruleForm)
      if (res.code == '0000') {
        this.jobList = res.data.records
        this.total = res.data.total
      }
    },
    async getInit() {
      let data = {
        createBy: '',
        createTime: '',
      }
      let res = await sysDeptList(data)
      if (res.code == '0000') {
        this.dataList = res.data
      }
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.goJob(this.ruleForm.depCode)
    },
    branchAddOen() {
      this.$refs.addOne.dialogVisible = true
    },
    branchAddTwo(row) {
      // 添加部门
      if (row.topDept) {
        this.$refs.addTwo.dialogVisible = true
        this.$refs.addTwo.branchForm.deptNoTop = row.deptNo
      } else {
        this.$refs.addJob.dialogVisible = true
        this.$refs.addJob.branchForm.deptNo = row.deptNo
      }
    },
    editDept(row) {
      // 修改部门
      if (row.topDept) {
        this.$refs.addOne.dialogVisible = true
        this.$refs.addOne.branchForm.deptName = row.deptName
        this.$refs.addOne.branchForm.deptNo = row.deptNo
        this.$refs.addOne.branchForm.status = row.status
        this.$refs.addOne.branchForm.id = row.id
      } else {
        this.$refs.addTwo.dialogVisible = true
        this.$refs.addTwo.branchForm.deptName = row.deptName
        this.$refs.addTwo.branchForm.deptNo = row.deptNo
        this.$refs.addTwo.branchForm.status = row.status
        this.$refs.addTwo.branchForm.deptNoTop = row.deptNoTop
        this.$refs.addTwo.branchForm.id = row.id
      }
    },
    editPost(row) {
      // 修改岗位
      this.$refs.addJob.dialogVisible = true
      this.$refs.addJob.branchForm.postName = row.postName
      this.$refs.addJob.branchForm.postNo = row.postNo
      this.$refs.addJob.branchForm.status = row.status
      this.$refs.addJob.branchForm.deptNo = row.deptNo
      this.$refs.addJob.branchForm.id = row.id
    },
    async postDel(row) {
      // 岗位删除
      let res = await delSysPost(row.id)
      if (res.code == '0000') {
        this.$message.success('删除成功')
        this.goJob(row.deptNo)
      }
    },
    async changeNo(row) {
      // 修改序号
      let data = {
        deptName: row.deptName,
        deptNo: row.deptNo,
        status: row.status,
        deptNoTop: row.deptNoTop,
        id: row.id,
        sortNo: row.sortNo,
      }
      let res = await sysDeptSave(data)
      if (res.code == '0000') {
        this.getInit()
      } else {
      }
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
<style lang="scss" scpoed>
#branchManageList {
  margin-top: 20px;
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
  .inlineinput {
    width: 32px;
    height: 35px;
    border: 1px solid #f2f2f2;
    line-height: 35px;
    text-align: center;
    color: #6683d5;
    margin-right: 5px;
  }
}
</style>
<style lang="scss">
#branchManageList {
  // 去除el-table中折叠按钮
  .el-table [class*='el-table__row--level'] .el-table__expand-icon {
    display: none !important;
  }
  //无子数据的tb去除自带的占位
  .el-table__indent {
    padding-left: 0 !important;
  }
  .el-table__placeholder {
    display: none !important;
  }
}
</style>