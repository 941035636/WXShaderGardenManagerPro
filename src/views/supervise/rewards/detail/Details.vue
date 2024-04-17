<template>
  <div id="rewardsDetail">
    <el-dialog
      id="detail"
      title="奖惩详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <div class="box">
        <p>
          <span class="span-title">实施奖惩单位：</span>
          <span>{{ detail.name }}</span>
        </p>
        <p>
          <span class="span-title">被奖惩机构（人）名称：</span>
          <span>{{ detail.objectName }}</span>
        </p>
        <p>
          <span class="span-title">被奖惩机构（人）类型：</span>
          <span>{{ detail.objectType }}</span>
        </p>
        <p>
          <span class="span-title">被奖惩机构（人）社会信用代码：</span>
          <span>{{ detail.objectBlCode }}</span>
        </p>
        <p>
          <span class="span-title">奖惩类型：</span>
          <span>{{ detail.rwdPhbType }}</span>
        </p>
        <p>
          <span class="span-title">奖惩时间：</span>
          <span>{{ detail.rwdPhbTime }}</span>
        </p>
        <p>
          <span class="span-title">奖惩事项：</span>
          <span>{{ detail.rwdPhbItems }}</span>
        </p>
        <p>
          <span class="span-title">奖惩原因：</span>
          <span>{{ detail.rwdPhbReason }}</span>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { findRewardsById } from '@/api/supervise'
  export default {
    name: 'RewardsDetail',
    components: {},
    data() {
      return {
        detail: {},
        coverRewardsTypeOptions: [],
        rewardsType: [],
        dialogVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        enumData: 'enums/getStrEnumAll',
      }),
    },
    methods: {
      initData(row) {
        this.findRewardsById(row.id)
        this.coverRewardsTypeOptions = this.enumData.RespondentEnum || []
        this.rewardsType = this.enumData.PunishmentTypeEnum || []
        this.dialogVisible = true
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
          data.rwdPhbTime = data.rwdPhbTime.split(' ')[0]
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
    .box {
      padding: 0 50px;
    }
    .span-title {
      display: inline-block;
      font-weight: 700;
    }
  }
</style>
