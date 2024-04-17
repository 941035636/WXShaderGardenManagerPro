<template>
  <div id="branchList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="机构名称" />
            <el-input v-model="ruleForm.orgName" size="small" class="w300" placeholder="请输入" />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="信用代码" />
            <el-input v-model="ruleForm.businessCode" size="small" class="w300" placeholder="请输入" />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">经营地址：</span>
            <el-cascader class="w300" v-model="areaCascaser" :options="areaList" :props="{ checkStrictly: true }"
              clearable filterable placeholder="请选择地区" style="line-height: 40px"></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select v-model="ruleForm.status" class="w300" clearable placeholder="请选择">
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button class="ml20" type="primary" shape="round" @click="seach">查询</el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <el-button v-if="$hasBtn('service-add')" type="primary" class="ml20" @click="add">新增</el-button>
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table class="elTable" :data="tableList" border header-row-class-name="headName"
          :header-cell-style="getRowClass">
          <el-table-column prop="orgName" label="机构信息" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.orgName }}({{ scope.row.businessCode }})</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="经营地址" width="300px">
            <template slot-scope="scope">
              <div>{{ scope.row.provinceName }}/{{ scope.row.cityName }}/{{ scope.row.countryName }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="expertNum" label="技术人员" width="150px" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>共{{ scope.row.expertNum }}人</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="130" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" active-value="1"
                inactive-value="0" @change="changStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="操作时间" width="200px" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.createByName }}</p>
                <p>{{ scope.row.updateTime }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="180px">
            <template slot-scope="scope">
              <el-button v-if="$hasBtn('service-detail')" type="text" class="detailBtn" @click="detail(scope.row)">
                查看
              </el-button>
              <el-dropdown trigger="click">
                <el-button type="text" class="moreBtn ml20">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="$hasBtn('service-update')" class="color-red"
                    @click.native="update(scope.row)">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$hasBtn('service-delete')" class="color-red" @click.native="delet(scope.row)">
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$hasBtn('service-relation')" class="color-red"
                    @click.native="relation(scope.row)">
                    关联专家
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background layout="prev, pager, next" :total="total" :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"></el-pagination>
      <relation ref="relationExpert" :role-data="ruleForm" />
      <ArtisanInfo ref="artisanInfo"></ArtisanInfo>
      <Add ref="addIns" @refresh="initData" />
      <Detail ref="detail"></Detail>
    </div>
  </div>
</template>

<script>
import {
  getBranchList,
  putBranch,
  delServiceOrg,
} from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import Add from '../components/AddOrAlter.vue'
import Relation from '@/views/userData/safety/relation'
import ArtisanInfo from '../components/ArtisanInfo.vue'
import Label1 from '@/components/label/index'
import Detail from '../components/detail.vue'
export default {
  name: 'InsuranceList',
  components: {
    Relation,
    ArtisanInfo,
    Label1,
    Add,
    Detail,
  },
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        status: '',
        orgName: '',
        businessCode: '', // 社会信用代码
        desc: false,
        orderby: '',
        type: '02',
        provinceCode: '',
        cityCode: '',
        countryCode: '',
        servicename: 'safetyOrganizationSvc',
      },
      // 时间数组
      dateArray: [],
      tableList: [],
      areaCascaser: [],
      total: 0,
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.getBranchList()
    },
    async getBranchList() {
      // 初始化列表
      let res = await getBranchList(this.ruleForm)
      console.log(res)
      if (res.code === '0000') {
        this.tableList = res.list.map((item) => {
          item.provinceName = this.areaMap[item.provinceCode]
          item.cityName = this.areaMap[item.cityCode]
          item.countryName = this.areaMap[item.countryCode]

          console.log(item.streetName)
          if (item.status) {
            item.status = item.status.toString()
          }
          return item
        })
        this.total = res.total
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;'
      } else {
        return ''
      }
    },
    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countryCode = this.areaCascaser[2] || ''
      this.getBranchList()
    },
    detail(row) {
      this.$refs.detail.dialogVisible = true
      this.$refs.detail.code = row.id
    },
    update(row) {
      this.$refs.addIns.id = row.id
      this.$refs.addIns.dialogVisible = true
    },
    async delet(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await delServiceOrg('safetyOrganizationSvc', row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.getBranchList()
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    add() {
      this.$refs.addIns.dialogVisible = true
      return
      this.$router.push({
        path: 'serviceAdd',
      })
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getBranchList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        status: '',
        orgName: '',
        businessCode: '',
        desc: false,
        orderby: '',
        type: '02',
        provinceCode: '',
        cityCode: '',
        countryCode: '',
        servicename: 'safetyOrganizationSvc',
      }
      this.areaCascaser = []
      this.getBranchList()
    },
    relation(val) {
      // 打开专家关联弹窗
      // this.$refs.relationExpert.id = val.id // 选中当前数据id
      // this.$refs.relationExpert.servicename = 'safetyOrganizationSvc' // 请求接口标识
      // this.$refs.relationExpert.dialogVisible = true
      this.$refs.artisanInfo.dialogVisible = true
      this.$refs.artisanInfo.servicename = 'safetyOrganizationSvc'
      this.$refs.artisanInfo.id = val.id
      this.$refs.artisanInfo.orgName = val.orgName
      this.$refs.artisanInfo.orgId = val.id
    },
    async changStatus(row) {
      // 修改状态
      console.log(row)
      let data = {
        servicename: 'safetyOrganizationSvc',
        id: row.id,
        dataStatus: row.status,
      }
      let res = await putBranch(data)
      if (res.code === '0000') {
        this.$baseMessage('成功', 'success')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#branchList {
  .drdown {
    margin-left: 20px;
    color: #5470c6;
    cursor: pointer;
  }

  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }

  .teble-list {
    margin: 8px 20px 20px 20px;
  }

  .elTable {
    p {
      margin: 0
    }
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
