<template>
  <!-- 新增出险人员信息 -->
	<div class="caseExamine" id="caseExamine">
        <el-dialog title="结案审核" :visible.sync="dialogVisible" width="30%" :before-close="handleCloseOver" append-to-body>
			<el-form ref="formOver" :model="formOver" label-width="100px" :rules="rules" size="small">
				<el-form-item label="审核类型:" prop="pass">
					<el-select v-model="formOver.pass" placeholder="请选择">
						<el-option label="通过" :value="true"></el-option>
						<el-option label="驳回" :value="false"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核说明:" prop="denyReason">
					<el-input type="textarea" v-model="formOver.denyReason"></el-input>
				</el-form-item>
			</el-form>
            <div class="btn-box mt20">
                <span class="btn-left" @click="close">取消</span>
                <span class="btn-right" @click="submit('formOver')">确认提交</span>
            </div>
		</el-dialog>
        
	</div>
</template>

<script>
import CaseServiceNew from '@/service/CaseServiceNew'
import Claim from '@/service/claim'
import { mapGetters,mapActions } from 'vuex';
export default {
    computed: {
        ...mapGetters({
            caseSettleType:'caseSettleType',
            caseInfo:'caseInfo',
            endCaseInfo:'endCaseInfo',
            pushInsuranceData:'pushInsuranceDataNew'
        }),
    },
	data() {
		return {
            CaseServiceNew: new CaseServiceNew(),
            claim: new Claim(),
            dialogVisible:false,
            formOver:{
				pass: "",
				reportNo: "",
				denyReason: "",
                closeType:'',
			},
            rules:{
				denyReason: [
					{required: true, message: '请输入', trigger: 'change'},
                    { message: '1-100位含',min:1 ,max: 100,  trigger: 'blur' }
				],
				pass: [
					{required: true, message: '请选择审核类型', trigger: 'change'}
				],
            }
        }
	},
	created(){
    },
	methods: {
        ...mapActions(['getCaseInfo']),
        openInit(){
            this.dialogVisible = true;
        },
        handleCloseOver() {
			this.$refs['formOver'].resetFields();
			this.dialogVisible = false;
		},
        close(){
          this.formOver = {
				pass: "",
				reportNo: "",
				denyReason: "",
                closeType:'',
			}
            this.dialogVisible = false
        },
        submit(){
            this.$refs.formOver.validate((valid) => {
				if (valid) {
					this.submitOverFun()
				} else {
					return false;
				}
			});
        },
        async submitOverFun(){
            this.formOver.reportNo = this.caseInfo.reportNo
            this.formOver.closeType = this.endCaseInfo.closeType
            let {code,data} = await this.CaseServiceNew.examCase(this.formOver)
            if(code === '0000') {
                this.$message.success('成功')
                this.getCaseInfo(this.caseInfo.reportNo)
                this.$emit('successCb')
                this.close()
                if(this.pushInsuranceData && this.pushInsuranceData.isPushInsuranceFlag) {
                    this.updateBsJtCaseStatus()
                    this.updateCaseStatus()
                }
            }
        },
        // 修改案件关联表引用状态
        async updateBsJtCaseStatus(){
            let data = {
                id:this.pushInsuranceData.pushInsuranceDetails.baosiJiangtaiAssociationId,
                referenceStatus:'2', // 引用类型（1.已认领、2.已认领引用结案、3.已关联引用结案、4.引用结案）
            }
            await this.claim.updateBsJtCaseStatus(data)
        },
		// 修改对接案件引用状态
        async updateCaseStatus(){
            let data = {
                id:this.pushInsuranceData.pushInsuranceDetails.id,
                referenceOperator:window.sessionStorage.getItem('userCode'),
                referenceOperatorName:window.sessionStorage.getItem('userName'),
                referenceStatus:'4',// 引用状态：1.未认领、2.引用结案、3.已认领、4.已认领引用结案、5.已关联、6.已关联引用结案
            }
            await this.claim.updateCaseStatus(data)
        },
        
	},
}
</script>

<style lang="less" scope>
#caseExamine {
    .el-form-item {
        margin-bottom: 10px;
    }
}
.btn-box{
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
</style>
