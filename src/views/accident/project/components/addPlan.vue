<template>
  <el-dialog
    title="添加服务计划"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
    >
    <h2 class="details-title">项目信息</h2>
      <el-form-item label="服务项目类型" prop="preTypeList">
        <el-cascader
          class="w472"
          size="small"
          @change="setPerType"
          v-model="ruleForm.preTypeList"
          placeholder="请选择服务项目类型"
          :options="serveTypeList"
          :props="{value:'itemValue',label:'itemText',children:'sysDictItemEntitys'}"
          filterable>
        </el-cascader>
      </el-form-item>
      <div class="display-flex">
        <el-form-item label="服务时间" prop="startTime">
          <el-date-picker
            size="small"
            v-model="ruleForm.startTime"
            class="w150"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="dealDateStartOptions"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="0px">
          <el-row class="mr10 ml10">至</el-row>
        </el-form-item>
        <el-form-item prop="endTime" label-width="0px">
          <el-date-picker
            size="small"
            v-model="ruleForm.endTime"
            class="w150"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="dealDateStartOptions"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </div>
      <el-form-item label="服务专家" prop="experts">
        <el-select v-model="ruleForm.expertsList" multiple :multiple-limit="10" placeholder="请选择" @change="handleSelectionChange" size="small">
          <el-option
            v-for="(item,key) in tableList"
            :key="key"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <!-- <el-table
          :data="tableList"
          border
          :header-cell-style="getRowClass"
          class="w800"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="专家姓名"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="specialty"
            label="专业"
            show-overflow-tooltip
          ></el-table-column>
        </el-table> -->
      </el-form-item>
      <el-form-item label="服务描述" prop="checkRemark">
        <el-input
          size="small"
          v-model.trim="ruleForm.checkRemark"
          class="w500"
          type="textarea"
          placeholder="形式（线上/线下）、地点、人数、起止时间、主 题等"
        ></el-input>
      </el-form-item>
      <div style="border:1px dashed #ccc;margin-bottom:20px"></div>
      <div style="display:flex;">
        <h2 class="details-title">被服务单位信息</h2>
        <el-switch
          style="margin:10px; 0 20px 10px"
          @change="setUserFlag"
          v-model="ruleForm.isServeUserFlag"
          active-color="#13ce66"
          active-text="有"
          inactive-text="无"
          inactive-color="#ff4949">
        </el-switch>
      </div>
      <el-form-item
        v-if="ruleForm.isServeUserFlag"
        label="被服务单位"
        prop="corporationCode"
      >
        <el-autocomplete
          v-model.trim="ruleForm.corporationName"
          class="w280"
          size="small"
          :fetch-suggestions="querySearchOrg"
          placeholder="请输入企业名称"
          clearable
          @select="handleSelect"
        ></el-autocomplete>
        <el-button type="text"  class="search-icon" icon="el-icon-plus" @click="addUser">添加单位</el-button>
      </el-form-item>
      <el-form-item v-if="currentUserDetails.id">
        <div>
          <span>单位名称：</span>
          <span>{{currentUserDetails.custFullName}}</span>
        </div>
        <div>
          <span>社会统一信用代码：</span>
          <span>{{currentUserDetails.blCode}}</span>
          <!-- <span class="ml35">行业分类：</span>
          <span>{{currentUserDetails.orgNatureName}}</span> -->
        </div>
        <div>
          <span>所在地区：</span>
          <span>{{currentUserDetails.provinceName}}{{currentUserDetails.cityName}}{{currentUserDetails.countyName}}{{currentUserDetails.streetName}}</span>
        </div>
        <div>
          <span>企业联系人：</span>
          <span>{{currentUserDetails.contactName}} &nbsp; {{currentUserDetails.contactPhone}}</span>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" round>取 消</el-button>
      <el-button type="warning" @click="register" round>确认提交</el-button>
    </span>
    <addUser ref="addUser"></addUser>
  </el-dialog>
</template>

<script>
  // import { getBranchDetails } from '@/api/userDataManagement'
  
  import { mapGetters } from 'vuex'
  import addUser from '@/views/userDataManage/highRisk/add/index.vue'
  import { addPlan } from '@/service/accidentManagement'
  import { dateTest } from '@/util/validate'
  import { validateRemark } from '@/util/validateFrom'
  import userManage from '@/service/userManage'
  import moment from 'moment'
  export default {
    name: 'AddOrAlter',
    components:{
      addUser
    },
    props: {
      serveTypeList:{
        type:Array,
        default:()=>{
          return []
        }
      },
      projectDetails:{
        type:Object,
        default:()=>{
          return {}
        }
      },
    },
    data() {
      return {
        userManage: new userManage(),
        dealDateStartOptions: this.beginDate(),
        dialogVisible: false,
        currentUserDetails:{},
        tableList: [], // 专家列表
        ruleForm: {
          accidentPreProjectId: '', // 合同id
          checkRemark: '', // 隐患检查情况综合说明
          corporationCode: '', // 企业编码
          corporationName: '', // 企业名称
          organizationId: '', // 企业id
          // 专家
          experts: [],
          expertsList:[],
          preContent: '', // 服务内容
          preType: '', // 服务项目类型 隐患排查 应急演练 安全培训
          reCheckRemark: '', // 复查隐患检查情况综合说明
          rePreContent: '', // 复查服务内容
          startTime: '', // 有效期开始
          endTime: '', // 有效期 截至
          preTypeList:[],
          preFirstType: '',
          preFirstTypeName: '',
          preSecondType: '',
          preSecondTypeName: '',
          isServeUserFlag:true,
        },
        rules: {
          agencyCode: [
            { required: true, message: '请输入机构代码', trigger: 'blur' },
          ],
          preTypeList: [
            { required: true, message: '请选择项目类型', trigger: 'change' },
          ],
          corporationCode: [
            { required: true, message: '请选择服务企业', trigger: 'change' },
          ],
          experts: [
            { required: true, message: '请选择服务专家', trigger: 'change' },
          ],
          startTime: [
            { required: true, message: '请选择服务起期', trigger: 'change' },
          ],
          endTime: [
            { required: true, message: '请选择服务止期', trigger: 'change' },
          ],
          checkRemark: [
            { required: true, validator: validateRemark, trigger: 'blur' },
            // { required: true, message: '请输入服务计划说明', trigger: 'blur' },validateRemark
          ],
        },
      }
    },
    computed: {
      ...mapGetters({
        enumObj: 'getEnumObj',
      }),
    },
    mounted() {
      // this.initRole()
    },
    methods: {
      async initData(val) {
        this.dialogVisible = true
        await this.getBranchDetails(val.serviceAgencyId)
        this.ruleForm.accidentPreProjectId = val.id
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      async getBranchDetails(id) {
        let res = await this.userManage.getOrgExpert({ps:100,pn:1},'safetyOrganizationSvc',id)
        if (res.code === '0000') {
          this.tableList = res.list.map((item) => {
            return {
              ...item,
              name: item.safetyTechniciansName,
              specialty: item.safetyTechniciansMajor,
            }
          })
        }
      },
      async querySearchOrg(queryString, cb) {
        if (!queryString) {
          cb([])
        } else {
          let form = {
            pn: 1,
            ps: 10,
            beginCreateTime: '',
            endCreateTime: '',
            custFullName: queryString,
            status: '1',
            type: '',
            bl: '',
            userAccount: '',
          }
          let {code,list=[]} = await this.userManage.enterpriseList(form)
          if (code == '0000') {
            let list1 = list.map((item) => {
              let obj = {
                value: item.custFullName,
                blCode: item.blCode,
                id: item.id,
                ...item
              }
              return obj
            })
            if(list1.length===0) {
              this.$message.error('暂无数据')
            }
            cb(list1)
            this.setUserDetails()
          } else {
            cb([{ value: '失败' }])
          }
          
        }
      },
      clear() {
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
        this.ruleForm.id = ''
        this.currentUserDetails = {}
        this.ruleForm.preTypeList = []
        this.ruleForm.expertsList = []
        this.dialogVisible = false
      },
      close() {
        this.clear()
      },
      async configRegister() {
        let data = JSON.parse(JSON.stringify(this.ruleForm))
        if (dateTest(this.ruleForm.startTime, this.ruleForm.endTime)) {
          this.$message.error('起期不能大于止期')
          return
        } else if (dateTest(this.ruleForm.endTime, this.projectDetails.endTime)) {
          this.$message.error('服务时间不能超过合同期限')
          return
        }
        data.startTime = `${data.startTime} 00:00:00`
        data.endTime = `${data.endTime} 23:59:59`
        let res = await addPlan(data)
        if (res.code === '0000') {
          this.$message.success('添加成功')
          this.dialogVisible = false
          this.close()
          this.$emit('successCb')
        }
      },
      register() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.configRegister()
          } else {
            return false
          }
        })
      },
      handleSelect(item) {
        this.ruleForm.corporationCode = item.blCode
        this.ruleForm.organizationId = item.id
        // let orgNatureName = []
        // item.industryTypeItems.map((i) => {
        //   orgNatureName.unshift(i.itemText)
        // })
        // orgNatureName.join(',')
        // item.orgNatureName = item.industryTypeItems[item.industryTypeItems.length-1].itemText 
        
        this.currentUserDetails = item
      },
      handleSelectionChange(val) {
        this.ruleForm.experts = val.map((item) => {
          let {name,specialty,id:expertInfoId} = this.tableList.find(v1=>v1.id == item)
          let obj = {
            name,
            specialty,
            expertInfoId,
          }
          return obj
        })
      },
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            let startDate = self.projectDetails.startTime
              ? moment(self.projectDetails.startTime).subtract(1,'d').format('YYYY-MM-DD')
              : new Date()
            return time.getTime() < new Date(startDate)
          },
        }
      },
      // 设置服务项目类型
      setPerType(e){
        if(e.length !== 0) {
          let preFirstType = this.serveTypeList.find(item=>item.itemValue == e[0])
          if(preFirstType.sysDictItemEntitys) {
            let preSecondType = preFirstType.sysDictItemEntitys.find(item=>item.itemValue == e[1])
            this.ruleForm.preSecondType = preSecondType.itemValue
            this.ruleForm.preSecondTypeName = preSecondType.itemText
          }
          this.ruleForm.preFirstType = preFirstType.itemValue
          this.ruleForm.preFirstTypeName = preFirstType.itemText
        } else {
          this.ruleForm.preFirstType = ''
          this.ruleForm.preFirstTypeName = ''
          this.ruleForm.preSecondType = ''
          this.ruleForm.preSecondTypeName = ''
        }

      },
      // 被服务单位信息，为false的时候，清空被服务单位信息
      setUserFlag(e){
        if (!e) {
          this.ruleForm.corporationName = ''
          this.ruleForm.corporationCode = ''
          this.ruleForm.organizationId = ''
          this.currentUserDetails = {}
        }
      },
      // 当重新搜索用户时，不管成功还是失败，都要清空之前的企业信息
      setUserDetails(){
          this.ruleForm.corporationCode = ''
          this.ruleForm.organizationId = ''
          this.currentUserDetails = {}
      },
      addUser(){
        this.$refs.addUser.dialogVisible = true
        // this.$refs.addUser.getInit()
      },
    },
  }
</script>

<style lang="less">
.details-title {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 700;
}
</style>
