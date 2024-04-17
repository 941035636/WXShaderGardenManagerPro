<!-- 开始排查 -->
<template>
  <div id="Inventory">
    <div class="headTitleA">
      <el-button size="mini" @click="back" class="mr20">返回上一级</el-button>
      <span>录入人员：{{ $route.query.name }}</span>
      <p style="float: right; line-height: 30px">
        <span class="mr30">清单编号：{{ viewData.standardId }}</span>
        <span class="mr20">
          部门（岗位）：{{ viewData.deptName + '/' + viewData.postName }}
        </span>
      </p>
    </div>
    <div class="split"></div>
    <div class="title-box">
      <el-row class="row-x">
        <el-col :span="22">
          <p class="title-name">
            {{ endata.standardName }} —— {{ viewData.frequency }}
          </p>
        </el-col>
        <el-col :span="2">
          <!-- <img
            style="width: 120px; height: 50px"
            src="@/assets/ewm.png"
            alt=""
          /> -->
        </el-col>
      </el-row>

      <el-row class="row-x">
        <el-col :span="22">
          <p>
            当前进度：共计
            <span>{{ endata.checkNum + endata.uncheckNum }}</span>
            项、已查
            <span>{{ endata.checkNum || '0' }}</span>
            项、未查
            <span>{{ endata.uncheckNum || '0' }}</span>
            项，完成率
            <span>{{ endata.completionRate || '00.00%' }}</span>
            ，发现隐患数：
            <span>{{ endata.findHazardNum || '0' }}</span>
            个
          </p>
        </el-col>
        <el-col :span="2">
          <el-button
            round
            type="primary"
            v-if="endata.checkOver != '1'"
            @click="submit"
          >
            全部检查完成
          </el-button>
        </el-col>
      </el-row>

      <el-table
        :data="dataList"
        border
        header-row-class-name="headName"
        :header-cell-style="getRowClass"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="checkType"
          label="检查类别"
          min-width="40"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="checkProjectTypeOne"
          label="检查项目"
          min-width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="checkStandard"
          label="检查标准"
          align="center"
        ></el-table-column>
        <el-table-column align="center" min-width="60" label="隐患级别">
          <template slot-scope="scope">
            <span>
              {{ transition(scope.row.hazardLevel) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="隐患类型">
          <template v-if="scope.row.isPass === '0'" slot-scope="scope">
            <div class="color-blue">
              {{
                hiddenDangerState[scope.row.hazardTypeOne] +
                '-' +
                hiddenDangerState[scope.row.hazardTypeTwo]
              }}
            </div>
            <div
              style="
                color: #fa8c16;
                cursor: pointer;
                text-decoration: underline;
              "
              v-if="scope.row.isPass === '0' && endata.checkOver != '1'"
              @click="pass(scope.row, '2')"
            >
              修改“不合格信息”
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-radio
              v-model="scope.row.isPass"
              label="1"
              :disabled="key || endata.checkOver === '1'"
              @input="pass(scope.row, '1')"
            >
              合格
            </el-radio>
            <el-radio
              v-model="scope.row.isPass"
              label="0"
              :disabled="key || endata.checkOver === '1'"
              @input="pass(scope.row, '0')"
            >
              不合格
            </el-radio>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <HazardReg
      ref="hazardReg"
      @closed="closed"
      :id="id"
      :hazardLevel="hazardLevel"
      :hazardType="hazardType"
    />

    <el-dialog
      title="隐患登记"
      :visible.sync="amendDisqualificationShow"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form
        ref="ruleForm"
        :model="amendDisqualification"
        :rules="amendDisqualificationRules"
        label-width="150px"
      >
        <el-form-item label="隐患描述" prop="describe">
          <el-input
            class="w280"
            type="textarea"
            v-model="amendDisqualification.describe"
            minlength="2"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="隐患图片" prop="hiddenDangerImg">
          <Uploading @imageData="imageData" :imageArr="hiddenDangerImg" />
        </el-form-item>
        <el-form-item label="隐患类型" prop="hiddenDangerType">
          <el-cascader
            v-model="amendDisqualification.hiddenDangerType"
            :options="hiddenDangerType"
            disabled
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="发现日期" prop="hiddenDangerDate">
          <el-date-picker
            v-model="amendDisqualification.hiddenDangerDate"
            class="w280"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="隐患级别" prop="hiddenDangerRank">
          <el-select
            v-model="amendDisqualification.hiddenDangerRank"
            class="w280"
            disabled
            placeholder="请选择隐患级别"
          >
            <el-option
              v-for="item in hiddenDangerRanks"
              :key="item.id"
              :label="item.itemText"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="divide"></div>

        <el-form-item label="是否立即整改">
          <span :class="isRec == '0' ? 'btnA' : 'btnB'" @click="getBtn('0')">
            否
          </span>
          <span :class="isRec == '1' ? 'btnA' : 'btnB'" @click="getBtn('1')">
            是
          </span>
        </el-form-item>
        <el-form-item
          v-if="isRec === '0'"
          label="整改部门"
          prop="abarbeitungDepartment"
        >
          <el-cascader
            v-model="amendDisqualification.abarbeitungDepartment"
            :options="department"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-if="isRec === '0'"
          label="限时整改日期"
          prop="abarbeitungDate"
        >
          <el-date-picker
            v-model="amendDisqualification.abarbeitungDate"
            class="w280"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="isRec === '1'"
          label="整改情况"
          prop="abarbeitungCondition"
        >
          <el-input
            class="w280"
            type="textarea"
            v-model="amendDisqualification.abarbeitungCondition"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8 }"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isRec === '1'" label="整改附件" prop="attachment">
          <Uploading
            @imageData="upAttachment"
            :imageArr="hiddenDangerAttachment"
          />
        </el-form-item>
        <el-form-item
          v-if="isRec === '1'"
          label="验收部门"
          prop="acceptanceCheckDepartment"
        >
          <el-cascader
            v-model="amendDisqualification.acceptanceCheckDepartment"
            :options="department"
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" shape="round" @click="submit1">
          确认提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import HazardReg from '../components/hazardReg'
import { getItems } from '@/api/user'
import { getByEntNo } from '@/api/branchManage'

import {
  getHiddenByUser,
  checkPass,
  checkNoPass,
  checkOver,
  getCheckNoPassInfo,
  updateCheckNoPass,
} from '@/api/checkApi'
import Uploading from '../../components/uploading.vue'
import { getImgFile } from '@/api/resources'
import { forEach } from '../../../../../mock/controller/menuManagement'
import { getDangerByUserCount, getDangerByUser } from '@/api/checkApi'

const validateSecondLevel = (rule, value, callback) => {
  if (value.length === 2) {
    callback()
  } else {
    callback(new Error('部门必须确认到二级'))
  }
}
export default {
  components: {
    HazardReg,
    Uploading,
  },
  data() {
    return {
      viewData: {},
      total: 0,
      pn: 1,
      dataList: [],
      endata: {},
      dataForm: {},
      id: '',
      hiddenDangerRanks: [],
      hiddenDangerState: [],
      key: false,
      hazardLevel: '',
      hazardType: [],
      isRec: '0',
      amendDisqualificationShow: false,
      amendDisqualification: {
        describe: '',
        hiddenDangerImg: [],
        hiddenDangerType: [],
        hiddenDangerDate: '',
        hiddenDangerRank: '',
        abarbeitungDepartment: [],
        abarbeitungDate: '',
        abarbeitungCondition: '',
        attachment: [],
        acceptanceCheckDepartment: [],
        id: '',
      },
      amendDisqualificationRules: {
        describe: [
          { required: true, message: ' 请输入隐患描述', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '隐患描述字符串长度2-1000字',
            trigger: 'blur',
          },
        ],
        hiddenDangerImg: [
          { required: true, validator: this.validateImage, trigger: 'blur' },
        ],
        // hiddenDangerType: [
        //   {
        //     required: true,
        //     message: '请选择隐患类型',
        //     trigger: 'change',
        //   },
        // ],
        hiddenDangerDate: [
          {
            required: true,
            message: '请选择发现日期',
            trigger: 'change',
          },
        ],
        // hiddenDangerRank: [
        //   {
        //     required: true,
        //     message: '请选择隐患级别',
        //     trigger: 'change',
        //   },
        // ],
        abarbeitungDepartment: [
          {
            required: true,
            message: '请选择整改部门',
            trigger: 'change',
          },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ],
        abarbeitungDate: [
          {
            required: true,
            message: '请选择限时整改日期',
            trigger: 'change',
          },
        ],
        abarbeitungCondition: [
          { required: true, message: ' 请输入整改情况', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '整改情况最多可输入1000个字符',
            trigger: 'blur',
          },
        ],
        attachment: [
          {
            required: true,
            validator: this.validateAttachment,
            trigger: 'blur',
          },
        ],
        acceptanceCheckDepartment: [
          {
            required: true,
            message: '请选择验收部门',
            trigger: 'change',
          },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ],
      },
      department: [],
      rectificationDept: [],
      hiddenDangerType: [],
      hiddenDangerImg: [],
      hiddenDangerAttachment: [],
      ids: '',
    }
  },
  created() {
    this.viewData = JSON.parse(this.$route.query.row)
    this.getDangerByUser()
    this.getInit()
    this.getItems()
    this.getItems1()
    this.key = this.$route.query.key === '1' ? true : false
    this.sysDeptList()
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    async getDangerByUser() {
      let id = JSON.parse(this.$route.query.row).id
      let data = {
        pn: 1,
        ps: 10,
        id: id,
      }
      let res = await getDangerByUser(data)
      if (res.code === '0000') {
        this.endata = res.data.records[0]
        console.log(res.data, 'res.datares.datares.datares.datares.data')
      }
    },
    submit1() {
      if (this.isRec === '1') {
        this.amendDisqualificationRules.abarbeitungDepartment = []
        this.amendDisqualificationRules.abarbeitungDate = []
      } else {
        this.amendDisqualificationRules.abarbeitungCondition = []
        this.amendDisqualificationRules.attachment = []
        this.amendDisqualificationRules.acceptanceCheckDepartment = []
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.checkNoPassClick()
        }
      })
    },
    async checkNoPassClick() {
      let data = {
        acceptDeptNo: this.amendDisqualification.acceptanceCheckDepartment[1], //验收部门2 ,
        acceptDeptName:
          this.rectificationDept[
            this.amendDisqualification.acceptanceCheckDepartment[1]
          ],
        acceptDeptNoTop:
          this.amendDisqualification.acceptanceCheckDepartment[0], //验收部门1
        hazardDescription: this.amendDisqualification.describe, //隐患描述 ,
        hazardFileIds: this.amendDisqualification.hiddenDangerImg, //隐患图片 ,
        hazardFindTime: this.amendDisqualification.hiddenDangerDate, //隐患发现日期 ,
        hazardTypeOne: this.hazardType[0], //隐患类型1 ,
        hazardTypeTwo: this.hazardType[1], //隐患类型2 ,
        standardHiddenDangerInfoId: this.ids,
        isImmediately: this.isRec, // 是否立即整改 ,
        rectificationDeptNo:
          this.amendDisqualification.abarbeitungDepartment[1], //整改部门2 需要确认
        rectificationDeptName:
          this.rectificationDept[
            this.amendDisqualification.abarbeitungDepartment[1]
          ],
        rectificationDeptNoTop:
          this.amendDisqualification.abarbeitungDepartment[0], //整改部门1
        rectificationFileIds: this.amendDisqualification.attachment, //整改附件 ,
        rectificationLimited: this.amendDisqualification.abarbeitungDate, //限时整改日期 ,
        rectificationRemark: this.amendDisqualification.abarbeitungCondition, //整改情况 ,
        id: this.amendDisqualification.id,
      }
      let res = await updateCheckNoPass(data)
      if (res.code === '0000') {
        this.getDangerByUser()
        this.amendDisqualificationShow = false
        this.$message({
          message: '修改不合格信息成功',
          type: 'success',
        })
      }
    },
    upAttachment(e) {
      this.amendDisqualification.attachment = e
    },
    cancel() {
      this.amendDisqualificationShow = false
    },
    imageData(e) {
      this.amendDisqualification.hiddenDangerImg = e
    },
    async sysDeptList() {
      let No = window.sessionStorage.getItem('enpNo')
      let res = await getByEntNo(No)
      if (res.code === '0000') {
        this.department = this.recursion1(res.data)
        this.rectificationDept = this.setDiGuiDataObj(this.department)
      }
    },
    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].children) {
          obj[list[i].deptNo] = list[i].deptName
          this.setDiGuiDataObj(list[i].children, obj)
        } else {
          obj[list[i].deptNo] = list[i].deptName
        }
      }
      return obj
    },
    recursion1(data) {
      data.forEach((e) => {
        e.label = e.deptName
        e.value = e.deptNo
        if (e.children && e.children.length > 0) {
          this.recursion1(e.children)
        } else {
          e.children = undefined
        }
      })
      return data
    },
    getBtn(val) {
      this.isRec = val
      if (this.isRec === '1') {
        console.log(this.isRec, '0000------111111111111')
        this.amendDisqualificationRules.abarbeitungCondition = [
          { required: true, message: ' 请输入整改情况', trigger: 'blur' },
          {
            min: 2,
            max: 1000,
            message: '整改情况最多可输入1000个字符',
            trigger: 'blur',
          },
        ]
        this.amendDisqualificationRules.attachment = [
          {
            required: true,
            validator: this.validateAttachment,
            trigger: 'blur',
          },
        ]
        this.amendDisqualificationRules.acceptanceCheckDepartment = [
          {
            required: true,
            message: '请选择验收部门',
            trigger: 'change',
          },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ]
        this.amendDisqualificationRules.abarbeitungDepartment = []
        this.amendDisqualificationRules.abarbeitungDate = []
      } else {
        this.amendDisqualificationRules.abarbeitungDepartment = [
          {
            required: true,
            message: '请选择整改部门',
            trigger: 'change',
          },
          {
            required: true,
            validator: validateSecondLevel,
            trigger: 'change',
          },
        ]
        this.amendDisqualificationRules.abarbeitungDate = [
          {
            required: true,
            message: '请选择限时整改日期',
            trigger: 'change',
          },
        ]
        this.amendDisqualificationRules.abarbeitungCondition = []
        this.amendDisqualificationRules.attachment = []
        this.amendDisqualificationRules.acceptanceCheckDepartment = []
      }
    },
    validateImage(rule, value, callback) {
      if (this.amendDisqualification.hiddenDangerImg.length > 0) {
        callback()
      } else {
        callback(new Error('请上传隐患图片'))
      }
    },
    validateAttachment(rule, value, callback) {
      if (this.amendDisqualification.attachment.length > 0) {
        callback()
      } else {
        callback(new Error('请上传整改附件'))
      }
    },
    transition(e) {
      let test = ''
      this.hiddenDangerRanks.forEach((item) => {
        if (item.itemValue === e) {
          test = item.itemText
        }
      })
      return test
    },
    // http://10.10.71.90:6342/api/common/dict/items/true/50002
    async getItems() {
      let res = await getItems('50001')
      if (res.code == '0000') {
        this.hiddenDangerRanks = res.data
      }
    },
    async getItems1() {
      let res = await getItems('50002')
      if (res.code == '0000') {
        this.hiddenDangerType = this.recursion(res.data)
        this.hiddenDangerState = this.setDiGuiDataObj(res.data)
      }
    },
    recursion(data) {
      data.forEach((e) => {
        e.label = e.itemText
        e.value = e.itemValue
        e.children = e.sysDictItemEntitys
        if (e.children && e.children.length > 0) {
          this.recursion(e.children)
        }
      })
      return data
    },
    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].sysDictItemEntitys) {
          obj[list[i].itemValue] = list[i].itemText
          this.setDiGuiDataObj(list[i].sysDictItemEntitys, obj)
        } else {
          obj[list[i].itemValue] = list[i].itemText
        }
      }
      return obj
    },
    closed() {
      this.getInit()
    },
    async submit() {
      let key = true
      this.dataList.forEach((e) => {
        if (e.isPass === null || e.isPass === undefined || e.isPass === '') {
          key = false
        }
      })
      if (key) {
        let res = await checkOver({ id: JSON.parse(this.$route.query.row).id })
        if (res.code === '0000') {
          this.getDangerByUser()
          this.$message({
            message: '全部检查完成',
            type: 'success',
          })
        }
      } else {
        this.$message({
          message: '请选择完成后再提交',
          type: 'error',
        })
      }
    },
    async pass(e, key) {
      if (key === '0') {
        this.hazardType = [e.hazardTypeOne, e.hazardTypeTwo]
        this.hazardLevel = e.hazardLevel
        this.noPass()
        this.id = e.id
      } else if (key === '2') {
        console.log(e, 'sdsdsds')
        this.ids = e.id
        this.getCheckNoPassInfo(e)
      } else {
        let res = await checkPass(e.id)
        this.getDangerByUser()
        this.getInit()
      }
    },
    async getCheckNoPassInfo(e) {
      let res = await getCheckNoPassInfo({
        standardHiddenDangerInfoId: e.id,
      })
      if (res.code === '0000') {
        this.amendDisqualification.describe = res.data.hazardDescription
        this.amendDisqualification.hiddenDangerType = [
          res.data.hazardTypeOne,
          res.data.hazardTypeTwo,
        ]
        this.amendDisqualification.hiddenDangerRank = res.data.hazardLevel
        this.amendDisqualification.hiddenDangerDate = res.data.hazardFindTime

        this.amendDisqualification.abarbeitungCondition =
          res.data.rectificationRemark
        this.amendDisqualification.id = res.data.id
        this.isRec = res.data.isImmediately
        if (this.isRec === '0') {
          this.amendDisqualification.abarbeitungDepartment = [
            res.data.rectificationDeptNoTop,
            res.data.rectificationDeptNo,
          ]
          this.amendDisqualification.abarbeitungDate =
            res.data.rectificationLimited
        }
        this.getImg(res.data.hazardFileList)
        this.hiddenDangerImg = res.data.hazardFileList
        let imageArr = []
        res.data.hazardFileList.forEach((element) => {
          imageArr.push(element.id)
        })
        this.amendDisqualification.hiddenDangerImg = imageArr
        if (this.isRec === '1') {
          this.amendDisqualification.acceptanceCheckDepartment = [
            res.data.acceptDeptNoTop,
            res.data.acceptDeptNo,
          ]
          this.getImg1(res.data.rectificationFileList)
          this.hiddenDangerAttachment = res.data.rectificationFileList
          let attachmentArr = []
          res.data.rectificationFileList.forEach((item) => {
            attachmentArr.push(item.id)
          })
          this.amendDisqualification.attachment = attachmentArr
        }

        this.amendDisqualificationShow = true
      }
    },
    async getImg1(e) {
      if (e) {
        let imgUrlList = []
        for (let i = 0; i < e.length; i++) {
          let item = e[i]
          let data = await getImgFile('/files/downloadfile/' + item.id)
          item.url = data.data
          imgUrlList.push(item)
        }
      }
    },
    async getImg(e) {
      if (e) {
        let imgUrlList = []
        for (let i = 0; i < e.length; i++) {
          let item = e[i]
          let data = await getImgFile('/files/downloadfile/' + item.id)
          item.url = data.data
          imgUrlList.push(item)
        }
      }
    },
    noPass(row) {
      this.$refs.hazardReg.dialogVisible = true
    },
    async getInit() {
      let res = await getHiddenByUser(JSON.parse(this.$route.query.row).id)
      if (res.code == '0000') {
        this.dataList = res.data
        this.getDangerByUser()
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    handleCurrentChange(pn) {
      this.pn = pn
    },
  },
}
</script>
<style lang="scss" scoped>
#Inventory {
  .headTitleA {
    line-height: 50px;
    padding-left: 20px;
  }
  .split {
    height: 10px;
    background-color: #f6f8f9;
  }
  .btnA {
    display: inline-block;
    width: 100px;
    border: 1px solid #1890ff;
    text-align: center;
    background: #1890ff;
    color: #fff;
  }
  .btnB {
    display: inline-block;
    width: 100px;
    border: 1px solid #1684fc;
    text-align: center;
    color: #1684fc;
  }
  .title-box {
    padding: 30px;
    .title-name {
      font-size: 20px;
      text-align: center;
    }
    .title-item {
      border: 1px dashed #1890ff;
      border-radius: 5px;
      line-height: 60px;
    }
  }
  .row-x {
    overflow-x: hidden;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .col18 {
    color: #1890ff;
  }
  .el-cascader {
    width: 300px !important;
  }
  .divide {
    border: 1px dashed #bbbbbb;
    margin: 20px 30px;
  }
}
</style>