<template>
  <div id="myService">
    <div class="my-service-top">
      <div class="service-top-left">
        <div class="left-icon">
          <i class="el-icon-office-building"></i>
        </div>
        <div class="left-text">
          <p class="name">{{ enterpriseInformation.orgName }}</p>
          <p class="account-number">
            登录账号：{{ enterpriseInformation.account }}
          </p>
        </div>
      </div>
      <div class="service-top-right">
        <p>
          <span>
            企业资料:
            <span
              style="color: #f5222d"
              v-if="!enterpriseInformation.isComplete"
            >
              需要补充信息
            </span>
            <span style="color: #56ac31" v-else>已填写</span>
          </span>
          <el-button
            class="zl"
            @click="supplement(enterpriseInformation.orgId)"
            v-if="!enterpriseInformation.isComplete"
          >
            补充资料
          </el-button>
          <el-button
            type="text"
            style="color: #309bff; font-size: 14px; margin-left: 10px"
            @click="viewEnterprise(enterpriseInformation.orgId)"
            v-else
          >
            查看详情
          </el-button>
        </p>
        <p>
          <span>注册时间: {{ enterpriseInformation.createTime }}</span>
        </p>
      </div>
    </div>
    <!-- 审核进度 -->
    <div class="review-progress">
      <Title title="审核进度" :borderStyle="'6px solid #096DD9'"></Title>
      <el-table
        :data="policyInfosProgressList"
        border
        :header-cell-style="{ background: '#F5F5F5', color: '#000' }"
        style="width: 100%"
      >
        <el-table-column prop="policyNo" label="保单号"></el-table-column>
        <el-table-column prop="custFullName" label="保单信息"></el-table-column>
        <el-table-column
          prop="industryNameTwo"
          align="center"
          label="所属行业"
        ></el-table-column>
        <el-table-column prop="actualPrem" align="center" label="保费（元）">
          <template slot-scope="scope">
            <div style="color: #f5222d">￥{{ scope.row.actualPrem }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="进度">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.approveStatus == 1" style="color: #096dd9">
                待审核
              </span>
              <span
                v-if="scope.row.approveStatus == 3"
                style="color: #f5222d; display: flex; align-items: center"
              >
                <span>不通过</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.approveContent"
                  placement="top-start"
                >
                  <i
                    class="el-icon-question"
                    style="
                      color: #ffa940;
                      font-size: 18px;
                      margin-top: -3px;
                      margin-left: 4px;
                      cursor: pointer;
                    "
                  ></i>
                </el-tooltip>
              </span>
              <span v-if="scope.row.approveStatus == 2" style="color: #389e0d">
                审核通过
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                style="color: #fa8c16"
                @click="goDetaila(scope.row)"
              >
                查看
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="guarantee-policy">
      <Title
        title="保障中 / 保单列表"
        :borderStyle="'6px solid #096DD9'"
      ></Title>
      <!-- 保单列表 -->
      <div class="policy-list">
        <div class="policy-list-header">
          <span>
            保障中
            <span style="margin: 0 5px">{{ policyInfosListTotal }}</span>
            张保单
          </span>
          <el-button
            v-if="enterpriseInformation.isComplete"
            type="primary"
            round
            style="background: #355e92; padding: 7px 20px; margin-left: 30px"
            @click="addPolicy"
          >
            填写保单
          </el-button>
        </div>
        <div class="policy-list-content">
          <div v-if="policyInfosList.length">
            <div
              class="policy-list-conten-item"
              v-for="item in policyInfosList"
              :key="item.id"
            >
              <div class="policy-list-conten-item-left">
                <div>
                  <p style="color: #096dd9; font-weight: bold">
                    {{ item.custFullName }}
                  </p>
                </div>
                <div>
                  <p>
                    保险期间：{{ item.startTime }}时 至 {{ item.endTime }}时
                  </p>
                  <p>保单号：{{ item.policyNo }}</p>
                </div>
                <div>
                  <p>
                    所在区域：{{ item.provinceName }} / {{ item.cityName }} /
                    {{ item.countyName }}
                  </p>
                  <p>保险机构：{{ item.issuingCompanyName }}</p>
                </div>
              </div>
              <div class="policy-list-conten-item-right">
                <p style="color: #fa8c16">剩余{{ item.ensureTime }}天</p>
                <p>
                  <el-button
                    type="primary"
                    style="
                      background: #ffa940;
                      border-color: #ffa940;
                      padding: 9px 35px;
                    "
                    @click="goDetailb(item)"
                  >
                    查看保单
                  </el-button>
                </p>
              </div>
            </div>
          </div>
          <div v-else class="policy-list-conten-empty">
            <p v-if="enterpriseInformation.isComplete">
              无保单记录, 请
              <el-button type="text" style="color: #096dd9" @click="addPolicy">
                填写保单
              </el-button>
            </p>
            <p v-else>无保单记录</p>
          </div>
        </div>
      </div>
    </div>
    <policyDetail ref="policyDetail" />
  </div>
</template>

<script>
import Title from '@/components/Title'
import {
  checkcomplete,
  getPolicyInfos,
  getPolicyInfosBz,
} from '@/api/myService'
import policyDetail from '../policy/detail/index.vue'
export default {
  name: 'MyService',
  components: {
    Title,
    policyDetail,
  },
  data() {
    return {
      tableData: [],
      enterpriseInformation: {}, //企业资料
      policyInfosProgressList: [], // 审核进度列表
      policyInfosList: [], // 保障中/保单列表
      policyInfosListTotal: 0, // 保障中总数
      reviewProgressForm: { pn: 1, ps: 10, needApprove: 1 },
      policyListForm: {
        pn: 1,
        ps: 10,
        policyStatus: '01',
      },
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route(to, from) {
      if (
        from.path == '/enterpriseInformation' ||
        from.path == '/myServiceIndex/myService'
      )
        this.checkcomplete()
    },
  },
  methods: {
    init() {
      this.checkcomplete()
      this.getPolicyInfosProgress(this.reviewProgressForm)
      this.getPolicyInfos(this.policyListForm)
    },
    // 补充资料
    supplement(orgId) {
      this.$router.push({
        path: '/enterpriseInformation',
        query: {
          orgId,
        },
      })
    },
    // 查看企业资料
    viewEnterprise(orgId) {
      this.$router.push({
        path: '/enterpriseInformation',
        query: {
          orgId,
        },
      })
    },
    addPolicy() {
      this.$router.push({
        name: 'AddPolicys',
      })
    },
    goDetaila(row) {
      this.$refs.policyDetail.isVerify = true
      this.$refs.policyDetail.dialogVisible = true
      this.$refs.policyDetail.userCode = row.policyNo
    },
    goDetailb(row) {
      this.$refs.policyDetail.dialogVisible = true
      this.$refs.policyDetail.userCode = row.policyNo
    },
    async checkcomplete() {
      let { code, data } = await checkcomplete()
      if (code == '0000') {
        console.log('----wen--', data)
        this.enterpriseInformation = data
        window.sessionStorage.setItem(
          'isComplete',
          JSON.stringify(data.isComplete)
        )
      }
    },
    // 审核进度
    async getPolicyInfosProgress(form) {
      let { code, list, total } = await getPolicyInfos(form)
      if (code == '0000') {
        this.policyInfosProgressList = list
      }
    },
    // 保障中/保单列表
    async getPolicyInfos(form) {
      let { code, list, total } = await getPolicyInfosBz(form)
      if (code == '0000') {
        this.policyInfosList = list
        this.policyInfosListTotal = total
      }
    },
  },
}
</script>

<style lang="scss">
#myService {
  box-sizing: border-box;
  padding: 20px;

  .my-service-top {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 25px;
    border: 1px solid #096dd9;
    border-radius: 6px;

    .service-top-left {
      box-sizing: border-box;
      position: relative;
      display: flex;
      width: 40%;
      padding-left: 60px;

      .left-icon {
        width: 75px;
        height: 75px;
        text-align: center;
        line-height: 75px;
        font-size: 35px;
        color: #096dd9;
        border: 1px solid #096dd9;
        border-radius: 50%;
      }

      .left-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 40px;

        .name {
          font-weight: bold;
        }

        .account-number {
          color: #919191;
        }
      }
    }

    .service-top-left::before {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 70%;
      background: #bbb;
      transform: translateY(-50%);
    }

    .service-top-left,
    .service-top-right {
      p {
        margin: 0;
        font-size: 16px;
        line-height: 30px;
      }
    }

    .service-top-right {
      box-sizing: border-box;
      width: 60%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 60px;

      p {
        font-size: 14px;

        button.zl {
          margin-left: 10px;
          border-color: #096dd9;
          border-radius: 5px;
          color: #096dd9;
        }
      }
    }
  }

  .review-progress,
  .guarantee-policy {
    #title {
      .text {
        color: #096dd9;
      }
    }
  }

  .review-progress {
    margin-top: 20px;
  }

  .guarantee-policy {
    margin-top: 20px;
  }

  .policy-list {
    .policy-list-header {
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      padding: 0 30px;
      border: 1px solid #eee;
      background: #f5f5f5;
    }

    .policy-list-conten-item {
      box-sizing: border-box;
      display: flex;
      padding: 15px 30px;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;

      .policy-list-conten-item-left {
        width: 70%;

        div {
          display: flex;

          p {
            width: 500px;
          }
        }
      }

      .policy-list-conten-item-right {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 30%;
      }
    }

    .policy-list-conten-empty {
      height: 160px;
      line-height: 160px;
      text-align: center;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
      font-size: 14px;

      p {
        margin: 0;
      }

      button {
        font-size: 14px;
      }
    }
  }
}
</style>