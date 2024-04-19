<template>
    <el-dialog id="Achievements" title="属性配置" width="50%" :visible.sync="dialogTableVisible"  @close="close" destroy-on-close :close-on-click-modal="false">
        <h2 class="col-org">{{dialogForm.productName}}({{dialogForm.productCode}})</h2>
        <!-- 投保人列表 -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">属性</el-menu-item>
        </el-menu>
        <div v-if="activeIndex == '1'" class="mt10">
            <el-form ref="dialogForm" :model="dialogForm" :rules="rules" label-width="90px">
                <div class="content mt10" v-for="(item,key) in dialogForm.data" :key="key">
                    <h2 class="content-title">{{item.title}}</h2>
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
                                { required: false,message: '请输入内容', trigger: 'blur' },
                                { min:2,max: 300, message: '长度为2-300位', trigger: 'blur'}
                            ]">
                                <el-input v-model="item1.value" placeholder="请输入内容" size="small"></el-input>
                            </el-form-item>
                        </li>
                    </ul>
                </div>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button round size="medium" type="info" @click="close">取 消</el-button>
            <el-button type="warning" size="medium" round @click="submit">确认提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
import attributeTS from '../../../../static/data/attributeTS.json'
import ProductConfig from '@/service/ProductConfig.js'
export default {
    name: "Achievements",
    props: {},
    data() {
        var litigationMoney = (rule, value, callback) => {
			const litigationMoneyReg = /^\d+(\.\d{0,2})?$/
			if (!value) {
			return callback(new Error("请填写全面营销人员分配比例"))
			}
			if (value < 0 || value > 100) {
			return callback(new Error("绩效比例为0-100"))
            }
			setTimeout(() => {
				if (litigationMoneyReg.test(value)) {
					callback()
				} else {
					callback(new Error("绩效比例保留小数点后两位"))
				}
			}, 100)
		};
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
            yamlEditor:false,
            achVal:'',
            litigationMoney:litigationMoney
        };
    },
    computed: {
        
    },
    mounted() {
        // this.initRole()
        
    },
    methods: {
        async initData(obj,configType,flag) {
            this.dialogForm.data = attributeTS
            this.dialogForm.configType = configType
            this.dialogForm.productId = obj.id
            this.dialogForm.productName = obj.productName
            this.dialogForm.productCode = obj.productCode
            // 如果配置过属性
            if(obj.configFlag && flag === 'UPDATE') { 
                let res = await this.ProductConfig.getConfigDetails(obj.id,'TS')
                if (res.code === "0000") {
                    this.dialogForm.id = res.data.id
                    let content = JSON.parse(res.data.content)
                    this.dialogForm.data.forEach(item=>{
                        item.children.forEach(item1=>{
                            item1.value = content[item1.key]
                        })
                    })
                }
            } else {
                this.dialogForm.data.forEach(item=>{
                    item.children.forEach(item1=>{
                        item1.value = ''
                    })
                })
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
                        item.children.forEach(item1=>{
                            content[item1.key] = item1.value
                        })
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
                        this.$message.success('操作成功！');
                        this.$emit('successCallback')
                    }
                } else {
                return false;
                }
            });
            return;
        },
    },
};
</script>

<style lang="less">



#Achievements{
    .col-org {
        color: #d46b08;
    }
    .w280 {
        width: 280px;
    }
    .content {
        .bgc-grey {
            background-color: #F5F5F5;
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