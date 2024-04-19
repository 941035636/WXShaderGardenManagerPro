<template>
  <div id="superviRightBottom">
    <TitleSu title="隐患整改情况"/>
    <div style="width:100;flex:1" ref="hasnEcharts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import TitleSu from './Title'
import resize from "../mixins/resize";
export default {
  name: "superviRightBottom",
  mixins: [resize],
  props:{
    rightBottomData: {
      type: Array,
      required: true,
      default: ()=>{
        return [];
      }
    }
  },
  components: {
    TitleSu
  },
  data(){
    return {
      myChart: null,
    }
  },
  mounted(){
    this.$nextTick(_=>{
      this.inithasnEcharts();
    })
  },
  methods:{
    inithasnEcharts(){
      this.myChart = echarts.init(this.$refs.hasnEcharts);
      this.myChart.setOption({
  yAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  xAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
})
    }
  }
}
</script>

<style lang="less">
#superviRightBottom{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // flex: 1;
}
</style>