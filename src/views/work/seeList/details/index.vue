<template>
  <div id="newsDetails" class="ql-snow">
    <div class="pl15 pr15">
      <h1 class="text-center">{{ ruleForm.title }}</h1>
      <h3>
        <span>类别：</span>
        <span>{{ ruleForm.typeName }}</span>
        <span class="ml20">发布时间：</span>
        <span>{{ ruleForm.publishTime }}</span>
      </h3>
    </div>
    <div class="ql-editor" v-html="ruleForm.content"></div>
  </div>
</template>

<script>
  import { addNews, getNewsType, putNews, getNewsDetails } from '@/api/news'
  import { mapGetters } from 'vuex'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    name: 'Details',
    data() {
      return {
        data: {},
        ruleForm: {
          content: '',
          newsStatus: '',
          publishTime: '',
          title: '',
          typeId: '',
          id: '',
        },
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      },
    },
    activated() {
      this.initData()
    },
    methods: {
      async initData() {
        this.getNewsDetails()
      },
      async getNewsDetails() {
        let res = await getNewsDetails(this.$route.query.id)
        if (res.code === '0000') {
          this.ruleForm = res.data
        }
      },
      // 设置路由
      async toThisTag() {
        const view = this.visitedRoutes.filter((item, index) => {
          if (item.path !== this.$route.fullPath) {
            return item
          }
        })
        await this.$store.dispatch('tabsBar/delOthersRoutes', view)
        this.$router.push({
          path: 'workNews',
        })
        return view
      },
    },
  }
</script>

<style lang="scss" scoped>
  #newsDetails {
    background-color: #fff;
    margin: 30px;
    .btn-bottom {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
<style>
  .ql-align-justify {
    text-indent: 2em;
  }
  p {
    font-size: 16px;
    margin: 15px 0;
  }
</style>
