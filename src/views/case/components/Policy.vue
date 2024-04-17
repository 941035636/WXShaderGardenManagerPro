<template>
  <div id="policy">
    <Title title="保单信息"></Title>
    <div v-if="!policyRelationResp.name" class="row">
      <el-row type="flex" class="row-bg">
        <el-col :span="6">
          <span class="title">保单编码：</span>
          <span>{{ policyRelationResp.policyNo }}</span>
        </el-col>
      </el-row>
    </div>

    <div v-if="policyRelationResp.name" class="row">
      <el-row type="flex" class="row-bg">
        <el-col :span="6">
          <span class="title">被保人名称：</span>
          <span>
            {{ policyRelationResp.name }}
          </span>
        </el-col>
        <el-col v-if="policyRelationResp.blCode" :span="6">
          <span class="title">被保人社会信用代码：</span>
          <span>{{ policyRelationResp.blCode }}</span>
        </el-col>
        <el-col v-if="policyRelationResp.lawManBlCode" :span="6">
          <span class="title">被保人证件号码：</span>
          <span>{{ policyRelationResp.lawManBlCode }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">保障期间：</span>
          <span>{{ policyRelationResp.startTime }}</span>
          <span>&nbsp;至&nbsp;</span>
          <span>{{ policyRelationResp.endTime }}</span>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="6">
          <span class="title">行业类型：</span>
          <TipsText :length="17" :text="reverseInd" />
        </el-col>
        <el-col :span="6">
          <span class="title">保单编码：</span>
          <span>{{ policyRelationResp.policyNo }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">保险公司：</span>
          <span>{{ policyRelationResp.issuingCompanyName }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="mt18">
        <el-col :span="6">
          <span class="title">实收保费：</span>
          <span class="money">￥{{ policyRelationResp.actualPrem }} 元</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/NewTitle'
  import TipsText from '@/components/TipsText'
  export default {
    name: 'Policy',
    components: {
      Title,
      TipsText,
    },
    props: {
      policyRelationResp: {
        type: Object,
        require: true,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        data: {},
      }
    },
    computed: {
      reverseInd() {
        let res = []
        if (this.policyRelationResp.sysDictItemEntitys != null) {
          res = this.policyRelationResp.sysDictItemEntitys
            .slice()
            .reverse()
            .map((item) => {
              return item.itemText
            })
        }
        return res.join(',')
      },
    },
    mounted() {},
    methods: {},
  }
</script>

<style scoped lang="scss">
  #policy {
    padding: 0 0 20px;
    margin: 5px 0;
    background-color: #fff;
    .row {
      margin-left: 30px;
      padding: 10px 0;
      .money {
        color: #f00;
      }
      .row-bg {
        margin-bottom: 20px;
      }
    }
  }
</style>
