<template>
  <div id="serviceSummaryDetails">
    <Title :title="getTitle"></Title>
    <div class="row">
      <el-row type="flex">
        <el-col :span="16">
          <span class="title">线上/线下：</span>
          <span v-if="planDetail.offline==false">线上</span>
          <span v-if="planDetail.offline==true">线下</span>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="16">
          <span class="title">服务实施日期：</span>
          <span>{{ planDetail.implementationTime | format("YYYY-MM-DD") }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="mt10">
        <el-col :span="16">
          <span class="title">参加企业数量：</span>
          <span>{{ planDetail.corporationNum }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="mt10">
        <el-col :span="16">
          <span class="title">参加培训人数：</span>
          <span>{{ planDetail.personNum }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="mt10">
        <el-col :span="16">
          <span class="title">服务情况说明：</span>
          <span>{{ planDetail.checkRemark }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg mt10">
        <el-col :span="16" class="display-flex">
          <div class="title">照片列表：</div>
          <div v-for="(item, key) in summaryFile" :key="key" class="img-box">
            <img :src="item.imgUrl" alt="" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import { addTrainSummary } from '@/service/accidentManagement'
  // import { getImgFile } from '@/api/resources'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceReport',
    components: {
      Title,
    },
    props: {
      summaryFile: {
        type: Array,
        required: true,
        default: () => {
          return []
        },
      },
      planDetail: {
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
        activeName: 'first',
        dealDateStartOptions: this.beginDate(),
        tableList: [{}],
        fileList: [],
        ruleForm: {
          id: '', // 计划id
          implementationTime: '', // 检查日期
          checkRemark: '', // 备注
          files: '', // 文件
        },
        imageUrl: '',
      }
    },
    computed: {
      ...mapGetters({
        getEnumAll: 'getEnumAll',
      }),
      getTitle() {
        let name = `服务总结`
        return name
      },
    },
    mounted() {},
    methods: {
      async initData(val) {
        console.log(val)
        this.dialogVisible = true
        // this.ruleForm.accidentPreProjectId = val.id
      },
      handleAvatarSuccess(res, file) {
        console.log(file)
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      // 图片上传
      async Upload(file) {
        this.ruleForm.files = file
        const formData = new FormData()
        formData.append('files', file.file)
        // formData.append('type', file.file.type)
        // formData.append("channelcode", "sequip")
        // formData.append("resCode", "I001")
        // let data = formData
        // let data = [file.file]
        // const res = await this.ResourcesService.uploadFile(
        //   'sequip-svc',
        //   'payInfo',
        //   '0',
        //   data
        // )
        // if (res.code == '0000') {
        //   this.id = res.list[0].fileId
        //   this.name = res.list[0].fileName
        // }
        console.log(formData)
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
          this.$message.error('单文件上限10MB!')
        }
        return isLt10M
      },
      onExceed() {
        // this.$message.warning('最多支持10个附件')
      },
      // 设置路由
      async toThisTag() {
        const view = this.visitedRoutes.filter((item, index) => {
          if (item.path !== this.$route.fullPath) {
            return item
          }
        })
        await this.$store.dispatch('tabsBar/delOthersRoutes', view)
        this.$router.go(-1)
        return view
      },
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            let startDate = self.serviceData
              ? self.serviceData.split(' ')[0]
              : new Date()
            return time.getTime() < new Date(startDate)
          },
        }
      },
      getImg(val) {
        let data = ''
        getImgFile(val)
          .then((res) => {
            data = res.data
          })
          .catch((err) => {
            console.log(err)
          })
        return data
      },
    },
  }
</script>

<style scoped lang="less">
  #serviceSummaryDetails {
    margin: 0px 20px 20px;
    padding-bottom: 20px;
    .row {
      margin-left: 30px;
      margin-top: 20px;
      .title {
        display: inline-block;
        width: 100px;
        text-align: right;
        // font-weight: 700;
      }
      .row-bg {
        margin-bottom: 20px;
        .project-type {
          display: inline-block;
          padding: 4px 10px;
          background-color: #ffa940;
          color: #fff;
          border-radius: 20px;
        }
        .img-box {
          width: 200px;
          height: 200px;
          margin-left: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>
