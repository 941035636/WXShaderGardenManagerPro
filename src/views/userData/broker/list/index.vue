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
            <el-input v-model="ruleForm.businessCode" size="small" class="w300" placeholder="请输入信用代码" />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">经营地址：</span>
            <el-cascader v-model="areaCascaser" filterable class="w300" :options="areaList" style="line-height: 40px"
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
            <el-select v-model="ruleForm.status" class="w300" clearable placeholder="请选择性质">
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div class="ml20 text-center">
        <el-button class="ml20" type="primary" shape="round" @click="seach">
          查询
        </el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <el-button v-if="$hasBtn('broker-add')" type="primary" class="ml20" @click="add">
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
      </el-row>
      <div class="mt8">
        <el-table class="elTable" :data="tableList" border header-row-class-name="headName"
          :header-cell-style="getRowClass">
          <el-table-column prop="orgName" label="机构信息" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <p>{{ scope.row.orgName }}（{{ scope.row.businessCode }}）</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="经营地址" width="300px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.provinceName }}/{{ scope.row.cityName }}/{{ scope.row.countryName }}
            </template>
          </el-table-column>
          <el-table-column prop="orgTypeName" label="机构类型" width="150px" show-overflow-tooltip></el-table-column>
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
              <el-button v-if="$hasBtn('broker-detail')" type="text" class="detailBtn" @click="detail(scope.row)">
                查看
              </el-button>
              <el-dropdown trigger="click">
                <el-button type="text" class="moreBtn ml20">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="$hasBtn('broker-update')" class="color-red" @click.native="update(scope.row)">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item v-if="$hasBtn('broker-delete')" class="color-red" @click.native="delet(scope.row)">
                    删除
                  </el-dropdown-item>
                  <!-- <el-dropdown-item v-if="$hasBtn('broker-relation')" @click.native="relation(scope.row)">
                    关联专家
                  </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <el-button type="text" @click="update(scope.row)">编辑</el-button>
              <el-button
                class="color-red"
                type="text"
                @click="delet(scope.row)"
              >
                删除
              </el-button>
              <el-button type="text" @click="relation(scope.row)">
                关联专家
              </el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background layout="prev, pager, next" :total="total" :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"></el-pagination>
      <relation ref="relationExpert" :role-data="ruleForm" />
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
import Label1 from '@/components/label/index'
import Relation from '@/views/userData/safety/relation'
import Detail from '../components/detail.vue'
export default {
  name: 'BrokerList',
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
        orgName: '',
        orgType: '',
        businessCode: '', // 社会信用代码
        status: '',
        desc: false,
        orderby: '',
        type: '02',
        provinceCode: '',
        cityCode: '',
        countryCode: '',
        servicename: 'insuranceBrokerSvc', // 服务机构表示，（接口使用）
      },
      tableList: [],
      total: 0,
      typeData: [],
      areaCascaser:[],
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
      // 列表初始化请求
      let res = await getBranchList(this.ruleForm)
      console.log(res)
      if (res.code === '0000') {
        this.tableList = res.list.map((item) => {
          item.provinceName = this.areaMap[item.provinceCode]
          item.cityName = this.areaMap[item.cityCode]
          item.countryName = this.areaMap[item.countryCode]
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
      // 查询按钮事件
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countryCode = this.areaCascaser[2] || ''
      this.getBranchList()
    },
    detail(row) {
      // 跳转服务机构详情
      this.$refs.detail.dialogVisible = true
      this.$refs.detail.code = row.id
      // this.$refs.detail.initData()
      // this.$router.push({
      //   path: 'brokerDetails',
      //   query: {
      //     code: row.id,
      //   },
      // })
    },
    update(row) {
      // 服务机构编辑跳转

      this.$refs.addIns.id = row.id
      this.$refs.addIns.dialogVisible = true
      return
      this.$router.push({
        path: 'brokerAdd',
        query: {
          code: row.id,
        },
      })
    },
    async delet(row) {
      // 删除接口请求
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await delServiceOrg('insuranceBrokerSvc', row.id)
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
      // 跳转添加页面
      this.$refs.addIns.dialogVisible = true
      return
      this.$router.push({
        path: 'brokerAdd',
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
        servicename: 'insuranceBrokerSvc',
      }
      this.areaCascaser = []
      this.getBranchList()
    },
    relation(val) {
      // 打开关联专家弹出
      this.$refs.relationExpert.id = val.id
      this.$refs.relationExpert.servicename = 'insuranceBrokerSvc'
      this.$refs.relationExpert.dialogVisible = true
    },
    async changStatus(row) {
      // 修改状态
      let data = {
        servicename: 'insuranceBrokerSvc',
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
