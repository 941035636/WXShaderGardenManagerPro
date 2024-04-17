<template>
  <div id="superviseList">
    <div class="superviseList-left">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      ></el-input>
      <el-tree
        ref="tree"
        :data="areaOptions"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        style="margin-top: 5px"
      ></el-tree>
    </div>
    <div class="superviseList-right">
      <div class="elsearch">
        <el-row class="row-bg">
          <el-col :span="8">
            <div style="display: flex">
              <span class="item3">机构名称：</span>
              <el-input
                v-model="ruleForm.name"
                size="small"
                class="w300"
                clearable
                placeholder="请输入应急局名称"
              />
            </div>
          </el-col>
          <el-col :span="8">
            <div style="display: flex">
              <span class="item3">机构类型：</span>
              <el-select
                v-model="ruleForm.orgType"
                class="w300"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in enumObj.SupervisionOrgTypeEnum"
                  :key="index"
                  :label="item.label"
                  :value="item.strCode"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div style="display: flex">
              <span class="item3">监管行业：</span>
              <el-select
                v-model="ruleForm.supervisionIndustry"
                class="w300"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in industryData"
                  :key="index"
                  :label="item.itemText"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div style="display: flex">
              <span class="item3">状态：</span>
              <el-select
                v-model="ruleForm.status"
                class="w300"
                clearable
                placeholder="请选择"
              >
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
          <el-button
            v-if="$hasBtn('supervise-add')"
            type="primary"
            class="ml20"
            @click="add"
          >
            新增
          </el-button>
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
          <el-col :span="14" style="text-align: right">
            <!-- <el-button
              v-if="$hasBtn('supervise-add')"
              class="ml20"
              @click="add"
            >
              新增
            </el-button> -->
          </el-col>
        </el-row>
        <div class="mt8">
          <el-table
            class="elTable"
            :data="tableList"
            border
            header-row-class-name="tableHead"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              prop="name"
              label="机构名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="管辖区域/监管行业" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>
                  {{ scope.row.provinceName }}
                  <span v-if="scope.row.cityName">
                    / {{ scope.row.cityName }}
                  </span>
                  <span v-if="scope.row.countryName">
                    / {{ scope.row.countryName }}
                  </span>
                  <span v-if="scope.row.streetName">
                    / {{ scope.row.streetName }}
                  </span>
                </span>
                <p>{{ scope.row.supervisionIndustry }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="contactName"
              label="联系人"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  <p v-if="scope.row.dutyStr">
                    {{ scope.row.contactName }}/{{ scope.row.dutyStr }}
                  </p>
                  <p v-else>-</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="80" align="center" label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1"
                  inactive-value="0"
                  @change="changStatus(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="操作时间"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  <p>{{ scope.row.createByName }}</p>
                  <p>{{ scope.row.updateTime }}</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                  v-if="$hasBtn('supervise-detail')"
                  type="text"
                  class="detailBtn"
                  @click="detail(scope.row)"
                >
                  查看
                </el-button>
                <el-dropdown trigger="click">
                  <el-button type="text" class="moreBtn ml20">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <!-- <el-dropdown-item v-if="$hasBtn('service-update')" @click.native="update(scope.row)">
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item v-if="$hasBtn('service-delete')" class="color-red"
                      @click.native="delet(scope.row)">
                      删除
                    </el-dropdown-item>
                    <el-dropdown-item v-if="$hasBtn('service-relation')" @click.native="relation(scope.row)">
                      技术人员
                    </el-dropdown-item> -->
                    <el-dropdown-item
                      v-if="$hasBtn('supervise-update')"
                      class="color-red"
                      @click.native="update(scope.row)"
                    >
                      修改
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="$hasBtn('supervise-delete')"
                      class="color-red"
                      @click="delet(scope.row)"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button v-if="$hasBtn('supervise-update')" type="text" class="updateBtn" @click="update(scope.row)">
                  修改
                </el-button>

                <el-button v-if="$hasBtn('supervise-delete')" type="text" class="deleteBtn" @click="delet(scope.row)">
                  删除
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="ruleForm.pn"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增账组件 -->
    <add-or-alter
      ref="addOrAlterRef"
      :role-data="roleData"
      :type-data="typeData"
      :AreaGZ="AreaGZ"
    />
    <!-- 详情组件 -->
    <ying-ji-ju-detail
      ref="YingJiJuDetail"
      :role-data="roleData"
      :type-data="typeData"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddOrAlter from './components/AddOrAlter.vue'
import YingJiJuDetail from './components/Detail.vue'
import { getYingJiZhanghaoList } from '@/api/userManagement'
import {
  delYingJiZhanghaol,
  addYingJiZhanghao,
  putYingJiZhanghao,
} from '@/api/userManagement'
import { updateUserStatus } from '@/api/userManagement'
import { getAreaDetail, getAreaInfo, getStreet } from '@/api/Areas'
import { dictItem } from '@/api/policyManagement'
export default {
  name: 'SuperviseList',
  components: {
    AddOrAlter,
    YingJiJuDetail,
  },
  data() {
    return {
      ruleForm: {
        contactName: '', //
        desc: true,
        name: '',
        orderby: '',
        pn: 1,
        ps: 10,
        status: '',
        provinceCode: '', // 管辖区域省编码
        cityCode: '', // 管辖区域市编码 ,
        countryCode: '', //管辖区域编码 ,
        streetCode: '', //管辖区街道编码
      },
      AreaGZ: [],
      areaOptions: [],
      tableList: [],
      roleData: [],
      dateArray: [],
      upDateArray: [],
      industryData: [],
      typeData: [
        {
          code: '00',
          label: '科员',
        },
      ],
      total: 0,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      filterText: '',
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      areaListAll: 'areas/areaListAll',
      areaMap: 'areas/areaMap',
      enumObj: 'enums/getStrEnumAll',
    }),
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    this.getList()
    this.getAllArea()
    this.getDictItem()
  },
  methods: {
    async getDictItem() {
      //获取管理分类信息
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async getAllArea() {
      //获取地区四级下拉框
      let res = await getAreaInfo(0, { levels: '1,2,3' })
      if (res.code == '0000') {
        this.AreaGZ = res.data
      }
      const { code, data } = await getAreaDetail(sysConfig.provice, 0, {
        levels: '1,2,3',
      })
      if (code == '0000') {
        this.areaOptions = data
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;'
      } else {
        return ''
      }
    },
    // 新增应急局账号
    add() {
      this.$refs.addOrAlterRef.dialogVisible = true
    },
    detail(row) {
      this.$refs.YingJiJuDetail.dialogVisible = true
      this.$refs.YingJiJuDetail.code = row.id
      // this.$refs.YingJiJuDetail.initData(row.id)
    },
    update(row) {
      this.$refs.addOrAlterRef.dialogVisible = true
      this.$refs.addOrAlterRef.id = row.id
      // this.$refs.addOrAlterRef.initData(row.id)
    },
    delet(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await delYingJiZhanghaol(row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.getList()
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    async changStatus(row) {
      let form = {
        id: row.id,
        dataStatus: row.status,
      }
      let res = await putYingJiZhanghao(form)
      if (res.code === '0000') {
        this.$baseMessage('成功', 'success')
      }
    },
    // 搜索条件
    async seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.getList()
    },
    // 初始化列表
    async getList() {
      let res = await getYingJiZhanghaoList(this.ruleForm)
      if (res.code === '0000') {
        this.tableList = res.list.map((item) => {
          let dutyName = this.typeData.find((v1) => item.duty === v1.code)
          item.dutyName = dutyName ? dutyName.label : ''
          if (item.addressAreaCode) {
            let provinceName =
              this.areaMap[
              item.addressAreaCode.substring(0, 2) + '0000000000'
              ] || ''
            let cityName =
              this.areaMap[item.addressAreaCode.substring(0, 4) + '00000000'] ||
              ''
            let countryName = ''
            if (item.addressAreaCode.substring(4, 6) != '00') {
              countryName = this.areaMap[item.addressAreaCode] || ''
            }
            item.addressAreaName = `${provinceName}${cityName}${countryName}`
          }
          if (item.duty) {
            item.dutyStr = this.typeData.find(
              (it) => it.code == item.duty
            ).label
          }
          return item
        })
        this.total = res.total
      }
    },
    // 地区树选中之后处理
    handleNodeClick(data) {
      console.log(data.value, 'data')
      this.ruleForm.provinceCode = ''
      this.ruleForm.cityCode = ''
      this.ruleForm.countryCode = ''
      this.ruleForm.streetCode = ''
      if (this.ruleForm.streetCode !== data.value) {
        if (data.value.substring(4, 6) != '00') {
          this.ruleForm.countryCode = data.value.slice(0, 6) + '000000' //管辖区域编码 ,
        }
        if (data.value.substring(6, 9) != '000') {
          this.ruleForm.streetCode = data.value //管辖区域街道编码 ,
        }
        if (data.value.substring(2, 4) != '00') {
          this.ruleForm.cityCode = data.value.slice(0, 4) + '00000000' // 管辖区域市编码 ,
        }
        if (data.value.substring(0, 2) != '00') {
          this.ruleForm.provinceCode = data.value.slice(0, 2) + '0000000000' // 管辖区域省编码
        }

        this.getList()
      }
    },
    // 地区树搜索处理的方法
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        desc: true,
        name: '',
        orderby: '',
        pn: 1,
        ps: 10,
        status: '',
        areaCode: '',
      }
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
#superviseList {
  display: flex;

  .superviseList-left {
    width: 200px;
    margin-top: 24px;
    padding-left: 10px;
  }

  .superviseList-right {
    width: 100%;

    .row-bg {
      margin-bottom: 8px;
      line-height: 40px;
    }

    .teble-list {
      margin: 8px 20px 20px 20px;
    }
  }

  .drdown {
    margin-left: 20px;
    font-size: 12px;
    color: #5470c6;
    cursor: pointer;
  }

  .elTable {
    p {
      margin: 0;
    }
  }
}
</style>
<style>
html body .el-table .tableHead .cell {
  font-weight: 800;
}
</style>
