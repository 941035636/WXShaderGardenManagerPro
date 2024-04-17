<template>
  <div id="AccidentPreInfo">
    <Title :title="title" />
    <div class="con_item lh32">
      <el-row class="mt10 mb15 lh32">
        <el-col :span="20">
          <div style="display: flex">
            <span class="title_item">约定的事故服务费用比例：</span>
            <span v-if="!$route.query.code">{{ accidentPre.rate }}%</span>
            <span v-if="$route.query.code">
              {{ (accidentPre.accidentRate * 100).toFixed(0) }}%
            </span>
            <el-button
              type="primary"
              size="small"
              style="margin-left: 20px"
              @click="flagAcc"
            >
              查看服务项目
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="$route.query.code && isAccident" class="mt10 lh32">
        <el-col :span="24">
          <el-table
            :header-cell-style="getRowClass"
            :cell-style="{ 'text-align': 'left' }"
            :data="accidentPre.accident"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="searveType"
              label="事故预防类型"
            ></el-table-column>
            <el-table-column
              prop="projectName"
              label="项目名称"
            ></el-table-column>
            <el-table-column prop="time" label="时间"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- <p v-if="$route.query.code" class="searve">
          服务频次
          <span class="ml20 mr20">{{ accidentPre.frequency }}</span>
        </p> -->
    </div>
  </div>
</template>
<script>
import Title from '@/components/NewTitle'
export default {
  name: 'AccidentPre',
  components: { Title },
  props: {
    accidentPre: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      title: '事故预防信息服务',
      isAccident: false,
    }
  },

  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:left'
      } else {
        return ''
      }
    },
    flagAcc() {
      this.isAccident = true
    },
  },
}
</script>
<style lang="scss" scoped>
#AccidentPreInfo {
  padding: 0 20px 20px 0;
  margin: 10px 0;
  background-color: #fff;

  .con_item {
    margin-left: 30px;

    .title_item {
      display: inline-block;
      // width: 20%;
      line-height: 32px;
      // min-width: 140px;
    }
  }
}
.searve {
  text-align: end;
  color: #000;
  font-weight: bolder;
}
</style>
