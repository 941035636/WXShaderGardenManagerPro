<template>
  <div id="rewardsDetail">
    <div class="top">
      <Title title="奖惩详情"></Title>
      <el-button type="info" class="back" @click="back">返回</el-button>
    </div>
    <div class="descriptions-content mt20">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">实施奖惩单位</template>
          {{ detail.name }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">被奖惩机构（人）名称</template>
          {{ detail.objectName }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">被奖惩机构（人）类型</template>
          {{ detail.objectType }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">被奖惩机构（人）社会信用代码</template>
          {{ detail.objectBlCode }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">奖惩类型</template>
          {{ detail.rwdPhbType }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">奖惩时间</template>
          {{ detail.rwdPhbTime.split(' ')[0] }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">奖惩事项</template>
          {{ detail.rwdPhbItems }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">奖惩原因</template>
          {{ detail.rwdPhbReason }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { mapGetters } from 'vuex'
  import { findRewardsById } from '@/api/supervise'
  export default {
    name: 'RewardsDetail',
    components: {
      Title,
    },
    data() {
      return {
        detail: {},
        coverRewardsTypeOptions: [],
        rewardsType: [],
      }
    },
    computed: {
      ...mapGetters({
        enumData: 'enums/getStrEnumAll',
      }),
    },
    created() {
      this.init()
    },
    activated() {
      this.findRewardsById(this.$route.query.id)
    },
    methods: {
      init() {
        this.findRewardsById(this.$route.query.id)
        this.coverRewardsTypeOptions = this.enumData.RespondentEnum || []
        this.rewardsType = this.enumData.PunishmentTypeEnum || []
      },
      async findRewardsById(id) {
        let { code, data } = await findRewardsById(id)
        if (code === '0000') {
          let rewardsType = this.rewardsType.find(
            (item) => item.strCode === data.rwdPhbType
          )
          let objectType = this.coverRewardsTypeOptions.find(
            (item) => item.strCode === data.objectType
          )
          data.rwdPhbType = rewardsType ? rewardsType.label : ''
          data.objectType = objectType ? objectType.label : ''
          this.detail = data
        }
      },
      async toThisTag() {
        const view = this.visitedRoutes.filter((item, index) => {
          if (item.path !== this.$route.fullPath) {
            return item
          }
        })
        await this.$store.dispatch('tabsBar/delOthersRoutes', view)
        this.$router.go(-1)
        return view
      },
      back() {
        this.$router.go(-1)
      },
    },
  }
</script>

<style lang="scss" scoped>
  #rewardsDetail {
    margin: 20px;
    .descriptions-content {
      width: 800px;
    }
    .top {
      position: relative;
      width: 100%;
      .back {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
    ::v-deep .el-descriptions-item__label.is-bordered-label {
      width: 10%;
      font-size: 12px;
      color: #000;
    }
    ::v-deep .el-descriptions-item__content {
      width: 30%;
    }
  }
</style>
