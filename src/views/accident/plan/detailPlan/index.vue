<template>
  <div id="detailPlan">
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
          <el-tab-pane label="服务信息">
            <plan-detail
              :plan-detail="data.accidentPrePlanEntity"
              :plan-status="planStatus"
              :organization-resp="data.organizationResp || {}"
              :service-list="data.accidentPreExpertEntityList"
            ></plan-detail>
          </el-tab-pane>
          <el-tab-pane label="服务企业清单" v-if="type == '01'">
            <div
              v-if="
                data.accidentJoinEnterpriseResp &&
                data.accidentJoinEnterpriseResp.length
              "
              class="mt10"
            >
              共{{ data.accidentJoinEnterpriseResp.length }}家企业
            </div>
            <el-table
              :data="data.accidentJoinEnterpriseResp"
              height="280"
              :header-cell-style="getRowClass"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="50"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="enterpriseName"
                label="生产经营单位名称"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="enterpriseCode"
                label="社会信用代码"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="firstIndustryName"
                label="管理分类"
              >
                <template slot-scope="scope">
                  {{ scope.row.firstIndustryName }}
                  <span v-if="scope.row.secondIndustryName">
                    {{ scope.row.secondIndustryName }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="实际经营地址">
                <template slot-scope="scope">
                  {{
                    scope.row.provinceName +
                    '/' +
                    scope.row.cityName +
                    '/' +
                    scope.row.countyName
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="详细地址"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="风险管控记录" v-if="type == '02'">
            <risk-record
              v-if="type === '02'"
              :danger-list="data.accidentPreDangerEntities"
              :plan-detail="data.accidentPrePlanEntity"
            ></risk-record>
          </el-tab-pane>
          <el-tab-pane label="隐患整改记录" v-if="type == '03'">
            <danger-record
              :danger-list="data.accidentPreDangerEntities"
              :plan-detail="data.accidentPrePlanEntity"
            />
          </el-tab-pane>
          <el-tab-pane label="问题详情" v-if="type == '04'">
            <!-- 生产标准化建设类 -->
            <Production
              :danger-list="data.recordResps"
              :plan-detail="data.accidentPrePlanEntity"
            ></Production>
          </el-tab-pane>
          <el-tab-pane label="预案详情" v-if="type == '05'">
            <EarlyWarning
              :danger-list="data.recordResps"
              :plan-detail="data.accidentPrePlanEntity"
            ></EarlyWarning>
          </el-tab-pane>

          <el-tab-pane label="服务总结">
            <planSummary
              :plan-detail="data.accidentPrePlanEntity"
              :summary-file="data.summaryFileRecordEntities || []"
              :corp-list="data.accidentJoinEnterpriseResp"
              :plan-type="type"
            />
            <service-file :plan-files="data.planFiles || []" />
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
import PlanDetail from '../components/planDetail.vue'
import { getPlanDetails } from '@/api/accidentManagement'
import { mapGetters } from 'vuex'
import { getImgFile } from '@/api/resources'
import DangerRecord from '../components/dangerRecord.vue'
import riskRecord from '../components/riskRecord.vue'
import planSummary from './components/planSummary.vue'
import ServiceFile from './components/serviceFile.vue'
import Production from '../components/production' //生产标准建设 - 问题详情
import EarlyWarning from '../components/earlyWarning.vue' //生产标准建设 - 问题详情
export default {
  name: 'detailPlan',
  components: {
    PlanDetail,
    DangerRecord,
    planSummary,
    ServiceFile,
    riskRecord,
    Production,
    EarlyWarning,
  },
  data() {
    return {
      planStatus: '',
      dialogVisible: false,
      title: '服务计划详情',
      activeName: '0',
      id: '',
      type: '',
      data: {},
      tableData: [],
    }
  },
  computed: {
    ...mapGetters({
      areaList: 'areas/areaList',
      areaListAll: 'areas/areaListAll',
      areaMap: 'areas/areaMap',
    }),
  },
  methods: {
    async getInit() {
      let res = await getPlanDetails(this.id)
      if (res.code === '0000') {
        if (res.data.summaryFileRecordEntities) {
          await this.getImgFile(res.data.summaryFileRecordEntities).then(
            (r) => {
              res.data.summaryFileRecordEntities = r
              let obj = []
              try {
                obj = res.data.accidentPreDangerEntities.map((item) => {
                  let newObj = item.accidentPreDangerEntity
                  newObj.url = item.fileRecordEntities
                  return newObj
                })
              } catch (error) {}
              res.data.accidentPreDangerEntities = obj
              this.data = res.data
            }
          )
        } else {
          let obj = []
          if (
            res.data.accidentPreDangerEntities &&
            res.data.accidentPreDangerEntities.length
          ) {
            try {
              obj = res.data.accidentPreDangerEntities.map((item) => {
                let newObj = item.accidentPreDangerEntity
                newObj.url = item.url
                return newObj
              })
            } catch (err) {}
          }

          res.data.accidentPreDangerEntities = obj
          this.data = res.data
        }
        this.planStatus = res.data.accidentPrePlanEntity.planStatus
        this.createTime = res.data.accidentPrePlanEntity.createTime || ''
        let objKey = [
          'normal',
          'noramlCheck',
          'major',
          'majorCheck',
          'industryOneName',
          'industryTwoName',
          'industryThreeName',
          'industryFourName',
          'provinceCode',
          'cityCode',
          'countryCode',
          'detailAddress',
        ]
        objKey.forEach((item) => {
          if (
            item === 'provinceCode' ||
            item === 'cityCode' ||
            item === 'countryCode'
          ) {
            this.data.accidentPrePlanEntity[item] = this.areaMap[res.data[item]]
          } else {
            this.data.accidentPrePlanEntity[item] = res.data[item]
          }
        })
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#ffefe5;color:#ff7f30'
      } else {
        return ''
      }
    },
    async getImgFile(list) {
      for (let key of list) {
        let { data } = await getImgFile(key.url)

        key.imgUrl = data
      }
      return list
    },
    handleClose() {
      this.dialogVisible = false
    },
    close(e) {
      this.activeName = '0'
    },
    handleClick(e) {},
  },
}
</script>

<style lang="scss">
#detailPlan {
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

#detailPlan .el-dialog__wrapper .el-dialog {
  margin-top: 10vh !important;
}
</style>