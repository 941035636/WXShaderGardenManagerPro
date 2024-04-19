<template>
	<div class="policy-content" id="policyGJ">
        <div class="policy-title">
            <span>投保轨迹</span>
        </div>
        <el-row type="flex" class="row-bg">
            <el-col :span="24">
                <el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="getRowClass1">
                    <el-table-column label="操作编号" width="250">
                        <template slot-scope="scope">
                            <p><span>{{scope.row.dc}}</span></p>
							<p v-if="scope.row.dc1"><span>{{scope.row.productName}}</span></p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作信息">
                        <template slot-scope="scope">
                            <p><span>{{scope.row.createTime}}</span><span class="ts-style" v-if="scope.row.term == '1'">特设保</span><span class="ts-style" v-else>电梯智保</span></p>
                            <p><span v-if="scope.row.un">{{scope.row.un}}</span><span v-if="scope.row.uc">({{scope.row.uc}})</span></p>
                            <p><span>{{scope.row.opIp}}</span><span>/{{scope.row.termVer}}</span></p>
                            <p v-if="scope.row.oc">流水号：<span>{{scope.row.oc}}</span></p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="taxpayerName" label="业务类型" width="220">
                        <template slot-scope="scope">
                            <p>
                                <span>{{scope.row.opTypeName}}</span>
                            </p>
                            <p>
                                <span>{{scope.row.opNodeName}}</span><span> / {{scope.row.opNameName}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作详情">
                        <template slot-scope="scope">
                            <div style="padding:15px 10px;box-sizing: border-box;" class="show-tip">
                                <p :title="scope.row.opDetail"><span>{{scope.row.opDetail}}</span></p>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mt20" style="text-align: right;">
                    <el-pagination background  @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"> </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import moment from 'moment';
import {Insurance} from '../../../server/accidenServer.js';
import ProductService from '../../../service/ProductService.js';
import configData from '../../accidenManagement/data/track-config.json'
import productConfig from '../../businessProcessing/data/productClassification.json'
export default {
	name:'PolicyDetailGJ',
	props:{
	},
	data() {
		return {
			currentPage:1,
            pageSize:10,
            total:0,
            data1:[],
            configData:configData,
			productConfig:productConfig.data2,
			applicantClass:new Insurance(),
            where:'',
            options3:[],
            ProductService: new ProductService(),
		};
	},
	computed: {
		
	},
	created() {
        // if(this.data1.length == 0) {
        //     Promise.all([this.getProductList()]).then((res)=> {
        //         this.getInsurance(true);
        //     })
        // }
        // this.getProductList()
		// this.getInsurance(true);
	},
	methods: {
        initData() {
            if(this.data1.length == 0) {
                Promise.all([this.getProductList()]).then((res)=> {
                    this.getInsurance(true);
                })
            }
        },
		getRowClass1({ row, column, rowIndex, columnIndex }) {
			if (rowIndex == 0) {
				return "color:#101010;font-weight: 600;background-color:#e8e8e8;";
			} else {
				return "";
			}
		},
        whereFormat(whereStr) {
			let Base64 = require('js-base64').Base64
			let code = Base64.encode(whereStr)
			// let md5Password = this.$md5(whereStr);
			let passArray = code.split('');
			for(let i = 1; i < passArray.length; i+=2) {
				let temporary = passArray[i];
				passArray[i] = passArray[i-1];
				passArray[i-1] = temporary;
			}
			let totalNumber = 0;
			let result = passArray.join('')+totalNumber;
			return result;
		},
        async getInsurance(flag){
            let data = {};
			if(flag) {
                this.where="dc='" + this.$route.query.appCode + "'";
                data = {
                    pn:1,
                    ps:1,
                    where:this.whereFormat(this.where),
                    orderType: 'desc',
                    orderField:'createTime'
                };
            } else {
                data = {
                    pn:this.currentPage,
                    ps:this.pageSize,
                    where:this.whereFormat(this.where),
                    orderType: 'desc',
                    orderField:'createTime'
                };
            }
			let params = await this.applicantClass.getInsurance(data);
			if(params.code == '0000' && params.list.length != 0) {
                if(!flag) {
                    this.datas = params.data;
                    this.total = params.total;
                    this.data1 = params.list
                    this.data1.map(item => {
                        item.opTypeName = this.configData.opType.find(subItem => subItem.value == item.opType) ? this.configData.opType.find(subItem => subItem.value == item.opType).label : ''
                        item.opNameName = this.configData.opName.find(subItem => subItem.value == item.opName) ? this.configData.opName.find(subItem => subItem.value == item.opName).label : ''
                        item.opNodeName = this.configData.opNode.find(subItem => subItem.value == item.opNode) ? this.configData.opNode.find(subItem => subItem.value == item.opNode).label : ''
                        item.productName = this.options3.find(subItem => subItem.code == item.dc1) ? this.options3.find(subItem => subItem.code == item.dc1).name : '' ;
                    })
                } else {
                    let time = new Date(params.list[0].createTime);
                    let startD = moment(time.setHours(time.getHours() - 1)).format("YYYY-MM-DD HH:mm:ss"); 
                    let endD = moment(new Date(params.list[0].createTime).getTime() + 1000).format("YYYY-MM-DD HH:mm:ss");  
                    this.where = "uc='" + params.list[0].uc +"'and createTime>'" + startD +"'and createTime<'" + endD + "'";
                    console.log(this.where)
                    this.getInsurance(false);
                }
			}
		},
        async getProductList(){ // 获取产品列表
			let provinceCode = '';
			if(sessionStorage.getItem('branchCode') == 'JT0000'){
				provinceCode = ['000000']
			}else{
				provinceCode = sessionStorage.getItem('authDataArea').split(',')
			}
			let data = {
				'areaCodeList':provinceCode,
				'channel':'sequip',
				'pn':1,
				'ps':1000,
                'needDetails':"0"
			};
			let res = await this.ProductService.getProductListV3(data);
			if(res.code == '0000' && res.list){
				res.list.forEach(item => {
					let obj = {
						code: item.code,
						name: item.name,
					}
					this.options3.push(obj);
				})
			}
		},
        handleCurrentChange: function(pageNum){
			this.currentPage = pageNum;
			this.getInsurance(false);
		},
		
	}
};
</script>

<style lang="less">
#policyGJ {
    .ts-style {
		background-color: #b5f5ec;
		border: none;
		border-radius: 19px;
		padding: 2px 10px;
		margin-left: 10px;
	}
    .show-tip {
		// width:500px;
		overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:4;  /* 设置行数 */
		-webkit-box-orient: vertical;
		height: 130px;
		color: #fa8c16;
	}
}
    
</style>
