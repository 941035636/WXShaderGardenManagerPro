import {
  debounce
} from '@/utils/Debounce.js'

export default {
  data() {
    return {
      myChart: null,
      myChart2: null,
      myChart3: null,

      resizeHandler: null,
    }
  },
  mounted() {
    this.resizeHandler = debounce(() => {
      if (this.myChart) {
        this.myChart.resize()
      }
      if (this.myChart2) {
        this.myChart2.resize()
      }
      if (this.myChart3) {
        this.myChart3.resize()
      }
      if (this.myDetail) {
        this.myDetail.resize()
      }
    }, 200)
    this.initResizeEvent()
  },

  beforeDestroy() {
    this.destroyResizeEvent()
    if (!this.myChart) {
      return
    }

    this.myChart.dispose()
    this.myChart.off('click')
    this.myChart = null

  },

  activated() {
    this.initResizeEvent()
  },

  deactivated() {
    this.destroyResizeEvent()
  },

  methods: {
    //监听resize
    initResizeEvent() {
      window.addEventListener('resize', this.resizeHandler)
    },
    //移除resize
    destroyResizeEvent() {
      window.removeEventListener('resize', this.resizeHandler)
    },
  },
}