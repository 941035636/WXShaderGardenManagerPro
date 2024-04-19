<template>
  <div id="newsAdd">
    <el-dialog title="编辑别名" :visible.sync="dialogVisible" :close-on-click-modal="false" width="800px" @close="close"
      @open="initPage">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-row v-if="this.newsId != undefined">
          <el-col :span="18">
            <el-form-item label="别名" prop="alias" key="alias">
              <el-input class="w300" v-model="ruleForm.alias" placeholder="请输入别名" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" round @click="close">
          取 消
        </el-button>
        <el-button type="primary" round size="medium" @click="submitForm('ruleForm', '2')">
          确认
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ResourcesService from "@/service/ResourcesService";

import AccidentCases from '@/service/accidentCases'
import { AddAccidentCase, getAccidentCaseDetail, addAccidentCaseLog, deleteAccidentCaseFile } from '@/service/accidentCase'

import UserManage from "@/service/userManage";
var resourcesService = new ResourcesService()
async function echoImage(imgUrl) {
  let { url } = await resourcesService.downloadOrViewFile(imgUrl);
  return url;
}
export default {
  name: 'addNews1',
  props: {},
  components: {

  },
  data() {
    let isTrueUrl = (rule, value, callback) => {
      let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的链接'))
      } else {
        callback()
      }
    }
    return {
      userManage: new UserManage(),
      resourcesService: new ResourcesService(),
      accidentCases: new AccidentCases(),
      dialogVisible: false,
      typeFirstIdList: [], // 获取新闻分类
      typeSecondIdList: [],//获取新闻分类二级
      ifedit: false,
      thumbnailFileList: [],
      content: '', //  暂存新闻内容阻止一直监听
      newsId: null,
      theAlias: "",
        //创建新闻的表单
        ruleForm: {
        templateType: '01',//模板类型
        accessPower: '01',//访问权限
        jumpAddress: '',//跳转地址
        actionEvent: '',//动作事件
        keyWords: [],//关键字
        parentId: '',// 分类一级
        parentIdName: "",//分类名称
        lastId: '',// 分类三级
        ader: [],
        alias: "",//别名
        content: '', // 新闻内容
        imageId: '', // 缩略图id
        caseType: '', // 类型
        publishTime: '', // 发布时间
        createBy: window.sessionStorage.getItem('userName'), // 创建人
        createTime: null, // 创建时间
        description: '', // 文章描述
        fileList: [], // 附件列表
        isDeleted: '0', // 是否删除 0 否 1 是
        organization: '', // 发布机构
        source: '', // 来源
        state: '', // 状态 草稿 已发布
        title: '', // 标题
        top: '0', // 是否置顶
        updateTime: null, //更新时间
      },
      dataTime: '',

      rules: {
        templateType: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
        accessPower: [{ required: true, message: '请选择访问权限', trigger: 'change' }],
        jumpAddress: [
          { required: true, message: '请输入跳转地址', trigger: 'blur' },
          { validator: isTrueUrl, trigger: 'blur' }
        ],
        actionEvent: [{ required: true, message: '请选择动作事件', trigger: 'change' }],
        keyWords: [{ type: 'array', message: '最多支持20个', max: 20, trigger: ['blur', 'change'] },],
        alias: [{
          required: true,
          pattern: /^[\da-z]+$/,
          message: "支持小写字母和数字",
          trigger: ["blur"]
        },
        {
          min: 4,
          max: 30,
          message: '长度在 4 到 30 个字符',
          trigger: ["blur"],
        },
        ],
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 4,
            max: 200,
            message: '长度在 4 到 200 个字符',
            trigger: 'blur',
          },
        ],
        parentId: [{ required: true, message: '请选择栏目', trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        lastId: [{ required: true, message: '请选择子分类', trigger: 'blur' }],
        ader: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入新闻内容', trigger: 'blur' },
        ],
        source: [
          { required: false, message: '请输入来源', trigger: 'blur' },
          {
            min: 4,
            max: 100,
            message: '长度在 4 到 100 个字符',
            trigger: 'blur',
          },
        ],

        top: [
          { required: true, message: '请选择是否置顶', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择新闻状态', trigger: 'change' },
        ],
        publishTime: [
          { required: true, message: '请选择发布时间', trigger: 'change' },
        ],
        organization: [
          { required: true, message: '请选择发布机构', trigger: 'blur' },
          {
            min: 4,
            max: 100,
            message: '长度在 4 到 100 个字符',
            trigger: 'blur',
          },
        ],
        imageId: [
          { required: false, message: '请上传图片', trigger: 'change' },
        ],
        description: [
          { required: false, message: '请输入文章描述', trigger: 'blur' },
          {
            min: 10,
            max: 300,
            message: '长度在 10 到 300 个字符',
            trigger: 'blur',
          },
        ],

      },
      enumObj: [],//枚举类
    }
  },
  computed: {

  },
  created() {
  },
  mounted() {

  },

  watch: {
    "ruleForm.parentId": {
      handler(newVal, oldVal) {
        if (this.ruleForm.parentId == '') {
          this.typeSecondIdList = []
        }
      },
      deep: true,
      immediate: true
    },
  },

  methods: {
    async getEnum() { // 枚举 -- 服务项目类型
      let { code, data } = await this.userManage.getEnum();
      if (code == '0000') this.enumObj = data;
    },

    async getTime() {
      // 获取服务器时间
      let res = await getSysDate()
      if (res.code == '0000') {
        this.dataTime = res.data
      }
    },
    // 获取分类
    async getType() {
      let columnList = await this.accidentCases.caseCategor()
      if (columnList.code == '0000') {
        this.typeFirstIdList = this.getTreeData(columnList.list)
        this.getClassSelect()
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
      this.ruleForm.typeId = '';
      this.ruleForm.lastId = '';
      if (this.typeFirstIdList.length == 0) return
      try {
        this.typeSecondIdList = this.typeFirstIdList.find(item => item.id == this.ruleForm.parentId).childrenCate
      } catch (error) {
        console.log(error);
      }
    },
    async initPage() {
      this.getEnum()
      if (this.newsId == undefined) {
        //页面加载时  获取栏目的列表下拉框内容
        await this.getType()
      } else {
        //回显
        this.ifedit = true
        this.thumbnailFileList = []
        let newsDetail = await getAccidentCaseDetail(this.theAlias)
        if (newsDetail.code == '0000') {
          await this.getType()
          this.ruleForm.templateType = newsDetail.data.templateType || "",//模板类型
            this.ruleForm.accessPower = newsDetail.data.accessPower || "",//访问权限
            this.ruleForm.jumpAddress = newsDetail.data.jumpAddress || "",//跳转地址
            this.ruleForm.actionEvent = newsDetail.data.actionEvent || "",//动作事件
            this.ruleForm.keyWords = newsDetail.data.keyWords || [],//动作事件    
            this.ruleForm.alias = newsDetail.data.alias || '',

            this.ruleForm.title = newsDetail.data.title // 文章标题
            this.ruleForm.organization = newsDetail.data.organization
          if (newsDetail.data.imageId != "null" && newsDetail.data.imageId != '' && newsDetail.data.imageId) {
            let urlStr = `/res/v3/download?applicationName=sequip-svc&businessTypeCode=thumbnail&businessDataTag=thumbnail&free=1&fileId=${newsDetail.data.imageId}`
            await echoImage(urlStr).then(url => {
              this.thumbnailFileList.push({ url })
              this.ruleForm.imageId = newsDetail.data.imageId
            })
          }
          this.ruleForm.createTime = newsDetail.data.createTime
          this.ruleForm.top = newsDetail.data.top + ''
          this.ruleForm.topStr = newsDetail.data.top == 0 ? '普通' : '置顶'
          this.oldFileRecordeId = newsDetail.data.fileRecordeId
          this.ruleForm.publishTime = newsDetail.data.publishTime
          this.ruleForm.description = newsDetail.data.description
          this.ruleForm.id = newsDetail.data.id
          this.ruleForm.content = newsDetail.data.content
          this.ruleForm.fileList = newsDetail.data.fileList||[]

          if (newsDetail.data.typeId) {
            let findItemBy = this.getCidList(this.typeFirstIdList, newsDetail.data.typeId)
            console.log(findItemBy, 'findItemBy');
            var parentId = findItemBy[0].id  // 分类回显一级
            var typeId = findItemBy[1].id  // 分类回显二级
            var lastId = findItemBy[2].id // 分类回显三级
            this.ruleForm.parentId = parentId
            this.ruleForm.ader = [typeId, lastId]
            try {
              this.typeSecondIdList = this.typeFirstIdList.find(item => item.id == this.ruleForm.parentId).childrenCate
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    },

    getCidList(val, id) {
      let cid_list = []
      val.forEach((item, index) => {
        if (item.id == id) {
          let obj = {
            id: item.id,
            name: item.name
          }
          cid_list = [item.id]
          return false
        } else {
          if (item.childrenCate) {
            let obj = {
              id: item.id,
              name: item.name
            }
            let newCid_list = [obj]
            let list = nodefun(item.childrenCate, id, newCid_list)
            if (list) {
              cid_list = list
            }
          }
        }
      })
      // 递归函数
      function nodefun(newVal, newId, newCid_list) {
        let flag = false
        newVal.forEach(j => {
          // console.log(j)
          if (j.id == newId) {
            let obj = {
              id: j.id,
              name: j.name
            }
            newCid_list.push(obj)
            flag = true
          } else {
            if (j.childrenCate) {
              let cid_list = JSON.parse(JSON.stringify(newCid_list))
              let obj = {
                id: j.id,
                name: j.name
              }
              cid_list.push(obj)
              let list = nodefun(j.childrenCate, newId, cid_list)
              if (list) {
                newCid_list = list
                flag = true
              }
            }

          }
        })
        if (flag) {
          return newCid_list
        }
      }
      return cid_list
    },


    close() {
      this.$refs.ruleForm.resetFields()
      this.$nextTick(() => {
        this.ruleForm = this.$options.data.call(this).ruleForm
      })
      this.fileList = []
      this.fileList2 = []
      this.newsId = null
      this.dialogVisible = false
    },



    // 日志接口
    async addAccidentCaseLog(id, type, title) {
      await addAccidentCaseLog({
        accidentCaseId: id,
        actionType: type,
        createBy: window.sessionStorage.getItem('userName'),
        createIp: returnCitySN["cip"],
        title: title
      })
    },



    treatingFu(data) {
      let ader = data.ader
      ader = ader.filter(res => res != "undefined")
      // 1,处理typeId 
      if (data.parentId) {
        data.typeId = data.parentId
        data.type = 1
      }
      if (ader.length == 1) {
        data.typeId = ader[0]
        data.type = 2
      }
      if (ader.length == 2) {
        data.typeId = ader[1]
        data.type = 3
      }
      delete data.parentId;
      return data
    },

    //修改新闻的方法   回显页面中使用
    async amend() {
      let ruleForm = { ...this.ruleForm }
      ruleForm = this.treatingFu(ruleForm)
      let updateNews = await AddAccidentCase(ruleForm)
      if (updateNews.code == '0000') {
        this.$message.success("修改成功");
        this.dialogVisible = false
        this.$emit('refresh', '刷新列表')
        if (this.ruleForm.state == '草稿') {
          this.addAccidentCaseLog(this.ruleForm.id, '草稿', this.ruleForm.title)
        } else {
          this.addAccidentCaseLog(this.ruleForm.id, '修改', this.ruleForm.title)
        }
      }
    },



    // 提交新闻表单  发布新闻  发布新闻状态status2
    submitForm(formName, state) {
      // this.ruleForm.content = this.content
      this.ruleForm.state = state
      // this.ruleForm.fileRecord = JSON.stringify(this.ruleForm.fileRecord)
      this.$refs[formName].validate((valid) => {
        if (valid) {
            this.amend()
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
<style lang="less">
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.articleDescription label {
  line-height: 16px;
}

.quill-editor {
  line-height: normal;
}

.ql-editor {
  min-height: 300px;
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
    padding: 0 !important
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