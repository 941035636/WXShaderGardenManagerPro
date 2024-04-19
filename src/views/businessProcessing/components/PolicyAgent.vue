<template>
	<div id="PolicyAgent">
		<div class="contents">
			<el-form ref="forms" :model="forms" label-width="150px" :rules="forms.rules">
				<el-form-item label="冲正字段：" prop="name">
					<el-table :data="forms.list" :header-cell-style="getRowClass" fit border style="width:70%;" @selection-change="handleSelectionChange" ref="multipleTable">
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="项目名称" show-overflow-tooltip prop="label"></el-table-column>
						<el-table-column label="原信息" show-overflow-tooltip prop="code"></el-table-column>
						<el-table-column  label="冲正后" show-overflow-tooltip  width="500">
							<template slot-scope="scope">
								<el-form-item style="width:450px">
									<span>是否全面营销：</span>
									<el-switch v-model="isQM" active-text="是" inactive-text="否" :disabled="scope.row.show" @change="scope.row.newCode = ''"></el-switch>
									<el-select v-model="scope.row.newCode" placeholder="请选择" :disabled="!isQM" class="ml10" @change="getAgentInfo(scope.row)" clearable filterable>
										<el-option v-for="item in agents" :key="item.employeeNum" :label="item.showName" :value="item.employeeNum">
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
import PolicyList from '../../../../static/data/PolicyListAgent.json';
import RequiredCheck from '../js/requiredcheck';
import UserService from '../../../service/UserService'
export default {
	name:'PolicyAgent',
	props:{
		'form':Object,
		'policyData':Object,
	},
	data() {
		return {
			RequiredCheck:new RequiredCheck(),
			UserService: new UserService(),
			forms:{
				name:[],
				list:[],
				rules:{
					name:[{ required: true, message: '请选择冲正字段', trigger: 'change' }]
				}
			},
			agents:[],
			isQM:false
		};
	},
	computed: {
		
	},
	created() {
		this.getData();
		this.getAgentList();
	},
	methods: {
		getData(){
			this.forms.list = JSON.parse(JSON.stringify(PolicyList.data));
			this.forms.list.forEach(item =>{
				item.code = this.form.agent
				item.newCode = ''
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
						item.reason = '28'
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
							if(item.newCode) {
								this.isQM = true;
							} else {
								this.isQM = false;
							}
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
					let code = this.policyData ? this.policyData.tApplicationForm ? this.policyData.tApplicationForm.schanelCode : '' : '' ;
					let result = this.RequiredCheck.getResult(this.forms,this.form,false,this.isQM,code);
					if (result.value) {
						if(this.isQM) {
							this.forms.name.find(item =>(item.value == '08')).newName = this.agents.find(i => i.employeeNum == this.forms.name.find(item =>(item.value == '08')).newCode) ? this.agents.find(i => i.employeeNum == this.forms.name.find(item =>(item.value == '08')).newCode).showName : '无';
							data = this.forms;
						} else {
							this.forms.name.find(item =>(item.value == '08')).newName = '无';
							data = this.forms;
						}
						
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
		},
		//查询全面营销人员列表
		async getAgentList() {
			let obj = {
				jtBranchCode: '',
				hrPersonCategory: '08',
				pageSize:10000,
				pageNum:1
			}
            let res = await this.UserService.getUserByNo(obj);
			if(res.code == '0000' && res.total != 0) {
				res.list.forEach(item => {
					item.showName = item.userName + '(' + item.employeeNum + ')';
				})
				this.agents = res.list;
			} else {
				this.agents = [];
			}
		},
		getAgentInfo(row) {
			let agent = this.agents.find(item => item.employeeNum == row.newCode);
			row.newName = agent ? agent.userName + '(' + agent.employeeNum + ')' : '';
		}
	}
};
</script>

<style lang="less">
#PolicyAgent{
	.contents{
		width: 100%;
	}
	.ml10 {
		margin-left: 10px;
	}
}
</style>
