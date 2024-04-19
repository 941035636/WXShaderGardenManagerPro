<template>
  <div id="NewsManage">
    <div class="elesearch" style="padding-right: 0">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display:flex;">
            <span class="item3">标题</span>
            <el-input class="item2" placeholder="请输入" v-model="form.title" clearable></el-input>
          </div>
        </el-col>
        <!-- <el-col :span="8">
          <div style="display:flex;">
            <span class="item3">类型</span>
            <el-select v-model="form.typeId" placeholder="请选择" class="item2" clearable>
              <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col> -->
        <el-col :span="8">
          <div style="display:flex;">
            <span class="item3">类型</span>
            <el-select v-model="form.typeId" placeholder="请选择分类" class="item5" clearable @change="lastClassSelect()">
              <el-option v-for="item in typeSecondIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <span class="item1">一</span>
            <el-select v-model="form.lastId" placeholder="请选择分类" clearable class="item5">
              <el-option v-for="item in lastSecondIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display:flex;">
            <span class="item3">发布机构</span>
            <el-input class="item2" placeholder="请输入" v-model="form.publishOrg" clearable></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <div style="display:flex;">
            <span class="item3">发布日期</span>
            <el-date-picker v-model="dateArray" class="item2" type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeChange"></el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display:flex;">
            <span class="item3">状态</span>
            <el-select v-model="form.state" placeholder="请选择" class="item2" clearable>
              <el-option v-for="(item, index) in stateList" :key="index" :label="item.msg" :value="item.msg">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display:flex;">
            <div class="btn-box">
              <el-button type="primary" shape="round" @click="getCaseList(form)">
                查询
              </el-button>
              <el-button shape="round" @click="resetForm">重置</el-button>

            </div>
          </div>

        </el-col>
      </el-row>


    </div>

    <el-tabs type="border-card" v-model="form.parentId" @tab-click="searchFun" class="state-style">
      <el-tab-pane :label="item.name" :name="item.id" v-for="(item, index) in typeList" :key="index"></el-tab-pane>
    </el-tabs>

    <div class="newsContent">
      <el-row>
        <el-col :span="24">
          <div style="width: 100%;text-align: right">
            <el-button type="primary" @click="goAddNews" class="btn" style="margin-bottom: 20px">发布</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableData" border style="width: 100%" header-row-class-name="headName" highlight-current-row
        show-header fit :header-cell-style="getRowClass">
        <el-table-column label="标题" show-overflow-tooltip align="left" width="400">
          <template slot-scope="scope" prop="title" align="center">
            <div class="protCon">
              <div class="isTop" v-if="scope.row.top">置顶</div>
              <div class="protConSm">
                <span type="text"
                  @click="detail(scope.row.alias, scope.row.templateType, scope.row.jumpAddress, scope.row.state)"
                  class="link-title">
                  {{ scope.row.title.replace(/^\s*|\s*$/g, "") }}
                </span>
                <span v-if="scope.row.alias">
                  <span>NO:</span>
                  <span>{{ scope.row.alias }}</span>
                  <span style="text-decoration:underline;" 
                  class="link-title" 
                  @click="editAlias(scope.row.id, scope.row.alias, scope.row.typeId)">
                    修改
                  </span>
                </span>
              </div>

            </div>



          </template>
        </el-table-column>
        <el-table-column label="访问（次）" prop="pv" align="center"></el-table-column>
        <el-table-column prop="state" align="center" label="状态">
          <template slot-scope="scope">
            <div :style="{ 'color': scope.row.state == '已发布' ? '#FA8C16' : '#1890FF' }">{{ scope.row.state }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="showFirstType" label="类型 " align="center"></el-table-column>

        <el-table-column label="来源" prop="organization" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column show-overflow-tooltip label="发布日期" prop="publishTime" align="center" width="250px">
          <template slot-scope="scope">
            <span class="color-red" v-if="new Date(Date.parse(scope.row.publishTime)) > new Date(Date.parse(dataTime))">
              {{ scope.row.publishTime | setTime }}(未生效)
            </span>
            <span v-else>{{ scope.row.publishTime | setTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <!-- v-if="isAuth('19FC1725855642083919225')" -->
          <template slot-scope="scope">
            <el-button type="text" class="moreBtn mr10"
              @click="detail(scope.row.alias, scope.row.templateType, scope.row.jumpAddress, scope.row.state)">
              查看
            </el-button>
            <!-- v-if="isAuth('19FC1725855642083919245')" -->

            <el-dropdown trigger="click">
              <el-button type="text" class="moreBtn">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="moreBtn"
                  @click.native="editNews(scope.row.id, scope.row.alias, scope.row.typeId)">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item class="moreBtn" @click.native="delOne(scope.row)">
                  删除
                </el-dropdown-item>
                <el-dropdown-item class="moreBtn" @click.native="openLog(scope.row)">
                  查看日志
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <BasePagenations :tolnum="tolnum" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </BasePagenations>
    </div>
    <addNews @refresh="getCaseList" ref="addNews" />
    <addAlias @refresh="getCaseList" ref="addAlias" />
    <log-list ref="logList" />
  </div>
</template>



<script>
import addNews from './news.vue'
import addAlias from './addAlias.vue'

import logList from './logList.vue'
import AccidentCases from '@/service/accidentCases' //安保网
import { getAccidentCaseList, getAccidentCaseLogList, getDateTime, deleteAccidentCase, addAccidentCaseLog } from '@/service/accidentCase'//特设
export default {
  components: { addNews,addAlias, logList },
  data() {
    return {
      accidentCases: new AccidentCases(),
      displayQueryForm: true,
      ishow: false,
      selectOneOption: '', //第一级下拉框值
      typeList: [{}, {}], // 分类数据
      typeSecondIdList: [],
      lastSecondIdList: [],
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
        lastId: "",//分类三级
        typeId: '', // 分类二级
        parentId: '',//分类一级
        // status: '', // 状态
        state:"",
      },
      dateArray: [],
      tableData: [],
      tolnum: 0,
    }
  },
  created() {
    this.getSelectForm()
  },

  watch: {
    "form.parentId": {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.getClassSelect()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    timeChange(value) {
      console.log("🚀 ~ file: newsManage.vue ~ line 178 ~ timeChange ~ value", value)
      if (this.dateArray == null) {
        this.form.publishStartTime = ''
        this.form.publishEndTime = ''
        return
      }
      if (this.dateArray[0]) {
        this.dateArray[0] = this.dateArray[0] + ' 00:00:00'
      }

      if (this.dateArray[1]) {
        this.dateArray[1] = this.dateArray[1] + ' 23:59:59'
      }
    },
    async getTime() {
      // 获取服务器时间
      let res = await this.accidentCases.getSysDate()
      if (res.code == '0000') {
        this.dataTime = res.data
      }
    },
    //获取分类
    async getSelectForm() {
      let res = await this.accidentCases.caseCategor()
      console.log(res)
      if (res.code == '0000') {
        this.form.parentId = res.list[0].id || '' //默认一级ID
        this.typeList = res.list
        this.getCaseList()
      }
    },
    //获取下拉类别列表   二级菜单展示
    getClassSelect() {
      this.form.typeId = '';
      this.form.lastId = '';
      this.lastSecondIdList = []
      this.typeSecondIdList = this.typeList.find(item => item.id == this.form.parentId).childrenCate
    },
    //三级菜单展示
    lastClassSelect() {
      this.form.lastId = '';
      this.lastSecondIdList = this.typeSecondIdList.find(item => item.id == this.form.typeId).childrenCate
    },

    //编辑别名
    editAlias(id, alias) {
      this.$refs.addAlias.newsId = id
      this.$refs.addAlias.theAlias = alias
      this.$refs.addAlias.dialogVisible = true
    },

    //编辑新闻
    editNews(id, alias) {
      this.$refs.addNews.newsId = id
      this.$refs.addNews.theAlias = alias
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
    //删除事故案例
    delOne(data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.deleteCase(data)
      }).catch(() => { })
    },
    // 重置
    resetForm() {
      this.form = {
        ps: 10,
        pn: 1,
        publishOrg: '',
        publishStartTime: '', // 开始时间
        publishEndTime: '', // 结束时间
        title: '', // 信息标题
        typeId: '', // 分类二级
        lastId: "",//分类三级
        parentId: this.form.parentId,//分类 一集
        // status: '', // 状态
        state:"",
      }
      this.form.publishStartTime = ''
      this.form.publishEndTime = ''
      this.dateArray = []
      this.getCaseList()
    },
    handleSizeChange(val) {
      this.form.ps = val
      this.getCaseList()
    },
    handleCurrentChange(val) {
      this.form.pn = val
      this.getCaseList()
    },

    searchFun() {
      this.form.ps = 10
      this.form.pn = 1
      this.getClassSelect()
      this.getCaseList()
    },

    // 获取事故案例列表
    async getCaseList() {
      console.log(this.form, 'this.form');
      this.getTime()
      if (this.dateArray != null) {
        this.form.publishStartTime = this.dateArray[0] || ''
        this.form.publishEndTime = this.dateArray[1] || ''
      }
      let caseObj = {}
      caseObj = { ...this.form }
      caseObj.typeId = ''
      caseObj.type = ''
      if (this.form.parentId) {
        console.log('1');
        caseObj.typeId = this.form.parentId
        caseObj.type = 1
      }
      if (this.form.typeId) {
        console.log('2');
        caseObj.typeId = this.form.typeId
        caseObj.type = 2
      }
      if (this.form.lastId) {
        console.log('3');
        caseObj.typeId = this.form.lastId
        caseObj.type = 3
      }
      delete caseObj.parentId;
      delete caseObj.lastId;
      let newsList = await getAccidentCaseList(caseObj) //特设
      if (newsList.code == '0000') {
        this.tolnum = newsList.total
        this.tableData = newsList.list
      } else {
        this.$confirm('查询失败', '提示', {
          confirmButtonText: '确定',
        })
      }
    },
    // 删除事故案例
    async deleteCase(data) {
      let { code } = await deleteAccidentCase(data.id)
      if (code == '0000') {
        this.$message.success("删除成功");
        this.getCaseList()
      }
    },
    onSubmit() {
      console.log('submit!')
    },
    detail(alias, templateType, jumpAddress, showStatus) {
      if (templateType == '02' && showStatus == '已发布') {
        window.open(jumpAddress, '_blank')
      }
      else {
        this.$router.push({
          path: '/news/detailArticle',
          query: {
            id: alias,
          },
        })
      }
      // this.$router.push({
      //   path: '/news/detailArticle',
      //   query: {
      //     id: alias,
      //   },
      // })
    },
    openLog(data) {
      // this.$refs.logList.id = id
      this.$refs.logList.data = data
      this.$refs.logList.dialogVisible = true
    },
    goAddNews() {
      this.$refs.addNews.ruleForm.parentId = this.form.parentId || ''
      this.$refs.addNews.dialogVisible = true
    },
  },
}
</script>
<style lang="less" scoped>
.el-row {
  display: flex;
}

#NewsManage {
  padding-bottom: 80px;

  .elesearch {
    width: 100%;
    margin: 20px 0;
    background-color: #fff;
    padding: 20px 30px;
    box-sizing: border-box;

    .row-bg {
      margin-bottom: 20px;
      line-height: 40px;

      .item1 {
        display: block;
        width: 10%;
        text-align: center;
      }

      .item2 {
        width: 70%;
      }

      .item3 {
        font-size: 14px;
        color: #666666;
        display: block;
        width: 25%;
        text-align: right;
        padding-right: 10px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item5 {
        width: 30%;
      }
    }

    .elesearch-btn {
      width: 100%;
      height: 100%;
      text-align: center;
      color: #ffffff;

      .query-button {
        display: inline-block;
        width: 120px;
        height: 40px;
        background-color: #f3ac56;
        text-align: center;
        line-height: 40px;
        margin-right: 40px;
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;
        border-radius: 60px;
      }
    }
  }

  .item2 {
    width: 70%;
  }

  .elesearch {
    width: 100%;
    background-color: #ffffff;
    // border-radius: 14px;
    padding: 24px;
    padding-bottom: 4px;
    // padding-bottom: 2;

    box-sizing: border-box;
  }

  .newsContent {
    width: 100%;
    background-color: #ffffff;

    .protCon {
      display: flex;
      align-items: center;

      .protConSm {
        display: flex;
        // align-items: center;
        flex-direction: column;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 26px;
      }
    }

    .isTop {
      height: 24px;
      text-align: center;
      line-height: 24px;
      border-radius: 12px;
      width: 50px;
      color: #fff;
      background-color: #ff4d4f;
      margin-right: 20px;
    }

    .link-title {
      cursor: pointer;
      color: #096DD9;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    padding: 20px 24px 32px;
    box-sizing: border-box;
  }

  .btn-box {
    width: 100%;
    text-align: center;
    padding-right: 20px;
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
<style lang="less">
html body .el-table .headName .cell {
  font-weight: bold;
}

#NewsManage {

  .state-style {
    background-color: #ffffff;
    font-size: 16px;

    .is-active {
      background: #fbaa48;
      color: #fbfbfb !important;
      font-size: 16px;
      border-right-color: #fbaa48;
      border-left-color: #fbaa48;
    }

    .el-tabs__header {
      background-color: #ffffff;
      border-bottom: 2px solid #fbaa48;
      margin: 0;
    }

    .el-tabs__content {
      display: none;
    }

    .el-tabs__item {
      padding: 0 35px;
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 16px;
      font-weight: 500;
      color: #101010;
      position: relative;
    }
  }

}
</style>
