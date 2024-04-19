<template>
<!-- 账号信息 -->
  <div>
    <div class="AccountInformation">
			<div class="account-title">账号信息</div>
			<el-row>
				<el-col :span="12">
					<span>登录用户名：</span>
					<span>{{userLoginId}}</span>
				</el-col>
				<el-col :span="12">
					<span>用户编码：</span>
					<span>{{userCode}}</span>
				</el-col>
			</el-row>
		</div>
  </div>
</template>

<script>

export default {
    props: {
			userLoginId:{
				type:String,
				default:()=>{
					return ''
				}
			},
			userCode:{
				type:String,
				default:()=>{
					return ''
				}
			},
		},
    data() {
        return {
					data:{}
				}
    },
    computed: {
    },
    mounted() {
    },
    methods: {
    
    },
      
};
</script>

<style lang="less" scoped>
  .AccountInformation{
		margin-top: 10px;
		background-color: #fff;
		padding: 20px 80px;
		.account-title {
			font-size: 16px;
			font-weight: 600;
			margin-bottom: 10px;
      color: #000;
		}
	}


</style>
