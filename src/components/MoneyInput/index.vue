<template>
  <el-input
    ref="money"
    v-model.trim="money"
    :placeholder="placeholder"
    v-bind="$attrs"
    clearable
    v-on="$listeners"
    @input="formatNumber(money, 'money')"
    @keyup.enter.native="moneyChange()"
    @blur="moneyChange()"
  >
    <template v-if="!billion" slot="append">元</template>
    <template v-if="billion" slot="append">万元</template>
  </el-input>
</template>

<script>
export default {
  name: 'MoneyInput',
  props: {
    value: {
      type: null,
      required: true,
    },
    billion: {
      type: null,
      required: false,
      default: null,
    },
    placeholder: {
      type: String,
      default: '请输入金额',
    },
    enterFuc: {
      type: Function,
      default: () => {},
    },
    data: {
      type: null,
      default: null,
    },
    template: {
      //是否展示单位
      type: String,
      default: '',
    },
  },
  data() {
    return {
      money: this.value,
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.money = newValue
      this.formatNumber(this.money, 'money')
    },
  },
  mounted() {
    this.formatNumber(this.money, 'money')
  },
  methods: {
    fmresource(s) {
      if (s === '' || s === null || s === '.00' || s === undefined) {
        return ''
      }
      if (s === '-') {
        return '-'
      }
      var lose = '' // 负号
      if (s < 0) {
        // 判断是否是负数
        s = (s + '').substring(1) // 截取-号
        lose = '-'
      }
      s = s + ''
      // n = n > 0 && n <= 20 ? n : 2;.toFixed(n)
      // s = parseFloat((s + "").replace(/^[^\d.-]/g, "")) + "";
      var l = s.split('.')[0].split('').reverse()
      var r = ''
      var t = ''
      if (s.indexOf('.') > -1) {
        if (s.split('.')[1] !== null && s.split('.')[1] !== undefined) {
          if (s.split('.')[1].length > 2) {
            s = Number(s).toFixed(2)
          }
          r = '.' + s.split('.')[1]
        } else {
          r = ''
        }
      }
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
      }
      return lose + '' + t.split('').reverse().join('') + r // 拼接
    },
    formatNumber(value, name) {
      this.$emit('update:data', value)
      value = value + ''
      // 获取input的dom对象，这里因为用的是element ui的input，所以需要这样拿到
      const input = this.$refs[name].$el.getElementsByTagName('input')[0]
      // 获取当前光标的位置
      const cursorIndex = input.selectionStart
      // 字符串中光标之前-的个数
      const lineNumOfCursorLeft = (
        value.slice(0, cursorIndex).match(/,/g) || []
      ).length
      // 去掉所有,的字符串
      const noLine = value.replace(/,/g, '')
      // 重新格式化
      const newvalue = this.fmresource(noLine.replace(/[^\d\.-]/g, ''))
      // .replace(/(\d{4})/g, '$1 ').replace(/ $/, '')
      // 改后字符串中原光标之前，的个数
      const newLineNumOfCursorLeft = (
        newvalue.slice(0, cursorIndex).match(/,/g) || []
      ).length
      // 光标在改后字符串中应在的位置
      const newCursorIndex =
        cursorIndex + newLineNumOfCursorLeft - lineNumOfCursorLeft
      // 赋新值，nextTick保证-不能手动输入或删除，只能按照规则自动填入
      this.$nextTick(() => {
        this.money = newvalue
        // 修正光标位置，nextTick保证在渲染新值后定位光标
        this.$nextTick(() => {
          // selectionStart、selectionEnd分别代表选择一段文本时的开头和结尾位置
          input.selectionStart = newCursorIndex
          input.selectionEnd = newCursorIndex
        })
      })
    },
    moneyChange() {
      const v = this.money
        ? (this.money + '')
            .replace(/,/g, '')
            .replace(new RegExp(/(\d+)(\.)(\d*)(\2*)(\d*)/g), '$1$2$3$5')
        : ''
      const money = Object.is(Number(v), NaN) ? '' : Number(v)
      this.$emit('input', money)
      this.enterFuc()
    },
  },
}
</script>
