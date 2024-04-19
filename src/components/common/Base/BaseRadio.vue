/*
* @property { rules :  {String Object} 表单验证 一种验证传对象 一种以上把对象组成数组 }
* @property { prop :  {String} input的name 传回的字段名与html中input标签name值一样。 }
* @property { placeholder :  {String} 提示语，与html中input标签placeholder值一样。 }
* @property { label :  {String} 标签文本。 }
* @property { v-model :  {String} 语法糖，利用value接值父子组件相互传值 当前表单填写的内容  }
* @property { radiodata:  {Array} el-radio中的数据 }
* @version 1.0.0
* @edit: quweina
*/
<template>
	<el-form-item :label="label" :prop="prop" :rules="rules">
		<el-radio-group v-model="myValue" >
			<el-radio :label="item.value" v-for="(item,index) in radiodata" :key='index'>{{item.label}}</el-radio>
		</el-radio-group>
	</el-form-item>
</template>
<script>
	export default {

		data() {
			return {
				myValue: ''

			}
		},
		props: {
			radiodata: {
				type: Array
			},
			prop: {
				type: String
			},
			placeholder: {
				type: String
			},
			label: {
				type: String
			},
			value: {
				type: String
			},
			rules: [Object, Array]
		},
		mounted() {
			this.myValue = this.value;
		},
		watch: {
			// 使用监听 初始化时避免验证不通过
			myValue(val) {
				this.$emit("input", val)
			}

		}
	}

</script>
