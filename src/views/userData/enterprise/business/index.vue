<template>
  <div id="userList">
    <div class="headTitle">
      <el-button size="mini" @click="back" class="mr20">返回上一级</el-button>
    </div>
    <div class="split"></div>
    <el-container style="height: 100%">
      <el-aside width="200px">
        <div class="tree_div">
          <p class="option">
            <span
              v-for="(item, index) in leftYear"
              :key="index"
              :class="activeYear == index ? 'activedYear' : ''"
              @click="changeleftYear(index, item)"
            >
              {{ item }}
            </span>
          </p>
        </div>
      </el-aside>
      <div class="elsearchHit"></div>
      <el-main>
        <div class="elsearch">
          <el-row class="row-bg">
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="企业名称" />
                <el-input
                  v-model="ruleForm.custFullName"
                  size="small"
                  class="w300"
                  maxlength="50"
                  clearable
                  placeholder="请输入企业名称"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="社会信用代码" />
                <el-input
                  v-model="ruleForm.blCode"
                  size="small"
                  class="w300"
                  clearable
                  placeholder="请输入统一社会信用代码"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="所属行业" />
                <el-cascader
                  v-model="ruleForm.companyIndystryIds"
                  filterable
                  placeholder="请选择所属行业"
                  class="w300"
                  clearable
                  :options="industryData"
                  :props="{
                    checkStrictly: true,
                    label: 'itemText',
                    value: 'itemValue',
                    children: 'sysDictItemEntitys',
                  }"
                ></el-cascader>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-bg">
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="经营状态" />
                <el-select
                  v-model="ruleForm.orgStatus"
                  class="w280"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in BusinesStatus"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="所在区域" />
                <el-cascader
                  v-model="areaCascaser"
                  class="w300"
                  :options="areaList"
                  :props="{ checkStrictly: true }"
                  placeholder="请选择地区"
                  clearable
                ></el-cascader>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="机构类型" />
                <el-cascader
                  v-model="belongToOrgTypeList"
                  filterable
                  placeholder="请选择"
                  class="w300"
                  clearable
                  :options="typeData"
                  :props="{
                    checkStrictly: true,
                    label: 'label',
                    value: 'strCode',
                    children: 'children',
                  }"
                ></el-cascader>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="spread" class="row-bg">
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="企业类型" />
                <el-select
                  v-model="ruleForm.businessType"
                  class="w300"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in getStrEnumAll.BusinessTypeEnum"
                    :key="index"
                    :label="item.label"
                    :value="item.strCode"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="是否有效" />
                <el-select
                  v-model="ruleForm.businessStatus"
                  class="w300"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in stetaList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div style="text-align: center" class="mt20">
                <el-button
                  class="ml20"
                  type="primary"
                  shape="round"
                  @click="seach"
                >
                  查询
                </el-button>
                <el-button class="ml20" shape="round" @click="reset">
                  重置
                </el-button>
                <el-button
                  v-if="!spread"
                  class="btn"
                  type="text"
                  @click="spread = true"
                >
                  展开
                  <i class="el-icon-arrow-up" />
                </el-button>
                <el-button
                  v-if="spread"
                  class="btn"
                  type="text"
                  @click="spread = false"
                >
                  收起
                  <i class="el-icon-arrow-down" />
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="teble-list">
          <div class="ml20 statusBlank">
            <span class="type">状态：</span>

            <p class="option">
              <span
                v-for="(item, index) in auditStatusSelectData"
                :key="index"
                :class="active == index ? 'actived' : ''"
                @click="changes(index, item.value)"
              >
                {{ item.label }}
              </span>
            </p>
          </div>
          <div class="mt8">
            <el-table
              :data="tableList"
              border
              header-row-class-name="headName"
              :header-cell-style="{
                background: '#f5f5f5',
                'text-align': 'center',
              }"
            >
              <el-table-column
                type="index"
                label="序号"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="custFullName"
                label="生产经营单位信息"
                align="left"
                min-width="140"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p class="fb">企业名称：{{ scope.row.custFullName }}</p>
                  <p>社会信用代码：{{ scope.row.blCode }}</p>

                  <p>
                    所在区域： {{ scope.row.provinceName }} /
                    {{ scope.row.cityName }} /
                    {{ scope.row.countyName }}
                  </p>
                  <p>行业类型：{{ scope.row.industryNameTwo }}</p>
                  <p>民国经济行业：{{ scope.row.economyFieldNameTwo }}</p>
                </template>
              </el-table-column>

              <el-table-column
                prop="companyIndustryName"
                label="企业类型/经营状态/所属年份/是否有效"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p style="color: #fa843b">
                    {{
                      scope.row.businessType == '01' ? '应保企业' : '鼓励企业'
                    }}
                  </p>
                  <p>{{ scope.row.orgStatus }}</p>
                  <p>{{ scope.row.belongToYear }}</p>
                  <p>
                    {{ scope.row.businessStatus == true ? '有效' : '无效' }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="lawMan"
                align="center"
                label="是否在保"
                min-width="40"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.insureStatus == 1 ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column
                min-width="110"
                align="center"
                label="创建机构名称/创建机构类型"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p>
                    机构名称：{{
                      scope.row.belongToOrgName
                        ? scope.row.belongToOrgName
                        : '---'
                    }}
                  </p>
                  <p>
                    机构类型：
                    {{
                      scope.row.belongToOrgType
                        ? typeData.find(
                            (item) => item.strCode == scope.row.belongToOrgType
                          ).label
                        : '---'
                    }}
                    <span v-if="scope.row.belongToOrgType == '02'">
                      /{{ scope.row.governmentType }}
                    </span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column width="140" align="center" label="操作">
                <template slot-scope="scope">
                  <p class="m0">
                    <el-button
                      v-if="$hasBtn('highRisk-detail')"
                      type="text"
                      class="detailBtn"
                      @click="detail(scope.row)"
                    >
                      查看
                    </el-button>
                  </p>
                  <el-dropdown
                    v-if="
                      $hasBtn('highRisk-update') || $hasBtn('highRisk-delete')
                    "
                    trigger="click"
                  >
                    <el-button type="text" class="moreBtn">更多</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-if="$hasBtn('highRisk-update')"
                        class="updateBtn"
                        @click.native="update(scope.row)"
                      >
                        编辑
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="$hasBtn('highRisk-delete')"
                        class="deleteBtn"
                        @click.native="delet(scope.row)"
                      >
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="ruleForm.pn"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
        <modify ref="modify" />
        <detail ref="detail" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Label1 from '@/components/label/index'
import modify from './component/modify.vue'
import detail from './component/detail.vue'
import {
  postOrgList,
  deleteList,
  getSupAuthority,
  yearLoadList
} from '@/api/userDataManagement'
import { dictItem } from '@/api/policyManagement'
import { mapGetters } from 'vuex'
import { CheckSocialCreditCode } from '@/utils/validate'
export default {
  name: 'highRiskbusiness',
  components: { detail, modify, Label1 },
  data() {
    return {
      spread: false, //控制展开收起
      auditStatusSelectData: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '否',
          value: '0',
        },
        {
          label: '是',
          value: '1',
        },
      ],
      activeYear: '0',
      active: '0',
      leftYear: [],//左边年份列表
      ruleForm: {
        pn: 1,
        ps: 10,
        custFullName: '',//企业名称
        blCode: '',//社会信用代码
        provinceCode: '',//省市区
        provinceName: '',//省市区
        cityCode: '',//省市区
        cityName: '',//省市区
        countyCode: '',//省市区
        countyName: '',//省市区
        companyIndystryIds: [],//所属行业
        industryOne: '',//所属行业一级分类
        industryTwo: '',//所属行业二级分类
        orgStatus: '',//经营状态
        businessType: '', //企业类型
        businessStatus: '',//是否有效
        insureStatus: '',//是否在保
        belongToYear: '', //年份
        belongToOrgType: '',//机构类型一集
        governmentType: ''//机构类型二级
      },
      belongToOrgTypeList: [],//机构类型
      typeData: [],
      BusinesStatus: [//经营状态
        {
          label: '存续（在营、开业、 注册）',
          value: '1',
        },
        {
          label: '吊销，未注销 ',
          value: '2',
        },
        {
          label: '吊销，已注销',
          value: '3',
        },
        {
          label: '注销',
          value: '4',
        },
        {
          label: '撤销',
          value: '5',
        },
        {
          label: '迁出',
          value: '6',
        },
        {
          label: '其他',
          value: '7',
        },
      ],
      // 时间数组
      allArea: [], //地区下拉框
      dateArray: [],
      tableList: [],
      roleData: [],
      roleType: window.sessionStorage.getItem('type'),
      areaCascaser: [], //地区数组
      manageData: [], //管理分类
      industryData: [], //管理分类
      supAreaList: [], // 政府监管机构地区
      total: 0,
      stetaList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '有效',
          value: 'true',
        },
        {
          label: '无效',
          value: 'false',
        },
      ],
      listData: {}
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
      enmuList: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.getUserType()
    this.yearLoadList()
    this.postOrgList()
    this.initData()
  },

  methods: {
    getUserType() {
      let userList = this.getStrEnumAll.UserTypeEnum
      let lista = this.getStrEnumAll.SupervisionOrgTypeEnum
      this.typeData = userList.map((item => {
        item['children'] = []
        if (item.strCode == '02') {
          item['children'] = lista
        }
        return item
      }))
    },
    changeBelong(e) {

    },
    async yearLoadList() {
      let res = await yearLoadList()
      console.log();
      if (res.code == '0000') {
        this.leftYear = res.list
        this.leftYear.unshift('全部')
      }
    },
    back() { // 返回上一级
      this.$router.go(-1)
    },
    changeleftYear(index, item) {
      this.activeYear = index
      if (index == 0) {
        this.ruleForm.belongToYear = ''
      } else {
        this.ruleForm.belongToYear = item
      }
      this.postOrgList()
    },
    changes(index, code) {
      this.active = index
      this.ruleForm.insureStatus = code
      this.postOrgList()
    },
    handChangeyear(e) {
      let strtime = JSON.stringify(e)
      this.ruleForm.belongToYear = strtime.substring(1, 5)
    },
    uploadUser() {
      console.log('we')
      this.$refs.fileRef.fileImportShow = true
    },
    async initData() {
      this.getIndustryData()
      console.log(this.roleType)
      if (this.roleType == '02') {
        this.getSupList()
      } else {
        this.getManageData()
      }
    },

    async getIndustryData() {
      //获取管理分类信息
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async getManageData() {
      //获取管理分类
      let res = await dictItem(true, 20006)
      if (res.code == '0000') {
        this.manageData = res.data
      }
    },
    async getSupList() {
      let res = await getSupAuthority()
      console.log(res, '1111')
      if (res.code == '0000') {
        this.supAreaList = res.data.areaVOS
        this.industryData = res.data.sysDictItemEntities
      }
    },
    async postOrgList() {
      let res = await postOrgList(this.ruleForm)
      console.log(res, 'postOrgList');
      if (res.code === '0000') {
        this.tableList = res.list
        this.total = res.total
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5,text-align:center'
      } else {
        return ''
      }
    },

    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      this.ruleForm.industryOne = this.ruleForm.companyIndystryIds[0] || ''
      this.ruleForm.industryTwo = this.ruleForm.companyIndystryIds[1] || ''
      this.ruleForm.belongToOrgType = this.belongToOrgTypeList[0]
      this.ruleForm.governmentType = this.belongToOrgTypeList[1] || ''
      if (
        this.ruleForm.blCode &&
        !CheckSocialCreditCode(this.ruleForm.blCode)
      ) {
        this.$baseMessage('请输入正确的社会信用代码', 'error')
        return
      }

      this.postOrgList()
    },
    detail(row) {
      this.$refs.detail.userCode = row.id
      this.$refs.detail.dialogVisible = true
    },
    update(row) {
      this.$refs.modify.dialogVisible = true
      this.$refs.modify.userCode = row.id
    },
    async delet(row) {
      this.$confirm('删除后统计大屏会更新，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          let res = await deleteList(row.id)
          if ((res.code = '0000')) {
            this.seach()
            this.$baseMessage('删除成功', 'success')
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.postOrgList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        custFullName: '',//企业名称
        blCode: '',//社会信用代码
        provinceCode: '',//省市区
        provinceName: '',//省市区
        cityCode: '',//省市区
        cityName: '',//省市区
        countyCode: '',//省市区
        countyName: '',//省市区
        companyIndystryIds: [],//所属行业
        industryOne: '',//所属行业一级分类
        industryTwo: '',//所属行业二级分类
        orgStatus: '',//经营状态
        businessType: '', //企业类型
        businessStatus: '',//是否有效
        insureStatus: '',//是否在保
        belongToYear: '', //年份
        belongToOrgType: '',//机构类型一集
        governmentType: ''//机构类型二级
      }
      this.belongToOrgTypeList = [],//机构类型
        this.areaCascaser = []
      this.postOrgList()
    },
  },
}
</script>

<style lang="scss" scoped>
.elsearchHit {
  width: 20px;
  background-color: #f6f8f9;
}
.tree_div {
  height: 100%;
  margin-right: 10px;
  // background: #fff;
  padding: 20px;
  // .elsearchHit {
  //   height: 100%;
  //   width: 20px;
  //   background-color: #f6f8f9;
  // }
  .option {
    display: inline-block;
    display: flex;
    flex-direction: column;
    span {
      margin: 15px 0;
      margin-left: 20px;
      text-align: center;
      padding: 0 20px;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      display: inline-block;
      color: #fa8c16;
      border-radius: 18px;
      border: 1px solid #fa8c16;
      box-sizing: border-box;
    }
    .activedYear {
      background-color: #ffe7ba;
      border: 1px solid #fa8c16;
      font-weight: 600;
    }
  }
}
#userList {
  .headTitle {
    display: flex;
    align-items: center;
    height: 50px;
    padding-left: 20px;
  }
  .split {
    height: 10px;
    background-color: #f6f8f9;
  }
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }
  .teble-list {
    margin: 20px;
  }
  .table-split {
    height: 20px;
    background-color: #f0f2f5;
  }
}
</style>
<style lang="scss">
html body .el-table .headName .cell {
  font-weight: bold;
}
#userList {
  .statusBlank {
    .type {
      vertical-align: inherit;
    }
    .option {
      display: inline-block;

      span {
        margin-left: 20px;
        text-align: center;
        padding: 0 20px;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        display: inline-block;
        color: #fa8c16;
        border-radius: 18px;
        border: 1px solid #fa8c16;
        box-sizing: border-box;
      }
      .actived {
        background-color: #ffe7ba;
        border: 1px solid #fa8c16;
        font-weight: 600;
      }
    }
  }
  .state-style {
    background-color: #ffffff;
    font-size: 16px;
    .is-active {
      background: #e6a23c;
      color: #fbfbfb !important;
      font-size: 16px;
      border-right-color: #e6a23c;
      border-left-color: #e6a23c;
    }
    .el-tabs__header {
      background-color: #ffffff;
      border-bottom: 2px solid #ffa940;
      margin: 0;
    }
    .el-tabs__content {
      display: none;
    }
    .el-tabs__item {
      padding: 0 35px;
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 16px;
      font-weight: 500;
      color: #101010;
      position: relative;
    }
  }
}
</style>
