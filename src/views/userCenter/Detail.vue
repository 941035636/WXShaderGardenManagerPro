<template>
    <div class="parent" id="parent">
        <Title v-bind="userDetails" @back="back"/>
        <!-- <el-tabs type="border-card" v-model="value" @tab-click="searchFun" class="state-style">
			<el-tab-pane :label="item.label" :name="item.value" v-for="(item,index) in tabList" :key="index"></el-tab-pane>
		</el-tabs> -->
        <AccountDetails :enterprise="userDetails" :business="business" :startData="startData"/>
        <RelationDetails :userloginIdList="userloginIdList"/>
    </div>
</template>

<script>

// 子级组件
import Title from './components/Title'
import AccountDetails from './components/AccountDetails';
import RelationDetails from './components/RelationDetails';
import {elevator} from '@/server/accidenServer.js';
import userService from '@/service/UserService.js';
export default {
    components: {
        Title,
        AccountDetails,
        RelationDetails,
    },
    data() {
        return {
          Elevator:new elevator(),
          userService: new userService(),
          tabList:[{ label: "详情", value: "details" }],
          value:"details",
          userDetails: {}, // 企业信息
          business: {}, // 业务员信息
          startData: {}, // 星级信息
          userloginIdList: [], // 登录账号信息
          optionsArea: [], //
        }
    },
    created(){
    },
    mounted() {
        this.getArea();
    },
    methods: {
      async getArea(){ //获取地区
        let parmes = await this.Elevator.getAreas();
        if(parmes.code == '0000'){
          this.optionsArea = parmes.data;
          this.userinformation();
        }
      },
      // 获取认证信息
      async userinformation(){
        let row = this.$route.query
        this.userDetails = {...row,title:'用户详情',...this.userDetails}
        // this.getStartLevel(row)
        let res = {};
        if(this.$route.query.userType == '个人') {
          res = await this.Elevator.getauthsequipPer({"param":this.$route.query.userCode,"channelNo":'sequip'});
        } else {
          res = await this.Elevator.getauthsequip(this.$route.query.userCode,'sequip');
        }
        if(res.code == '0000' && res.data){
          this.userDetails = {...this.userDetails,...res.data}
          this.startData = {starLevel:res.data.startLevel}
          if(res.data.provinceCode){
						let provinceCode = res.data.provinceCode.slice(0,2)+'0000';
						let cityCode = res.data.provinceCode.slice(0,4)+'00';
						let areaCode = res.data.provinceCode;

            let provinceData = this.optionsArea.find(item=>item.value === provinceCode) || {label:'',children:[]}
            let cityData = provinceData.children.find(item=>item.value === cityCode) || {label:'',children:[]}
            let areaData = cityData.children.find(item=>item.value === areaCode) || {label:'',children:[]}
            this.userDetails.provinceName = [provinceData.label,cityData.label,areaData.label].join('/')
					}
          this.getUserlist(this.userDetails.orgFullName)
        }	
      },
    async getUserlist(val=''){//获取用户列表
        let form = {
          pageNum:'1',
          pageSize:10,
          loginIdOrUserName:val,
          papers:'',  // 证件号
          userType:'',
          areaCode:''
        }
			let res = await this.userService.getuserlist(form);
			if(res.code == '0000'){
        this.userloginIdList = res.list.filter(item =>{
          return this.userDetails.userCode == item.userCode
				})
			}
		},
    async getStartLevel(row) {
      var params = {
          userCode: row.userCode,
          orgCode: '',
          starLevel: '',
          channelCode:"sequip"
      };
      let res = await this.userService.getStartLevel(params)
      if(res.code == "0000"){
          this.startData = res.data || {};
      }
    },
      back() {
          this.$router.back()
      },
      searchFun() {},
    }
}

</script>

<style lang="less" scoped>
    .parent {
        height: 100%;
        margin: 0 20px;
        border-radius: 4px;
        color: #000;
    }

    .body {
        width: calc(100% - 40px);
        height: calc(100% - 40px - 38px);
        background-color: white;
        border-radius: 4px;
        padding: 20px;
    }
    
</style>
<style lang="less">
    #parent {
        .state-style {
			background-color: #ffffff;
			font-size: 16px;
            margin: 10px 0;
			.is-active {
                background: #1890FF ;
                color: #fbfbfb !important;
                font-size: 16px;
                border-right-color: #1890FF ;
                border-left-color: #1890FF ;
			}
			.el-tabs__header {
				background-color: #ffffff;
				border-bottom: 2px solid #1890FF ;
				margin: 0;
			}
			.el-tabs__content {
				display: none;
			}
			.el-tabs__item {
				padding: 0 35px;
				height: 40px;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				line-height: 40px;
				display: inline-block;
				list-style: none;
				font-size: 16px;
				font-weight: 500;
				color: #101010;
				position: relative;
			}
		}
        
    }
</style>

