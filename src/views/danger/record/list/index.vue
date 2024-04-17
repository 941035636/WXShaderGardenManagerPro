<template>
  <div id="EnterpriseList">
    <div class="headerClass" style="cursor: pointer">
      <div
        class="defaultClass"
        v-for="item in tapData"
        :key="item.key"
        :class="item.key === tapPitchOn ? 'pitchOnClass' : ''"
        @click="tapClick(item)"
      >
        {{ item.text }}
      </div>
    </div>

    <div class="padding30">
      <!-- 排查记录 -->
      <Troubleshoot ref="Troubleshoot" v-if="tapPitchOn === 1" />
      <!-- 隐患记录 -->
      <HiddenDanger ref="HiddenDanger" v-if="tapPitchOn === 2" />
    </div>
  </div>
</template>
<script>
import HiddenDanger from './components/hiddenDanger.vue'
import Troubleshoot from './components/troubleshoot.vue'
export default {
  components: { HiddenDanger, Troubleshoot },
  data() {
    return {
      tapData: [
        { text: '排查记录', key: 1 },
        { text: '隐患记录', key: 2 },
      ],
      tapPitchOn: 1,
      ruleForm: {
        name: '',
        policyNo: '',
        companyIndystryIds: '',
      },
      industryData: [],
      dataList: [{ id: 1, name: '测试数据' }],
      total: 20,
    }
  },
  methods: {
    examineClick(e) {
      console.log(e, '000000')
      this.$router.push({
        name: 'particulars',
      })
    },
    changeIns() {
      // console.log(this.ruleForm.companyIndystryIds)
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
    },
    tapClick(e) {
      this.tapPitchOn = e.key
    },
  },
}
</script>
<style lang="scss" scoped>
#EnterpriseList {
  .headerClass {
    width: 100%;
    height: 40px;
    // background-color: #1990ff;
    display: flex;
    border-bottom: 2px solid #096dd9;

    .defaultClass {
      width: 150px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pitchOnClass {
      background-color: #1990ff;
      color: #fff;
      font-weight: 400;
    }
  }
  .numberOfBranches {
    display: flex;
    align-items: center;
    height: 60px;
    .buttonClass {
      background-color: #ffa940;
      width: 85px;
      height: 35px;
      border-radius: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20px;
      color: #fff;
      font-weight: 500;
    }
  }
  .examineClass {
    color: #1990ff;
  }
  .padding30 {
    padding: 30px;
  }
}
</style>