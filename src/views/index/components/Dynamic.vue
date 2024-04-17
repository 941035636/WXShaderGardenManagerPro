<template>
  <div class="dynamic">
    <div class="dynamic-content">
      <div class="policy">
        <div class="title">
          <p class="title-left">投保数据概览</p>
          <p class="title-right" @click="tomMore({ path: 'policy/list' })">
            更多>
          </p>
        </div>
        <el-table :data="policyList" border :header-cell-style="getRowClass">
          <el-table-column
            prop="name"
            label="企业名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="保险期间"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.startTime | setTime }} 至
                {{ scope.row.endTime | setTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="保额"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.limitValue / 10000 }}万</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prem"
            label="保费"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="color-f45f5f">￥{{ scope.row.actualPrem }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="105">
            <template slot-scope="scope">
              <el-button
                class="btn-detail"
                size="mini"
                type="text"
                @click="
                  tomMore({
                    path: 'policy/detail',
                    query: { code: scope.row.policyNo },
                  })
                "
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import { getHomePolicyList } from '@/api/policyManagement'
  export default {
    name: 'Statis',
    components: {},
    props: {},
    data() {
      return {
        loading: false, // 局部加载
        policyList: [],
        newsList: [],
      }
    },
    created() {
      this.getInit()
    },
    mounted() {},
    methods: {
      async getInit() {
        // 初始化加载列表
        this.getHomePolicyList()
      },
      async getHomePolicyList() {
        let data = {
          corporationName: '', //企业名称 ,
          issueCompanyCode: '', //出单公司编码 ,
          policyNo: '', // 保单号
          policyStatus: '', // 保单状态
          ps: 10, //页面大小
          pn: 1, //请求第几页 ,
          issueDateFrom: '', // 签单起期
          issueDateEnd: '', //签单止期
          provinceCode: '', // 省编码
          cityCode: '', // 市编码
          countyCode: '', // 区编码
          industryKind: '', // 行业编码
          desc: true,
          orderby: 'issue_date',
        }
        let res = await getHomePolicyList(data)
        if (res.code == '0000') {
          this.policyList = res.data
        }
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5;text-align:center;'
        } else {
          return ''
        }
      },
      tomMore(url) {
        this.$router.push(url)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .dynamic {
    margin-top: 20px;
    padding: 0 20px 20px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
    .dynamic-content {
      display: flex;
      flex-direction: row;
      width: 100%;
      .policy {
        width: 100%;
        margin-right: 10px;
        box-sizing: border-box;
        padding: 10px;
      }

      .title {
        display: flex;
        justify-content: space-between;
        .title-left {
          font-size: 20px;
          color: #101010;
        }
        .title-right {
          font-size: 20px;
          color: #101010;
          cursor: pointer;
        }
      }
    }
  }
</style>
