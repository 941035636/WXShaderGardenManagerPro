<template>
    <div class="contract-template">
        <el-dialog title="关联合同信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="canBtn">
            <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="demo-ruleForm">
                <el-form-item label="查询条件" prop="searchType">
                    <el-select v-model="form.searchType" @change="clearInfo" style="width:150px" filterable clearable size="medium" placeholder="请选择查询条件" class="item4">
                        <el-option
                            v-for="(item,index) in chooseSelect"
                            :key="index"
                            :label="item.value"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <el-input placeholder="请输入"  v-model.trim="form.searchContent" class="wid300" clearable size="medium"></el-input>
                    <el-button type="primary" size="medium" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border style="width: 90%;margin-left:5%" :header-cell-style="getRowClass1">
                <el-table-column label="选择" width="50">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checkBox" @change="chooseContract(scope.row,scope.$index)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="合同信息" >
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="12">合同编号：{{ scope.row.code }}</el-col>
                            <el-col :span="12">合同名称：{{ scope.row.name }}</el-col>
                            <el-col :span="12" class="mt5">客户名称：{{ scope.row.customerName }}</el-col>
                            <el-col :span="12" class="mt5">合同期间：{{ moment(new Date(scope.row.startTime)).format("YYYY-MM-DD") }} 至{{ moment(new Date(scope.row.endTime)).format("YYYY-MM-DD") }}</el-col>
                            <el-col :span="12" class="mt5">首签/续签：{{ scope.row.renew == 0 ? '首签' : scope.row.renew == 1 ? "续签" : '--' }}</el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tip-text mt10" v-if="showTip"><i class="el-icon-warning mr10"></i> 签单日期不在合同期间，请确认</div>
            <div class="tip-text mt10" v-if="showTipContent"><i class="el-icon-warning mr10"></i> 合同内容不完整，请确认</div>
            <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="total" class="mt10"> </el-pagination>
            <div class="fr">
				<el-button  round size="medium" @click="canBtn">取 消</el-button>
				<el-button type="warning" round size="medium" @click="confirmBtn">确认提交</el-button>
			</div>
        </el-dialog>
    </div>
</template>
<script>
import moment from 'moment'
import ContractService from '../../../service/ContractService'
export default {
    name: 'ContractTemp',
    props:[
        'validDate'
	],
	data() {
		return {
            moment:moment,
            chooseSingle:{},
            ContractService:new ContractService(),
            chooseSelect: [
                {
                    code:'01',
                    value:'客户名称'
                },
                {
                    code:'02',
                    value:'合同编号'
                }
            ],
            dialogFormVisible: false,
            form:{
                searchType:'',
                searchContent:''
            },
            rules: {
                searchType: [
                    { required: true, message: "请选择查询条件", trigger: "change" }
                ],
            },
            tableData:[],
            currentPage:1,
            total:0,
            showTip:false,
            showTipContent:false
		}
	},
	computed:{
       
	},
	mounted() {
		
	},
	created(){
		
	},
	methods: {
        initData(val) {
            this.canBtn();
            if(val) {
                this.form = {
                    searchType:'01',
                    searchContent:val
                };
                this.search()
            }
            this.dialogFormVisible = true;
        },
        clearInfo() {
            this.form.searchContent = '';
        },
        search() {
            if(!this.form.searchType || !this.form.searchContent) {
                this.$message({
                    message: '请选择筛选条件并输入内容',
                    type: 'error'
                });
                return false
            }
            this.currentPage = 1;
            this.total = 0;
            this.searchFun();
        },
        async searchFun() {
            this.showTip = false;
            this.showTipContent = false;
            this.chooseSingle = {};
            let data = {
                "conditions": {
                    "code": this.form.searchType == '02' ? this.form.searchContent : '',
                    "customerName":this.form.searchType == '01' ? this.form.searchContent : '',
                },
                "paging": {
                    "pn": this.currentPage,
                    "ps": 10
                }
            }
            let res = await this.ContractService.searchContract(data);
            if(res.code =='0000') {
                res.list.forEach(item => {
                    item.checkBox = false;
                })
                this.tableData = res.list;
                this.total = res.total;
                if(this.total == 0) {
                    this.$message.warning('暂无数据!')
                }
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.searchFun();
        },
        getRowClass1({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background: #e8e8e8;color:#101010;font-size:14px;font-weight:600;';
            } else {
                return 'background: #fff';
            }
		},
        chooseContract(row,index) {
            this.chooseSingle = row;
            let flag = row.checkBox;
            this.tableData.map((item,subIndex) => {
                if(subIndex != index) {
                    item.checkBox = false;
                }
            })
            row.checkBox = flag;
            if(!row.endTime || !row.startTime || !row.code || !row.customerCode || !row.customerName) {
                this.showTipContent = true;
            } else {
                this.showTipContent = false;
                if(this.validDate.validDate && (this.validDate.validDate > row.endTime || this.validDate.validDate < row.startTime)) {
                    this.showTip = true;
                } else {
                    this.showTip = false;
                }
            }
        },
        canBtn() {
            this.showTipContent = false;
            this.showTip = false;
            this.tableData = [];
            this.currentPage = 1;
            this.total = 0;
            this.form = {
                searchType:'',
                searchContent:''
            };
            this.dialogFormVisible = false;
        },
        confirmBtn() {
            if(JSON.stringify(this.chooseSingle) == '{}') {
                this.$message.warning('请关联合同!')
                return false;
            }
            if(!this.showTip && !this.showTipContent) {
                this.$parent.$parent.setContract(this.chooseSingle);
                this.dialogFormVisible = false;
            }
        }
    }
}
</script>
<style lang="less">
.contract-template {
    .wid300 {
        width: 300px;
    }
    .el-pagination {
        text-align: center;
    }
    .tip-text {
        width: 278px;
        height: 40px;
        background-color: #fff1f0;
        color: #ff7875;
        border-radius: 6px;
        font-size: 14px;
        padding: 0px;
        text-align: center;
        line-height: 40px;
        margin-left: 5%;
    }
    .el-dialog__body {
        padding-bottom: 50px;
    }
}


</style>