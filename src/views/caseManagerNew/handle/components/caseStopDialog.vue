<template>
<!-- 案件中止组件 -->
    <div id="caseStopDialog">
        <el-dialog title="案件中止" :visible.sync="dialogVisible" width="600px" :before-close="handleStopClose" :close-on-click-modal='false'>
			<el-form ref="formStop" :model="formStop" label-width="100px" :rules="rules">
				<el-form-item label="中止类型:" prop="type">
					<el-radio-group v-model="formStop.pauseType">
						<el-radio v-for="(item,index) in caseStopList" :label="item" :key="index">{{item}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="中止时间:" prop="pauseTime">
					<el-date-picker size="mini" type="datetime" v-model="formStop.pauseTime"  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" />
				</el-form-item>
				
				<el-form-item label="原因说明:" prop="pauseReason">
					<el-input size="mini" type="textarea" :rows="3" v-model="formStop.pauseReason" placeholder="请输入原因说明"></el-input>
				</el-form-item>
			</el-form>
			<div class="btn mt20">
                <span class="btn-left" @click="dialogVisible = false">取消</span>
                <span class="btn-right" @click="submitStop('formStop')">确认提交</span>
            </div>
		</el-dialog>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    data() {
		return {
            dialogVisible:false,
            caseStopList:['治疗中','伤残鉴定中','诉讼中','其他'],
            formStop: {
				pauseReason:'',
				pauseTime: '',
				pauseTimeEnd: '',
				pauseType: '',
				reportNo:'',
			},
            rules:{
				pauseType: [
					{required: true, message: '请选择中止类型', trigger: 'change' }
				],
				pauseTime: [
					{required: true, message: '请选择时间', trigger: 'change' }
				],
				pauseReason: [
					{required: true, message: '请输入原因说明', trigger: 'blur' }
				],
			},
		}
    },
    computed:{
		...mapGetters({
			caseInfo:'caseInfo'
		})
    },
    props:{
       
    },
    created() {
    },
    methods: {
		...mapActions(['pauseCase']),
		openInit(){
			this.dialogVisible = true
		},
        submitStop(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.stopCaseFun();
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		async stopCaseFun(){
			let code = await this.pauseCase(this.formStop)
			if(code==='0000') {
				this.dialogVisible = false
			}
		},
        handleStopClose() {
			this.$refs['formStop'].resetFields();
			this.dialogVisible = false;
		},
    }
}
</script>
<style lang="less" scoped>
    #caseStopDialog {
        background-color:#fffaea;
        margin-top: 10px;
        .btn{
			text-align: right;
			width: 100%;
			margin-top: 20px;
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