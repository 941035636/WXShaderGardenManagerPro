<template>
  <el-dialog
    id="companyAdd"
    title="生产经营单位详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="80%"
    append-to-body
    @open="getInit"
  >
    <div id="highRiskDetails">
      <el-form label-position="left" label-width="142px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业名称：">
              <span v-if="data.custFullName && data.custFullName.length > 13">
                {{ data.custFullName.slice(0, 13) }}...
                <el-popover placement="top" width="300" v-model="visible3">
                  <p>{{ data.custFullName }}</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="visible3 = false"
                    >
                      确定
                    </el-button>
                  </div>
                  <el-button
                    type="text"
                    class="downloadfile ml5"
                    slot="reference"
                  >
                    更多
                  </el-button>
                </el-popover>
              </span>

              <span v-else>{{ data.custFullName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社会信用代码：">
              {{ data.blCode }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业执照：">
              <span
                v-if="data.businessLicenseFileId"
                @click="checkBsp"
                class="downloadfile"
              >
                查看附件
              </span>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营地址：">
              {{ address }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址：">
              <span v-if="data.detailAddress && data.detailAddress.length > 13">
                {{ data.detailAddress.slice(0, 13) }}...
                <el-popover placement="top" width="300" v-model="visible1">
                  <p>{{ data.detailAddress }}</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="visible1 = false"
                    >
                      确定
                    </el-button>
                  </div>
                  <el-button
                    type="text"
                    class="downloadfile ml5"
                    slot="reference"
                  >
                    更多
                  </el-button>
                </el-popover>
              </span>

              <span v-else>{{ data.detailAddress || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属行业：">
              <span v-if="manageName && manageName.length > 13">
                {{ manageName.slice(0, 13) }}...
                <el-popover placement="top" width="300" v-model="visible2">
                  <p>{{ manageName }}</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="visible2 = false"
                    >
                      确定
                    </el-button>
                  </div>
                  <el-button
                    type="text"
                    class="downloadfile ml5"
                    slot="reference"
                  >
                    更多
                  </el-button>
                </el-popover>
              </span>

              <span v-else>{{ manageName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="国民经济行业：">
              <span v-if="industryName && industryName.length > 13">
                {{ industryName.slice(0, 13) }}...
                <el-popover placement="top" width="300" v-model="visible4">
                  <p>{{ industryName }}</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="visible4 = false"
                    >
                      确定
                    </el-button>
                  </div>
                  <el-button
                    type="text"
                    class="downloadfile ml5"
                    slot="reference"
                  >
                    更多
                  </el-button>
                </el-popover>
              </span>

              <span v-else>{{ industryName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="从业人员总数：">
              {{ data.employeeNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年营业额/工程造价：">
              {{ data.annualTurnover || '--' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营状态：">
              {{ status }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围：">
              <span v-if="data.businessScope && data.businessScope.length > 15">
                {{ data.businessScope.slice(0, 15) }}...
                <el-popover placement="top" width="300" v-model="visible">
                  <p>{{ data.businessScope }}</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="visible = false"
                    >
                      确定
                    </el-button>
                  </div>
                  <el-button
                    type="text"
                    class="downloadfile ml5"
                    slot="reference"
                  >
                    更多
                  </el-button>
                </el-popover>
              </span>

              <span v-else>{{ data.businessScope || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <p class="stitle">项目信息</p>   //查看项目信息于11.6日 因为需求变更不在需要
        <el-row v-if="manageName == '建筑施工'">
          <el-table
            :header-cell-style="{
              background: '#f5f5f5',
              'text-align': 'center',
            }"
            :data="projectList"
            border
            style="width: 80%; margin: 0px 50px"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              center
            ></el-table-column>
            <el-table-column
              prop="projectName"
              label="项目名称"
              width="180"
            ></el-table-column>
            <el-table-column label="项目地址">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.provinceName }}{{ scope.row.cityName
                  }}{{ scope.row.countyName }},{{ scope.row.detailAddress }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="belongToYear"
              label="年份"
              width="180"
            ></el-table-column>
            <el-table-column label="状态" width="120">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.dataStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-row> -->
        <p class="stitle">法人代表/主要负责人</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名：">
              {{ data.lawMan || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">
              {{ data.lawManPhone || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="常用邮箱：">
              {{ data.securityChargerEmail || '--' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应急值班电话：">
              {{ data.dutyTelephone || '--' }}
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle">安全负责人</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名：">
              {{ data.securityCharger || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">
              {{ data.securityChargerPhone || '--' }}
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle">安全生产许可证</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="许可证号：">
              {{ data.safetyProdLicense || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="许可证附件：">
              <span
                v-if="data.safetyProdLicenseFileId"
                @click="checkLsp"
                class="downloadfile"
              >
                查看附件
              </span>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="许可证有效期：">
              {{
                data.safetyProdLicenseStart ? data.safetyProdLicenseStart : '—'
              }}
              至
              {{ data.safetyProdLicenseEnd ? data.safetyProdLicenseEnd : '—' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="标准化等级：">
              {{ level }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { getOrgDetails } from '@/api/userDataManagement'
import Title from '@/components/NewTitle'
import Table from '../details/components/Table.vue'
import { getFile } from '@/api/resources.js'
import { mapGetters } from 'vuex'
import Label1 from '@/components/label/index'
export default {
  components: {
    Title,
    Table,
    Label1,
  },
  data() {
    return {
      dialogVisible: false,
      userCode: '',
      data: {},
      // projectList: [],//项目信息
      visible: false,
      visible2: false,
      visible1: false,
      visible3: false,
      visible4: false,
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',
      getStrEnumAll: 'enums/getStrEnumAll',
      branchId: 'user/branchId',
      accountType: 'user/accountType',
    }),

    address() {
      let result = ''
      if (this.data.provinceName) {
        result =
          this.data.provinceName +
          ' / ' +
          this.data.cityName +
          ' / ' +
          this.data.countyName
      } else {
        result = '--'
      }

      return result
    },

    industryName() {
      let name = []
      let result = ''
      if (this.data.sysDictItemEntitys) {
        this.data.sysDictItemEntitys.forEach((item) => {
          name.push(item.itemText)
        })
        result = name.join(' / ')
      } else {
        result = '--'
      }
      return result
    },
    level() {
      if (this.data.safetyProdLevel) {
        return this.getStrEnumAll.SafetyLevelEnum.find((item) => {
          return item.code == this.data.safetyProdLevel
        }).label
      } else {
        return '--'
      }
    },
    status() {
      if (this.data.orgStatus) {
        return this.getStrEnumAll.BusinesStatus.find((item) => {
          return item.code == this.data.orgStatus
        }).label
      } else {
        return '--'
      }
    },
    manageName() {
      let name = []
      let result = ''
      if (this.data.administrations) {
        this.data.administrations.forEach((item) => {
          name.push(item.itemText)
        })
        result = name.join(' / ')
      } else {
        result = '--'
      }
      return result
    },
  },

  methods: {
    async getInit() {
      let res = await getOrgDetails(this.userCode)
      // console.log(res, 'projectList');
      // this.projectList = res.data.constructionProjectRespList
      this.data = res.data
    },
    checkBsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.businessLicenseFileId
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'res')
        })
        .catch((_) => { })
    },
    checkLsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.safetyProdLicenseFileId
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'lsp')
        })
        .catch((_) => { })
    },
    async initData() {
      this.getOrgList()
    },
    async getOrgList() {
      let userCode = ''
      if (this.accountType === '00') {
        userCode = this.branchId
      } else {
        userCode = this.$route.query.userCode
      }
      let res = await getOrgDetails(userCode)
      if (res.code === '0000') {
        this.data = res.data
        this.data.employeeNum = res.data.employeeNum + ''
        this.data.orgNatureName = this.enumData.CorpEnum[this.data.orgNature]
        this.data.riskLevelName =
          this.enumData.RiskLevelEnum[this.data.riskLevel]
        this.data.addressDetails =
          res.data.provinceName +
          res.data.cityName +
          res.data.countyName +
          res.data.streetName +
          res.data.detailAddress +
          res.data.villageCommittee
        this.data.addressDetails = this.data.addressDetails.replace(/null/g, '')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#highRiskDetails {
  background-color: #fff;
  width: 90%;
  margin: 0 auto;
  .stitle {
    font-weight: bold;
    color: #000;
  }
  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
<style >
#highRiskDetails .el-form-item__label {
  color: #919191;
}
#highRiskDetails .el-form-item {
  margin-bottom: 5px;
}
</style>
