<template>
  <div id="table">
    <!-- 第一种 一行展示两种数据 -->
    <div
      v-if="boxOne"
      :class="{ 'div-one': boxOne, 'border-bottom': borderBotFlag }"
      :style="{ 'background-color': backgroundColor }"
    >
      <p class="p-tilte pl5">
        {{ lableLeft }}
      </p>
      <p class="p-content border-left">
        <span class="box-con">
          <slot name="lefter"></slot>
          <TipsText :text="valueLeft" :length="30" />
        </span>
      </p>
      <p class="p-tilte border-left">{{ lableRight }}</p>
      <p class="p-content border-left">
        <span class="box-con">
          <TipsText :text="valueRight ? valueRight : '—'" :length="30" />
        </span>
      </p>
    </div>
    <!-- 第二种 一行展示一种数据 -->
    <div
      v-if="boxTwo"
      :class="{ 'div-two': boxTwo, 'border-bottom': borderBotFlag }"
      :style="{ 'background-color': backgroundColor }"
    >
      <p class="p-tilte">{{ lableLeft }}</p>
      <p class="p-content-two border-left">{{ valueLeft ? valueLeft : '—' }}</p>
    </div>
  </div>
</template>

<script>
  import TipsText from '@/components/TipsText'
  export default {
    name: 'Table',
    components: { TipsText },
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

<style lang="scss" scoped>
  #table {
    width: 100%;
    .div-one,
    .div-two {
      width: 100%;
      display: flex;
      align-items: center;

      border-bottom: none;
      p {
        display: flex;
        margin: 0;
        min-height: 40px;
        align-items: center;
        padding: 5px 3px;
        box-sizing: border-box;
        .check {
          color: #3299cc;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
    .p-tilte {
      width: 220px;
    }
    .p-content {
      width: calc(100% - 50% - 220px);

      .box-con {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .p-content-two {
      width: calc(100% - 220px);
    }
    .border-right {
    }
    .border-left {
    }
    .border-bottom {
    }
  }
</style>
