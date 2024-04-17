<template>
  <div id="InsuredInfo">
    <div class="con">
      <Title :title="title" />
      <div class="con_item lh32">
        <el-row class="lh32 mt10">
          <el-col v-if="holderResps.holderName" :span="12">
            <span class="title_item">投保人名称：</span>
            <span v-if="holderResps.holderName.length < 20">
              {{ holderResps.holderName }}
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="holderResps.holderName"
              placement="top"
            >
              <span v-if="holderResps.holderName.length > 20">
                {{ holderResps.holderName.slice(0, 20) }}...
              </span>
            </el-tooltip>
          </el-col>
          <el-col :span="12">
            <span class="title_item">证件类型/号码：</span>
            <span>
              {{ hodertype }}
              <span v-if="holderResps.blCode">/{{ holderResps.blCode }}</span>
              <span v-if="holderResps.lawManBlCode">
                {{ holderResps.lawManBlCode }}
              </span>
              <span v-if="holderPersonType">-{{ holderPersonType }}</span>
            </span>
          </el-col>
        </el-row>
        <el-row class="lh32 mt10">
          <el-col v-if="insuredResps.name" :span="12">
            <span class="title_item">被保人名称：</span>
            <span v-if="insuredResps.name.length < 15">
              {{ insuredResps.name }}
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="insuredResps.name"
              placement="top"
            >
              <span v-if="insuredResps.name.length > 15">
                {{ insuredResps.name.slice(0, 15) }}...
              </span>
            </el-tooltip>
          </el-col>
          <el-col :span="12">
            <span class="title_item">证件类型：</span>
            <span>{{ insuredResps.blCode ? '企业' : '个人' }}</span>
          </el-col>
        </el-row>
        <el-row v-if="insuredResps.blCode" class="lh32 mt10">
          <el-col :span="12">
            <span class="title_item">统一社会信用代码：</span>
            <span>{{ insuredResps.blCode }}</span>
          </el-col>
          <el-col :span="12">
            <span class="title_item">被保人实际经营地址：</span>
            <span>
              {{ insuredResps.provinceName }} {{ insuredResps.cityName }}
              {{ insuredResps.countyName }} {{ insuredResps.areaName }}

              <TipsText :text="insuredResps.location" :length="7" />
            </span>
          </el-col>
        </el-row>
        <el-row v-if="insuredResps.lawManBlCode" class="lh32 mt10">
          <el-col :span="12">
            <span class="title_item">个人证件号码：</span>
            <span>{{ insuredResps.lawManBlCode }}</span>
          </el-col>
          <el-col :span="12">
            <span class="title_item">个人证件类型：</span>
            <span>{{ personType }}</span>
          </el-col>
        </el-row>
        <el-row class="lh32 mt10">
          <el-col :span="12">
            <div class="prem-item">
              <span class="title_item">行业分类</span>
              <!-- {{ insName }} {{ industName }} -->
              <span v-if="!$route.query.code && insName">
                <TipsText :text="insName" :length="25" />
              </span>
              <span v-if="!$route.query.code && !insName">
                <TipsText :text="industName" :length="25" />
              </span>
              <span v-if="$route.query.code">
                <TipsText
                  v-if="insuredResps.nationalEconomyClassificationName"
                  :text="insuredResps.nationalEconomyClassificationName"
                  :length="25"
                />
              </span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="prem-item">
              {{ mngName }}
              <span class="title_item">管理分类</span>

              <span v-if="!$route.query.code && mngName">
                {{ mngName }}
              </span>
              <span v-else>
                {{ manageName }}
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh32 mt10">
          <el-col :span="12">
            <span class="title_item">职工人数：</span>
            <span class="color-red">{{ insuredResps.employeeNum }}人</span>
          </el-col>
          <el-col :span="12">
            <span class="title_item">年营业额/工程造价：</span>
            <span class="color-red">{{ insuredResps.constructionCost }}元</span>
          </el-col>
        </el-row>
        <el-row class="lh32 mt10">
          <el-col :span="12">
            <span class="title_item">法定代表人/主要负责人(电话)：：</span>
            <span>
              {{ insuredResps.lawMan }} ({{ insuredResps.lawManPhone }})
            </span>
          </el-col>
          <el-col :span="12">
            <span class="title_item">安全负责人姓名（电话）：</span>
            <span>
              {{ insuredResps.securityCharger }} ({{
                insuredResps.securityChargerPhone
              }})
            </span>
          </el-col>
        </el-row>
        <el-row class="lh32 mt10">
          <el-col :span="12">
            <span class="title_item">应急值班电话：</span>
            <span>{{ insuredResps.dutyTelephone }}</span>
          </el-col>
          <el-col :span="12">
            <span class="title_item">安全生产许可证：</span>
            <span v-if="insuredResps.safetyProdLicense">
              {{ insuredResps.safetyProdLicense }} (
              {{ insuredResps.safetyProdLicenseStart | setTime }}至{{
                insuredResps.safetyProdLicenseEnd | setTime
              }})
              <a href="javascript:;" @click="goDialog">查看</a>
            </span>
            <span v-else>-</span>
          </el-col>
        </el-row>
        <el-row class="lh32 mt10">
          <el-col :span="12">
            <span class="title_item">营业执照：</span>
            <img :src="imgData.Bsp" alt="" class="avatar" />
          </el-col>
        </el-row>
        <el-row class="lh32 mt10"></el-row>
      </div>
    </div>
    <el-dialog
      class="dialog"
      title="查看"
      width="600px"
      :visible.sync="dialogFormVisible"
    >
      <img :src="imgData.Lsp" class="avatar-lsp" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import Title from '@/components/NewTitle'
import TipsText from '@/components/TipsText'
import { mapGetters } from 'vuex'
export default {
  name: 'InsuredInfo',
  components: { Title, TipsText },
  props: {
    insuredResps: {
      type: Object,
      required: true,
      default: () => {},
    },
    imgData: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      title: '投/被保险人信息',
      holderResps: {}, // 被保人先信息
      dialogFormVisible: false,
    }
  },
  computed: {
    ...mapGetters({
      getEnumAll: 'enums/getStrEnumAll',
    }),
    hodertype() {
      let result = ''
      if (this.holderResps.blCode) {
        result = '企业'
      } else {
        result = '个人'
      }
      return result
    },
    personType() {
      let result = ''
      if (this.holderResps.lawManType) {
        let type = this.getEnumAll.CertificateTypeEnum.find((item) => {
          return item.strCode == this.holderResps.lawManType
        })
        result = type.label
      }
      return result
    },
    industName() {
      let name = []
      let result = ''
      if (this.insuredResps.sysDictItemEntitys) {
        this.insuredResps.sysDictItemEntitys.forEach((item) => {
          name.unshift(item.itemText)
        })
        result = name.join(',')
      }
      return result
    },
    manageName() {
      let name = []
      let result = ''
      if (this.insuredResps.administrations) {
        this.insuredResps.administrations.forEach((item) => {
          name.unshift(item.itemText)
        })
        result = name.join(',')
      }
      return result
    },
    insName() {
      let name = []
      let result = ''
      if (this.insuredResps.industryName) {
        this.insuredResps.industryName.forEach((item) => {
          name.push(item)
        })
        result = name.join(',')
      }
      return result
    },
    mngName() {
      let name = []
      let result = ''
      if (this.insuredResps.manageName) {
        this.insuredResps.manageName.forEach((item) => {
          name.push(item)
        })
        result = name.join(',')
      }
      return result
    },
    holderPersonType() {
      let result = ''
      if (this.insuredResps.lawManType) {
        let type = this.getEnumAll.CertificateTypeEnum.find((item) => {
          return item.strCode == this.insuredResps.lawManType
        })
        result = type.label
      }
      return result
    },
  },
  activated() {},
  mounted() {
    console.log(this.insuredResps)
  },
  methods: {
    goDialog() {
      this.dialogFormVisible = true
    },
  },
}
</script>
<style lang="scss" scoped>
#InsuredInfo {
  .con {
    padding: 0 0 20px;
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
  }
  .prem-item {
    background: #90bff5;
    padding: 30px 0;
    line-height: 30px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 8px;
    width: 80%;
    border: 2px dashed #0f54a9;
    .title_item {
      display: inline-block;
      // width: 26.5%;
      line-height: 32px;
      // min-width: 140px;
    }
    span {
      margin-left: 20px;
      display: block;
    }
  }
  .avatar-lsp {
    width: 178px;
    height: 178px;
    margin: 0 auto;
    display: block;
  }
}
#InsuredInfo .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
