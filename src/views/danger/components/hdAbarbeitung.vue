<template>
  <div class="box">
    <div class="titleClass">隐患整改</div>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">整改状态：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content" style="color: #569c30; font-weight: 400">
          {{ rectificationJob.todo === '0' ? '待整改' : '已整改' }}
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">整改日期：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ disposeDate(rctification.rectificationTime) }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">整改部门：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ rctification.rectificationDeptName || '——' }}
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">整改人：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ rctification.rectificationUserName || '——' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">整改情况：</div>
      </el-col>
      <el-col :span="21">
        <div class="grid-content bg-web000">
          {{ rctification.rectificationRemark || '——' }}
        </div>
      </el-col>
    </el-row>
    <div class="imgclass">
      <!-- rctification -->
      <div class="files" v-for="(item, index) in imgUrlList" :key="index">
        <img :src="item.data" alt="" class="imageClass" />
      </div>
    </div>
  </div>
</template>
<script>
import { getImgFile } from '@/api/resources'

export default {
  props: {
    rctification: {
      type: Object,
      requires: true,
    },
    rectificationJob: {
      type: Object,
      requires: true,
    },
  },
  data() {
    return {
      imgUrlList: [],
    }
  },

  // watch: {
  //   'rctification.rectificationFileList': {
  //     handler() {},
  //     immediate: true,
  //     deep: true,
  //   },
  // },
  mounted() {
    this.getImg()
  },
  methods: {
    async getImg() {
      let imgUrlList = []
      for (let i = 0; i < this.rctification.rectificationFileList.length; i++) {
        let item = this.rctification.rectificationFileList[i]
        console.log(item, 'dfdfdfdf')
        let data = await getImgFile('/files/downloadfile/' + item.id)
        imgUrlList.push(data)
      }
      console.log(imgUrlList)
      this.imgUrlList = imgUrlList
    },
    async getImgFile(e) {
      let { data } = await getImgFile('/files/downloadfile/' + e)
      return data
    },
    disposeDate(e) {
      if (e) {
        return e.slice(0, 10)
      } else {
        return '——'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  .titleClass {
    color: #096dd9;
    padding-left: 10px;
    margin-bottom: 20px;
    border-left: 3px solid #096dd9;
    line-height: 20px;
    font-size: 16px;
  }
  .grid-content {
    margin-bottom: 10px;
    border-radius: 4px;
    min-height: 36px;
    line-height: 36px;
  }
  .bg-purple {
    color: #6e6d6d;
  }
  .bg-web {
    font-weight: 500;
    color: #000;
  }
  .bg-web000 {
    color: #000;
    font-weight: 400;
  }
  .imgclass {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    .files {
      margin: 5px;
      // width: calc(100% / 9 - 10px);
      // height: 100px;
      width: 180px;
      height: 110px;
      background-color: #096dd9;
      border-radius: 8px;
      .imageClass {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>