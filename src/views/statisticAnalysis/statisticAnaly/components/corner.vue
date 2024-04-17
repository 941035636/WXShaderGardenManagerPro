<template>
  <div id="corner">
    <div class="border_corner border_corner_left_bottom"></div>
    <div class="border_corner border_corner_left_top"></div>
    <div class="border_corner border_corner_right_top"></div>
    <div class="border_corner border_corner_right_bottom"></div>
    <div class="mainCon"></div>
  </div>
</template>

<script>
export default {}
</script>
<style lang="scss" scoped>
#corner {
  width: 0;
  height: 0;

  .mainCon {
    width: 100%;
    height: 100%;
    z-index: -10;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid rgba(6, 7, 107, 1);

    border-radius: 4px;
  }
  .border_corner {
    z-index: 10;
    position: absolute;
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0);
    border: 2px solid #00a2ff;
  }

  .border_corner_left_bottom {
    bottom: -1px;
    left: 0px;
    border-right: none;
    border-top: none;
    border-bottom-left-radius: 1px;
  }
  .border_corner_right_bottom {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
    border-bottom-right-radius: 1px;
  }
  .border_corner_left_top {
    top: 0px;
    left: 0px;
    border-right: none;
    border-bottom: none;
    border-bottom-left-radius: 1px;
  }
  .border_corner_right_top {
    top: 0px;
    right: 0px;
    border-left: none;
    border-bottom: none;
    border-bottom-right-radius: 1px;
  }
}
</style>