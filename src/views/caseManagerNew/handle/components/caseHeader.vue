<template>
	<div id="caseHeader">
        <div class="caseHeader-l">
            <div class="cell-box">
                <span>报案号：</span>
                <span>{{caseInfo.reportNo}}</span>
            </div>
            <div class="cell-box">
                <span>报案时间：</span>
                <span>{{caseInfo.reportTime}}</span>
            </div>
            <div class="cell-box">
                <span>案件进度：</span>
                <span class="col-black col-status">{{caseInfo.caseProgressName}}</span>
            </div>
        </div>
        <div class="caseHeader-box-r">
            <div class="caseHeader-r">
                <div class="cell-box">
                    <span>录入人员：</span>
                    <span>{{caseInfo.enteredUser}}</span>
                    <span>于</span>
                    <span>{{caseInfo.enteredTime}}</span>
                </div>
                <div class="cell-button">
                    <el-button type="warning" round v-if="isHandleButton && !isCasePause" @click="caseStop">案件中止</el-button>
                    <el-button type="warning" round  v-if="getIsOldCaseBtn"  @click="toOldCaseDetails">查看旧案件详情</el-button>
                    <!-- <el-button type="warning" round v-if="isHandleButton && !isCasePause" @click="caseEnd">结案申请</el-button> -->
                </div>
            </div>
        </div>
        <caseStopDialog ref="caseStopDialog"></caseStopDialog>
	</div>
</template>

<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import caseStopDialog from './caseStopDialog'
export default {
	components:{
        caseStopDialog
    },
	data() {
		return {
		}
	},
	computed:{
        ...mapGetters(["caseInfo",'isHandleButton','isPendingStatus','isCasePause','policyInfoVo']),
        getIsOldCaseBtn(){
            if(this.caseInfo.reportNo && this.caseInfo.reportNo.indexOf('TS') == -1) {
                return true
            } else {
                return false
            }
        }
    },
	created(){
	},
	mounted() {
        
    },
	methods: {
        caseStop(){
            this.$refs.caseStopDialog.openInit()
        },
        caseEnd(){
            this.$emit('caseEnd')
        },
        toOldCaseDetails(){
            let routeData = this.$router.resolve({
					path:'/caseDteailDisable',
					query:{
						reportNo:this.caseInfo.reportNo,
						isNewCase:true,
						// caseNo:row.caseNo,
						// caseId:row.caseId,
						productCategory1:this.policyInfoVo.productCategoryCode?this.policyInfoVo.productCategoryCode.toLowerCase():'',
						holderName:this.policyInfoVo.holderName,
					}
				})
				window.open(routeData.href, '_blank');
        }
    },
	
}

</script>

<style lang="less">
#caseHeader {
    height: 60px;
	display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 3px;
    margin-top: 10px;
    padding: 0 20px;
    .caseHeader-l {
        height: 30px;
        margin: 15px 0;
        line-height: 30px;
        display: flex;
        width: 60%;
        .cell-box {
            margin-right: 20px;
            span {
                color: #000;
                font-size: 14px;
            }
            .col-status{
                display: inline-block;
                padding: 0px 15px;
                background-color: #FFE7BA;
                border-radius: 20px;
                color: #FA8C16;
                
            }
        }
    }
    .caseHeader-box-r {
        min-width: 40%;
        text-align: right;
        .caseHeader-r {
            height: 40px;
            margin: 10px 0;
            line-height: 40px;
            display: flex;
            justify-content: flex-end;
            .cell-box {
                margin-right: 20px;
                span {
                    color: #000;
                    font-size: 14px;
                }
            }
        }
    }
    
}
</style>
