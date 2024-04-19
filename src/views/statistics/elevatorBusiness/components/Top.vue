<template>
  <div id="topTitle">
    <div class="left">
      <p>{{ nowTime }}</p>
      <p>{{ week }}</p>
    </div>
    <div class="middle">电梯业务概览</div>
    <div class="right1">
      <p>天气</p>
      <p>{{ propName }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "topTitle",
  data() {
    return {
      nowTime: "",
      week: "",
    };
  },
  props: {
    propName: "",
  },
  mounted() {
    this.nowTimes();
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      let week = new Date(timeStamp).getDay();
      let weeks = ["日", "一", "二", "三", "四", "五", "六"];
      this.week = "星期" + weeks[week];
      this.nowTime =
        year + "." + month + "." + date + "." + " " + hh + ":" + mm + ":" + ss;
    }, // 实时刷新当前时间，格式化
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    },
  },
};
</script>

<style scoped lang="less">
#topTitle {
  height: 100%;
  background-image: url(../../../../../static/img/teshe/top.png);
  background-size: 100% auto;
  display: flex;
  .left {
    flex: 1;

    box-sizing: border-box;
    color: #32c5ff;
    font-size: 12px;
    p:first-child {
      margin-top: 13%;

      margin-left: 37%;
    }
    p:last-child {
      margin-top: 2.7%;

      margin-left: 80%;
    }
  }
  .right1 {
    flex: 1;

    box-sizing: border-box;
    color: #32c5ff;
    font-size: 12px;
    p:first-child {
      margin-top: 13%;
      margin-left: 30%;
    }
    p:last-child {
      margin-top: 2.7%;
      margin-left: 15%;
    }
  }
  .middle {
    text-align: center;
    color: #fff;
    font-weight: 600;
    line-height: 80px;
    letter-spacing: 15px;
    font-size: 34px;
    flex: 2.3;
  }
}
</style>