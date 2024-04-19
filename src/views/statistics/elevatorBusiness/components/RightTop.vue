<template>
  <div id="superviRightTop">
    <div class="topTitle">星级客户</div>
    <div style="width: 100; flex: 1" ref="lineEcharts"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import TitleSu from "./Title";
import resize from "../mixins/resize";
export default {
  name: "superviRightTop",
  props: {
    rightTopData: {
      type: Object,
      required: true,
      default: () => {
        return {
          acdpreNum: 0, // 事故预防次数
          corpNum: 0, // 服务企业数量
          dangerNumber: 0, // 隐患数量
          perSonNum: 0, // 参与人数
        };
      },
    },
  },
  mixins: [resize],
  components: {
    TitleSu,
  },
  mounted() {
    this.$nextTick((_) => {
      this.initLineEcharts();
    });
  },
  methods: {
    initLineEcharts() {
      this.myChart = echarts.init(this.$refs.lineEcharts);
      console.log(this.myChart);
      this.myChart.setOption({
        grid: {
          left: "3%",
          right: "4%",
          top: "12%",
right:0,
          containLabel: true,
        },
        radar: {
          splitArea: {
            //配置雷达图的网格线背景
            show: false,
          },
          indicator: [
            { name: "1星", max: 22000 },
            { name: "2星", max: 22000 },
            { name: "3星", max: 22000 },
            { name: "4星", max: 22000 },
            { name: "5星", max: 22000 },
          ],
        },

        series: [
          {
            type: "radar",
            data: [
              {
                // value: [4200, 3000, 20000, 35000, 50000],
                value: [21931, 2487, 857, 437, 258],
              },
            ],
            itemStyle: {
              //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
              color: "#6f90fd",
              borderColor: "#6f90fd",
            },
            areaStyle: {
              color: "#3076a5",
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="less">
#superviRightTop {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url(../../../../../static/img/teshe/bg.png);
  background-color: #04044f;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .topTitle {
    color: #32c5ff;
    margin-top: 5px;
    text-align: center;
  }
}
</style>