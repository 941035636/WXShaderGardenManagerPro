<template>
	<div class="editDialog" id="editDialog">
        <el-dialog title="修改" :visible.sync="outerVisible" :before-close="close">
            <div class="content-dialog">
                <div class="content1-dialog">
                    <p class="item1">保单信息：</p>
                    <div class="item2">
                        <el-row>
                            <el-col :span="10">
                                <p><span class="item3">客户名称：</span><span class="item4">{{data2.policyHolder}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span class="item3">保单号：</span><span class="item4">{{data2.policyNo}}</span></p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <p><span class="item3">实收保费：</span><span class="item4" style="color:#FF3000">{{data2.premium}}</span> 元</p>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <p style="border:1px dashed #ccc"></p>
                <div class="content1-dialog">
                    <p class="item1">修改信息：</p>
                    <div class="updataPremium">
                        <div class="updataPremium-title"><p class="item3">名称</p> <p>数值</p></div>
                        <div class="updataPremium-content" style="display:flex;"><p class="item3">发放月份</p> <p><el-date-picker v-model="data2.issueMonth" type="month" placeholder="请选择年月" value-format="yyyy-MM" style="width:200px;" size="small" clearable ></el-date-picker></p></div>
                        <div class="updataPremium-content" style="display:flex;"><p class="item3">业务佣金比例</p> <p><el-input v-model="bonusRatio" style="width:200px;" maxlength="5" size="small" @input="computeMoney"> <template slot="append">%</template></el-input></p></div>
                    </div>
                    <p class="mt10" style="height:20px;margin-left:40px"><span class="item3">应发佣金 (修改后)</span><span class="item5" style="color:#FF3000" v-if="data2.payCommission">￥{{data2.payCommission.toFixed(2)}}</span><span v-else class="item5" style="color:#FF3000">0</span>元</p>
                </div>
                <div class="content1-dialog btn-right">
                    <el-button  class="item9 info" @click="close">取消</el-button>
                    <el-button  class="item9 warning" @click="submitEdit">确认提交</el-button>
                </div>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
import ProductService from '@/service/ProductService.js';
import AchievementService from '@/service/AchievementService.js';
import moment from 'moment'
export default {
	data() {
		return {
            data1:{},
			tipText: '确定要修改么？',
			Elevator:new elevator(),
			ProductService:new ProductService(),
			data2:{
				"afterPrem":0
			},
			bonusRatio:0,
			disabled:false,
			fileId:'',
			dialogVisible:false,
			outerVisible:false,
            premiumDiscount:1,
            detailsFactor:[],
            AchievementService: new AchievementService()
		}
	},
	created(){
	},
	methods: {
		initData(row) {
            this.data1 = row;
            this.data2 = JSON.parse(JSON.stringify(row));
            this.bonusRatio = this.data2.bonusRatio ? this.data2.bonusRatio*100 : 0;
            this.outerVisible = true
        },
		close(){
			this.outerVisible = false
		},
        computeMoney() {
            if (isNaN(this.bonusRatio)) {
                this.$message.error('业务佣金比例为数字，请输入数字！');
                this.data2.payCommission = 0;
                return false;
            } 
            if(100 < this.bonusRatio || this.bonusRatio < 1) {
                this.$message.error('业务佣金比例1%-100%');
                this.data2.payCommission = 0;
                return false;
            }
            let Reg = /^\d+(\.\d{0,2})?$/;
            if(!Reg.test(this.bonusRatio)) {
                this.data2.payCommission = 0;
                this.$message.error('业务佣金比例允许输入小数点后两位');
                return false;
            }
            // if(typeof this.bonusRatio == 'number') {
            //     this.bonusRatio = String(this.bonusRatio);
            // }
            // if(this.bonusRatio.indexOf('.') != -1 && this.bonusRatio.split('.').length > 2) {
            //     this.data2.payCommission = 0;
            //     this.$message.error('请输入正确的业务佣金比例');
            //     return false;
            // }
            // if(this.bonusRatio.indexOf('.') != -1 && this.bonusRatio.split('.')[1].length > 2) {
            //     this.data2.payCommission = 0;
            //     this.$message.error('业务佣金比例允许输入小数点后两位');
            //     return false;
            // }
            this.data2.bonusCommission = this.data2.premium*this.bonusRatio/100;
            this.data2.payCommission = this.data2.premium*this.bonusRatio/100 - (this.data2.businessFee ? this.data2.businessFee : 0 )
            return true
        },
        async submitEdit() {
            if(!this.computeMoney()) {
                return
            }
            if(this.bonusRatio != 0 && !this.bonusRatio) {
                this.$message.error('请输入业务佣金比例');
                return
            }
            if(!this.data2.issueMonth) {
                this.$message.error('请选择发放月份');
                return
            }
            this.data2.bonusRatio = this.bonusRatio/100;
            let res = await this.AchievementService.postUpdataRecord(this.data2);
            if(res.code == '0000') {
                this.$message.success('修改成功。');
                this.$logger.info(
					'M9-004','',
					{
                        'beforePerm':'记录ID：' + this.data1.id + '，营销员工号：' + this.data1.userNo + '，月份：' + this.data1.issueMonth + '，比例：' + (this.data1.bonusRatio ? this.data1.bonusRatio*100 + '%' : 0),
                        'afterPerm':'记录ID：' + this.data2.id + '，营销员工号：' + this.data2.userNo + '，月份：' + this.data2.issueMonth + '，比例：' + (this.data2.bonusRatio ? this.data2.bonusRatio*100 + '%' : 0),
                        'polNoOREnNO':this.data1.policyNo ? this.data1.policyNo : this.data1.endorseNo,
                    }
				);
                this.close();
                this.$emit('successCallback');
            } 
        }
	},
}

</script>

<style lang="less" scoped>
#editDialog {
	background-color: #f2f1ef;
	.content-dialog{
        margin-left: 3%;
		width: 94%;
		background-color: #ffffff;
		.content1-dialog{
			width: 100%;
			min-height: 40px;
			margin-bottom: 30px;
			color: #666666;
			.item1{
				height: 40px;
				line-height:40px;
				box-sizing: border-box;
                font-weight: 700;
                font-size: 14px;
                color: #101010;
			}
			.item2{
				font-size: 14px;
				color: #666666;
				.item3{
					margin-right: 10px;
				}
				.item4{
					color: #333333;
					font-weight: 500;
				}
				.item6{
					color: #333333;
					font-weight: 500;
				}
			}
			.item2 p{
				line-height: 40px;
			}
            .item5{
                margin-left: 10px;
                color: #FF3000;
                font-weight: 500;
            }
			.updataPremium {
                line-height: 40px;
                margin: 0 40px;
                margin-right: 0;
                padding-bottom: 20px;
                border-bottom:2px dashed #ccc;
                .updataPremium-title {
                    display: flex;
                    font-size: 16px;
                    font-weight: 700;
                    p:first-child{
                        width: 180px;   
                    }

                }
                .updataPremium-content {
                    p:first-child{
                        width: 180px;   
                    }
                }
			}
			.item9{
				width: 150px;
				height: 40px;
                margin-left: 40px;
                border-radius:30px;
            }
            .info {
                background-color: #F5F5F5;
                color: #000;
                border-color: #F5F5F5;
            }
            .warning {
                background-color: #FFA940;
                color: #fff;
                border-color: #FFA940;
            }
        }
        .btn-right {
            text-align: right;
            margin-top: 20px;
            margin-bottom: 0px;
        }
	}
}
</style>