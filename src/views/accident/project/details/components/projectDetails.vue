<template>
  <div id="details">
    <Title
      title="项目信息"
      class="ml20 mr20"
      :button-right="{
        type: 'primary',
        flag: (isAuth('120005') && projectDetails.approveStatus !== 7)? true : false,
        text: '项目完成',
        emit: 'right',
      }"
      @right="register"
    ></Title>
    <div class="row">
      <el-row type="flex" class="row-bg">
        <span class="color-blue">{{ projectDetails.projectName }}</span>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="13">
          <el-row type="flex" class="row-bg">
            <el-col :span="8">
              <span class="title">服务合同编号：</span>
              <span class="color-blue">{{ projectDetails.contractNo }}</span>
            </el-col>
            <el-col :span="8">
              <span class="title">项目进度：</span>
              <span
                v-if="projectDetails.approveStatus == '5'"
                class="project-status"
              >
                待制定计划
              </span>
              <span
                v-if="projectDetails.approveStatus == '6'"
                class="project-status"
              >
                进行中
              </span>
              <span
                v-if="projectDetails.approveStatus == '7'"
                class="project-status"
              >
                已完成
              </span>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="8">
              <span class="title">合同有效期：</span>
              <span>{{ projectDetails.startTime | format("YYYY-MM-DD") }}</span>
              <span>至</span>
              <span>{{ projectDetails.endTime | format("YYYY-MM-DD") }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="16">
              <span class="title">预算服务费金额（元）：</span>
              <span class="color-red">
                ￥{{
                  projectDetails.accidentPreFund
                    ? projectDetails.accidentPreFund.toFixed(2)
                    : ''
                }}
                元
              </span>
              <span class="color-red">（{{ bigMoney }} ）</span>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="16">
              <span class="title">项目服务说明：</span>
              <span>{{ projectDetails.remark }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10" style="border-left:1px dashed #ccc;padding-left:20px; margin-left:20px">
          <el-row type="flex" class="row-bg">
            <el-col :span="22">
              <span class="title">发起单位：</span>
              <span>{{ projectDetails.orgName }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="22">
              <span class="title">安全服务机构：</span>
              <span>{{ projectDetails.serviceAgencyName }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="22">
              <span class="title">录入日期：</span>
              <span>{{ projectDetails.createTime }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">
            <el-col :span="22">
              <span class="title">录入人员：</span>
              <span>{{ projectDetails.createByName }}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { smalltoBIG } from '@/util/validate'
  import { finishProject } from '@/service/accidentManagement'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceAdd',
    components: {
      Title,
    },
    props: {
      projectDetails: {
        type: Object,
        required: true,
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
      bigMoney() {
        return smalltoBIG(this.projectDetails.accidentPreFund) || '零'
      },
    },
    mounted() {},
    methods: {
      async register() {
        let text = '确认项目完成'
        this.$confirm(text)
          .then(_ => {
            this.configRegister()
          })
          .catch(_ => {
            this.$message.info('已取消')
          });
      },
      async configRegister() {
        let res = await finishProject(this.$route.query.id)
        if (res.code === '0000') {
          this.$message.success('成功')
          this.toThisTag()
        }
      },
      // 设置路由
      async toThisTag() {
        this.$router.push({
          path: '/prev/project',
        })
        return 
      },
    },
  }
</script>

<style scoped lang="less">
  #details {
    .row {
      margin-left: 30px;
      margin-top: 20px;
      .row-bg {
        margin-bottom: 20px;
        .project-status {
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
