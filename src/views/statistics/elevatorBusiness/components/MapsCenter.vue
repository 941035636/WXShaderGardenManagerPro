<template>
  <div id="centerMap">
    <div class="mt10 mb10">
      <span  @click="toQuanguo" class="col-fff">全国</span>
      <span  v-if="choose.cityCode" @click="toCityData" class="col-fff"><span> > </span>{{choose.cityName}}</span>
      <span  v-if="choose.countryCode" class="col-fff no-hand"><span> > </span>{{choose.countryName}}</span>
    </div>
    <div id="qhMap"></div>
  </div>
</template>

<script>
 import echarts from "echarts";

require("echarts/lib/chart/map");
require("echarts/map/js/china");

  export default {
    
    data() {
      return {
        myChart: null,
        geoJson: {
          features: [],
        },
        parentInfo: [],
        mapLevelList: [], // 地图 等级数据
        pointMarkList: [], // 坐标,
        proviceData: [],
        choose: {
          cityCode:'',
          cityName:'',
          countryCode:'',
          countyrName:'',
        }
      }
    },
 
    created() {
      
    },
    mounted() {
      // this.getGeoJson(100000)
    },
    methods: {
     
      init() {
        // let res = getArea('2')
        this.myChart = echarts.init(document.getElementById('qhMap'))
        this.myChart.setOption({})
      },
      getGeoJson(adcode) {
        let that = this
        AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
          var districtExplorer = new DistrictExplorer()
          districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
            if (error) {
              console.log(error);
              return
            }
            let Json = areaNode.getSubFeatures()

            if (Json.length > 0) {
              that.geoJson.features = Json
            } else if (Json.length === 0) {
              that.geoJson.features = that.geoJson.features.filter(
                (item) => item.properties.adcode == adcode
              )
              if (that.geoJson.features.length === 0) return
            }
            that.getMapData()
          })
        })
      },
      getMapData() {
        let mapData = this.geoJson.features.map((item) => {
          let levelData = this.mapLevelList.find(
            (it) => Number(it.areaCode) === item.properties.adcode
          )
          let itemStyleColor = '#0037E4'
          let valueSum = this.proviceData.find(i => i.code == item.properties.adcode) ? this.proviceData.find(i => i.code == item.properties.adcode).jtCount : 0;
          if (valueSum && valueSum != 0) {
            itemStyleColor = "#66ffff";
          } 
          return {
            name: item.properties.name,
            childrenNum: item.properties.childrenNum, // 子级数量
            value: 0, // levelData?levelData.dangerLevel:
            itemStyle: {
              areaColor: itemStyleColor,
            },
            cityCode: item.properties.adcode,
            totalCount: this.proviceData.find(i => i.code == item.properties.adcode) ? this.proviceData.find(i => i.code == item.properties.adcode).totalCount : 0,
            jtCount: this.proviceData.find(i => i.code == item.properties.adcode) ? this.proviceData.find(i => i.code == item.properties.adcode).jtCount : 0,
            rate: this.proviceData.find(i => i.code == item.properties.adcode) ? this.proviceData.find(i => i.code == item.properties.adcode).rate : 0,
          }
        })

        mapData = mapData.sort(function (a, b) {
          return b.value - a.value
        })
        this.initEcharts(mapData)
      },
      baiscOptionData(data, markPoint) {
        return {
          tooltip: {
            formatter (params, ticket, callback) { // params.data 就是series配置项中的data数据遍历
							let htmlStr = `<div style='font-size:18px;'> ${params.name}</div>`;
              if((params.data.cityCode + '').substring(4, 6) == '00') {
                htmlStr += `<p style='text-align:left;margin-top:10px;'>电梯总数：${params.data.totalCount}部<br/>
                投保电梯：${params.data.jtCount}部<br/>
                电梯投保率：${params.data.rate}<br/>
                </p>`
              }
							return htmlStr
						}
          },
          series: [
            {
              name: '地图',
              type: 'map',
              map: 'Map',
              roam: true, //是否可缩放
              zoom: 1.1, //缩放比例
              top:130,
              data: data,
              label: {
                normal: {
                  show: true,
                  color: '#000',
                  formatter: (p) => {
                    switch (p.name) {
                      case '内蒙古自治区':
                        p.name = '内蒙古'
                        break
                      case '西藏自治区':
                        p.name = '西藏'
                        break
                      case '新疆维吾尔自治区':
                        p.name = '新疆'
                        break
                      case '宁夏回族自治区':
                        p.name = '宁夏'
                        break
                      case '广西壮族自治区':
                        p.name = '广西'
                        break
                      case '香港特别行政区':
                        p.name = '香港'
                        break
                      case '澳门特别行政区':
                        p.name = '澳门'
                        break
                      default:
                        break
                    }
                    return p.name
                  },
                },
              },
              markPoint: markPoint,
              itemStyle: {
                normal: {
                  shadowColor: 'rgb(58,115,192)',
                  shadowOffsetX: 1,
                  shadowOffsetY: 4,
                },
                // areaColor: "#ebebeb",
                borderColor: '#fff',
              },
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
      initEcharts(mapData) {
        let myChart = echarts.init(document.getElementById("qhMap"));
        window.addEventListener("resize", () => {
          myChart.resize();
        });
        this.myChart = echarts.init(document.getElementById('qhMap'))
        echarts.registerMap('Map', this.geoJson) //注册

        // 是否插入markPoint 坐标
        let markPoint = null
        console.log(mapData,'mapData----')
        if (!mapData.find(i => (i.cityCode + '').substring(4, 6) == '00')) {
          markPoint = this.seriesMarkPointHandler(this.pointMarkList)
        }
        this.setOptionHandler(this.baiscOptionData(mapData, markPoint))

        let that = this
        this.myChart.off('click')
        this.myChart.off('mouseover')
        this.myChart.on('mouseover', (params) => {
          this.myChart.dispatchAction({
            type: 'downplay',
          })
        })
        this.myChart.on('click', (params) => {
          this.$emit('handlerMapLevel', params.data.cityCode,params.data.name)
        })
      },
      toQuanguo() {
        if(this.choose.cityCode) {
          this.$parent.getProvinceMap();
        }
        this.choose.cityCode = '';
        this.choose.cityName = '';
        this.choose.countryCode = '';
        this.choose.countyrName = '';
      },
      toCityData() {
        this.$parent.getProData({provinceCode:this.choose.cityCode},this.choose.cityName);
        this.choose.countryCode = '';
        this.choose.countyrName = '';
      },
    },
  }
</script>

<style lang="less" scoped>
  #centerMap {
    background-color: #000844;
    width: 100%;
    height: 100%;
    .col-fff {
      color: #fff;
      cursor: pointer;
    }
    .no-hand {
      cursor: none;
    }
    .top {
      height: 20%;
      .border-four {
        margin: 10px;
        box-sizing: border-box;
        border: 2px solid #017cd6;
        border-radius: 5px;
        p {
          text-align: center;
        }
        p:first-child {
          color: #017cd6;
          margin: 10px 0 5px;
        }
        p:last-child {
          color: #000;
          font-size: 1.6rem;
          margin: 5px 0 10px;
        }
      }
    }
    #qhMap {
      height: 100%;
      background-color: #000844;
      background-size: cover;
    }
    .btn {
      float: right;
      margin-right: 2%;
      margin-bottom: 10px;
    }
  }
</style>
