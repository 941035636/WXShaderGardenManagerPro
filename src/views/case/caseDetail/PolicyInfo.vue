<template>
  <div id="PolicyInfo">
    <el-form label-position="left" label-width="142px" style="padding: 0">
      <el-row class="border-bottom">
        <el-col :span="8">
          <el-form-item label="被保人名称：">
            <div class="text">
              <moreCon :data="policyRelationResp.custFullName" :length="13" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保单号：">
            <div class="text">{{ policyRelationResp.policyNo }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属行业：">
            <div class="text">
              <moreCon
                :data="policyRelationResp.economyFieldName"
                :length="13"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="border-bottom">
        <el-col :span="8">
          <el-form-item label="保险期间：">
            <div class="text">
              {{ policyRelationResp.startTime | setTime }} 00时 至
              {{ policyRelationResp.endTime | setTime }} 24时
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保险机构：">
            <div class="text">
              <moreCon
                :data="policyRelationResp.issuingCompanyName"
                :length="13"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实收保费：">
            <div v-if="policyRelationResp.actualPrem" class="text cF5222D">
              ￥{{ policyRelationResp.actualPrem.toFixed(2) }}元
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="累计责任限额：">
            <div class="text">{{ policyRelationResp.limitValue }}万元</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moreCon from '@/components/moreCon'
export default {
  name: 'PolicyInfo',
  components: { moreCon },
  data() {
    return {
      policyRelationResp: {},
    }
  },
}
</script>

<style>
</style>