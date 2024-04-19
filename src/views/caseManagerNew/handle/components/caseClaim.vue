<template>
<!-- 索赔信息组件 -->
    <div id="caseBiaoDiDetails">
        <div class="title">
            <div class="title-l">
                <span></span>
                <span>
                    索赔信息
                </span>
            </div>
        </div>
        <div class="mt20">
            <el-form ref="form" :model="form" label-position="right" label-width="150px" :rules="rules">
                <el-form-item label="估损金额" prop="estimatedAmount">
                    <el-input class="w280" placeholder="请输入" v-model="form.estimatedAmount" clearable size="small"> </el-input>
                    <span v-if="pushInsuranceFlag" @click="setEstimatedAmount" style="color:#FA8C16;cursor: pointer;text-decoration:underline;margin-left:20px">点击“获取保司结案信息”</span>
                </el-form-item>
                <el-form-item label="索赔金额" prop="claimAmount">
                    <el-input class="w280" placeholder="请输入" v-model="form.claimAmount" clearable size="small"></el-input>
                </el-form-item>
                <div class="display-flex">
                    <el-form-item label="材料准备齐全时间" prop="clientOfferFullMaterialsTime">
                        <el-date-picker class="w280" v-model="form.clientOfferFullMaterialsTime"  value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择日期时间" size="small" />
                    </el-form-item>
                    <el-form-item label="提交保险公司时间" prop="materialsSendInsuranceCompanyTime" class="ml20">
                        <el-date-picker class="w280" v-model="form.materialsSendInsuranceCompanyTime" value-format="yyyy-MM-dd HH:mm:ss"  type="datetime"  placeholder="选择日期时间" size="small"/>
                    </el-form-item>
                 </div>
                 <el-form-item label="快递单图片" prop="expressFileId">
                    <el-upload 
                        :disabled="isCasePause"
                        class="upload-demo"
                        action="#" 
                        :file-list="fileList"
                        :http-request="uploadUrl"
                        :limit="9"
                        multiple
                        :on-exceed="handleExceed"
                        :on-remove="handleRemove"
                        :before-upload="beforeUpload"
                        accept=".jpg , .jpeg, .png , .JPG , .JPEG , .PNG ">
                        <el-button size="small"  icon="el-icon-upload2" class="mr20">选择附件</el-button>
                        <span slot="tip" class="el-upload__tip files-tip">支持扩展名：jpg、jpeg、png</span>
                        <span slot="tip" class="tool-tip"><i class="el-icon-info"></i> 1、快递（上传快递单照片）2、上门（上传送件人和文件合影）3、电子邮件（上传电子邮件截图）</span>
                    </el-upload>
                   
                </el-form-item>
			</el-form>
        </div>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import moment from 'moment'
import ResourcesService from '@/service/ResourcesService';
export default {
    data() {
        var checkAmount = (rule, value, callback) => {
          let Reg = /^\d+(\.\d{0,2})?$/;
          if (!value) {
            return callback(new Error("请输入"));
          } else if (!Reg.test(value)) {
            callback(new Error("金额为最多保留两位小数的数字"));
          } else if (value<0 || value>=100000000) {
            callback(new Error(`金额值范围0-99999999.99  小数保留两位`));
          } else {
            callback();
          }
        };
		return {
            ResourcesService: new ResourcesService(),
            form:{
                clientOfferFullMaterialsTime:'',
                materialsSendInsuranceCompanyTime:'',
                claimAmount:'',
                estimatedAmount:'',
                expressFileId:'',
            },
            rules:{
				claimAmount:[{ required: true, validator: checkAmount, trigger: 'blur'}],
				estimatedAmount:[
                    { required: true, validator: checkAmount, trigger: 'blur'},
                ],
				materialsSendInsuranceCompanyTime:[{ required: true, message: '请选择', trigger: 'change'}],
				clientOfferFullMaterialsTime:[{ required: true, message: '请选择', trigger: 'change'}],
				expressFileId:[{ required: true, message: '请上传文件', trigger: 'change'}],
			},
            fileList:[]
		}
    },
    computed:{
        ...mapGetters({
            claimInfo:'claimInfo',
            caseInfo:'caseInfo',
            fileListVuex:'fileList',
            isCasePause:'isCasePause',
            pushInsuranceData:'pushInsuranceDataNew'
        }),
        pushInsuranceFlag(){
            return this.pushInsuranceData.isPushInsuranceFlag
            // return true
        },
    },
    watch:{
        claimInfo: {
            // 每个属性值发生变化就会调用这个函数
            handler(newVal, oldVal) {
                if(newVal && newVal.claimAmount) {
                    this.setForm()
                }
            },
            // 立即处理 进入页面就触发
            immediate: true,
            // 深度监听 属性的变化
            deep: true
        },
        fileListVuex:{
            // 每个属性值发生变化就会调用这个函数
            handler(newVal, oldVal) {
                if(newVal.length !==0) {
                    this.getFile()
                }
            },
            // 立即处理 进入页面就触发
            immediate: true,
            // 深度监听 属性的变化
            deep: true
        },
    },
    props:{
       
    },
    created() {
    },
    methods: {
        ...mapActions(['fileListInfoUpload','deleteFileInfo']),
        setForm(){
            for(let key in this.form) {
                this.form[key] = this.claimInfo[key]
            }
        },
        getFile(){
            this.fileList = []
            this.fileList = this.fileListVuex.filter(item=>{
                if(item.fileType === '快递单图片'){
                    item.name = item.fileName
                    return item
                }
            })
            if(this.fileList.length === 0){
                this.form.expressFileId = ''
            } else {
                this.form.expressFileId = this.fileList[0].fileId
            }
        },
        async uploadUrl(file) {
            let files = [];
            files.push(file.file);
            let res = await this.ResourcesService.uploadFile('abts-case-svc','sequipCaseFile','0', files);
            if (res.code == "0000") {
                this.form.expressFileId = res.list[0].fileId;
                res.list[0].name = res.list[0].fileName;
                this.fileList.push(res.list[0]);
                this.onSubmitFileSave(res.list)
            }
        },
        async onSubmitFileSave(fileList){
            let list = fileList.map(item=>{
                let obj = {
                    "fileId": item.fileId,
                    "fileName": item.fileName,
                    "fileSecType": "", // 件子类型，索赔对应出险通知书， ,
                    "fileThirdType": "", // 三级
                    "fileType": "快递单图片",
                    "reportNo": this.caseInfo.reportNo,
                    "uploadTime": moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }
                return obj
            })
            let code = await this.fileListInfoUpload(list)
            
        },
        //超出文件上传上限的提示
        handleExceed() {
            this.$confirm("只能上传一个文件，如需更换，点击删除后重新上传", "提示", { confirmButtonText: "确定" });
        },
        //删除上传的文件钩子函数
        handleRemove(row) {
            // let list = this.fileList.filter(item=>item.fileId !== row.fileId)
            // if(list.length == '0'){
            //     this.form.expressFileId = ''
            // }
            // this.fileList = [...list]
            this.deleteFileInfo(row.id)
        },
        beforeUpload(file) {
            if (file.size / 1024 / 1024 > 10) {
                this.$message({
                message: "上传文件大小不能超过 10MB!",
                type: "error",
                });
                return false;
            }
        },
        // 提交form方法
        submit(){
            let form = ''
            this.$refs.form.validate(valid => {
                if(valid) {
                    form = {...this.form}
                }
            })
            return form
        },
        // 复制估损金额
        setEstimatedAmount(){
            this.form.estimatedAmount = this.pushInsuranceData.pushInsuranceDetails.estimatedLossAmount
        },
    }
}
</script>
<style lang="less" scoped>
    #caseBiaoDiDetails {
        background-color:#fff;
        margin-top: 10px;
        padding: 10px 20px 10px;
        .title {
            display: flex;
            height: 50px;
            width: 100%;
            margin: 0 auto;
            align-items: center;
            font-size: 12px;
            border-bottom: 1px solid #e9e9e9;
            .title-l {
                display: flex;
                align-items: center;
                width: calc(100% - 200px);
            }
            .title-r {
                width: 200px;
                text-align: right;
            }
            .title-l > span:nth-child(1) {
                display: inline-block;
                width: 5px;
                height: 16px;
                background-color: #096DD9;
            }
            .title-l > span:nth-child(2) {
                margin-left: 10px;
                font-size: 16px;
                color: #096DD9;

            }
        }
        .upload-demo {
            display: inline-block;
        }
        .tool-tip {
            color:#e99d43;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            width: 650px;
            background-color:#feffe6;
            display:inline-block;
            margin-left: 30px;
            .el-icon-info {
                font-size: 18px;
                margin-right: 6px;
            }
        }


        
    }

</style>