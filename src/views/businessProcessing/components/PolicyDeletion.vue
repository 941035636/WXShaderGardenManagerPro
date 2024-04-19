<template>
	<div id="PolicyDeletion">
		<div class="contents">
			<el-form ref="forms" :model="forms" label-width="150px" :rules="forms.rules">
				<el-form-item label="冲正字段：" prop="name">
					<el-table :data="forms.list" :header-cell-style="getRowClass" fit border style="width:70%;" @selection-change="handleSelectionChange" :ref="form.name">
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="项目名称" show-overflow-tooltip prop="label"></el-table-column>
						<el-table-column label="原信息" show-overflow-tooltip prop="code"></el-table-column>
						<el-table-column  label="冲正后" show-overflow-tooltip prop="newCode"></el-table-column>
						<el-table-column label="原因">
							<template slot-scope="scope">
								<el-form-item>
									<el-select v-model="scope.row.reason" placeholder="请选择" :disabled="scope.row.show">
										<el-option v-for="item in reasonData" :key="item.code" :label="item.value" :value="item.code">
										</el-option>
									</el-select>
								</el-form-item>
							</template>
						</el-table-column>
					</el-table>
					<p style="color:#E81D1D;">注：选择保单删除，冲正审核后将删除该保单相关的所有信息。</p>
				</el-form-item>
				<el-form-item style="display:none;">
					<el-button type="primary" @click="submitForm1()"></el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import PolicyList from '../../../../static/data/PolicyList.json';
import RequiredCheck from '../js/requiredcheck';
export default {
	name:'PolicyDeletion',
	props:{
		'form':Object,
		'reasonData':Array
	},
	data() {
		return {
			RequiredCheck:new RequiredCheck(),
			forms:{
				name:[],
				list:[],
				rules:{
					name:[{ required: true, message: '请选择冲正字段', trigger: 'change' }]
				}
			}
		};
	},
	computed: {
		
	},
	created() {
		this.getData();
	},
	methods: {
		getData(){
			this.forms.list = JSON.parse(JSON.stringify(PolicyList.data));
			this.forms.list.forEach(item =>{
				item.code = this.form.premium
				item.newCode = 0
			})
			if(this.form.editList) {
				let list = JSON.parse(this.form.editList);
				list.forEach(item => {
					if(this.forms.list.find(subItem => subItem.value == item.value)) {
						this.forms.list.find(subItem => subItem.value == item.value).newCode = item.newCode
						this.forms.list.find(subItem => subItem.value == item.value).show = false
						item.reason = ''
					}
				})
				this.forms.name = list;
			}
		},
		getRowClass({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#333333;background-color: #FAFAFA;"
			}
		},
		handleSelectionChange(val) {
			if(val.length){
				this.forms.list.forEach(item1 =>{
					item1.show = true;
					val.forEach(item =>{
						if(item.value == item1.value){
							item1.show = false;
						}
					})
				})
			}else{
				this.forms.list.forEach(item1 =>{
					item1.reason = '';
					item1.show = true;
				})
			}
			this.forms.name = val;
		},
		submitForm1(){
			let data = {};
			this.$refs['forms'].validate((valid) => {
				if (valid) {
					let result = this.RequiredCheck.getResult(this.forms,this.form,false);
					if (result.value) {
						data = this.forms;
					}else{
						this.$message.error(result.lable);
						return false
					}
					// data = this.forms;
				} else {
					return false;
				}
			});
			return data;
		}
	}
};
</script>

<style lang="less">
#PolicyDeletion{
	.contents{
		width: 100%;
	}
}
</style>
