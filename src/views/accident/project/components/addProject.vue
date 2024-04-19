<template>
  <div id="servicrAdd">
    <el-dialog
      :title="projectId?'编辑项目':'添加项目'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="close"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="200px"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model.trim="ruleForm.projectName"
            class="w280"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目合同编号" prop="contractNo">
          <el-input
            v-model.trim="ruleForm.contractNo"
            class="w280"
            placeholder="请输入项目合同编号"
          ></el-input>
          <!-- <div v-if="ruleForm.contractNo" class="contractNo-box">
            <span>{{ contractNoUpperCase }}</span>
          </div> -->
        </el-form-item>
        <div class="display-flex">
          <el-form-item label="项目时间" prop="startTime">
            <el-date-picker
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
              v-model="ruleForm.endTime"
              class="w150"
              type="date"
              :picker-options="dealDateStartOptions"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="支出金额" prop="accidentPreFund">
          <el-input
            v-model.trim="ruleForm.accidentPreFund"
            class="w280"
            placeholder="请输入服务费金额"
          ></el-input>
          <span class="ml10 color-red-F5222D">( {{ accidentPreFundBig }} )</span>
        </el-form-item>
        <el-form-item label="服务机构" prop="serviceAgencyCode">
          <el-select
              v-model="ruleForm.serviceAgencyCode"
              class="w450"
              clearable
              placeholder="请选择服务机构"
              @change="setServiceBranch"
            >
              <el-option
                v-for="(item, key) in tableList"
                :key="key"
                :label="item.nameAndLinkNameAndLinkPhone"
                :value="item.businessCode"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="项目服务说明" prop="remark">
          <el-input
            v-model.trim="ruleForm.remark"
            class="w450"
            type="textarea"
            placeholder="请输入项目服务说明"
          ></el-input>
        </el-form-item>
        <div style="border:1px dashed #ccc;margin-bottom:20px"></div>
        <el-form-item label="所属保险产品" prop="insuranceProductId">
          <el-select
              v-model="ruleForm.insuranceProductId"
              class="w450"
              clearable
              @change="setProduct"
              placeholder="请选择产品"
            >
              <el-option
                v-for="(item, key) in productList"
                :key="key"
                :label="item.codeAndName"
                :value="item.id"
              ></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" round>取 消</el-button>
            <el-button type="warning" @click="register" round>确认提交</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import { addProject,getProjectDetails,updateProject,getQueryProduct } from '@/service/accidentManagement'
  import userManage from "@/service/userManage.js";
  import dateService from "@/service/dateService.js";
  import { smalltoBIG } from '@/util/validate'
  import { dateTest } from '@/util/validate'
  import moment from 'moment'
  import { validateContractNo, validateProjectName, validateBigMoeny,validateProjectRemarks } from '@/util/validateFrom'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceAdd',
    components: {},
    data() {
      return {
        dateSer: new dateService(),
        userManage: new userManage(),
        dealDateStartOptions: this.beginDate(),
        dialogVisible:false,
        projectId:'',
        ruleForm: {
          accidentPreFund: 0, // 服务金额
          accidentPreFundRatio: '', // 事故预防费用占比
          contactName: '', // 联系人姓名
          contactNum: '', // 联系人电话
          contractNo: '', // 合同编号
          createBy: '',
          policyNo: '', // 保单号
          projectName: '',
          remark: '',
          serviceAgencyCode: '', // 安全服务机构编码
          serviceAgencyName: '', // 安全服务机构名称
          startTime: '',
          endTime: '',
          insuranceProductId:'',
          insuranceProductCode:'',
          insuranceProductName:'',
        },
        accidentPreFundBig: '零',
        userCode: '',
        rules: {
          projectName: [
            { required: true, validator: validateProjectName, trigger: 'blur' },
          ],
          contractNo: [
            { required: true, validator: validateContractNo, trigger: 'blur' },
          ],
          startTime: [
            {
              required: true,
              message: '请选择服务时间起期',
              trigger: 'change',
            },
          ],
          endTime: [
            {
              required: true,
              message: '请选择服务时间止期',
              trigger: 'change',
            },
          ],
          accidentPreFund: [
            { required: true, validator: validateBigMoeny, trigger: 'blur' },
          ],
          serviceAgencyCode: [
            { required: true, message: '请选择服务机构', trigger: 'change' },
          ],
          remark: [
            { required: true, validator: validateProjectRemarks, trigger: 'blur' },
          ],
          insuranceProductId: [
            { required: true, message: '请选择产品', trigger: 'change' },
          ],
        },
        tableList: [],
        productList: [],
        currentTime:'', // 当前时间
        serviceData:'', // 编辑的时候，默认服务器时间
      }
    },
    computed: {
      ...mapGetters({
      }),
      contractNoUpperCase() {
        let contractNo = this.ruleForm.contractNo || ''
        return contractNo.toUpperCase()
      },
    },
    watch: {
      'ruleForm.accidentPreFund': function (n, o) {
        console.log(n, o)
        this.accidentPreFundBig = smalltoBIG(n) || '零'
      },
    },
    mounted() {
    },
    methods: {
      initData(row) {
        this.dialogVisible = true
        this.projectId = row || '' 
        this.getNewData()
        this.getBranchList()
        this.getQueryProduct()
        
      },
      // 获取服务器时间
      async getNewData(){  
        let {data} = await this.dateSer.getDate() || ''; 
        console.log(data);
        if(data.code === '0000') {
          this.currentTime = data.data
        }
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      async getQueryProduct() {
        let res = await getQueryProduct()
        if(res.code === '0000') {
          this.productList = res.list.map((item)=>{
            return {
              ...item,
              codeAndName:item.accidentProductName +'   ' +item.accidentProductCode
            }
          })
        }
      },
      async getBranchList() {
        let from = {
          pn: 1,
          ps: 1000,
          name: '',
          agencyNature: '',
          bl: '',
          status: '1',
          code: '',
          desc: false,
          orderby: '',
          type: '',
        }
        let res = await this.userManage.organizationList('safetyOrganizationSvc',from)
        if (res.code === '0000') {
          this.tableList = res.list.map(item=>{
            return {
              ...item,
              nameAndLinkNameAndLinkPhone:`${item.orgName}   ${item.safetyCharger}  ${item.safetyChargerPhone}`
            }
          })
          if (this.projectId) {
            this.initDataDetails(this.projectId)
          }
        }
      },
      async initDataDetails(id) {
        let res = await getProjectDetails(id)
        if (res.code === '0000') {
          for (let key in this.ruleForm) {
            this.ruleForm[key] = res.data.accidentPreProjectEntity[key]
          }
          this.ruleForm.id = id
          this.ruleForm.startTime = this.ruleForm.startTime.split(' ')[0]
          this.serviceData = this.ruleForm.startTime
          this.ruleForm.endTime = this.ruleForm.endTime.split(' ')[0]
        }
      },
      async configRegister() {
        let data = JSON.parse(JSON.stringify(this.ruleForm))
        if (dateTest(this.ruleForm.startTime, this.ruleForm.endTime)) {
          this.$message.error('止起不能大于起期，请重新选择')
          return
        }
        data.startTime = `${data.startTime} 00:00:00`
        data.endTime = `${data.endTime} 23:59:59`
        data.contractNo = data.contractNo.toUpperCase()
        if (data.id) {
          let res = await updateProject(data, data.id)
          if (res.code === '0000') {
            this.toThisTag()
          }
        } else {
          let res = await addProject(data)
          if (res.code === '0000') {
            this.toThisTag()
          }
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
      // 处理选中服务机构
      setServiceBranch(e) {
        let {orgName,safetyCharger,safetyChargerPhone,id} = this.tableList.find(item=>item.businessCode == e)
        this.ruleForm.serviceAgencyName = orgName
        this.ruleForm.serviceAgencyId = id
        this.ruleForm.contactName = safetyCharger
        this.ruleForm.contactNum = safetyChargerPhone
      },
      // 处理选中的产品
      setProduct(e) {
        console.log(this.productList.find(item=>item.id == e));
        let {accidentProductCode,accidentProductName} = this.productList.find(item=>item.id == e)
        this.ruleForm.insuranceProductCode = accidentProductCode
        this.ruleForm.insuranceProductName = accidentProductName
      },
      // 设置路由
      async toThisTag() {
        this.dialogVisible = false
        this.$emit('succeckCellBack')
      },
      beginDate() {
        let self = this
        return {
          disabledDate(time) {
            let startDate = self.serviceData
              ? self.serviceData
              : new Date(moment(self.currentTime).subtract(1,'d'))
            return time.getTime() < new Date(startDate)
          },
        }
      },
      close() {
        this.clear()
      },
      clear() {
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
        this.ruleForm.id = ''
        console.log(this.ruleForm)
      },
    },
    
  }
</script>

<style scoped lang="less">
  #servicrAdd {
    padding-top: 10px;
    margin: 10px;
    .btn-bottom {
      margin-top: 20px;
      text-align: center;
    }
    .contractNo-box {
      margin-top: 10px;
      font-size: 14px;
      span {
        display: inline-block;
        background-color: #0b8c1e;
        border-radius: 10px;
        box-sizing: border-box;
        min-width: 280px;
        padding: 0 10px;
      }
    }
  }
</style>
