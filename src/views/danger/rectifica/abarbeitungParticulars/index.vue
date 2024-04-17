<template>
  <div id="EnterpriseList">
    <div v-for="(item, index) in data" :key="index">
      <div
        class="hdRegisterClass"
        v-if="item.rectificationJob.flowType === '000'"
      >
        <HdRegister
          :rctification="item.rctification"
          :rectificationJob="item.rectificationJob"
          :supplementData="supplementData"
        />
      </div>
      <div
        class="hdRegisterClass"
        v-if="item.rectificationJob.flowType === '002'"
      >
        <HdAbarbeitung
          :rctification="item.rctification"
          :rectificationJob="item.rectificationJob"
        />
      </div>
      <div
        class="hdRegisterClass"
        v-if="item.rectificationJob.flowType === '004'"
      >
        <HdAcceptance
          :rctification="item.rctification"
          :rectificationJob="item.rectificationJob"
        />
      </div>
    </div>
  </div>
</template>
<script>
import HdRegister from '../../components/hdRegister.vue'
import HdAbarbeitung from '../../components/hdAbarbeitung.vue'
import HdAcceptance from '../../components/hdAcceptance.vue'
import { getHiddenDangerFlowListByBatchId } from '@/api/checkApi'

export default {
  components: { HdRegister, HdAbarbeitung, HdAcceptance },
  data() {
    return {
      data: [],
      supplementData: {},
    }
  },
  created() {
    this.getHiddenDangerFlowListByBatchId()
  },
  methods: {
    async getHiddenDangerFlowListByBatchId() {
      let params = {
        batchId: this.$route.query.batchId,
      }
      let res = await getHiddenDangerFlowListByBatchId(params)
      if (res.code === '0000') {
        this.data = res.data
        this.supplementData = res.data[res.data.length - 1].rctification
        console.log(
          this.supplementData,
          'kkkkkkkk------1111111222222=====3333444'
        )
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#EnterpriseList {
  padding: 30px;
  .hdRegisterClass {
    margin-bottom: 20px;
  }
}
</style>