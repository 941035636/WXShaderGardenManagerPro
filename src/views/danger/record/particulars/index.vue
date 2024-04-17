<template>
  <div id="EnterpriseList">
    <div class="hdRegisterClass">
      <HdRegister />
    </div>
    <div class="hdRegisterClass">
      <HdAbarbeitung />
    </div>
    <div class="hdRegisterClass">
      <HdAcceptance />
    </div>
  </div>
</template>
<script>
import HdRegister from '../../components/hdRegister.vue'
import HdAbarbeitung from '../../components/hdAbarbeitung.vue'
import HdAcceptance from '../../components/hdAcceptance.vue'

export default {
  components: { HdRegister, HdAbarbeitung, HdAcceptance },
  data() {
    return {}
  },
  methods: {},
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