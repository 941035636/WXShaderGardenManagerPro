<template>
    <el-dialog title="添加产品" width="50%" :visible.sync="dialogTableVisible"  @close="close" destroy-on-close :close-on-click-modal="false">
        <div id="history">
            <div class="history-left">
                <p :class="{'ml10 mr10 flex pb10 pt10 curser':true,'bac-ccc':item.id==currentData.id}  " v-for="(item,key) in list" :key="key" @click="changeCurrent(item)">
                    <span>{{item.createTime}}</span>
                    <span class="col-blue" v-if="key==0">当前</span>
                </p>
            </div>
            <div class="history-right">
                <el-row class="mt10">
                    <el-col :span="12">模块名称：{{$route.query.productName}}</el-col>
                    <el-col :span="12">版本编号：{{currentData.id}}</el-col>
                </el-row>
                <el-row class="mt10">
                    <el-col :span="12">操作人：{{currentData.createrName}}</el-col>
                    <el-col :span="12">操作时间：{{currentData.createTime}}</el-col>
                </el-row>
                <div class="mt10">
                    <p style="cursor: pointer;color: #1890FF">
                        <i class="el-icon-document-copy"></i>
                        <span @click="shareCopy()">复制代码</span>
                    </p>
                    <div class="yaml-editor">
                        <pre>{{jsonData}}</pre>
                    </div>
                </div>
                <el-button class="mt20" type="primary" @click="recovery">恢复</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import ProductConfig from '@/service/ProductConfig.js';
export default {
    name: "History",
    props: {},
    data() {
        return {
            dialogTableVisible: false,
            radio:'',
            jsonData:{},
            list:[],
            currentData:{},
            ProductConfig: new ProductConfig()
        };
    },
    computed: {
        
    },
    mounted() {
        // this.initRole()
    },
    methods: {
        async initData(id) {
            let data = {productId:id}
            let res = await this.ProductConfig.getProdConfigList(data)
            try {
                if (res.code === '0000') {
                    this.list = res.list
                    let content = JSON.parse(res.list[0].content)
                    this.currentData = res.list[0]
                    this.jsonData = JSON.stringify(content,null,4) 
                    this.dialogTableVisible = true
                } 
            } catch (e) {
                this.$message.error('出错了')
                console.log(e)
            }
            
        },
        // 选中当前属性
        changeCurrent(val) {
            this.currentData = val
            let content = JSON.parse(val.content)
            this.jsonData = JSON.stringify(content,null,4) 
        },
        clear() {
            this.dialogTableVisible = false
        },
        close() {
            this.clear();
        },
        shareCopy() {
			let oInput = document.createElement('input');
			oInput.value = this.jsonData;
			document.body.appendChild(oInput);
			oInput.select(); // 选择对象;
			document.execCommand("Copy"); // 执行浏览器复制命令
			this.$message({
				message: '复制成功',
				type: 'success'
			});
			oInput.remove()
		},
        // 恢复接口
        async recovery(){
            let data = {
                "configType": this.currentData.configType,
                "content": this.jsonData,
                "createrCode": window.sessionStorage.getItem('userCode'),
                "createrName": window.sessionStorage.getItem('userName'),
                "id": "",
                "productId": this.currentData.productId,
            }
            let res = await this.ProductConfig.addConfig(data)
            if(res.code==='0000') {
                this.close()
            }
        }
    },
};
</script>

<style lang="less">
#history {
    display: flex;
    .history-left {
        width: 26%;
        background-color: #F7F7F7;
        padding: 10px 0;
        .flex {
            display: flex;
            justify-content: space-between;
        }
    }
    .history-right {
        margin-left: 2%;
        width: 72%;
        .yaml-editor{
            margin-top: 10px;
            min-height: 400px;
            border: 1px solid #eaeaea;
            box-sizing: border-box;
            color: #CB6F5C;
            padding: 20px;
        }
    }

}
.w280 {
    width: 280px;
}
.el_radio {
    margin-top: 10px;
    margin-left: 0 !important;
    margin-right: 10px !important;
}
.col-blue {
    color: #096dd9;
}
.bac-ccc {
    background-color: #ccc;
}

</style>
