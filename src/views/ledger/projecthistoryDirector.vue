<template>
  <div id="policyLedger">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">企业名称：</span>
            <el-input
              maxlength="50"
              v-model="ruleForm.projectName"
              size="small"
              placeholder="请输入企业名称"
              class="w300"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目地址：</span>
            <el-cascader
              v-model="areaCascaser"
              filterable
              class="w300"
              :options="areaList"
              :props="{ checkStrictly: true }"
              clearable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <!-- <span class="item3">施工许可证号：</span> -->
            <Label1 long="施工许可证号：" />
            <el-input
              maxlength="50"
              v-model="ruleForm.licenseKey"
              size="small"
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
            <span class="item3">项目状况：</span>
            <el-select
              v-model="ruleForm.projectStatus"
              class="w300"
              clearable
              size="small"
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
            <span class="item3">施工单位：</span>
            <el-input
              v-model="ruleForm.orgName"
              size="small"
              class="w300"
              placeholder="请输入施工单位"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="统一社会信用代码：" />
            <el-input
              v-model="ruleForm.orgBlCode"
              size="small"
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
            <span class="item3">建设单位：</span>
            <el-input
              maxlength="50"
              v-model="ruleForm.buildOrgName"
              size="small"
              placeholder="请输入建设单位"
              class="w300"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">是否关联：</span>
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
            <span class="item3">是否在保：</span>
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
      <el-row class="row-bg">
        <el-col :span="24" style="text-align: center">
          <el-button
            class="ml20"
            type="primary"
            shape="round"
            @click="search()"
          >
            查询
          </el-button>
          <el-button class="ml20" shape="round" @click="reset">重置</el-button>
          <el-button
            type="primary"
            @click="addPolicy"
            :disabled="dataList.length <= 0"
            v-if="$hasBtn('export-organization')"
          >
            导出
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
        </el-col>
      </el-row>
      <div class="ml20 text-center"></div>
    </div>

    <div class="elsearch_new">
      <el-row>
        <el-col :span="10">
          <span class="searchList">查询列表</span>
          <span class="totNum ml15">共{{ total }}条记录</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
          <span style="color: #fa364b; margin-right: 10px">
            <i class="el-icon-bell"></i>
            是否在保：当前时间是否在保单的起止日期之间
          </span>
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table
          :data="dataList"
          border
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
        >
          <el-table-column
            label="序号"
            align="left"
            width="50"
            type="index"
          ></el-table-column>
          <el-table-column label="项目信息" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{ scope.row.projectName }}</p>
              <p>
                项目地址：{{ scope.row.provinceName }}/{{
                  scope.row.cityName
                }}/{{ scope.row.countyName }}
              </p>
              <p>施工许可证号：{{ scope.row.licenseKey }}</p>
              <p>建设单位：{{ scope.row.buildOrgName }}</p>
              <p>监理单位：{{ scope.row.supervisorOrgName }}</p>
              <p>工程总造价（万元）：{{ scope.row.totalProjectCost }}</p>
              <p>工程总面积（㎡）：{{ scope.row.totalProjectArea }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="施工单位信息"
            align="left"
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
            min-width="50"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="150"
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
          <el-table-column label="操作">
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
              <p>
                机构名称：{{
                  scope.row.belongToOrgName ? scope.row.belongToOrgName : '---'
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
                <!-- <span v-if="scope.row.belongToOrgType == '02'">
                  /{{ scope.row.governmentType }}
                </span> -->
              </p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { constructionList, downloadExport } from '@/api/userDataManagement'
import { getSysDate } from '@/api/userManagement'
import { mapGetters } from 'vuex'
import TipsText from '@/components/TipsText'
import Label1 from '@/components/label/index'
export default {
  name: 'PolicyLedger',
  components: {
    TipsText,
    Label1
  },
  data() {
    return {
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
      ruleForm: {
        pn: 1,
        ps: 10,
        licenseKey: '',//施工许正号,
        projectStatus: '',//项目状况
        orgName: '',//施工单位
        orgBlCode: '',//施工单位信用代码
        isBuy: '',//是否购买安责险
        buildOrgName: '',//建设单位
        isRelation: '',//是否关连
        projectName: '', //企业名称
        provinceName: '',//所在区域省
        cityName: '',//所在区域市
        countyName: '',//所在区域区
        provinceCode: '',//所在区域省 code
        cityCode: '',//所在区域市code
        countyCode: '',//所在区域区code
      },
      areaCascaser: [],//所在区域合集
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
      spread: false, //控制展开收起
      total: 0,
      value: '',
      dataList: [],
      typeData: [],
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      enumObj: 'enums/getStrEnumAll',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.getUserType()
  },
  methods: {
    getUserType() {
      let userList = this.getStrEnumAll.UserTypeEnum
      let lista = this.getStrEnumAll.SupervisionOrgTypeEnum
      this.typeData = userList.map((item => {
        console.log(item, '111111');
        item['children'] = []
        if (item.strCode == '02') {
          item['children'] = lista
        }
        return item
      }))
    },
    async search() {// 查询按钮
      //所在区域
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      this.getList()
    },
    async getList() {
      let res = await constructionList(this.ruleForm)
      if (res.code === '0000') {
        this.total = res.total
        this.dataList = res.list
      }
    },
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        licenseKey: '',//施工许正号,
        projectStatus: '',//项目状况
        orgName: '',//施工单位
        orgBlCode: '',//施工单位信用代码
        isBuy: '',//是否购买安责险
        buildOrgName: '',//建设单位
        isRelation: '',//是否关连
        projectName: '', //企业名称
        provinceName: '',//所在区域省
        cityName: '',//所在区域市
        countyName: '',//所在区域区
        provinceCode: '',//所在区域省 code
        cityCode: '',//所在区域市code
        countyCode: '',//所在区域区code
      },
        this.areaCascaser = [],//所在区域合集
        this.insureStatusList = [],//是否在保
        this.getList()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
    },

    async addPolicy() { //导出
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
      let res = await downloadExport(this.ruleForm)
      console.log(res, '211111');
      let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      const fileName = `项目台账数据${date}.xls`
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      // link.href = res.data
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)
      this.ruleForm.ps = 10
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
#policyLedger {
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }
  .new_p {
    display: inline-block;
    padding: 0 7px;
    border: 1px solid #2ebc89;
    border-radius: 4px;
    background: #ebfdee;
    color: #2ebc89;
  }
  .old_p {
    display: inline-block;
    padding: 0 7px;
    border: 1px solid #00d1eb;
    border-radius: 4px;
    background: #ebfdfd;
    color: #00d1eb;
  }
}
.iconBell {
  color: red;
  margin-left: 20px;
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
html body .el-tooltip__popper {
  max-width: 500px;
}
html body .el-range-editor--small.el-input__inner {
  margin-top: 4px;
}
html body .el-cascader--small {
  line-height: 40px;
}
</style>
