/
* @property { data : {Array} option中的数据}
* @property { label : {String} 标签文本。 }
* @property { componyTitlelabel : {String} 企业标签文本。 }
* @property { v-model : {String} 语法糖，利用value接值父子组件相互传值 当前表单填写的内容 }
* @version 1.0.0
* @edit: quweina
*/
<template>
	<div style="display:inline-block;width:50%;">
		<el-col :span="12">
			<el-form-item :label='label'>
				<el-cascader :options="productDate" v-model="ruleForm.productOptions" @change="productChange" clearable :size="size">
				</el-cascader>
			</el-form-item>
		</el-col>
		<el-col :span="12">
			<el-form-item :label="componyTitlelabel">
				<el-autocomplete v-model="ruleForm.name" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"
				 class="fl" clearable :size="size"></el-autocomplete>
			</el-form-item>
		</el-col>
	</div>


</template>

<script>
	export default {
		props: {
			data: Array,
			label: String,
			componyTitlelabel: String
		},
		data() {
			return {
				productDate: [],
				ruleForm: {
					productOptions: [],
					cropParamList: [],
					productCode: '',
					name: '',
					code: '',
					item: {}

				},
				restaurants: [],
				vals: [],
				size: 'small'
			}
		},
		created() {
			// this.initDate();
			this.productDate = this.data;

		},
		methods: {

			handleSelect(item, index) {

				console.log(item)
				this.ruleForm.item = item;
				this.$emit('input', {
					vals: this.vals,
					item: this.ruleForm.item

				})
			},
			productChange() { //申请项目函数
				console.log(this.ruleForm.productOptions)

				this.vals = this.getCascaderObj(this.ruleForm.productOptions, this.productDate);
				if (this.vals.length > 0) {

					this.ruleForm.productCode = this.vals[0].value;

				}
				this.loadAll(this.ruleForm.productOptions);
				console.log(this.vals)

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
				console.log(productCode)
				var componyAll = [];
				// if (productCode.length>0) {
				var myProductCode = '';
				if (productCode.length > 0) {
					myProductCode = productCode[0]
				}
				this.$axios({
					method: 'get',
					url: this.$apiUrl.corps,
					params: {
						'productCode': myProductCode
					}
				}).then(res => {
					console.log(res)

					var list = res.data.list;
					if (list) {
						for (let i = 0; i < list.length; i++) {
							componyAll.push({
								value: list[i].name,
								address: list[i].code
							})
						}

					}

					console.log(componyAll)

					this.ruleForm.name = '';
					this.restaurants = componyAll;

					//服务企业数据
				})

				// } else {

				// }

			},
			querySearchAsync(queryString, cb) {
				if (!this.ruleForm.name) {
					this.ruleForm.item = {};
					this.$emit('input', {
						vals: this.vals,
						item: this.ruleForm.item
					})

				}

				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
				console.log(results)
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(results);
				}, 1000 * Math.random());
			},
			createStateFilter(queryString) {
				console.log(queryString)

				return (state) => {
					console.log(state.value.toLowerCase())
					return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1); //模糊查询
				};
			}
		}
	}

</script>
