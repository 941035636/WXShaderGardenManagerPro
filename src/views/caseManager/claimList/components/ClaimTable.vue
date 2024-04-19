<template>
    <div id="ClaimTable">
        <div class="table-list">
            <el-table :data="tableData" border :header-cell-style="setRowClass" style="width: 100%">
                <el-table-column prop="reportTime" label="报案时间/报案人" width="220">
                    <template slot-scope="scope">
                        <div>
                            <p>{{ scope.row.reportTime | isEmpty }}</p>
                            <p>{{ scope.row.reportName | isEmpty }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="reportNo" label="案件信息" width="427">
                    <template slot-scope="scope">
                        <div>
                            <p>报案号: <span class="c096DD9">{{ scope.row.insuredCompanyReportNo | isEmpty }}</span></p>
                            <p>出险地点: {{ scope.row.riskProvinceName }}/{{ scope.row.riskCityName }}/{{ scope.row.riskAreaName }}</p>
                            <p>出险时间: {{ scope.row.riskTime | isEmpty }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="riskUnit" label="保单信息" width="427px">
                    <template slot-scope="scope">
                        <div>
                            <p>出险单位: <span style="font-weight: bold">{{ scope.row.riskUnit | isEmpty }}</span></p>
                            <p>保单号: {{ scope.row.policyNo | isEmpty }}</p>
                            <p>保险公司: {{ scope.row.fromSys | isEmpty }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="referenceStatus" label="认领状态" width="152px">
                    <template slot-scope="scope">
                        <div>
                            <p :class="[scope.row.referenceStatus == '1' ? 'c096DD9' : 'c52C41A']">{{ scope.row.referenceStatus | referenceStatus }}</p>
                            <p >推送： {{ scope.row.createTime | format('YYYY-MM-DD')}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mediateBranchName" label="所属分支机构" width="210px">
                    <template slot-scope="scope">
                        <div>
                            <p>{{ scope.row.referenceOperatorName | isEmpty }}</p>
                            <p>{{ scope.row.sortingBranchName | isEmpty }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px" fixed="right">
                    <template slot-scope="scope">
                        <div>
                            <p v-if="scope.row.referenceStatus == '1'" class="cFA8C16 pointer" @click="openDialog('distribution', scope.row)">手动分配</p>
                            <p class="cFA8C16 pointer" @click="openDialog('detail', scope.row)">查看详情</p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagenations" :style="{ 'width': pagenationsWidth + 'px'}">
			<div class="export">
				<span>查询结果：共{{ total }}条记录</span>
			</div>
			<BasePagenations :tolnum="total" :currentPage="pn" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></BasePagenations>
		</div>
    </div>
</template>

<script>
import Claim from '../../../../service/claim'
export default {
    name: "ClaimTable",
    props: {
        queryForm: {
            type: Object,
            default: function() {
                return {}
            },
        },
    },
    data() {
        return {
            claim: new Claim(),
            pagenationsWidth: '',
            screenWidth: document.body.clientWidth,
            timer: false,
            total: 10,
            pn: 1,
            ps: 10,
            tableData: [],
        }
    },
    watch: {
        screenWidth(val) {
			if (!this.timer) {
				this.screenWidth = val
				this.timer = true
				let that = this
				setTimeout(function () {
					that.pagenationsWidth = document.querySelector('.table-list').offsetWidth
					that.timer = false
				}, 60)
			}
		},
    },
    filters:{
        referenceStatus(value) {
            const statusList = [{
                label: '未认领',
                value: '1',
            }, {
                label: '引用结案',
                value: '2',
            }, {
                label: '已认领',
                value: '3',
            }, {
                label: '已认领引用结案',
                value: '4',
            }, {
                label: '已关联引用结案',
                value: '5',
            },]
            return statusList.filter(item => item.value.includes(value))[0].label
        },
        isEmpty(value) {
            return value == null || value == '' ? '--' : value
        },
    },
    created(){
        this.selectDockingClaimList();
    },
    mounted() {
        this.$nextTick(() => {
			this.pagenationsWidth = document.querySelector('.table-list').offsetWidth
			const that = this
			window.onresize = () => {
				return (() => {
					window.screenWidth = document.body.clientWidth
					that.screenWidth = window.screenWidth
				})()
			}
		});
    },
    methods: {
        openDialog(label, data) {
            this.$emit('openDialog', {
                dialogTitle: label,
                data: data,
            });
        },
        setRowClass({ row, column, rowIndex, columnIndex }) {
            return rowIndex == 0 ? 'background: #E6F7FF' : ''
        },
        handleSizeChange(value) {
            this.$parent.form.ps = value
            this.selectDockingClaimList()
        },
        handleCurrentChange(value) {
            this.$parent.form.pn = value
            this.selectDockingClaimList()
        },
        async selectDockingClaimList() {
            let { code, list, total } = await this.claim.selectDockingClaimList(this.$parent.form)
            if(code == '0000') {
                this.tableData = list
                this.total = total
            }
        },
    }
}
</script>

<style lang="less">
#ClaimTable {
    margin-bottom: 50px;
    .pagenations {
		box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
		position: fixed;
		bottom: 0;
        width: 100%;
		height: 50px;
		padding: 0 20px;
		background: #e6f7ff;
		z-index: 99;
		.pagination {
			margin: 10px 0;
		}
	}

    .c52C41A {
        color: #52C41A;
    }

    .c096DD9 {
        color: #096DD9;
    }
}
</style>