<template>
<!-- 索赔信息组件 -->
    <div id="casePeiFu">
        <div class="title">
            <div class="title-l">
                <span></span>
                <span>
                    赔付信息
                </span>
            </div>
        </div>
        <div class="mt20">
            <el-form ref="form" label-position="right" label-width="150px" :rules="rules">
                <el-form-item>
                    <span slot="label">
                        <span class="color-red">*</span>
                        结案类型
                    </span>
					<el-radio-group v-model="form.closeType" @change="setCloseType">
						<el-radio :label="item.code" v-for="(item,index) in caseSettleType" :key="index">{{item.name}}</el-radio>
					</el-radio-group>
                     <span v-if="pushInsuranceFlag" @click="oneKeySetCloseType" style="color:#FA8C16;cursor: pointer;text-decoration:underline;margin-left:20px">点击“获取保司结案信息”</span>
				</el-form-item>
                <el-form-item v-if="form.closeType == '401'">
                    <span slot="label">
                        <span class="color-red">*</span>
                        赔付金额
                    </span>
                    <el-table
                        :data="dataPF"
                        :header-cell-style="getRowClass"
                        border
                        style="width: 800px">
                        <el-table-column
                            align="center"
                            type="index"
                            label="序号"
                            width="50"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="date"
                            label="选择"
                            width="80">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.isCheck"
                                    @change="scope.row.money = ''"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="riskName"
                        label="费用类型"
                        width="300"
                        >
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.moneyTypeName}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额">
                            <template slot-scope="scope">
                                <div>
                                    <el-input class="w280" placeholder="请输入" :disabled="!scope.row.isCheck" v-model="scope.row.money"  onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" clearable size="small">
                                        <template slot="append">元</template>
                                    </el-input>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="border-split"></div>
                    <div class="display-flex">
                        <p class="col-black">结案总金额：</p>
                        <p >
                            <span style="display: inline-block;color:#FF2828; vertical-align: bottom; font-size:14px">￥</span>
                            <span style="display: inline-block;color:#FF2828; font-size:16px;margin-left: -6px;">{{getPeiFuPerTotal}}</span>
                            <span style="display: inline-block;color:#FF2828; vertical-align: bottom;font-size:12px">元</span>
                        </p>
                    </div>
                </el-form-item>
                <el-form-item size="small" v-if="form.closeType != '402'">
                    <span slot="label">
                        <span class="color-red">*</span>
                        结案资料
                    </span>
                    <div class="file-table">
                        <div class="mb10 display-flex">
                            <el-button :disabled="isCasePause" class="upload-btn" size="small" type="primary" @click="addFile">
                                点击上传
                            </el-button>
                            <span  class="fileTip">
                            只支持PDF/PNG/JPG/JPEG/EML/M4A/MP3，大小不超过20M（最多可上传50件）
                            </span>
                        </div>
                        <el-table
                        :data="projectFileContarct"
                        border
                        :header-cell-style="getRowClass"
                        >
                            <el-table-column
                                type="index"
                                label="序号"
                                width="50"
                            ></el-table-column>
                            <el-table-column
                                show-overflow-tooltip
                                prop="fileType"
                                label="文件类型"
                            ></el-table-column>
                            <el-table-column
                                show-overflow-tooltip
                                prop="fileName"
                                label="文件名"
                            ></el-table-column>
                            <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
                            <el-table-column label="操作" width="150" align="center">
                                <template slot-scope="scope">
                                <el-button type="text" @click="downloadFile(scope.row)">
                                    下载
                                </el-button>
                                <el-button
                                    type="text"
                                    :disabled="!isHandleButton || isCasePause"
                                    @click="deletFile(scope.row)"
                                >
                                    删除
                                </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
                
			</el-form>
        </div>
       
        <caseAddFileDialog
            ref="caseAddFileDialog"
            accept=".pdf , .png, .jpg, .jpeg,.PDF , .PNG, .JPG, .JPEG, .eml, .m4a, .mp3, .EML, .M4A, .MP3"
            acceptRemarks="只支持PDF/PNG/JPG/JPEG/EML/M4A/MP3，大小不超过20M（最多可上传50件）"
            :fileTypeData="fileTypeData"
        ></caseAddFileDialog>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import caseAddFileDialog from './caseAddFileDialog'
export default {
    components:{
        caseAddFileDialog
    },
    data() {
		return {
            fileTypeData:['结案文件','销案文件','拒赔文件','零结文件'],
            form:{
                closeType:'',
            },
            dataPF:[
                {
                   isCheck:false,
                   moneyType:'casualtiesPayMoney', 
                   moneyTypeName:'人身伤亡',
                   money:''
                },
                {
                   isCheck:false,
                   moneyType:'thirdPayMoney', 
                   moneyTypeName:'财产损失',
                   money:''
                },
                {
                   isCheck:false,
                   moneyType:'otherPayMoney', 
                   moneyTypeName:'其他费用',
                   money:''
                }
            ],
            projectFileContarct:[],
            rules:{
				claimAmount:[{ required: true, message: '请输入', trigger: 'blur'}],
                closeType: [
					{required: true, message: '请选择结案类型', trigger: 'change'}
				],
			},
		}
    },
    computed:{
        ...mapGetters(
        {
            caseInfo:'caseInfo',
            endCaseInfo:'endCaseInfo',
            fileListVuex:'fileList',
            isHandleButton:'isHandleButton',
            isCasePause:'isCasePause',
            caseSettleType:'caseSettleType',
            pushInsuranceData:'pushInsuranceDataNew'
        }),
        getPeiFuPerTotal(){
            let list = this.dataPF.filter(item=>item.isCheck).map(item=>item.money)
            if(list.length === 0) {
                return 0
            } else {
                let per = 0
                list.forEach(function(item){
                    per += isNaN(Number(item)) ? 0 : Number(item)
                });
                return per.toFixed(2)
            }
            
        },
        pushInsuranceFlag(){
            return this.pushInsuranceData.isPushInsuranceFlag
            // return true
        },
    },

    props:{
       
    },
    watch:{
        endCaseInfo: {
            // 每个属性值发生变化就会调用这个函数
            handler(newVal, oldVal) {
                if(newVal && (newVal.casualtiesPayMoney || newVal.thirdPayMoney || newVal.otherPayMoney || newVal.closeType !='401')) {
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
                if(newVal && newVal.length !==0) {
                    this.getFile()
                }
            },
            // 立即处理 进入页面就触发
            immediate: true,
            // 深度监听 属性的变化
            deep: true
        },
    },
 
    created() {
    },
    methods: {
        ...mapActions(['deleteFileInfo','downloadCaseFile','endCaseInfoSave']),
        setForm(){
            this.dataPF.forEach(item=>{
                if(this.endCaseInfo[item.moneyType] !== '' && this.endCaseInfo[item.moneyType] !== 0) {
                    item.isCheck = true
                    item.money = this.endCaseInfo[item.moneyType]
                } else {
                    item.isCheck = false
                    item.money = ''
                }
            })
            this.form.closeType = this.endCaseInfo.closeType
        },
        getFile(){
            this.projectFileContarct = this.fileListVuex.filter((item)=>{
                if(this.fileTypeData.find(v1=>v1== item.fileType)){
                    return item
                }
            })
        },
        addFile(){
            this.$refs.caseAddFileDialog.openInit()
        },
        //更改表头颜色
        getRowClass({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (rowIndex == 0) {
                return 'background:#f5f5f5; color: #000;padding:6px 0 !important'
            } else {
                return '';
            }
        },
        downloadFile(row){
            this.downloadCaseFile({...row,isDownload:true})
        },
        deletFile(row){
            this.deleteFileInfo(row.id)
        },
        setCloseType(){
            let obj =  {
                   casualtiesPayMoney:'0',
                   thirdPayMoney:'0', 
                   otherPayMoney:'0',
                }
            this.endCaseInfoSave({...obj,...this.form})
        },
        submit(){
            let form = ''
            let obj = this.dataPF.find(item=>item.isCheck && item.money === '')
            if(!this.form.closeType) {
                this.$message.warning('请选择结案类型')
            } else if(obj && this.form.closeType == '401') {
                this.$message.warning('请补全赔付金额信息')
            } else  {
                form = {}
                let obj = {
                    flag:false
                }
                if(this.form.closeType == '401'){
                    this.dataPF.forEach(item=>{
                        if(item.isCheck && this.checkAmount(Number(item.money))){
                            form[item.moneyType] = item.money
                        }else if (!item.isCheck){
                            form[item.moneyType] = ''
                        } else {
                            obj.flag = true
                            obj.content = item
                        }
                    })
                }
                
                form.closeType = this.form.closeType
                if(obj.flag === true) {
                    this.$message.error(`${obj.content.moneyTypeName}赔付金额范围值是0-99999999.99小数保留两位`)
                    form = ''
                }
            }
            return form
        },
        // 计算金额
        checkAmount(v){
            let perm = this.$stringHelper.checkAmount(v)
            if((perm && v>=0 && v<100000000) || v == 0) {
                return true
            } else {
                return false
            }
        },
        // 一键获取保司结案类型
        oneKeySetCloseType(){
            // INVALID_CASE("05","无效案件"),
            // PAYMENT_CASE("01","赔付结案"),
            // CANCEL_CASE("02","销案"),
            // REFUSAL_CASE("03","拒赔"),
            // ZERO_CASE("04","零赔");
            let isSettleTypeFlag = true
            switch (this.pushInsuranceData.pushInsuranceDetails.settleType) {
                case '01':
                    this.form.closeType =  '401'
                    break;
                case '02':
                    this.form.closeType =  '403'
                    break;
                case '03':
                    this.form.closeType =  '404'
                    break;
                case '04':
                    this.form.closeType =  '405'
                    break;
                case '05':
                    this.form.closeType =  '402'
                    break;
                default:
                    isSettleTypeFlag = false
                    break;
            }
            if(isSettleTypeFlag){
                this.setCloseType()
            }
        },
    }
}
</script>
<style lang="less" scoped>
    #casePeiFu {
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
        .border-split {
            margin-top: 20px;
            border-bottom: 1px dashed #ccc;
        }
        .file-table {
            padding: 0 10px;
            .upload-btn {
                background-color: #355e92;
                border-color: #355e92;
            }
            .fileTip {
                color: #096DD9;
                margin-left: 20px;
            }
        }
        
    }

</style>