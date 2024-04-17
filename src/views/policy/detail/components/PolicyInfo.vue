<template>
  <div id="PolicyInfo">
    <el-row>
      <el-col :span="2">
        <Title :title="title" />
      </el-col>
      <el-col v-if="policyData.businessOrgName" :span="12">
        <div class="org-name">
          <span>{{ policyData.businessOrgName }}</span>
        </div>
      </el-col>
      <el-col :span="10" style="text-align: right; margin-top: 8px">
        <el-button type="warning" round @click="preview">
          下载电子保单
        </el-button>
      </el-col>
    </el-row>

    <div class="con_item lh32">
      <el-row class="mt10 lh32">
        <el-col :span="12">
          <div style="display: flex">
            <span class="title_item">保单编码：</span>
            <span>{{ policyData.policyNo }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="display: flex">
            <span class="title_item">新保/续保：</span>
            <span class="ml15">
              {{ policyData.renewal == 'N' ? '新保' : '续保' }}
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="policyData.renewalPolicyNo" class="mt10 lh32">
        <el-col :span="12">
          <div style="display: flex">
            <span class="title_item">续保单号：</span>
            <span>{{ policyData.renewalPolicyNo }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="mt10 lh32">
        <el-col :span="12">
          <div style="display: flex">
            <span class="title_item">签单日期：</span>
            <span>{{ policyData.signTime }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="display: flex">
            <span class="title_item">保险期间：</span>
            <span>{{ policyData.startTime }}</span>
            至
            <span>{{ policyData.endTime }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="mt10 lh32">
        <el-col :span="12">
          <div style="display: flex">
            <span class="title_item">保费方式：</span>
            <span class="color-red">{{ policyData.premTypeRemark }}</span>
          </div>
        </el-col>

        <el-col :span="12">
          <div style="display: flex">
            <span class="title_item">投保数量：</span>
            <span class="color-red">{{ policyData.insureNumRemark }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="mt10 lh32">
        <el-col :span="5">
          <div class="prem-item">
            <span class="prem-title">实收保费</span>
            <span>{{ actualPremName }}元</span>
          </div>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="5">
          <div class="prem-item">
            <span class="prem-title">基础保费</span>
            <span>{{ premName }}元</span>
          </div>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="5">
          <div class="prem-item">
            <span class="prem-title">累计责任限额</span>
            <span v-if="!$route.query.code">{{ limitValueName }}万元</span>
            <span v-if="$route.query.code">{{ limitValueName }}万元</span>
          </div>
        </el-col>
      </el-row>
      <el-row class="mt10 lh32">
        <el-col :span="11">
          <span class="title_item">费率调整因子：</span>
          <el-table
            :header-cell-style="getRowClass"
            :cell-style="{ 'text-align': 'left' }"
            :data="policyData.rateFactors"
            border
            style="width: 100%"
            height="300px"
          >
            <el-table-column
              prop="factor"
              label="费率调整因子名称"
            ></el-table-column>
            <el-table-column prop="floatRadio" label="浮动系数">
              <template slot-scope="scope">
                <span>{{ scope.row.floatRadio }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <span class="title_item">保险机构：</span>
          <el-table
            :data="policyData.policyInsuredInfos"
            border
            :header-cell-style="getRowClass"
            :cell-style="{ 'text-align': 'left' }"
            style="width: 100%"
            height="300px"
          >
            <el-table-column
              prop="issuingCompanyName"
              label="保险机构"
            ></el-table-column>
            <el-table-column prop="premiumRate" label="保险机构保费占比">
              <template slot-scope="scope">
                {{ scope.row.premiumRate }}%
              </template>
            </el-table-column>
            <el-table-column prop="underwriteType" label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.underwriteType == '01'">主承</span>
                <span v-if="scope.row.underwriteType == '02'">跟单</span>
                <span v-if="scope.row.underwriteType == '03'">独立承保</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="mt10 lh32"></el-row>
    </div>
  </div>
</template>
<script>
import { getFile } from '@/api/resources.js'
import Title from '@/components/NewTitle'
import TipsText from '@/components/TipsText'
import { fmoney } from '@/utils/index'
export default {
  components: { Title },
  props: {
    policyData: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      title: '保单信息',
      fileId: [],
    }
  },
  computed: {
    companyName() {
      let result = ''
      if (this.policyData.policyInsuredInfos) {
        let name = this.policyData.policyInsuredInfos.find((item) => {
          return item.underwriteType == '01' || item.underwriteType == '03'
        })
        result = name.issuingCompanyName
      }
      return result
    },
    limitValueName() {
      let value = ''
      if (this.policyData.limitValue) {
        value = fmoney(this.policyData.limitValue, 2)
      }
      return value
    },
    premName() {
      let value = ''
      if (this.policyData.prem) {
        value = fmoney(this.policyData.prem, 2)
      }
      return value
    },
    actualPremName() {
      let value = ''
      if (this.policyData.actualPrem) {
        value = fmoney(this.policyData.actualPrem, 2)
      }
      return value
    },
  },
  mounted() {},
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:left'
      } else {
        return ''
      }
    },
    async preview() {
      if (this.$route.query.code) {
        if (this.fileId.length != 0) {
          this.$confirm('确认下载？')
            .then(async (_) => {
              let id = this.fileId[0].id
              let res = getFile('/files/downloadfile/' + id)
              // if (res.code != '9999') {
              //   this.$baseMessage('下载成功', 'success')
              // } else {
              //   this.$baseMessage('下载失败', 'error')
              // }
            })
            .catch((_) => {})
        }
      } else {
        this.$confirm('确认下载？')
          .then(async (_) => {
            let id = this.policyData.photoCopy[0]
            let res = await getFile('/files/downloadfile/' + id)
            console.log(res)
            if (res.code != '9999') {
              this.$baseMessage('下载成功', 'success')
            } else {
              this.$baseMessage('下载失败', 'error')
            }
          })
          .catch((_) => {})
      }

      //预览保单
    },
  },
}
</script>
<style lang="scss" scoped>
#PolicyInfo {
  padding: 0 20px 20px 0;
  margin: 10px 0;
  background-color: #fff;
  .con_item {
    margin-left: 30px;

    .title_item {
      display: inline-block;
      // width: 26.5%;
      line-height: 32px;
      // min-width: 140px;
    }
  }
  .prem-item {
    background: #90bff5;
    text-align: center;
    padding: 30px 0;
    line-height: 30px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 8px;
    border: 2px dashed #0f54a9;
    span {
      display: block;
    }
  }
  .org-name {
    line-height: 30px;
    margin-top: 8px;
    span {
      display: inline-block;
      padding: 0 20px;
      border: 1px dashed #0f54a9;
      border-radius: 20px;
    }
  }
}
</style>
