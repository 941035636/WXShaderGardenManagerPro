<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex;">
            <span class="item3">姓名：</span>
            <el-input v-model="ruleForm.safetyTechniciansName" size="small" class="w300" placeholder="请输入姓名" />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所在单位：</span>
            <el-input v-model="ruleForm.safetyTechniciansCompany" size="small" class="w300" placeholder="请输入所在单位" />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select v-model="ruleForm.expertStatus" class="w300" clearable placeholder="请选择状态">
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
        <!-- <el-button v-if="$hasBtn('safety-add')" type="primary" @click="add">
          新增
        </el-button> -->
        <!-- <div class="icons-list">
          <span class="col-org">展开 <a-icon type="star" theme="filled"/></span>
          <span class="col-org">收起 <a-icon type="up"/></span>
        </div> -->
      </div>
    </div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <el-col :span="14" style="text-align: right"></el-col>
      </el-row>
      <div class="mt8">
        <el-table class="elTable" :data="tableList" border header-row-class-name="headName" :header-cell-style="getRowClass">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="safetyTechniciansName" label="姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="safetyTechniciansPhone" label="联系电话" show-overflow-tooltip>
            <template slot-scope="scope">
              <p v-if="scope.row.safetyTechniciansPhone">
                {{
                    scope.row.safetyTechniciansPhone.substr(0, 3) +
                    '****' +
                    scope.row.safetyTechniciansPhone.substr(7)
                }}
              </p>
              <p v-else>--</p>
            </template>
          </el-table-column>
          <el-table-column prop="safetyTechniciansCompany" label="所在机构" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{scope.row.safetyTechniciansCompany || '--'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="expertTypeName" label="机构类型" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column
            prop="safetyTechniciansCompany"
            label="所在单位"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.expertStatus" active-color="#13ce66" inactive-color="#ff4949"
                :active-value="1" :inactive-value="0" @change="changStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="updateByName" label="操作人" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <p>{{scope.row.createByName}}</p>
                <p>{{scope.row.updateTime}}</p>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="updateTime" label="操作时间" show-overflow-tooltip></el-table-column> -->

          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="$hasBtn('safety-detail')" type="text" class="detailBtn" @click="detail(scope.row)">
                查看
              </el-button>
              <el-dropdown  trigger="click">
                <el-button type="text" class="moreBtn ml10">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="$hasBtn('organization-update')" class="updateBtn" @click.native="update(scope.row)">
                    编辑
                  </el-dropdown-item>
                  <!-- <el-dropdown-item v-if="$hasBtn('safety-delete')" class="deleteBtn" @click.native="delet(scope.row)">
                    删除
                  </el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
               <!-- <el-button
                v-if="$hasBtn('safety-update')"
                type="text"
                class="updateBtn"
                @click="update(scope.row)"
              >
                编辑
              </el-button> -->
             <!-- <el-button
                v-if="$hasBtn('safety-delete')"
                class="deleteBtn"
                type="text"
                @click="delet(scope.row)"
              >
                删除
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background layout="prev, pager, next" :total="total" :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"></el-pagination>
    </div>
    <Detail ref="detail"></Detail>
    <Add ref="add"></Add>
  </div>
</template>

<script>
import {
  getExpertList,
  putExpertinfo,
  delExpertInfo,
} from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import Detail from '../components/detail.vue'
import Add from '../components/add.vue'
export default {
  name: 'SafetyList',
  components: {Detail, Add},
  data() {
    return {
      ruleForm: {
        pn: 1,
        ps: 10,
        expertType: '',
        name: '',
        expertStatus: '',
        orderby: '',
        desc: false,
      },
      tableList: [],
      typeData: [],
      total: 0,
    }
  },
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.getList()
    },
    async getList() {
      // 初始化列表查询
      let res = await getExpertList(this.ruleForm)
      this.typeData = this.getStrEnumAll.ExpertTypeEnum
      if (res.code === '0000') {
        this.tableList = res.list.map((item) => {
          if (item.serviceAccidentTypes) {
            //拼接主要服务项目
            item.serviceAccidentName = item.serviceAccidentTypes
              .map((obj) => {
                return obj.serviceAccidentTypeName
              })
              .join(',')
          }
          if (item.expertType && item.expertType != '4') {
            //专家类型 1-保险机构 2-保险经纪机构 3-服务机构 4|空 - 个人 ,
            item.expertTypeName = this.typeData.find(
              (it) => it.code == item.expertType
            ).label
          } else {
            item.expertTypeName = '个人'
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
      this.getList()
    },
    async delet(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        hj : '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await delExpertInfo(row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.getList()
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        expertType: '',
        name: '',
        expertStatus: '',
        orderby: '',
        desc: false,
      }
      this.getList()
    },
    detail(row) {
      this.$refs.detail.dialogVisible = true
      this.$refs.detail.code = row.id
      // this.$router.push({
      //   path: 'safetyDetails',
      //   query: {
      //     code: row.id,
      //   },
      // })
    },
    update(row) {
      // this.$router.push({
      //   path: 'safetyAdd',
      //   query: {
      //     code: row.id,
      //   },
      // })
      this.$refs.add.dialogVisible = true
                  this.$refs.add.orgName = this.orgName
            this.$refs.add.code = row.id

    },
    add(row) {
      this.$refs.add.dialogVisible = true
      this.$refs.add.code = row.id
      // this.$refs.add.orgName = row.orgName
      // this.$router.push({
      //   path: 'safetyAdd',
      // })
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
  },
}
</script>

<style lang="scss" scoped>
#userList {
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
