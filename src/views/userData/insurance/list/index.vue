<template>
  <div id="branchList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="机构名称" />
            <el-input v-model="ruleForm.orgName" size="small" class="w300" placeholder="请输入名称" />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="信用代码" />
            <el-input v-model="ruleForm.businessCode" class="w300" size="small" placeholder="请输入信用代码" />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">经营地址：</span>
            <el-cascader v-model="areaCascaser" filterable class="w300" :options="areaList"
              :props="{ checkStrictly: true }" clearable placeholder="请选择地区"></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">机构类型：</span>
            <el-select v-model="ruleForm.orgType" class="w300" clearable placeholder="请选择类型">
              <el-option v-for="item in typeData" :key="item.code" :label="item.label" :value="item.code"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select v-model="ruleForm.status" class="w300" clearable placeholder="请选择状态">
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button type="primary" class="ml20" shape="round" @click="seach">
          查询
        </el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <el-button v-if="$hasBtn('insurance-add')" type="primary" @click="add">
          新增
        </el-button>
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table class="elTable" :data="tableList" header-row-class-name="headName" :header-cell-style="getRowClass" border
          style="width: 100%">
          <el-table-column prop="orgName" label="机构信息" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.orgName }}</p>
                <p>社会信用代码：{{ scope.row.businessCode }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="经营地址" width="300px">
            <template slot-scope="scope">
              <div>{{ scope.row.provinceName }}/{{ scope.row.cityName }}/{{ scope.row.countryName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="orgTypeName" label="机构类型" width="150px">
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
              <el-button v-if="$hasBtn('insurance-detail')" type="text" class="detailBtn" @click="detail(scope.row)">
                查看
              </el-button>
              <el-dropdown trigger="click">
                <el-button type="text" class="moreBtn ml20">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="$hasBtn('insurance-update')" class="color-red" @click.native="update(scope.row)">
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$hasBtn('insurance-delete')" class="color-red"
                    @click.native="delet(scope.row)">
                    删除
                  </el-dropdown-item>
                  <!-- <el-dropdown-item v-if="$hasBtn('insurance-relation')" @click.native="relation(scope.row)">
                    关联专家
                  </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <el-button type="text" @click="update(scope.row)">编辑</el-button>
              <el-button
                type="text"
                class="color-red"
                @click="delet(scope.row)"
              >
                删除
              </el-button>
              <el-button type="text" @click="relation(scope.row)">
                关联专家
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background layout="prev, pager, next" :total="total" :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"></el-pagination>
    </div>
    <relation ref="relationExpert" :role-data="ruleForm" />
    <Add ref="addIns" @refresh="initData" />
    <Detail ref="detail"></Detail>
  </div>
</template>

<script>
import {
  getBranchList,
  putBranch,
  delServiceOrg,
} from '@/api/userDataManagement'
import Label1 from '@/components/label/index'
import Relation from '@/views/userData/safety/relation'
import Add from '../components/AddOrAlter.vue'
import Detail from '../components/detail.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'InsuranceList',
  components: {
    Relation,
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
        orgType: '',
        businessCode: '', // 社会信用代码
        desc: false,
        orderby: '',
        type: '02',
        provinceCode: '',
        cityCode: '',
        countryCode: '',
        servicename: 'insuranceCompanySvc',
      },
      areaCascaser: [],
      tableList: [],
      total: 0,
      typeData: [],
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
      this.typeData = this.getStrEnumAll.OrganizationTypeEnum
      this.getBranchList()
    },
    async getBranchList() {
      // 获取列表数据
      let res = await getBranchList(this.ruleForm)
      console.log(res)
      if (res.code === '0000') {
        this.tableList = res.list.map((item) => {
          item.provinceName = this.areaMap[item.provinceCode]
          item.cityName = this.areaMap[item.cityCode]
          item.countryName = this.areaMap[item.countryCode]
          // this.getStrEnumAll.OrganizationTypeEnum
          item.orgTypeName = this.typeData.filter(item1 => item1.code == item.orgType)[0].label
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
      return
    },
    async delet(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await delServiceOrg('insuranceCompanySvc', row.id)
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
        path: 'insuranceAdd',
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
        orgType: '',
        businessCode: '',
        desc: false,
        orderby: '',
        type: '02',
        provinceCode: '',
        cityCode: '',
        countryCode: '',
        servicename: 'insuranceCompanySvc',
      }
      this.areaCascaser = []
      this.getBranchList()
    },
    relation(val) {
      // 打开专家关联弹窗
      console.log(this.$refs.relationExpert)
      this.$refs.relationExpert.id = val.id // 选择数据id
      this.$refs.relationExpert.servicename = 'insuranceCompanySvc' // 请求接口时表示
      this.$refs.relationExpert.dialogVisible = true
    },
    async changStatus(row) {
      // 修改状态请求
      let data = {
        servicename: 'insuranceCompanySvc',
        id: row.id,
        dataStatus: row.status,
        orgType: row.orgType,
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
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }

  .teble-list {
    margin: 8px 20px 20px 20px;
  }

  .el-cascader--small {
    line-height: 40px
  }

  .elTable {
    p {
      // line-height: 0;
      margin: 0!important;
    }
  }

}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
