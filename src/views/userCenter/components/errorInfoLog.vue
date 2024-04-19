<template>
  	<div class="errorDialog">
		<el-dialog title="失败原因" :visible.sync="dialogVisible" destroy-on-close :close-on-click-modal=false @close="closeDialog">
			<div>
				<span class="col-org f18">{{data.failReason}}</span>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeDialog" type="info" round :size="size">取 消</el-button>
				<el-button type="warning" round @click="saveFn" :size="size">重新推送</el-button>
			</span>
		</el-dialog>
  	</div>
</template>

<script>
import {elevator} from '../../../server/accidenServer.js'
import userService from '../../../service/UserService'
export default {
  	name: "errorDialg",
	props: {
		data:{
			type: Object,
		},
		dialogVisible:{
			type: Boolean,
			default:false
		},
		size: {
			type: String,
			default: "small"
		},
	},
	data() {
		return {
			
		}
	},
	methods: {
		saveFn() {
			this.$emit("againAccount", this.data);
		},
		closeDialog() {
			this.$emit("closeLog");
		},
	},
}
</script>

<style lang='less'>
	.errorDialog {
		.col-org {
			color: #fa8c16;
		}
	}
</style>
