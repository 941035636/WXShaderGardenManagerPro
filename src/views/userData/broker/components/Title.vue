<template>
  <div id="title">
    <p :style="{ 'border-left': borderStyle }"></p>
    <p class="text">{{ title }}</p>
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
          return '8px solid #FFC069'
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

<style lang="scss" scoped>
  #title {
    display: flex;
    align-items: center;
    position: relative;
    p {
      height: 30px;
      line-height: 30px;
    }
    .text {
      margin-left: 20px;
      size: 18px;
      color: #101010;
    }
    .btn {
      position: absolute;
      right: 0;
    }
    .button {
      height: 34px;
    }
  }
</style>
