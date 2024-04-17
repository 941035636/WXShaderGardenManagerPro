<template>
  <div id="table">
    <!-- 第一种 一行展示两种数据 -->
    <div
      v-if="boxOne"
      :class="{ 'div-one': boxOne, 'border-bottom': borderBotFlag }"
      :style="{ 'background-color': backgroundColor }"
    >
      <p class="p-tilte pl5">
        <span v-if="valid" class="mr5 color-red">*</span>
        {{ lableLeft }}
      </p>
      <p class="p-content-l">
        <slot name="left"></slot>
      </p>
      <p class="p-tilte">
        <span v-if="valid" class="mr5 color-red">*</span>
        {{ lableRight }}
      </p>
      <p class="p-content">
        <slot name="right"></slot>
      </p>
    </div>
    <!-- 第二种 一行展示一种数据 -->
    <div
      v-if="boxTwo"
      :class="{ 'div-two': boxTwo, 'border-bottom': borderBotFlag }"
      :style="{ 'background-color': backgroundColor }"
    >
      <p class="p-tilte">
        <span v-if="valid" class="color-red mr5">*</span>
        {{ lableLeft }}
      </p>
      <p class="p-content-two">
        <slot name="rightTwo"></slot>
      </p>
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
      valid: {
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

<style lang="scss" scoped>
  #table {
    width: 100%;
    .div-one,
    .div-two {
      width: 100%;
      display: flex;
      align-items: center;
      p {
        display: flex;
        margin: 0;
        min-height: 50px;
        align-items: center;
        padding: 6px 3px;
        box-sizing: border-box;
      }
    }
    .p-tilte {
      width: 203px;
    }
    .p-content-l {
      width: calc(40% - 203px);
    }
    .p-content {
      width: calc(100% - 50% - 203px);
    }
    .p-content-two {
      width: calc(100% - 203px);
    }
  }
</style>
