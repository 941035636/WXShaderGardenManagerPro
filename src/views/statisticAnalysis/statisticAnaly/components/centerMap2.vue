<template>
  <div id="centerMap2">
    <button v-if="showBtn" class="backBtn" @click="backMap">返回</button>

    <div class="indus">
      <el-select
        v-model="industryType"
        filterable
        popper-class="elselect"
        clearable
        @change="getNewData"
        placeholder="全部行业"
      >
        <el-option
          v-for="(item, index) in industryData"
          :key="index"
          :label="item.itemText"
          :value="item.itemValue"
        ></el-option>
      </el-select>
    </div>
    <div id="qhMap"></div>
    <div id="container"></div>
  </div>
</template>

<script>
import { getStatisticsIndex, getInsureByArea } from '@/api/staistics'
import { dictItem } from '@/api/policyManagement'
import AMap from 'AMap'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import { EffectScatterChart } from 'echarts/charts'
echarts.use([EffectScatterChart])
import { VisualMapComponent } from 'echarts/components'
echarts.use([VisualMapComponent])
// echarts.use([MarkPointComponent])
import { MapChart } from 'echarts/charts'
echarts.use([MapChart])
import resize from '@/mixins/resize'

import { mapGetters } from 'vuex'
export default {
  mixins: [resize],
  data() {
    return {
      myChart: null,
      geoJson: {
        features: [],
      },
      cityGeo: {
        features: [],
      },
      cityMax: null,
      showBtn: false,
      parentInfo: [],
      cityData: {
        shouldInsureCorpNum: '',
        policyNum: '',
        accidentServicesNum: '',
      },
      qhMapData: [],
      mapLevelList: [], // 地图 等级数据
      pointMarkList: [], // 坐标
      gzArr: [106.53, 26.27],
      industryData: [], // 行业分类
      industryType: '', // 选中的行业
      paramsAreaCode: '', // 选中的地区
    }
  },
  props: {
    year: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      areaListAll: 'areas/areaListAll',
      areaMap: 'areas/areaMap',
    }),
  },
  created() {
    this.getindustryData()
  },
  mounted() {},
  methods: {
    async getindustryData() {
      //获取行业分类数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        let obj = {
          itemText: '矿山',
          itemValue: '10,11',
        }
        res.data.splice(0, 2, obj)

        this.industryData = res.data
      }
    },
    getNewData() {
      if (this.paramsAreaCode) {
        this.$emit('refreshMap', this.paramsAreaCode, this.industryType)
      } else {
        this.$emit('refreshMap', '', this.industryType)
      }
    },
    async getData(data) {
      let res = await getInsureByArea(data)
      if (res.code == '0000') {
        this.qhMapData = res.list
        this.getGeoJson(sysConfig.province_code)
      }
    },

    backMap() {
      this.paramsAreaCode = ''
      this.industryType = ''
      this.showBtn = false
      this.getGeoJson(sysConfig.province_code)
      this.$emit('refreshMap', '')
    },
    initLine(arr, num) {
      var map = new AMap.Map('container', {
        zoom: num, //级别
        center: arr, //中心点坐标
        viewMode: '3D', //使用3D视图
      })
    },
    getAreaAll() {
      let obj = JSON.parse(JSON.stringify(this.areaMap))

      let newObj = {}
      for (let key in obj) {
        newObj[key.slice(0, 6)] = obj[key]
      }
    },
    init() {
      this.myChart = echarts.init(document.getElementById('qhMap'))
      this.myChart.setOption({})
    },
    getGeoJson(adcode) {
      console.log(adcode, 'adcCode')
      let copyCode = adcode
      let that = this
      AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
        var districtExplorer = new DistrictExplorer()
        districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
          if (error) {
            return
          }
          let Json = areaNode.getSubFeatures()

          if (adcode == sysConfig.province_code && Json.length > 0) {
            that.geoJson.features = Json
            const roles = window.sessionStorage.getItem('roles')
            const yingjijuVO = JSON.parse(
              window.sessionStorage.getItem('yingjijuVO')
            )

            let rolesArr = []
            if (roles != undefined && roles != undefined) {
              if (roles.indexOf(',') != -1) {
                rolesArr = roles.split(',')
              } else {
                rolesArr = [roles]
              }

              if (
                rolesArr.includes('RL1453259052330127361') &&
                yingjijuVO &&
                yingjijuVO.cityCode
              ) {
                copyCode = yingjijuVO.cityCode.substring(0, 6)
                that.cityGeo.features = that.geoJson.features.filter((item) => {
                  return item.properties.adcode == copyCode
                })
              } else {
              }
            }
          } else {
            that.cityGeo.features = that.geoJson.features.filter((item) => {
              return item.properties.adcode == adcode
            })
          }

          that.getMapData(copyCode)
        })
      })
    },
    getMapData(adcode) {
      let mapData = this.geoJson.features.map((item) => {
        let levelData = this.mapLevelList.find(
          (it) => Number(it.areaCode) === item.properties.adcode
        )
        let itemStyleColor = '#032e8a'
        // let itemStyleColor = 'rgba(59, 163, 202,0.4)'

        if (this.geoJson.features.length > 1) {
          // 不等于0 不是最后一级
          if (!levelData) {
            let itemStyleColor = '#032e8a'
            // itemStyleColor = 'rgba(59, 163, 202,0.4)'
          } else if (levelData.dangerLevel < 0.5) {
            // 四级
            itemStyleColor = '#6ec1ff'
          } else if (
            levelData.dangerLevel >= 0.5 &&
            levelData.dangerLevel < 0.8
          ) {
            // 三
            itemStyleColor = '#ffdc78'
          } else if (
            levelData.dangerLevel >= 0.8 &&
            levelData.dangerLevel < 1
          ) {
            itemStyleColor = '#ff8243'
          } else if (levelData.dangerLevel > 1) {
            itemStyleColor = '#ff6652'
          }
        } else {
        }

        if (adcode == sysConfig.province_code) {
          this.qhMapData.map((i) => {
            if (i.areaCode.slice(0, 6) == item.properties.adcode) {
              item.shouldInsureCorpNum = i.shouldInsureCorpNum || '0'
              item.policyNum = i.policyNum || '0'
              item.accidentServicesNum = i.accidentServicesNum || '0'
            }
          })
        } else {
          this.qhMapData.map((i) => {
            item.shouldInsureCorpNum = this.cityData.shouldInsureCorpNum || '0'
            item.policyNum = this.cityData.shouldInsureCorpJoinNum || '0'
            item.accidentServicesNum = this.cityData.accidentServicesNum || '0'
          })
        }
        return {
          name: item.properties.name,
          childrenNum: item.properties.childrenNum, // 子级数量
          value: item.policyNum || '0', // levelData?levelData.dangerLevel:
          shouldInsureCorpNum: item.shouldInsureCorpNum || '0',
          policyNum: item.policyNum || '0',
          accidentServicesNum: item.accidentServicesNum || '0',

          itemStyle: {
            normal: {
              areaColor: itemStyleColor,
              borderColor: '#111',
            },
            emphasis: {
              //鼠标移入高亮显颜色
              areaColor: '#02aaf9',
            },
          },
          areaCode: item.properties.adcode,
        }
      })

      mapData = mapData.sort(function (a, b) {
        return b.value - a.value
      })
      let cityMax = mapData[0] ? mapData[0].value : 0
      for (let i = 0; i < mapData.length - 1; i++) {
        cityMax =
          cityMax < mapData[i + 1].value ? mapData[i + 1].value : cityMax
      }

      this.cityMax = cityMax
      this.initEcharts(mapData, adcode)
    },
    baiscOptionData(data, markPoint) {
      return {
        tooltip: {
          show: !this.showBtn,
          trigger: 'item',
          formatter: (p) => {
            let txtCon =
              p.name +
              '<br>' +
              p.marker +
              '应投保企业数：' +
              p.data.shouldInsureCorpNum +
              '<br>' +
              p.marker +
              '保单数：' +
              p.data.policyNum
            // '<br>' +
            // p.marker +
            // '事故预防服务次数：' +
            // p.data.accidentServicesNum

            return txtCon
          },
        },
        visualMap: [
          {
            show: !this.showBtn,
            type: 'continuous',
            calculable: true,
            realtime: true,
            min: 0,
            seriesIndex: this.showBtn ? false : 0,
            max: this.cityMax,
            precision: 0,
            right: '20',
            align: 'left',
            top: 'bottom',
            inRange: {
              // color: ['#adb0b2', '#06394e', '#062e42'],
              color: ['#98aac8', '#618cbb', '#3291f8', '#0062fe', '#00378e'],
            },
            text: ['高', '低'],
            textStyle: {
              color: '#fff',
            },
          },
        ],
        series: [
          {
            name: '地图',
            type: 'map',
            map: 'Map',
            roam: true, //是否可缩放
            zoom: 1.05, //缩放比例
            data: data,
            selectedMode: false,
            coordinateSystem: 'geo',
            label: {
              normal: {
                show: true,
                color: '#fff',
                formatter: (p) => {
                  return p.name
                },
              },
            },

            itemStyle: {
              selectedMode: false,
              borderColor: '#fff',
            },
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            rippleEffect: {
              period: 15,
              scale: 4,
              brushType: 'fill',
            },
            hoverAnimation: true,
            itemStyle: {
              normal: {
                color: '#ffff',
                shadowBlur: 10,
                shadowColor: '#333',
              },
            },
            data: data,
          },
        ],
      }
    },
    // 设置echart处理函数
    setOptionHandler(
      option,
      notMerge = true,
      lazyUpdate = false,
      silent = false
    ) {
      this.myChart.setOption(option, notMerge, lazyUpdate, silent)
    },
    // 设置series中的emphasis处理函数
    // 鼠标移入弹出相应颜色
    seriesEmphasisHandler(color) {
      return {
        series: [
          {
            emphasis: {
              itemStyle: {
                areaColor: '#e1e8fa',
                borderWidth: 1.6,
                borderColor: '#4b0082',
              },
            },
          },
        ],
      }
    },
    seriesMarkPointHandler(data = []) {
      // data 坐标数据处理

      return {
        // markLine 也是同理

        // silent: true,
        data: data,
      }
    },
    initEcharts(mapData, adcode) {
      this.myChart = echarts.init(document.getElementById('qhMap'))

      if (adcode == sysConfig.province_code) {
        echarts.registerMap('Map', this.geoJson) //注册
      } else {
        echarts.registerMap('Map', this.cityGeo) //注册
      }

      // 是否插入markPoint 坐标
      let markPoint = null
      if (mapData.length === 1) {
        markPoint = this.seriesMarkPointHandler(this.pointMarkList)
      }
      this.setOptionHandler(this.baiscOptionData(mapData, markPoint))

      let that = this
      this.myChart.off('click')

      this.myChart.on('click', async (params) => {
        console.log(params, '+++++')
        if (params.data.childrenNum) {
          if (this.paramsAreaCode) {
          } else {
            that.showBtn = true
            // this.cityData = params.data
            await that.$emit(
              'refreshMap',
              params.data.areaCode,
              this.industryType
            )
            this.$nextTick(() => {
              // that.getGeoJson(params.data.areaCode)
            })
          }

          that.paramsAreaCode = params.data.areaCode
        }
      })
    },
  },
}
</script>
<style lang="scss">
#container {
  width: 100%;

  height: 100%;
}
.amap-marker-content {
  .tipMarker {
    color: #555;

    border: 1px solid #7e7e7e;
    padding: 2px 6px;
    font-size: 12px;
    white-space: nowrap;
    display: inline-block;

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      margin: auto;
      width: 0;
      height: 0;
      border: solid transparent;
      border-width: 5px 5px;
    }
    &.top {
      transform: translate(-50%, -110%);
      &:before,
      &:after {
        bottom: -9px;
        left: 0;
        right: 0;
        border-top-color: rgba(255, 254, 239, 0.8);
      }
      &:before {
        bottom: -10px;
        border-top-color: #7e7e7e;
      }
    }
  }
}
.amap-logo,
.amap-copyright {
  display: block !important;
  visibility: inherit !important;
}
</style>
<style lang="scss">
#centerMap2 {
  height: 100%;
  position: relative;

  .backBtn {
    position: absolute;
    right: 0.6rem;
    width: 3.3rem;
    height: 1.6rem;
    border: 1px solid;
    border: 1px solid #cbd7f7;
    color: #cbd7f7;
    font-size: 12px;
    border-radius: 2px;
    z-index: 100;
    top: 10px;
    cursor: pointer;
    background-color: rgba(2, 42, 125, 0.5);
  }
  #qhMap {
    width: 100%;
    height: 100%;
    background-image: url('~@/assets/echarts_png/border1.png');
    background-size: 100% 100%;
    // top: 50%;
    // left: 50%;
    z-index: 89;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .indus {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 100;
    width: 100px;
    .el-input__inner {
      background-color: rgba(7, 58, 89, 0.5);
      color: #fff !important;
      border: none;
      border-radius: 8px;
    }
  }
}
</style>
