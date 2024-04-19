<template>
	<div id="CustomerUserDetails">
		<el-dialog title="客户详情" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close='false'>
			<el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">客户名称：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="form.customerName" placement="top">
                            <span>{{form.customerName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">证件号码：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="form.customerId" placement="top">
                            <span>{{form.customerId }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">状态：</span>
                    <div class="col-span-r color-FA8C16">
                        <el-tooltip effect="dark" :content="form.customerStatusName" placement="top">
                            <span>{{form.customerStatusName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
			<el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">经营地区：</span>
                    <div class="col-span-r color-0050B3 ">
                        <el-tooltip effect="dark" :content="getAreaName" placement="top">
                            <span>{{getAreaName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">详细地址</span>
                    <div class="col-span-r color-0050B3 ">
                        <el-tooltip effect="dark" :content="form.address" placement="top">
                            <span>{{form.address }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">客户类型：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="form.customerTypeName" placement="top">
                            <span>{{form.customerTypeName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
			<el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">所属行业：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="form.industryName" placement="top">
                            <span>{{form.industryName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">运营类型：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="form.operationTypeName" placement="top">
                            <span>{{form.operationTypeName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">业务机构：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="form.bizBranchName" placement="top">
                            <span>{{form.bizBranchName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
			<el-row class="con-row">
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">业务人员：</span>
                    
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="getDepartment" placement="top">
                            <span>{{getDepartment }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">录入人员：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="form.creatorName" placement="top">
                            <span>{{form.creatorName }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
                <el-col :span="8" class="con-col">
                    <span class="col-span-l">录入时间：</span>
                    <div class="col-span-r">
                        <el-tooltip effect="dark" :content="form.createTime" placement="top">
                            <span>{{form.createTime }}</span>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
            <div class="btn">
              <span class="btn-left" @click="dialogVisible = false">取消</span>
          </div>
		</el-dialog>
	</div>
</template>

<script>

export default {
	name:'CustomerUserDetails',
	props:{
	
	},
	data() {
		return {
			dialogVisible:false,
			form:{},
		};
	},
	computed:{
        getAreaName(){
            return `${this.form.provinceName}/${this.form.cityName}/${this.form.areaName}`
        },
        getDepartment(){
            let str = `${this.form.businessorName || '--'}(${this.form.jobNumber || '--'})/${this.form.departmentName|| '--'}`
            return str
        },
    },
	created() {
	},
	methods: {
		openDialog(val){ // 打开弹框
            this.form = val
            this.dialogVisible = true
		},
	}
};
</script>

<style lang="less">
#CustomerUserDetails{
	.el-dialog{
		width: 850px;
		.con-row{
            color: #000;
            height: 40px;
            line-height: 40px;
            .con-col {
                height: 40px;
                line-height: 40px;
            }
            .col-span-l {
                width: 80px;
                height: 40px;
                line-height: 40px;
                display: inline-block;
                color: #919191;
                overflow:hidden;
            }
            .see-button {
                padding: 0;
            }
            .color-0050B3 {
                color: #0050B3;
            }
            .color-FA8C16 {
                color: #FA8C16;
            }
            .col-span-r {
                height: 40px;
                line-height: 40px;
                display: inline-block;
                width: calc(100% - 100px);
                overflow:hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow:ellipsis;
            }
            .see-button {
                padding: 0;
            }
        }
        .btn{
        margin: 10px 0;
        text-align: right;
        width: 100%;
        .btn-left{
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ccc;
            color: #000;
            background-color: #F5F5F5;
            border-radius: 20px;
            cursor: pointer;
            margin-right: 20px;
        }
    }
    }
}
</style>
