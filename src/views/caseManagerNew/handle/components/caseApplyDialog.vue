<template>
  <!-- 新增出险人员信息 -->
	<div class="caseApplyDialog" id="caseApplyDialog">
		 <el-dialog title="结案申请" :visible.sync="dialogVisible" width="600px" destroy-on-close :close-on-click-modal='false'>
            <el-form ref="form" :model="form" label-width="120px" :rules="rules">
				<el-form-item label="结案类型:">
                    <span class="color-blue">{{form.closeTypeName}}</span>
                     <span v-if="pushInsuranceFlag" @click="oneKeySetEndCaseTime" style="color:#FA8C16;cursor: pointer;text-decoration:underline;margin-left:20px">点击“获取保司结案信息”</span>
				</el-form-item>
				<el-form-item v-if="!caseInfo.inscompReportNo"  label="保司报案号:" :prop="this.form.closeType != '402'?'inscompReportNo':''">
				    <el-input size="mini" v-model.trim="form.inscompReportNo"></el-input>
                </el-form-item>
				<el-form-item  :label="getTimeName" prop="endCaseTime">
					<el-date-picker size="mini" v-model.trim="form.endCaseTime" :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
				</el-form-item>
				<el-form-item label="指定审核人员:" prop="closeAuditorCode">
					<el-select size="mini" v-model.trim="form.closeAuditorCode" placeholder="请选择审核人员"  @change="setInfoNames()">
						<el-option v-for="(item,index) in customerInfo" :key="index" 
						:label="item.branchNameAndName" :value="item.userCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="结案说明:" prop="settlementContent">
					<el-input type="textarea" v-model.trim="form.settlementContent"></el-input>
				</el-form-item>
			</el-form>
			<div class="btn mt20">
                <span class="btn-left" @click="close">取消</span>
                <span class="btn-right" @click="submitOver('form')">确认提交</span>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import CaseServiceNew from '@/service/CaseServiceNew'
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters({
            caseSettleType:'caseSettleType',
            caseInfo:'caseInfo',
            endCaseInfo:'endCaseInfo',
            pushInsuranceData:'pushInsuranceDataNew'
        }),
         pushInsuranceFlag(){
            return this.pushInsuranceData.isPushInsuranceFlag
            // return true
        },
        getTimeName(){
            let name;
            switch (this.form.closeType) {
                case '401':
                    name = '赔付时间:'
                    break;
                case '402':
                    name = '无效时间:'
                    break;
                case '403':
                    name = '销案时间:'
                    break;
                case '404':
                    name = '拒赔时间:'
                    break;
                case '405':
                    name = '零结时间:'
                    break;
                default:
                    name = '赔付时间:'
                    break;
            }
            return name
        },
    },
	data() {
         var validSe = (rlue, value, callback) => {
            if (value === '') {
                callback(new Error('请填写保险公司报案号!'))
            } else if (/^[a-zA-Z0-9]{4,50}$/.test(value) == false) {
                callback(new Error('请输入4-50位保险公司报案号!'))
            } else {
                callback()
            }
        }
		return {
            CaseServiceNew: new CaseServiceNew(),
            dealDateStartOptions:this.beginDate(),
            dialogVisible:false,
            form:{
                "closeAuditorCode": "",
                "closeAuditorName": "",
                "closeType": "",
                "endCaseTime": "",
                "platform": "sys_sequip_man",
                "reportNo": "",
                "inscompReportNo": "",
                "settlementContent": ""
            },
            rules:{
				closeType: [
					{required: true, message: '请选择结案类型', trigger: 'change'}
				],
				settlementContent: [
					{required: true, message: '请输入', trigger: 'change'}
				],
				endCaseTime: [
					{required: true, message: '请选择', trigger: 'change'}
				],
				closeAuditorCode: [
					{required: true, message: '请选择审核人员', trigger: 'change'}
				],
				auditOpinion: [
					{required: true, message: '请选择审核类型', trigger: 'change'}
				],
				inscompReportNo: [
					{   required: true,
                        validator: validSe,
                        trigger: "change" 
                    }
				],
			},
        }
	},
	created(){
        this.getCustomerByJt()
    },
	methods: {
        // 初始化数据
        openInit(val) {
            this.dialogVisible = true;
            let {name} = this.caseSettleType.find(item=>item.code == this.endCaseInfo.closeType) || {name:''}
            this.form.closeType = this.endCaseInfo.closeType
            this.form.closeTypeName = name
            console.log(name);
        },
        beginDate(){
            return {
                disabledDate(time){
                    return time.getTime() >  new Date()
                }
            }
		},
        close(){
            this.form = {
                "closeAuditorCode": "",
                "closeAuditorName": "",
                "closeType": "",
                "endCaseTime": "",
                "platform": "sys_sequip_man",
                "reportNo": "",
                "inscompReportNo":'',
                "settlementContent": ""
            }
            this.dialogVisible = false;
        },
        // 通过分支机构查询客户经理
		async getCustomerByJt(){
			this.customerInfo = [];
			let data = {
				branchCode: sessionStorage.getItem('authDataInfo'),
				roleCode: process.env.ROOT_CASE_CLOSED_CODE,
			}
			let res = await this.CaseServiceNew.getCustomerByJt(data);
			if(res.code == '0000'){
				res.list.forEach(item => {
					if(item.userCode != window.sessionStorage.getItem('userCode')) {
						this.customerInfo.push({...item,branchNameAndName:`${item.name}(${item.branchName})`})
					}
				})
			}
		},
        setInfoNames(){
            let {name} = this.customerInfo.find(item=>item.userCode === this.form.closeAuditorCode) || {name:''}
            this.form.closeAuditorName = name;
        },
        
        submitOver(name) {//结案申请提交结案申请提交
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.submitOverFun()
				} else {
					return false;
				}
			});	
		},
        async submitOverFun() {
			this.form.reportNo = this.caseInfo.reportNo;
			let res = await this.CaseServiceNew.endCaseApply(this.form);
			if(res.code == '0000') {
                // this.close()
                // this.$router.go(-1)
                this.$router.push({
                    path:'/case/handle/success'
                })
			}
		},
        // 一键获取保司信息
        oneKeySetEndCaseTime(){
            this.form.endCaseTime = this.pushInsuranceData.pushInsuranceDetails.casePayTime
        },
        
	},
}
</script>

<style lang="less">
#caseApplyDialog {
    .el-form-item {
        margin-bottom: 17px;
    }
    .btn{
        text-align: right;
        width: 100%;
        .btn-left{
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ccc;
            color: #000;
            background-color: #F5F5F5;
            border-radius: 20px;
            cursor: pointer;
            margin-right: 20px;
        }
        .btn-right{
            display: inline-block;
            padding: 5px 20px;
            color: #FFF;
            background-color: #FA8C16;
            border-radius: 20px;
            cursor: pointer;
        }
    }

}
</style>
