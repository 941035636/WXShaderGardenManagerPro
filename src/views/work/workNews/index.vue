<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">标题：</span>
            <el-input
              v-model="ruleForm.title"
              size="small"
              placeholder="请输入标题"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">类别：</span>
            <el-select
              v-model="ruleForm.typeId"
              class="w524"
              clearable
              placeholder="请选择类别"
            >
              <el-option
                v-for="(item, key) in typeData"
                :key="key"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select
              v-model="ruleForm.newsStatus"
              class="w450"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                v-for="(item, key) in statusData"
                :key="key"
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
            <span class="item3">发布时间：</span>
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
            prop="title"
            label="标题"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="visitNums"
            label="访问人数"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="typeName"
            label="类别"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="updateByName"
            label="发布人"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="publishTime"
            label="发布时间"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="newsStatusName"
            label="状态"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="detail(scope.row)">详情</el-button>
              <el-button
                v-if="scope.row.newsStatus !== 3"
                type="text"
                @click="update(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="scope.row.newsStatus !== 3"
                type="text"
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
  </div>
</template>

<script>
import { delExpert } from '@/api/userDataManagement'
import { getNewsList, getNewsType, deleteNews } from '@/api/news'
export default {
  name: 'SeeList',
  components: {},
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        title: '',
        typeId: '',
        typeName: '',
        newsStatus: '',
        publishStartTime: '',
        publishEndTime: '',
        orderby: '',
        desc: false,
      },
      // 时间数组
      dateArray: [],
      tableList: [],
      typeData: [],
      statusData: [
        {
          code: 1,
          label: '草稿',
        },
        {
          code: 2,
          label: '发布中',
        },
        {
          code: 3,
          label: '已删除',
        },
      ],
      total: 0,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      await this.getNewsType()
      this.getList()
    },
    async getNewsType() {
      let res = await getNewsType()
      if (res.code === '0000') {
        this.typeData = res.list.map((item) => {
          return {
            code: item.id,
            label: item.typeName,
          }
        })
      }
    },
    async getList() {
      let res = await getNewsList(this.ruleForm)
      if (res.code === '0000') {
        this.tableList = res.list
        this.total = res.total
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.publishStartTime =
        this.dateArray && this.dateArray[0]
          ? this.dateArray[0] + ' 00:00:00'
          : ''
      this.ruleForm.publishEndTime =
        this.dateArray && this.dateArray[1]
          ? this.dateArray[1] + ' 23:59:59'
          : ''
      this.getList()
    },
    detail(row) {
      this.$router.push({
        path: 'detailsNews',
        query: {
          id: row.id,
        },
      })
    },
    update(row) {
      this.$router.push({
        path: 'workAdd',
        query: {
          id: row.id,
        },
      })
    },
    async delet(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deleteNews(row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.getList()
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    add() {
      this.$router.push({
        path: 'workAdd',
      })
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        beginCreateTime: '',
        endCreateTime: '',
        expertType: '',
        name: '',
        status: '',
        specialty: '',
        orderby: '',
        desc: false,
      }
      this.getList()
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
