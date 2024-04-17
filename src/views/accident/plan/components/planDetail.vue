<template>
  <div id="details">
    <div class="row">
      <el-form label-position="left" label-width="112px">
        <el-row>
          <el-col :span="8">
            <el-form-item v-if="planDetail.planName" label="服务名称：">
              <moreCon
                class="color-blue"
                :data="planDetail.planName"
                :length="13"
              />
            </el-form-item>
            <el-form-item
              v-if="organizationResp.custFullName"
              label="被服务企业："
            >
              <moreCon
                class="color-blue"
                :data="organizationResp.custFullName"
                :length="13"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务类型：">
              <moreCon
                v-if="planDetail.preSecondTypeName"
                class="color-blue"
                :data="
                  planDetail.preFirstTypeName +
                  `/` +
                  planDetail.preSecondTypeName
                "
                :length="13"
              />
              <moreCon
                v-else
                class="color-blue"
                :data="planDetail.preFirstTypeName"
                :length="13"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务进度：">
              <span v-if="planStatus == '1'" class="project-status">
                待进行
              </span>
              <span v-if="planStatus == '2'" class="project-status">
                进行中
              </span>
              <span v-if="planStatus == '3'" class="project-status">
                已完成
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="服务期间：">
              <span>{{ planDetail.startTime | setTime }}</span>
              <span>至</span>
              <span>{{ planDetail.endTime | setTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务地点：">
              <span v-if="planDetail.planName">
                <span>
                  {{ planDetail.planProvinceName }}/{{
                    planDetail.planCityName
                  }}/{{ planDetail.planCountyName }}
                </span>
              </span>
              <span v-else>
                <span v-if="organizationResp.provinceName">
                  {{ organizationResp.provinceName }}/{{
                    organizationResp.cityName
                  }}/{{ organizationResp.countyName }}
                </span>
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务专家：">
              <span v-if="experts.length < 6">
                {{ experts }}
                <span @click="moreExpers" class="pointer ckBtn">点击查看</span>
              </span>
              <span v-if="experts.length > 6">
                {{ experts.slice(0, 6) }}...
                <span @click="moreExpers" class="pointer ckBtn">点击查看</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="支出金额：">
              <span class="color-red">
                ￥{{
                  planDetail.expendFund
                    ? planDetail.expendFund.toFixed(2)
                    : '0.00'
                }}元
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务描述：">
              <moreCon :data="planDetail.checkRemark || '--'" :length="13" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog
      title="查看服务专家"
      :visible.sync="dialogVisible"
      width="700"
      append-to-body
    >
      <div>
        <el-table
          :data="serviceList"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
          style="width: 100%"
        >
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="姓名"
          ></el-table-column>
          <el-table-column prop="specialty" show-overflow-tooltip label="职称">
            <template slot-scope="scope">
              {{
                scope.row.safetyTechniciansPost
                  ? getExpertName(scope.row.safetyTechniciansPost)
                  : '--'
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            width="200"
            label="身份证号"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.idCard">
                {{ scope.row.idCard | setIdCard }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            prop="phone"
            label="手机号"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.phone">
                {{ scope.row.phone | setPhone }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { smalltoBIG } from '@/utils/validate'
import { mapGetters } from 'vuex'
import moreCon from '@/components/moreCon'
export default {
  name: 'ServiceAdd',
  components: { moreCon },
  props: {
    planDetail: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    planStatus: {
      type: Number,
      default: () => {
        return 2
      },
    },
    serviceList: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    organizationResp: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      data: {},
    }
  },
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
    experts() {
      let name = ''
      if (this.serviceList && this.serviceList.length) {
        name = this.serviceList.map((item) => {
          return item.name
        })
        name = name.join('/')
      }

      return name
    },
    bigMoney() {
      return smalltoBIG(this.planDetail.accidentPreFund) || '零'
    },
    getPreTypeName() {
      let value = this.enumList.AccidentTypeEnum.find(
        (item) => item.code === this.planDetail.preType
      )
      return (value && value.label) || '无'
    },
    tableList() {
      if (this.organizationResp && this.organizationResp.id) {
        let list = []
        this.organizationResp.sysDictItemEntitys.forEach((item) => {
          list.unshift(item.itemText)
        })
        let obj = JSON.parse(JSON.stringify(this.organizationResp))
        obj.sysDictItemEntitysName = list.join('、')
        obj.areaName = `${obj.provinceName}${obj.cityName}${obj.countyName}${obj.streetName}`
        console.log(obj)
        return [obj]
      } else {
        return []
      }
    },
  },
  mounted() {},
  methods: {
    getExpertName(code) {
      return this.getStrEnumAll.SafetyTechniciansPostEnum.find(
        (it) => it.code == code
      ).label
    },
    moreExpers() {
      this.dialogVisible = true
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center'
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped lang="scss">
#details {
  padding-bottom: 20px;
  padding-top: 10px;
  .project-status {
    color: #ffa940;
  }
  .row {
    margin-left: 30px;
    margin-top: 20px;
    .row-bg {
      margin-bottom: 20px;
      .project-type {
        display: inline-block;
        padding: 4px 10px;
        background-color: #ffa940;
        color: #fff;
        border-radius: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
#details .el-form-item__label {
  color: #919191;
}
#details .el-form-item {
  margin-bottom: 5px;
}
</style>