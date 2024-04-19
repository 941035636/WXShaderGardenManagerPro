<template>
  <div id="title" :style="{ 'border-bottom': borderTitleStyle }">
    <p
      :style="{ 'border-left': borderStyle, 'border-radius': borderRadius }"
    ></p>
    <p class="text">{{ title }}</p>
    <slot name="content"></slot>
    <div class="btn">
      <el-button
        v-if="buttonLeft.flag"
        :type="buttonLeft.type"
        class="button"
        @click="buttonClick(buttonLeft.emit)"
      >
        {{ buttonLeft.text }}
      </el-button>
      <el-button
        v-if="buttonRight.flag"
        :type="buttonRight.type"
        class="button"
        @click="buttonClick(buttonRight.emit)"
      >
        {{ buttonRight.text }}
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Title',
    props: {
      borderStyle: {
        type: String,
        required: false,
        default: () => {
          return '6px solid #FFC069'
        },
      },
      borderRadius: {
        type: String,
        required: false,
        default: () => {
          return '0px'
        },
      },
      borderTitleStyle: {
        type: String,
        required: false,
        default: () => {
          return '1px solid #ccc'
          return ''
        },
      },
      title: {
        type: String,
        required: false,
        default: () => {
          return '无'
        },
      },
      buttonLeft: {
        type: Object,
        required: false,
        default: () => {
          return {
            type: '',
            flag: false,
            text: '无',
            emit: '',
          }
        },
      },
      buttonRight: {
        type: Object,
        required: false,
        default: () => {
          return {
            type: '',
            flag: false,
            text: '无',
            emit: '',
          }
        },
      },
    },
    methods: {
      buttonClick(emit) {
        this.$emit(emit)
      },
    },
  }
</script>

<style lang="less" scoped>
  #title {
    display: flex;
    align-items: center;
    background-color: #fff;
    position: relative;
    p {
      height: 30px;
      line-height: 30px;
      margin: 18px;
    }
    .text {
      margin-left: 20px;
      font-weight: 700;
      font-size: 18px;
      color: #101010;
    }
    .btn {
      position: absolute;
      right: 0;
    }
    .button {
      height: 40px;
    }
  }
</style>
