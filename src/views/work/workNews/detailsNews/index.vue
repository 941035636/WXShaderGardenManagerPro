<template>
  <div id="highRiskDetails">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="标题：">
        {{ ruleForm.title }}
      </el-form-item>
      <el-form-item label="选择类别：">
        {{ ruleForm.typeName }}
      </el-form-item>
      <el-form-item label="发布日期：">
        {{ ruleForm.publishTime }}
      </el-form-item>
      <el-form-item label="发布人：">
        {{ ruleForm.updateByName }}
      </el-form-item>
      <el-form-item label="" prop="duty">
        <div class="edit_container">
          <quill-editor
            ref="myQuillEditor"
            v-model="ruleForm.content"
            disabled
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { getOrgDetails, addOrg, getNational } from '@/api/userDataManagement'
  import { addNews, getNewsType, putNews, getNewsDetails } from '@/api/news'
  import { mapGetters } from 'vuex'
  import { validateQiYeName, validateBlCode } from '@/utils/validateFrom'
  export default {
    name: 'DetailsNews',
    components: {
      quillEditor,
    },
    data() {
      return {
        editorOption: {
          placeholder: '请在这里输入',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'], //引用，代码块
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: 'ordered' }, { list: 'bullet' }], //列表
              [{ script: 'sub' }, { script: 'super' }], // 上下标
              [{ indent: '-1' }, { indent: '+1' }], // 缩进
              [{ direction: 'rtl' }], // 文本方向
              [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ font: [] }], //字体
              [{ align: [] }], //对齐方式
              ['clean'], //清除字体样式
              // ['image', 'video'], //上传图片、上传视频
            ],
          },
        },
        data: {},
        ruleForm: {
          content: '',
          newsStatus: '',
          publishTime: '',
          title: '',
          typeId: '',
          id: '',
        },
        typeData: [],
        rules: {
          custFullName: [
            { required: true, validator: validateQiYeName, trigger: 'blur' },
          ],
          orgNature: [
            { required: true, message: '请选择企业类型', trigger: 'change' },
          ],
          blCode: [
            { required: true, validator: validateBlCode, trigger: 'blur' },
          ],
        },
      }
    },
    computed: {
      ...mapGetters({
        areaList: 'areas/areaList',
        areaListAll: 'areas/areaListAll',
        areaMap: 'areas/areaMap',
        visitedRoutes: 'tabsBar/visitedRoutes',
        strEnumData: 'enums/getStrEnumObj',
      }),
      editor() {
        return this.$refs.myQuillEditor.quill
      },
    },
    activated() {
      this.initData()
    },
    methods: {
      async initData() {
        this.getNewsType()
        if (this.$route.query.id) {
          this.getNewsDetails()
        }
      },
      async getNewsType() {
        let res = await getNewsType()
        if (res.code === '0000') {
          this.typeData = res.list.map((item) => {
            return {
              code: item.id,
              label: item.typeName,
            }
          })
        }
      },
      async getNational() {
        let res = await getNational()
        if (res.code == '0000') {
          this.nationalData = res.data
          this.nationalObj = this.setDiGuiDataObj(res.data, 'national')
        }
      },
      async getNewsDetails() {
        let res = await getNewsDetails(this.$route.query.id)
        if (res.code === '0000') {
          this.ruleForm = res.data
          console.log(this.ruleForm)
        }
      },
      // 准备编辑器
      onEditorReady(editor) {},
      onEditorBlur() {}, // 失去焦点事件
      onEditorFocus() {}, // 获得焦点事件
      onEditorChange() {}, // 内容改变事件
      register(type) {
        let text = '确定要发布新闻信息？'
        if (this.ruleForm['id']) {
          text = '确定要修改发布新闻信息？'
        }
        this.$baseConfirm(
          text,
          '',
          () => {
            this.$refs['ruleForm'].validate((valid) => {
              if (valid) {
                this.configRegister(type)
              } else {
                return false
              }
            })
          },
          () => {
            // this.$baseMessage('已取消', 'info')
          }
        )
        return
      },
      async configRegister(type) {
        let data = JSON.parse(JSON.stringify(this.ruleForm))
        data.newsStatus = type
        let formData = new FormData()
        for (let key in data) {
          if (key === 'files' && this.ruleForm[key]) {
            formData.append(key, this.ruleForm[key]['file'])
          } else {
            formData.append(key, data[key])
          }
        }
        let res
        if (this.ruleForm.id) {
          res = await putNews(formData)
        } else {
          res = await addNews(formData)
        }
        if (res.code === '0000') {
          this.$baseMessage(
            this.ruleForm.id ? '修改成功' : '添加成功',
            'success'
          )
          this.toThisTag()
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
      currentEnum(key) {
        return this.strEnumData[key] || []
      },
    },
  }
</script>

<style lang="scss" scoped>
  #highRiskDetails {
    background-color: #fff;
    margin: 10px;
    .form-class {
      margin-bottom: 0 !important;
    }
    .btn-bottom {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
