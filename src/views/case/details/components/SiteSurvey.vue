<template>
  <!-- 现场查勘 -->
  <div id="SiteSurvey">
    <Title title="现场查勘"></Title>
    <div class="row">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">查勘人员姓名：</span>
          <span>{{ caseSiteSurveyResp.name }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">查勘人员联系电话：</span>
          <span>
            {{ caseSiteSurveyResp.phone ? caseSiteSurveyResp.phone : '—' }}
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <span class="title">查勘时间：</span>
          <span>{{ caseSiteSurveyResp.time }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <span class="title">查勘描述：</span>
          <TipsText :text="caseSiteSurveyResp.remark" :length="50" />
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col v-if="this.caseSiteSurveyResp.fileRecordIds" :span="8">
          <span class="title">查勘报告：</span>
          <span
            v-if="this.caseSiteSurveyResp.fileRecordIds.length"
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
  name: 'SiteSurvey',
  components: {
    Title,
    TipsText,
  },
  props: {
    caseSiteSurveyResp: {
      type: Object,
      require: true,
      default: () => {
        return {}
      },
    },
  },

  data() {
    return {
      // caseSiteSurveyResp: {
      //   fileRecordIds: [],
      // },
    }
  },
  methods: {
    report() {
      console.log(this.caseSiteSurveyResp.fileRecordIds)
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.caseSiteSurveyResp.fileRecordIds[0]
          if (id) {
            let res = await getFile('/files/downloadfile/' + id)
            console.log(res.code, 'code')
            // if (res.code == '9999') {
            //   this.$baseMessage(' 下载失败', 'error')
            // } else {
            //   this.$baseMessage(' 下载成功', 'success')
            // }
          } else {
            this.$baseMessage(' 文件为空', 'error')
          }
        })
        .catch((_) => {})
    },
  },
}
</script>

<style scoped lang="scss" scoped>
#SiteSurvey {
  padding: 0;
  margin: 10px 0;
  background-color: #fff;

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
