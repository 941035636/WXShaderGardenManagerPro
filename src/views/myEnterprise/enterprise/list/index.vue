<template>
  <div id="EnterpriseList">
    <div class="top-title">
      <el-row class="box">
        <el-col :span="2">
          <span class="img">
            <img src="../../../../assets/images/gongsiIcon.png" />
          </span>
        </el-col>
        <el-col :span="8" class="title-name">
          <p class="fb f16">{{ endata.sysEnt.entName }}</p>
          <p>登录账号：{{ endata.userName }}</p>
        </el-col>
        <el-col :span="7" class="ml200">
          <p class="mt20">
            企业资料：
            <span
              style="color: #448ef7; cursor: pointer"
              @click="lookParticulars"
            >
              查看详情
            </span>
            <!-- <el-button style="color: #096dd9" plain class="ml20">
              补充资料
            </el-button> -->
          </p>
          <p class="mt20">注册时间：{{ endata.sysEnt.createTime }}</p>
        </el-col>
        <!-- <el-col :span="3">
          <p>企业资料：已填写 查看详情</p>
        </el-col> -->
      </el-row>
    </div>

    <div class="mt40">
      <div class="xiang-tit clearfix bg-white">
        <!-- <div
          v-for="(item, index) in tabTitle"
          :key="index"
          @click="addClass(index, item.path)"
          :class="current == index ? 'isactive' : ''"
          class="xia-tab fl f18 text-center pos-r"
        >
          {{ item.name }}
        </div> -->
        <div class="xia-tab fl f18 text-center pos-r isactive">岗位清单</div>
      </div>
      <!-- <component
        class="child_css"
        :is="asyncLoadComponent"
        :DangerByUserArr="DangerByUserArr"
        @handleCurrentChange="handleCurrentChange"
      ></component> -->
      <HomeJobList
        :endata="endata"
        :ByUserCount="ByUserCount"
        :DangerByUserArr="DangerByUserArr"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>

    <el-dialog
      title="企业信息"
      :visible.sync="dialogFormVisible"
      width="1100px"
      @close="closeClick"
    >
      <div style="width: 100%; margin-bottom: 10px">
        <el-row :gutter="5">
          <el-col :span="3">
            <div class="particularsTitleClass">企业名称：</div>
          </el-col>
          <el-col :span="5">
            <div class="particularsContentClass">
              {{ endata.sysEnt.entName }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">社会统一信用代码：</div>
          </el-col>
          <el-col :span="5">
            <div class="particularsContentClass">
              {{ endata.sysEnt.companyCode }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">企业人数：</div>
          </el-col>
          <el-col :span="5">
            <div class="particularsContentClass">
              {{ endata.sysEnt.peopleNum }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; margin-bottom: 10px">
        <el-row :gutter="5">
          <el-col :span="3">
            <div class="particularsTitleClass">经营地址：</div>
          </el-col>
          <el-col :span="5">
            <div class="particularsContentClass">
              {{
                endata.sysEnt.provinceName +
                '/' +
                endata.sysEnt.cityName +
                '/' +
                endata.sysEnt.areaName
              }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">详细地址：</div>
          </el-col>
          <el-col :span="5">
            <div class="particularsContentClass">
              {{ endata.sysEnt.address }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">国民经济行业：</div>
          </el-col>
          <el-col :span="5">
            <div class="particularsContentClass">
              {{
                endata.sysEnt.industryTypeThreeName +
                '/' +
                endata.sysEnt.industryTypeFourName
              }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; margin-bottom: 10px">
        <el-row :gutter="5">
          <el-col :span="3">
            <div class="particularsTitleClass">法人代表：</div>
          </el-col>
          <el-col :span="5">
            <div class="particularsContentClass">
              {{ endata.sysEnt.legalPerson }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">联系方式：</div>
          </el-col>
          <el-col :span="5">
            <div class="particularsContentClass">
              {{ endata.sysEnt.legalPhone }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="buttonClass">
        <div
          v-if="headquarters"
          class="buttonNameClass"
          @click="modificationData"
          style="cursor: pointer"
        >
          修改资料
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="修改企业资料"
      :visible.sync="modificationShow"
      width="800px"
      @click="closeModification"
    >
      <div class="titleBlueClass">基本信息</div>
      <el-divider></el-divider>

      <div class="formClass">
        <div class="formItemClass">
          <el-form
            :model="essentialInformation"
            :rules="rules"
            ref="essentialInformation"
            label-width="180px"
          >
            <el-form-item label="企业名称" prop="enName">
              <el-input
                v-model="essentialInformation.enName"
                minlength="4"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="统一信用代码" prop="creditCode">
              <el-input v-model="essentialInformation.creditCode"></el-input>
            </el-form-item>
            <el-form-item label="经营地区" prop="OperatingArea">
              <el-cascader
                v-model="essentialInformation.OperatingArea"
                :options="options"
                @change="handleChange"
                filterable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailedAddress">
              <el-input
                v-model="essentialInformation.detailedAddress"
              ></el-input>
            </el-form-item>
            <el-form-item label="国民经济行业" prop="industry">
              <el-cascader
                v-model="essentialInformation.industry"
                :options="options1"
                @change="handleChange1"
                filterable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="企业人数" prop="numberOfPeople">
              <el-input
                type="number"
                placeholder="请输入内容"
                v-model="essentialInformation.numberOfPeople"
              >
                <template slot="append">人</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="titleBlueClass">法人代表/主要负责人</div>
      <el-divider></el-divider>
      <el-form
        :inline="true"
        :model="formInline"
        :rules="rules1"
        ref="ruleForm"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formInline.phone"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottomButtonClass">
        <div></div>
        <div class="buttonRightClass">
          <div class="cancelClass" @click="cancelClick" style="cursor: pointer">
            取消
          </div>
          <div class="submitClass" style="cursor: pointer" @click="submitClick">
            确认提交
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import Danger from '../../components/danger'
// import JobList from '../../components/jobList'
import HomeJobList from '../../components/homeJobList'
import { getEntInfoByUser, alterSave, getItems } from '@/api/user'
import { getAreaInfo } from '@/api/Areas'
import { validateBlCodeGZ } from '@/utils/validateFrom'
import {
  getHiddenDangerByUser,
  getDangerByUser,
  getDangerByUserCount,
  getHomeHiddenDangerByUser,
} from '@/api/checkApi'
import { mapGetters } from 'vuex'
const validatePassCheck = (rule, value, callback) => {
  let judge = !isNaN(parseFloat(value)) && isFinite(value)
  if (value < 0) {
    callback(new Error('请输入正整数'))
  } else if (value > 99999) {
    callback(new Error('最大支持99999'))
  } else {
    callback()
  }
}
export default {
  components: {
    HomeJobList,
    // Danger,
    // JobList,
  },
  data() {
    return {
      // current: 0,
      // asyncLoadComponent: 'Danger',
      // tabTitle: [
      //   {
      //     path: 'Danger',
      //     name: '隐患记录',
      //   },
      //   {
      //     path: 'JobList',
      //     name: '岗位清单',
      //   },
      // ],
      endata: {},
      ByUserCount: {},
      DangerByUserArr: {},

      dialogFormVisible: false,
      modificationShow: false,
      essentialInformation: {
        enName: '',
        creditCode: '',
        OperatingArea: [],
        detailedAddress: '',
        // business: [],
        industry: [],
        numberOfPeople: '',
      },
      rules: {
        enName: [
          {
            required: true,
            message: '请输入企业名称',
            trigger: 'blur',
          },
          {
            min: 4,
            max: 200,
            message: '字符长度4-200位',
            trigger: 'blur',
          },
        ],
        creditCode: [
          {
            required: true,
            message: '请输入社会统一信用代码',
            trigger: 'blur',
          },
          {
            required: true,
            validator: validateBlCodeGZ,
            trigger: 'blur',
          },
          // {
          //   required: true,
          //   pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
          //   message: '请输入正确的社会统一信用代码',
          //   trigger: 'blur',
          // },
        ],
        detailedAddress: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur',
          },
          {
            min: 4,
            max: 500,
            message: '字符长度4-500位',
            trigger: 'blur',
          },
        ],
        numberOfPeople: [
          {
            required: true,
            message: '请输入公司人数',
            trigger: 'blur',
          },
          {
            required: true,
            validator: validatePassCheck,
            trigger: 'blur',
          },
        ],
        OperatingArea: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
        industry: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
        // business: [
        //   {
        //     required: true,
        //     message: '请选择',
        //     trigger: 'change',
        //   },
        // ],
      },
      formInline: {
        name: '',
        phone: '',
      },
      rules1: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '字符长度1-50位',
            trigger: 'blur',
          },
        ],
        // phone: [
        //   { required: true, message: '手机号不能为空', trigger: 'blur' },
        //   {
        //     min: 1,
        //     max: 50,
        //     message: '字符长度1-50位,支持手机，座机等',
        //     trigger: 'blur',
        //   },
        // {
        //   pattern:
        //     /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
        //   message: '请输入正确手机号',
        //   trigger: 'blur',
        // },
        // ],
      },
      options: [],
      options1: [],
      // DangerByUserArr: [],
      options2: [],
      manageObj: [], //管理名字
      pn: 1,
      ps: 10,
      total: 50,
      headquarters: false,
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
    industryObj() {
      let result = []
      if (this.options2) {
        result = this.setDiGuiDataObj(this.options2)
      }
      return result
    },
  },
  created() {
    this.getCapchas()
    this.getAllArea()
    this.getItems()
    // this.getHiddenDangerByUser()
    this.getItems2()
    this.getHiddenDangerByUserCount()
    this.getDangerByUser()
    let headquartersData = window.sessionStorage.getItem('roles').split(',')
    for (let key in headquartersData) {
      if (headquartersData[key] === 'RL1661181862950866945') {
        this.headquarters = true
      }
    }
  },
  methods: {
    handleCurrentChange(e) {
      this.pn = e
      this.getDangerByUser()
    },
    async getDangerByUser() {
      let data = {
        pn: this.pn,
        ps: this.ps,
      }
      let res = await getHomeHiddenDangerByUser(data)
      if (res.code === '0000') {
        this.DangerByUserArr = res.data
      }
    },
    async getHiddenDangerByUserCount() {
      let res = await getDangerByUserCount()
      if (res.code === '0000') {
        this.ByUserCount = res.data
      }
    },
    // handleCurrentChange(e) {
    //   this.pn = e
    //   this.getHiddenDangerByUser()
    // },
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
    // async getDangerByUser() {
    //   let data = {
    //     pn: this.pn,
    //     ps: this.ps,
    //   }
    //   let res = await getDangerByUser(data)
    //   if (res.code === '0000') {
    //     this.DangerByUserArr = res.data
    //   }
    // },
    // async getHiddenDangerByUser() {
    //   let data = {
    //     pn: this.pn,
    //     ps: this.ps,
    //   }
    //   let res = await getHiddenDangerByUser(data)
    //   if (res.code === '0000') {
    //     this.DangerByUserArr = res.data
    //   }
    // },
    async getItems() {
      let res = await getItems('20006')
      // 20006
      if (res.code == '0000') {
        this.options1 = this.recursion(res.data)
        this.manageObj = this.setDiGuiDataObj(this.options1)
      }
    },
    async getItems2() {
      let res = await getItems('20003')
      if (res.code == '0000') {
        this.options2 = this.recursion(res.data)
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
    async getAllArea() {
      let res = await getAreaInfo(0, { levels: '1,2,3' })
      if (res.code == '0000') {
        this.options = res.data
      }
    },
    // 选择省市区的校验规则
    validate(rule, value, callback) {
      if (this.desensitization === this.getSchoolName.corporationIdnoStar) {
        callback()
      } else {
        if (idNoCheck.isIdno(value)) {
          callback()
        } else {
          callback(new Error('18位有效数字，必须符合国家标准的证件类型'))
        }
      }
    },
    //调用企业信息接口
    async getCapchas() {
      let res = await getEntInfoByUser()
      if (res.code === '0000') {
        this.endata = res.data
        this.essentialInformation.enName = res.data.sysEnt.entName
        this.essentialInformation.creditCode = res.data.sysEnt.companyCode
        this.essentialInformation.OperatingArea = [
          res.data.sysEnt.provinceCode,
          res.data.sysEnt.cityCode,
          res.data.sysEnt.areaCode,
        ]
        this.essentialInformation.detailedAddress = res.data.sysEnt.address

        // this.essentialInformation.business = [
        //   res.data.sysEnt.industryTypeOne,
        //   res.data.sysEnt.industryTypeTwo,
        // ]
        this.essentialInformation.industry = [
          res.data.sysEnt.industryTypeThree,
          res.data.sysEnt.industryTypeFour,
        ]
        this.essentialInformation.numberOfPeople = res.data.sysEnt.peopleNum

        this.formInline.name = res.data.sysEnt.legalPerson
        this.formInline.phone = res.data.sysEnt.legalPhone
        window.sessionStorage.setItem('enpNo', res.data.sysEnt.entNo)
      }
    },
    // tap切换
    // addClass(i, path) {
    //   this.ps = 10
    //   this.pn = 1

    //   this.current = i
    //   this.asyncLoadComponent = path
    //   if (i === 1) {
    //     this.getDangerByUser()
    //   } else {
    //     this.getHiddenDangerByUser()
    //   }
    // },
    //点击展示详情的弹窗
    lookParticulars() {
      this.dialogFormVisible = true
    },
    //弹窗关闭的回调
    closeClick() {
      this.dialogFormVisible = false
    },
    //下载点击事件
    download() {},
    //修改资料
    modificationData() {
      this.modificationShow = true
      this.dialogFormVisible = false
    },
    //关闭修改企业信息弹窗
    closeModification() {
      this.modificationShow = false
    },
    handleChange(value) {
      this.essentialInformation.OperatingArea = value
    },
    handleChange1(value) {
      this.essentialInformation.industry = value
    },
    handleChange2(value) {
      console.log('000000')
    },
    // 取消按钮
    cancelClick() {
      this.modificationShow = false
    },
    //提交按钮
    submitClick() {
      this.$refs.essentialInformation.validate((valid) => {
        if (valid) {
          this.$refs.ruleForm.validate((e) => {
            // console.log(e, this.essentialInformation, '000000')
            if (e) {
              if (this.formInline.phone.length < 50) {
                this.amendEnData()
              } else {
                this.$message.error('联系电话不能超过50个字符')
              }
            }
          })
        }
      })
    },
    async amendEnData() {
      let data = {
        address: this.essentialInformation.detailedAddress, //详细地址
        areaCode: this.essentialInformation.OperatingArea[2], // 区县编码
        areaName: this.areaMap[this.essentialInformation.OperatingArea[2]], //区县名称
        // businessLicense: 'string',//营业执照文件id
        // businessRegistrationCode: 'string',//工商注册代码
        cityCode: this.essentialInformation.OperatingArea[1], //市编码
        cityName: this.areaMap[this.essentialInformation.OperatingArea[1]], //市名称---
        companyCode: this.essentialInformation.creditCode, //企业统一信用代码
        // createBy: 'string',
        // createTime: '2023-05-21T07:41:32.150Z',
        // dutyPhone: 'string',//应急值班电话
        entName: this.essentialInformation.enName, //企业名称
        // entNo: 'string', //企业编号
        id: this.endata.sysEnt.id, //唯一值，传是修改不传是新增
        industryTypeFour: this.essentialInformation.industry[1], //行业类别4（国民经济行业2）
        industryTypeFourName:
          this.manageObj[this.essentialInformation.industry[1]],

        // industryTypeOne: this.essentialInformation.business[0], // 行业类别1（所属行业1）
        // industryTypeOneName:
        //   this.industryObj[this.essentialInformation.business[0]],

        industryTypeThree: this.essentialInformation.industry[0], //行业类别3（国民经济行业1）
        industryTypeThreeName:
          this.manageObj[this.essentialInformation.industry[0]],

        // industryTypeTwo: this.essentialInformation.business[1], //行业类别2（所属行业2）
        // industryTypeTwoName:
        //   this.industryObj[this.essentialInformation.business[1]],
        // isDelete: 'string',
        // legalEmail: 'string',//邮箱
        legalPerson: this.formInline.name, //法定代表人
        legalPhone: this.formInline.phone, //法人联系电话
        // operateRemark: 'string',//经营范围
        // operateType: 'string',//经营状态
        peopleNum: this.essentialInformation.numberOfPeople, //企业人数
        provinceCode: this.essentialInformation.OperatingArea[0], //省编码
        provinceName: this.areaMap[this.essentialInformation.OperatingArea[0]], //省名称----
        // safetyName: 'string',//安全负责人姓名
        // safetyNumber: 'string',//安全生产许可证编号
        // safetyNumberBeginTime: '2023-05-21T07:41:32.150Z',//许可证有效期开始
        // safetyNumberEndTime: '2023-05-21T07:41:32.150Z',//许可证有效期结束止
        // safetyNumberFileId: 'string',//安全生产许可证文件id ,
        // safetyPhone: 'string',//安全负责人联系电话 ,
        // standardizationLevel: 'string',//标准化等级 ,
        // turnover: 'string', //年营业额/工程造价
        // updateBy: 'string',
        // updateTime: '2023-05-21T07:41:32.150Z',
      }
      let res = await alterSave(data)
      if (res.code === '0000') {
        this.modificationShow = false
        this.$message({
          message: '修改企业信息成功',
          type: 'success',
        })
        this.getCapchas()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#EnterpriseList {
  padding: 30px;
  .top-title {
    height: 137px;
    border: 1px solid #096dd9;
    border-radius: 5px;
    .box {
      margin-top: 26px;
      margin-left: 50px;
      .img {
        display: inline-block;
        width: 80px;
        height: 80px;
        border-radius: 40px;
        border: 1px solid #096dd9;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 70%;
          height: 70%;
        }
      }
      .title-name {
        // padding-right: 50px;
        border-right: 1px solid #ccc;
      }
      .btn {
        display: inline-block;
        border: 1px solid #096dd9;
        border-radius: 5px;
        color: #096dd9;
        padding: 0 20px;
        line-height: 20px;
      }
    }
  }
  .xiangp-con {
  }
  .xiang-tit {
    line-height: 40px;
    border-bottom: 1px solid #f5f5f5;
  }
  .xia-tab {
    padding: 0 40px;
    height: 40px;
    line-height: 40apx;
    color: #333;
    cursor: pointer;
  }
  .xia-tab.isactive {
    color: #1890ff;
    height: 100%;
    border-bottom: 2px solid #1890ff;
  }
  .particularsTitleClass {
    width: 100%;
    color: #9d9d9d;
    font-size: 14px;
    line-height: 30px;
  }
  .particularsContentClass {
    width: 100%;
    color: #000;
    font-size: 14px;
    line-height: 30px;
  }
  .downloadClass {
    color: #1890ff;
    font-size: 14px;
    line-height: 30px;
    text-decoration: underline;
  }
  .buttonClass {
    width: 100%;
    height: 60px;
    margin-top: 60px;
    display: flex;
    justify-content: center;
    .buttonNameClass {
      height: 60px;
      width: 180px;
      border: 1px solid #1890ff;
      border-radius: 5px;
      color: #096dd9;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .titleBlueClass {
    border-left: 3px solid #1890ff;
    color: #1890ff;
    padding-left: 10px;
    height: 20px;
    display: flex;
    align-items: center;
  }
  .formClass {
    width: 100%;
    // display: flex;
    // justify-content: center;
    padding: 20px 0;
    margin-bottom: 20px;
    .formItemClass {
      width: 70%;
    }
  }
  .bottomButtonClass {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .buttonRightClass {
      width: 300px;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cancelClass {
        width: 100px;
        height: 40px;
        background-color: #f5f5f5;
        border: 1px solid #bbbbbb;
        border-radius: 20px;
        color: #5a5a5a;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .submitClass {
        width: 150px;
        height: 40px;
        background-color: #ffa940;
        color: #fff;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .el-cascader {
    width: 100%;
  }
}
</style>