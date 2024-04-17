<template>
  <div id="Newtitle">
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
        round
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
    name: 'NewTitle',
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
  #Newtitle {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    p {
      height: 20px;
      line-height: 20px;
    }
    .text {
      margin-left: 16px;
      font-size: 16px;
      font-weight: bold;
      color: #101010;
    }
    .btn {
      position: absolute;
      right: 0px;
    }
    .button {
      height: 34px;
    }
  }
</style>
