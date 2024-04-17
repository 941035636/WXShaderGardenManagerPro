<template>
  <el-dialog
    id="policyDetail"
    title="保单详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="80%"
    append-to-body
    @open="getInit"
    @close="close"
  >
    <div class="detailPage">
      <div v-if="isVerify" class="verify">
        <verifyProgress ref="verifyProgress" />
      </div>
      <div class="conBox">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">投保人信息</span>
        </div>
        <add-holder ref="addHolder" class="mt10" />
      </div>
      <div class="conBox">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">被保人信息</span>
        </div>

        <add-insured ref="addInsured" />
      </div>

      <div class="conBox" v-if="cativeList.industryOne == '15'">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">项目信息</span>
        </div>
        <div id="addHolder">
          <el-form label-position="left" label-width="140px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目名称：">
                  {{ cativeList.projectName }}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <el-form-item label="项目地址：">
                  {{ cativeList.projectProvinceName }}/{{
                    cativeList.projectCityName
                  }}/{{ cativeList.projectCountyName
                  }}{{ cativeList.projectDetailAddress }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- <add-insured ref="addInsured" /> -->
      </div>

      <div class="conBox">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">保单信息</span>
        </div>
        <policy-info ref="policyInfo" />
      </div>
      <div class="conBox">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">事故预防信息</span>
        </div>
        <accident ref="accident" />
      </div>
      <!-- <div class="conBox">
        <div class="title">
          <span></span>
          <span class="color-blue f16 ml10 mr20">评价信息</span>
        </div>
        <el-form class="mt20 ml10" label-position="right" label-width="120px">
          <el-form-item label="投保满意度">
            <el-rate
              class="mt5"
              :value="comment"
              :texts="texts"
              disabled
              :text-color="'#f7ba2a'"
              show-text
            ></el-rate>
          </el-form-item>
        </el-form>
      </div> -->
    </div>
  </el-dialog>
</template>

<script>
import verifyProgress from '../verify/components/verifyProgress.vue'
import policyInfo from '../previewPolicy/components/policyInfo.vue'
import Title from '@/components/NewTitle'
import Accident from '../previewPolicy/components/accident'
import addHolder from '../addPolicy/components/addHolder.vue'
import addInsured from '../addPolicy/components/addInsured.vue'
import Comment from '../addPolicy/components/comment.vue'
import { addPolicy, policyData } from '@/api/policyManagement'
import { mapMutations, mapGetters } from 'vuex'

export default {
  components: {
    Title,
    addHolder,
    addInsured,
    verifyProgress,
    Comment,
    policyInfo,
    Accident,
  },
  data() {
    return {
      dialogVisible: false,
      isVerify: false,
      userCode: '',
      comment: null,
      texts: ['很差', '差', '一般', '好', '很好'],
      data: {},
      cativeList: {},//项目信息
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',
      getStrEnumAll: 'enums/getStrEnumAll',
      branchId: 'user/branchId',
      accountType: 'user/accountType',
    }),
  },

  methods: {
    close() {
      this.isVerify = false
    },
    async getInit() {
      if (this.userCode) {
        let res = await policyData(this.userCode)
        if (res.code == '0000') {
          this.$refs.addHolder.data = res.data.holderResp
          this.$refs.addInsured.data = res.data.insuredResp
          this.cativeList = res.data.insuredResp //项目信息
          this.$refs.policyInfo.data = res.data.policyInfoResp
          this.$refs.policyInfo.Data = res.data.insurersInfo
          this.$refs.accident.data = res.data.accidentRate
          this.comment = res.data.comment
          if (this.isVerify) {
            this.$refs.verifyProgress.tableData =
              res.data.approveHistoryEntityList
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#policyDetail {
  .conBox {
    border-radius: 6px;
    margin-top: 10px;
    background-color: #fff;
    .title {
      display: flex;
      height: 40px;
      width: 96%;
      margin: 0 auto;
      align-items: center;
      padding: 0 20px;
      font-size: 12px;
      border-bottom: 1px solid #e9e9e9;
      span:nth-child(1) {
        display: inline-block;
        width: 5px;
        height: 16px;
        background-color: #096dd9;
      }
    }
  }
}
</style>
<style >
#policyDetail .el-form-item__label {
  color: #919191;
}
#policyDetail .el-form-item {
  margin-bottom: 5px;
}
#addHolder {
  width: 100%;
  padding: 30px 30px 10px 50px;
  box-sizing: border-box;
}
</style>
