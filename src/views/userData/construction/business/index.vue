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
                <Label1 long="项目名称" />
                <el-input
                  maxlength="100"
                  v-model="ruleForm.projectName"
                  placeholder="请输入项目名称"
                  class="w300"
                  clearable
                />
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
                <Label1 long="施工许可证号" />
                <el-input
                  maxlength="100"
                  v-model="ruleForm.licenseKey"
                  placeholder="请输入施工许可证号"
                  class="w300"
                  clearable
                />
              </div>
            </el-col>
          </el-row>
          <el-row class="row-bg">
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="项目状况" />
                <el-select
                  v-model="ruleForm.projectStatus"
                  class="w300"
                  clearable
                  placeholder="请选择项目状况"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="在建" value="01"></el-option>
                  <el-option label="不在建" value="02"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="施工单位" />
                <el-input
                  v-model="ruleForm.orgName"
                  class="w300"
                  maxlength="30"
                  placeholder="请输入施工单位"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="统一社会信用代码：" />
                <el-input
                  v-model="ruleForm.orgBlCode"
                  class="w300"
                  placeholder="请输入统一社会信用代码"
                />
              </div>
            </el-col>
          </el-row>
          <el-row v-if="spread" class="row-bg">
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="否购买安责险" />
                <el-select
                  v-model="ruleForm.isBuy"
                  class="w300"
                  clearable
                  filterable
                  placeholder="请选择是否购买安责险"
                >
                  <el-option
                    v-for="(item, index) in isBuys"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="建设单位" />
                <el-input
                  maxlength="30"
                  v-model="ruleForm.buildOrgName"
                  placeholder="请输入建设单位"
                  class="w300"
                  clearable
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="是否关联" />
                <el-select
                  v-model="ruleForm.isRelation"
                  class="w300"
                  clearable
                  placeholder="请选择是否关联"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display: flex">
                <Label1 long="是否在保" />
                <el-select
                  v-model="ruleForm.insureStatus"
                  filterable
                  placeholder="请选择是否在保"
                  class="w300"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in insureStatusList"
                    :key="index"
                    :value="item.orgCode"
                    :label="item.orgName"
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
          <el-row>
            <el-col :span="4">
              <div class="totNum ml15">
                <span class="searchList">查询列表</span>
                <span class="totNum ml15">共{{ total }}条记录</span>
              </div>
            </el-col>
            <el-col :span="20" style="text-align: right">
              <el-button round type="primary" @click="download">导出</el-button>
            </el-col>
          </el-row>
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
              <el-table-column label="项目信息" align="left" min-width="200">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="22">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.projectName"
                        placement="top"
                      >
                        <b class="row-factor cursor">
                          {{ scope.row.projectName }}
                        </b>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="2">
                      <el-button
                        type="text"
                        @click="copyFunction(scope.row.projectName)"
                      >
                        复制
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      scope.row.provinceName +
                      '/' +
                      scope.row.cityName +
                      '/' +
                      scope.row.countyName
                    "
                    placement="top"
                  >
                    <p class="row-factor1 cursor1">
                      项目地址：{{ scope.row.provinceName }}/{{
                        scope.row.cityName
                      }}/{{ scope.row.countyName }}
                    </p>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.licenseKey"
                    placement="top"
                  >
                    <p class="row-factor1 cursor1">
                      施工许可证号：{{ scope.row.licenseKey }}
                    </p>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.buildOrgName"
                    placement="top"
                  >
                    <p class="row-factor1 cursor1">
                      建设单位：{{ scope.row.buildOrgName }}
                    </p>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.supervisorOrgName"
                    placement="top"
                  >
                    <p class="row-factor1 cursor1">
                      监理单位：{{ scope.row.supervisorOrgName }}
                    </p>
                  </el-tooltip>
                  <p>工程总造价（万元）：{{ scope.row.totalProjectCost }}</p>
                  <p>工程总面积（㎡）：{{ scope.row.totalProjectArea }}</p>
                </template>
              </el-table-column>

              <el-table-column
                min-width="130"
                label="施工单位信息"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <p>{{ scope.row.orgName }}</p>
                  <p>{{ scope.row.orgBlCode }}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="projectStatusName"
                align="center"
                label="项目状况"
                min-width="70"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                min-width="70"
                label="是否购买安责险"
                align="center"
                prop="isBuy"
              >
                <template slot-scope="scope">
                  {{ scope.row.isBuy == true ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column width="100" label="是否关联" align="center">
                <template slot-scope="scope">
                  {{ scope.row.isRelation == true ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="insureStatusName"
                width="100"
                label="是否在保"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="belongToYear"
                align="center"
                label="所属年份"
                min-width="80"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                align="center"
                label="创建机构名称/创建机构类型"
                show-overflow-tooltip
                min-width="110"
              >
                <!-- <template slot-scope="scope">
                  <p v-if="!scope.row.belongToOrgName">机构名称：---</p>
                  <p v-if="scope.row.belongToOrgName">
                    机构名称：{{ scope.row.belongToOrgName }}
                  </p>
                  <p v-if="!scope.row.belongToOrgType">机构类型：---</p>
                  <p v-if="scope.row.belongToOrgType">
                    机构类型：{{ scope.row.belongToOrgType }}
                  </p>
                </template> -->
                <template slot-scope="scope">
                  <p class="row-factor1 cursor1">
                    机构名称：{{
                      scope.row.belongToOrgName
                        ? scope.row.belongToOrgName
                        : '---'
                    }}
                  </p>
                  <p class="row-factor1 cursor1">
                    机构类型：
                    {{
                      scope.row.belongToOrgType
                        ? typeData.find(
                            (item) => item.strCode == scope.row.belongToOrgType
                          ).label
                        : '---'
                    }}
                    <!-- <span v-if="scope.row.belongToOrgType == '02'">
                      /{{ scope.row.governmentType }}
                    </span> -->
                  </p>
                  <!-- <p
                    v-if="!scope.row.belongToOrgName"
                    class="row-factor1 cursor1"
                  >
                    机构名称：---
                  </p>
                  <p
                    v-if="scope.row.belongToOrgName"
                    class="row-factor1 cursor1"
                  >
                    机构名称：{{ scope.row.belongToOrgName }}
                  </p>
                  <p
                    v-if="!scope.row.belongToOrgType"
                    class="row-factor1 cursor1"
                  >
                    机构类型：---
                  </p>
                  <p
                    v-if="scope.row.belongToOrgType"
                    class="row-factor1 cursor1"
                  >
                    机构类型：{{
                      typeData.find(
                        (item) => item.strCode == scope.row.belongToOrgType
                      ).label
                    }}
                    <span
                      v-if="scope.row.belongToOrgType == '02'"
                      class="row-factor1 cursor1"
                    >
                      /{{ scope.row.governmentType }}
                    </span>
                  </p> -->
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <p class="m0">
                    <el-button
                      type="text"
                      class="updateBtn"
                      @click.native="update(scope.row)"
                    >
                      编辑
                    </el-button>
                  </p>
                  <p class="m0">
                    <el-button
                      type="text"
                      class="deleteBtn"
                      @click.native="delet(scope.row)"
                    >
                      删除
                    </el-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            background
            layout="total,sizes, prev, pager, next,jumper"
            :total="total"
            :page-sizes="[10, 20, 30, 40]"
            :current-page="ruleForm.pn"
            :page-size="ruleForm.ps"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
        <modify ref="modify" />
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Label1 from '@/components/label/index'
import modify from './component/modify.vue'
import { getSysDate } from '@/api/userManagement'
import {
  historiesList,
  deleteProject,
  getSupAuthority,
  getYearsList,
  downloadProject
} from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
import { CheckSocialCreditCode } from '@/utils/validate'
export default {
  name: 'projectManagement',
  components: { modify, Label1 },
  data() {
    return {
      spread: false, //控制展开收起
      isBuys: [
        {
          code: 1,
          name: '是',
        },
        {
          code: 0,
          name: '否',
        },
      ],
      insureStatusList: [
        {
          orgCode: 1,
          orgName: '是'
        },
        {
          orgCode: 0,
          orgName: '否'
        },
      ],
      activeYear: '0',
      leftYear: [],//左边年份列表
      areaCascaser: [], //地区数组
      ruleForm: {
        pn: 1,
        ps: 10,
        projectName: '',//项目名称
        licenseKey: '',//施工许正号,
        projectStatus: '',//项目状况
        orgName: '',//施工单位
        orgBlCode: '',//施工单位信用代码
        isBuy: '',//是否购买安责险
        buildOrgName: '',//建设单位
        isRelation: '',//是否关连
        provinceName: '',//所在区域省
        cityName: '',//所在区域市
        countyName: '',//所在区域区
        provinceCode: '',//所在区域省 code
        cityCode: '',//所在区域市code
        countyCode: '',//所在区域区code
      },
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
      enmuList: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.getYearsList()
    this.historiesList()
    this.getUserType()
  },

  methods: {
    // 复制文本
    copyFunction(context) {
      // 创建输入框元素
      let oInput = document.createElement('input');
      // 将想要复制的值
      oInput.value = context;
      // 页面底部追加输入框
      document.body.appendChild(oInput);
      // 选中输入框
      oInput.select();
      // 执行浏览器复制命令
      document.execCommand('Copy');
      // 弹出复制成功信息
      this.$message.success('复制成功');
      // 复制后移除输入框
      oInput.remove();
    },
    async download() {//导出
      let resT = await getSysDate()
      let date = null
      if (resT.code === '0000') {
        date = resT.data
      } else {
        this.$baseMessage('获取服务器时间失败，已改为获取系统时间', 'error')
        let newDate = new Date()
        date = newDate.toLocaleString()
      }
      this.ruleForm.ps = this.total
      let res = await downloadProject(this.ruleForm)
      let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      const fileName = `建筑施工项目${date}.xls`
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)
      this.ruleForm.ps = 10
    },
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
    async getYearsList() {
      let res = await getYearsList()
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
      this.historiesList()
    },
    handChangeyear(e) {
      let strtime = JSON.stringify(e)
      this.ruleForm.belongToYear = strtime.substring(1, 5)
    },
    async historiesList() {
      let res = await historiesList(this.ruleForm)
      console.log(res, 'historiesList');
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
      if (
        this.ruleForm.blCode &&
        !CheckSocialCreditCode(this.ruleForm.blCode)
      ) {
        this.$baseMessage('请输入正确的社会信用代码', 'error')
        return
      }
      this.historiesList()
    },
    update(row) {
      this.$refs.modify.ruleForm = JSON.parse(JSON.stringify(row))
      this.$refs.modify.ruleForm.areaCascaser = [row.provinceCode, row.cityCode, row.countyCode]
      this.$refs.modify.dialogVisible = true
    },
    async delet(row) {
      this.$confirm('删除后统计大屏会更新，请确认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          let res = await deleteProject(row.id)
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
      this.historiesList()
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.ruleForm.ps = val
      this.historiesList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        projectName: '',//项目名称
        licenseKey: '',//施工许正号,
        projectStatus: '',//项目状况
        orgName: '',//施工单位
        orgBlCode: '',//施工单位信用代码
        isBuy: '',//是否购买安责险
        buildOrgName: '',//建设单位
        isRelation: '',//是否关连
        provinceName: '',//所在区域省
        cityName: '',//所在区域市
        countyName: '',//所在区域区
        provinceCode: '',//所在区域省 code
        cityCode: '',//所在区域市code
        countyCode: '',//所在区域区code
      }

      this.areaCascaser = []
      this.historiesList()
    },
  },
}
</script>

<style lang="scss" scoped>
.row-factor {
  display: inline-block;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cursor {
  cursor: pointer;
}
.row-factor1 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cursor1 {
  cursor: pointer;
}
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
