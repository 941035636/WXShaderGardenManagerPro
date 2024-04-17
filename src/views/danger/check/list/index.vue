<template>
  <div id="Check">
    <div>
      <div class="xiang-tit clearfix bg-white">
        <div
          v-for="(item, index) in tabTitle"
          :key="index"
          @click="addClass(index, item.path)"
          :class="current == index ? 'isactive' : ''"
          class="xia-tab fl f18 text-center pos-r"
        >
          {{ item.name }}
        </div>
      </div>

      <component
        class="child_css"
        v-bind:is="asyncLoadComponent"
        :endata="endata"
        :ByUserCount="ByUserCount"
        :DangerByUserArr="DangerByUserArr"
        @handleCurrentChange="handleCurrentChange"
        @cutClick="cutClick"
      ></component>
    </div>
  </div>
</template>
<script>
import Inventory from '../components/inventory'
import Bulletin from '../components/bulletin'
import { getEntInfoByUser } from '@/api/user'
import { getDangerByUserCount, getDangerByUser } from '@/api/checkApi'
export default {
  components: {
    Inventory,
    Bulletin,
  },
  data() {
    return {
      current: 0,
      asyncLoadComponent: 'Inventory',
      tabTitle: [
        {
          path: 'Inventory',
          name: '清单排查',
        },
        {
          path: 'Bulletin',
          name: '隐患快报',
        },
      ],
      endata: {},
      ByUserCount: {},
      DangerByUserArr: [],
      pn: 1,
      ps: 10,
    }
  },
  created() {
    this.getCapchas()
    this.getHiddenDangerByUserCount()
    this.getDangerByUser()
  },
  methods: {
    handleCurrentChange(e) {
      console.log(e, 'eeee')
      this.pn = e
      this.getDangerByUser()
    },
    //调用企业信息接口
    async getCapchas() {
      let res = await getEntInfoByUser()
      if (res.code === '0000') {
        this.endata = res.data
      }
    },
    async getHiddenDangerByUserCount() {
      let res = await getDangerByUserCount()
      if (res.code === '0000') {
        this.ByUserCount = res.data
      }
    },
    async getDangerByUser() {
      let data = {
        pn: this.pn,
        ps: this.ps,
      }
      let res = await getDangerByUser(data)
      if (res.code === '0000') {
        this.DangerByUserArr = res.data
      }
    },
    addClass(i, path) {
      this.current = i
      this.asyncLoadComponent = path
    },
    cutClick() {
      this.asyncLoadComponent = 'Inventory'
      this.current = 0
    },
  },
}
</script>
<style lang="scss" scoped>
#Check {
  .xiang-tit {
    line-height: 40px;
    border-bottom: 1px solid #1890ff;
  }
  .xia-tab {
    padding: 0 40px;
    height: 40px;
    line-height: 40apx;
    color: #333;
    cursor: pointer;
  }
  .xia-tab.isactive {
    color: #fff;
    background: #1890ff;
  }
}
</style>