<template>
  <div id="AccidentInformationDetails">
    <Title title="报案信息"></Title>
    <div class="row">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">保单号：</span>
          <span>
            {{ caseInfoEntity.policyNo }}
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">报案人姓名：</span>
          <span>
            {{ caseInfoEntity.reportName }}
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">报案人联系电话：</span>
          <span>{{ caseInfoEntity.reportPhone }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">报案时间：</span>
          <span>{{ caseInfoEntity.reportTime }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">事故发生时间：</span>
          <span>{{ caseInfoEntity.lossTime }}</span>
        </el-col>
        <el-col :span="12">
          <span class="title">事故发生地点：</span>
          <span>{{ caseInfoEntity.accidentProvinceName }},</span>
          <span>{{ caseInfoEntity.accidentCityName }},</span>
          <span>{{ caseInfoEntity.accidentCountyName }}</span>
          <span v-if="caseInfoEntity.accidentAreaName">
            ,{{ caseInfoEntity.accidentAreaName }}
          </span>
          ,
          <TipsText :text="caseInfoEntity.riskAddr" :length="7" />

          <!-- <span>,{{ caseInfoEntity.riskAddr }}</span> -->
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">死亡人数：</span>
          {{ caseInfoEntity.deathNum }}
        </el-col>
        <el-col :span="8">
          <span class="title">受伤人数：</span>
          {{ caseInfoEntity.injuryNum }}
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <span class="title textArea">事故描述：</span>
          <el-input
            class="w400"
            disabled
            :value="caseInfoEntity.lossProcess"
            type="textarea"
          ></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">立案号：</span>
          <span>{{ caseInfoEntity.caseNo }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">立案时间：</span>
          <span>{{ caseInfoEntity.caseTime }}</span>
        </el-col>
      </el-row>

      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">决案时间：</span>
          <span>{{ caseInfoEntity.closeCaseTime }}</span>
        </el-col>
        <el-col v-if="reversespec.length" :span="8">
          <span class="title">特殊行业领域事故类型：</span>
          <span v-for="(item, index) in reversespec" :key="index">
            {{ item.itemText }}
          </span>
        </el-col>
        <el-col v-if="!reversespec.length" :span="8">
          <span class="title">特殊行业领域事故类型：</span>
          <span>
            {{
              caseInfoEntity.specAccidentTypeName
                ? caseInfoEntity.specAccidentTypeName
                : '—'
            }}
          </span>
        </el-col>
      </el-row>

      <el-row type="flex" class="row-bg">
        <el-col v-if="caseInfoEntity.accidentTypeItems" :span="8">
          <span class="title">事故类型：</span>
          <span
            v-for="(item, index) in caseInfoEntity.accidentTypeItems"
            :key="index"
          >
            {{ item.itemText }}
          </span>
        </el-col>
        <el-col v-if="!caseInfoEntity.accidentTypeItems" :span="8">
          <span class="title">事故类型：</span>
          <span>
            {{
              caseInfoEntity.accidentTypeName
                ? caseInfoEntity.accidentTypeName
                : '—'
            }}　
          </span>
        </el-col>

        <el-col :span="8">
          <span class="title">事故原因：</span>
          <span>{{ caseInfoEntity.reason ? caseInfoEntity.reason : '—' }}</span>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8">
          <span class="title">事故调查报告：</span>
          <span
            v-if="this.caseInfoEntity.accidentFiles"
            class="color-blue report"
            @click="report"
          >
            查看报告
          </span>
          <span v-else>—</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getFile } from '@/api/resources.js'
import Title from '@/components/NewTitle'
import TipsText from '@/components/TipsText'
export default {
  name: 'AccidentInformationDetails',
  components: {
    Title,
    TipsText,
  },
  props: {
    caseInfoEntity: {
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
    reversespec() {
      let res = []
      if (this.caseInfoEntity.specAccidentItems != null) {
        res = this.caseInfoEntity.specAccidentItems.slice().reverse()
      }
      return res
    },
  },
  methods: {
    report() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          if (this.caseInfoEntity.accidentFiles) {
            let id = this.caseInfoEntity.accidentFiles[0].id
            let res = getFile('/files/downloadfile/' + id)
          } else if (this.caseInfoEntity.accidentReportIds) {
            let id = this.caseInfoEntity.accidentReportIds[0]
            let res = getFile('/files/downloadfile/' + id)
          }
        })
        .catch((_) => {})
    },
  },
}
</script>

<style scoped lang="scss" scoped>
#AccidentInformationDetails {
  padding: 0 0 20px;
  margin: 10px 0;
  background-color: #fff;
  .textArea {
    vertical-align: top;
  }
  .title {
    display: inline-block;
    width: 210px;
    text-align: right;
  }
  .row {
    margin-left: 30px;
    padding: 10px 0;
    .row-bg {
      margin-bottom: 20px;
    }
  }
  .report {
    font-weight: 600;
    cursor: pointer;
  }
}
</style>
