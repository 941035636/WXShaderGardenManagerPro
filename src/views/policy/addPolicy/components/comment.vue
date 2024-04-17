<template>
  <div id="commentAdd">
    <div class="content_item ml30 lh30">
      <el-row class="mt10 mb15 lh30">
        <el-col :span="12">
          <div style="display: flex">
            <el-form
              ref="ruleForm"
              label-position="right"
              label-width="120px"
              :inline="true"
              :model="FormData"
              :rules="rules"
            >
              <el-form-item label="投保满意度" prop="comment">
                <el-rate
                  class="mt5"
                  v-model="FormData.comment"
                  :texts="texts"
                  :text-color="'#f7ba2a'"
                  show-text
                ></el-rate>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Title from '@/components/NewTitle'
export default {
  name: 'commentAdd',
  components: { Title },
  props: {},
  data() {
    return {
      texts: ['很差', '差', '一般', '好', '很好'],
      FormData: {
        comment: 5,
      },
      rules: {
        comment: [
          {
            required: true,
            message: '请填写评价',
            trigger: 'change',
          },
        ],
      },
    }
  },
  methods: {
    changeV(value) {
      console.log(value)
    },
    async save() {
      await this.$store.commit('policyInfo/comment', this.FormData.comment)
    },
  },
}
</script>
<style lang="scss" scoped>
#commentAdd {
  padding: 0;
  margin: 10px 0;
  background-color: #fff;
}
</style>
