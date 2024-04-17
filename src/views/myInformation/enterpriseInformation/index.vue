<template>
  <div id="enterpriseInformation">
    <div class="enterpriseInformation-title">
      <span>企业资料</span>
    </div>
    <div style="height: 15px; background: #f7f7f7"></div>
    <div id="highRiskDetails">
      <el-form label-position="left" label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业名称:">
              <moreCon :data="data.custFullName" :length="15" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社会信用代码:">
              {{ data.blCode }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业执照:">
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
            <el-form-item label="经营地址:">
              {{ address }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址:">
              <span v-if="data.detailAddress">
                <moreCon :data="data.detailAddress" :length="15" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属行业:">
              {{ industryName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="国民经济行业:">
              {{ manageName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="从业人员总数:">
              {{ data.employeeNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年营业额/工程造价:">
              {{ data.annualTurnover }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营状态:">
              {{ status }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围:">
              <span v-if="data.businessScope && data.businessScope.length > 20">
                {{ data.businessScope.slice(0, 20) }}...
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

              <span v-else>{{ data.businessScope }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle">法人代表/主要负责人</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名:">
              {{ data.lawMan }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:">
              {{ data.lawManPhone }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="常用邮箱:">
              {{ data.securityChargerEmail || '--' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应急值班电话:">
              {{ data.dutyTelephone || '--' }}
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle">安全负责人</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名:">
              {{ data.securityCharger }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:">
              {{ data.securityChargerPhone }}
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle">安全生产许可证</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="许可证号:">
              {{ data.safetyProdLicense || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="许可证附件:">
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
            <el-form-item label="许可证有效期:">
              {{
                data.safetyProdLicenseStart ? data.safetyProdLicenseStart : '—'
              }}至{{
                data.safetyProdLicenseEnd ? data.safetyProdLicenseEnd : '—'
              }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="标准化等级:">
              {{ level }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: center">
            <el-button
              style="
                padding: 13px 40px;
                margin-top: 40px;
                border-color: #096dd9;
                color: #096dd9;
              "
              @click="update(data.id)"
            >
              修改资料
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <add :industryData="industryData" @sucessCb="seach" ref="addUser" />
  </div>
</template>

<script>
import { getOrgDetails } from '@/api/userDataManagement'
import { dictItem } from '@/api/policyManagement'
import { getFile } from '@/api/resources.js'
import { mapGetters } from 'vuex'
import moreCon from '@/components/moreCon'
import add from '@/views/userData/highRisk/components/add'
export default {
  name: 'EnterpriseInformation',
  components: {
    add,
    moreCon,
  },
  data() {
    return {
      data: {},
      industryData: [],
      visible1: false,
      visible: false,
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
      result =
        this.data.provinceName +
        ' / ' +
        this.data.cityName +
        ' / ' +
        this.data.countyName

      return result
    },
    industryName() {
      let name = []
      let result = ''
      if (this.data.sysDictItemEntitys) {
        this.data.sysDictItemEntitys.forEach((item) => {
          name.unshift(item.itemText)
        })
        result = name.join(' / ')
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
          name.unshift(item.itemText)
        })
        result = name.join(' / ')
      }
      return result
    },
  },
  created() {
    this.getOrgDetails()
    this.getIndustryData()
  },
  methods: {
    update(id) {
      this.$refs.addUser.userCode = id
      this.$refs.addUser.dialogVisible = true
    },
    seach() {
      this.getOrgDetails()
    },
    checkLsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.safetyProdLicenseFileId
          console.log('🚀 ~ file: Index.vue ~ line 303 ~ .then ~ id', id)
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'lsp')
        })
        .catch((_) => {})
    },
    checkBsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.businessLicenseFileId
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'res')
        })
        .catch((_) => {})
    },
    async getOrgDetails() {
      let res = await getOrgDetails(this.$route.query.orgId)
      this.data = res.data
    },
    async getIndustryData() {
      //获取管理分类信息
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
  },
}
</script>

<style lang="scss">
.enterpriseInformation-title {
  box-sizing: border-box;
  padding-left: 20px;
  line-height: 60px;
  font-size: 18px;
  color: #000;
}
#highRiskDetails {
  padding: 20px;
}

.stitle {
  font-weight: bold;
}

.downloadfile {
  color: #fa8c16;
  cursor: pointer;
  text-decoration: underline;
}
</style>