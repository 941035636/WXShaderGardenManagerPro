<template>
  <div id="enterpriseDetail">
    <el-dialog
      title="企业信息"
      :visible.sync="dialogVisible"
      width="1100px"
      @open="getInit"
    >
      <div style="width: 100%; margin-bottom: 10px">
        <el-row :gutter="5">
          <el-col :span="3">
            <div class="particularsTitleClass">企业名称：</div>
          </el-col>
          <el-col :span="8">
            <div class="particularsContentClass">
              {{ data.entName }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">社会统一信用代码：</div>
          </el-col>
          <el-col :span="8">
            <div class="particularsContentClass">
              {{ data.companyCode }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="3">
            <div class="particularsTitleClass">经营地址：</div>
          </el-col>
          <el-col :span="8">
            <div class="particularsContentClass">
              {{
                data.provinceName + '/' + data.cityName + '/' + data.areaName
              }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">详细地址：</div>
          </el-col>
          <el-col :span="8">
            <div class="particularsContentClass">
              {{ data.address }}
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :span="3">
            <div class="particularsTitleClass">国民经济行业：</div>
          </el-col>
          <el-col :span="8">
            <div class="particularsContentClass">
              {{ data.industryTypeThreeName + '/' + data.industryTypeFourName }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">企业人数：</div>
          </el-col>
          <el-col :span="8">
            <div class="particularsContentClass">
              {{ data.peopleNum }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="titleClass">联系人</div>
      <div style="width: 100%; margin-bottom: 10px">
        <el-row :gutter="5">
          <el-col :span="3">
            <div class="particularsTitleClass">法人代表：</div>
          </el-col>
          <el-col :span="8">
            <div class="particularsContentClass">
              {{ data.legalPerson }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="particularsTitleClass">联系方式：</div>
          </el-col>
          <el-col :span="8">
            <div class="particularsContentClass">
              {{ data.legalPhone }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="buttonClass">
        <!-- <div
          class="buttonNameClass"
          @click="modificationData"
          style="cursor: pointer"
        >
          修改资料
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail } from '@/api/user'
import { getOrgDetails } from '@/api/userDataManagement'
import Title from '@/components/NewTitle'
import Table from '../details/components/Table.vue'
import { getFile } from '@/api/resources.js'
import { mapGetters } from 'vuex'
import Label1 from '@/components/label/index'
export default {
  components: {
    Title,
    Table,
    Label1,
  },
  data() {
    return {
      dialogVisible: false,
      userCode: '',
      data: {},
      // projectList: [],//项目信息
      visible: false,
      visible2: false,
      visible1: false,
      visible3: false,
      visible4: false,
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',
      getStrEnumAll: 'enums/getStrEnumAll',
      branchId: 'user/branchId',
      accountType: 'user/accountType',
    }),

    address() {
      let result = ''
      if (this.data.provinceName) {
        result =
          this.data.provinceName +
          ' / ' +
          this.data.cityName +
          ' / ' +
          this.data.countyName
      } else {
        result = '--'
      }

      return result
    },

    industryName() {
      let name = []
      let result = ''
      if (this.data.sysDictItemEntitys) {
        this.data.sysDictItemEntitys.forEach((item) => {
          name.push(item.itemText)
        })
        result = name.join(' / ')
      } else {
        result = '--'
      }
      return result
    },
    level() {
      if (this.data.safetyProdLevel) {
        return this.getStrEnumAll.SafetyLevelEnum.find((item) => {
          return item.code == this.data.safetyProdLevel
        }).label
      } else {
        return '--'
      }
    },
    status() {
      if (this.data.orgStatus) {
        return this.getStrEnumAll.BusinesStatus.find((item) => {
          return item.code == this.data.orgStatus
        }).label
      } else {
        return '--'
      }
    },
    manageName() {
      let name = []
      let result = ''
      if (this.data.administrations) {
        this.data.administrations.forEach((item) => {
          name.push(item.itemText)
        })
        result = name.join(' / ')
      } else {
        result = '--'
      }
      return result
    },
  },

  methods: {
    async getInit() {
      let res = await getDetail(this.userCode)
      console.log(res, 'dfdsfsdf')
      // console.log(res, 'projectList');
      // this.projectList = res.data.constructionProjectRespList
      this.data = res.data
    },
    checkBsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.businessLicenseFileId
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'res')
        })
        .catch((_) => {})
    },
    checkLsp() {
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.safetyProdLicenseFileId
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'lsp')
        })
        .catch((_) => {})
    },
    async initData() {
      this.getOrgList()
    },
    async getOrgList() {
      let userCode = ''
      if (this.accountType === '00') {
        userCode = this.branchId
      } else {
        userCode = this.$route.query.userCode
      }
      let res = await getOrgDetails(userCode)
      if (res.code === '0000') {
        this.data = res.data
        this.data.employeeNum = res.data.employeeNum + ''
        this.data.orgNatureName = this.enumData.CorpEnum[this.data.orgNature]
        this.data.riskLevelName =
          this.enumData.RiskLevelEnum[this.data.riskLevel]
        this.data.addressDetails =
          res.data.provinceName +
          res.data.cityName +
          res.data.countyName +
          res.data.streetName +
          res.data.detailAddress +
          res.data.villageCommittee
        this.data.addressDetails = this.data.addressDetails.replace(/null/g, '')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#enterpriseDetail {
  .titleClass {
    margin: 20px 0;
    line-height: 20px;
    font-size: 16px;
    font-weight: bold;
  }
  background-color: #fff;
  width: 90%;
  margin: 0 auto;
  .stitle {
    font-weight: bold;
    color: #000;
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
  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
<style >
#enterpriseDetail .el-form-item__label {
  color: #919191;
}
#enterpriseDetail .el-form-item {
  margin-bottom: 5px;
}
</style>
