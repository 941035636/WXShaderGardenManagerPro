<template>
  <div id="NewsList">
    <div class="headSearch">
      <div>
        <span class="type">类型：</span>
        <p class="option">
          <span v-for="(item, index) in typeList" :key="index" :class="active == index ? 'actived' : ''"
            @click="change(index, item.id)">
            {{ item.name }}
          </span>
        </p>
      </div>
      <div class="search" style="width: 400px; text-align: right;">
        <el-input size="small" clearable placeholder="请输入标题（模糊）" v-model="form.title" style="width: 250px"></el-input>
        <el-button type="primary" size="small" @click="getNewList" round style="margin-left: 10px">查询</el-button>
      </div>
    </div>
    <div class="newsContent">
      <el-table :data="tableData" style="width: 100%" highlight-current-row fit :show-header="false"
        :header-cell-style="getRowClass">
        <el-table-column label="标题" align="left">
          <template slot-scope="scope">
            <div class="con" style="display: flex">
              <img class="tableImg" v-if="scope.row.fileRecordeId !== null" :src="scope.row.imgUrl" alt="" />
              <img class="tableImg" v-else src="../../../assets/images/default.png" alt="" />
              <div class="tableCon">
                <span class="isTop" v-if="scope.row.isTop">置顶</span>
                <span type="text" @click="detail(scope.row.id)" class="link-title">
                  <TipsText :length="40" :text="scope.row.title" />
                </span>
                <p style="color: #101010">
                  简介：
                  <TipsText :length="70" :text="scope.row.summary" />
                </p>
                <p class="subtitle">
                  <span class="mr20">分类：{{ scope.row.showFirstType }}</span>
                  <span class="mr20">
                    发布机构：
                    <TipsText :length="20" :text="scope.row.publishOrg" />
                  </span>
                  <span>发布日期：{{ scope.row.publishTime | setTime }}</span>
                </p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" width="200" label="操作" align="center">
          <template slot-scope="scope">
            <div class="btn-box">
              <p>
                <el-button size="small" class="w100" type="primary" @click="detail(scope.row.alias)"
                  style="margin: 8px 0">
                  查看
                </el-button>
              </p>
              <p>
                <el-button size="small" v-if="scope.row.fileSign" class="w100" @click="openLog(scope.row.id)"
                  style="margin: 8px 0">
                  下载附件
                </el-button>
              </p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <BasePagenations :tolnum="tolnum" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      </BasePagenations>
    </div>
    <el-dialog title="查看附件" :visible.sync="dialogVisible" :close-on-click-modal="false" width="45%" @close="close"
      @open="initData">
      <el-table :data="tableList" border header-row-class-name="headName" :header-cell-style="getRowClass">
        <el-table-column label="附件名称" show-overflow-tooltip>
          <template slot-scope="scope">
            附件{{ scope.$index + 1 }}：{{ scope.row.fileName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190">
          <template slot-scope="scope">
            <el-button type="text" @click="downLoad(scope.row.fileId)">
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>



<script>
import TipsText from '@/components/TipsText'
import AccidentCases from '@/service/accidentCases'
import ResourcesService from "@/service/ResourcesService";
import { getAccidentCaseList, getAccidentCaseLogList, getDateTime, deleteAccidentCase, addAccidentCaseLog } from '@/service/accidentCase'//特设

export default {
  name: 'newsList',
  components: { TipsText },
  data() {
    return {
      resourcesService: new ResourcesService(),
      accidentCases: new AccidentCases(),
      typeList: [], // 分类数据
      dataTime: '', // 服务器时间
      active: 0,
      newsId: null,
      form: {
        ps: 10,
        pn: 1,
        publishEndTime: '', // 结束时间
        title: '', // 信息标题
        typeId: '', // 分类
        status: 2, // 状态
        type : 1,
      },
      dialogVisible: false,
      dateArray: [],
      tableData: [],
      tableList: [],
      tolnum: 0,
    }
  },
  created() {
    this.getNewList()
    this.getSelectForm()
  },
  methods: {
    async getTime() {
      // 获取服务器时间
      let res = await this.accidentCases.getSysDate()
      if (res.code == '0000') {
        this.dataTime = res.data
      }
    },
    //获取分类
    async getSelectForm() {
      let columnList = await this.accidentCases.caseCategor()
      if (columnList.code == '0000') {
        this.typeList = columnList.list
        this.typeList.unshift({
          name: '全部',
          id: '',
        })
      }
    },

    getRowClass({ row, column, rowIndex, columnIndex }) {
      //修改表头样式
      if (rowIndex == 0) {
        return 'background: #ccc;font-size:14px;font-weight:600;'
      } else {
        return
      }
    },
    async initData() {
      let res = await this.accidentCases.caseDetail(this.newsId)
      if (res.code === '0000') {
        this.tableList = res.data.fileRecord
      }
    },
    close() {
      this.tableList = []
      this.newsId = null
    },
    async downLoad(id) {
      let res = await this.accidentCases.informationDownloadFile(this.newsId, id)
      let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
      let str = res.headers['content-disposition'];
      const fileName = decodeURI(str.substr(str.indexOf("=") + 1, str.length));
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
    resetForm(formName) {
      this.form.publishStartTime = ''
      this.form.publishEndTime = ''
      this.$refs[formName].resetFields()
    },
    handleSizeChange(val) {
      this.form.ps = val
      this.getNewList()
    },
    handleCurrentChange(val) {
      this.form.pn = val
      this.getNewList()
    },

    //发送请求  获取新闻列表接口
    async getNewList(form) {
      await this.getTime()
      this.form.publishEndTime = this.dataTime
      let newsList = await this.accidentCases.caseList(this.form)
      if (newsList.code == '0000') {
        this.tolnum = newsList.total
        let tableData = []
        if (newsList.list != undefined) {
          tableData = newsList.list
        }
        if (tableData.length) {
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].fileRecordeUrl) {
              this.resourcesService.downloadOrViewFile(tableData[i].fileRecordeUrl).then(({ code, url }) => {
                if (code == '0000') {
                  tableData[i]['imgUrl'] = url
                  this.tableData = JSON.parse(JSON.stringify(tableData))
                }
              })
            } else {
              this.tableData = JSON.parse(JSON.stringify(tableData))
            }
          }
        } else {
          this.tableData = JSON.parse(JSON.stringify(tableData))
        }
        console.log(this.tableData);
      } else {
        this.$confirm('查询失败', '提示', {
          confirmButtonText: '确定',
        })
      }
    },
    onSubmit() {
      console.log('submit!')
    },
    change(index, id) {
      this.active = index
      this.form.typeId = id
      this.getNewList()
    },
    openLog(id) {
      this.newsId = id
      this.dialogVisible = true
    },
    detail(id) {
      this.$router.push({
        path: '/news/detailArticle',
        query: {
          id: id,
        },
      })
    },
  },
}
</script>
<style lang="less" scoped>
.el-row {
  display: flex;
}

#NewsList {
  margin-top: 20px;
  padding-bottom: 20px;
  background: #f7f7f7;

  .headSearch {
    width: 100%;
    background-color: #ffffff;

    padding: 30px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    box-sizing: border-box;

    .type {
      vertical-align: middle;
    }

    .option {
      display: inline-block;

      span {
        margin-left: 10px;
        text-align: center;
        padding: 4px 25px;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        color: #333;
        border-radius: 4px;
      }

      .actived {
        color: #fff;
        background-color: #409EFF;
      }
    }
  }

  .newsContent {
    width: 100%;
    background-color: #ffffff;

    padding: 20px 24px 32px;
    box-sizing: border-box;

    .con {
      padding: 10px;
    }
  }

  .tableImg {
    width: 170px;
    height: 150px;
    margin-right: 20px;
    display: inline-block;
  }

  .tableCon {
    padding-top: 20px;
    box-sizing: border-box;
    text-align: left;

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

    .link-title {
      cursor: pointer;
      color: #409EFF;
    }

    .subtitle {
      color: #919191;
    }
  }

  .btn-box {
    border-left: 1px dashed #ccc;
  }

  .btn1 {
    display: inline-block;
    width: 120px;
    height: 40px;

    color: #409EFF;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #409EFF;
    border-radius: 6px;
  }
}
</style>

