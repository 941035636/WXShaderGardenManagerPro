<template>
  <div id="casePolicy">
    <el-form label-position="left" label-width="140px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业名称：">
            <more-con :data="data.custFullName" :length="13" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保单号：">
            <more-con :data="data.policyNo" :length="13" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属行业：">
            <more-con :data="industryName" :length="13" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="保险期间：">
            <span>{{ data.startTime | setTime }} 00时</span>
            至
            <span>{{ data.endTime | setTime }} 24时</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保险机构：">
            <more-con :data="data.issuingCompanyName" :length="13" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="基础保费：">
            <span v-if="data.actualPrem" class="color-red">
              ￥{{ data.actualPrem }}元
            </span>
            <span v-else>--</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="累计责任限额：">
            {{ data.limitValue }}万元
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moreCon from '@/components/moreCon'
export default {
  components: { moreCon },
  data() {
    return {
      data: {},
    }
  },
  computed: {
    industryName() {
      let name = []
      let result = ''
      if (this.data.economyFieldName) {
        result = this.data.economyFieldName
      } else {
        result = this.data.industryNameTwo
      }
      return result
    },
  },
  methods: {
    save() {
      this.$store.commit('formDatas/caseInfoEntity', this.form)
    },
  },
}
</script>

<style lang='scss' scoped>
#casePolicy {
  width: 100%;
  padding: 30px 30px 10px 50px;
  box-sizing: border-box;
}
</style>
<style lang='scss'>
#casePolicy {
  .el-form-item {
    margin-bottom: 6px;
  }
  .el-form-item__label {
    color: #919191;
  }
  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>