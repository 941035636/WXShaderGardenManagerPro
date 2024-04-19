<template>
  <div id="superviLeftCenter">
    <div class="containers-right mt10">
      <div class="flex-just">
        <div class="flex">
          <div class="lh30 pl10">
            <div class="c9 f16">累计投保企业数</div>
            <div class="c3 f24">{{centerData.compNum}}<span class="f18">家（次）</span></div>
          </div>
        </div>
        <div class="flex">
          <div class="lh30 pl10">
            <div class="c9 f16">累计保费</div>
            <div class="c3 f24">{{centerData.prem}}<span class="f18">亿元</span></div>
          </div>
        </div>
        <div class="flex">
          <div class="lh30 pl10">
            <div class="c9 f16">累计保障额度</div>
            <div class="c3 f24">{{centerData.amount}}<span class="f18">亿元</span></div>
          </div>
        </div>
        <div class="flex">
          <div class="lh30 pl10">
            <div class="c9 f16">全国电梯投保率</div>
            <div class="c3 f24">{{centerData.rate}}%</div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100; flex: 1" ref="lineEcharts"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import TitleSu from "./Title";
import resize from "../mixins/resize";
export default {
  name: "superviLeftCenter",
  mixins: [resize],
  components: {
    TitleSu,
  },
  props: {
    centerData: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  mounted() {
    this.$nextTick((_) => {
      this.initLineEcharts();
    });
  },
  methods: {
    initLineEcharts() {},
  },
};
</script>

<style lang="less">
#superviLeftCenter {
  // position: relative;
 background-color: #04044f;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // flex-grow: 1;

  .flex-just {
    display: flex;
    margin-left: 20px;
    justify-content: space-around;
    flex-wrap: wrap;
    
  }
  .flex {
    display: flex;
    background-image: url(../../../../../static/img/teshe/szbf4.png) ;
   background-repeat: no-repeat;
    background-size: contain;
    width: 48%;
    margin: 1%;
    height: 48%;
    // flex: 1
  }
  .w46 {
    width: 48%;
  }
  .c3 {
    color: #00B0ED;
  }
  .c9 {
    color: #FFF;
  }
}
</style>