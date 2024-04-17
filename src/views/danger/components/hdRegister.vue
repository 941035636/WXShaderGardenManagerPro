<template>
  <div class="box">
    <div class="titleClass">隐患登记</div>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">清单名称：</div>
      </el-col>
      <el-col :span="21">
        <div class="grid-content bg-web">
          {{ rctification.standardName || '——' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">检查项目：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ rctification.checkProjectTypeOne || '——' }}
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">检查标准：</div>
      </el-col>
      <el-col :span="9">
        <div
          class="grid-content bg-web000"
          style="display: flex; align-items: center"
        >
          <div class="widthRestriction" ref="widthRestrictionRefs">
            <span ref="widthRestrictionSpanRefs">
              {{ rctification.checkStandard || '——' }}
            </span>
          </div>
          <el-popover
            v-if="widthShow"
            placement="bottom"
            title="标题"
            width="200"
            trigger="click"
            :content="rctification.checkStandard"
          >
            <el-button
              type="text"
              slot="reference"
              style="color: #fa8c16; cursor: pointer"
            >
              更多
            </el-button>
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">隐患类型：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content" style="color: #1990ff">
          {{
            rctification.hazardTypeOne && rctification.hazardTypeTwo
              ? hiddenDangerState[rctification.hazardTypeOne] +
                '/' +
                hiddenDangerState[rctification.hazardTypeTwo]
              : '——'
          }}
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">隐患级别：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ transition(rctification.hazardLevel) || '——' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">隐患发现人：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ rctification.findUserName || '——' }}
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">隐患发现日期：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ disposeDate(rctification.hazardFindTime) || '——' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">整改部门：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ supplementData.rectificationDeptName || '——' }}
          <span style="color: #fa8c16">
            （整改岗位：{{
              supplementData.rectificationPostName
                ? supplementData.rectificationPostName
                : '未指派'
            }}）
          </span>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple">限时整改日期：</div>
      </el-col>
      <el-col :span="9">
        <div class="grid-content bg-web000">
          {{ disposeDate(rctification.rectificationLimited) }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">验收部门：</div>
      </el-col>
      <el-col :span="21">
        <div class="grid-content bg-web000">
          {{ supplementData.acceptDeptName || '——' }}
          <span style="color: #fa8c16">
            （验收岗位：{{
              supplementData.acceptPostName
                ? supplementData.acceptPostName
                : '未指派'
            }}）
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">隐患描述：</div>
      </el-col>
      <el-col :span="21">
        <div class="grid-content bg-web000">
          {{ rctification.hazardDescription || '——' }}
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
import { getItems } from '@/api/user'
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
    supplementData: {
      type: Object,
      requires: true,
    },
  },
  data() {
    return {
      hiddenDangerState: [],
      rankData: [],
      widthShow: false,
      imgUrlList: [],
    }
  },
  created() {
    this.getHiddenDangerState()
    this.rankClick()
  },
  mounted() {
    let devWidth = this.$refs.widthRestrictionRefs.offsetWidth
    let spanWidth = this.$refs.widthRestrictionSpanRefs.offsetWidth
    if (spanWidth > devWidth) {
      this.widthShow = true
    }
    this.getImg()
  },
  methods: {
    lalalal() {
      console.log(this.rctification.checkStandard, '0000----')
    },
    async getImg() {
      let imgUrlList = []
      if (this.rctification.hazardFileList) {
        for (let i = 0; i < this.rctification.hazardFileList.length; i++) {
          let item = this.rctification.hazardFileList[i]
          let data = await getImgFile('/files/downloadfile/' + item.id)
          imgUrlList.push(data)
        }
        console.log(imgUrlList)
        this.imgUrlList = imgUrlList
      }
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
    async getHiddenDangerState() {
      let res = await getItems('50002')
      if (res.code === '0000') {
        this.hiddenDangerState = this.setDiGuiDataObj(res.data)
      }
    },
    async rankClick() {
      let res = await getItems('50001')
      if (res.code === '0000') {
        this.rankData = res.data
        console.log(res)
      }
    },
    transition(e) {
      let type = '——'
      this.rankData.forEach((res) => {
        if (res.itemValue === e) {
          type = res.itemText
        }
      })
      return type
    },
    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].sysDictItemEntitys) {
          obj[list[i].itemValue] = list[i].itemText
          this.setDiGuiDataObj(list[i].sysDictItemEntitys, obj)
        } else {
          obj[list[i].itemValue] = list[i].itemText
        }
      }
      return obj
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
  .widthRestriction {
    width: 90%;
    height: 100%;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .imgclass {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    .files {
      margin: 5px;
      // width: calc(100% / 9 - 10px);
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