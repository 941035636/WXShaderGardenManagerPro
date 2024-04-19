<template>
	<div id="PremiumReversal">
		<div class="contents">
			<el-form ref="forms" :model="forms" label-width="150px" :rules="forms.rules">
				<el-form-item label="冲正字段：" prop="name">
					<el-table :data="forms.list" :header-cell-style="getRowClass" fit border style="width:70%;" @selection-change="handleSelectionChange" ref="multipleTable">
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="项目名称" show-overflow-tooltip prop="label"></el-table-column>
						<el-table-column label="原信息" show-overflow-tooltip prop="code"></el-table-column>
						<el-table-column label="冲正后">
							<template slot-scope="scope">
								<el-form-item>
									<el-input v-model="scope.row.newCode" placeholder="请输入" :disabled="scope.row.show">
										<span slot="append">元</span>
									</el-input>
								</el-form-item>
							</template>
						</el-table-column>
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
				</el-form-item>
				<el-form-item style="display:none;">
					<el-button type="primary" @click="submitForm1()"></el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import PremiumList from '../../../../static/data/PremiumList.json';
import RequiredCheck from '../js/requiredcheck';
export default {
	name:'PremiumReversal',
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
					name:[{ required: true, message: '请选择冲正字段', trigger: 'blur' }]
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
			this.forms.list = JSON.parse(JSON.stringify(PremiumList.data));
			this.forms.list.forEach(item =>{
				item.code = this.form.premium
			})
			this.$nextTick(()=>{
                this.getDatas();
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
		getDatas(){
            if(this.form.editList) {
                let list = JSON.parse(this.form.editList);
                list.forEach(item => {
                    this.forms.list.forEach(subItem => {
                        if(subItem.value == item.value) {
                            this.$refs.multipleTable.toggleRowSelection(subItem);
                            subItem.newCode = item.newCode;
                            subItem.show = false;
                        }
                    })
                })
                this.forms.name = list;
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
					item1.show = true;
				})
			}
			this.forms.name = val;
		},
		submitForm1(){
			let data = {};
			this.$refs['forms'].validate((valid) => {
				if (valid) {
					let result = {};
					let flag = true;
					if(this.form.orderType == '2') {
						flag = false;
					}
					result = this.RequiredCheck.getResult(this.forms,this.form,flag);
					if (result.value) {
						data = this.forms;
					}else{
						this.$message.error(result.lable);
						return false
					}
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
#PremiumReversal{
	.contents{
		width: 100%;
	}
}
</style>
