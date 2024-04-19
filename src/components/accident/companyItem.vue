/
* @property { data : {Array} option中的数据}
* @property { label : {String} 标签文本。 }
* @property { v-model : {String} 语法糖，利用value接值父子组件相互传值 当前表单填写的内容 }
* @version 1.0.0
* @edit: quweina
*/
<template>
	<div style="display:inline-block;">
		<el-form-item label='申请单位'>
			<el-select v-model="ruleForm.value" placeholder="请选择" @change="productChange" clearable>
				<el-option v-for="item in productDate" :key="item.code" :label="item.name" :value="item.code">
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
					value: ''
				},
				vals: []
			}
		},
		created() {
            this.productDate=this.data;
            console.log(this.productDate)
		},
		methods: {
			productChange(item) { //申请项目函数
                console.log(this.ruleForm.value)
				this.$emit('input', {
					value:this.ruleForm.value
				})

            }
		}
	}

</script>
