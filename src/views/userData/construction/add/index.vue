<template>
  <div>
    <el-dialog
      id="companyAdd"
      :title="userCode ? '修改项目信息' : '添加项目信息'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
      append-to-body
      @close="close"
      @open="getInit"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        class="demo-ruleForm"
        label-position="right"
        label-width="180px"
        :rules="rules"
      >
        <el-form-item label="项目名称：" prop="projectName">
          <el-input
            v-model.trim="ruleForm.projectName"
            size="small"
            placeholder="请输入单位名称"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目地址：" prop="areaId">
              <el-cascader
                v-model="ruleForm.areaId"
                filterable
                class="item4"
                clearable
                size="small"
                :options="areaList"
                placeholder="请选择地区"
                @change="handleChangeArea"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="detailAddress">
              <el-input
                v-model.trim="ruleForm.detailAddress"
                size="small"
                placeholder="请输入详细地址"
                class="item4"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="施工许可证号：" prop="licenseKey">
          <el-input
            v-model.trim="ruleForm.licenseKey"
            size="small"
            placeholder="请输入施工许可证号"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="工程总造价(万元)：" prop="totalProjectCost">
          <el-input
            v-model.trim="ruleForm.totalProjectCost"
            size="small"
            placeholder="请输入工程总造价"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="工程总面积（㎡）：" prop="totalProjectArea">
          <el-input
            v-model.trim="ruleForm.totalProjectArea"
            size="small"
            placeholder="请输入工程总面积"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="建设单位：" prop="buildOrgName">
          <el-input
            v-model.trim="ruleForm.buildOrgName"
            size="small"
            placeholder="请输入建设单位"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="年份" prop="belongToYear">
          <el-date-picker
            class="item4"
            v-model="ruleForm.belongToYear"
            type="year"
            value-format="yyyy"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item> -->

        <el-form-item label="施工单位：" prop="orgName">
          <!-- <el-autocomplete
            popper-class="my-autocomplete"
            v-model="ruleForm.orgName"
            filterable
            class="item4"
            clearable
            size="small"
            :fetch-suggestions="querySearch"
            placeholder="请选择所属单位"
            @select="handle"
            :debounce="700"
            :trigger-on-focus="false"
            hide-loading
          >
            <template slot-scope="{ item }">
              <div class="item-sel">
                <p>{{ item.custFullName }}</p>
              </div>
            </template>
          </el-autocomplete> -->
          <el-input
            v-model.trim="ruleForm.orgName"
            size="small"
            placeholder="请输入施工单位"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="施工单位信用代码：" prop="orgBlCode">
          <el-input
            v-model.trim="ruleForm.orgBlCode"
            size="small"
            placeholder="请输入施工单位信用代码"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="监理单位：" prop="supervisorOrgName">
          <el-input
            v-model.trim="ruleForm.supervisorOrgName"
            size="small"
            placeholder="请输入监理单位"
            class="item4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="项目状况：" prop="projectStatus">
          <el-select
            v-model="ruleForm.projectStatus"
            class="item4"
            clearable
            size="small"
            placeholder="请选择项目状况"
          >
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option label="在建" value="01"></el-option>
            <el-option label="不在建" value="02"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否购买安责险：" prop="isBuy">
          <el-select
            v-model="ruleForm.isBuy"
            class="item4"
            clearable
            size="small"
            placeholder="请选择是否购买安责险"
          >
            <el-option
              v-for="(item, index) in isBuys"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="text-align: right; margin-left: -60px">
          <el-button type="info" round @click="dialogVisible = false">
            取消
          </el-button>
          <el-button type="warning" round @click="register">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mation, mationXG, mationXqs, mationsList } from '@/api/Construction.js'
import { validateBlCodeGZ, validateMoneyNo, } from '@/utils/validateFrom'
import { getOrgList } from '@/api/userDataManagement'
import { getAreaDetail, getStreet } from '@/api/Areas'
import { mapGetters } from 'vuex'
export default {
  name: 'AddUser',
  data() {
    return {
      pn: 1,
      ps: 10,
      userCode: '',
      dialogVisible: false,

      ruleForm: {
        licenseKey: '',//施工许可证号
        totalProjectCost: '',//工程总造价
        totalProjectArea: '',//工程总面积
        buildOrgName: '',//建设单位
        supervisorOrgName: '',//监理单位
        projectStatus: '',// 项目状况
        isBuy: '', // 是否购买安责险
        areaId: [], // 区域
        // custFullName: '',
        projectName: '',//项目名称
        provinceCode: '', // 省代码,依照国家颁发行政代码标准
        provinceName: '', // 省名称，
        cityCode: '', // 所在市代码
        cityName: '', // 市名称，
        countyCode: '',
        countyName: '',
        // belongToYear: '',//年份
        orgBlCode: '',//施工单位社会信用代码code
        orgName: '',//施工单位
        orgId: '',//id
      },
      isBuys: [
        {
          code: true,
          name: '是',
        },
        {
          code: false,
          name: '否',
        },
      ],
      rules: {
        // belongToYear: [{
        //   required: true,
        //   message: '请选择所属年份',
        //   trigger: 'blur',
        // }],

        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'change',
          },
          {
            min: 1,
            max: 100,
            message: '字符长度1-100位',
            trigger: 'blur',
          },
        ],
        licenseKey: [{
          required: true,
          message: '请输入施工许可证号',
          trigger: 'change',
        },
        {
          min: 1,
          max: 100,
          message: '字符长度1-100位',
          trigger: 'blur',
        },],
        totalProjectCost: [{
          required: true,
          message: '请输入工程总造价',
          trigger: 'change',
        },
        { required: true, validator: validateMoneyNo, trigger: 'blur' },],
        totalProjectArea: [{
          required: true,
          message: '请输入工程总面积',
          trigger: 'change',
        },
        { required: true, validator: validateMoneyNo, trigger: 'blur' }],
        buildOrgName: [{
          required: true,
          message: '请输入建设单位',
          trigger: 'change',
        },
        {
          min: 1,
          max: 30,
          message: '字符长度1-30位',
          trigger: 'blur',
        }],
        orgBlCode: [
          {
            required: true,
            validator: validateBlCodeGZ,
            trigger: 'blur',
          }],
        supervisorOrgName: [{
          required: true,
          message: '请输入监理单位',
          trigger: 'change',
        },
        {
          min: 1,
          max: 30,
          message: '字符长度1-30位',
          trigger: 'blur',
        },
        ],
        projectStatus: [{
          required: true,
          message: '请输入更新项目状况',
          trigger: 'change',
        }],
        isBuy: [{
          required: true,
          message: '请输入是否购买安责险',
          trigger: 'change',
        }],

        areaId: [
          {
            required: true,
            message: '请选择省市区',
            trigger: 'change',
          },
        ],
        detailAddress: [
          {
            required: true,
            message: '请输入具体地址',
            trigger: 'change',
          },
          {
            min: 1,
            max: 100,
            message: '字符长度1-100位',
            trigger: 'blur',
          },
        ],
        orgName: [
          {
            required: true,
            message: '请输入施工单位',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 30,
            message: '字符长度1-30位',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
    }),
  },
  mounted() {

  },
  methods: {
    getInit() {
      if (this.userCode) {
        this.getOrgDetail()
      }
    },
    // 
    async getOrgDetail() {
      console.log(this.userCode, 'this.userCode');
      let res = await mationXqs(this.userCode)
      if (res.code == '0000') {
        res.data['areaId'] = [
          res.data.provinceCode,
          res.data.cityCode,
          res.data.countyCode,
        ]
        this.ruleForm = res.data
        console.log(res, 'mationXqs');
      }
    },
    // 处理选中省市区方法
    async handleChangeArea(e) {
      console.log(e, '00000');
      if (e) {
        this.ruleForm.provinceCode = e[0] || ''
        this.ruleForm.provinceName = this.areaMap[e[0]] || ''
        this.ruleForm.cityCode = e[1] || ''
        this.ruleForm.cityName = this.areaMap[e[1]] || ''
        this.ruleForm.countyCode = e[2] || ''
        this.ruleForm.countyName = this.areaMap[e[2]] || ''
      }
    },

    setForm() {
      this.$refs['ruleForm'].resetFields()
    },
    close() {
      this.userCode = ''
      this.ruleForm = {
        areaId: [], // 区域
        projectName: '', // 单位名称
        detailAddress: '', // 详细地址，除省市县外，例如某某路多少号，可为空
        provinceCode: '', // 省代码,依照国家颁发行政代码标准
        provinceName: '', // 省名称，全称
        cityCode: '', // 所在市代码
        cityName: '', // 市名称，全称，可为空
        countyCode: '', // 县代码,依照国家颁发行政代码标准，可为空
        countyName: '', // 县名称，全称，可为空
        streetCode: '', // 区代码,依照国家颁发行政代码标准，可为空
        streetName: '', // 区名称，全称，可为空
        licenseKey: '',//施工许可证号
        totalProjectCost: '',//工程总造价
        totalProjectArea: '',//工程总面积
        buildOrgName: '',//建设单位
        supervisorOrgName: '',//监理单位
        projectStatus: '',// 项目状况
        isBuy: '', // 是否购买安责险
        orgBlCode: '',//施工单位社会信用代码code
        orgName: '',//施工单位
      }
      this.$refs.ruleForm.resetFields()
    },
    // querySearch(queryString, cb) {
    //   console.log(queryString, 'queryString');
    //   let pams = {
    //     pn: this.pn,
    //     ps: this.ps,
    //     industryOne: '15',
    //     custFullName: queryString
    //   }
    //   // console.log(pams, 'queryString');
    //   getOrgList(pams).then((res) => {
    //     console.log(res, 'queryString');
    //     this.ruleForm.orgBlCode = res.list[0].blCode
    //     this.ruleForm.orgName = res.list[0].custFullName
    //     var List = []
    //     setTimeout(() => {
    //       if (!res.list) {
    //         cb(List)
    //       }
    //     }, 2000)
    //     if (res.list) {
    //       List = res.list.map((item) => {
    //         return { value: item.custFullName, ...item }
    //       })
    //       cb(List) // 调用 callback 返回建议列表的数据
    //     }
    //   })
    // },
    //单位名称
    // async handle(val) {
    //   console.log(val, 'ididididididid');
    //   this.ruleForm.orgId = val.id
    //   //   let pams = {
    //   //     pn: this.pn,
    //   //     ps: this.ps,
    //   //     industryOne: '15',
    //   //     custFullName: this.ruleForm.custFullName
    //   //   }
    //   //   let res = await getOrgList(pams)
    //   //   console.log(res, 'pams');
    //   //   if (res.code === '0000') {

    //   //   }
    // },



    register() {
      // console.log(this.ruleForm.orgBlCode, 'this.ruleForm.orgBlCode');
      // if (this.ruleForm.orgBlCode == '' || this.ruleForm.orgBlCode == null) {
      //   this.$message.error('请选择建筑施工类生产经营单位后创建项目');
      //   return false
      // }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$confirm('即将提交, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            this.submit()
          })
        } else {
          this.$message.error('请完整填写信息')
          return false
        }
      })
    },

    async submit() {
      if (this.userCode) {
        let res = await mationXG(this.userCode, this.ruleForm)
        if (res.code == '0000') {
          this.$message.success('修改建筑施工项目成功')
          this.$parent.mationsList();
        }
      } else {
        let res = await mation(this.ruleForm)
        if (res.code == '0000') {
          this.$message.success('添加建筑施工项目成功')
          this.$parent.mationsList();
        }
      }
      this.dialogVisible = false
      this.$emit('getMsg', '刷新')
    },
  },
}
</script>

<style lang="scss">
#companyAdd {
  .el-dialog {
    width: 750px;
    .item4 {
      width: 280px;
    }
    .search-icon {
      margin-left: 10px;
    }
    .item1 {
      width: 260px;
      margin-right: 20px;
    }
    .item2 {
      width: 250px;
    }
    .item5 {
      width: 300px;
    }
    .content-tips {
      display: inline-block;
      height: 34px;
      line-height: 34px;
      background-color: #dbf9ef;
      color: #34c697;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
</style>
