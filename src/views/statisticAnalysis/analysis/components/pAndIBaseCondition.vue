<template>
  <div id="pAndIBaseCondition" class="absolute">
    <div v-if="isRegion" class="select-item">
      <!-- value-key="value" -->
      <el-select
        v-model="location"
        size="mini"
        placeholder="请选择"
        style="width: 12rem"
        @change="regionChange"
      >
        <el-option
          v-for="item in region"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div v-if="isDate" class="select-item">
      <el-date-picker
        type="year"
        class="w100"
        v-model="year"
        size="mini"
        @change="choseYear"
        value-format="yyyy"
        :clearable="false"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <!-- <el-select
        v-model="year"
        size="mini"
        placeholder="请选择"
        style="width: 7rem"
        @change="yearChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        ></el-option>
      </el-select> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'PAndIBaseCondition',
  props: {
    region: {
      type: Array,
      default: function () {
        return []
      },
    },
    isRegion: {
      type: Boolean,
      default: false,
    },
    isDate: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return (
            new Date(time).getFullYear() < sysConfig.startYear ||
            new Date(time).getFullYear() > sysConfig.endYear
          )
        },
      },
      location: '',
      year: '2022',
      // year: new Date().getFullYear(),
    }
  },
  methods: {
    choseYear() {
      this.$baseMessage('仅限选择本年度之前的年份', 'waring')
      this.year = '2022'
    },
    regionChange(value) {
      this.$emit('onRegion', value)
    },
    yearChange(value) {
      this.$emit('onYear', value + `-01-01 00:00:00`)
      // this.$emit('onYear', {
      //   startTime: `${value}-01-01 00:00:00`,
      //   endTime: `${value}-12-31 23:59:59`,
      // })
    },
  },
}
</script>

<style lang="scss">
#pAndIBaseCondition {
  display: flex;
  .select-item {
    margin-left: 20px;
  }
}

#pAndIBaseCondition.absolute {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
<style>
#pAndIBaseCondition .select-item input {
  color: #fff;
  border-color: rgba(255, 255, 255, 1);
  background: rgba(2, 36, 108, 1);
}
</style>
