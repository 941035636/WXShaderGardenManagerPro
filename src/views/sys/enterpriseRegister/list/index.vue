<template>
    <div id="userBatchList">
        <div class="elesearch">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-row type="flex" class="row-bg">
                    <el-col :span="8">
                        <div class="form-content-name" style="display:flex;">
                            <span class="item3">企业名称：</span>
                            <el-form-item prop="corpName" style="margin: 0;line-height: 40px;">
                                <el-input style="line-height: 40px" class="item2" v-model.trim="ruleForm.corpName" clearable
                                    placeholder="请输入（模糊查询）">
                                </el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div style="display:flex;">
                            <span class="item3">信用代码：</span>
                            <el-input class="item2" v-model.trim="ruleForm.blCode" clearable placeholder="请输入信用代码">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div style="display:flex;">
                            <span class="item3">注册时间：</span>
                            <el-date-picker class="item5" type="date" v-model="ruleForm.regStartTime"
                                value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker>
                            <span class="item1">至</span>
                            <el-date-picker class="item5" type="date" v-model="ruleForm.regEndTime"
                                value-format="yyyy-MM-dd" placeholder="结束日期"></el-date-picker>
                        </div>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" v-if="isOperator">
                    <el-col :span="24">
                        <div style="display:flex;">
                            <span class="item3">操作人：</span>
                            <el-select class="item2" v-model="ruleForm.userCode" filterable clearable
                                placeholder="请选择操作人">
                                <el-option v-for="(item, index) in branchList" :key="index" :value="item.userCode"
                                    :label="item.userName"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
                <div class="elesearch-btn">
                    <el-button class="ml20" type="primary" shape="round" @click="onSubmit('ruleForm')">查询</el-button>
                    <el-button class="ml20" shape="round" @click="reset">重置</el-button>
                </div>
            </el-form>
        </div>
        <div class="content-up-box">
            <div class="up-box-div">
                <span class="ml20">状态：</span>
                <el-button class="mr10 w80" size="medium" round :type="item.code == ruleForm.isSuccess ? 'primary' : ''"
                    v-for="(item, index) in accountTypeList" :key="index" @click="checkSort(item)">{{ item.value }}
                </el-button>
            </div>
            <div>
                <el-button type="primary" round @click="regUser">添加用户</el-button>
                <el-button round @click="uploadUser">批量导入</el-button>
            </div>
        </div>
        <div class="content">
            <el-table border :data="userList" :header-cell-style="getRowClass">
                <el-table-column label="序号" type="index" width="70px"></el-table-column>
                <el-table-column label="注册时间" width="190px">
                    <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <el-table-column label="注册信息">
                    <template slot-scope="scope">
                        <div>
                            <p> {{ scope.row.corpName }}/{{ scope.row.blCode }}</p>
                            <div style="display: flex; align-items: center;">
                                <span class="color-red" v-if="!scope.row.isSuccess">原因：{{ scope.row.msg }}</span>
                                <div style="margin-left: 10px">
                                    <el-button v-if="!scope.row.isSuccess"
                                        style="font-size: 14px!important; color: #FFA940" type="text"
                                        @click="updateHandle(scope.row)">
                                        编辑</el-button>
                                    <span v-if="!scope.row.isSuccess"
                                        style="font-size: 14px!important; color: #FFA940">|</span>
                                    <el-button v-if="!scope.row.isSuccess"
                                        style="font-size: 14px!important; color: #FFA940" type="text"
                                        @click="deleteHandle(scope.row)">
                                        删除</el-button>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="createByName" width="300px"></el-table-column>
                <el-table-column label="注册状态" width="200px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isSuccess" class="c52C41A">成功</span>
                        <span v-else class="cF5222D">失败</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="pageFlag" class="pr20" background layout="prev, pager, next" :total="tolnum"
                :current-page="ruleForm.pn" @current-change="handleCurrentChange" @handleSizeChange="handleSizeChange">
            </el-pagination>
        </div>
        <regFileUploadDialog ref="fileRef" @handleQuery="handleQuery" />
        <regtDialog ref="regtRef" @handleQuery="handleQuery" />
    </div>
</template>

<script>
import regFileUploadDialog from "../components/RegFileUploadDialog.vue"
import regtDialog from "../components/RegtDialog"
import { getBatchaddList, getPersonqueryList, deleteBatch } from '@/api/enterpriseRegister'
export default {
    name: 'EnterpriseRegister',
    data() {
        return {
            ruleForm: {
                pn: 1, // 当前页 ,
                ps: 10, // 每页显示条数 ,
                corpName: '', // 企业名称
                blCode: '', // 信用代码
                regStartTime: '',
                regEndTime: '',
                userCode: '',
                isSuccess: null,
            },
            rules: {
                corpName: [
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' }
                ],
            },
            branchList: [], // 分支机构信息
            regtTitle: '用户信息', // 添加用户动态标题
            pageFlag: false, // 分页是否展示
            userList: [], // 列表内容
            tolnum: 10, // 总数量
            accountTypeList: [{
                value: '全部',
                code: null,
            }, {
                value: '成功',
                code: true,
            }, {
                value: '失败',
                code: false,
            }]
        }
    },
    components: {
        regFileUploadDialog,
        regtDialog
    },
    created() {
        const roles = window.sessionStorage.getItem('roles')
        if (roles != null && roles != undefined) {
            let rolesArr = []
            if (roles.indexOf(',') != -1) {
                rolesArr = roles.split(',')
            } else {
                rolesArr = [roles]
            }
            console.log(rolesArr);
            if (rolesArr.includes('RL1453251619998273537') || rolesArr.includes('RL1453259613846769665')) {
                this.isOperator = true
            } else {
                this.isOperator = false
            }
            console.log(this.isOperator);
        }
        // this.loadData()
        this.loadOperator()
    },
    methods: {
        async loadData() {
            let { code, list, total } = await getBatchaddList(this.ruleForm)
            if (code == '0000') {
                this.userList = list
                if (total > 0) {
                    this.pageFlag = true
                } else {
                    this.pageFlag = false
                }
                this.tolnum = total
            }
        },
        // 加载操作人
        async loadOperator() {
            let { code, list } = await getPersonqueryList()
            if (code == '0000') {
                this.branchList = list
            }
        },
        // 重置条件查询
        reset() {
            this.ruleForm = {
                pn: 1,
                ps: 10,
                corpName: '',
                blCode: '',
                regStartTime: '',
                regEndTime: '',
                userCode: '',
            }
            this.loadData()
        },
        // 重新加载列表数据
        handleQuery() {
            this.loadData()
            this.loadOperator()
        },
        // 查询按钮
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let startTime = this.ruleForm.regStartTime ? this.ruleForm.regStartTime + ' 00:00:00' : ''
                    let endTime = this.ruleForm.regEndTime ? this.ruleForm.regEndTime + ' 23:59:59' : ''
                    this.ruleForm.regStartTime = startTime
                    this.ruleForm.regEndTime = endTime
                    this.loadData()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 注册用户
        regUser() {
            this.$refs['regtRef'].regUserShow = true
        },
        // 批量注册用户
        uploadUser() {
            this.$refs['fileRef'].fileImportShow = true
        },
        // 修改用户信息
        updateHandle(row) {
            this.$refs['regtRef'].title = "编辑企业信息"
            this.$refs['regtRef'].ruleForm.id = row.id
            this.$refs['regtRef'].ruleForm.orgName = row.corpName
            this.$refs['regtRef'].ruleForm.blCode = row.blCode
            this.$refs['regtRef'].regUserShow = true
        },
        // 删除
        async delete(row) {
            let { code } = await deleteBatch(row.id)
            if (code == '0000') {
                this.$message.success("删除成功！")
                this.loadData()
                console.log('删除成功！');
            }
        },
        // 删除用户 只有是失败的可以删除
        deleteHandle(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delete(row)
            }).catch(() => { })
        },
        handleSizeChange(val) {
            this.ruleForm.ps = val
            this.loadData();
        },
        handleCurrentChange(val) {
            this.ruleForm.pn = val
            this.loadData()
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return "background:#f5f5f5;color:#000000"
            } else {
                return ""
            }
        },
        checkSort(item) {
            this.ruleForm.isSuccess = item.code
            this.ruleForm.pn = 1
            this.loadData()
        },
    }
}
</script>

<style lang="scss">
#userBatchList {
    padding-bottom: 30px;
    box-sizing: border-box;
    background-color: #ffffff;

    .elesearch {
        width: 100%;
        background-color: #fff;
        margin: 20px 20px 8px 20px;
        box-sizing: border-box;

        .row-bg {
            margin-bottom: 20px;
            line-height: 40px;

            .item1 {
                display: block;
                width: 10%;
                text-align: center;
            }

            .item2 {
                width: 300px;
            }

            .item3 {
                font-size: 14px;
                color: #666666;
                display: block;
                width: 94px;
                text-align: right;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .item5 {
                width: 30%;
            }
        }
    }

    .elesearch-btn {
        width: 100%;
        height: 100%;
        text-align: center;
        color: #ffffff;

        .query-button {
            display: inline-block;
            width: 120px;
            height: 40px;
            background-color: #f3ac56;
            text-align: center;
            line-height: 40px;
            margin-right: 40px;
            color: #ffffff;
            font-weight: 600;
            cursor: pointer;
            border-radius: 60px;
        }
    }

    .content-up-box {
        width: 100%;
        height: 100%;
        padding: 15px 30px 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;

        .up-box-div {
            .w80 {
                border: 1px solid #fa843b;
                color: #fa843b;
            }

            button {
                padding: 8px 20px;
            }

            .el-button--primary {
                background-color: #FFE7BA;
            }

            .el-button:hover {
                background-color: #FFE7BA;
            }
        }
    }

    .content {
        width: 100%;
        height: 100%;
        border: none;
        padding: 20px;
        margin: 0;
        box-sizing: border-box;
    }

    .el-input--prefix .el-input__inner {
        padding: 0 15px !important;
    }

    .el-input__prefix {
        display: none;
    }

    .form-content-name .el-form-item__content {
        margin: 0 !important
    }

    .color-red {
        color: #F5222D;
    }

    .c52C41A {
        color: #52C41A;
    }

    .cF5222D {
        color: #F5222D;
    }
}
</style>