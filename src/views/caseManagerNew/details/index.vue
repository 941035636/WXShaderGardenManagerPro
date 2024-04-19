<template>
  <div id="detailCase">
    <el-dialog
      title="理赔详情"
      :visible.sync="dialogVisible"
      width="1000px"
      @close="close"
      :before-close="handleClose"
    >
        <!-- 案件基本信息 -->
        <caseBaseInfos></caseBaseInfos>
        <!-- 中止信息 -->
        <caseStopDetails v-if="caseInfo.caseStatus == '1'"></caseStopDetails>
        <!-- 案件审核 -->
        <caseCloseDetails v-if="endCaseInfo.closeAuditorName" :isClose="isClose" @goClose="goClose"></caseCloseDetails>
        <div class="case-tab-content">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="保单信息">
                    <casePolicyInfo></casePolicyInfo>
                </el-tab-pane>
                <el-tab-pane label="出险信息">
                  <div v-show="activeName==1">
                    <caseAppearDetails></caseAppearDetails>
                    <caseBiaoDiDetails></caseBiaoDiDetails>
                  </div>
                   
                </el-tab-pane>
                <el-tab-pane label="索赔信息">
                    <casePeiFuDetails></casePeiFuDetails>
                    <casePeiFuFileDetails></casePeiFuFileDetails>
                </el-tab-pane>
                <el-tab-pane label="结案信息">
                  <caseJieAnDetails></caseJieAnDetails>
                  <caseThreePersonDetails></caseThreePersonDetails>
                </el-tab-pane>
            </el-tabs>
        </div>
          <div class="btn">
              <span class="btn-left" @click="close">取消</span>
              <span class="btn-right" v-if="caseInfo.caseProgress =='301' && isClose === true" @click="goClose()">结案审核</span>
          </div>
          <caseExamine ref="caseExamine" @successCb="successCb"></caseExamine>
    </el-dialog>
  </div>
</template>

<script>
import caseBaseInfos from './components/caseBaseInfos.vue'
import casePolicyInfo from './components/casePolicyInfo.vue'
import caseAppearDetails from './components/caseAppearDetails.vue'
import caseBiaoDiDetails from './components/caseBiaoDiDetails.vue'
import casePeiFuDetails from './components/casePeiFuDetails.vue'
import casePeiFuFileDetails from './components/casePeiFuFileDetails.vue'
import caseJieAnDetails from './components/caseJieAnDetails.vue'
import caseThreePersonDetails from './components/caseThreePersonDetails.vue'
import caseCloseDetails from './components/caseCloseDetails.vue'
import caseExamine from '../handle/components/caseExamine.vue'
import caseStopDetails from './components/caseStopDetails.vue'
import {mapGetters,mapActions,mapMutations} from 'vuex'
export default {
  name: 'detailCase',
  components: {
    caseBaseInfos,
    casePolicyInfo,
    caseAppearDetails,
    caseBiaoDiDetails,
    casePeiFuDetails,
    casePeiFuFileDetails,
    caseThreePersonDetails,
    caseJieAnDetails,
    caseCloseDetails,
    caseExamine,
    caseStopDetails,
  },
  data() {
    return {
        activeName: '0',
        dialogVisible: false,
        isClose:false,
    }
  },
  computed: {
    ...mapGetters({
      caseInfo:'caseInfo',
      endCaseInfo:'endCaseInfo',
    })
  },
  methods: {
    ...mapMutations(['setCaseInfoDetails','setPushInsurance']),
    ...mapActions(['getCaseInfo']),
    openInit(row,isClose=false){
      this.dialogVisible = true
      this.isClose = isClose
      this.getCaseInfo(row.reportNo)
    },
    handleClose() {
      this.dialogVisible = false
    },
    close(e) {
      this.activeName = '0'
      this.dialogVisible = false
      this.setCaseInfoDetails({})
      this.setPushInsurance({})
    },
    handleClick(e) {},
    goClose(){
      this.$refs.caseExamine.openInit()
    },
    // 审核成功回调
    successCb(){
      this.$emit('successCb')
    }
  },
}
</script>

<style lang="less">
#detailCase {
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
  .btn{
        margin: 10px 0;
        text-align: right;
        width: 100%;
        .btn-left{
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ccc;
            color: #000;
            background-color: #F5F5F5;
            border-radius: 20px;
            cursor: pointer;
            margin-right: 20px;
        }
        .btn-right{
            display: inline-block;
            padding: 5px 20px;
            color: #FFF;
            background-color: #FA8C16;
            border-radius: 20px;
            cursor: pointer;
        }
    }
}
</style>
<style lang="less">
html body .el-table.table-header-blod .el-table__header-wrapper .cell {
  font-weight: bold;
  color: #000;
}

#detailCase .el-dialog__wrapper .el-dialog {
  margin-top: 10vh !important;
}
#detailCase {
  .el-tabs--card>.el-tabs__header {
    border-bottom: 2px solid #409EFF;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #409EFF;
    border-left: 1px solid #409EFF;
    color: #409EFF;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: 1px solid #409EFF;
  }
  .el-tabs__item.is-active {
    color:#FFF !important;
    background-color: #409EFF;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item:first-child {
    border-left: none;
  }
  
}
</style>