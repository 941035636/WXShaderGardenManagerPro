<template>
     <div class="pb20 pl20">
            <ul>
                <li class="f18 pb20">您可以通过以下几种方式添加电梯：</li>
                <li class="f16 pb10">1、从【我的设备】选择要投保电梯 <el-button :disabled="productCode==$globalProductCode.PRODUCT_CODE_NJ && eleNJ" class="ts-ele-btn" type="warning" size="mini" @click="getElevator()">去添加</el-button></li>
                <li class="f16 pb10">2、录入电梯信息 <el-button :disabled="productCode==$globalProductCode.PRODUCT_CODE_NJ && eleNJ" class="ts-ele-btn" type="warning" size="mini" @click="addElevator()">去录入</el-button></li>
                <li class="f16 pb10 ts-bt-flex">3、选择下载模版，批量导入 
                        <el-upload
                            class="upload-demo "
                            :action="url"
                            :on-success='handleSuccess'
                            :on-error="onError"
                            :before-upload="onProgress"
                            :show-file-list='false'
                            :disabled="productCode==$globalProductCode.PRODUCT_CODE_NJ && eleNJ"
                            accept=".xlsx , .xls"
                        >
                        <el-button :disabled="productCode==$globalProductCode.PRODUCT_CODE_NJ && eleNJ" class="ts-ele-btn mr10" size="small" type="primary"> 点击上传</el-button>
                        </el-upload>
                    <el-button :disabled="productCode==$globalProductCode.PRODUCT_CODE_NJ && eleNJ"  class="ts-ele-btn" type="warning" size="mini"  @click="download()" >设备导入模版下载</el-button>
                </li>
            </ul>
            <div class="ts-ele-scheme pl10" v-if="elevatorMessage.length >0">
                您已成功添加  <span class="ts-ele-length">{{elevatorMessage.length}}部</span> 设备至您的投保单
                    <span style="cursor: pointer; color:#1581e8"  :underline="false"  type="primary" @click="importElevator()">查看 | 修改</span>
                    <span  style="cursor: pointer; color:#1581e8" :underline="false"  type="primary" @click="clear()">清空</span>
            </div>
            <ElevatorList ref="myChildEleList" @close="close"></ElevatorList>
            <AddElevator ref="myChildEle"  @close="close"></AddElevator>
             <PresentElevatorList ref="myChildPresentEle"  @close="close"></PresentElevatorList>
             <el-dialog
                title="错误信息提示"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <div v-html="errMsg"></div>
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
</template>

<script>
import productService from "@/service/ProductService";

import ElevatorList from '../../ElevatorList';
import AddElevator from '../../elevator/AddElevator';
import PresentElevatorList from '../../PresentElevatorList';
import {Loading, Message} from 'element-ui'
export default {
    props:{
        productCode:{
            type: String,
            required: true
        },
        eleNJ:{
            type: Boolean,
            default: true
        }
    },
    components:{
        ElevatorList,AddElevator,PresentElevatorList
    },
    data(){
        return{
            productService: new productService(),
             url:'',
             elevatorMessage:[],
             dialogVisible:false,
             errMsg:'',
        }
    },
    created(){
        this.url= process.env.ROOT_TESHE+ '/api/v1/templateImport/addElevatorEquipmentExcel?productCode='+this.productCode;
         if(this.flag){
            this.getSession();
        }
    },
    methods: {
         // 获取缓存数据
         getSession(){ 
             
           this.elevatorMessage =JSON.parse(window.sessionStorage.getItem('elevatorMessage'));
        
        },
        // 获取电梯列表 
        getElevator(){
            this.setSession();    // 设置缓存
            let productCode =this.productCode;
            this.$refs.myChildEleList.flagTrue(productCode);
        },  
        // 上传时执行的函数
        onProgress(){
            this.loadingInstance = Loading.service({
                text: "加载中..."
            });
                        
        },
        // 添加电梯 
        addElevator(){
            this.setSession();    // 设置缓存
            let productCode =this.productCode;
            this.$refs.myChildEle.flagTrue(productCode);
            this.eleFlag = true;
        },
         // 下载电梯模版
        async download(){
            const {productClassifyList} = JSON.parse(window.sessionStorage.getItem('productClassifyList'))?JSON.parse(window.sessionStorage.getItem('productClassifyList')):'';
            
            let flag;
            let productCode = this.productCode;
            if( productCode ==this.$globalProductCode.PRODUCT_CODE_NJ && productClassifyList[0].code=="19FA149436"){
                flag='A';
            }else if( productCode ==this.$globalProductCode.PRODUCT_CODE_NJ && productClassifyList[0].code=="19FA408124"){
                flag='B';
            }else{
                flag=''
            }
            const params = await this.productService.download(productCode,'1',flag);
            let {code,msg} = params;
            if(code=='0000'){
                window.location.href=msg
            }
        },
        handleSuccess(file, fileList) {
            this.loadingInstance.close();
            let {code} =file
            if(code=='0000'){
                this.$message.success('添加成功');
                file.list.forEach(item => {
                    item.template='Y';  // 模版上传
                });
                this.elevatorMessage = this.elevatorMessage.concat(file.list)
                 window.sessionStorage.setItem('elevatorMessage',JSON.stringify(this.elevatorMessage))

            }else{
               this.dialogVisible=true;
               this.errMsg=file.msg;
            }
        }, 
        onError(){
            this.loadingInstance.close();
             this.$message.error('失败');

        },
        // 电梯保单电梯列表 
        importElevator(){
             this.setSession();
            this.$refs.myChildPresentEle.flagTrue()
        }, 
        // 清空电梯数据 
        clear(){   
            this.$confirm('是否将电梯清空?', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
                    this.elevatorMessage=[];
                    this.setSession();
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
            
        }, 
        // 获取缓存信息
        close(){
           this.elevatorMessage = JSON.parse(window.sessionStorage.getItem('elevatorMessage'));
        }, 
        // 设置缓存信息
        setSession(){
            window.sessionStorage.setItem('elevatorMessage',JSON.stringify(this.elevatorMessage))
        },
        // 清除报错信息
        handleClose(){
            this.dialogVisible = false;
            this.errMsg="";
        }
    }
}
</script>

<style>
.box{
    cursor: pointer;
}
</style>
