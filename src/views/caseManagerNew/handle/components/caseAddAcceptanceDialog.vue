<template>
  <!-- 新增案件受理信息 -->
	<div class="caseAddAcceptance" id="caseAddAcceptance">
		 <el-dialog title="添加受理记录" :visible.sync="dialogVisible" width="800px" destroy-on-close :close-on-click-modal='false'>
            <el-row class="con-row border-bt">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l color-gray-0">分支机构：</span>
                    <span class="col-span-r col-black">{{caseInfo.serverBranch}}</span>
                </el-col>
                <el-col :span="16" class="con-col">
                    <span class="col-span-l color-gray-0">案件处理人员：</span>
                    <span class="col-span-r col-black">{{caseInfo.serverName}}</span>
                </el-col>
            </el-row>
            <el-row class="con-row border-bt">
                <el-col :span="12" class="con-col">
                    <span class="col-span-l">企业名称：</span>
                    <el-tooltip effect="dark" :content="policyInfoVo.holderName" placement="top">
                        <span class="col-span-r col-black">{{policyInfoVo.holderName}}</span>
                    </el-tooltip>
                </el-col>
                <el-col :span="12" class="con-col">
                    <span class="col-span-l">
                        <span class="color-red">*</span>
                        企业地址：
                    </span>
                    <!-- <el-tooltip effect="dark" :content="getAreaDetails" placement="top">
                        <span class="col-span-r col-black">{{getAreaDetails}}</span>
                    </el-tooltip> -->
                    <el-cascader class="col-span-r" size="medium" :options="area" placeholder="请选择企业地址" change-on-select v-model="form.location" clearable></el-cascader>
                </el-col>
            </el-row>
            <el-row class="con-row mt20">
                <el-col :span="12" class="con-col">
                    <span class="col-span-l">
                        <span class="color-red">*</span>
                        联系人：
                    </span>
                    <el-input class="col-span-r" v-model="form.visitName" placeholder="请输入联系人"></el-input>
                </el-col>
                <el-col :span="12" class="con-col">
                    
                    <span class="col-span-l">
                         <span class="color-red">&nbsp;</span>
                        联系电话：
                    </span>
                    <el-input class="col-span-r" v-model="form.visitPhone" placeholder="请输入联系电话"></el-input>
                </el-col>
            </el-row>
            <el-row class="con-row mt10">
                <el-col :span="12" class="con-col">
                    <span class="col-span-l">&nbsp;&nbsp;&nbsp;职&nbsp;&nbsp;&nbsp;务：</span>
                    <el-input class="col-span-r" v-model="form.visitPost" placeholder="请输入职务"></el-input>
                </el-col>
            </el-row>
            <div class="border-bt pb20"></div>
            <el-form :model="form" ref="form" label-width="130px" :rules="rules">
                <h5 class="ml20 mt20" style="width: 150px; vertical-align: middle; font-size: 14px; color: #000; font-weight: 600; box-sizing: border-box; font-weight: 700;">营销信息</h5>
                <el-form-item>
                    <template slot="label">
                        <span style="color:#919191">服务阶段/内容：</span>
                    </template>
                    <span>期内服务/协助索赔</span>
                </el-form-item>
                <el-form-item label="服务方式" prop="visitMode">
                    <el-select size="medium" class="w280" v-model="form.visitMode" @change="changevisitMode" placeholder="请选择服务方式"  clearable>
                        <el-option v-for="item in serviceMode" :key="item.code" :label="item.msg" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <div class="display-flex">
                    
                    <el-form-item label="服务时间" prop="visitDate">
                        <el-date-picker :picker-options="dealDateStartOptions" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择服务时间" v-model="form.visitDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="服务时长" prop="visitDuration">
                        <el-input-number :step="0.5" v-model="form.visitDuration" :min="0.5" :max="12"></el-input-number>  小时
                    </el-form-item>
                </div>
                <el-form-item label="服务情况" prop="visitSituation" style="width:100%">
                    <el-input type="textarea" :rows="3" placeholder="多行输入" v-model.trim="form.visitSituation"></el-input>
                </el-form-item>
                <el-form-item label="上传附件(选填)">
                    <el-upload action="#" :limit="9" :before-remove="beforeRemove" :before-upload="beforeAvatarUpload" :http-request="Upload" :file-list="fileList" accept=".jpg ,.jpeg , .png ,.JPG ,.JPEG , .PNG ">
                        <el-button size="small" type="primary">选择附件</el-button>
                        <span slot="tip" class="el-upload__tip files-tip ml20">只支持JPEG/PNG/JPG，大小不超过10M（最多可上传9件）</span>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="btn">
                <span class="btn-left" @click="dialogVisible = false">取消</span>
                <span class="btn-right" @click="onSubmit('form')">确认提交</span>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import moment from 'moment'
import UserService from '@/service/UserService';
import CaseServiceNew from '@/service/CaseServiceNew';
import ResourcesService from '@/service/ResourcesService'
export default {
    computed:{
        ...mapGetters({
            caseInfo:'caseInfo',
            policyInfoVo:'policyInfoVo',
            getSequipTime:'getSequipTime',
            area:'areaOptions',
        }),
        getAreaDetails(){
            return `${this.policyInfoVo.provinceName}/${this.policyInfoVo.cityName}/${this.policyInfoVo.areaName}`
        },
        
    },
    watch:{
        // policyInfoVo:{
        //     handler(newV,oldVal){
        //         this.form.visitName = newV.contactPerson
        //         this.form.visitPhone = newV.contactPhone
        //     },
        //     deep:true
        // }
    },
	data() {
		return {
            UserService: new UserService(),
            CaseServiceNew: new CaseServiceNew(),
            dealDateStartOptions:this.beginDate(),
            ResourcesService: new ResourcesService(),
            dialogVisible:false,
            form: {
                location:[],
				orgCode:'',
				orgName:'',
				areaCode:'',// (string, optional): 区县编码 ,
				areaName:'',// (string, optional): 区县名称 ,
				cityCode:'',// (string): 市编码 ,
				cityName:'',// (string): 市名称 ,
				provinceCode:'',// (string): 省份编码 ,
				provinceName:'',// (string): 省份名称 ,
				type:1,// (integer): 拜访类型(1企业拜访 2行管拜访 3 个人拜访) ,
				periodParams:[
                    {
                        "visitCause":7,
                        "visitCauseName":"协助索赔",
                        "visitPeriod":3,
                        "visitPeriodName":"期内服务"
                    }
                ],
				companyName: '',
				companyCode:'',
				visitName: '',
				visitPhone: '',
				visitPost: '',
				visitDate: '',
				visitDuration: 0,
				content: '',
				visitMode: '',
				visitModeName:'',
				visitSituation: '',
				fileInfoDTOS:[],
				visitors:[{
					code: window.sessionStorage.getItem('userCode'),// (string, optional): 拜访人编码 ,
					name: window.sessionStorage.getItem('userName'),// (string, optional): 拜访人名称 ,
					orgCode: window.sessionStorage.getItem('branchCode'),// (string, optional): 拜访人机构编码
				}]
			},
            rules: {
				visitName:[
					{required: true, message: '请输入联系人', trigger: 'blur'}
				],
				visitDate:[
					{type: 'string', required: true, message: '请选择日期', trigger: 'change'}
				],
				visitDuration:[
					{required: true, message: '请输入服务时长', trigger: 'blur'}
				],
				content:[
					{required: true, message: '请选择服务阶段/内容', trigger: 'change'}
				],
				visitMode:[
					{required: true, message: '请选择服务方式', trigger: 'change'}
				],
				visitSituation:[
					{ required: true, message: '请输入服务情况', trigger: 'blur' },
					{ min: 1, max: 100, message: '长度在1到100位', trigger: 'blur' }
				],
			},
            fileList:[],
            serviceMode:[], // 服务类型
        }
	},
	created(){},
	methods: {
        ...mapActions(['setAcceptCase']),
        // 初始化数据
        openInit(val) {
            this.dialogVisible = true;
            this.form.visitDate = this.getSequipTime
            this.form.location = [this.policyInfoVo.provinceCode,this.policyInfoVo.cityCode,this.policyInfoVo.areaCode].filter(item=>item)
            this.getDist()
        },
        beginDate(){
            let self = this
            return {
                disabledDate(time){
                    let startDate = self.serviceData?self.serviceData.split(" ")[0]: new Date();
                    return time.getTime() >  new Date(startDate)
                }
            }
        },
        //获取字典表
		async getDist() {
			let res = await this.UserService.getVisitDist();
			if(res.code == '0000') {
				this.serviceMode = res.data.visitMode
				res.data.visitStage.forEach(i => {
					i.value = i.code;
					i.label = i.msg;
					i.children = i.group;
					i.group.forEach(t => {
						t.value = t.code;
						t.label = t.msg;
					})
				})
				this.options8 = res.data.visitStage
			}
		},
        changevisitMode() {
			this.form.visitModeName = this.serviceMode.find(i => i.code == this.form.visitMode).msg;
		},
        async Upload(file){ // 图片上传
			const formData = new FormData();
			let data = [file.file]
			const res = await this.ResourcesService.uploadFile('sequip-svc','visit','0',data);
			if(res.code == '0000'){
				this.form.fileInfoDTOS.push(
					{
						fileName:res.list[0].fileName,// (string, optional): 文件名称 ,
						resFileId: res.list[0].fileId,// (integer, optional): 文件id
					}
				);
			}
		},
		beforeAvatarUpload(file) {
			let isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				this.$message.error('上传附件大小不能超过 10MB!');
			}
			return isLt10M;
		},
		beforeRemove(file, fileList) {
			if(file && file.status==="success"){
				if(this.$confirm(`确定移除 ${ file.name }？`)) {
					this.form.fileInfoDTOS.splice(this.form.fileInfoDTOS.findIndex(item => item.fileName == file.name),1)
					if(file.id) {
						this.form.fileRecordIds.push(file.id)
					}
				}
				return this.$confirm(`${ file.name }？`);
			}
		},
        
        // 取消
        close(){
            this.form = {
                location:[],
				orgCode:'',
				orgName:'',
				areaCode:'',// (string, optional): 区县编码 ,
				areaName:'',// (string, optional): 区县名称 ,
				cityCode:'',// (string): 市编码 ,
				cityName:'',// (string): 市名称 ,
				provinceCode:'',// (string): 省份编码 ,
				provinceName:'',// (string): 省份名称 ,
				type:1,// (integer): 拜访类型(1企业拜访 2行管拜访 3 个人拜访) ,
				periodParams:[
                    {
                        "visitCause":7,
                        "visitCauseName":"协助索赔",
                        "visitPeriod":3,
                        "visitPeriodName":"期内服务"
                    }
                ],
				companyName: '',
				companyCode:'',
				visitName: '',
				visitPhone: '',
				visitPost: '',
				visitDate: '',
				visitDuration: 0,
				content: '',
				visitMode: '',
				visitModeName:'',
				visitSituation: '',
				fileInfoDTOS:[],
				visitors:[{
					code: window.sessionStorage.getItem('userCode'),// (string, optional): 拜访人编码 ,
					name: window.sessionStorage.getItem('userName'),// (string, optional): 拜访人名称 ,
					orgCode: window.sessionStorage.getItem('branchCode'),// (string, optional): 拜访人机构编码
				}]
			}
            this.dialogVisible = false;

        },
        // 确认关联
        onSubmit() {
			this.$refs['form'].validate((valida) => {
				if (valida) {
                    this.addRecord();
				} else {
					return false;
				}
			})
		},
		async addRecord() {
            if(!this.form.visitName){
                this.$message.error('补充联系人信息')
            }
            if(this.form.location.length == 3){
                this.form.provinceCode = this.form.location[0];
                this.form.cityCode = this.form.location[1];
                this.form.areaCode = this.form.location[2];
                let { label, children } = this.area.find(i => i.value == this.form.location[0]) || '';
                let { label: cityLabel,children: cityChildren  } = children.find(t => t.value == this.form.location[1]) || '';
                let { label: areaLabel } = cityChildren.find(b => b.value == this.form.location[2]) || '';
                this.form.provinceName = label;
                this.form.cityName = cityLabel;
                this.form.areaName = areaLabel == undefined ? '' : areaLabel;
            } else {
                this.$message.error('补充企业地址')
                return
            }
            // this.form.provinceCode = this.policyInfoVo.provinceCode;
            // this.form.cityCode = this.policyInfoVo.cityCode;
            // this.form.areaCode = this.policyInfoVo.areaCode;
            // this.form.provinceName = this.policyInfoVo.provinceName;
            // this.form.cityName = this.policyInfoVo.cityName;
            // this.form.areaName = this.policyInfoVo.areaName;
            this.form.companyName = this.policyInfoVo.holderName;
            // this.form.visitName = this.policyInfoVo.contactPerson || '无';
            // this.form.visitPhone = this.policyInfoVo.visitPhone || '无';
            this.form.orgCode = this.caseInfo.serverBranchCode;
            this.form.orgName = this.caseInfo.serverBranch;
            this.form.thirdId = this.caseInfo.reportNo;
            this.form.visitType = '案件处理拜访';
            let code = await this.setAcceptCase(this.form)
            if(code === '0000'){
                this.close()
            }
		},
	},
}
</script>

<style lang="less">
#caseAddAcceptance {
    .con-row{
        color: #000;
        height: 40px;
        line-height: 40px;
        padding: 0 5px;
        .con-col {
            height: 40px;
            line-height: 40px;
        }
        .col-span-l {
            height: 40px;
            line-height: 40px;
            display: inline-block;
            color: #919191;
            overflow:hidden;
        }
        .see-button {
            padding: 0;
        }
        .color-0050B3 {
            color: #0050B3;
        }
        .col-span-r {
            height: 40px;
            line-height: 40px;
            display: inline-block;
            width: calc(100% - 40%);
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow:ellipsis;
        }
    }
    .border-bt {
        border-bottom: 1px dashed #e9e9e9;
    }
    .el-form-item {
        margin-bottom: 10px;
    }
    .btn{
        margin: 10px 0;
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
