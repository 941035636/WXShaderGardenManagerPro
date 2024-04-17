<template>
  <div id="highRiskDetails">
    <Title title="企业基本信息" class="mb30"></Title>
    <Table
      :box-one="true"
      lable-left="单位名称"
      :value-left="data.custFullName"
      lable-right="类型"
      :value-right="businessType"
    ></Table>

    <Table
      v-if="!data.blCode"
      :box-one="true"
      lable-left="主要负责人"
      :value-left="data.lawMan"
      lable-right="主要负责人联系方式"
      :value-right="data.lawManPhone"
    ></Table>
    <Table
      v-if="!data.blCode"
      :box-one="true"
      lable-left="个人证件号码"
      :value-left="data.lawManBlCode"
      lable-right="实际经营地址"
      :value-right="address"
    ></Table>
    <Table
      v-if="data.blCode"
      :box-one="true"
      lable-left="社会信用代码"
      :value-left="data.blCode"
      lable-right="实际经营地址"
      :value-right="address"
    ></Table>
    <Table
      :box-one="true"
      lable-left="行业分类"
      :value-left="industryName"
      lable-right="管理分类"
      :value-right="manageName"
    ></Table>
    <Table
      v-if="data.blCode"
      :box-one="true"
      lable-left="从业人员总数（人）"
      :value-left="data.employeeNum"
      lable-right="年营业额/工程造价"
      :value-right="String(data.annualTurnover)"
    ></Table>

    <Table
      v-if="data.blCode"
      :box-two="true"
      lable-left="经营范围"
      :value-left="data.businessScope"
      lable-right=""
      value-right=""
      :border-bot-flag="true"
    ></Table>
    <div v-if="data.blCode">
      <Title class="mb30" title="企业关系人信息"></Title>

      <Table
        :box-one="true"
        lable-left="法定代表人/主要负责人"
        :value-left="data.lawMan"
        lable-right="法定代表人/主要负责人联系电话"
        :value-right="data.lawManPhone"
      ></Table>
      <Table
        :box-one="true"
        lable-left="安全负责人姓名"
        :value-left="data.securityCharger"
        lable-right="安全负责人联系电话"
        :value-right="data.securityChargerPhone"
        :border-bot-flag="true"
      ></Table>
      <Table
        :box-two="true"
        lable-left="应急值班电话："
        :value-left="data.dutyTelephone"
        :border-bot-flag="true"
      ></Table>
      <Title class="mb30" title="证件类型"></Title>

      <div id="bottom">
        <div class="div-one border-bottom back">
          <p class="p-tilte pl5">营业执照</p>
          <p class="p-content border-left">
            <span
              v-if="data.businessLicenseFileId"
              class="check"
              @click="checkBsp"
            >
              查看
            </span>
            <span v-else>—</span>
          </p>
          <p class="p-tilte border-left">安全生产许可证号码</p>
          <p class="p-content border-left">
            {{ data.safetyProdLicense ? data.safetyProdLicense : '—' }}
          </p>
        </div>
        <div class="div-one border-bottom back">
          <p class="p-tilte pl5">安全生产许可证有效期</p>
          <p class="p-content border-left">
            <span>
              {{
                data.safetyProdLicenseStart ? data.safetyProdLicenseStart : '—'
              }}至{{
                data.safetyProdLicenseEnd ? data.safetyProdLicenseEnd : '—'
              }}
            </span>
          </p>
          <p class="p-tilte border-left">安全生产许可证</p>
          <p class="p-content border-left">
            <span
              v-if="data.safetyProdLicenseFileId"
              class="check"
              @click="checkLsp"
            >
              查看
            </span>
            <span v-else>—</span>
          </p>
        </div>

        <div class="div-one border-bottom">
          <p class="p-tilte">安全生产标准化等级</p>
          <p class="p-content-two border-left">{{ level }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgDetails } from '@/api/userDataManagement'
import Title from '@/components/NewTitle'
import Table from './components/Table'
import { getFile } from '@/api/resources.js'
import { mapGetters } from 'vuex'
export default {
  name: 'HighRiskDetails',
  components: {
    Title,
    Table,
  },
  data() {
    return {
      data: {},
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',

      branchId: 'user/branchId',
      accountType: 'user/accountType',
    }),
    level() {
      let result = ''
      switch (this.data.safetyProdLevel) {
        //标准化等级
        case '2':
          result = '通过一级安全生产标准化验收'
          break
        case '3':
          result = '通过二级安全生产标准化验收'
          break
        case '4':
          result = '通过三级安全生产标准化验收'
          break
        default:
          result = '—'
          break
      }
      return result
    },
    address() {
      let result = ''
      result =
        this.data.provinceName +
        ',' +
        this.data.cityName +
        ',' +
        this.data.countyName +
        ',' +
        this.data.detailAddress
      if (this.data.areaName) {
        result =
          this.data.provinceName +
          ',' +
          this.data.cityName +
          ',' +
          this.data.countyName +
          ',' +
          this.data.areaName +
          ',' +
          this.data.detailAddress
      }

      return result
    },
    businessType() {
      let result = ''
      if (this.data.blCode) {
        result = '企业'
      } else {
        result = '个人'
        if (this.data.lawManType) {
          let type = this.enumData.CertificateTypeEnum.find((item) => {
            return item.strCode == this.data.lawManType
          })
          result = '个人' + ' — ' + type.label
        }
      }
      return result
    },
    industryName() {
      let name = []
      let result = ''
      if (this.data.sysDictItemEntitys) {
        this.data.sysDictItemEntitys.forEach((item) => {
          name.unshift(item.itemText)
        })
        result = name.join(',')
      }
      return result
    },
    manageName() {
      let name = []
      let result = ''
      if (this.data.administrations) {
        this.data.administrations.forEach((item) => {
          name.unshift(item.itemText)
        })
        result = name.join(',')
      }
      return result
    },
  },
  async created() {
    // this.initData()
    let res = await getOrgDetails(this.$route.query.userCode)

    this.data = res.data
  },
  methods: {
    checkBsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.businessLicenseFileId
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'res')
        })
        .catch((_) => {})
    },
    checkLsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.safetyProdLicenseFileId
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'lsp')
        })
        .catch((_) => {})
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
  margin: 10px;
  .ellip {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #bottom {
    .div-one,
    .div-two {
      width: 100%;
      display: flex;
      align-items: center;

      border-bottom: none;
      p {
        display: flex;
        margin: 0;
        min-height: 40px;
        align-items: center;
        padding: 5px 3px;
        box-sizing: border-box;
        .check {
          color: #3299cc;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
    .p-tilte {
      width: 220px;
    }
    .p-content {
      width: calc(100% - 50% - 220px);
    }
    .p-content-two {
      width: calc(100% - 220px);
    }
  }
}
</style>
