<template>
<!-- 更改认证信息组件 -->
  <div>
    <div class="title">
			<div class="title-l">
				<div class="auth-content">
					<span class="ml10">{{title}}</span>
					<span>|</span>
					<span class="ml10" v-if="createTime">注册时间：{{createTime}}</span>
					<span v-if="auditStatus">
						<span>账号状态：</span>
						<span v-if="auditStatus=='0'"  class="color-red">已停用</span> 
						<span v-if="auditStatus=='1'"  class="color-gre">启用</span> 
					</span>
				</div>
			</div>
			<div class="title-r">
				<div  @click="back" style="color: #FA8C16;cursor: pointer;"><i class="el-icon-refresh-left"></i>返回列表页</div>
				<el-button style="margin-left: 40px;" v-if="isSubmit" type="primary" @click="submit" round>确认提交</el-button>
			</div>
		</div>
  </div>
</template>

<script>

export default {
    props: {
			title:{
				type:String,
        default:()=>{
					return ''
				}
			},
			createTime:{
				type:String,
        default:()=>{
					return ''
				}
			},
			statusBool:{
				type:Boolean,
				default:()=>{
					return false
				}
			},
			auditStatus:{
				type:String,
			},
			isSubmit:{
				type:Boolean,
				default:()=>{
					return false
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
      submit() {
				this.$emit('submitCallBack')
			},
      back() {
				this.$router.back()
			},
    },
      
};
</script>

<style lang="less" scoped>
  .title{
		display: flex;
		justify-content: space-between;
		height: 40px;
		line-height: 40px;
		background-color: #fff;
		padding: 10px 40px;
		color: #535F7A;
		border-radius: 2px;
		font-size: 20px;
		// position: relative;
		.title-l {
			.auth-content{
				display: inline-block;
				height: 40px;
				line-height: 40px;
				color: #181E2D;
				font-size: 16px;
			}
		}
		.title-r {
			display: flex;
		}
	}


</style>
