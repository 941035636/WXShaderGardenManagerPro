<template>
    <div id="equipInfo">
        <!-- 头部 -->
        <div class="ts-border">
            <div class="ts-insure-title">
                <!-- <span class="orange-div"></span> -->
                <span>设备清单—追加</span> 
            </div>
        </div>
        <div class="ts-split"></div>
        <div class="btn-group">
             <el-upload
                class="upload-demo "
                :action="url"
                :headers="headers"
                :on-success='handleSuccess'
                :on-error="onError"
                :before-upload="onProgress"
                :show-file-list='false'
                accept=".xlsx , .xls">
                <el-button  type="warning"  size="medium">批量上传设备</el-button>
            </el-upload>
            
            <span class="ts-download" @click="download()">
                <span class="el-icon-upload" style="color:#409EFF; font-size:24px"></span>
                <span style="color:#409EFF; font-size:14px;text-decoration:underline; ">下载设备导入模板</span>
            </span>
            <span class="text-tip  ml20">您已成功添加<span class="num-style">{{elevatorMessage.length}}</span>部设备至您的投保单</span>
            <span class="all-delete ml20" @click="clear()"><i class="el-icon-delete"></i>全部删除</span>
            <span class="ts-shebei">
                <!-- <img src="../../../assets/images/icon-03.png" alt="">
                <span>此产品设备模板已更新({{productConfigurationDetails.templateUpdateTime}})，请下载使用最新设备模板</span> -->
            </span>
           
           
        </div>
        <div class="pr40 pl40">
            <div class="ts-pagination mt20 mb20">
                <el-pagination
                    background
                    :current-page="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="elevatorMessage.length" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
            <el-table  :data="showEle"  style="width: 100%;" :header-cell-style="getRowClass">
                <el-table-column type="index" label="序号" align="center" width="80">
                </el-table-column>
                <el-table-column label="设备代码/出厂编号" align="center" width="190">
                    <template slot-scope="scope">
						<span v-if="scope.row.equipmentsCode">{{scope.row.equipmentsCode}}</span>
						<span  v-else-if="scope.row.licenceNo">{{scope.row.licenceNo}}</span>
					</template>
                </el-table-column>
                
                <el-table-column  label="类型" align="center"  width="190">
                    <template slot-scope="scope">
						<span v-if="scope.row.elevatorType ==1">直梯</span>
						<span  v-else-if="scope.row.elevatorType ==2">扶梯</span>
						<span  v-else>货梯</span>
					</template>
                </el-table-column>
                <el-table-column  label="检验机构" align="center"  width="190">
                    <template slot-scope="scope">
						<span v-if="scope.row.testOrganization == '1'">省特检院</span>
						<span  v-else-if="scope.row.testOrganization == '2'">市特检院</span>
					</template>
                </el-table-column>
                <!-- <el-table-column label="重量(kg)/高度(m)" align="center">
                    <template slot-scope="scope">
						<span v-if="scope.row.weight !=null && scope.row.weight !=''">{{scope.row.weight}}kg </span>
						<span  v-else-if="scope.row.height !=null && scope.row.height !=''">{{scope.row.height}}m</span>
					</template>
                </el-table-column> -->
               <el-table-column prop="elevatorSite" label="电梯使用场所" align="center" width="140">
				</el-table-column>
                <el-table-column prop="useOfUnit" label="使用单位" align="center">
				</el-table-column>
				<!-- <el-table-column prop="elevatorYear" label="电梯使用年限" align="center" width="140">
				</el-table-column> -->
                <el-table-column label="坐落区域" align="center">
                    <template slot-scope="scope">
						<span v-if="scope.row.areaValueFirst">{{scope.row.areaValueFirst}} {{scope.row.areaValueSecond}} {{scope.row.areaValueThird}} </span>
						<span v-if="scope.row.useOfAddress">{{scope.row.useOfAddress}}  </span>
					</template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="scope">
						<el-button  type="text" class="col-edit" @click="handleDelete(scope.$index, scope.row)">移除</el-button>
					</template>
                </el-table-column>
            </el-table>
            
        </div>
        <!-- 提交按钮 -->
         <div class="btm-btn mt40">
            <el-button type="warning" @click="submit" >确认提交</el-button>
            <el-button type="info" @click="closeURL">取消</el-button>
        </div> 
        <el-dialog
            title="错误信息提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <div v-html="errMsg"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
		title="确认提示"
		:visible.sync="dialogVisible1"
		width="30%">
		<span>{{tipText}}</span>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible1 = false">取 消</el-button>
			<el-button type="primary" @click="confirmSubmit" :disabled="disabled">确 定</el-button>
		</span>
		</el-dialog>
    </div>
</template>

<script>
import productService from '@/service/ProductService';
import ResourcesService from '@/service/ResourcesService';
import {elevator} from '@/server/accidenServer.js';
import {Loading, Message} from 'element-ui'
export default {
    props:{},
    components:{},
    data(){
        return{
            productService: new productService(),
            ResourcesService: new ResourcesService(),
            Elevator:new elevator(),
            url:'',
            elevatorMessage:[],
            showEle:[],
            dialogVisible:false,
            dialogVisible1:false,
            errMsg:'',
            tableData:[],
            currentPage:1,
            scheme:{},
            headers:{
            authorization:window.sessionStorage.getItem('authorization'),
            'jtpf.userId': window.sessionStorage.getItem('userCode'),
            },
            tipText: '确认追加设备?',
            disabled:false,
            applicationEleList:[],  // 原始保单电梯数据
           
        }
    },
    created(){
        
    },

    mounted (){
        this.productCode = this.$route.query.productCode
        this.url= this.$apiUrl.ROOT_GETEWARY+ '/sequip-svc/api/v1/templateImport/addElevatorEquipmentExcel?productCode='+this.productCode;
        console.log(this.$apiUrl.ROOT_GETEWARY);
        
        this.getappdetails()
    },
    methods: {
        async getappdetails(){
			let data ={
				'appCode':this.$route.query.appCode
			};
            let res = await this.Elevator.getappdetails(data);
			if(res.code == '0000'){
                let eleList = [];
				this.data2 = res.data;
				res.data.insuredList[0].insuranceObjectVos.forEach(item=>{
                  let equipmentsCode = item.commonExtendVoList.find(v1=>v1.fieldCode == 'S_O_000013').fieldValues   // 电梯编号
                  let licenceNo = item.commonExtendVoList.find(v1=>v1.fieldCode == 'S_O_000012').fieldValues    // 电梯出厂编号
                  eleList.push({
                      equipmentsCode:equipmentsCode,
                      licenceNo:licenceNo,
                  })
                })
                this.applicationEleList = eleList;
			}
		},
        // 上传时执行的函数
        onProgress(){
            this.loadingInstance = Loading.service({
                text: "加载中..."
            });
        },
         // 下载电梯模版
        async download(){
            this.ResourcesService.exportsViewFile(this.$apiUrl.NEW_TEMPLATE,{'productCode':this.productCode})
        },
        // 模版上传成功
        handleSuccess(file, fileList) {
            this.loadingInstance.close();
            let {code} = file
            if(code=='0000'){
                let list = this.elevatorMessage.concat(file.list)
                if(list.length>5000){
                    this.$message.error('本次追加最多支持5000');
                }else{
                    this.$message.success('添加成功');
                    this.elevatorMessage = JSON.parse(JSON.stringify(list)) 
                    this.closePage()
                }
            }else{
                this.dialogVisible=true;
                this.errMsg=file.msg
            }
        }, 
        // 上传失败
        onError(){
            this.loadingInstance.close();
            this.$message.error('失败');

        },
        // 清空电梯数据 
        clear(){   
            this.$confirm('是否将电梯清空?', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
                    this.elevatorMessage=[];
                    this.showEle=[];
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
        // 设置电梯数据分页
        closePage(){
           if(this.elevatorMessage.length <= 10) {
                this.showEle = this.elevatorMessage;
            } else {
                this.showEle = this.elevatorMessage.slice((this.currentPage-1)*10,this.currentPage*10);
            }
        }, 
        // 清除报错信息
        handleClose(){
            this.dialogVisible = false;
            this.errMsg="";
        },
        //修改表头样式
        getRowClass({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (rowIndex == 0) {
                return 'background: #f7f7f7;color:#101010;font-size:16px;font-weight:500;';
            } else {
                return 'background: #fff';
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.showEle = this.elevatorMessage.slice((val-1)*10,val*10);
        },
        handleDelete(index,row){	// 删除
			this.$confirm('是否将电梯删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
				}).then(() => {
                this.elevatorMessage.forEach((item,indexE) => {
                    if(row.id == item.id) {
                        this.elevatorMessage.splice(indexE,1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        return ;
                    }
                    return true;
                })
                this.closePage();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
        },
        flagTrue(){
            this.getSession();
        },
        handleEdit(index,row){   // 修改数据
            this.$refs.myChildEle.flagTrue(row.productCode,index + (this.currentPage -1) *10);
        },
         // 确认提交
        submit(){
            if(this.elevatorMessage.length==0){
                this.$message({
                    type: 'error',
					message: '请添加设备信息'
                })
                return
            }
            this.dialogVisible1 = true
            // this.$confirm('确认追加设备', '确认提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            // }).then(() => {
            //      this.confirmSubmit()
            // }).catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消'
            //     });          
            // }); 
        },
        async confirmSubmit(){
            let eleErrorList = this.elevatorVerify(this.elevatorMessage)
            if(eleErrorList.length != 0){
                this.eleErr(eleErrorList)
                return
            }
            const  ELEVATOR_TYPE_CODE9='2109';     // 电梯类型 客梯/直梯
            const  ELEVATOR_TYPE_CODE10='2110';     // 电梯类型 客梯/扶梯            
            let objKey = {
                "elevatorType":"S_O_000000",    // 电梯类型
                "elevatorSiteCode":"S_O_000001",    // 电梯使用场所
                "elevatorYear":"S_O_000002",    // 电梯使用年限
                "licenceNo":"S_O_000012",    // 电梯出厂编号
                "equipmentsCode":"S_O_000013",    // 电梯编号
                "useOfAddress":"S_O_000017",    // 电梯座落地址
                "useOfUnit":"S_O_000018",    // 电梯使用单位
                "weight":"S_O_000043",    // 直梯重量
                "height":"S_O_000044",    // 扶梯高度
                "areaCodeFirst":"S_O_000066",    // 电梯坐落地址省编码
                "areaCodeSecond":"S_O_000067",    // 电梯坐落地址市编码
                "areaCodeThird":"S_O_000068",    // 电梯坐落地址县编码
                "areaValueFirst":"S_O_000069",    // 电梯坐落地址省名称
                "areaValueSecond":"S_O_000070",    // 电梯坐落地址市名称
                "areaValueThird":"S_O_000071",    // 电梯坐落地址县名称

                // "elevatorLevelCode":"S_O_000034",    // 电梯安全评价等级
                // "testOrganization":"S_O_000086",    // 检测机构
                // "producerName":"S_O_000072",    // 生产商名称
                // "elevatorModel":"S_O_000074",    // 电梯型号
                // "isManaged":"S_O_000075",    // 有无专职人员管理
                // "字段名字":"S_O_000047",    // 维保星级
                // "字段名字":"S_O_000014",    // 基本险保费
                // "字段名字":"S_O_000015",    // 附加险保费
                // "字段名字":"S_O_000016",    // 总保费 
                // "字段名字":"S_O_000004",    // 投保规模
            }
            let data = []
            let elevatorMessage =JSON.parse(JSON.stringify(this.elevatorMessage)) 
            elevatorMessage.forEach(item=>{
                let obj = {
                    "attachments": [],
                    "code": "",
                    "endDate": "",
                    "extendList": [],   // 标的
                    "name": "",
                    "no": 0,
                    "startDate": "",
                    "type": "20"
                }
                for(let key in item){
                    if(key=='elevatorType'){
                        item.elevatorType = item.elevatorType==1? ELEVATOR_TYPE_CODE9:ELEVATOR_TYPE_CODE10; // 1 直梯 2 扶梯
                    }
                    if(objKey[key]){
                        obj.extendList.push({
                            "key": objKey[key],
                            "value": item[key]==null? "" :item[key]
                        })
                    }
                    
                }
                data.push(obj)
            })
            this.disabled = true
            let res = await this.productService.postElevatorSequel(this.$route.query.appCode,data)  
            if(res.code=='0000'){
                this.$message({
                    type: 'success',
                    message: '追加成功!'
                });
                this.closeURL()
                this.disabled = false;
                this.dialogVisible1 = false;
            }else{
                this.$message({
                    type:'error',
                    message:res.msg
                })
                this.disabled = false;
            }            
        },
        closeURL(){
            window.location.href="about:blank";
            window.close();
        },
        /**
         * 保费计算时校验重复电梯数据
         * @param {Array} productCode 
         */
        elevatorVerify(eleList = []) {
           let objList = eleList.concat(this.applicationEleList)
            let ele = []; 
            let map = new Map();
            objList.forEach(item=>{
                if(item.equipmentsCode){
                    if(map.has(item.equipmentsCode)){
                        ele.push(item.equipmentsCode)
                    }else{
                        map.set(item.equipmentsCode,'')
                    }
                }else if(item.licenceNo){
                    if(map.has(item.licenceNo)){
                        ele.push(item.licenceNo)
                    }else{
                        map.set(item.licenceNo,'')
                    }
                }
            })
            return ele
        },
        // 重复电梯保存信息
        eleErr(val){
            let msg = ""
            val.map(item=>{
                msg = msg+ `<p>设备编号：${item}电梯数据重复添加，请删除</p>`
            })
             this.$alert(msg,'错误信息提示', {
                dangerouslyUseHTMLString: true
            });
            return
        },
    }
}
</script>

<style scoped lang="less">
    #equipInfo {
        // border: 1px solid #ECECEC;
        .btn-group {
            padding: 20px 40px;
        }
        .el-button--warning {
            display: inline-block;
            font-size: 16px;
            color: #FFF;
            font-weight: 700;
            background-color: #d7a961;
            border-color: #d7a961;
            margin-right: 20px;
        }
        .el-button+.el-button {
            margin-left: 0px;
        }
        .upload-demo {
            display: inline-block;
        }
        .text-tip {
            color: #333333;
            font-size: 18px;   
            font-weight: 400;
        }
        .num-style {
            // color: #67A5EC;
            color: #ffa65f;
            font-size: 18px;
            padding: 0 10px;
        }
        .all-delete {
            cursor: pointer;
            font-size: 18px;
            color: #ff7150;
            font-weight: 400;
            // float: right;
        }
        .el-table {
            // border:1px solid #F0DFBF;
        }
        .tip-text {
            color: #FF604B;
            font-size: 16px;
            background-color: #FFFAF9;
            padding: 20px;
            .el-icon-warning {
                vertical-align: top;
                margin-top: 10px;
                font-size: 18px;
            }
            .tip-icon {
                display: inline-block;
                margin-left: 10px;
            }
            p {
                height: 40px;
                line-height: 40px;
                letter-spacing: 1px;
            }
        }
        .col-edit {
            color: #67A5EC;
        }
        .col-del {
            color: #666666;
        }

    }
    .red-col {
        color: #e51c23;
    }
    .line-he {
        line-height: 20px;
    }
    .ts-download{
        display: inline-block;
        cursor: pointer;
        span{
            vertical-align: middle;
        }
    }
    .ts-shebei{
        display: inline-block;
        padding-left: 30px;
        height: 40px;
        line-height: 40px;
        color:#00c699;
        border-radius: 8px;
        img{
            width: 20px;
            height: 20px;
        }
        span{
            font-size: 14px;
        }
    }
    .btm-btn {
        text-align: center;
        padding-bottom: 80px;
        .el-button {
            padding: 15px 65px;
        }
        .el-button+.el-button {
            margin-left: 30px;
        }
    }
</style>
<style scoped>
.ts-border{
    /* border-bottom: 1px solid #ECECEC;  */
    margin: 0 10px;
}
.ts-split{
    height: 5px;
    background-color: #F8F8F8;
}
.orange-div {
    height: 17px;
    width: 7px;
    background-color: #d4b46f;
    display: inline-block;
    margin-right: 6px;
    margin-left: 20px;
}
.ts-insure-title{
    width: 100%;
    display: inline-block;
    height: 60px;
    color: #666;
    font-size: 20px;
    line-height: 60px;
    font-weight: 600;
}
.f500 {
    font-weight: 500;
    cursor: pointer;
}
.ts-pagination{
   text-align: right;
   margin-right: 20px;
}
</style>