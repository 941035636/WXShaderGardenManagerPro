<template>
<!-- 赔付文件详情 -->
    <div id="casePeiFuFileDetails">
        <div style="font-size: 14px;font-weight: 700;color: #096DD9; margin-top:10px" @click="downloadAllFileList">
            索赔资料
        </div>
        <div class="tip">
            请根据“出险信息/案件类型”上传理赔资料：
            <span style="color:#FAA341">
                {{riskInfo.accidentType?riskInfo.accidentType.join('、'):''}}
            </span>
            损失,
            目前总进度：
            <span style="color:#FAA341">{{totalProportion}}</span>
        </div>
        <div class="download-button" @click="downloadAllFileList">一键下载全部索赔资料</div>
        <el-table :data="filesDataComponets" border :header-cell-style="getRowClass" class="mt20">
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <el-table-column prop="oneType" label="资料描述">
            </el-table-column>
            <el-table-column label="资料附件">
                <template slot-scope="scope">
                  <div v-if="getOneFileList(scope.row.oneType).length !== 0">
                       共 {{getOneFileList(scope.row.oneType).length}}个附件，
                       <el-button type="text" @click="setInnerVisible(scope.row.oneType)">点击查看</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="进度">
                <template slot-scope="scope">
                    <span>{{getCurrentPercentage(scope.row)}}</span>
                </template>
            </el-table-column>
        </el-table>
         <el-dialog
            width="800px"
            title="索赔资料查看"
            :visible.sync="innerVisible"
            append-to-body
            >
            <el-table :data="getOneFileList(oneType)" border :header-cell-style="getRowClass">
                <el-table-column type="index" label="序号" width="80px"></el-table-column>
                <el-table-column prop="fileLabel" label="文件类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.fileSecType}}</span>/
                        <span>{{scope.row.fileLabel}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fileName" label="文件名"></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
                <el-table-column prop="createTime" label="资料附件" width="80px">
                    <template slot-scope="scope">
                        <el-button type="text"  @click="downloadFile(scope.row)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
import CaseServiceNew from '@/service/CaseServiceNew'
import ResourcesService from '@/service/ResourcesService'
import claimFile from '../../handle/dataJson/claimFile'
export default {
    data() {
		return {
            innerVisible:false,
            caseServiceNew:new CaseServiceNew(),
            resourcesService:new ResourcesService(),
            dataList:[],
            oneType:'',
            totalProportion:'',
            filesDataComponets:[]
		}
    },
    computed:{
        ...mapGetters({
            caseInfo:'caseInfo',
            fileList:'fileList',
            claimInfo:'claimInfo',
            riskInfo:'riskInfo',
            policyInfoVo:'policyInfoVo',
        }),
    },
    watch:{
        claimInfo:{
            handler(n,o){
                if(Object.keys(n).length !== 0) {
                    this.getFileComponents()
                }
            },
        },
    },
    created() {
    },

    methods: {
        ...mapActions(['deleteFileInfo','downloadCaseFile']),
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#f5f5f5;color:#000'
            } else {
            return ''
            }
        },
        // 获取fils组件拼装数据
        getFileComponents(){
            // 诉讼案件
            // if(this.caseInfo.litigation) {
            //     this.filesDataComponets = claimFile.filter(item=>{
            //         if(item.oneType=== '制式性材料' || item.oneType=== '收款信息' || item.oneType === '诉讼资料'){
            //             return item
            //         }
            //     })
            // } else {
            //     // 非诉讼案件
            //     this.filesDataComponets = []
            //     claimFile.filter(item=>{
            //          // 小额快赔文件
            //         if((item.oneType=== '授权转让书' || item.oneType=== '小额快赔表' || item.oneType=== '身份证') && this.riskInfo.accidentType.find(v1=>v1 !== '其他') && this.caseInfo.subType == '200'){
            //             this.filesDataComponets.push(item)
            //         }else if((item.oneType=== '制式性材料' || item.oneType=== '收款信息') && this.riskInfo.accidentType.find(v1=>v1 !== '其他') && this.caseInfo.subType == '100'){
            //            this.filesDataComponets.push(item)
            //         } else if(this.riskInfo.accidentType && this.riskInfo.accidentType.find(v1=>item.oneType === v1) && item.oneType !== '身份证和劳动合同') {
            //             if(item.oneType === '滞留'){
            //                 let obj = {
            //                     ...item,
            //                 }
            //                obj.child = item.child.filter(v1=>v1.riskType == this.policyInfoVo.productCategoryCode)
            //                this.filesDataComponets.push(obj)
            //             } else {
            //                 this.filesDataComponets.push(item)
            //             }
            //         } else if(this.riskInfo.accidentType.find(v1=>v1 !== '第三者财产' &&  v1 !== '其他') && item.oneType === '身份证和劳动合同' && this.caseInfo.subType == '100'){
            //             this.filesDataComponets.push(item)
            //         }
            //     })
            // }
            this.filesDataComponets = []
            claimFile.forEach(item=>{
                let litigationConfig = item.litigationConfig.some(v1=>v1.value == 'All' || v1.value == this.caseInfo.litigation) // 是否诉讼案件
                let paymentConfig = item.paymentConfig.some(v1=>v1.value == 'All' || v1.value == this.caseInfo.subType)  // 是否小额快赔
                let riskTypeConfig = item.riskTypeConfig.some(v1=>v1.value == 'All' || v1.value == this.policyInfoVo.productCategoryCode) // 是否符合险种
                let excludeRiskTypeConfig = item.excludeRiskTypeConfig.some(v1=>v1.value == 'All' || v1.value == this.policyInfoVo.productCategoryCode) // 排除的险种
                let accidentTypeConfig = item.accidentTypeConfig.some(v1=>{
                   let accidentType = this.riskInfo.accidentType.some(v2=>v1.value == v2)
                    if(v1.value == 'All' || accidentType) {
                        return true
                    } else {
                        return false
                    }
                })
                if(litigationConfig && paymentConfig && accidentTypeConfig && riskTypeConfig && !excludeRiskTypeConfig) {
                    this.filesDataComponets.push(item)
                }
            })
            this.getNum()
        },
        setInnerVisible(v){
            this.innerVisible = true
            this.oneType = v
        },
        downloadFile(row){
            this.downloadCaseFile({...row,isDownload:true})
        },
        // 获取当前的文件数据
        getFileList(fileSecType,fileLabel){
            let fileType = this.getFileType()
            let list = this.fileList.filter(item=>item.fileType== fileType && item.fileSecType== fileSecType && item.fileLabel === fileLabel)
            return list
        },
        getCurrentPercentage(row){
            let list = row.child.filter(item=>item.isRequired).map(item=>{
                if(this.getFileList(row.oneType,item.twoType).length !==0) {
                    return true
                } else {
                    return false
                }
            })
            let completeList = list.filter(item=>item)
            if(completeList.length === 0 && list.length === 0){
                return ''
            }else{
                return (completeList.length / list.length).toFixed(2) * 100 + '%'
            }
            
        },
        // 获取一级类型的总数据
        getOneFileList(fileSecType,){
            let fileType = this.getFileType()
            let list = this.fileList.filter(item=>item.fileType== fileType && item.fileSecType== fileSecType)
            return list
        },
        // 获取一级类型fileType
        getFileType(){
            let fileType = ''
            if(this.caseInfo.litigation){
                fileType = '诉讼文件'
            } else if(!this.caseInfo.litigation && this.caseInfo.subType == '200'){
                fileType = '非诉讼文件-小额快赔'
            } else if(!this.caseInfo.litigation && this.caseInfo.subType == '100'){
                fileType = '非诉讼文件'
            }
            return fileType
        },
        getNum(){
            let fileType = this.getFileType()
            let list = []
            let completeList = []
            this.filesDataComponets.forEach(v1=>{
                v1.child.forEach(v2=>{
                    if(v2.isRequired) {
                        let isUpload = this.fileList.some(item=>item.fileType== fileType && item.fileSecType == v1.oneType && item.fileLabel == v2.twoType)
                        list.push(v2.isRequired)
                        if(isUpload){
                            completeList.push(isUpload)
                        }
                    }
                })
            })
            if(completeList.length == 0 &&  list.length === 0) {
                this.totalProportion = '100%'
            } else {
               
                this.totalProportion = ((completeList.length / list.length).toFixed(2) * 100).toFixed(2) + '%'
            }
        },
        // 下载当前的案件索赔文件
        downloadAllFileList(){
            let fileType = this.getFileType()
            let accidentType = ['一般人伤','滞留','第三者财产','其他']
            let list = this.fileList.filter(item=>item.fileType == fileType && !accidentType.some(v1=>v1==item.fileSecType))
            let accidentTypeFlieList = this.fileList.filter(item=>item.fileType == fileType && this.riskInfo.accidentType.some(v1=>v1==item.fileSecType))
            let fileList = [...list,...accidentTypeFlieList].map(item=>{
                let obj = this.resourcesService.getUrlParams(item.url)
                return obj
            })
            if(fileList.length == 0 ) {
                this.$message.error('暂未上传资料，请上传后下载')
            } else {
                this.caseServiceNew.fileZipDownload(fileList)
            }
            return fileList
        },
    }
}
</script>
<style lang="less" scoped>
    #casePeiFuFileDetails {
        background-color:#fff;
        .tip {
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            width: 680px;
            background-color: #FEFFE6;
            display: inline-block;
            margin-right: 20px;
        }
        .download-button {
            color: #5196E5;
            cursor: pointer;
            display: inline-block;
            text-decoration:underline;
        }
    }
</style>