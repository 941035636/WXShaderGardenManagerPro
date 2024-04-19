<template>
<!-- 索赔信息组件 -->
    <div id="caseClaimFileCom">
        <div class="caseClaimFileCom-box" v-for="(item,key) in filesDataComponets" :key="key">
            <div class="box-l" :style="{'background-color': item.color} ">
                0{{key + 1}}
            </div>
            <div class="box-r">
                <div class="box-r-title">
                    <div class="title-l">
                        <span style="font-weight:700">{{item.label}}</span>
                        <!-- <span>{{item.allTwoType}}</span> -->
                    </div>
                    <div class="title-r">
                        <span>上传进度</span>
                        <span style="color:#FAA341">{{getCurrentPercentage(item)}}</span>
                        <el-button :disabled="isCasePause" class="ml10" icon="el-icon-folder-add" type="text" @click="addFile(item)">批量上传</el-button>
                        <el-button :disabled="isCasePause" class="ml20" type="text" @click="detailsFlie(item.oneType)">附件管理</el-button>
                    </div>
                </div>
                <div class="box-r-content" v-for="(v1,k1) in item.child" :key="k1">
                    <div class="content-l">
                        <span class="color-red" v-if="v1.isRequired">*</span>
                        <span>{{v1.label}}</span>
                    </div>
                    <div class="content-c">
                        <i class="el-icon-success" style="color:#52C41A" v-if="getFileList(item.oneType,v1.twoType).length !=0"></i>
                    </div>
                    <div class="content-r">
                        <div v-if="getFileList(item.oneType,v1.twoType).length ==0">
                            <span v-if="v1.isRequired">必填，待上传</span>
                            <span v-else-if="!v1.isRequired">非必填</span>
                        </div>
                        <div v-if="getFileList(item.oneType,v1.twoType).length !=0">
                            <span class="content-r-button" v-for="(v2,k2) in getFileList(item.oneType,v1.twoType)" :key="k2"  @click="downloadFile(v2)">{{v2.fileName}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <caseClaimAddFileDialog ref="caseClaimAddFileDialog" :litigation="litigation" :subType="subType" :fileSecType="fileSecType" :fileTypeData="fileTypeData"></caseClaimAddFileDialog>
        <caseClaimFileList ref="caseClaimFileList" :litigation="litigation" :subType="subType" ></caseClaimFileList>
        <ImgDialog ref="ImgDialog"></ImgDialog>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import caseClaimAddFileDialog from './caseClaimAddFileDialog'
import caseClaimFileList from './caseClaimFileList'
import ImgDialog from '@/components/ImgDialog'
export default {
    components:{
        caseClaimAddFileDialog,
        caseClaimFileList,
        ImgDialog
    },
    data() {
		return {
            fileSecType:'',
            fileTypeData:[],
		}
    },
    computed:{
        ...mapGetters(['fileList','isCasePause'])
    },
    props:{
       filesDataComponets:{
           type:Array,
           default:()=>{
               return []
           }
       },
       litigation:{
           type:Boolean,
       },
       subType:{
           type:String,
       },
    },
    created() {
    },
    methods: {
        ...mapActions(['downloadCaseFile']),
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#f5f5f5'
            } else {
                return ''
            }
        },
        addFile(row){
            this.fileSecType = row.oneType
            this.fileTypeData = row.child.map(item=>item.twoType)
            this.$refs.caseClaimAddFileDialog.openInit()
        },
        // 获取当前的文件数据
        getFileList(fileSecType,fileLabel){
            let fileType = ''
            if(this.litigation){
                fileType = '诉讼文件'
            } else if(!this.litigation && this.subType == '200'){
                fileType = '非诉讼文件-小额快赔'
            } else if(!this.litigation && this.subType == '100'){
                fileType = '非诉讼文件'
            }
            // let fileType = this.litigation ? '诉讼文件' : '非诉讼文件'
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
                return ((completeList.length / list.length).toFixed(2) * 100).toFixed(2) + '%'
            }
        },
        detailsFlie(row){
            this.$refs.caseClaimFileList.openInit(row)
        },
        async downloadFile(item) {
            if (/\.(pdf|PDF)$/.test(item.fileName)){
                let routeData = this.$router.resolve({
                    name: "PdfDetail",
                    query:{
                        fildId: item.url,
                        fildName: item.fileName
                    }
                });
                window.open(routeData.href, '_blank');
            } else if(/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/.test(item.fileName)){
                let {code,url} = await this.downloadCaseFile({...item,isDownload:false})
                if(code === '0000') {
                    this.$refs.ImgDialog.open(url)
                }
            } else {
                this.downloadCaseFile({...item,isDownload:true})
            }
        },
    }
}
</script>
<style lang="less" scoped>
    #caseClaimFileCom {
        margin-top: 20px;
        .caseClaimFileCom-box {
            margin-bottom: 10px;
            display: flex;
            .box-l {
                width: 38px;
                height: 22px;
                border-radius: 20px;
                color: #FFFFFF;
                font-size: 16px;
                text-align: center;
            }
            .box-r {
                margin-left: 20px;
                min-width: 800px;
                width: calc(100% - 200px);
                .box-r-title {
                    display: flex;
                    .title-l {
                        color:#000;
                        width: 400px;
                        margin-right: 50px;
                    }
                }
                .box-r-content {
                    display: flex;
                    // flex:0 0 auto;
                    padding-bottom: 4px;
                    border-bottom: 1px solid #ccc;
                    // justify-items: center;
                    align-items: center;
                    min-height: 40px;
                    .content-l {
                        width: 150px;
                        flex-shrink: 0;
                        margin-right: 50px;
                    }
                    .content-c {
                        flex-shrink: 0;
                        width: 50px;
                        text-align: center;
                    }
                    .content-r {
                        margin-left: 20px;
                        .content-r-button {
                            margin: 3px 0;
                            margin-right: 5px;
                            display: inline-block;
                            padding: 3px 20px;
                            color: #096DD9;
                            border: 1px solid #096DD9;
                            border-radius: 4px;
                            cursor: pointer;
                        }

                    }
                }
            }
        }
    }

</style>