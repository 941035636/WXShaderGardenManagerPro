<template>
  <div id="supervisStatisHome">
    <div class="topTitle"><topTitle :propName = 'propName' /></div>
    <div class="containers">
      <div class="left-warp">
        <div class="leftd">
          <LeftTop
            v-if="leftFlag"
            :totalCorp="leftData.eleNum"
          />
        </div>
        <div class="leftd">
          <LeftCenter
            v-if="leftFlag"
			:centerData="leftData"
          />
        </div>
        <div class="leftd">
          <LeftBottom
            v-if="leftFlag"
            ref="LeftBottom"
            :topFiveData="topFiveData"
          />
        </div>
      </div>
      <div class="center-warp">
        <!-- <Map @getName = 'setName'
      
        /> -->
        <MapsCenter
			ref="mapsRef"
			@handlerMapLevel="handlerMapLevelClickData"
        />
      </div>
      <div class="rigth-warp">
        <div class="rightd">
          <RightTop v-if="rightFlag" :rightTopData="rightTopData" />
        </div>
        <div class="rightd">
          <RightCenter v-if="rightFlag" ref="RightCenter" :rightCenterData="rightCenterData" />
        </div>
    
      </div>
    </div>
  </div>
</template>

<script>
import LeftTop from "./components/LeftTop";
import LeftCenter from "./components/LeftCenter";
import LeftBottom from "./components/LeftBottom";
import MapsCenter from "./components/MapsCenter";
// import Map from "./components/Map";
import RightTop from "./components/RightTop";
import RightCenter from "./components/RightCenter";
import RightBottom from "./components/RightBottom";
import topTitle from "./components/Top";
import {elevator} from '../../../server/accidenServer.js';

export default {
  name: "supervisStatisHome",
  components: {
    LeftTop,
    LeftCenter,
    LeftBottom,
    MapsCenter,
    // Map,
    RightTop,
    RightCenter,
    RightBottom,
    topTitle
  },
  data() {
    return {

     propName:'',
      configData: {}, // 安监局配置信息
      leftFlag: true, // 左侧加载数据
      centerFlag: true, // 中间加载数据
      rightFlag: true, // 右侧加载数据
      leftTopData: {
        totalCorp: 0, // 总家数
        areaList: [], // 区域名称
        corpNumberList: [] // 企业数量
      },
      letfCenterData: {
        monthList: [],
        riskList: []
      }, // 左侧中间数据
      leftBottomData: {
        totalPiece: 0, // 总件数
        monthList: [], // 月份
        pieceNumberList: [] // 每件数
      },
      rightTopData: {
        acdpreNum: 0, // 事故预防次数
        corpNum: 0, // 服务企业数量
        dangerNumber: 0, // 隐患数量
        perSonNum: 0 // 参与人数
      },
      rightCenterData: {}, // 电梯责任险总保费数据
      rightBottomData: [], // 整改情况

      premiumData: {
        total: 0,
        lastYear: 0
      },
      Elevator:new elevator(),
      leftData:{},
      topFiveData:[],
	  biaojiHuang: require("../../../../static/img/mapEchart/yellow.png"),
      biaojiHong: require("../../../../static/img/mapEchart/orange.png"),
      biaojiHongs: require("../../../../static/img/mapEchart/red.png"),
      biaojiLan: require("../../../../static/img/mapEchart/blue.png"),
    };
  },
  created() {
    // this.safetyConfig();
    this.initData();
  },
  methods: {
   setName(e){
     this.propName = e
   },
    initData() {
      // this.getCorpCaseInfo();
      // this.getAcdpreInfo();
      // this.getRiskMapInfo();
	  let year = new Date().getFullYear()
      this.getSum() //在保电梯统计查询
	  this.getRank5();//保费前5分钟机构
	  this.getProvinceMap()///省分布图
	  this.getYearAndMonth(year)//获取年度和月度同比保费

    },
	async getSum() {
		let res = await this.Elevator.getSum();
		if(res.code == '0000') {
			this.leftData = res.data;
		}
	},
	async getRank5() {
		let res = await this.Elevator.getRank5();
		if(res.code == '0000') {
			this.topFiveData = res.list;
			this.$refs.LeftBottom.initLineEcharts(this.topFiveData);
		}
	},
	async getProvinceMap() {
		let res = await this.Elevator.getProvinceMap();
		if(res.code == '0000') {
			res.list.forEach(i => {
				i.name = i.provinceName
				i.code = i.provinceCode
			});
			this.$refs["mapsRef"].proviceData = res.list;
			this.$refs["mapsRef"].getGeoJson(100000);
		}
	},
	// 处理点击地图 获取对应数据
    handlerMapLevelClickData(cityCode,name) {
		console.log(name)
		let one = (cityCode + "").substring(4, 6);
		let two = (cityCode + "").substring(2, 4);
		let pro = (cityCode + "").substring(0, 2);
		if((pro == '11' || pro == '12' || pro == '31') && two == '00') {
			let proCode = pro + '0000';
			let cityCode = pro + '0100';
			this.getCityData({provinceCode:proCode,cityCode:cityCode},proCode,name)
		} else if (pro == '50'  && two == '00') {
			let proCode = pro + '0000';
			this.getCityDataTwo(proCode,pro,name)
		} else if(one == '00' && two == '00') {
			this.getProData({provinceCode:cityCode},name)
		} else if(one == '00' && two != '00') {
			let proCode = (cityCode + "").substring(0, 2) + '0000';
			this.getCityData({provinceCode:proCode,cityCode:cityCode},cityCode,name)
		}
    },
	async getProData(data,name) {
		let res = await this.Elevator.getCityMap(data);
		if(res.code == '0000' && res.list && res.list.length != 0  ) {
			res.list.forEach(i => {
				i.name = i.cityName
				i.code = i.cityCode
			});
			this.$refs["mapsRef"].choose.cityCode = data.provinceCode;
			this.$refs["mapsRef"].choose.cityName = name;
			this.$refs["mapsRef"].proviceData = res.list;
			this.$refs["mapsRef"].getGeoJson(data.provinceCode);
		} else {
			this.$message({
				message: '暂无数据！',
				type: 'error'
			});
		}
	},
	async getCityData(data,code,name) {
		let res = await this.Elevator.getCountryMap(data);
		if(res.code == '0000' && res.list && res.list.length != 0) {
			res.list.forEach(i => {
				i.name = i.countryName
				i.code = i.countryCode
			});
			let pointMarkList = [];
			res.list.forEach(eleItem => {
				pointMarkList = pointMarkList.concat(eleItem.elevatorObjectList)
			})
			pointMarkList = pointMarkList.map((item) => {
				let color = "";
				let symbol = "";
				color = "#fcc5e4";
				symbol = "image://" + this.biaojiHongs;
				let address = item.provinceName + item.cityName + item.countryName + item.useOfAddress;
				let eleCode = item.equipmentsCode ? item.equipmentsCode : item.factoryNumber;
				let useOfUnit = item.useOfUnit ? item.useOfUnit : '--'

				// color = "#ffdc78";
				// symbol = "image://" + this.biaojiHuang;

				// color = "#ff8243";
				// symbol = "image://" + this.biaojiHong;

				// color = "#ff6652";
				// symbol = "image://" + this.biaojiHongs;
				
				return {
					name: "使用单位：" + useOfUnit + "<br/>坐落地址：" + address + '<br/>设备代码/出厂编号：' + eleCode,
					coord: item.lngAndLag ? item.lngAndLag.split(",") : [],
					symbolSize: 20,
					symbol: symbol,
				}; 
			});
			let proCode = (code + "").substring(0, 2);
			if(proCode == '11' || proCode == '12' || proCode == '31') {
				this.$refs["mapsRef"].choose.cityCode = data.provinceCode;
				this.$refs["mapsRef"].choose.cityName = name;
			} else {
				this.$refs["mapsRef"].choose.countryCode = code;
				this.$refs["mapsRef"].choose.countryName = name;
			}
			this.$refs["mapsRef"].pointMarkList = pointMarkList;
			this.$refs["mapsRef"].getGeoJson(code);
		} else {
			this.$message({
				message: '暂无数据！',
				type: 'error'
			});
		}
	},
	//重庆
	async getCityDataTwo(code,pro,name) {
		let data1 = {
			provinceCode:code,
			cityCode:pro + '0100'
		}
		let data2 = {
			provinceCode:code,
			cityCode:pro + '0200'
		}
		let res = await this.Elevator.getCountryMap(data1);
		let res1 = await this.Elevator.getCountryMap(data2);
		if(res.code == '0000' && res1.code == '0000' && res.list && res1.list) {
			let totalData = res.list.concat(res1.list);
			totalData.forEach(i => {
				i.name = i.countryName
				i.code = i.countryCode
			});
			let pointMarkList = [];
			totalData.forEach(eleItem => {
				pointMarkList = pointMarkList.concat(eleItem.elevatorObjectList)
			})
			pointMarkList = pointMarkList.map((item) => {
				let color = "";
				let symbol = "";
				color = "#fcc5e4";
				symbol = "image://" + this.biaojiHongs;
				let address = item.provinceName + item.cityName + item.countryName + item.useOfAddress;
				let eleCode = item.equipmentsCode ? item.equipmentsCode : item.factoryNumber;
				let useOfUnit = item.useOfUnit ? item.useOfUnit : '--'

				// color = "#ffdc78";
				// symbol = "image://" + this.biaojiHuang;

				// color = "#ff8243";
				// symbol = "image://" + this.biaojiHong;

				// color = "#ff6652";
				// symbol = "image://" + this.biaojiHongs;
				
				return {
					name: "使用单位：" + useOfUnit + "<br/>坐落地址：" + address + '<br/>设备代码/出厂编号：' + eleCode,
					coord: item.lngAndLag.split(","),
					symbolSize: 20,
					symbol: symbol,
				}; 
			});
			this.$refs["mapsRef"].choose.cityCode = code;
			this.$refs["mapsRef"].choose.cityName = name;
			this.$refs["mapsRef"].pointMarkList = pointMarkList;
			this.$refs["mapsRef"].getGeoJson(code);
		} else {
			this.$message({
				message: '暂无数据！',
				type: 'error'
			});
		}
	},
	async getYearAndMonth(year) {
		let res = await this.Elevator.getYearAndMonth({year:year})
		if(res.code == '0000') {
			this.rightCenterData = res.data;
			this.$refs.RightCenter.initlineEchart(res.data.monthList)
		}
	}
   
  }
};
</script>

<style lang="less">
#supervisStatisHome {
  overflow: hidden;
  height: 100%;
    background-color: #020053;
 
  div {
    box-sizing: border-box;
  }
  .topTitle{
    height: 14%;
  }
  .containers {
    // margin:0 10px;
    display: flex;
    justify-content: space-between;
    // height: calc(80%);
    height: 86%;
   
  }
  .left-warp {
    width: 25%;
    height: 100%;
    display: flex;
    box-sizing: content-box;
    flex-direction: column;
    .leftd {
     
      flex: 1.5;
     
      background: #fff;
      margin-bottom: 10px;
    }
    .leftd:nth-child(2) {
     flex: 0.5;
    }
    .leftd:last-child {
      flex: 1;
      margin-bottom: 0;
    }
  }
  .center-warp {
    width: 50%;
    height: 100%;
    background: #fff;
    margin: 0 10px;
    display: flex;
  }
  .rigth-warp {
    width: 25%;
    height: 100%;
    display: flex;
    box-sizing: content-box;
    flex-direction: column;
    flex: 1;
    .rightd {
      flex: 1.5;
      background: #fff;
      margin-bottom: 10px;
    }
    .rightd:last-child {
      flex: 2;
      margin-bottom: 0;
    }
  }
}
</style>
