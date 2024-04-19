
/
* 上部导航头组件
* @version 1.0.0
* @edit: quweina
*/
<template>
	<div class="header boxShadow">
		<div class="logo">
			<img src="../../../static/img/logo.png">
			特设保业务管理系统
			<div class="line-style"></div>
		</div>
		<div class="top-menu" @click="goToBF">
			<span>客户拜访</span>
		</div>
		<div class="user-info">
			<p class="user-info-department">
				<span>{{branchName}}</span>
			</p>
			<el-dropdown trigger="click" @command="handleCommand">
				<span class="el-dropdown-link">
					<!-- <img class="user-logo" src="../../../static/img/img.jpg"> -->
					你好，{{username}}
					<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="updataPwd">修改密码</el-dropdown-item>
					<el-dropdown-item command="loginout">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
      <span>
          <!-- <el-badge :value="noteNum" :hidden="noteNum > 0 ? false : true" :max="99" class="item"> -->
          <el-badge :value="noteNum" :max="99" class="item">
            <i class="el-icon-message-solid hint hints" @click="goBroker"></i>
          </el-badge>
        </span>
		</div>
    <el-dialog title="预约记录" :visible.sync="dialogVisible" width="1200px" :modal-append-to-body="false" :close-on-click-modal="false">
      <NoteList ref="noteList"></NoteList>
    </el-dialog>
	</div>
</template>
<script>
 import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
 import NoteList from '@/views/serviceBroker/NoteList'
 import BrokerServer from '@/service/brokerServer'
import MiddleUtil from "../../util/MiddleUtil.js"

	export default {
		data() {
			return {
        brokerServer:new BrokerServer(),
				name: '',
        branchName:window.sessionStorage.getItem('branchName') || '',
        noteNum:"",
        dialogVisible:false,
			}
    },
    components:{
      NoteList,
    },
		computed: {
			...mapGetters('userInfo',{
				userInfoStore:'renderUserInfo'
			}),
			username() {
				let username = this.userInfoStore.userName;
				return username ? username : this.name;
			}
		},
		created(){
			// this.getBorkerNote();
		},
		mounted(){
		   var that = this;
		   MiddleUtil.$on('demo', function (msg) {
		       console.log(msg,'2222222222222222');
		       that.getBorkerNote();
		   })
		},
		methods: {
      async getBorkerNote(){
        let res = await this.brokerServer.getAgentNote();
        if(res.data.code == '0000'){
          this.noteNum = res.data.data;
        }
      },
      goBroker(){
		// if(this.noteNum > 0){
		// 	this.dialogVisible = true;
		// }
			this.dialogVisible = true;
      },
			handleCommand(command) {
				if (command == 'loginout') {
					sessionStorage.removeItem('authorization');
					sessionStorage.removeItem('index');
					sessionStorage.removeItem('data');
					sessionStorage.removeItem('loginAccount');
					sessionStorage.clear();
					localStorage.clear();
					this.$router.push('/login');			
				} else if (command == 'updataPwd') {
					this.$router.push({
						path:'/ChangePassword'
					})
				}
			},
			goToBF() {
				this.$router.push({
					path:'/marketingRecords'
				})
			}
		}
	}

</script>
<style scoped lang="less">
@import '../../assets/styles/public.less';
// .boxShadow(@boxShadow:5px 5px 5px #000) {
// 	// -webkit-box-shadow: @boxShadow;
// 	box-shadow+: @boxShadow;
// }
.hint {
  font-size: 20px;
  cursor: pointer;
}
.hints{
	color: #f56c6c;
}
	.header {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 60px;
		font-size: 22px;
		line-height: 60px;
		color: #000;
		z-index: 999;
		border-bottom: 1px solid rgba(0,0,0,.08);
		box-shadow: 0px 1px 4px 0px rgba(0,0,0,.08);
		
	}

	.header .logo {
		float: left;
		width: 360px;
		text-align: center;
	}

	.user-info {
		float: right;
		padding-right: 50px;
		font-size: 16px;
		color: #5a503b;
	}

	.user-info .el-dropdown-link {
		position: relative;
		display: inline-block;
		height: 60px;
		padding-left: 30px;
		color: #5a503b;
		cursor: pointer;
		vertical-align: middle;
	}

	.user-info .user-logo {
		position: absolute;
		left: 0;
		top: 15px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.el-dropdown-menu__item {
		text-align: center;
	}
	.user-info-department {
		display:inline-block;
		height: 60px;
	}
	.user-info-department span{
		display:inline-block;
		border: 1px solid #EBE0CE;
		background-color:#FFF7E6;
		border-radius: 20px;
		color:#D46B08;
		padding:0 20px;
		height: 26px;
		line-height: 26px;
		font-weight:bold;
		font-size: 14px;
	}

	.logo {
		height: 100%;
		// background: @header_logo;
		/* background-size: contain; */
		background-position: 20px;
		img {
			width: 40px;
			height: 40px;
			vertical-align: middle;
			margin-right: 10px;
		}
		.line-style {
			border-right: 2px dashed #ccc;
			display: inline-block;
			height: 30px;
			position: absolute;
			top: 15px;
			left: 335px;
		}
	}
	.top-menu {
		cursor: pointer;
		font-size: 16px;
		color:#D46B08;
		display: inline-block;
	}

</style>
<style lang="less">
  .header{
    .el-badge__content.is-fixed{
      top: 11px;
    }
    .el-badge__content{
      background: none;
      line-height:20px;
      color: #F56C6C;
    }
  }
</style>
