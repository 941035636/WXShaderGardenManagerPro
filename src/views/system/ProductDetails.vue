<template>
    <div id="productDetails">
        <div class="product-title">
            <p class="title-left">产品配置详情</p>
            <p class="title-right cur-po" @click="getHistory">历史版本</p>
        </div>
        <div class="edit-top">
            <span class="col-orange"><span class="col-orange-bor"></span>产品信息</span>
        </div>
        <div class="product-content">
            <el-row>
                <el-col :span="12">产品名称：{{prodDeatils.productName}}（{{prodDeatils.productCode}}）</el-col>
                <el-col :span="12">产品编码：{{prodDeatils.productCode}}</el-col>
            </el-row>
            <el-row class="mt15">
                <el-col :span="12">产品类型：{{prodDeatils.productTypeName}}</el-col>
                <el-col :span="12">上架时间：{{prodDeatils.addTime}}</el-col>
            </el-row>
            
            <el-row class="mt15">
                <el-col :span="12">行业分类：{{prodDeatils.tradeCategory1Name}} / {{prodDeatils.tradeCategory2Name}}</el-col>
                <el-col :span="12">出单公司：{{prodDeatils.companyName}}</el-col>
            </el-row>
            <el-row class="mt15">
                <el-col :span="12">标的类型：{{prodDeatils.insSubjectType }}</el-col>
                <el-col :span="12">业务类型：{{prodDeatils.internetName}} / {{prodDeatils.businessTypeName}}</el-col>
            </el-row>
            <el-row class="mt15">
                <el-col :span="12">业务归属：{{prodDeatils.branchName}}</el-col>
                <el-col :span="12">业务地区：{{prodDeatils.provinceName}}{{prodDeatils.cityName}}{{prodDeatils.countryName}}</el-col>
            </el-row>
            <el-row class="mt15">
                <el-col :span="12">业务终端：<span v-for="(item,index) in prodDeatils.bizEndpoint" :key="index">{{item}}<span v-if="index!=prodDeatils.bizEndpoint.length-1">、</span></span></el-col>
                <el-col :span="12">结算类型：{{prodDeatils.settlementType}}</el-col>
            </el-row>
            <el-row class="mt15">
                <el-col :span="12">更新时间：{{prodDeatils.updateTime}}</el-col>
                <el-col :span="12">更新操作人：{{prodDeatils.updaterName}}</el-col>
            </el-row>
            <el-row class="mt15">
                <el-col :span="12">状态：<span v-if="prodDeatils.state == '1'" class="col-gre">上架</span><span v-else class="col-red">下架</span></el-col>
            </el-row>
            <el-row class="mt15">
                <div class="label-box">
                    标签：
                    <p class="label-box-item" v-for="(item,index) in prodDeatils.tags" :key="index+item">
                        <span>{{item}}</span>
                    </p>
                </div>
            </el-row>
        </div>
        <div class="edit-top">
            <span class="col-orange"><span class="col-orange-bor"></span> 属性数据</span>
        </div>
        <div class="product-attribute">
            <div class="content mt15" v-for="(item,key) in data" :key="key">
                <h2 class="content-title">{{item.title}}</h2>
                <ul class="content-head bgc-grey">
                    <li class="li-one">描述</li>
                    <li class="li-two">key</li>
                    <li class="li-three">value</li>
                </ul>
                <ul class="content-head border-top-none" v-for="(item1,key1) in item.children" :key="key1">
                    <li class="li-one">{{item1.describe}}</li>
                    <li class="li-two">{{item1.key}}</li>
                    <li class="li-three">{{item1.value}}</li>
                </ul>
            </div>
            <div class="content mt15" v-for="item in data1" :key="item.value">
                <h2 class="content-title">{{item.title}}</h2>
                <ul class="content-head bgc-grey">
                    <li class="li-one">描述</li>
                    <li class="li-two">key</li>
                    <li class="li-three">value</li>
                </ul>
                <ul class="content-head border-top-none" v-for="(item1,key1) in item.children" :key="key1">
                    <li class="li-one">{{item1.describe}}</li>
                    <li class="li-two">{{item1.key}}</li>
                    <li class="li-three">{{item1.value}}</li>
                </ul>
            </div>
            <div class="content mt15" v-for="item in data2" :key="item.value">
                <h2 class="content-title">{{item.title}}</h2>
                <ul class="content-head bgc-grey">
                    <li class="li-one">描述</li>
                    <li class="li-two">key</li>
                    <li class="li-three">value</li>
                </ul>
                <ul class="content-head border-top-none" v-for="(item1,key1) in item.children" :key="key1">
                    <li class="li-one">{{item1.describe}}</li>
                    <li class="li-two">{{item1.key}}</li>
                    <li class="li-three">{{item1.value}}</li>
                </ul>
            </div>
        </div>
        <history ref="history"></history>
    </div>
</template>

<script>
import attribute from '../../../static/data/attribute.json'
import attributeJX from '../../../static/data/attributeJX.json'
import attributeTS from '../../../static/data/attributeTS.json'
import history from './components/History'
import ProductConfig from '@/service/ProductConfig.js';
import selectData from '../../../static/data/channel.json'
export default {
    name: "ProductDetails",
    props: {
    },
    data() {
        return {
            selectData:selectData,
            hYCategory:selectData.hYCategory,
            ProductConfig: new ProductConfig(),
            dialogTableVisible: false,
            data:[],
            prodDeatils:{},
            data1:[],
            data2:[],
            showJX: false,
            showTS: false,
            options1:[
				{
					value:1,
					label:'线上出单'
				},
				{
					value:2,
					label:'线下出单'
				},
				{
					value:3,
					label:'线下传统业务'
				},
			],
            options2:[
				{
					value:1,
					label:'全国产品'
				},
				{
					value:2,
					label:'地方示范项目'
				},
				{
					value:3,
					label:'地方特色方案'
				},
			],
			options3:[
				{
					value:1,
					label:'互联网'
				},
				{
					value:0,
					label:'非互联网'
				},
			],
        };
        
    },
    components: {
        history
    },
    created() {
        this.getProductDetails()
    },
    mounted() {
        // this.initRole()
        this.data = attribute.find(item=>item.category == this.$route.query.prodType).data
        this.data1 = attributeJX;
        this.data2 = attributeTS;
    },
    methods: {
        async getProductDetails() {
            let res = await this.ProductConfig.getProductDetails(this.$route.query.id)
            if(res.code === '0000') {
                this.prodDeatils = res.data
                this.prodDeatils.tags = res.data.tags || []
                this.prodDeatils.updateTime = this.prodDeatils.updateTime || this.prodDeatils.createTime
                this.prodDeatils.updaterName = this.prodDeatils.updaterName || this.prodDeatils.createrName
                this.prodDeatils.businessTypeName = this.options1.find(i=> i.value == res.data.businessType) ? this.options1.find(i=> i.value == res.data.businessType).label : '';
                this.prodDeatils.internetName = this.options3.find(i=> i.value == res.data.internet) ? this.options3.find(i=> i.value == res.data.internet).label : '';
                this.prodDeatils.companyName = selectData.companyList.find(i=> i.value == res.data.issueCompany) ? selectData.companyList.find(i=> i.value == res.data.issueCompany).label : ''
                this.prodDeatils.productTypeName = this.options2.find(i=> i.value == res.data.productType) ? this.options2.find(i=> i.value == res.data.productType).label : ''
                this.prodDeatils.tradeCategory1Name = this.hYCategory.find(i=> i.value == res.data.tradeCategory1) ? this.hYCategory.find(i=> i.value == res.data.tradeCategory1).label : ''
                let fl2 = this.hYCategory.find(i=> i.value == res.data.tradeCategory1) ? this.hYCategory.find(i=> i.value == res.data.tradeCategory1).children : [];
                this.prodDeatils.tradeCategory2Name = fl2.find(i=> i.value == res.data.tradeCategory2) ? fl2.find(i=> i.value == res.data.tradeCategory2).label : ''
                this.getConfigDetails(this.prodDeatils.id)
                this.getConfigDetailsJX(this.prodDeatils.id)
                this.getConfigDetailsTS(this.prodDeatils.id)
            }
        },
        async getConfigDetails(id){
            let res = await this.ProductConfig.getConfigDetails(id,'TB')
            if (res.code === '0000') {
                let content = JSON.parse(res.data.content)
                this.data.forEach(item=>{
                    item.children.forEach(item1=>{
                        item1.value = content[item1.key]
                    })
                })
            }
        },
        async getConfigDetailsJX(id){
            let res = await this.ProductConfig.getConfigDetails(id,'JX')
            if (res.code === '0000') {
                let content = JSON.parse(res.data.content)
                this.data1.forEach(item=>{
                    item.children.forEach(item1=>{
                        if(item1.key == 'qmyxRatio') {
                            item1.value = content[item1.key]*100 +'%'
                        } else {
                            item1.value = content[item1.key]
                        }
                    })
                })
                this.showJX = true;
            } else {
                this.data1 = [];
                this.showJX = false;
            }
        },
        async getConfigDetailsTS(id){
            let res = await this.ProductConfig.getConfigDetails(id,'TS')
            if (res.code === '0000') {
                let content = JSON.parse(res.data.content)
                this.data2.forEach(item=>{
                    item.children.forEach(item1=>{
                        item1.value = content[item1.key]
                    })
                })
                this.showTS = true;
            } else {
                this.data2 = [];
                this.showTS = false;
            }
        },
        getHistory() {
            this.$refs.history.initData(this.prodDeatils.id) 
        }
    },
};
</script>

<style lang="less">
#productDetails {
    .product-title {
        margin-top: 10px;
        height: 59px;
        line-height: 59px;
        background-color: #fff;
        padding: 0 25px;
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        .product-title {
            color: #101010;
        }
        .title-right {
            color: #FA8C16;
        }
    }
    .edit-top {
        border-bottom: 1px solid #E8E8E8;
        background-color: #fff;
        margin-top: 10px;
        .col-orange {
            padding: 15px 0px;
            margin-left: 15px;
			line-height: 30px;
			vertical-align: middle;
			color: #666666;
			font-size: 18px;
			display: inline-block;
			color: #000;
			.col-orange-bor {
				border-left: 6px solid #FFC069;
				height: 100%;
				display: inline-block;
				width: 2px;
				height: 22px;
				margin-right: 10px;
				vertical-align: middle;
				margin-left: 20px;
			}
        }
	}
    .product-content {
        background-color: #fff;
        padding: 10px 50px;
        font-size: 14px;
        color: #101010;
    }
    .product-attribute {
        background-color: #fff;
        padding: 10px 50px;
        margin-bottom: 60px;
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
    
    .cur-po {
		cursor: pointer;
	}
    .label-box {
        .label-box-item {
            height: 30px;
            line-height: 30px;
            display: inline-block;
            margin-right: 10px;
            border: 1px solid #FA8C16;
            color: #010101;
            padding: 0 10px;
            border-radius: 5px;
        }
    }
}

</style>
