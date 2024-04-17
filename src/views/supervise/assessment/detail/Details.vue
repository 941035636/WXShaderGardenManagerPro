<template>
  <div id="assessmentDetail">
    <el-dialog
      id="detail"
      title="评估详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <div class="box">
        <p>
          <span class="span-title">评估项目名称：</span>
          <span>{{ detail.name }}</span>
        </p>
        <p>
          <span class="span-title">评估类型：</span>
          <span>{{ detail.superviseType }}</span>
        </p>
        <p>
          <span class="span-title">评估项目委托单位：</span>
          <span>{{ detail.superviseCompany }}</span>
        </p>
        <p>
          <span class="span-title">评估对象：</span>
          <span>{{ detail.superviseObject }}</span>
        </p>
        <p>
          <span class="span-title">评估项目实施单位：</span>
          <span>{{ detail.exploitingWorkUnit }}</span>
        </p>
        <p>
          <span class="span-title">评估时间：</span>
          <span>{{ detail.superviseTime }}</span>
        </p>
        <p>
          <span class="span-title">评估结果：</span>
          <span>{{ detail.superviseResult }}</span>
        </p>
        <p>
          <span class="span-title">评估报告：</span>
          <a
            v-for="urls in detail.urls"
            :key="urls.id"
            style="padding: 0 10px"
            @click="downloadFile(urls.id)"
          >
            {{ urls.name }}
          </a>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { findAssessmentById } from '@/api/supervise'
  import { getFile } from '@/api/resources'
  export default {
    name: 'AssessmentDetail',
    components: {},
    data() {
      return {
        detail: {},
        assessTypeEnum: [], // 评估类型
        dialogVisible: false,
      }
    },
    computed: {
      ...mapGetters({
        enumData: 'enums/getStrEnumAll',
      }),
    },
    methods: {
      initData(row) {
        this.findAssessmentById(row.id)
        this.assessTypeEnum = this.enumData.AssessTypeEnum || []
        this.dialogVisible = true
      },
      async findAssessmentById(id) {
        let { code, data } = await findAssessmentById(id)
        if (code === '0000') {
          let assessTypeEnum = this.assessTypeEnum.find(
            (item) => item.strCode === data.superviseType
          )
          data.superviseType = assessTypeEnum ? assessTypeEnum.label : ''
          data.superviseTime = data.superviseTime.split(' ')[0]
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
    .box {
      padding: 0 50px;
    }
    .span-title {
      display: inline-block;
      font-weight: 700;
    }
  }
</style>
