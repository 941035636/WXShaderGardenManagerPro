/*
* @property { tolnum : {Number} 总条数 }
* @property { handleSizeChange : {Function} 切换每页多少条函数 }
* @property { handleCurrentChange : {Function} 分页切换函数 }
* @property { currentPage : {Number} 当前页 }
* @version 1.0.0
* @edit: quweina
*/
<template>
	<div class="pagination">

		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
		 :page-sizes="[10, 20, 30, 40]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="mytolnum">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		props: {
			tolnum: Number,
			currentPage:Number
		},
		data() {
			return {
				form: {
					pn: 1,
					ps: 10
				},
				mytolnum: 0,
				currentPage4: 0
			}
		},
		watch: { //初始化时需要监听
			tolnum: function (newValue, oldValue) {
				console.log(newValue, oldValue)
				this.mytolnum = newValue;
				return this.mytolnum;
			},
			currentPage:function(newValue, oldValue){
				this.currentPage4=newValue;
			}
		},
		mounted() {
			console.log(this.tolnum)
			this.mytolnum = this.tolnum;
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.form.ps = val;
				this.$emit('handleSizeChange', this.form.ps)
				
			},
			handleCurrentChange(val) {
				console.log(val)
				this.form.pn = val;
				this.$emit('handleCurrentChange', this.form.pn)
				
			}

		}
	}

	

</script>
