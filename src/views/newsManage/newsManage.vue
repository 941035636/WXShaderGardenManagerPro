<template>
  <div id="NewsManage">
    <div class="elesearch" style="padding-right: 0">
      <el-form
        ref="form"
        label-width="90px"
        :model="form"
        class="form"
        id="form"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="标题:" prop="title">
              <el-input
                class="w300"
                placeholder="请输入"
                v-model="form.title"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-right: 20px">
            <el-form-item label="类型:" prop="typeId">
              <el-select
                v-model="form.typeId"
                placeholder="请选择"
                class="w300"
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-right: 20px">
            <el-form-item label="发布机构:" prop="publishOrg">
              <el-input
                class="w300"
                placeholder="请输入"
                v-model="form.publishOrg"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" style="padding-right: 20px">
            <el-form-item label="发布时间:" prop="publishStartTime">
              <el-date-picker
                v-model="dateArray"
                class="w300"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-right: 20px">
            <!--1-有效 2-屏蔽 3-删除-->
            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                class="w300"
                clearable
              >
                <el-option
                  v-for="(item, index) in stateList"
                  :key="index"
                  :label="item.msg"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="btn-box">
          <el-button type="primary" shape="round" @click="getNewList(form)">
            查询
          </el-button>
          <el-button shape="round" @click="resetForm('form')">重置</el-button>
          <el-button
            v-if="$hasBtn('news-add')"
            type="primary"
            @click="goAddNews"
            class="btn"
          >
            发布
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="newsContent">
      <div class="box-card-title" style="text-align: left; line-height: 34px">
        <span class="fb f16 mr20">查询列表</span>
        <span>共计{{ tolnum }}条记录</span>
        <!-- v-if="isAuth('19FC1725855642083919194')" -->
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        header-row-class-name="headName"
        highlight-current-row
        show-header
        fit
        :header-cell-style="getRowClass"
      >
        <el-table-column label="标题" show-overflow-tooltip align="left">
          <template slot-scope="scope" prop="title" align="center">
            <span class="isTop" v-if="scope.row.isTop">置顶</span>
            <span type="text" @click="detail(scope.row.id)" class="link-title">
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="访问（次）"
          prop="count"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="showStatus"
          align="center"
          label="状态"
        ></el-table-column>
        <el-table-column
          prop="showFirstType"
          label="类型 "
          align="center"
        ></el-table-column>
        <el-table-column
          label="发布机构"
          prop="publishOrg"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="发布日期"
          prop="publishTime"
          align="center"
        >
          <template slot-scope="scope">
            <span class="color-red" v-if="scope.row.publishTime > dataTime">
              {{ scope.row.publishTime | setTime }}(未生效)
            </span>
            <span v-else>{{ scope.row.publishTime | setTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <!-- v-if="isAuth('19FC1725855642083919225')" -->
          <template slot-scope="scope">
            <el-button
              type="text"
              class="moreBtn mr10"
              @click="detail(scope.row.id)"
            >
              查看
            </el-button>
            <!-- v-if="isAuth('19FC1725855642083919245')" -->

            <el-dropdown trigger="click">
              <el-button type="text" class="moreBtn">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  class="moreBtn"
                  v-if="$hasBtn('news-update')"
                  @click.native="editNews(scope.row.id)"
                >
                  编辑
                </el-dropdown-item>
                <el-dropdown-item
                  class="moreBtn"
                  v-if="$hasBtn('news-delete')"
                  @click.native="delOne(scope.row.id)"
                >
                  删除
                </el-dropdown-item>
                <el-dropdown-item
                  class="moreBtn"
                  @click.native="openLog(scope.row.id)"
                >
                  查看日志
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next,jumper"
        :total="tolnum"
        :current-page="form.pn"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <addNews @refresh="getNewList" ref="addNews" />
    <log-list ref="logList" />
  </div>
</template>



<script>
import addNews from './news.vue'
import logList from './logList.vue'

import { getNewsList, deleteNews, getNewsType } from '@/api/news.js'
import { getSysDate } from '@/api/userManagement.js'
export default {
  data() {
    return {
      displayQueryForm: true,

      ishow: false,
      selectOneOption: '', //第一级下拉框值
      typeList: [], // 分类数据
      stateList: [
        { code: 1, msg: '草稿' },
        { code: 2, msg: '已发布' },
      ], // 状态数据
      dataTime: '', // 服务器时间
      form: {
        ps: 10,
        pn: 1,
        publishOrg: '',
        publishStartTime: '', // 开始时间
        publishEndTime: '', // 结束时间
        title: '', // 信息标题
        typeId: '', // 分类
        status: '', // 状态
      },
      dateArray: [],
      tableData: [],
      tolnum: 0,
    }
  },
  components: { addNews, logList },
  mounted() {
    this.getNewList()
    this.getSelectForm()
  },
  methods: {
    async getTime() {
      // 获取服务器时间
      let res = await getSysDate()
      if (res.code == '0000') {
        this.dataTime = res.data
        console.log(this.dataTime)
      }
    },
    //获取分类
    async getSelectForm() {
      let res = await getNewsType()
      console.log(res)
      if (res.code == '0000') {
        this.typeList = res.list
      }
      // let rest = await this.newsService.getNewsEnum();
      // console.log(rest)
      // if(rest.code == "0000"){
      //   this.stateList= rest.data.status;
      // }
    },

    //编辑新闻
    editNews(id) {
      console.log(id, '000000')
      this.$refs.addNews.newsId = id
      this.$refs.addNews.dialogVisible = true
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      //修改表头样式
      if (rowIndex == 0) {
        return 'background: #f5f5f5;font-size:14px;font-weight:600;text-align: center;'
      } else {
        return
      }
    },

    //删除新闻
    delOne(id) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteNews(id).then((res) => {
            if (res.code == '0000') {
              this.$message({ message: '删除成功', type: 'success' })
              this.getNewList()
            }
          })
        })
        .catch(() => {})
    },
    resetForm(formName) {
      console.log(this.$refs[formName].resetFields)
      this.form.publishStartTime = ''
      this.form.publishEndTime = ''
      this.$refs[formName].resetFields()
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.form.ps = val
      this.getNewList()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      console.log(val)
      this.form.pn = val
      this.getNewList()
    },

    //发送请求  获取新闻列表接口
    async getNewList(form) {
      this.getTime()
      this.form.publishStartTime = this.dateArray[0] || ''
      this.form.publishEndTime = this.dateArray[1] || ''
      let newsList = await getNewsList(this.form)
      console.log(newsList)
      if (newsList.code == '0000') {
        this.tolnum = newsList.total
        this.tableData = newsList.list
      } else {
        this.$confirm('查询失败', '提示', {
          confirmButtonText: '确定',
        })
      }
    },
    onSubmit() {
      console.log('submit!')
    },
    detail(id) {
      this.$router.push({
        path: '/detailArticle',
        query: {
          id: id,
        },
      })
    },
    openLog(id) {
      this.$refs.logList.id = id
      this.$refs.logList.dialogVisible = true
    },
    goAddNews() {
      this.$refs.addNews.dialogVisible = true
    },
  },
}
</script>
<style lang="scss" scoped>
.el-row {
  display: flex;
}
#NewsManage {
  padding-bottom: 80px;
  .elesearch {
    width: 100%;
    background-color: #ffffff;
    border-radius: 14px;
    padding: 24px;
    padding-bottom: 0;

    box-sizing: border-box;
  }
  .newsContent {
    width: 100%;
    background-color: #ffffff;
    .link-title {
      cursor: pointer;
      color: #0f54a9;
    }
    padding: 0 24px 32px;
    box-sizing: border-box;
  }
  .btn-box {
    text-align: center;
    padding-right: 20px;
  }
  .isTop {
    display: inline-block;
    height: 24px;
    text-align: center;
    line-height: 24px;
    border-radius: 12px;
    width: 50px;
    color: #fff;
    background-color: #ff4d4f;
  }
  .btn1 {
    display: inline-block;
    width: 120px;
    height: 40px;
    color: #213593;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #213593;
    border-radius: 6px;
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
