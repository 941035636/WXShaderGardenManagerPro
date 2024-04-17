<template>
    <el-dialog class="ArtisanInfo" title="技术人员信息" :visible.sync="dialogVisible" :close-on-click-modal="false"
        width="70%" :before-close="handleClose" @close="close" @open="initData">
        <el-button type="primary" @click="addPeople" style="margin-bottom: 20px">添加人员</el-button>
        <el-table class="elTable" :data="tableExpertList" border header-row-class-name="headName" :header-cell-style="getRowClass">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="orgName" label="人员类型" width="120px" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                {{ scope.row.employTypeName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="基本信息" width="250px">
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.safetyTechniciansName || '--' }}/{{ scope.row.safetyTechniciansPhoneStr || '--' }}</p>
                <p>居民身份证：{{ scope.row.safetyTechniciansCertificateStr || '--' }}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="safetyTechniciansEducation1" label="学历专业" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.safetyTechniciansEducation1 || '--' }}/{{ scope.row.safetyTechniciansMajor || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="年限/职称" width="130" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.safetyTechniciansSeniority || '--' }}</div>
              <div>{{ scope.row.safetyTechnicians || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="serviceAccidentName" label="主要服务项目" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <p v-for="item in scope.row.serviceAccidentName" :key="item">{{ item }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="serviceIndustryName" label="主要服务行业领域" width="140px">
            <template slot-scope="scope">
              <div>
                <p v-for="item in scope.row.serviceIndustryName" :key="item">{{ item }}</p>
              </div>
            </template>
          </el-table-column>
            <el-table-column label="状态" align="center" width="100px">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.expertStatus" active-color="#13ce66" inactive-color="#ff4949"
                        :active-value="1" :inactive-value="0" @change="changStatus(scope.row)"></el-switch>
                </template>
            </el-table-column>


            <el-table-column label="操作" fixed="right" align="center" width="110px">
                <template slot-scope="scope">
                    <el-button v-if="$hasBtn('organization-update')" type="text" class="updateBtn"
                        @click="update(scope.row)">
                        修改
                    </el-button>
                    <el-button v-if="$hasBtn('safety-delete')" type="text" class="deleteBtn"
                        @click.native="delet(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <AddArtisan ref="addArtisan"></AddArtisan>
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="expertForm.pn"
            @current-change="handleCurrentChange"></el-pagination>
        <add ref="add" @successCb="getOrgExpertDetail"></add>
    </el-dialog>
</template>

<script>
import {
    getLinkExpertList,
    postOrgExpert,
    delLinkExpert,
    getOrgExpertDetail,
    delExpertInfo,
    putExpertinfo,
} from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import AddArtisan from './AddArtisan.vue'
import Add from '@/views/userData/safety/components/add'
export default {
    name: 'Relation',
    components: { AddArtisan, Add },
    props: {
        roleData: {
            type: Object,
            requires: true,
            default: () => {
                return {}
            },
        },
    },
    data() {
        return {
            dialogVisible: false,
            addList: [],
            total: 0,
            ruleFormRight: {
                pn: 1,
                ps: 999,
            }, // 右边条件
            servicename: '', // 标识（接口入参使用）
            id: '', // 接口入参使用
            multipleSelectionLeft: [],
            multipleSelectionRight: [],
            tableDataLeft: [],
            tableDataRight: [],
            cancleList: [], //取消提交数据
            cancleList2: [],
            totalLeft: 0,
            totalRight: 0,
            tableList: [],
            tableExpertList: [],
            expertForm: {
                ps: 10,
                pn: 1,
            },
            orgName: '',
            orgId: '',
            expertEmployTypeEnum: [],
        }
    },
    computed: {
        ...mapGetters({
            areaList: 'areas/areaList',
            areaListAll: 'areas/areaListAll',
            areaMap: 'areas/areaMap',
            getStrEnumAll: 'enums/getStrEnumAll',
        }),
    },
    methods: {
        addPeople() {
            this.$refs.addArtisan.dialogVisible = true
            this.$refs.addArtisan.initData()
            this.$refs.addArtisan.orgName = this.orgName
            this.$refs.addArtisan.ruleForm.orgId = this.orgId
        },
        update(row) {
            this.$refs.add.dialogVisible = true
            this.$refs.add.orgName = this.orgName
            this.$refs.add.code = row.id
        },
        async delet(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    let res = await delExpertInfo(row.id)
                    if (res.code === '0000') {
                        this.$baseMessage('删除成功', 'success')
                        this.getOrgExpertDetail()
                    }
                })
                .catch(() => {
                    this.$baseMessage('已取消删除', 'info')
                })
        },
        async changStatus(row) {
            //改变状态
            console.log(row)
            let data = {
                id: row.id,
                dataStatus: row.expertStatus,
            }
            let res = await putExpertinfo(data)
            if (res.code === '0000') {
                this.$baseMessage('成功', 'success')
            }
        },
        async initData() {
            this.addList = []
            this.cancleList2 = []
            this.cancleList = []
            this.getOrgExpertDetail()
            this.expertEmployTypeEnum = this.getStrEnumAll.ExpertEmployTypeEnum
        },
        handleCurrentChange() {
            this.expertForm.pn = pn
            this.getOrgExpertDetail()
        },
        // 关闭dialog
        handleClose() {
            this.cancleSub()
            this.dialogVisible = false
        },
        close() {
            this.ruleFormRight = {
                name: '',
                roleCode: '',
                pn: 1,
                ps: 999,
            } // 右边条件
            this.multipleSelectionLeft = []
            this.multipleSelectionRight = []
            this.tableDataLeft = []
            this.tableDataRight = []
        },
        cancle() {
            this.cancleSub()
            this.dialogVisible = false
        },
        async cancleSub() {
            if (this.cancleList2.length) {
                let res = await postOrgExpert(this.cancleList2, this.servicename, this.id)
            }
        },
        async getOrgExpertDetail() {
            // 获取专家详细列表
            let res = await getOrgExpertDetail(this.expertForm, 'safetyOrganizationSvc', this.id)
            if (res.code == '0000') {
                res.list.map((item) => {
                    //拼接主要服务项目
                    if (item.serviceAccidentTypes) {
                        item.serviceAccidentName = item.serviceAccidentTypes.map((obj) => obj.serviceAccidentTypeName)
                    }
                    if(item.serviceIndustry) {
                        item.serviceIndustryName = item.serviceIndustry.split(',')
                    }
                    // 转换 自有/外聘
                    if (item.employType) {
                        item.employTypeName = this.expertEmployTypeEnum.find(item1 => item1.strCode == item.employType).label
                    }
                    //专家类型 1-保险机构 2-保险经纪机构 3-服务机构 4|空 - 个人
                    if (item.expertType && item.expertType != '4') {
                        item.expertTypeName = this.getStrEnumAll.ExpertTypeEnum.find((it) => it.code == item.expertType).label
                    } else {
                        item.expertTypeName = '个人'
                    }
                    if (item.safetyTechniciansPost) {
                        item.safetyTechnicians = this.getStrEnumAll.SafetyTechniciansPostEnum.find(it => it.code == item.safetyTechniciansPost).label
                    }
                    if (item.safetyTechniciansPhone) {
                        item.safetyTechniciansPhoneStr = this.maskCodeFn(item.safetyTechniciansPhone, 3, 8)
                    }
                    if (item.safetyTechniciansCertificate) {
                        item.safetyTechniciansCertificateStr = this.maskCodeFn(item.safetyTechniciansCertificate, 4, item.safetyTechniciansCertificate.length - 3)
                    }
                    if (item.safetyTechniciansCertificateType) {
                        item.safetyTechniciansCertificateTypeName = this.getStrEnumAll.CertificateTypeEnum.find(it => it.code == item.safetyTechniciansCertificateType).label
                    }
                })
                this.tableExpertList = res.list
                this.total = res.total
            }
        },
        async correUser() {
            let arr = this.multipleSelectionRight.map((item) => {
                return item.id
            })
            let res = await postOrgExpert(arr, this.servicename, this.id)
            if (res.code === '0000') {
                this.$baseMessage('关联专家成功', 'success')
                this.dialogVisible = false
            }
        },
        // 确认提交
        correUserConfirm() {
            if (this.multipleSelectionRight.length > 0) {
                this.$baseConfirm('确定要关联用专家？', '', () => {
                    this.correUser()
                }, () => { })
            } else {
                this.dialogVisible = false
            }
        },
        // 勾选框左侧
        handleSelectionChangeLeft(val) {
            this.multipleSelectionLeft = val
        },
        async delRight(val) {
            console.log(this.multipleSelectionRight, 'click')
            let that = this
            // 删除关联的专家
            this.$baseConfirm('确定要删除关联的专家？', '', () => {
                this.tableDataRight = this.tableDataRight.filter(item => item.id !== val.id)
                this.multipleSelectionRight = this.multipleSelectionRight.filter(item => item.id !== val.id)
                let result = this.addList.find(item => item == val.id)
                if (result) {
                    this.addList.splice(this.addList.findIndex((item) => item === val.id), 1)
                }
                let result2 = this.cancleList.find(item => item.id == val.id)
                if (result2) {
                    let result3 = this.cancleList2.find(item => item == val.id)
                    if (!result3) this.cancleList2.push(val.id)
                }
                this.delLikExpert(val)
            }, () => { }
            )
        },
        async delLikExpert(val) {
            // 删除关联专家接口请求
            let arr = []
            arr.push(val.id)
            let res = await delLinkExpert(arr, this.servicename, this.id)
            if (res.code == '0000') this.$baseMessage('删除成功', 'success')
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            return rowIndex == 0 ? 'background:#f5f5f5;' : ''
        },
        maskCodeFn(str, start, end) {
            const arr = str.split('')
            for (let i = start; i < end; i += 1) {
                arr[i] = '*'
            }
            return arr.join('')
        }
    },
}
</script>

<style lang="scss" scoped>
.contents {
    width: 80%;
    margin: 0 auto;
    line-height: 40px;
}
  .elTable {
    p {
      margin: 0
    }
  }


.switch {
    // display: flex;
    // overflow: hidden;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.left_in_rigth {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 90px;
}

.left_in {
    min-width: 450px;
    // float: left;
}

.seach_user {
    margin-bottom: 10px;
}

.seach {
    margin-left: 10px;
}
</style>
<style>
html body .el-table .headName .cell {
    font-weight: bold;
}
</style>
