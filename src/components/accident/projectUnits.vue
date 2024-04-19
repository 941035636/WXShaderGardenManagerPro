<template>
	<div style="display:inline-block;width:20%;">
		<el-form-item label="选择项目">
			<el-cascader :options="productDate" v-model="ruleForm.productOptions" @change="productChange" clearable size="small">
			</el-cascader>
		</el-form-item>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				productDate: [],
				ruleForm: {
					productOptions: [],
					cropParamList: [],
					productCode: '',
					code:'',
					item: {}
				},
				restaurants: [],
				vals: []
			}
		},
		created() {
			this.initDate()

		},
		methods: {
			initDate() { //数据初始化
				//申请项目及单位

				this.$axios({
					method: 'get',
					url: this.$apiUrl.acdappinit

				}).then(res => {
					console.log(res)
					var data = res.data.list;
					if (data) {
						for (let i = 0; i < data.length; i++) {
							this.productDate.push({
								'value': data[i].productCode,
								'label': data[i].productName
							})
						}
					}

				})


			},
			productChange() { //申请项目函数
				// console.log(this.ruleForm.productOptions)

				this.vals = this.getCascaderObj(this.ruleForm.productOptions, this.productDate);
				if (this.vals.length > 0) {

					this.ruleForm.productCode = this.vals[0].value;

				}
				// this.loadAll(this.ruleForm.productOptions);
				// console.log(this.vals)
				
				this.$emit('input', {
					vals: this.vals,
					item: this.ruleForm.item

				})

			},
			getCascaderObj(val, opt) { //label val集合
				return val.map(function (value, index, array) {
					for (var itm of opt) {
						if (itm.value == value) {
							opt = itm.children;
							return itm;
						}
					}
					return null;
				})
			},
			loadAll(productCode) { //数据
				// console.log(productCode)
				var componyAll = [];
				// if (productCode.length>0) {
				this.$axios({
					method: 'get',
					url: this.$apiUrl.corps,
					params: {
						'productCode': productCode[0]
					}
				}).then(res => {
					// console.log(res)

					var list = res.data.list;
					if (list) {
						for (let i = 0; i < list.length; i++) {
							componyAll.push({
								value: list[i].name,
								address: list[i].code
							})
						}

					}

					// console.log(componyAll)

					this.ruleForm.name = '';
					this.restaurants = componyAll;

					//服务企业数据
				})

				// } else {

				// }

			},
		}

	}

</script>
