<template>
  <div id="Evaluate">
    <Title :title="title" />
    <div class="content_item lh30">
      <el-row class="mt10 mb15 lh30">
        <el-col :span="12">
          <div style="display: flex">
            <span class="con">投保满意度：</span>
            <el-rate
              value="commentData"
              class="rate"
              disabled
              :texts="texts"
              show-text
            ></el-rate>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Title from '@/components/NewTitle'
export default {
  name: 'Evaluate',
  components: { Title },
  props: {
    commentData: {
      type: Number,
      requires: true,
      default: () => {},
    },
  },
  data() {
    return {
      texts: ['很差', '差', '一般', '好', '很好'],

      title: '评价信息',
    }
  },
  mounted() {
    setTimeout(() => {
      console.log(this.commentData)
    }, 4000)
  },
}
</script>
<style lang="scss" scoped>
#Evaluate {
  padding: 0;
  margin: 10px 0;
  background-color: #fff;
}
.con {
  margin-left: 30px;
  margin-right: 20px;
  vertical-align: top;
}
.rate {
  margin-top: 5px;
}
.searve {
  text-align: end;
  color: #000;
  font-weight: bolder;
}
</style>
