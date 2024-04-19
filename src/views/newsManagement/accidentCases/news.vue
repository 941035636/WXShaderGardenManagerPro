<template>
  <div id="newsAdd">
    <el-dialog :title="ifedit ? '编辑' : '发布'" :visible.sync="dialogVisible" :close-on-click-modal="false" width="85%"
      @close="close" @open="initPage">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="模板类型" prop="templateType">
              <el-radio-group v-model="ruleForm.templateType">
                <el-radio :label="item.strCode" :value="item.label" v-for="(item, index) in enumObj.TemplateTypeEnum"
                  :key="index">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="标题" prop="title">
              <el-input class="w300" v-model="ruleForm.title" placeholder="请输入文章标题" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- <el-form-item label="发布文号" prop="publishCode">
              <el-input class="w300" v-model="ruleForm.publishCode" placeholder="请输入发布文号" size="small" clearable>
              </el-input>
            </el-form-item> -->
            <el-form-item label="访问权限" prop="accessPower" v-if="ruleForm.templateType == '01'" key="accessPower">
              <el-select size="small" v-model="ruleForm.accessPower" class="w300" placeholder="请选择">
                <el-option :label="item.label" :value="item.strCode" v-for="(item, index) in enumObj.AccessPowerEnum"
                  :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row v-if="this.newsId != undefined">
          <el-col :span="10">
            <el-form-item label="别名" prop="alias" key="alias">
              <el-input class="w300" v-model="ruleForm.alias" placeholder="请输入文章标题" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="分类" :required="true" style="display: inline-block">
              <span :style="{ color: '#1890FF', 'font-weight': 'bold' }">{{ findName(ruleForm.parentId) }}
              </span>
              <el-form-item prop="ader" :required="true" style="display: inline-block" v-if="typeSecondIdList">
                <i :style="{ color: '#1890FF', 'font-weight': 'bold', margin: '0 5px' }" style="margin: 0 5px">-</i>
                <el-cascader v-model="ruleForm.ader" :options="typeSecondIdList" :props="optionProps" placeholder="请选择"
                  class="item2" clearable></el-cascader>
              </el-form-item>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="是否置顶" prop="top">
              <el-select size="small" v-model="ruleForm.top" class="w300" placeholder="请选择">
                <el-option label="普通" :value="'0'"></el-option>
                <el-option label="置顶" :value="'1'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="正文内容" prop="content" class="ueditor_form" v-if="ruleForm.templateType == '01'" key="content">
          <div class="edit_container">
            <quill-editor class="quill-editor" ref="myQuillEditor" v-model="ruleForm.content" :options="editorOption"
              @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"
              @ready="ready($event)">
            </quill-editor>
          </div>
          <!-- <UEditor :content="ruleForm.content" @getUEContent="getUEContent" /> -->
        </el-form-item>

        <el-row v-if="ruleForm.templateType != '01'">
          <el-col :span="10">
            <el-form-item label="跳转地址" prop="jumpAddress" key="jumpAddress">
              <el-input class="w300" v-model="ruleForm.jumpAddress" placeholder="请输入跳转地址" size="small"
                clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="actionEvent" label="动作事件" key="actionEvent">
              <el-select size="small" v-model="ruleForm.actionEvent" class="w300" placeholder="请选择">
                <el-option :label="item.label" :value="item.strCode" v-for="(item, index) in enumObj.ActionEventEnum"
                  :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="发布时间" prop="publishTime" key="publishTime">
              <el-date-picker type="datetime" class="w300" :pickerOptions="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="ruleForm.publishTime"
                size="small"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="organization" label="发布机构 " key="organization">
              <el-input class="w300" v-model="ruleForm.organization" placeholder="请输入发布机构" size="small"
                clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="line"></p>
        <el-row>
          <el-col :span="10">
            <el-form-item label="关键字" prop="keyWords" class="keyInputItem" key="keyWords">
              <keywordsinput @change="setKeywords" v-model="ruleForm.keyWords" :maxLen="6"></keywordsinput>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="a-link" @click="getContent" style="margin-bottom: 10px" v-if="ruleForm.templateType == '01'">
          一键正文获取
        </p>
        <el-form-item label="文章描述" prop="description" class="articleDescription" key="description">
          <el-input class="w70p" v-model="ruleForm.description" placeholder="请输入文章描述" size="small" clearable
            type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="imageId">
          <div style="display: flex" :class="{ 'upload-img': ruleForm.imageId != '' }">
            <el-upload class="avatar-uploader" :class="{ hide: hideUpload }" name="file" action="#" accept=".jpg,.png"
              :data="upLoadData" list-type="picture-card" :on-preview="handlePictureCardPreview"
              :before-upload="beforeAvatarUpload" :http-request="upload2" :on-remove="handleRemove"
              :file-list="thumbnailFileList" :limit="1" ref="upload">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="bigImg" v-if="dialogVisible2">
              <i @click="dialogVisible2 = false" class="el-icon-close"></i>
              <img width="100%" :src="dialogImageUrl" alt />
            </div>
            <span class="ml10">只支持JPG/PNG，大小不超过5M</span>
          </div>
        </el-form-item>
        <el-form-item prop="fileList" label="附件">
          <div style="display: flex">
            <el-upload class="upload-demo mb20" action="#" :file-list="fileList2" name="file"
              accept=".docx,.doc,.pdf,.zip,.rar" :show-file-list="false" :before-upload="beforeAvatarUpload2"
              :http-request="upload" multiple :limit="9" :on-exceed="handleExceed">
              <el-button size="medium" type="primary">选择附件</el-button>
            </el-upload>
            <span class="ml20 color-blue">
              只支持DOC/DOCX/PDF/ZIP/RAR，大小不超过20M（最多可上传9件）
            </span>
          </div>
          <el-table :data="ruleForm.fileList" border style="width: 100%" header-row-class-name="headName"
            :header-cell-style="getRowClass">
            <el-table-column type="index" width="50" label="序号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="文件名">
              <template slot-scope="scope">
                <p class="fileName">
                  <span class="name mr10">
                    <TipsText :length="15" :text="scope.row.name" />
                  </span>

                  <el-button @click="sort('1', scope.$index)" v-if="scope.$index != 0" type="text">
                    升序
                  </el-button>
                  <el-button @click="sort('2', scope.$index)" v-if="scope.$index != ruleForm.fileList.length - 1"
                    type="text">
                    降序
                  </el-button>
                </p>
              </template>
            </el-table-column>

            <el-table-column width="220" prop="updateTime" label="上传时间" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="dowmLoad(scope.row.id)"> 下载 </el-button>
                <el-button type="text" @click="del(scope.row.id, scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="medium" round @click="close"> 取 消 </el-button>
        <el-button type="primary" size="medium" round @click="submitForm('ruleForm', '草稿')">
          保存草稿
        </el-button>
        <el-button type="warning" round size="medium" @click="submitForm('ruleForm', '已发布')">
          确认发布
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import keywordsinput from "./components/keywords-input/keywordsInput.vue";
import ResourcesService from "@/service/ResourcesService";

import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import * as Quill from "quill"; //引入编辑器
import "../../../assets/css/quillEditor.css";
import { addQuillTitle } from "@/util/quill-title.js";
import TipsText from "@/components/TipsText";
import AccidentCases from "@/service/accidentCases";
import {
  AddAccidentCase,
  getAccidentCaseDetail,
  addAccidentCaseLog,
  deleteAccidentCaseFile,
} from "@/service/accidentCase";

import store from "@/store";
import UserManage from "@/service/userManage";
import { Message } from "element-ui";

var accidentCases = new AccidentCases();
var resourcesService = new ResourcesService();

var fonts = [
  "SimSun",
  "SimHei",
  "Microsoft-YaHei",
  "KaiTi",
  "FangSong",
  "Arial",
  "Times-New-Roman",
  "sans-serif",
];
var fontsSize = [false, "16px", "18px", "20px", "22px", "26px", "28px", "30px"];
var Size = Quill.import("formats/size");
Size.whitelist = fontsSize;
var Font = Quill.import("formats/font");
Font.whitelist = fonts; //将字体加入到白名单
Quill.register(Font, true);

async function echoImage(imgUrl) {
  let { url } = await resourcesService.downloadOrViewFile(imgUrl);
  return url;
}

import { eeSourceBtn } from '@/util/quill.eeSourceBtn.js'; //显示HTML源码
Quill.register('modules/eeSourceBtn', eeSourceBtn);


import { lineHeightStyle } from "@/util/quill-lineHeight.js";
export default {
  name: "addNews1",
  props: {},
  components: {
    quillEditor,
    TipsText,
    keywordsinput,
  },
  data() {
    /*富文本编辑图片上传配置*/
    const uploadConfig = {
      action: "/information/v1/upEdit", // 必填参数 图片上传地址
      methods: "POST", // 必填参数 图片上传方式
      token: "", // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
      name: "file", // 必填参数 文件的参数名
      size: 500, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
      accept: "image/png, image/jpeg", // 可选 可上传的图片格式
    };
    const handlers = {
      image: function image() {
        console.log("--------img");
        var _this = this;
        var fileInput = this.container.querySelector("input.ql-image[type=file]");
        if (fileInput === null) {
          fileInput = document.createElement("input");
          fileInput.setAttribute("type", "file");
          // 设置图片参数名
          if (uploadConfig.name) fileInput.setAttribute("name", uploadConfig.name);
          // 可设置上传图片的格式
          fileInput.setAttribute("accept", uploadConfig.accept);
          fileInput.classList.add("ql-image");
          // 监听选择文件
          fileInput.addEventListener("change", async function () {
            let fileName = fileInput.files[0].name.substring(
              fileInput.files[0].name.lastIndexOf(".") + 1
            );
            if (fileName == "jpg" || fileName == "png") {
              let { code, list } = await resourcesService.uploadFile(
                "sequip-svc",
                "thumbnail",
                "1",
                [fileInput.files[0]]
              );
              if (code === "0000") {
                let length = _this.quill.getSelection(true).index;
                let urlStr = `/res/v3/download?applicationName=sequip-svc&businessTypeCode=attachment&businessDataTag=attachment&free=1&fileId=${list[0].fileId}`;
                await echoImage(urlStr).then((url) => {
                  _this.quill.insertEmbed(length, "image", url);
                  _this.quill.setSelection(length + 1);
                  fileInput.value = "";
                });
              }
            } else {
              Message.error("请上传 jpg或png格式的图片");
            }
          });
          this.container.appendChild(fileInput);
        }
        fileInput.click();
      },
    };
    let isTrueUrl = (rule, value, callback) => {
      let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的链接"));
      } else {
        callback();
      }
    };
    return {
      userManage: new UserManage(),
      resourcesService: new ResourcesService(),
      accidentCases: new AccidentCases(),
      dialogVisible: false,
      // baseURL: baseURL,
      editorOption: {
        placeholder: "请在这里输入",
        theme: 'snow',
        modules: {
          eeSourceBtn: eeSourceBtn,//显示HTML源码
          toolbar: {
            container: [
              [{ font: fonts }], //字体
              [{ size: fontsSize }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: "ordered" }, { list: "bullet" }], //列表
              [{ script: "sub" }, { script: "super" }], // 上下标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              // [{ direction: 'rtl' }], // 文本方向
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ align: [] }], //对齐方式
              ["clean"], //清除字体样式
              ["image"], //上传图片、上传视频
              ["quickformat"], //一键排版
              // 设置行高
              [{ lineheight: ["1", "1.5", "1.75", "2", "3", "4", "5"] }], // 对齐方式
              // 清除所有格式
              ["clearFormat"]
            ],
            handlers: {
              ...handlers,
              quickformat: this.beautify,
              lineheight: (value) => {
                if (value) {
                  console.log('设置行高');
                  let quill = this.$refs.myQuillEditor.quill;
                  quill.format("lineHeight", value);
                }
              },
              "clearFormat": this.clearFormat

            }, // 事件重写
          },
        },
      },

      userCode: {},
      typeFirstIdList: [], // 获取新闻分类
      typeSecondIdList: [], //获取新闻分类二级
      typeList: [
        {
          name: "普通",
          id: "1",
        },
        {
          name: "置顶",
          id: "2",
        },
      ],
      ifedit: false,
      dialogVisible2: false, // 图片放大
      dialogImageUrl: "",
      upLoadData: {},
      fileSrc: "",
      upLoadData2: {},
      thumbnailFileList: [],
      fileList: [], // 图片回显地址
      fileList2: [], // 图片回显地址
      content: "", //  暂存新闻内容阻止一直监听
      oldFileRecordeId: "", // 图片id删除使用
      headers: {
        authorization: store.getters["user/accessToken"],
      },
      newsId: null,
      theAlias: "",
      //创建新闻的表单
      ruleForm: {
        templateType: "01", //模板类型
        accessPower: "01", //访问权限
        jumpAddress: "", //跳转地址
        actionEvent: "", //动作事件
        keyWords: [], //关键字
        parentId: "", // 分类一级
        parentIdName: "", //分类名称
        lastId: "", // 分类三级
        ader: [],
        alias: "", //别名
        content: "", // 新闻内容
        imageId: "", // 缩略图id
        caseType: "", // 类型
        publishTime: "", // 发布时间
        createBy: window.sessionStorage.getItem("userName"), // 创建人
        createTime: null, // 创建时间
        description: "", // 文章描述
        fileList: [], // 附件列表
        isDeleted: "0", // 是否删除 0 否 1 是
        organization: "", // 发布机构
        source: "", // 来源
        state: "", // 状态 草稿 已发布
        title: "", // 标题
        top: "0", // 是否置顶
        updateTime: null, //更新时间
      },
      dataTime: "",
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now(this.dataTime) - 24 * 60 * 60 * 1000;
        },
      },
      rules: {
        templateType: [{ required: true, message: "请选择模板类型", trigger: "change" }],
        accessPower: [{ required: true, message: "请选择访问权限", trigger: "change" }],
        jumpAddress: [
          { required: true, message: "请输入跳转地址", trigger: "blur" },
          { validator: isTrueUrl, trigger: "blur" },
        ],
        actionEvent: [{ required: true, message: "请选择动作事件", trigger: "change" }],
        keyWords: [
          {
            type: "array",
            message: "最多支持20个",
            max: 20,
            trigger: ["blur", "change"],
          },
        ],
        alias: [
          {
            required: true,
            pattern: /^[\da-z]+$/,
            message: "支持小写字母和数字",
            trigger: ["blur"],
          },
        ],
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 4,
            max: 200,
            message: "长度在 4 到 200 个字符",
            trigger: "blur",
          },
        ],
        parentId: [{ required: true, message: "请选择栏目", trigger: "blur" }],
        typeId: [{ required: true, message: "请选择分类", trigger: "blur" }],
        lastId: [{ required: true, message: "请选择子分类", trigger: "blur" }],
        ader: [{ required: true, message: "请选择分类", trigger: "change" }],
        content: [{ required: true, message: "请输入新闻内容", trigger: "blur" }],
        source: [
          { required: false, message: "请输入来源", trigger: "blur" },
          {
            min: 4,
            max: 100,
            message: "长度在 4 到 100 个字符",
            trigger: "blur",
          },
        ],

        top: [{ required: true, message: "请选择是否置顶", trigger: "change" }],
        status: [{ required: true, message: "请选择新闻状态", trigger: "change" }],
        publishTime: [{ required: true, message: "请选择发布时间", trigger: "change" }],
        organization: [
          { required: true, message: "请选择发布机构", trigger: "blur" },
          {
            min: 4,
            max: 100,
            message: "长度在 4 到 100 个字符",
            trigger: "blur",
          },
        ],
        imageId: [{ required: false, message: "请上传图片", trigger: "change" }],
        description: [
          { required: false, message: "请输入文章描述", trigger: "blur" },
          {
            min: 10,
            max: 300,
            message: "长度在 10 到 300 个字符",
            trigger: "blur",
          },
        ],
      },
      enumObj: [], //枚举类
      // el-cascader 相关
      optionProps: {
        value: "id",
        label: "name",
        children: "childrenCate", //子元素字段名
        // emitPath: false,
        // checkStrictly: true,
        expandTrigger: "hover", //设置鼠标悬浮展开，如果点击展开的话，会出现点击父节点后选择器直接关闭，不能选择子节点了
      },
    };
  },
  computed: {
    hideUpload() {
      let result = false;
      if (this.ruleForm.imageId) result = true;
      return result;
    },
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  created() {

    // 注册段落间距格式
    const Parchment = Quill.import('parchment');
    const MarginStyle = new Parchment.Attributor.Style('margin-bottom', 'margin-bottom', {
      scope: Parchment.Scope.BLOCK,
      whitelist: ['20px', '30px', '40px'] // 段落间距样式的值
    });
    Quill.register(MarginStyle, true);

  },
  mounted() {
    setTimeout(() => {

      addQuillTitle();
      let quill = this.$refs.myQuillEditor.quill;
      quill.root.addEventListener(
        "paste",
        (evt) => {
          if (
            evt.clipboardData &&
            evt.clipboardData.files &&
            evt.clipboardData.files.length
          ) {
            evt.preventDefault();
            [].forEach.call(evt.clipboardData.files, (file) => {
              if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
                return;
              }
              const formData = new FormData();
              formData.append("file", file);
              addNewsFile(formData).then((res) => {
                if (res.data.code == 0) {
                  let length = quill.getSelection().index; //光标位置
                  // 插入图片地址
                  quill.insertEmbed(length, "image", res.data.data.src);
                  // 光标后移一位
                  quill.setSelection(length + 1);
                } else {
                  console.log(res.data);
                  this.$message({
                    message: res.data.message,
                    type: "warning",
                  });
                }
              });
            });
          }
        },
        false
      );
    }, 500);
  },

  watch: {
    "ruleForm.parentId": {
      handler(newVal, oldVal) {
        if (this.ruleForm.parentId == "") {
          this.typeSecondIdList = [];
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    // 设置行高
    ready() {
      Quill.register({ "formats/letterSpacing": letterSpacingStyle }, true)
      Quill.register({ "formats/lineHeight": lineHeightStyle }, true)
    },

    // 一键排版
    beautify() {
      const initPStyle =
        "text-indent: 2em; margin: 0px;";

      const editor = this.$refs.myQuillEditor.quill;
      const container = editor.container;
      const childNodes = Array.from(container.querySelectorAll(".ql-editor > *"));
      console.log(childNodes, "childNodes");
      if (childNodes.length > 0) {
        childNodes.forEach((item) => {
          // 富文本编辑的内容默认外层都是由p标签包容，所以直接在p标签上进行设置默认排版的样式
          if (item.nodeName === "P") {
            item.style.cssText = initPStyle;
          }
          if (item.childNodes.length > 0) {
            // 遍历找到子元素中存在img标签的内容进行设置默认样式
            item.childNodes.forEach((child) => {
              if (child.localName === "img") {
                // 设置图片宽高，防止展示时宽带不匹配
                let width = child.width;
                let height = child.height;
                // 给img标签设置行内样式
                // child.setAttribute("width", width);
                // child.setAttribute("height", height);
                const initImg = `display: block !important;margin: 0 auto !important;width:${width}px;height:${height}px`;
                child.style.cssText = initImg;
              }
            });
          }
        });
      }
    },

    //清除格式 
    clearFormat() {
      const editor = this.$refs.myQuillEditor.quill;
      const container = editor.container;
      const childNodes = Array.from(container.querySelectorAll(".ql-editor > *"));
      if (childNodes.length > 0) {
        childNodes.forEach((item) => {
          // 富文本编辑的内容默认外层都是由p标签包容，所以直接在p标签上进行设置默认排版的样式
          item.style = "";
          item.class = "";
          if (item.childNodes.length > 0) {
            // 遍历找到子元素中存在img标签的内容进行设置默认样式
            item.childNodes.forEach((child) => {
              child.style = ""
              child.class = ""
            });
          }
        });
      }
    },


    setKeywords(v) {
      console.log(v);
    },

    async getEnum() {
      // 枚举 -- 服务项目类型
      let { code, data } = await this.userManage.getEnum();
      if (code == "0000") this.enumObj = data;
    },
    beforeRemoveaaa(file) {
      console.log(file);
    },
    getUEContent(value) {
      this.content = value;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f5f5f5;color:#0050b3";
      } else {
        return "";
      }
    },
    async getTime() {
      // 获取服务器时间
      let res = await getSysDate();
      if (res.code == "0000") {
        this.dataTime = res.data;
      }
    },
    findName(id) {
      let name = "";
      this.typeFirstIdList.forEach((i) => {
        if (i.id == id) {
          name = i.name;
        }
      });
      console.log(name, "name");
      return name;
    },
    // 获取分类
    async getType() {
      let columnList = await this.accidentCases.caseCategor();
      if (columnList.code == "0000") {
        this.typeFirstIdList = this.getTreeData(columnList.list);
        this.getClassSelect();
      }
    },
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].childrenCate.length < 1) {
          // 最后一级没有数据将children变成undefined
          data[i].childrenCate = undefined;
        } else {
          // children不为空时继续调用该方法
          this.getTreeData(data[i].childrenCate);
        }
      }
      return data;
    },

    //获取下拉类别列表   二级菜单展示
    getClassSelect() {
      this.ruleForm.typeId = "";
      this.ruleForm.lastId = "";
      if (this.typeFirstIdList.length == 0) return;
      try {
        this.typeSecondIdList = this.typeFirstIdList.find(
          (item) => item.id == this.ruleForm.parentId
        ).childrenCate;
      } catch (error) {
        console.log(error);
      }
    },

    async initPage() {
      this.getEnum();
      if (this.newsId == undefined) {
        //页面加载时  获取栏目的列表下拉框内容
        await this.getType();
      } else {
        //回显
        this.ifedit = true;
        this.thumbnailFileList = [];
        let newsDetail = await getAccidentCaseDetail(this.theAlias);
        if (newsDetail.code == "0000") {
          await this.getType();
          (this.ruleForm.templateType = newsDetail.data.templateType || ""), //模板类型
            (this.ruleForm.accessPower = newsDetail.data.accessPower || ""), //访问权限
            (this.ruleForm.jumpAddress = newsDetail.data.jumpAddress || ""), //跳转地址
            (this.ruleForm.actionEvent = newsDetail.data.actionEvent || ""), //动作事件
            (this.ruleForm.keyWords = newsDetail.data.keyWords || []), //动作事件
            (this.ruleForm.alias = newsDetail.data.alias || ""),
            (this.ruleForm.title = newsDetail.data.title); // 文章标题
          this.ruleForm.organization = newsDetail.data.organization;
          if (
            newsDetail.data.imageId != "null" &&
            newsDetail.data.imageId != "" &&
            newsDetail.data.imageId
          ) {
            let urlStr = `/res/v3/download?applicationName=sequip-svc&businessTypeCode=thumbnail&businessDataTag=thumbnail&free=1&fileId=${newsDetail.data.imageId}`;
            await echoImage(urlStr).then((url) => {
              this.thumbnailFileList.push({ url });
              this.ruleForm.imageId = newsDetail.data.imageId;
            });
          }
          this.ruleForm.createTime = newsDetail.data.createTime;
          this.ruleForm.top = newsDetail.data.top + "";
          this.ruleForm.topStr = newsDetail.data.top == 0 ? "普通" : "置顶";
          this.oldFileRecordeId = newsDetail.data.fileRecordeId;
          this.ruleForm.publishTime = newsDetail.data.publishTime;
          this.ruleForm.description = newsDetail.data.description;
          this.ruleForm.id = newsDetail.data.id;
          this.ruleForm.content = newsDetail.data.content;
          this.ruleForm.fileList = newsDetail.data.fileList || [];

          if (newsDetail.data.typeId) {
            let findItemBy = this.getCidList(
              this.typeFirstIdList,
              newsDetail.data.typeId
            );
            console.log(findItemBy, "findItemBy");
            var parentId = findItemBy[0].id; // 分类回显一级
            var typeId = findItemBy[1].id; // 分类回显二级
            var lastId = findItemBy[2].id; // 分类回显三级
            this.ruleForm.parentId = parentId;
            this.ruleForm.ader = [typeId, lastId];
            try {
              this.typeSecondIdList = this.typeFirstIdList.find(
                (item) => item.id == this.ruleForm.parentId
              ).childrenCate;
            } catch (error) {
              console.log(error);
            }
          }

          setTimeout(() => {
            const initStyle =
              "text-indent: 2em; margin: 0px;";
            const content = newsDetail.data.content;
            const styleRegex = /style=(['"])(.*?)\1/g;
            // 检查标签中的行内样式是否匹配指定的样式
            let hasMatchingStyle = false;
            let match;
            while ((match = styleRegex.exec(content)) !== null) {
              const styleAttr = match[2];
              if (styleAttr === initStyle) {
                hasMatchingStyle = true;
                break;
              }
            }
            //判断富文本内容是否是一键排版后的
            if (hasMatchingStyle) {
              this.beautify();
            }
          }, 500);
        }
      }
    },

    getCidList(val, id) {
      let cid_list = [];
      val.forEach((item, index) => {
        if (item.id == id) {
          let obj = {
            id: item.id,
            name: item.name,
          };
          cid_list = [item.id];
          return false;
        } else {
          if (item.childrenCate) {
            let obj = {
              id: item.id,
              name: item.name,
            };
            let newCid_list = [obj];
            let list = nodefun(item.childrenCate, id, newCid_list);
            if (list) {
              cid_list = list;
            }
          }
        }
      });
      // 递归函数
      function nodefun(newVal, newId, newCid_list) {
        let flag = false;
        newVal.forEach((j) => {
          // console.log(j)
          if (j.id == newId) {
            let obj = {
              id: j.id,
              name: j.name,
            };
            newCid_list.push(obj);
            flag = true;
          } else {
            if (j.childrenCate) {
              let cid_list = JSON.parse(JSON.stringify(newCid_list));
              let obj = {
                id: j.id,
                name: j.name,
              };
              cid_list.push(obj);
              let list = nodefun(j.childrenCate, newId, cid_list);
              if (list) {
                newCid_list = list;
                flag = true;
              }
            }
          }
        });
        if (flag) {
          return newCid_list;
        }
      }
      return cid_list;
    },

    onEditorReady(editor) { },
    onEditorBlur() { }, // 失去焦点事件
    onEditorFocus() { }, // 获得焦点事件
    onEditorChange(e) { }, // 内容改变事件

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },

    handleRemove(file, fileList) {
      this.thumbnailFileList = [];
      this.ruleForm.imageId = "";
      this.ruleForm.oldFileRecordeId = this.oldFileRecordeId;
    },
    successGetFileId(res) {
      //上传成功调用
    },
    async dowmLoad(id) {
      let url = `/res/v3/download?applicationName=sequip-svc&businessTypeCode=attachment&businessDataTag=attachment&free=1&fileId=${id}`;
      await resourcesService.downloadOrViewFile(url, true);
    },
    del(id, index) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteAccidentCaseFile(id, index);
        })
        .catch(() => { });
    },
    handleAvatarSuccess(res) {
      if (res.code == "0000") {
        let obj = {
          fileId: res.data.id,
          fileName: res.data.name,
          uploadTime: res.data.createTime,
        };
        this.ruleForm.fileRecord.push(obj);
      }
    },
    handleExceed() {
      this.$message.error("最多支持上传9个文件");
    },
    beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
        const isLt4M = file.size / 1024 / 1024 < 5;
        if (!isLt4M) {
          this.$message.warning("上传图片大小不能超过 5MB!");
          this.thumbnailFileList = [];
          return reject(false);
        } else {
          return resolve(true);
        }
      });
    },

    async upload2(file) {
      let { code, list } = await this.resourcesService.uploadFile(
        "sequip-svc",
        "thumbnail",
        "1",
        [file.file]
      );
      if ((code = "0000")) {
        let urlStr = `/res/v3/download?applicationName=sequip-svc&businessTypeCode=attachment&businessDataTag=attachment&free=1&fileId=${list[0].fileId}`;
        await echoImage(urlStr).then((url) => {
          this.thumbnailFileList.push({ url });
          this.ruleForm.imageId = list[0].fileId;
        });
      }
    },

    async upLoadFile(formData) { },

    beforeAvatarUpload2(file) {
      return new Promise((resolve, reject) => {
        const isLt4M = file.size / 1024 / 1024 < 20;
        if (!isLt4M) {
          this.$message.warning("上传文件大小不能超过 20MB!");
          this.thumbnailFileList = [];
          return reject(false);
        } else {
          return resolve(true);
        }
      });
    },
    async upload(file) {
      let { code, list } = await this.resourcesService.uploadFile(
        "sequip-svc",
        "attachment",
        "1",
        [file.file]
      );
      console.log(list);
      if ((code = "0000")) {
        if (this.ruleForm.id) {
          this.ruleForm.fileList.push({
            accidentCaseId: this.ruleForm.id,
            id: list[0].fileId,
            fileName: list[0].fileName,
            name: list[0].fileName,
            isDeleted: "0",
            updateTime: this.getCurrentDate(),
          });
          console.log(this.ruleForm.fileList, "this.ruleForm.fileList1");
        } else {
          this.ruleForm.fileList.push({
            id: list[0].fileId,
            fileName: list[0].fileName,
            name: list[0].fileName,
            isDeleted: "0",
            createTime: this.getCurrentDate(),
          });
          console.log(this.ruleForm.fileList, "this.ruleForm.fileList2");
        }
      }
    },

    close() {
      this.$refs.ruleForm.resetFields();
      this.$nextTick(() => {
        this.ruleForm = this.$options.data.call(this).ruleForm;
      });
      this.fileList = [];
      this.fileList2 = [];
      this.newsId = null;
      this.dialogVisible = false;
    },

    getSimpleText(html) {
      let re1 = new RegExp("<.+?>", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      let msg = html.replace(re1, ""); //执行替换成空字符
      return msg.substr(0, 50);
    },
    imgUrlFun(str) {
      let data = "";
      str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
        data = capture;
      });
      return data;
    },
    getImgId(src) {
      return src.split("/").find((item) => item == "downloadfile") && arr[arr.length - 1];
    },
    getContent() {
      //一键获取富文本内容作为描述与缩略图
      if (this.ruleForm.content) {
        this.ruleForm.description = this.getSimpleText(this.ruleForm.content);
        let src = this.imgUrlFun(this.ruleForm.content);
        if (src) {
          if (this.getImgId(src)) {
            this.ruleForm.fileRecordeId = this.getImgId(src);
            this.fileList = [{ url: src }]; // 图片回显
          }
        }
      } else {
        // this.$baseMessage('请先填写正文内容', 'warning')
        this.$message.warning("请先填写正文内容");
      }
    },

    sort(flag, index) {
      let arr = JSON.parse(JSON.stringify(this.ruleForm.fileList));
      console.log(arr, "arr");
      if (flag == "1") {
        let item = JSON.parse(JSON.stringify(arr[index - 1]));
        arr[index - 1] = arr[index];
        arr[index] = item;
        console.log(flag, "flag1");
      } else {
        let item = JSON.parse(JSON.stringify(arr[index + 1]));
        arr[index + 1] = arr[index];
        arr[index] = item;
        console.log(flag, "flag2");
      }
      this.ruleForm.fileList = JSON.parse(JSON.stringify(arr));
    },

    // 日志接口
    async addAccidentCaseLog(id, type, title) {
      await addAccidentCaseLog({
        accidentCaseId: id,
        actionType: type,
        createBy: window.sessionStorage.getItem("userName"),
        createIp: returnCitySN["cip"],
        title: title,
      });
    },

    //创建新闻的方法  在新建页面的发布新闻和保存草稿中使用了两次
    async setUp() {
      let ruleForm = { ...this.ruleForm };
      ruleForm = this.treatingFu(ruleForm);
      let createNews = await AddAccidentCase(ruleForm);
      if (createNews.code == "0000") {
        this.$message.success("发布成功！");
        this.dialogVisible = false;
        this.$emit("refresh", "刷新列表");
        if (this.ruleForm.state == "草稿") {
          this.addAccidentCaseLog(createNews.msg, "草稿", this.ruleForm.title);
        } else {
          this.addAccidentCaseLog(createNews.msg, "创建", this.ruleForm.title);
        }
      }
    },

    treatingFu(data) {
      let ader = data.ader;
      ader = ader.filter((res) => res != "undefined");
      // 1,处理typeId
      if (data.parentId) {
        data.typeId = data.parentId;
        data.type = 1;
      }
      if (ader.length == 1) {
        data.typeId = ader[0];
        data.type = 2;
      }
      if (ader.length == 2) {
        data.typeId = ader[1];
        data.type = 3;
      }
      delete data.parentId;
      return data;
    },

    //修改新闻的方法   回显页面中使用
    async amend() {
      let ruleForm = { ...this.ruleForm };
      ruleForm = this.treatingFu(ruleForm);
      let updateNews = await AddAccidentCase(ruleForm);
      if (updateNews.code == "0000") {
        this.$message.success("修改成功");
        this.dialogVisible = false;
        this.$emit("refresh", "刷新列表");
        if (this.ruleForm.state == "草稿") {
          this.addAccidentCaseLog(this.ruleForm.id, "草稿", this.ruleForm.title);
        } else {
          this.addAccidentCaseLog(this.ruleForm.id, "修改", this.ruleForm.title);
        }
      }
    },
    async deleteAccidentCaseFile(id, index) {
      let { code } = await deleteAccidentCaseFile(id);
      if (code == "0000") {
        this.ruleForm.fileList.splice(index, 1);
        this.$message.success("删除成功");
        // this.addAccidentCaseLog(this.ruleForm.id, '删除附件', this.ruleForm.title)
      }
    },
    getCurrentDate() {
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      month = month + 1 > 12 ? 1 : month + 1;
      month = month > 9 ? month : "0" + month.toString();
      var day = d.getDate();
      var hour = d.getHours();
      hour = hour > 9 ? hour : "0" + hour.toString();
      var minute = d.getMinutes();
      minute = minute > 9 ? minute : "0" + minute.toString();
      var second = d.getSeconds();
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },

    // 提交新闻表单  发布新闻  发布新闻状态status2
    submitForm(formName, state) {
      // this.ruleForm.content = this.content
      this.ruleForm.state = state;
      // this.ruleForm.fileRecord = JSON.stringify(this.ruleForm.fileRecord)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //如果有id  说明是携带id过来  编辑新闻的修改页面   走修改的接口
          if (this.newsId == undefined) {
            // 如果没有id  说明创建新闻的接口
            this.setUp();
          } else {
            this.amend();
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.color-blue {
  color: #3b73b9;
}
</style>
<style lang="less">
#newsAdd {
  .quill-editor {
    line-height: normal;
  }

  .ql-editor {
    min-height: 300px;
    letter-spacing: 2px; //设置文本字母之间的间距
    line-height: 24px; //设置行高
  }

  .ql-snow.ql-toolbar {
    .ql-formats {

      // 一键排版
      .ql-quickformat {
        background: url("data:image/png;base64,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") no-repeat;
        background-size: contain;
        display: inline-block;
        height: 14px;
        width: 28px;
        margin: 0 auto;
      }

      // 清除格式
      .ql-clearFormat {
        width: 100px;
      }

      .ql-clearFormat::before {
        content: "清除格式";
        color: #000;
      }

    }

    .ee-flag-source {
      button {
        width: 50px;
        font-weight: bold;
        text-align: left;
        margin: 0;
        padding: 0;
      }
    }
  }


  // 设置行高
  .ql-snow .ql-picker.ql-lineheight .ql-picker-label::before {
    content: "行高";
    color: #000;
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1"]::before {
    content: "1";
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1.5"]::before {
    content: "1.5";
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1.75"]::before {
    content: "1.75";
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="2"]::before {
    content: "2";
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="3"]::before {
    content: "3";
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="4"]::before {
    content: "4";
  }

  .ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="5"]::before {
    content: "5";
  }

  .ql-snow .ql-picker.ql-lineheight {
    width: 70px;
  }
}

.keyInputItem {
  .el-form-item__content {
    line-height: 28px !important;
  }
}

.new_elFormItme {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}

.edit_container {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.articleDescription label {
  line-height: 16px;
}



.line {
  height: 1px;
  width: 90%;
  box-sizing: border-box;
  margin: 0px 0 20px 150px;
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

  i {
    position: absolute;
    right: -18px;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    top: -18px;
    color: #f00;
  }

  .el-table .el-table__cell {
    padding: 0 !important;
  }
}
</style>
<style>
/*  控制显示的主要css */
.hide .el-upload--picture-card {
  display: none;
}

.upload-demo .el-upload--text {
  background-color: transparent;
  border: none;
  width: 100px;
  height: 40px;
  margin-right: 10px;
}
</style>
