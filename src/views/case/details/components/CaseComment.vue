<template>
  <!-- 现场查勘 -->
  <div id="CaseComment">
    <Title title="评价信息"></Title>

    <div class="row">
      <el-row class="row-bg">
        <el-col :span="12">
          <div style="display: flex">
            <span class="title">理赔满意度：</span>
            <el-rate
              v-model="commentData"
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
  name: 'CaseComment',
  components: {
    Title,
  },

  data() {
    return {
      data: {},
      commentData: null,
      texts: ['很差', '差', '一般', '好', '很好'],
    }
  },
  methods: {},
}
</script>

<style scoped lang="scss" scoped>
#CaseComment {
  padding: 0 0 20px;
  margin: 10px 0;
  background-color: #fff;
  .title {
    display: inline-block;
    width: 210px;
    text-align: right;
  }
  .row {
    margin-left: 30px;
    padding: 10px 0;
  }
}
</style>
