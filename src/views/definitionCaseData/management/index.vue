<template>
    <div style="padding: 0 20px 0 20px;">
        <!-- 资料管理页面 -->
        <div class="gridClass">
            <div class="newlyClass">
                <div></div>
                <div class="butClass" @click="productOption">添加资料分类</div>
            </div>
            <el-table :data="tableData" border style="width: 100%" default-expand-all row-key="areaId"
                :header-cell-style="{ background: '#E9E9E9', color: '#000000' }">
                <el-table-column type="index" label="序号" width="80" align="center">
                </el-table-column>
                <el-table-column prop="typeCode" label="编码" width="240" type="">
                    <template slot-scope="scope">
                        <div :style="scope.row.groundFloor != '1' ? 'padding-left: 30px;' : ''">
                            <el-input v-model.number="scope.row.sequence" style="width: 40px;" οninput="value=value.replace(/[^0-9]/g,'')"  @blur="(e,item) => {labelClick(scope.row)}"/>
                            {{ scope.row.typeCode }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="typeName" label="案件类型及资料名称">
                    <template slot-scope="scope">
                        <div v-if="scope.row.typeVal == '0'">{{ scope.row.typeName + '（制式资料）' }}</div>
                        <div v-else>{{ scope.row.typeName + '（案件资料）' }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="typeDesc" label="说明">
                </el-table-column>
                <el-table-column prop="type" label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == '0'" style="color: #52C41A;">正常</div>
                        <div v-else style="color: #919191;">关闭</div>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="180" align="center">
                </el-table-column>
                <el-table-column label="操作" width="240" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="amendClick(scope.row)">修改</el-button>
                        <!-- <el-button type="text" @click="deleteClick(scope.row.id)">删除</el-button> -->
                        <el-button type="text" v-if="scope.row.groundFloor == '1'"
                            @click="additionClick(scope.row)">添加子分类</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="title" width="700px" :visible.sync="classifyShow" @close="closeClick">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="案件类型名称：" prop="stypeName">
                    <el-input v-model="ruleForm.stypeName" :minlength="2" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="资料类型：" prop="datumType" v-if="datumTypeShow">
                    <el-select v-model="ruleForm.datumType" style="width: 400px" placeholder="请选择资料类型">
                        <el-option label="制式类资料" value="0"></el-option>
                        <el-option label="案件类资料" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-switch v-model="ruleForm.state" active-color="#13ce66" inactive-color="#ff4949" active-text="正常"
                        inactive-text="关闭">
                    </el-switch>
                </el-form-item>
                <el-form-item label="说明：">
                    <el-input type="textarea" v-model="ruleForm.explain" :maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <div class="unifyBut">
                <div></div>
                <div class="butBoxClass">
                    <div class="unifyButCancel" @click="() => classifyShow = false">取消</div>
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
            classifyShow: false,
            ruleForm: {
                stypeName: '',
                datumType: '',
                state: true,
                explain: '',
            },
            rules: {
                stypeName: [
                    { required: true, message: '请输入案件类型名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                ],
                datumType: [
                    { required: true, message: '请选择资料类型', trigger: 'change' }
                ]
            },
            datumTypeShow: true,
            departmentCode: '',
            departmentName: '',
            id: '',
            parentTypeCode: '',
            title: '',
            sequence:'1',
        }
    },
    computed: {

    },
    created(){},
    mounted() {
        this.getSelectByEmployeeNum();
    },
    methods: {
        //获取当前用户信息
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
        //获取列表事件
        async init() {
            let data = {};
            let res = await this.caseService.getLxConfig(data);
            if (res.code === '0000') {
                res.data.forEach(element => {
                    element.groundFloor = '1';
                    element.areaId = element.id;
                    // if(element.typeVal == '0'){
                    //     element.typeName = element.typeName + '（' +  '制式资料' + '）'
                    // }else{
                    //     element.typeName = element.typeName + '（' +  '案件资料' + '）'
                    // }
                    
                    if (element.children) {
                        element.children.forEach(_item => {
                            _item.areaId = _item.id;
                        });
                    }
                });
                console.log(res.data,'看看列表返回值');
                this.tableData = res.data;
            }
        },
        //添加资料分享的事件
        productOption() {
            this.title = '案件资料类型新增'
            this.datumTypeShow = true;
            this.classifyShow = true;
        },
        //表单提交的校验
        notarize() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.submit();
                }
            })
        },
        //表单提交接口调用
        async submit() {
            let data = {
                branch: window.sessionStorage.getItem("branchName"),//创建人机构
                branchCode: window.sessionStorage.getItem("branchCode"),//创建人机构编码
                creator: window.sessionStorage.getItem("userName"),//创建人
                creatorCode: window.sessionStorage.getItem("userCode"),//创建人编码
                dept: this.departmentName,//创建人部门
                deptCode: this.departmentCode,//创建人部门编码
                id: this.id ? this.id : '',
                parentTypeCode: this.parentTypeCode ? this.parentTypeCode : 'LX',//父类型编码
                typeCode: this.typeCode ? this.typeCode : 'LX',//类型编码
                typeDesc: this.ruleForm.explain,//类型描述
                typeName: this.ruleForm.stypeName,//类型名称
                typeVal: this.ruleForm.datumType,//制式资料 0  案件资料 1
                status: this.ruleForm.state ? '0' : '1',//类型中代表状态正常关闭
                sequence:this.sequence,
            };
            let res = await this.caseService.saveConfig(data);
            if (res.code === '0000') {
                this.classifyShow = false;
                this.$message({
                    message: this.id ? '案件资料类型修改成功' : '案件资料类型新增成功',
                    type: 'success'
                });
                this.init();
            }
        },
        //修改触发的事件
        amendClick(e) {
            this.datumTypeShow = false;
            if(e.groundFloor && e.groundFloor == '1'){
                this.datumTypeShow = true;
            };
            this.title = '案件资料类型修改';
            this.ruleForm.stypeName = e.typeName;
            this.ruleForm.datumType = e.typeVal;
            this.ruleForm.state = e.status == '0' ? true : false;
            this.ruleForm.explain = e.typeDesc;
            this.parentTypeCode = e.parentTypeCode;
            this.id = e.id;
            this.sequence = e.sequence;
            this.typeCode = e.typeCode;
            this.classifyShow = true;
        },
        //弹窗关闭触发的事件
        closeClick() {
            this.id = '';
            this.parentTypeCode = '';
            this.typeCode = '';
            this.ruleForm.stypeName = '';
            this.ruleForm.datumType = '';
            this.ruleForm.explain = '';
            this.sequence = '1';
            this.datumTypeShow = true;
            this.ruleForm.state = true;
        },
        //添加子级分类
        additionClick(e) {
            // this.ruleForm.datumType = e.typeVal;
            this.ruleForm.datumType = '';
            this.parentTypeCode = e.typeCode;
            this.datumTypeShow = false;
            this.classifyShow = true;
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
        labelClick(e){
            this.sequence = e.sequence;
            this.ruleForm.state = e.status == '0' ? true : false;
            this.ruleForm.stypeName = e.typeName;
            this.ruleForm.datumType = e.typeVal;
            this.ruleForm.explain = e.typeDesc;
            this.parentTypeCode = e.parentTypeCode;
            this.id = e.id;
            this.typeCode = e.typeCode;
            this.submit();
        },
    }
}
</script>
<style lang="less" scoped>
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
}
</style>
