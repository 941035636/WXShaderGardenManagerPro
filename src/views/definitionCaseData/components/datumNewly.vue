<template>
    <div class="majorStructure">
        <div class="headerClass">
            <div class="fragment"></div>
            <div class="newVersion">新版本</div>
            <div class="versionNumber">{{ newTemplate.version ? versionProcessing(newTemplate.version) : '--' }}</div>
            <div class="dateClass">更新时间：{{ newTemplate.updateTime || '--' }} </div>
            <el-popover placement="bottom" title="描述信息" width="200" trigger="click" :content="newTemplate.remark || '--'">
                <div slot="reference" class="describeClass">
                    更新描述：{{ newTemplate.remark || '无' }}
                </div>
            </el-popover>
            <div class="operationClass">操作人：{{ newTemplate.creator || '--' }} / {{ newTemplate.branch || '--' }} </div>
            <div class="stateClass" v-if="newTemplate.status == '100'">状态：待发布</div>
            <div class="stateClass1" v-if="newTemplate.status == '210'">状态：审核失败</div>

        </div>
        <el-table :data="tableData" border style="width: 100%" :header-cell-style="{
            background: '#E9E9E9', color: '#000000'
        }" :span-method="objectSpanMethod">
            <el-table-column prop="compensateWayName" label="赔付方式" width="180" align="center">
            </el-table-column>
            <el-table-column prop="lawsuitName" label="诉讼/非诉讼" width="180" align="center">
            </el-table-column>
            <el-table-column label="附件资料">
                <template slot-scope="scope">
                    <div v-if="scope.row.jsonData.length > 0" class="contentManagement">
                        <div class="contentClass">
                            <div v-for="eqa in scope.row.jsonData" :key="eqa.outermostTypeCode">
                                <div class="titNameClass" v-if="eqa.outermostTypeVal == '0'">{{ eqa.outermostTypeName + '（制式资料）' }}</div>
                                <div class="titNameClass" v-else>{{ eqa.outermostTypeName + '（案件资料）' }}</div>

                                <div style="display: flex; width: 100%;">
                                    <div v-for="(qcy, qcyIndex) in eqa.children" :key="qcy.childLevelTypeCode">
                                        <div class="mainNameClass">
                                            <div>{{ qcyIndex + 1 }}、</div>
                                            <div>{{ qcy.childLevelTypeName }}</div>
                                            <div v-if="qcy.must" style="color: red">* </div>
                                            <div v-if="qcy.childLevelTypeDesc">（{{ qcy.childLevelTypeDesc }}）</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="butClass">
                            <el-button type="text" class="littleHand" style="color: #FA8C16;"
                                @click="amend(scope.row)">修改</el-button>
                            <el-button type="text" class="littleHand" style="color: #FA8C16;"
                                @click="deleteClick(scope.row)">删除</el-button>
                        </div>
                    </div>
                    <div class="pleaseChooseClass littleHand" v-else @click="select(scope.row)">请选择资料</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="describeClass1">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="描述信息" prop="describe">
                    <el-input v-model="ruleForm.describe" style="width: 80%;"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="buttonClass">
            <div class="saveClass littleHand" @click="notarize('0')">保存设置</div>
            <div class="affirmClass littleHand" @click="notarize('1')">确认提交，下一步审批</div>
        </div>
        <SteDatum ref="setDatum" @transmit="transmit" />
    </div>
</template>
<script>
import '../components/unify.less';
import SteDatum from './setDatum.vue';
import CaseService from '@/service/CaseService.js';
import formatDat from '../caseList/newlyIncreased/formatDat';


export default {
    components: {
        SteDatum
    },
    data() {
        return {
            caseService: new CaseService(),
            userName: sessionStorage.getItem("userName"),
            branchName: sessionStorage.getItem("branchName"),
            tableData: [],
            pos: 0,// 索引
            spanArr: [],
            ruleForm: {
                describe: ''
            },
            rules: {
                describe: [
                    { required: true, message: '请输入更新描述', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ]
            },
            newTemplate: {
                creator: '',
                version:'',
            },
            id: '',
            ializationList:[],
        }
    },
    created(){},
    methods: {
        //获取列表事件
        async initialization() {
            let data = {};
            let res = await this.caseService.getLxConfig(data);
            if(res.code === '0000'){
                this.ializationList =  res.data;
                console.log(this.ializationList,'看看值为什么丢失');
                let queryData = JSON.parse(this.$route.query.paramsata);
                if(queryData.basicData){
                    this.getTemplateDetail();
                }
            };
        },
        assignmentID(id){
            this.id = id
        },
        //删除按钮触发的事件
        deleteClick(e) {
            this.$confirm('此操作将永久删除该附件资料, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData.forEach((_item, _index) => {
                    if (_item.id == e.id) {
                        _item.jsonData = [];
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //版本号处理
        versionProcessing(e) {
            let data = JSON.parse(this.$route.query.paramsata);
            let version = '';
            if(data.basicData.status == '210'){
                version = e.slice(0, (e.length - 2)) + '.' + e.slice(1, (e.length - 1)) + '.' + e.slice(-1);
            }else if(data.basicData.status == '200'){
                version = e.slice(0, (e.length - 2)) + '.' + e.slice(1, (e.length - 1)) + '.' + e.slice(-1);
            }else if(data.basicData.status == '100'){
                version = e.slice(0, (e.length - 2)) + '.' + e.slice(1, (e.length - 1)) + '.' + e.slice(-1);
            }else{
                let num = String( Number(e) + 1);
                version = num.slice(0, (num.length - 2)) + '.' + num.slice(1, (num.length - 1)) + '.' + num.slice(-1);
            }
            return version
        },
        //获取详情数据回显
        async getTemplateDetail() {
            let data = JSON.parse(this.$route.query.paramsata);
            let res = await this.caseService.getTemplateDetail(data.inusureCompanyItem.name, data.productItem.code);
            if (res.code === '0000') {
                if(data.basicData.status == '100' && res.data.newTemplate && res.data.newTemplate.status == '100'){
                    //待发布处理事件
                    this.newTemplate = res.data.newTemplate;
                    this.id = res.data.newTemplate.id;
                    this.ruleForm.describe = res.data.newTemplate.remark;
                    this.tableData = formatDat.detailsHandleData(this.tableData, res.data.newTemplate.items,this.ializationList);
                }else if(data.basicData.status == '210' && res.data.newTemplate && res.data.newTemplate.status == '210'){
                    //审核失败处理事件
                    this.newTemplate = res.data.newTemplate;
                    this.id = res.data.newTemplate.id;
                    this.ruleForm.describe = res.data.newTemplate.remark;
                    this.tableData = formatDat.detailsHandleData(this.tableData, res.data.newTemplate.items,this.ializationList);
                }else{
                    this.newTemplate = res.data.inuseTemplate;
                }
            }
        },
        //获取列表事件
        async init() {
            let data = {
                page: 1,
                pageSize: 1000
            };
            let res = await this.caseService.getPFConfig(data);
            if (res.code === '0000') {
                this.tableData = formatDat.mannerDate(res.data.list);
                    this.initialization();
                this.merge();
            }
        },
        //合并单元格事件
        merge() {
            for (let i = 0; i < this.tableData.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                    if (this.tableData[i].compensateWayName === this.tableData[i - 1].compensateWayName) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            };
        },
        //触发附件资料弹窗
        select(e) {
            this.$refs.setDatum.exhibition(e.id, e.lawsuitName);
        },
        //合并单元格事件
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        //判断列表里面有没有添加案件资料
        tableVerify() {
            let tableKey = false;
            this.tableData.forEach(element => {
                if (element.jsonData.length > 0) {
                    tableKey = true;
                }
            });
            return tableKey;
        },
        //确认事件
        notarize(key) {
            if (this.tableVerify()) {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.submit(key)
                    }
                })
            } else {
                this.$message.error('请至少填写一份附件资料');
            }
        },
        //提交成功，跳转页面
        submit(key) {
            this.$emit('triggerClick', formatDat.submitData(this.tableData,this.ializationList), this.ruleForm.describe, key,this.id);
        },
        //提交的资料
        transmit(arr, id, lawsuitName) {
            this.tableData.forEach((_item, index) => {
                if (_item.id == id && _item.lawsuitName == lawsuitName) {
                    this.$set(this.tableData, index, { ..._item, jsonData: arr });
                };
            });
            console.log(this.tableData,'看看结果');
        },
        //修改资料
        amend(e) {
            this.$refs.setDatum.amendClick(e.jsonData, e.id, e.lawsuitName);
        },
    }
}
</script>
<style lang="less" scoped>
.majorStructure {
    background-color: #fff;
    margin-top: 20px;
    padding: 0 58px 58px 58px;

    .headerClass {
        height: 70px;
        border-bottom: 1px solid #E9E9E9;
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .fragment {
            height: 27px;
            width: 6px;
            background: #096DD9;
            margin-right: 20px;
        }

        .newVersion {
            color: #096DD9;
            margin-right: 20px;
        }

        .versionNumber {
            background-color: #1890FF;
            width: 70px;
            height: 22px;
            border-radius: 11px;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            font-weight: bold;
            margin-right: 20px;
        }

        .dateClass {
            margin-right: 40px;
            font-size: 14px;
            font-weight: bold;
        }

        .describeClass {
            margin-right: 40px;
            font-size: 14px;
            font-weight: bold;
        }

        .operationClass {
            margin-right: 40px;
            font-size: 14px;
            font-weight: bold;
        }

        .stateClass {
            margin-right: 40px;
            font-size: 14px;
            font-weight: bold;
        }

        .stateClass1 {
            margin-right: 40px;
            font-size: 14px;
            font-weight: bold;
            color: red
        }
    }

    .pleaseChooseClass {
        color: #FA8C16;
        text-decoration: underline;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .contentManagement {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .contentClass {
            width: 60%;
        }

        .butClass {
            width: 40%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .describeClass1 {
        margin-top: 20px;
    }

    .buttonClass {
        margin-top: 20px;
        font-size: 14px;
        display: flex;
        justify-content: center;

        .saveClass {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 124px;
            height: 45px;
            background-color: #BAE7FF;
            color: #096DD9;
            margin-right: 20px;
            font-weight: 500;
            border-radius: 5px;
        }

        .affirmClass {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 208px;
            height: 45px;
            background-color: #1890FF;
            color: #fff;
            font-weight: 500;
            border-radius: 5px;
        }
    }
}

.titNameClass {
    color: #096DD9;
    font-size: 14px;
    font-weight: bold;
}

.mainNameClass {
    margin-right: 10px;
    align-items: center;
    display: flex;
    font-size: 14px;
    font-weight: bold;
}
</style>