<template>
	<div id="SearchTravel">
		<el-select
			ref="selectTravel"
			popper-class="addSelect"
			v-model="form.holderName"
			filterable
			placeholder="请输入企业名称（模糊查询）"
			remote
			:remote-method="remoteMethod"
			@change="changeVal"
			:size="size"
			clearable
		>
			<el-option
				v-for="(item,index) in erpInfoList"
				:key="index"
				:label="item.custFullName"
				:value="item[bindVal]"
                class="sigle-person"
			>
				<div>
					<p>{{ item.custFullName }}</p>
					<p style="overflow:hidden">
						<span>用户名： {{item.userloginId}}</span>
					</p>
					<p style="overflow:hidden">
						<span>认证状态： {{item.auditStatus=='1'?'已认证 ':'未认证'}}</span>
					</p>
				</div>
			</el-option>
		</el-select>
	</div>
</template>

<script>
export default {
	name: "SearchHolder",
	data() {
		return {
			form: {
				holderName: ""
			},
			currentPage: 1
		}
	},
	props: {
		erpInfoList: {
			type: Array,
			default: []
		},
		size: {
			type: String,
			default: "small"
		},
		bindVal: {
			type: String,
			default: "userCode"
		}
	},
	created() {
        this.form.holderName = '';
    },
	methods: {
        resetData() {
            this.form.holderName = '';
        },
		remoteMethod(value) {
			if (value.length >= 4) {
				this.$emit('remoteMethod', value);
			}
		},
		changeVal(value) {
			this.$emit('changeVal', value);
		},
	}
}
</script>

<style lang='less'>
    #SearchTravel {
        .el-select {
			width: 60%;
		}
    }
	.addSelect {
		.el-select-dropdown__item {
			height: 102px;
        }
        .sigle-person {
            border-bottom: 1px solid #eaeaea;
            margin: 5px;
        }
	}
</style>
