<template>
  <div id="complaintDetail">
    <div class="top">
      <Title title="投诉详情"></Title>
      <el-button type="info" class="back" @click="back">返回</el-button>
    </div>
    <div class="descriptions-content mt20">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">投诉人名称</template>
          {{ detail.name }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">投诉人社会信用代码</template>
          {{ detail.blCode }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">投诉时间</template>
          {{ detail.complainTime.split(' ')[0] }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">被投诉人</template>
          {{ detail.respondentName }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">投诉内容及诉求</template>
          {{ detail.remark }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">投诉办理单位</template>
          {{ detail.complaintHandlingUnit }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">投诉人确认</template>
          {{ detail.complaintHandlingConfirm }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">投诉办理结果</template>
          {{ detail.complaintHandlingResult }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { mapGetters } from 'vuex'
  import { baseMixin } from '@/mixins/baseMixins'
  import { findComplaintById } from '@/api/supervise'
  export default {
    name: 'ComplaintDetail',
    components: {
      Title,
    },
    mixins: [baseMixin],
    data() {
      return {
        detail: {},
        // 投诉确认
        confirmOptions: [],
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'tabsBar/visitedRoutes',
        enumData: 'enums/getStrEnumAll',
      }),
    },
    created() {
      this.init()
    },
    activated() {
      this.findComplaintById(this.$route.query.id)
    },
    methods: {
      init() {
        this.findComplaintById(this.$route.query.id)
        this.confirmOptions = this.enumData.SolveStatusEnums || []
      },
      async findComplaintById(id) {
        let { code, data } = await findComplaintById(id)
        if (code === '0000') {
          let complaintHandlingConfirm = this.confirmOptions.find(
            (it) => it.strCode === data.complaintHandlingConfirm
          )
          data.complaintHandlingConfirm = complaintHandlingConfirm
            ? complaintHandlingConfirm.label
            : ''
          this.detail = data
        }
      },
      back() {
        this.toThisTag()
      },
    },
  }
</script>

<style lang="scss" scoped>
  #complaintDetail {
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
