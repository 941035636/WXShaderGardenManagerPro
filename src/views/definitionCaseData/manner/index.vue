<template>
    <div style="padding: 0 20px 0 20px;">
        <!-- 赔付方式页面 -->
        <div class="headerClass">
            <el-row>
                <el-col :span="8">
                    <div class="sonClass">
                        <div class="textClass">赔付方式：</div>
                        <div class="frameClass">
                            <el-input v-model="filtrateData.manner" placeholder="模糊查询"></el-input>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="sonClass">
                        <div class="textClass">赔付方式编码：</div>
                        <div class="frameClass">
                            <el-input v-model="filtrateData.code" placeholder="精准查询"></el-input>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="sonClass">
                        <div class="searchClass" @click="init">查询</div>
                        <div class="emptyClass" @click="empty">清空筛选条件</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="gridClass">
            <div class="newlyClass">
                <div></div>
                <div class="butClass" @click="productOption">添加赔付方式</div>
            </div>
            <el-table :data="tableData" border style="width: 100%" :header-cell-style="{
                background: '#E9E9E9', color: '#000000'
            }">
                <el-table-column type="index" label="序" width="80" align="center">
                </el-table-column>
                <el-table-column prop="typeCode" label="编码">
                </el-table-column>
                <el-table-column prop="typeName" label="赔付方式">
                </el-table-column>
                <el-table-column label="诉讼/非诉讼">
                    <template slot-scope="scope">
                        <div v-if="scope.row.typeVal == '1'">诉讼</div>
                        <div v-else-if="scope.row.typeVal == '2'">非诉讼</div>
                        <div v-else-if="scope.row.typeVal == '3'">诉讼、非诉讼</div>
                    </template>
                </el-table-column>
                <el-table-column label="最后编辑人">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.creator + '（' + scope.row.dept + '）' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间">
                </el-table-column>
                <!-- <el-table-column prop="typeDesc" label="说明">
                </el-table-column> -->
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="amendClick(scope.row)">修改</el-button>
                        <el-button type="text" @click="deleteClick(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagingClass">
                <el-pagination background @current-change="handleCurrentChange" :current-page="pn" :page-size="ps"
                    layout="prev, pager, next, jumper , total" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog :title="title" width="600px" :visible.sync="dialogFormVisible" @close="close">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="赔付方式名称：" prop="wayName" :minlength="2" :maxlength="50">
                    <el-input v-model="ruleForm.wayName"></el-input>
                </el-form-item>
                <el-form-item label="诉讼/非诉讼：" prop="type">
                    <el-checkbox-group v-model="ruleForm.type">
                        <el-checkbox label="1">诉讼</el-checkbox>
                        <el-checkbox label="2">非诉讼</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="说明：">
                    <el-input type="textarea" v-model="ruleForm.explain" :maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <div class="unifyBut">
                <div></div>
                <div class="butBoxClass">
                    <div class="unifyButCancel" @click="() => dialogFormVisible = false">取消</div>
                    <div class="unifyButAffirm" @click="notarize">确认提交</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import '../components/unify.less';
import CaseService from '@/service/CaseService.js';
export default {
    data() {
        return {
            caseService: new CaseService(),
            filtrateData: {
                manner: "",
                code: ""
            },
            tableData: [],
            total: 20,//列表总条数
            ps: 10,//每页多少条
            pn: 1,//当前页数
            dialogFormVisible: false,
            ruleForm: {
                wayName: '',
                type: [],
                explain: ''
            },
            rules: {
                wayName: [
                    { required: true, message: '请输入赔付方式名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个诉讼/非诉讼', trigger: 'change' }
                ],
                // explain: [
                //     { required: true, message: '请输入说明', trigger: 'blur' },
                //     { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                // ]
            },
            departmentCode: '',
            departmentName: '',
            title: '',
            id: '',
            typeCode: '',
        }
    },
    computed: {

    },
    mounted() {
        this.getSelectByEmployeeNum();
        // this.init();
    },
    methods: {
        //获取当前用户信息接口
        async getSelectByEmployeeNum() {
            let params = {
                userCode: window.sessionStorage.getItem("userCode"),
            };
            let res = await this.caseService.selectByEmployeeNum(params)
            if (res.code === '0000') {
                this.departmentCode = res.data.departmentCode;
                this.departmentName = res.data.departmentName;
            }
        },

        // 获取列表接口
        async init() {
            let data = {
                page: this.pn,
                pageSize: this.ps,
                typeName: this.filtrateData.manner,
                typeCode: this.filtrateData.code,
            };
            let res = await this.caseService.getPFConfig(data);
            if (res.code === '0000') {
                this.tableData = res.data.list;
                this.total = res.data.total;

            }
        },
        // 清空筛选条件
        empty() {
            this.filtrateData.manner = '';
            this.filtrateData.code = '';
            this.init();
        },
        // 添加赔付方式
        productOption() {
            this.title = '赔付方式新增';
            this.dialogFormVisible = true;
        },
        //分页函数
        handleCurrentChange(e) {
            this.pn = e;
            this.init();
        },
        // 表单提交校验
        notarize() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.submit();
                };
            })
        },
        //表单提交接口调用
        async submit() {
            let data = {
                // attachment:'',//附件
                branch: window.sessionStorage.getItem("branchName"),//创建人机构
                branchCode: window.sessionStorage.getItem("branchCode"),//创建人机构编码
                // children:[],
                // createTime:'',//创建时间
                creator: window.sessionStorage.getItem("userName"),//创建人
                creatorCode: window.sessionStorage.getItem("userCode"),//创建人编码
                dept: this.departmentName,//创建人部门
                deptCode: this.departmentCode,//创建人部门编码
                id: this.id ? this.id : '',
                // page:'',
                // pageSize:'',
                // parentTypeCod:'',//父类型编码
                typeCode: this.typeCode ? this.typeCode : 'PF',//类型编码
                typeDesc: this.ruleForm.explain,//类型描述
                typeName: this.ruleForm.wayName,//类型名称
                typeVal: this.ruleForm.type.length == 1 ? this.ruleForm.type[0] : '3',//类型值 赔付中代表诉讼非诉讼，类型中代表状态正常关闭
                // updateTime:'',
            };
            let res = await this.caseService.saveConfig(data);
            if (res.code === '0000') {

                this.$message({
                    message: this.id ? '赔付方式修改成功' : '赔付方式新增成功',
                    type: 'success'
                });
                this.filtrateData.manner = '';
                this.filtrateData.code = '';
                this.ps = 10;
                this.pn = 1;
                this.dialogFormVisible = false;
                this.init();
            }
        },
        //弹窗关闭清空值
        close() {
            this.id = '';
            this.typeCode = '';
            this.title = '';
            this.ruleForm.wayName = '';
            this.ruleForm.type = [];
            this.ruleForm.explain = '';
        },
        //修改函数
        amendClick(e) {
            this.id = e.id;
            this.typeCode = e.typeCode;
            this.title = '赔付方式修改';
            this.ruleForm.wayName = e.typeName;
            if (e.typeVal == 3) {
                this.ruleForm.type = ['1', '2'];
            } else {
                this.ruleForm.type = [e.typeVal];
            }
            this.ruleForm.explain = e.typeDesc;
            this.dialogFormVisible = true;
        },
        //删除事件
        deleteClick(e) {
            this.$confirm('此操作将永久删除该赔付方式, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteFile(e);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async deleteFile(e) {
            let res = await this.caseService.deleteConfig(e)
            if (res.code === '0000') {
                this.init();
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            }
        },

    }
}
</script>
<style lang="less" scoped>
.headerClass {
    background-color: #fff;
    margin-bottom: 23px;
}

.gridClass {
    background-color: #fff;

    .newlyClass {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 32px;

        .butClass {
            font-size: 14px;
            padding: 7px 30px 7px 30px;
            background-color: #1890FF;
            color: #fff;
            border-radius: 30px;
            font-weight: bold;
            margin-right: 20px;
            cursor: pointer;
        }
    }

    .pagingClass {
        text-align: right;
        padding: 20px 32px 20px 32px;
    }
}
</style>