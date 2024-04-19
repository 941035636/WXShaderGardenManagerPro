/
* @property { data : {Array} option中的数据}
* @property { label : {String} 标签文本。 }
* @property { v-model : {String} 语法糖，利用value接值父子组件相互传值 当前表单填写的内容 }
* @version 1.0.0
* @edit: quweina
*/
<template>
	<div style="display:inline-block;">
		<el-form-item label='申请项目'>
			<el-select v-model="ruleForm.productCode" placeholder="请选择" @change="productChange" clearable>
				<el-option v-for="item in productDate" :key="item.productCode" :label="item.productName" :value="item.productCode">
				</el-option>
			</el-select>
		</el-form-item>
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
					productCode: ''
				},
				vals: []
			}
		},
		created() {
			this.initDate();
		},
		methods: {
			productChange(item) { //申请项目函数
                console.log(this.ruleForm.productCode)
				this.$emit('input', {
					productCode:this.ruleForm.productCode
				})

            },
            initDate(){
                this.$axios({
					method: 'get',
					url: this.$apiUrl.acdappinit

				}).then(res => {
					console.log(res)
                    var data = res.data.list;
                    // this.productDate=[]
					if (data) {
						for (let i = 0; i < data.length; i++) {
							this.productDate.push(data[i])							
						}
					}

				})
            }

		}
	}

</script>
