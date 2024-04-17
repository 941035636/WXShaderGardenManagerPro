<template>
  <div id="container"></div>
</template>
<script>
  import AMap from 'AMap'
  import AMapUI from 'AMapUI'

  export default {
    props: {
      reContry: Boolean, // 父组件带有一个返回全国的操作按钮控制
    },
    data() {
      return {
        // amap: null,
        // districtExplorer: null,
        // tipMarker: null,
        // $tipMarkerContent: null,
        // currentAreaNode: null,
        // aReContry: this.reContry,
      }
    },
    mounted() {
      var map = new AMap.Map('container', {
        zoom: 7, //级别
        center: [106.71, 26.57], //中心点坐标
        viewMode: '3D', //使用3D视图
      })
    },
  }
</script>
<style lang="scss">
  #container {
    width: 100%;
    background-color: blue;
    height: 100%;
  }
  .amap-marker-content {
    .tipMarker {
      color: #555;
      background-color: rgba(255, 254, 239, 0.8);
      border: 1px solid #7e7e7e;
      padding: 2px 6px;
      font-size: 12px;
      white-space: nowrap;
      display: inline-block;
      &:before,
      &:after {
        content: '';
        display: block;
        position: absolute;
        margin: auto;
        width: 0;
        height: 0;
        border: solid transparent;
        border-width: 5px 5px;
      }
      &.top {
        transform: translate(-50%, -110%);
        &:before,
        &:after {
          bottom: -9px;
          left: 0;
          right: 0;
          border-top-color: rgba(255, 254, 239, 0.8);
        }
        &:before {
          bottom: -10px;
          border-top-color: #7e7e7e;
        }
      }
    }
  }
  .amap-logo,
  .amap-copyright {
    display: block !important;
    visibility: inherit !important;
  }
</style>
