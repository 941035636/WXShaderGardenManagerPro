<template>
  <!-- 新增出险人员信息 -->
	<div class="caseAddThreePerson" id="caseAddThreePerson">
		 <el-dialog title="添加人员" :visible.sync="dialogVisible" width="600px" :before-close="close" destroy-on-close :close-on-click-modal='false'>
            <el-form :model="form" ref="form" label-width="130px" :rules="rules">
                <el-form-item label="人员类型"  prop="riskPersonType">
                    <el-select v-model="form.riskPersonType" size="mini" class="w280">
                        <el-option v-for="item in riskPersonType" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="riskPersonName" >
                    <el-input v-model="form.riskPersonName" size="mini" class="w280"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="identityCardNumber" >
                    <el-input v-model="form.identityCardNumber" size="mini" class="w280"></el-input>
                </el-form-item>
                <el-form-item v-if="dangerOrClose == 'close'" label="手机号" prop="riskPersonPhone">
                    <el-input v-model="form.riskPersonPhone" size="mini" class="w280"></el-input>
                </el-form-item>
                 <el-form-item v-if="dangerOrClose == 'close'" label="伤亡情况" prop="casualties">
                    <el-radio-group v-model="form.casualties">
                        <el-radio label="一般人伤"></el-radio>
                        <el-radio label="伤残"></el-radio>
                        <el-radio label="死亡"></el-radio>
                        <el-radio label="滞留"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="btn">
                <span class="btn-left" @click="close">取消</span>
                <span class="btn-right" @click="onSubmit('form')">确认提交</span>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import  { mapMutations,mapGetters,mapActions } from 'vuex';
import util from '@/util/stringHelper'
export default {
	data() {
        var isCardtValid = (rule, value, callback) =>{
            if (value === '') {
                callback(new Error('请输入身份证'))
            } else if (!util.isCardtValid(value)) {
                callback(new Error('请输入正确的身份证号码'));
            } else {
                callback();
            }
        };
        var checkPhone = (rule, value, callback) =>{
            var patrn1 = /^(1[3-9]\d{9}$)/;
            if (value === '') {
                callback(new Error('请输入手机号'))
            } else if (value && !patrn1.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        };
		return {
           dialogVisible:false,
           form:{
               userId:'',
               riskPersonName:'',
               riskPersonType:'',
               riskPersonPhone:'',
               identityCardNumber:'',
               casualties:"",// 伤亡情况
           },
           rules: {
                riskPersonType: [
                    { required: true, message: "请选择", trigger: "change" }
                ],
                riskPersonName: [
                    { required: true, message: "请填写姓名", trigger: "blur" },
                    { message: '姓名（1-50位）',min:1 ,max: 30,  trigger: 'blur' }
                ],
                identityCardNumber: [
                    { required: true, validator: isCardtValid, trigger: "blur" }
                ],
                riskPersonPhone: [
                    { required: true, validator: checkPhone, trigger: "blur" }
                ],
                casualties: [
                    { required: true, message: "请选择", trigger: "change" }
                ],
                
            },
        }
	},
    computed:{
        ...mapGetters({
            riskPersonType:'riskPersonType',
            injuredList:'injuredList',
        })
    },
    props:{
        dangerOrClose:{
            type:String,
        },
    },
	created(){},
	methods: {
        ...mapActions(['saveInsuredInfo']),
        // 初始化数据
        openInit(val) {
            this.dialogVisible = true;
            if(val){
                this.form = {...val}
            }
        },
        // 取消
        close(){
            this.form = {
               userId:'',
               riskPersonName:'',
               riskPersonType:'',
               riskPersonPhone:'',
               identityCardNumber:'',
               casualties:"",// 伤亡情况
            }
            this.$refs.form.resetFields()
            this.dialogVisible = false

        },
        // 确认关联
        onSubmit(name){
             this.$refs[name].validate((valid) => {
				if (valid) {
					this.submitOverFun()
				} else {
					return false;
				}
			});
        },
        async submitOverFun(){
            let addList = this.injuredList.filter(item=>item.identityCardNumber === this.form.identityCardNumber && !this.form.userId)
            let updataList = this.injuredList.filter(item=>item.identityCardNumber === this.form.identityCardNumber && this.form.userId && this.form.userId != item.userId)
            if(addList.length == 0 && updataList.length == 0){
                let code = await this.saveInsuredInfo(this.form)
                if(code === '0000') {
                    this.close()
                }
            } else {
                this.$message.error('人员证件号重复')
            }
            
        },
	},
}
</script>

<style lang="less">
#caseAddThreePerson {
    .el-form-item {
        margin-bottom: 10px;
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
