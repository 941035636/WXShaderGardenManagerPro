<template>
    <div id="personInfo">
        <Title title="投保人员信息" class="pb20"></Title>
        <div class="pb20 ml70">
            <div class="mt20 mb20 title-style">
                <p>点击下载表格模板 <span class="text-style" @click="downloadModal">被保险人员清单</span> 填写后上传！</p>
                <p class="second-p">单条录入投保人员信息</p>
            </div>
            <div class="upload-file">
                <el-upload
                    class="upload-demo"
                    drag
                    :action="upLoadUrl"
                    :on-success='upLoadSuccess'
                    :show-file-list='false'
                    accept=".xlsx , .xls">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text"><em>点击上传</em></div>
                </el-upload>
                <img src="../../../../assets/images/sigle-input.png" alt="" @click="addPerson()">
            </div>
            <div class="ts-ele-scheme pl10 pb10 mt30">
                您已成功添加  <span class="ts-ele-length">{{perisonNum}}人</span> 至您的投保单
                <span class="ml10" @click="importPerson()">查看 | 修改</span>
                <span class="ml10" @click="clearPerson">清空</span>
            </div>           
        </div>
        <AddPerson ref="myChildPer"></AddPerson>
        <ImportManList ref="ImportManList"></ImportManList>
    </div>
</template>
<script>
import UserService from '@/service/UserService';
import productService from '@/service/ProductService'
import AddPerson from '../AddPerson';
import ImportManList from '../ImportManList';
import Title from '../Title';

export default {
    components:{
        AddPerson,ImportManList,Title
    },
    data(){
        return{
            upLoadUrl: process.env.ROOT_TESHE + '/api/v1/templateImport/addUserExcel?productCode=TSUSER',
            personList: [],
            productService: new productService(),
            UserService: new UserService(),
            eleFlag: false,
            perisonNum: 0
        }
    },
    created() {
        this.computedPerson();
    },
    methods: {
        async downloadModal() {
            const params = await this.productService.download('TSUSER','2');
            let {code,msg} = params;
            if(code=='0000') {
                window.location.href = msg;
            }
        },
        importPerson(list) {
            if(list) {
                this.$refs.ImportManList.flagTrue(list)
            } else {
                let session = JSON.parse(window.sessionStorage.getItem('personList'));
                this.$refs.ImportManList.flagTrue(session)
            } 
        }, 
        addPerson(){
            this.$refs.myChildPer.flagTrue()
            this.eleFlag = true;
        }, 
        //上传文件
        upLoadSuccess(file, fileList) {
           let {code} =file
           if(code=='0000'){
                this.$message({
                    message: '导入成功！',
                    type: 'success'
                });
               let oldList = JSON.parse(window.sessionStorage.getItem('personList'));
               let newList;
               if(oldList) {
                   newList = oldList.concat(file.list);
               } else {
                   newList = file.list;
               }
               window.sessionStorage.setItem('personList',JSON.stringify(newList));
               this.computedPerson();
           }else{
                this.$alert(file.msg, '错误信息', {
                    dangerouslyUseHTMLString: true
                });
           }
        },
        computedPerson() {
            this.personList = JSON.parse(window.sessionStorage.getItem('personList'));
            if(this.personList) {
                this.perisonNum = this.personList.length;
            }
        },
        getPersonInfo() {
            if(this.personList) {
                if(this.personList.length != 0) {
                    for(let i = 0; i < this.personList.length; i ++) {
                        this.personList[i].no = i;
                    }
                } else {
                    this.$message({
                        message: '请添加投保人员信息！',
                        type: 'error'
                    });
                }
            } else {
                this.$message({
                    message: '请添加投保人员信息！',
                    type: 'error'
                });
            }
            return this.personList; 
        },
        getPersonInfoNoVal() {
            return this.personList; 
        },
        clearPerson() {
            let that = this;
            this.$confirm('是否清空投保人员信息?', '删除数据', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
                window.sessionStorage.removeItem('personList');
                this.perisonNum = 0;
				this.$message({
					type: 'success',
					message: '清空成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消清空!'
				});          
			});
        }
    }
}
</script>
<style lang="less" scoped>
    #personInfo {
        .ml70 {
            margin-left: 70px;
        }
        .f700 {
            font-weight: 700;
        }
        .ts-ele-btn{
            background-color: #cd9d51;
            height: 25px;
        }
        .ts-ele-scheme .ts-ele-length{
            font-weight: 700;
            color: #f74f50;
        }
        .upload-demo  {
            display: inline;
        }
        .ml10 {
            margin-left: 40px;
            color: #0198ef;
            cursor: pointer;
        }
        .upload-file {
            text-align: center;
            img {
                height: 180px;
                width: 420px;
                margin-top: -174px;
                margin-left: 190px;
                cursor: pointer;
                margin-right: 70px;
            }
        }
        .title-style {
           p {
               display: inline-block;
               margin-left: 84px;
               .text-style {
                   color: #1581e8;
                   border-bottom: 1px solid #1581e8;
               }
           } 
           .second-p {
               margin-left: 380px;
           }
        }
    }
</style>
<style>
    .el-upload-dragger {
        width: 440px;
    }
</style>



