<template>
  <div id="serviceSummaryDetails">
    <Title title="服务总结"></Title>
    <div class="row">
      <el-row type="flex">
        <el-col :span="16">
          <span class="title">检查结果：</span>
          <span>
            本次服务共检查：
            <span class="color-orange">{{ planDetail | theSum }}</span>
            项
          </span>
          <span class="color-green ml10">符合</span>
          <span class="ml10">{{ planDetail.unAccordNum }} 项</span>
          <span class="color-orange ml10">不符合</span>
          <span class="ml10">{{ planDetail.accordNum }} 项</span>
          <span class="color-gray-5 ml10">不涉及</span>
          <span class="ml10">{{ planDetail.unRelate }} 项</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="mt10">
        <el-col :span="16">
          <span class="title">风险管控责任人姓名：</span>
          <span>{{ planDetail.chargePersonName }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="mt10">
        <el-col :span="16">
          <span class="title">风险管控责任人联系电话：</span>
          <span>{{ planDetail.chargePersonPhone }}</span>
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
          <div
            v-for="(item, key) in summaryFile"
            :key="key"
            class="img-box"
            @click="enlargeImg(item.imgUrl)"
          >
            <img :src="item.imgUrl" alt="" />
          </div>
        </el-col>
      </el-row>
    </div>
    <ImgDialog ref="ImgDialog" />
  </div>
</template>

<script>
  import Title from '@/components/Title'
  import ImgDialog from '@/components/ImgDialog'
  import { addTrainSummary } from '@/service/accidentManagement'
  // import { getImgFile } from '@/api/resources'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceReport',
    components: {
      Title,
      ImgDialog,
    },
    filters: {
      theSum(row) {
        let sum =
          Number(row.unAccordNum) + Number(row.accordNum) + Number(row.unRelate)
        return sum || 0
      },
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
      }),
    },
    watch: {},
    mounted() {},
    methods: {
      async initData(val) {
        console.log(val)
        this.dialogVisible = true
        this.getImg()
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
      // 放大图片
      enlargeImg(src) {
        this.$refs.ImgDialog.open(src)
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
        width: 180px;
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
