<template>
  <div id="table-1">
    <!-- 第二种 一行展示一种数据 -->
    <div
      v-if="boxTwo"
      :class="{ 'div-two': boxTwo, 'border-bottom': borderBotFlag }"
      :style="{ 'background-color': backgroundColor }"
    >
      <p class="p-tilte">{{ lableLeft }}</p>
      <p class="p-content-two border-left">
        <slot name="rightTwo"></slot>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Table',
    props: {
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

<style lang="scss" scoped>
  #table-1 {
    width: 100%;
    .div-two {
      width: 100%;
      display: flex;
      align-items: center;
      border: 1px solid #cccccc;
      border-bottom: none;
      background-color: #f5f5f5;
      p {
        display: flex;
        margin: 0;
        min-height: 40px;
        align-items: center;
        padding: 6px 3px;
        box-sizing: border-box;
      }
    }
    .p-tilte {
      width: 150px;
      font-weight: 700;
      justify-content: center;
    }
    .p-content-two {
      width: calc(100% - 150px);
      background-color: #ffffff;
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
