<template>
  <div class="box">
    <div class="titleClass">隐患验收</div>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">验收状态：</div>
      </el-col>
      <el-col :span="9">
        <div
          v-if="rctification.acceptState === '1'"
          class="grid-content"
          style="color: #569c30; font-weight: 400"
        >
          合格
        </div>
        <div v-else class="grid-content" style="color: red; font-weight: 400">
          <span
            v-if="rectificationJob.todo === '0'"
            style="color: #1784fc; font-weight: 400"
          >
            待验收
          </span>
          <span v-else>
            {{
              rctification.returnStep === '1' ? '打回确认指派' : '打回隐患整改'
            }}
          </span>
        </div>
        <!-- <div
          v-else
          class="grid-content"
          style="color: #1784fc; font-weight: 400"
        >
          待验收
        </div> -->
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">验收日期：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ disposeDate(rctification.acceptTime) }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">验收部门：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ rctification.acceptDeptName || '——' }}
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">验收人：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ rctification.acceptUserName || '——' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">验收描述：</div>
      </el-col>
      <el-col :span="21">
        <div class="grid-content bg-web000">
          {{ rctification.acceptRemark || '——' }}
        </div>
      </el-col>
    </el-row>
    <div class="imgclass">
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
  mounted() {
    this.getImg()
  },
  methods: {
    async getImg() {
      let imgUrlList = []
      for (
        let i = 0;
        i < this.rctification.rectificationProgrammeFileList.length;
        i++
      ) {
        let item = this.rctification.rectificationProgrammeFileList[i]
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