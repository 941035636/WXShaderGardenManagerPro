<template>
	<div id="GeneralCorrections">
		<div class="contents">
			<el-form ref="forms" :model="forms" label-width="150px" :rules="forms.rules">
				<el-form-item label="冲正字段：" prop="name">
					<el-table :data="forms.list" :header-cell-style="getRowClass" fit border style="width:70%;" @selection-change="handleSelectionChange" ref="multipleTable">
						<el-table-column type="selection"></el-table-column>
						<el-table-column label="项目名称" show-overflow-tooltip prop="label"></el-table-column>
						<el-table-column label="原信息" show-overflow-tooltip prop="code">
							<!-- <template slot-scope="scope">
								<span>{{scope.row.code}}</span><span v-if="scope.row.value == '01' && form.kuaQiFlag" class="col-red ml5">( 跨期业务 )</span>
							</template> -->
						</el-table-column>
						<el-table-column label="冲正后">
							<template slot-scope="scope">
								<el-form-item v-if="scope.row.value == '00'">
									<el-input v-model.trim="scope.row.newCode" placeholder="请输入批单号" :disabled="scope.row.show"></el-input>
								</el-form-item>
								<el-form-item v-if="scope.row.value == '01'">
									<el-date-picker type="date" :picker-options="dealDateStartOptions" placeholder="选择日期" v-model="scope.row.newCode" style="width: 100%;" :disabled="scope.row.show" @change="checkDate" value-format="yyyy-MM-dd"></el-date-picker>
								</el-form-item>
								<el-form-item v-if="scope.row.value == '02'">
									<el-date-picker type="date" placeholder="选择日期" v-model="scope.row.newCode" style="width: 100%;" :disabled="scope.row.show" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
								</el-form-item>
								<el-form-item v-if="scope.row.value == '03'">
									<el-date-picker type="date" placeholder="选择日期" v-model="scope.row.newCode" style="width: 100%;" :disabled="scope.row.show" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
								</el-form-item>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-form-item style="display:none;">
					<el-button type="primary" @click="submitForm1()"></el-button>
				</el-form-item>
			</el-form>
			<Reason :multiData="form" :crossForm="form" :typeName="'CZ'" ref="Reason"></Reason>
		</div>
	</div>
</template>

<script>
import endorsementList from '../../../../static/data/endorsementList.json';
import RequiredCheck from '../js/requiredcheck';
import Reason from './Reason'
export default {
	name:'GeneralCorrections',
	props:{
		'form':Object
	},
	components:{
		Reason
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
			},
			dealDateStartOptions:this.setDate(),
		};
	},
	computed: {
		
	},
	created() {
		this.getData();
	},
	methods: {
		getData(){
			this.forms.list = JSON.parse(JSON.stringify(endorsementList.data));
			this.forms.list.forEach(item =>{
				if(item.value == '00'){
					item.code = this.form.correctNo
				}else if(item.value == '01'){
					item.code = this.form.signTime
				}else if(item.value == '02'){
					item.code = this.form.startTime
				}else if(item.value == '03'){
					item.code = this.form.endTime
				}
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
					}
				})
				this.forms.name = list;
			}
		},
		getDatas(){
            if(this.form.editList) {
                let list = JSON.parse(this.form.editList);
                list.forEach(item => {
					if(item.value == '01') {
						this.$refs.Reason.checkDate(item.newCode)
					}
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
				val.find(subItem => subItem.value == '01') ?  '' : this.$refs.Reason.checkDate('')
				this.forms.list.forEach(item1 =>{
					item1.show = true;
					val.forEach(item =>{
						if(item.value == item1.value){
							item1.show = false;
						}
					})
				})
			}else{
				this.$refs.Reason.checkDate('')
				this.forms.list.forEach(item1 =>{
					item1.show = true;
					item1.newCode = '';
				})
			}
			let list = this.$stringHelper.getArrDifference(this.forms.name,val);
			this.forms.list.forEach(item1 =>{
				list.forEach(item =>{
					if(item.value == item1.value){
						item1.newCode = '';
					}
				})
			})
			val.forEach(item =>{
				if(item.value == '02') {
					this.forms.list.find(subItem => subItem.value == '02').newCode = this.forms.list.find(subItem => subItem.value == '02').newCode ? this.forms.list.find(subItem => subItem.value == '02').newCode : item.code
				}
				if(item.value == '03') {
					this.forms.list.find(subItem => subItem.value == '03').newCode = this.forms.list.find(subItem => subItem.value == '03').newCode ? this.forms.list.find(subItem => subItem.value == '03').newCode : item.code
				}
			})
			this.forms.name = val;
		},
		submitForm1(){
			let data = {};
			this.$refs['forms'].validate((valid) => {
				if (valid) {
					let result = {};
					result = this.RequiredCheck.getResult(this.forms,this.form);
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
		},
		checkDate(val) {
			this.form.validDate = val;
		},
		setDate(){
            return {
                disabledDate(time){
                    let startDate =  new Date();
                    return time.getTime() >  new Date(startDate)
                }
            }
        },
	},
	
};
</script>

<style lang="less">
#GeneralCorrections{
	.contents{
		width: 100%;
		
	}
	.col-red {
		color: #ff8b88;
	}
	.ml5 {
		margin-left: 5px;
	}
}
</style>
