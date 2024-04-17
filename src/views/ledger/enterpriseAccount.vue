<template>
  <div id="policyLedger">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">企业名称：</span>
            <el-input
              maxlength="50"
              v-model="ruleForm.custFullName"
              size="small"
              placeholder="请输入企业名称"
              class="w300"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="统一社会信用代码：" />
            <!-- <span class="item3">统一社会信用代码：</span> -->
            <el-input
              v-model="ruleForm.blCode"
              size="small"
              class="w300"
              placeholder="请输入统一社会信用代码"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">行业分类：</span>
            <el-cascader
              v-model="nationalEconomyClassificationId"
              filterable
              placeholder="请选择行业分类"
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
            <span class="item3">所在区域：</span>
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
            <span class="item3">经营状态：</span>
            <el-select
              v-model="ruleForm.orgStatus"
              filterable
              placeholder="请选择经营状态"
              class="w300"
              clearable
            >
              <el-option
                v-for="(item, index) in orgStatusList"
                :key="index"
                :value="item.orgCode"
                :label="item.orgName"
              ></el-option>
            </el-select>
          </div>
        </el-col>

        <!-- <el-col :span="8">
          <div style="display: flex">
            <span class="item3">所属年份：</span>
            <el-date-picker
              class="w300"
              :clearable="false"
              v-model="ruleForm.belongToYear"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
            ></el-date-picker>
          </div>
        </el-col> -->
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">状态：</span>
            <el-select
              v-model="ruleForm.dataStatus"
              filterable
              placeholder="请选择状态"
              class="w300"
              clearable
            >
              <el-option
                v-for="(item, index) in stetaListdialog"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="spread" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">机构类型：</span>
            <el-select
              v-model="ruleForm.belongToOrgType"
              class="w300"
              clearable
              filterable
              placeholder="请选择机构类型"
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
            <span class="item3">企业类型：</span>
            <el-select
              v-model="ruleForm.businessType"
              filterable
              placeholder="请选择企业类型"
              class="w300"
              clearable
            >
              <el-option
                v-for="(item, index) in businessTypeList"
                :key="index"
                :value="item.orgCode"
                :label="item.orgName"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">是否在保：</span>
            <el-select
              v-model="ruleForm.underGuarantee"
              filterable
              placeholder="请选择是否在保"
              class="w300"
              clearable
            >
              <el-option
                v-for="(item, index) in underGuaranteeList"
                :key="index"
                :value="item.orgCode"
                :label="item.orgName"
              ></el-option>
            </el-select>
          </div>
        </el-col>

        <!-- <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目名称：</span>
            <el-input
              maxlength="50"
              v-model="ruleForm.projectName"
              size="small"
              placeholder="请输入项目名称"
              class="w300"
              clearable
            />
          </div>
        </el-col> -->

        <!-- <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目地址：</span>
            <el-cascader
              v-model="areaCascaser1"
              filterable
              class="w300"
              :options="areaList"
              :props="{ checkStrictly: true }"
              clearable
            ></el-cascader>
          </div>
        </el-col> -->
      </el-row>
      <!-- <p class="iconBell">    于11.6日 因为需求变更不在需要
        <i class="el-icon-bell"></i>
        是否在保和是否有效系统暂不支持筛选，如有需要请导出后自行筛选
      </p> -->
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
      <!-- <el-row>
        <el-col :span="22">
          <div class="mt8">
            <span class="searchList">查询列表</span>
            <span class="totNum ml15">共{{ total }}条记录</span>
          </div>
        </el-col>
      </el-row> -->

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
          <el-table-column label="企业信息" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>企业名称：{{ scope.row.custFullName }}</p>
              <p>统一社会信用代码：{{ scope.row.blCode }}</p>
              <p>
                所在区域：{{ scope.row.provinceName }}/{{
                  scope.row.cityName
                }}/{{ scope.row.countyName }}
              </p>

              <!-- <p v-if="scope.row.projectName">
                项目名称：{{ scope.row.projectName }}
              </p>

              <p v-if="scope.row.projectProvinceName">
                项目地址：{{ scope.row.projectProvinceName }}/{{
                  scope.row.projectCityName
                }}/{{ scope.row.projectCountyName }}
              </p> -->
            </template>
          </el-table-column>
          <el-table-column
            label="行业分类/国民行业"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>行业类型： {{ scope.row.industryNameTwo }}</p>
              <p>国民经济行业：{{ scope.row.economyFieldNameTwo }}</p>
              <p>
                经营范围：
                <span
                  @click="open(scope.row)"
                  style="color: #fa843b; cursor: pointer"
                >
                  查看经营范围
                </span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            width="230"
            label="企业类型/经营状态/所属年份"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>
                {{ scope.row.businessType == '01' ? '应保' : '鼓励' }}
              </p>
              <p>
                {{ scope.row.orgStatus }}
              </p>
              <p>
                {{ scope.row.belongToYear }}
              </p>
            </template>
          </el-table-column>
          <el-table-column width="150" label="状态" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.dataStatus == true ? '有效' : '无效' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column width="150" label="是否在保" align="center">
            <template slot-scope="scope">
              <span v-if="!scope.row.underGuarantee"></span>

              <span v-if="scope.row.underGuarantee">
                {{ scope.row.underGuarantee }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="机构名称/机构类型" width="150">
            <template slot-scope="scope">
              <p v-if="!scope.row.belongToOrgName">机构名称：---</p>
              <p v-if="scope.row.belongToOrgName">
                机构名称：{{ scope.row.belongToOrgName }}
              </p>
              <p v-if="!scope.row.belongToOrgType">机构类型：---</p>
              <p v-if="scope.row.belongToOrgType">
                机构类型：{{ scope.row.belongToOrgType }}
                <!-- 机构类型：{{
                  enumObj.SupervisionOrgTypeEnum.find(
                    (item) => item.strCode == scope.row.belongToOrgType
                  ).label
                }} -->
                <!-- 机构类型：{{ scope.row.governmentType }} -->
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
import { getAreaDetail } from '@/api/Areas'
import { dictItem, getIntrilute } from '@/api/policyManagement'
import { organiList, downloadTz } from '@/api/userDataManagement'
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
      ruleForm: {
        pn: 1,
        ps: 10,
        custFullName: '', //企业名称
        projectName: '',//项目名称
        blCode: '',//统一社会信用代码
        belongToYear: '',// new Date().getFullYear() + '',//年份
        provinceName: '',//所在区域省
        cityName: '',//所在区域市
        countyName: '',//所在区域区
        provinceCode: '',//所在区域省 code
        cityCode: '',//所在区域市code
        countyCode: '',//所在区域区code
        industryNameTwo: '',//行业分类二级
        industryNameOne: '',//行业分类一级
        industryOne: '',//行业分类一级code
        industryTwo: '',//行业分类二级code
        orgStatus: '',//经营状态
        projectProvinceName: '',//项目地址省
        projectProvinceCode: '',//项目地址省code
        projectCityName: '',//项目地址市
        projectCityCode: '',//项目地址市code
        projectCountyName: '',//项目地址区
        projectCountyCode: '',//项目地址区code
        belongToOrgType: '',//机构类型
        underGuarantee: '',//是否在保
        dataStatus: '',//状态 有效无效
      },
      areaCascaser: [],//所在区域合集
      areaCascaser1: [],//项目地址合集
      nationalEconomyClassificationId: [],//行业分类合集
      orgStatusList: [{//经营状态合集
        orgCode: 1,
        orgName: '存续（在营、开业、注册)'
      },
      {
        orgCode: 2,
        orgName: '吊销，未注销'
      },
      {
        orgCode: 3,
        orgName: '吊销，已注销'
      },
      {
        orgCode: 4,
        orgName: '注销'
      },
      {
        orgCode: 5,
        orgName: '撤销'
      },
      {
        orgCode: 6,
        orgName: '迁出'
      },
      {
        orgCode: 9,
        orgName: '其他'
      },
      ],
      underGuaranteeList: [
        {
          orgCode: true,
          orgName: '是'
        },
        {
          orgCode: false,
          orgName: '否'
        },
      ],
      businessTypeList: [
        {
          orgCode: '01',
          orgName: '应保'
        },
        {
          orgCode: '02',
          orgName: '鼓励'
        },
      ],
      stetaListdialog: [
        {
          label: '有效',
          value: true,
        },
        {
          label: '无效',
          value: false,
        },
      ],
      industryData: [], //行业分类
      spread: false, //控制展开收起
      // instiList: [],
      total: 0,
      value: '',
      companyList: [],
      dataList: [],
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      enumObj: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getIndustryData() //获取行业分类
    },
    async getIndustryData() {
      // 获取行业领域数据
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async search() {// 查询按钮
      console.log(this.areaCascaser, 'this.areaCascaser');
      console.log(this.nationalEconomyClassificationId, 'nationalEconomyClassificationId');
      console.log(this.orgStatusList, 'orgStatusList');
      // if (this.ruleForm.belongToYear == null) {
      //   this.$baseMessage('查询条件年份不能为空', 'warning')
      //   return
      // }
      //所在区域
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      //行业分类
      this.ruleForm.industryOne =
        this.nationalEconomyClassificationId[0] || ''
      this.ruleForm.industryTwo =
        this.nationalEconomyClassificationId[1] || ''
      //项目地址
      this.ruleForm.projectProvinceCode = this.areaCascaser1[0] || ''
      this.ruleForm.projectCityCode = this.areaCascaser1[1] || ''
      this.ruleForm.projectCountyCode = this.areaCascaser1[2] || ''
      await this.getRuleForm()
      this.getList()
    },
    getRuleForm() {
      // this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      // this.ruleForm.cityCode = this.areaCascaser[1] || ''
      // this.ruleForm.countyCode = this.areaCascaser[2] || ''
      // this.ruleForm.areaCode = this.areaCascaser[3] || ''
      // this.ruleForm.firstIndustryCode =
      //   this.nationalEconomyClassificationId[0] || ''
      // this.ruleForm.secondIndustryCode =
      //   this.nationalEconomyClassificationId[1] || ''

      // this.ruleForm.signTimeEnd = this.dateArray[1] || ''
      // if (this.ruleForm.businessOrgId) {
      //   let obj = this.instiList.find((item) => {
      //     return item.id == this.ruleForm.businessOrgId
      //   })
      //   this.ruleForm.businessOrgType = obj.orgType || ''
      // }
    },
    async getList() {
      let res = await organiList(this.ruleForm)
      if (res.code === '0000') {
        this.total = res.total
        this.dataList = res.list
      }
    },
    reset() {
      this.ruleForm = {
        pn: 1,
        ps: 10,
        custFullName: '', //企业名称
        projectName: '',//项目名称
        blCode: '',//统一社会信用代码
        belongToYear: '',// new Date().getFullYear() + '',//年份
        provinceName: '',//所在区域省
        cityName: '',//所在区域市
        countyName: '',//所在区域区
        provinceCode: '',//所在区域省 code
        cityCode: '',//所在区域市code
        countyCode: '',//所在区域区code
        industryNameTwo: '',//行业分类二级
        industryNameOne: '',//行业分类一级
        industryOne: '',//行业分类一级code
        industryTwo: '',//行业分类二级code
        orgStatus: '',//经营状态
        projectProvinceName: '',//项目地址省
        projectProvinceCode: '',//项目地址省code
        projectCityName: '',//项目地址市
        projectCityCode: '',//项目地址市code
        projectCountyName: '',//项目地址区
        projectCountyCode: '',//项目地址区code
        belongToOrgType: '',//机构类型
      },
        this.areaCascaser = [],//所在区域合集
        this.areaCascaser1 = [],//项目地址合集
        this.nationalEconomyClassificationId = [],//行业分类合集
        // this.orgStatusList = [],//经营状态合集
        // this.industryData = [], //行业分类
        // this.underGuaranteeList = [],//是否在保

        // instiList = [],

        this.companyList = [],
        this.getList()
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
    },
    open(row) {
      console.log(row, '1212112');
      this.$msgbox(row.businessScope, '经营范围', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
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
      await this.getRuleForm()

      this.ruleForm.ps = this.total
      let res = await downloadTz(this.ruleForm)
      console.log(res, '211111');
      let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      const fileName = `企业台账数据${date}.xls`
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
