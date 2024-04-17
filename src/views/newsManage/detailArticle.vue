<template>
  <div id="detailArticle">
    <div class="topHalf">
      <div class="article">
        <h2>【{{ data.publishCode }}】{{ data.title }}</h2>
        <p class="subtitle">
          <span class="mr20">分类：{{ data.showFirstType }}</span>
          <span class="mr20">发布机构：{{ data.publishOrg }}</span>
          <span>发布日期：{{ data.publishTime }}</span>
        </p>
      </div>
      <div class="mainCon">
        <el-divider style="marfgin-top: 0"></el-divider>
        <div>正文内容</div>
        <div class="vcontent" v-html="data.content"></div>
        <el-divider></el-divider>
        <p class="fb">附件列表</p>
        <el-table
          :data="data.fileRecord"
          border
          style="width: 80%"
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
        >
          <el-table-column
            align="left"
            prop="fileName"
            label="附件名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column width="220" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="downLoad(scope.row.fileId)">
                下载
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="recommend">
      <p class="getMore">
        <span class="fb f16">推荐</span>
        <span @click="getMore">查看更多 ></span>
      </p>
      <el-divider></el-divider>
      <div class="recArticle">
        <div
          @click="changeArticle(item.id)"
          v-for="(item, index) in data2"
          :key="index"
          class="card"
        >
          <img
            v-if="item.fileRecordeId == -1"
            src="../../assets/images/default.png"
            alt=""
          />
          <img
            v-else
            :src="baseURL + '/news/downloadfile/' + item.fileRecordeId"
            alt=""
          />
          <p class="title">{{ item.title }}</p>
          <el-divider></el-divider>
          <p class="foot-info">
            <span class="color-yellow">{{ item.showFirstType }}</span>
            <span>{{ item.publishTime | setTime }}发布</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { recommendNews, getNewsDetails } from '@/api/news.js'
import TipsText from '@/components/TipsText'
import { baseURL } from '@/config'

import merge from 'webpack-merge'
import { getImgFile, getFile } from '@/api/resources'
export default {
  name: 'detailArticle',
  components: { TipsText },
  data() {
    return {
      baseURL: baseURL,
      data: {},
      data2: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    async getRecommend() {
      let res2 = await recommendNews(this.$route.query.id)
      if (res2.code === '0000') {
        this.data2 = res2.list
      }
    },
    async init() {
      this.getRecommend()
      //初始化数据
      let res = await getNewsDetails(this.$route.query.id)
      if (res.code === '0000') {
        this.data = res.data
      }
    },
    changeArticle(id) {
      console.log(id, '00000')
      this.$router.push({
        query: merge(this.$route.query, { id: id }),
      })
      this.init()
    },
    downLoad(id) {
      let res = getFile('/news/downloadfile/' + this.$route.query.id + '/' + id)
    },
    getMore() {
      this.$router.push({
        path: '/newsList',
      })
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#ccc;color:#0050b3'
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang='scss' >
#detailArticle {
  background-color: #f7f7f7;
  padding: 30px;
  .topHalf {
    background-color: #fff;
  }
  .article {
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
    // h2 {
    //   text-align: center;
    // }
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

          height: 200px;
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