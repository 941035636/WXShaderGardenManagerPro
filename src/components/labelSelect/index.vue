<template>
  <div id="labelSelect">
    <el-select v-model="type" :placeholder="placeholder" @change="setType">
      <el-option
        v-for="(item, key) in optionsData"
        :key="key"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'labelSelect',
  props: {
    optionsData: {
      type: Array,
      default: () => {
        return []
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return '请选择'
      },
    },
  },
  data() {
    return {
      type: '',
    }
  },
  watch: {
    type: {
      handler(curVal, oldVal) {
        if (curVal) {
          this.$emit('setType', curVal)
        }
      },
      deep: true,
    },
  },
  created() {
    this.type = this.optionsData[0].value
  },
  methods: {
    setType() {
      this.$emit('setType', this.type)
    },
  },
}
</script>

<style lang="scss" scoped>
#labelSelect {
  div {
    width: 94px;
    line-height: 40px;
    height: 40px;
    text-align: right;
    font-size: 14px;
    color: #666666;
  }
}
</style>
<style lang="scss">
#labelSelect {
  .el-input__inner {
    padding: 0;
    padding-right: 28px;
  }
  input {
    border: none;
    font-size: 14px;
    max-width: 120px;
    text-align: right;
  }
  .el-select__caret {
    color: #000000;
    font-weight: 700;
  }
}
</style>
