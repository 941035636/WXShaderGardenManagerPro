<template>
  <div id="superviLeftTop">
    <div class="topTitle"><p>全国 </p></div>
    <div class="echartCicle">
      <div class="cirTxt"> <p >{{ totalCorp || 34765}}</p>
      <p >保障电梯数</p></div>
     
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import TitleSu from "./Title";
import resize from "../mixins/resize";
export default {
  name: "superviLeftTop",
  mixins: [resize],
  props: {
    totalCorp: {
      type: Number,
      required: true,
      default: () => {
        return 0;
      },
    },
  },
  components: {
    TitleSu,
  },
  filters: {
    totalCorp: function(num) {
    num = num.toString().split("."); // 分隔小数点
    var arr = num[0].split("").reverse(); // 转换成字符数组并且倒序排列
    var res = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      if (i % 3 === 0 && i !== 0) {
        res.push(","); // 添加分隔符
      }
      res.push(arr[i]);
    }
    res.reverse(); // 再次倒序成为正确的顺序
    if (num[1]) {
      // 如果有小数的话添加小数部分
      res = res.join("").concat("." + num[1]);
    } else {
      res = res.join("");
    }
    return res;
}

},
  data() {
    return {
      myChart: null,
    };
  },
  mounted() {
    // this.$nextTick((_) => {
    //   this.initBarEcharts();
    // });
  },
  methods: {},
};
</script>

<style lang="less">
#superviLeftTop {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #020053;
  flex: 1;

  .topTitle {
    color: #32c5ff;
   
    text-align: center;
    background-image: url(../../../../../static/img/teshe/bz14.png);
    background-size: 100% 100%;
    p{
      margin-top: 2%;
    }
  }
  .echartCicle {
    background-image: url(../../../../../static/img/teshe/leftTop.png);
    background-size: auto 115%;
    background-repeat: no-repeat;
    background-position: center;
    height: 100%;
    .cirTxt {
      height: 30%;
      margin: 30% auto;
      p:first-child {
        text-align: center;
        font-size: 24px;
        font-weight: 700;
        color: #66fbfd;
      }
      p:last-child{
        // margin-top: 10px;
        text-align: center;
        font-size: 12px;

        color: #fff;
      }
    }
  }
}
</style>