<template>
  <div id="assessmentDetail">
    <div class="top">
      <Title title="评估详情"></Title>
      <el-button type="info" class="back" @click="back">返回</el-button>
    </div>
    <div class="descriptions-content mt20">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">评估项目名称</template>
          {{ detail.name }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">评估类型</template>
          {{ detail.superviseType }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">评估项目委托单位</template>
          {{ detail.superviseCompany }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">评估对象</template>
          {{ detail.superviseObject }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">评估项目实施单位</template>
          {{ detail.exploitingWorkUnit }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">评估时间</template>
          {{ detail.superviseTime.split(' ')[0] }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">评估结果</template>
          {{ detail.superviseResult }}
        </el-descriptions-item>
        <el-descriptions-item size="medium" label-style="text-align: right">
          <template slot="label">评估报告</template>
          <a
            v-for="urls in detail.urls"
            :key="urls.id"
            style="padding: 0 10px"
            @click="downloadFile(urls.id)"
          >
            {{ urls.name }}
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { mapGetters } from 'vuex'
  import { baseMixin } from '@/mixins/baseMixins'
  import { findAssessmentById } from '@/api/supervise'
  import { getFile } from '@/api/resources'
  export default {
    name: 'AssessmentDetail',
    components: {
      Title,
    },
    mixins: [baseMixin],
    data() {
      return {
        detail: {},
        assessTypeEnum: [], // 评估类型
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'tabsBar/visitedRoutes',
        enumData: 'enums/getStrEnumAll',
      }),
    },
    created() {
      this.init()
    },
    activated() {
      this.findAssessmentById(this.$route.query.id)
    },
    methods: {
      init() {
        this.findAssessmentById(this.$route.query.id)
        this.assessTypeEnum = this.enumData.AssessTypeEnum
      },
      async findAssessmentById(id) {
        let { code, data } = await findAssessmentById(id)
        if (code === '0000') {
          let assessTypeEnum = this.assessTypeEnum.find(
            (item) => item.strCode === data.superviseType
          )
          data.superviseType = assessTypeEnum ? assessTypeEnum.label : ''
          this.detail = data
        }
      },
      back() {
        this.toThisTag()
      },
      downloadFile(id) {
        // downloadFile(id);
        getFile('/files/downloadfile/' + id)
      },
      //获取uuid文件名称（去掉扩展名）
      getFileName(data) {
        return data.substring(0, data.indexOf('.'))
      },
    },
  }
</script>

<style lang="scss" scoped>
  #assessmentDetail {
    margin: 20px;
    .descriptions-content {
      width: 800px;
    }
    .top {
      position: relative;
      width: 100%;
      .back {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
    ::v-deep .el-descriptions-item__label.is-bordered-label {
      width: 10%;
      font-size: 12px;
      color: #000;
    }
    ::v-deep .el-descriptions-item__content {
      width: 30%;
    }
  }
</style>
