<template>
  <div id="CaseTabs">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="80%"
      @open="getInit"
      @close="close"
      :before-close="handleClose"
    >
      <div class="case-tab-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="保单信息">
            <PolicyInfo ref="policyInfo"></PolicyInfo>
          </el-tab-pane>
          <el-tab-pane label="出险信息">
            <AccidentInfo ref="accidentInfo"></AccidentInfo>
          </el-tab-pane>
          <el-tab-pane label="结案信息">
            <ClosingInfo ref="closeInfo"></ClosingInfo>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCaseDetails } from '@/api/caseManagement'
import PolicyInfo from './PolicyInfo.vue'
import AccidentInfo from './AccidentInfo.vue'
import ClosingInfo from './ClosingInfo.vue'
export default {
  name: 'CaseTabs',
  components: {
    PolicyInfo, // 保单信息
    AccidentInfo, // 出险信息
    ClosingInfo, // 结案信息
  },
  data() {
    return {
      dialogVisible: false,
      title: '理赔详情',
      activeName: '0',
      id: '',
    }
  },
  methods: {
    async getInit() {
      console.log(this.id, '++++++')
      let res = await getCaseDetails(this.id)
      if (res.code === '0000') {
        this.$refs.policyInfo.policyRelationResp = res.data.policyRelationResp
        this.$refs.accidentInfo.caseInfoEntityResp = res.data.caseInfoEntityResp
        this.$refs.accidentInfo.caseSiteSurveyResps =
          res.data.caseSiteSurveyResps
        this.$refs.accidentInfo.casePaymentRecordResps =
          res.data.casePaymentRecordResps
        if (res.data.casePaymentIndemnityResp) {
          this.$refs.closeInfo.casePaymentIndemnityResp =
            res.data.casePaymentIndemnityResp
          this.$refs.closeInfo.caseThirdPersonIndemnityResps =
            res.data.caseThirdPersonIndemnityResps
          this.$refs.closeInfo.casePersonIndemnityResps =
            res.data.casePersonIndemnityResps
          this.$refs.closeInfo.caseThirdPartyIndemnityResps =
            res.data.caseThirdPartyIndemnityResps
        } else {
          this.$refs.closeInfo.showInfo = false
        }
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    close(e) {
      this.activeName = '0'
      this.$refs.closeInfo.showInfo = true
    },
    handleClick(e) {
      console.log(e, 'eee')
    },
  },
}
</script>

<style lang="scss">
#CaseTabs {
  .text {
    color: #000;
  }
  .el-dialog__body {
    padding: 10px 50px;
  }
  .border-bottom {
    border-bottom: 1px solid #dfdfdf;
  }

  .el-form-item--small.el-form-item {
    margin: 0;

    .el-form-item__label,
    .el-form-item__content {
      line-height: 50px;
    }

    .el-form-item__label {
      color: #919191;
    }
  }

  .cF5222D {
    color: #f5222d;
  }

  .c000 {
    color: #000;
  }

  .check {
    color: #fa8c16;
    text-decoration: underline;
  }

  .c096DD9 {
    color: #096dd9;
  }
  .cursor-pointer {
    cursor: pointer;
  }
}
</style>
<style>
html body .el-table.table-header-blod .el-table__header-wrapper .cell {
  font-weight: bold;
  color: #000;
}

#CaseTabs .el-dialog__wrapper .el-dialog {
  margin-top: 10vh !important;
}
</style>