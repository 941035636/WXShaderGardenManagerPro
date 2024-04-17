<template>
  <div id="newsAdd">
    <el-dialog
      :title="ifedit ? '编辑资讯' : '发布资讯'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="85%"
      @close="close"
      @open="initPage"
      center
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="标题" prop="title">
              <el-input
                class="w300"
                v-model="ruleForm.title"
                placeholder="请输入文章标题"
                size="small"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布文号" prop="publishCode">
              <el-input
                class="w300"
                v-model="ruleForm.publishCode"
                placeholder="请输入发布文号"
                size="small"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="类型"
              prop="typeId"
              style="display: inline-block"
            >
              <el-select
                size="small"
                class="w300"
                v-model="ruleForm.typeId"
                placeholder="请选择分类"
                clearable
              >
                <el-option
                  v-for="item in typeFirstIdList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否置顶" prop="isTop">
              <el-select
                v-model="ruleForm.isTop"
                class="w300"
                placeholder="请选择"
              >
                <el-option label="普通" :value="false"></el-option>
                <el-option label="置顶" :value="true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="正文内容" prop="content" class="ueditor_form">
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
          <!-- <UEditor :content="ruleForm.content" @getUEContent="getUEContent" /> -->
        </el-form-item>

        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker
            type="datetime"
            class="w300"
            :pickerOptions="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            v-model="ruleForm.publishTime"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="publishOrg" label="发布机构 ">
          <el-input
            class="w300"
            v-model="ruleForm.publishOrg"
            placeholder="请输入发布机构"
            size="small"
            clearable
          ></el-input>
        </el-form-item>
        <p class="line"></p>
        <p class="a-link" @click="getContent">一键正文获取</p>

        <el-form-item label="文章描述" prop="summary">
          <el-input
            class="w70p"
            v-model="ruleForm.summary"
            placeholder="请输入文章描述"
            size="small"
            clearable
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="fileRecordeId">
          <div style="display: flex">
            <el-upload
              class="avatar-uploader"
              :class="{ hide: hideUpload }"
              :action="this.baseURL + `/files/v1/upload/file`"
              name="file"
              :headers="headers"
              :data="upLoadData"
              accept=".jpg,.png"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-success="successGetFileId"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              :file-list="fileList"
              :limit="1"
              ref="upload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog append-to-body :visible.sync="dialogVisible2">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
            <!-- <div class="bigImg" v-if="dialogVisible2">
              <i @click="dialogVisible2 = false" class="el-icon-close"></i>
              <img width="100%" :src="dialogImageUrl" alt />
            </div> -->
            <span class="ml10">只支持JPG/PNG，大小不超过5M</span>
          </div>
        </el-form-item>
        <el-form-item prop="fileRecord" label="附件">
          <div style="display: flex">
            <el-upload
              class="upload-demo mb20"
              :action="this.baseURL + `/files/v1/upload/file`"
              :data="upLoadData2"
              :file-list="fileList2"
              :headers="headers"
              :on-success="handleAvatarSuccess"
              name="file"
              accept=".docx,.doc,.pdf,.zip,.rar"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload2"
              multiple
              :limit="9"
              :on-exceed="handleExceed"
            >
              <el-button size="medium" type="primary">选择附件</el-button>
            </el-upload>
            <span class="ml20 color-blue">
              只支持DOC/DOCX/PDF/ZIP/RAR，大小不超过20M（最多可上传9件）
            </span>
          </div>
          <el-table
            :data="ruleForm.fileRecord"
            border
            style="width: 85%"
            header-row-class-name="headName"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="fileName" label="文件名">
              <template slot-scope="scope">
                <p class="fileName">
                  <span class="name mr10">
                    <TipsText :length="15" :text="scope.row.fileName" />
                  </span>

                  <el-button
                    @click="sort('1', scope.$index)"
                    v-if="scope.$index != 0"
                    type="text"
                  >
                    升序
                  </el-button>
                  <el-button
                    @click="sort('2', scope.$index)"
                    v-if="scope.$index != ruleForm.fileRecord.length - 1"
                    type="text"
                  >
                    降序
                  </el-button>
                </p>
              </template>
            </el-table-column>

            <el-table-column
              width="220"
              prop="uploadTime"
              label="上传时间"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="dowmLoad(scope.row.fileId)">
                  下载
                </el-button>
                <el-button
                  type="text"
                  @click="del(scope.row.fileId, scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" round @click="dialogVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          round
          @click="submitForm('ruleForm', '1')"
        >
          保存草稿
        </el-button>
        <el-button
          type="warning"
          round
          size="medium"
          @click="submitForm('ruleForm', '2')"
        >
          确认发布
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import * as Quill from 'quill' //引入编辑器
import TipsText from '@/components/TipsText'
import { loginRSA, tokenName, baseURL } from '@/config'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { addQuillTitle } from '@/utils/quill-title.js'
import {
  addNews,
  putNews,
  getNewsType,
  addNewsFile,
  getNewsDetails,
} from '@/api/news.js'
import { getSysDate } from '@/api/userManagement.js'
import { getImgFile, getFile } from '@/api/resources'
import store from '@/store'
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
var fontsSize = ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px']
let Font = Quill.import('formats/font')
let fontSizeStyle = Quill.import('attributors/style/size')
Font.whitelist = fonts //将字体加入到白名单
fontSizeStyle.whitelist = fontsSize // 将字体大小加入到白名单
Quill.register(Font, true)
Quill.register(fontSizeStyle, true)
export default {
  name: 'addNews1',
  props: {},
  components: {
    quillEditor,
    TipsText,
  },
  data() {
    /*富文本编辑图片上传配置*/
    const uploadConfig = {
      action: '/files/v1/upEdit', // 必填参数 图片上传地址
      methods: 'POST', // 必填参数 图片上传方式
      token: '', // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
      name: 'file', // 必填参数 文件的参数名
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
      dialogVisible: false,
      baseURL: baseURL,
      editorOption: {
        placeholder: '请在这里输入',
        modules: {
          toolbar: {
            container: [
              [{ font: fonts }], //字体
              [{ size: fontsSize }], // 字体大小
              ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: 'ordered' }, { list: 'bullet' }], //列表
              [{ script: 'sub' }, { script: 'super' }], // 上下标
              [{ indent: '-1' }, { indent: '+1' }], // 缩进
              // [{ direction: 'rtl' }], // 文本方向
              [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ align: [] }], //对齐方式
              ['clean'], //清除字体样式
              ['image', 'video'], //上传图片、上传视频
            ],
            handlers: handlers, // 事件重写
          },
        },
      },
      userCode: {},

      typeFirstIdList: [], // 获取新闻分类
      typeList: [
        {
          name: '普通',
          id: '1',
        },
        {
          name: '置顶',
          id: '2',
        },
      ],
      ifedit: false,
      dialogVisible2: false, // 图片放大
      dialogImageUrl: '',
      upLoadData: {},
      fileSrc: '',
      upLoadData2: {},
      fileList: [], // 图片回显地址
      fileList2: [], // 图片回显地址
      content: '', //  暂存新闻内容阻止一直监听
      oldFileRecordeId: '', // 图片id删除使用
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      newsId: null,
      //创建新闻的表单
      ruleForm: {
        content: '', // 新闻内容
        fileRecordeId: '', // 图片id
        publishCode: '', // 新闻来源
        status: 1, // 状态
        title: '', // 新闻标题
        isTop: false,
        publishOrg: '',
        typeId: '', // 分类
        publishTime: '', // 发布时间
        fileRecord: [], //附件
        summary: '', // 新闻描述
      },
      dataTime: '',
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now(this.dataTime) - 24 * 60 * 60 * 1000
        },
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 4,
            max: 200,
            message: '长度在 4 到 200 个字符',
            trigger: 'blur',
          },
        ],
        typeId: [{ required: true, message: '请选择栏目', trigger: 'change' }],
        content: [
          { required: true, message: '请输入新闻内容', trigger: 'blur' },
        ],
        publishCode: [
          { required: false, message: '请输入发布文号', trigger: 'blur' },
          {
            min: 4,
            max: 100,
            message: '长度在 4 到 100 个字符',
            trigger: 'blur',
          },
        ],

        isTop: [
          { required: true, message: '请选择是否置顶', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择新闻状态', trigger: 'change' },
        ],
        publishTime: [
          { required: true, message: '请选择发布时间', trigger: 'change' },
        ],
        publishOrg: [
          { required: true, message: '请选择发布机构', trigger: 'blur' },
          {
            min: 4,
            max: 100,
            message: '长度在 4 到 100 个字符',
            trigger: 'blur',
          },
        ],
        fileRecordeId: [
          { required: false, message: '请上传图片', trigger: 'change' },
        ],
        summary: [
          { required: false, message: '请输入文章描述', trigger: 'blur' },
          {
            min: 10,
            max: 300,
            message: '长度在 10 到 300 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    hideUpload() {
      let result = false
      if (this.ruleForm.fileRecordeId) {
        result = true
      }
      return result
    },
    editor() {
      return this.$refs.myQuillEditor.quill
    },
  },
  mounted() {
    // this.getTime()
    // setTimeout(()=>{
    // },200)
    return
    addQuillTitle()
    let quill = this.$refs.myQuillEditor.quill
    quill.root.addEventListener(
      'paste',
      (evt) => {
        console.log(evt, '99009')
        if (
          evt.clipboardData &&
          evt.clipboardData.files &&
          evt.clipboardData.files.length
        ) {
          evt.preventDefault()
          ;[].forEach.call(evt.clipboardData.files, (file) => {
            if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
              return
            }
            const formData = new FormData()
            formData.append('file', file)
            addNewsFile(formData).then((res) => {
              if (res.data.code == 0) {
                console.log(res.data.data.src)
                // window.open(res.data.data.src)
                let length = quill.getSelection().index //光标位置
                // 插入图片地址
                quill.insertEmbed(length, 'image', res.data.data.src)
                // 光标后移一位
                quill.setSelection(length + 1)
              } else {
                console.log(res.data)
                this.$message({
                  message: res.data.message,
                  type: 'warning',
                })
              }
            })
          })
        }
      },
      false
    )
  },

  methods: {
    getUEContent(value) {
      this.content = value
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;color:#0050b3'
      } else {
        return ''
      }
    },
    async getTime() {
      // 获取服务器时间
      let res = await getSysDate()
      if (res.code == '0000') {
        this.dataTime = res.data
      }
    },
    async getType() {
      // 获取分类
      let columnList = await getNewsType()
      if (columnList.code == '0000') {
        this.typeFirstIdList = columnList.list
      }
    },
    async initPage() {
      console.log(this.newsId)
      if (this.newsId == undefined) {
        //页面加载时  获取栏目的列表下拉框内容
        this.getType()
      } else {
        //回显
        this.ifedit = true
        let newsDetail = await getNewsDetails(this.newsId)
        if (newsDetail.code == '0000') {
          this.getType()
          this.ruleForm.title = newsDetail.data.title // 文章标题
          this.ruleForm.publishOrg = newsDetail.data.publishOrg // 文章标题
          if (newsDetail.data.fileRecordeId) {
            let reso = await getImgFile(
              '/files/downloadfile/' + newsDetail.data.fileRecordeId
            )
            let urls = reso.data
            this.fileList = [{ url: urls }] // 图片回显
          }
          this.ruleForm.typeId = newsDetail.data.typeId // 分类回显
          this.ruleForm.fileRecord = newsDetail.data.fileRecord || [] // 附件
          this.ruleForm.isTop = newsDetail.data.isTop // 附件
          this.ruleForm.fileRecordeId = newsDetail.data.fileRecordeId // 图片id
          this.oldFileRecordeId = newsDetail.data.fileRecordeId // 暂存图片id
          this.ruleForm.publishCode = newsDetail.data.publishCode
          this.ruleForm.publishTime = newsDetail.data.publishTime //时间回显
          // this.ruleForm.status = newsDetail.data.status // 新闻状态回显
          this.ruleForm.summary = newsDetail.data.summary
          console.log(this.ruleForm.status)
          this.ruleForm.id = this.newsId
          this.ruleForm.content = newsDetail.data.content // 新闻内容回显
        }
      }
    },
    onEditorReady(editor) {},
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange(e) {}, // 内容改变事件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },

    handleRemove(file, fileList) {
      this.ruleForm.fileRecordeId = ''
      this.ruleForm.oldFileRecordeId = this.oldFileRecordeId // 删除传旧图片id
    },
    successGetFileId(res) {
      //上传成功调用
      console.log(res, '743284832')
      if (res.code == '0000') {
        this.ruleForm.fileRecordeId = res.data.id
      }
    },
    dowmLoad(id) {
      let res = getFile('/news/downloadfile/' + this.newsId + '/' + id)
    },
    del(id, index) {
      this.ruleForm.fileRecord.splice(index, 1)
    },
    handleAvatarSuccess(res) {
      //上传成功调用
      console.log(res, '743284832')
      if (res.code == '0000') {
        let obj = {
          fileId: res.data.id,
          fileName: res.data.name,
          uploadTime: res.data.createTime,
        }
        this.ruleForm.fileRecord.push(obj)
      }
    },
    handleExceed() {
      this.$baseMessage('最多支持上传9个文件', 'error')
    },
    beforeAvatarUpload(file) {
      console.log(file, '000000')
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      /* const isPNG = file.type === 'image/png'; */
      const isLt4M = file.size / 1024 / 1024 < 5
      if (!isJPGorPNG) {
        this.$baseMessage('上传图片只能是 JPG 格式 或 PNG 格式!', 'error')
      }
      if (!isLt4M) {
        this.$baseMessage('上传图片大小不能超过 5MB!', 'error')
      }
      return isJPGorPNG && isLt4M
    },
    beforeAvatarUpload2(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      /* const isPNG = file.type === 'image/png'; */
      const isLt4M = file.size / 1024 / 1024 < 20
      // if (!isJPGorPNG) {
      //   this.$baseMessage('只支持DOC/DOCX/PDF/ZIP/RAR格式', 'error')
      // }

      if (!isLt4M) {
        this.$baseMessage('上传文件大小不能超过 20MB!', 'error')
      }
      // return isJPGorPNG && isLt4M
      return isLt4M
    },
    close() {
      this.$refs.ruleForm.resetFields()
      this.fileList = []
      this.fileList2 = []
      this.newsId = null
    },

    getSimpleText(html) {
      let re1 = new RegExp('<.+?>', 'g') //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      let msg = html.replace(re1, '') //执行替换成空字符
      return msg.substr(0, 50)
    },
    imgUrlFun(str) {
      let data = ''
      str.replace(
        /<img [^>]*src=['"]([^'"]+)[^>]*>/,
        function (match, capture) {
          data = capture
        }
      )
      return data
    },
    getImgId(src) {
      let arr = src.split('/')
      let id = ''
      let head = arr.find((item) => {
        return item == 'downloadfile'
      })

      if (head) {
        id = arr[arr.length - 1]
      }

      return id
    },
    getContent() {
      //一键获取富文本内容作为描述与缩略图
      console.log(this.ruleForm.content, '00000')
      if (this.ruleForm.content) {
        this.ruleForm.summary = this.getSimpleText(this.ruleForm.content)
        let src = this.imgUrlFun(this.ruleForm.content)
        if (src) {
          if (this.getImgId(src)) {
            this.ruleForm.fileRecordeId = this.getImgId(src)
            this.fileList = [{ url: src }] // 图片回显
          }
        }
      } else {
        this.$baseMessage('请先填写正文内容', 'warning')
      }
    },
    sort(flag, index) {
      let arr = JSON.parse(JSON.stringify(this.ruleForm.fileRecord))
      if (flag == '1') {
        //升序,当前项与前一项互换
        let item = JSON.parse(JSON.stringify(arr[index - 1]))
        arr[index - 1] = arr[index]
        arr[index] = item
      } else {
        //降序
        let item = JSON.parse(JSON.stringify(arr[index + 1]))
        arr[index + 1] = arr[index]
        arr[index] = item
      }
      this.ruleForm.fileRecord = JSON.parse(JSON.stringify(arr))
    },
    //创建新闻的方法  在新建页面的发布新闻和保存草稿中使用了两次
    async setUp() {
      let createNews = await addNews(this.ruleForm)
      if (createNews.code == '0000') {
        this.$baseMessage('发布成功！', 'success')
        this.dialogVisible = false
        this.$emit('refresh', '刷新列表')
      }
    },
    //修改新闻的方法   回显页面中使用
    async amend() {
      let updateNews = await putNews(this.ruleForm)
      if (updateNews.code == '0000') {
        this.$baseMessage('修改成功！', 'success')
        this.dialogVisible = false
        this.$emit('refresh', '刷新列表')
      }
    },

    // 提交新闻表单  发布新闻  发布新闻状态status2
    submitForm(formName, status) {
      // this.ruleForm.content = this.content
      this.ruleForm.status = status
      // this.ruleForm.fileRecord = JSON.stringify(this.ruleForm.fileRecord)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //如果有id  说明是携带id过来  编辑新闻的修改页面   走修改的接口
          if (this.newsId == undefined) {
            // 如果没有id  说明创建新闻的接口
            this.setUp()
          } else {
            this.amend()
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>
  <style scoped>
.color-blue {
  color: #3b73b9;
}
</style>
<style lang=scss>
.edit_container {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.ql-editor {
  min-height: 300px;
}
.line {
  height: 1px;
  width: 90%;
  box-sizing: border-box;
  margin: 30px 0 20px 150px;
  border-top: 1px dashed #ccc;
}
.a-link {
  cursor: pointer;
  text-decoration: underline;
  margin-left: 150px;
  color: #3b73b9;
}
.fileName {
  .name {
    width: 220px;
    display: inline-block;
  }
}
.bigImg {
  width: 500px;

  border: 1px solid #000;
  position: fixed;
  z-index: 999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  img {
    display: block;
    width: 500px;
  }
  i {
    position: absolute;
    right: -18px;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    top: -18px;
    color: #f00;
  }
}
</style>
<style>
/*  控制显示的主要css */
.hide .el-upload--picture-card {
  display: none;
}
</style>