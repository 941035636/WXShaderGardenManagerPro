<template>
    <el-dialog id="InsureAttribute" title="属性配置" width="50%" :visible.sync="dialogTableVisible"  @close="close" destroy-on-close :close-on-click-modal="false">
        <!-- 投保人列表 -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">属性</el-menu-item>
            <el-menu-item index="2">代码</el-menu-item>
        </el-menu>
        <div v-if="activeIndex == '1'" class="mt10">
            <el-form ref="dialogForm" :model="dialogForm" :rules="rules" label-width="90px">
                <div class="content mt10" v-for="(item,key) in dialogForm.data" :key="key">
                    <div class="content-flex">
                        <h2 class="content-title">{{item.title}}</h2>
                        <el-switch
                            v-model="item.value"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="启用"
                            inactive-text="关闭">
                        </el-switch>
                    </div>
                    <div v-if="item.value">
                        <ul class="content-head bgc-grey">
                            <li class="li-one">描述</li>
                            <li class="li-two">key</li>
                            <li class="li-three">value</li>
                        </ul>
                        <ul class="content-head border-top-none" v-for="(item1,key1) in item.children" :key="key1">
                            <li class="li-one">{{item1.describe}}</li>
                            <li class="li-two">{{item1.key}}</li>
                            <li class="li-three">
                                <el-form-item :prop="'data.'+key+'.children.'+key1+'.value'" :rules="[
                                    { required: true, message: '请输入内容', trigger: 'blur' }
                                ]">
                                    <el-input v-model="item1.value" placeholder="请输入内容" size="small"></el-input>
                                </el-form-item>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-form>
        </div>
        <div v-if="activeIndex == '2'" class="mt10">
            <p style="cursor: pointer;color: #1890FF">
                <i class="el-icon-document-copy"></i>
                <span @click="shareCopy()">复制代码</span>
            </p>
            <div class="yaml-editor">
                <pre>{{jsonData}}</pre>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button round size="medium" type="info" @click="close">取 消</el-button>
            <el-button type="warning" size="medium" round @click="submit">确认提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
import attribute from '../../../../static/data/attribute.json'
import ProductConfig from '@/service/ProductConfig.js'
export default {
    name: "InsureAttribute",
    props: {},
    data() {
        return {
            ProductConfig: new ProductConfig(),
            dialogTableVisible: false,
            activeIndex:'1',
            dialogForm: {
                data:[],
                configType:"",
                id:"",
                productId:"",
            },
            rules: {
                value:[{
                    required: true, message: '请输入名称', trigger: 'blur'
                }]
            },
            jsonData:JSON.stringify({},null,4),
            yamlEditor:false,
        };
    },
    computed: {
        
    },
    mounted() {
        // this.initRole()
        
    },
    methods: {
        async initData(obj,configType,flag) {
            this.dialogForm.data = JSON.parse(JSON.stringify(attribute.find(item=>item.category == obj.productTypeCode).data))
            this.dialogForm.configType = configType
            this.dialogForm.productId = obj.id
            console.log(obj,configType,flag);
            // 如果配置过属性
            if(obj.configFlag && flag === 'UPDATE') { 
                let config = JSON.parse(obj.configFlag)
                let res = await this.ProductConfig.getConfigDetails(obj.id,'TB')
                if (res.code === "0000") {
                    this.dialogForm.id = res.data.id
                    let content = JSON.parse(res.data.content)
                    this.dialogForm.data.forEach(item=>{
                        if(content[item.key] !== undefined) {
                            item.value = content[item.key]
                        } else {
                            item.value = true
                        }
                        item.children.forEach(item1=>{
                            item1.value = content[item1.key]
                        })
                    })
                    this.jsonData = JSON.stringify(content,null,4) 
                }
            }
            this.dialogTableVisible = true
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.activeIndex = key
        },
        // 选中产品分类
        changeCategory(e) {
            console.log(e);
        },
        // 选中产品
        chooseProduct() {

        },
        clear() {
            this.dialogTableVisible = false
            this.$nextTick(() => {
                this.$refs["dialogForm"].resetFields();
            });
            
        },
        close() {
            this.clear();
        },
        submit() {
            this.$refs["dialogForm"].validate(async (valid) => {
                if (valid) {
                    let content = {}
                    this.dialogForm.data.forEach(item=>{
                        content[item.key] = item.value
                        if(item.value) {
                            item.children.forEach(item1=>{
                                content[item1.key] = item1.value
                            })
                        }
                    })
                    let data = {
                        "configType": this.dialogForm.configType,
                        "content": JSON.stringify(content),
                        "createrCode": window.sessionStorage.getItem('userCode'),
                        "createrName": window.sessionStorage.getItem('userName'),
                        "id": this.dialogForm.id,
                        "productId": this.dialogForm.productId,
                    }
                    let res = await this.ProductConfig.addConfig(data)
                    if(res.code === '0000') {
                        this.clear()
                        this.$emit('successCallback')
                    }
                } else {
                return false;
                }
            });
            return;
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
		}
    },
};
</script>

<style lang="less">



#InsureAttribute{
    .w280 {
        width: 280px;
    }
    .content {
        .bgc-grey {
            background-color: #F5F5F5;
        }
        .content-flex {
            display: flex;
            justify-content: space-between;
        }
        .content-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .content-head {
            display: flex;
            border: 1px solid #ccc;
            li {
                padding: 5px;
                line-height: 40px;
            }
            .li-one {
                width: 30%;
                box-sizing: border-box;
                padding-left: 5px;
            }
            .li-two {
                width: 25%;
                border-left: 1px solid #ccc;
                border-right: 1px solid #ccc;
                box-sizing: border-box;
                padding-left: 5px;
            }
            .li-three {
                width: 45%;
                box-sizing: border-box;
                padding-left: 5px;
            }
            .el-form-item {
                margin-bottom: 0;
                .el-form-item__content {
                    margin-left: 0 !important;
                }
            }
        }
        .border-top-none {
            border-top: none;
        }
    }
}
</style>
<style scoped>
.yaml-editor{
    margin-top: 10px;
	min-height: 400px;
	border: 1px solid #eaeaea;
	box-sizing: border-box;
    color: #CB6F5C;
    padding: 20px;
}
</style>