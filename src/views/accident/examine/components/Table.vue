<template>
  <div id="table">
    <!-- 第一种 一行展示两种数据 -->
    <div
      v-if="boxOne"
      :class="{ 'div-one': boxOne, 'border-bottom': borderBotFlag }"
      :style="{ 'background-color': backgroundColor }"
    >
      <p class="p-tilte pl5">{{ lableLeft }}</p>
      <p class="p-content border-left">{{ valueLeft }}</p>
      <p class="p-tilte border-left">{{ lableRight }}</p>
      <p class="p-content border-left">{{ valueRight }}</p>
    </div>
    <!-- 第二种 一行展示一种数据 -->
    <div
      v-if="boxTwo"
      :class="{ 'div-two': boxTwo, 'border-bottom': borderBotFlag }"
      :style="{ 'background-color': backgroundColor }"
    >
      <p class="p-tilte">{{ lableLeft }}</p>
      <p class="p-content-two border-left">{{ valueLeft }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Table',
    props: {
      boxOne: {
        type: Boolean,
        required: false,
        default: () => {
          return false
        },
      },
      boxTwo: {
        type: Boolean,
        required: false,
        default: () => {
          return false
        },
      },
      lableLeft: {
        type: String,
        required: false,
        default: () => {
          return ''
        },
      },
      valueLeft: {
        type: String,
        required: false,
        default: () => {
          return ''
        },
      },
      lableRight: {
        type: String,
        required: false,
        default: () => {
          return ''
        },
      },
      valueRight: {
        type: String,
        required: false,
        default: () => {
          return ''
        },
      },
      borderBotFlag: {
        type: Boolean,
        required: false,
        default: () => {
          return false
        },
      },
      backgroundColor: {
        type: String,
        required: false,
        default: () => {
          return 'fff'
        },
      },
    },
  }
</script>

<style lang="less" scoped>
  #table {
    width: 100%;
    .div-one,
    .div-two {
      width: 100%;
      display: flex;
      align-items: center;
      border: 1px solid #cccccc;
      border-bottom: none;
      p {
        display: flex;
        margin: 0;
        min-height: 40px;
        align-items: center;
        padding: 5px 3px;
        box-sizing: border-box;
      }
    }
    .p-tilte {
      width: 150px;
    }
    .p-content {
      width: calc(100% - 50% - 150px);
    }
    .p-content-two {
      width: calc(100% - 150px);
    }
    .border-right {
      border-right: 1px solid #ccc;
    }
    .border-left {
      border-left: 1px solid #ccc;
    }
    .border-bottom {
      border-bottom: 1px solid #ccc;
    }
  }
</style>
