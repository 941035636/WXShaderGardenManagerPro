/
* @property { v-model :  {String} 语法糖，利用value接值父子组件相互传值 当前地区插件选择的地区值  }
* @property { handleChange:  {Function} 选中时触发的事件 }
* @property { myareaOPtion:  {Function} 地区code }
* @property { myCodeToText:  {Function} 地区汉字 }
* @version 1.0.0
* @edit: quweina
*/
<template>
	<div class="area">
		<el-cascader placeholder="请选择服务地点" size="large" :options="options" v-model="myareaOPtion" @change="handleChange"
		 clearable>
		</el-cascader>
	</div>
</template>
<script>
	import {
		provinceAndCityData,
		regionData,
		provinceAndCityDataPlus,
		regionDataPlus,
		CodeToText,
		TextToCode
	} from 'element-china-area-data'
	export default {
		data() {
			return {
				options: regionData,
                myareaOPtion: [],//地区code
                myCodeToText: []//地区汉字
			}
        },
        props:['value'],
        mounted() {
			this.myareaOPtion=this.areaOPtion
        },
		methods: {
			handleChange(val) { //地区组件
				console.log(this.myareaOPtion)
				this.myCodeToText = [];
				for (let i = 0; i < this.myareaOPtion.length; i++) {
					this.myCodeToText.push(CodeToText[this.myareaOPtion[i]])
                }
                this.$emit('input',{
                    myareaOPtion:this.myareaOPtion,
                    myCodeToText:this.myCodeToText
                }) 
			}
		}
	}

</script>
