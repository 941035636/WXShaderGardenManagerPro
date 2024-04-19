<template>
  <div id="detailArticle">
    <div class="topHalf">
      <div class="article">
        <h2>{{ data.title }}</h2>
        <p class="subtitle">
          <span class="mr20">分类：{{ data.caseType }}</span>
          <span class="mr20">发布机构：{{ data.organization }}</span>
          <span>发布日期：{{ data.publishTime }}</span>
        </p>
      </div>
      <div class="mainCon">
        <el-divider style="marfgin-top: 0"></el-divider>
        <div style="margin-bottom: 10px">正文内容</div>
        <div class="vcontent ql-editor" v-html="data.content"></div>
        <el-divider></el-divider>
        <p class="fb" style="margin-bottom: 10px">附件列表</p>
        <el-table :data="data.fileList" border style="width: 100%" header-row-class-name="headName"
          :header-cell-style="getRowClass">
          <el-table-column align="left" prop="name" label="附件名称" show-overflow-tooltip></el-table-column>
          <el-table-column width="220" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="downLoad(scope.row.id)">
                下载
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- <div class="recommend">
      <p class="getMore">
        <span class="fb f16">推荐</span>
        <span @click="getMore">查看更多 ></span>
      </p>
      <el-divider></el-divider>
      <div class="recArticle">
        <div @click="changeArticle(item.alias)" v-for="(item, index) in data2" :key="index" class="card">
          <img v-if="item.fileRecordeId == null" src="../../../assets/images/default.png" alt="" />
          <img v-else :src="item.imageId" alt="" />
          <p class="title">{{ item.title }}</p>
          <el-divider></el-divider>
          <p class="foot-info">
            <span class="color-yellow">{{ item.showFirstType }}</span>
            <span>{{ item.publishTime | setTime }}发布</span>
          </p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
// 回显 富文本样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import TipsText from '@/components/TipsText'
import { getAccidentCaseDetail, addAccidentCaseLog } from '@/service/accidentCase'
import ResourcesService from "@/service/ResourcesService";
import merge from 'webpack-merge'
export default {
  name: 'detailArticle',
  components: { TipsText },
  data() {
    return {
      resourcesService: new ResourcesService(),
      data: {},
      data2: [],
    }
  },
  created() {
    this.initDetail()
  },
  methods: {
    async initDetail() {
      let res = await getAccidentCaseDetail(this.$route.query.id)
      if (res.code === '0000') {
        this.data = res.data
        this.addAccidentCaseLog('阅读',res.data.id)
      }
    },
    // 添加操作日志
    async addAccidentCaseLog(type,id) {
      await addAccidentCaseLog({
        accidentCaseId: id,
        actionType: type,
        createBy: window.sessionStorage.getItem('userName'),
        createIp: returnCitySN["cip"],
        title: this.data.title
      })
    },
    changeArticle(id) {
      this.$router.push({ query: merge(this.$route.query, { id: id }) })
      this.initDetail()
    },
    async downLoad(id) {
      let url = `/res/v3/download?applicationName=sequip-svc&businessTypeCode=attachment&businessDataTag=attachment&free=1&fileId=${id}`
      let { code } = await this.resourcesService.downloadOrViewFile(url, true)
      if (code == '0000') {
        this.addAccidentCaseLog('下载',this.data.id)
      }
    },
    getMore() {
      this.$router.push({ path: '/news/newsList' })
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex == 0 ? 'background:#ccc;color:#0050b3' : ''
    },
  },
}
</script>

<style lang='less' >
#detailArticle {
  margin-top: 30px;

  .ql-editor {
    letter-spacing: 2px; //设置文本字母之间的间距
    line-height: 24px; //设置行高
  }

  .topHalf {
    background-color: #fff;
  }

  .article {
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;

    h2 {
      padding-top: 20px;
      padding-bottom: 20px;
    }

    h2,
    .subtitle {
      text-align: center;
    }

    .subtitle {
      color: #919191;
    }
  }

  .mainCon {
    background: #fff;
    padding: 0 10% 30px;
    margin: 0px auto 20px;

    .vcontent img {
      margin: 0 auto;
      display: block;
      width: 300px;
    }
  }

  .recommend {
    padding: 20px;
    background-color: #fff;

    .getMore {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;

      :nth-child(2) {
        cursor: pointer;
      }
    }

    .recArticle {
      display: flex;
      justify-content: flex-start;

      .card {
        width: 24%;
        cursor: pointer;
        margin-right: 1%;
        overflow: hidden;

        .title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        img {
          width: 90%;
          height: 220px;
          display: block;
          margin: 10px auto;
        }

        .foot-info {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;

          :nth-child(1) {
            color: #ffa940;
          }
        }
      }
    }
  }
}
</style>