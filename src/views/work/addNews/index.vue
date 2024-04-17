<template>
  <div id="addNews">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
    >
      <el-form-item label="标题：" prop="title">
        <el-input
          v-model.trim="ruleForm.title"
          class="w524"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择类别：" prop="typeId">
        <el-select
          v-model="ruleForm.typeId"
          class="w280"
          placeholder="请选择类别"
        >
          <el-option
            v-for="item in typeData"
            :key="item.code"
            :label="item.label"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布日期" prop="publishTime">
        <el-date-picker
          v-model="ruleForm.publishTime"
          class="w280"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="content">
        <div class="edit_container">
          <quill-editor
            ref="myQuillEditor"
            v-model="ruleForm.content"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
        </div>
      </el-form-item>
    </el-form>
    <div class="btn-bottom">
      <el-button type="info" round @click="toThisTag">返回</el-button>
      <el-button type="primary" round @click="register('1')">保存</el-button>
      <el-button type="primary" round @click="register('2')">发布</el-button>
    </div>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  import * as Quill from 'quill' //引入编辑器
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {
    addNews,
    getNewsType,
    putNews,
    getNewsDetails,
    addNewsFile,
  } from '@/api/news'
  import { mapGetters } from 'vuex'
  import { validateTitle, validateContent } from '@/utils/validateFrom'
  import { loginRSA, tokenName, baseURL } from '@/config'
  import editor from './components/editor'
  var fonts = [
    'SimSun',
    'SimHei',
    'Microsoft-YaHei',
    'KaiTi',
    'FangSong',
    'Arial',
    'Times-New-Roman',
    'sans-serif',
  ]
  var fontsSize = [
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '22px',
    '24px',
    '26px',
  ]
  let Font = Quill.import('formats/font')
  let fontSizeStyle = Quill.import('attributors/style/size')
  Font.whitelist = fonts //将字体加入到白名单
  fontSizeStyle.whitelist = fontsSize // 将字体大小加入到白名单
  Quill.register(Font, true)
  Quill.register(fontSizeStyle, true)
  export default {
    name: 'HighRiskDetails',
    components: {
      // editor,
      quillEditor,
    },
    data() {
      /*富文本编辑图片上传配置*/
      const uploadConfig = {
        action: '/api/news/v1/upEdit', // 必填参数 图片上传地址
        methods: 'POST', // 必填参数 图片上传方式
        token: '', // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
        name: 'files', // 必填参数 文件的参数名
        size: 500, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
        accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon', // 可选 可上传的图片格式
      }
      const handlers = {
        image: function image() {
          var self = this
          var fileInput = this.container.querySelector(
            'input.ql-image[type=file]'
          )
          if (fileInput === null) {
            fileInput = document.createElement('input')
            fileInput.setAttribute('type', 'file')
            // 设置图片参数名
            if (uploadConfig.name) {
              fileInput.setAttribute('name', uploadConfig.name)
            }
            // 可设置上传图片的格式
            fileInput.setAttribute('accept', uploadConfig.accept)
            fileInput.classList.add('ql-image')
            // 监听选择文件
            fileInput.addEventListener('change', async function () {
              // 创建formData
              var formData = new FormData()
              formData.append(uploadConfig.name, fileInput.files[0])
              let res = await addNewsFile(formData)
              if (res.code === '0000') {
                // var res = JSON.parse(xhr.responseText)
                let length = self.quill.getSelection(true).index
                //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
                self.quill.insertEmbed(length, 'image', baseURL + res.data)
                self.quill.setSelection(length + 1)
                fileInput.value = ''
              }
            })
            // // 监听选择文件
            // fileInput.addEventListener('change', function () {
            //   // 创建formData
            //   var formData = new FormData()
            //   formData.append(uploadConfig.name, fileInput.files[0])
            //   // formData.append('object', 'product')
            //   // 如果需要token且存在token
            //   if (uploadConfig.token) {
            //     formData.append('token', uploadConfig.token)
            //   }
            //   // 图片上传
            //   var xhr = new XMLHttpRequest()
            //   xhr.open(uploadConfig.methods, uploadConfig.action, true)
            //   // 上传数据成功，会触发
            //   xhr.onload = function (e) {
            //     if (xhr.status === 200) {
            //       var res = JSON.parse(xhr.responseText)
            //       let length = self.quill.getSelection(true).index
            //       //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
            //       self.quill.insertEmbed(length, 'image', res.path)
            //       self.quill.setSelection(length + 1)
            //     }
            //     fileInput.value = ''
            //   }
            //   // 开始上传数据
            //   xhr.upload.onloadstart = function (e) {
            //     fileInput.value = ''
            //   }
            //   // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
            //   xhr.upload.onerror = function (e) {}
            //   // 上传数据完成（成功或者失败）时会触发
            //   xhr.upload.onloadend = function (e) {
            //     // console.log('上传结束')
            //   }
            //   xhr.send(formData)
            // })
            this.container.appendChild(fileInput)
          }
          fileInput.click()
        },
      }
      return {
        editorOption: {
          placeholder: '请在这里输入',
          modules: {
            toolbar: {
              container: [
                [{ font: fonts }], //字体
                [{ size: fontsSize }], // 字体大小
                ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                // [{ list: 'ordered' }, { list: 'bullet' }], //列表
                // [{ script: 'sub' }, { script: 'super' }], // 上下标
                [{ indent: '-1' }, { indent: '+1' }], // 缩进
                // [{ direction: 'rtl' }], // 文本方向
                [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
                [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                [{ align: [] }], //对齐方式
                ['clean'], //清除字体样式
                ['image'], //上传图片、上传视频
              ],
              handlers: handlers, // 事件重写
            },
          },
        },
        data: {},
        ruleForm: {
          content: '',
          newsStatus: '',
          publishTime: new Date(),
          title: '',
          typeId: '',
          id: '',
        },
        typeData: [],
        rules: {
          title: [
            { required: true, validator: validateTitle, trigger: 'blur' },
          ],
          typeId: [
            { required: true, message: '请选择类别', trigger: 'change' },
          ],
          publishTime: [
            { required: true, message: '请选择发布时间', trigger: 'change' },
          ],
          content: [
            { required: true, validator: validateContent, trigger: 'blur' },
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
    created() {
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
      async getNewsDetails() {
        let res = await getNewsDetails(this.$route.query.id)
        if (res.code === '0000') {
          for (let key in this.ruleForm) {
            this.ruleForm[key] = res.data[key]
          }
        }
      },
      // 准备编辑器
      onEditorReady(editor) {},
      onEditorBlur() {}, // 失去焦点事件
      onEditorFocus() {}, // 获得焦点事件
      onEditorChange(e) {}, // 内容改变事件
      register(type) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.configRegister(type)
          } else {
            return false
          }
        })
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
            this.ruleForm.id ? '修改成功' : '发布成功',
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
  #addNews {
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
<style>
  .edit_container {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  .ql-editor {
    min-height: 500px;
  }
</style>
