<template>
  <div id="updatePolicy">
    <div class="header">
      <el-steps process-status="finish" :active="0" simple>
        <el-step title="填写保单">
          <span slot="icon">1</span>
        </el-step>
        <el-step title="预览并提交">
          <span slot="icon">2</span>
        </el-step>
        <el-step title="提交完成">
          <span slot="icon">3</span>
        </el-step>
      </el-steps>
      <div class="headerTip color-blue">
        请填写真实有效的信息，对于您的信息我们会严格保密
      </div>
    </div>
    <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f14 ml10 mr20">投保人信息</span>
        <!-- <span>未注册企业，请点击</span>
        <span @click="addHolder">
          <i class="f14 el-icon-circle-plus"></i>
          添加投保企业
        </span> -->
      </div>
      <div v-if="!hasHolder" class="emptyBox">
        <el-button @click="openSelect" type="primary">选择投保人</el-button>
      </div>
      <add-holder v-else ref="addHolder" class="mt10" />
      <p v-if="editHolder" style="text-align: center; margin: 0">
        <el-button @click="openSelect">修改</el-button>
      </p>
    </div>
    <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f14 ml10 mr20">被保人信息</span>
        <span>
          <el-switch
            @change="changeSame"
            class="mr10"
            v-model="sameHolder"
          ></el-switch>
          同投保人
        </span>
      </div>
      <div v-if="!hasInsured" class="emptyBox">
        <el-button @click="openInsured" type="primary">
          填写被保人信息
        </el-button>
      </div>
      <add-insured v-else ref="addInsured" />
      <p v-if="hasInsured && !sameHolder" style="text-align: center; margin: 0">
        <el-button @click="editInsured">修改</el-button>
      </p>
    </div>
    <!--  v-if="
        (industryOneS == '15' && cativeList.industryOne == '15') ||
        insuredInfoParam.industryOne == '15'
      " -->
    <div class="conBox" v-if="insuredInfoParam.industryOne == '15'">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">项目信息</span>
      </div>
      <div
        v-if="(epoli && cativeList.projectName == '') || !epoli"
        class="emptyBox"
      >
        <el-button class="w120" @click="openXm" type="primary">
          填写项目信息
        </el-button>
      </div>
      <!-- <div id="addHolder" v-if="disable">   于11.6日 因为需求变更不在需要
        <el-form label-position="left" label-width="140px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                {{ projectList1.projectName }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="项目地址：">
                {{ projectList1.provinceName }}/{{ projectList1.cityName }}/{{
                  projectList1.countyName
                }}{{ projectList1.detailAddress }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <p
          v-if="!sameHolder"
          class="mb20"
          style="text-align: center; margin: 0"
        >
          <el-button @click="openXm">修改</el-button>
        </p>
      </div> -->

      <div id="addHolder" v-else>
        <el-form label-position="left" label-width="140px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                {{ cativeList.projectName }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <!-- v-if="cativeList.industryOne == '15'" -->
              <el-form-item label="项目地址：">
                {{ cativeList.projectProvinceName }}/{{
                  cativeList.projectCityName
                }}/{{ cativeList.projectCountyName
                }}{{ cativeList.projectDetailAddress }}
              </el-form-item>
              <!-- <el-form-item label="项目地址：" v-else>
                {{ cativeList.provinceName }}/{{ cativeList.cityName }}/{{
                  cativeList.countyName
                }}{{ cativeList.detailAddress }}
              </el-form-item> -->
            </el-col>
          </el-row>
        </el-form>
        <p class="mb20" style="text-align: center; margin: 0">
          <!-- <el-button @click="openModify">修改</el-button> -->
          <el-button @click="openXm">修改</el-button>
        </p>
      </div>
    </div>
    <addxiangm
      @itemCative="itemCative"
      @epolicy="epolicy"
      ref="addxiangm"
      class="mt10"
    />
    <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">保险机构</span>
      </div>
      <issuing-company ref="IssuingCompany" />
    </div>
    <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">保单信息</span>
      </div>
      <warranty-param ref="warrantyParam" />
    </div>
    <div class="conBox mb20">
      <div class="title">
        <span></span>
        <span class="color-blue f14 ml10 mr20">事故预防信息</span>
      </div>
      <accident ref="accident" />
    </div>
    <!-- <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f14 ml10 mr20">评价信息</span>
      </div>
      <comment ref="comment" />
    </div> -->
    <p class="mb20" style="text-align: center; margin: 0">
      <el-button class="w100 mb20" type="primary" @click="nextStep">
        下一步
      </el-button>
    </p>
    <add-org :industryData="industryData" @sucessCb="refresh" ref="addOrg" />
    <select-org @getMsg="getMsg" ref="selectOrg" />
    <Openmodify @projectOen="projectOen" ref="openmodify" />
  </div>
</template>

<script>
import Openmodify from '../addPolicy/components/openModify.vue'
import addOrg from '@/views/userData/highRisk/components/add.vue'
import Accident from '../addPolicy/components/accident.vue'
import addHolder from '../addPolicy/components/addHolder.vue'
import addInsured from '../addPolicy/components/addInsured.vue'
import Comment from '../addPolicy/components/comment.vue'
import IssuingCompany from '../addPolicy/components/issuingCompany.vue'
import WarrantyParam from '../addPolicy/components/WarrantyParam.vue'
import { mapMutations, mapGetters } from 'vuex'
import { dictItem } from '@/api/policyManagement'
import SelectOrg from '../addPolicy/components/selectOrg.vue'
import { addPolicy, policyData } from '@/api/policyManagement'
import addxiangm from '../addPolicy/components/addxiangm.vue'
export default {
  name: 'updatePolicy',
  components: {
    addxiangm,
    addHolder,
    addInsured,
    IssuingCompany,
    WarrantyParam,
    Accident,
    Comment,
    addOrg,
    SelectOrg,
    Openmodify
  },
  data() {
    return {
      epoli: false, //控制项目信息按钮隐藏线索
      industryOneS: '',
      // projectList1: {},
      // disable: false,
      sameHolder: false,
      hasHolder: true,
      userCode: '',
      editHolder: true,
      hasInsured: true,
      industryData: [],
      id: '',
      cativeList: {},
    }
  },
  computed: {
    ...mapGetters({
      organizationEntity: 'policyInfo/organizationEntity',
      insuredInfoParam: 'policyInfo/insuredInfoParam',
      warrantyParam: 'policyInfo/warrantyParam',
      insurersInfo: 'policyInfo/insurersInfo',
      accidentRate: 'policyInfo/accidentRate',
      comment: 'policyInfo/comment',
    }),
  },
  created() {
    this.getIndustryData()
  },
  activated() {
    if (this.$route.query.code != this.userCode) {
      this.getInit()
      console.log('activated')
      this.userCode = this.$route.query.code
    }
  },
  mounted() {
    // this.getInit()
  },
  methods: {
    async getInit() {
      if (this.$route.query.code) {
        let res = await policyData(this.$route.query.code)
        if (res.code == '0000') {
          this.$store.commit(
            'policyInfo/organizationEntity',
            res.data.holderResp
          )
          this.hasInsured = true
          this.$refs.addHolder.data = res.data.holderResp
          res.data.insuredResp.areaCascaser = [
            res.data.insuredResp.provinceCode,
            res.data.insuredResp.cityCode,
            res.data.insuredResp.countyCode,
          ]
          res.data.insuredResp.industryId2 = res.data.insuredResp.industryTwo
            ? [
              res.data.insuredResp.industryOne,
              res.data.insuredResp.industryTwo,
            ]
            : [res.data.insuredResp.industryOne]
          res.data.insuredResp.manageId2 = [
            res.data.insuredResp.economyFieldOne,
            res.data.insuredResp.economyFieldTwo,
          ]
          res.data.insuredResp.businessFile = Array.isArray(
            res.data.insuredResp.businessFile
          )
            ? res.data.insuredResp.businessFile
            : [res.data.insuredResp.businessFile]
          res.data.insuredResp.prodLicenseFile = Array.isArray(
            res.data.insuredResp.prodLicenseFile
          )
            ? res.data.insuredResp.prodLicenseFile
            : [res.data.insuredResp.prodLicenseFile]
          this.$nextTick(() => {
            this.$refs.addInsured.data = res.data.insuredResp
            this.sameHolder = res.data.insuredResp.isPolicyHolder
            this.$store.commit(
              'policyInfo/insuredInfoParam',
              res.data.insuredResp
            )
          })
          this.$refs.IssuingCompany.FormData = res.data.insurersInfo
          this.$store.commit('policyInfo/insurersInfo', res.data.insurersInfo)
          let policyInfo = {
            applicationFormCode: res.data.policyInfoResp.applicationFormCode,
            policyNo: res.data.policyInfoResp.policyNo,
            startTime: res.data.policyInfoResp.startTime,
            endTime: res.data.policyInfoResp.endTime,
            actualPrem: res.data.policyInfoResp.actualPrem,
            limitValue: res.data.policyInfoResp.limitValue,
            signTime: res.data.policyInfoResp.signTime,
            prem: res.data.policyInfoResp.prem,
            insureNumRemark: res.data.policyInfoResp.insureNumRemark,
            premTypeRemark: res.data.policyInfoResp.premTypeRemark,
            id: res.data.policyInfoResp.id,
            rateFactor: res.data.policyInfoResp.rateFactor,
            photoCopy:
              res.data.policyInfoResp.fileRecordEntitys &&
                res.data.policyInfoResp.fileRecordEntitys.length
                ? res.data.policyInfoResp.fileRecordEntitys.map((item) => {
                  return item.id
                })
                : [],
          }
          this.id = res.data.policyInfoResp.id
          this.$refs.warrantyParam.FormData = policyInfo
          this.$refs.warrantyParam.hasOther = true
          this.$refs.warrantyParam.fileListWall =
            res.data.policyInfoResp.fileRecordEntitys &&
              res.data.policyInfoResp.fileRecordEntitys.length
              ? res.data.policyInfoResp.fileRecordEntitys
              : []
          this.$store.commit('policyInfo/warrantyParam', policyInfo)

          res.data.accidentRate.serviceAccidentType =
            res.data.accidentRate.accidentType.split('/')
          this.$refs.accident.FormData = res.data.accidentRate
          this.$store.commit('policyInfo/accidentRate', res.data.accidentRate)
          // let comData = {
          //   comment: res.data.comment,
          // }
          // this.$refs.comment.FormData = comData
          // await this.$store.commit('policyInfo/comment', res.data.comment)
          this.cativeList = res.data.insuredResp
          if (res.data.insuredResp.projectName) {
            this.epoli = true
          }
        }
      }
    },
    openXm() {
      this.$refs.addxiangm.dialogFormVisible = true
      // this.$nextTick(() => {
      //   console.log('0900')
      this.cativeList['address'] = this.cativeList.areaCascaser
      console.log(this.cativeList, 'this.cativeListthis.cativeListthis.cativeList');
      this.$refs.addxiangm.ruleForm = this.cativeList
      this.$refs.addxiangm.CityList = true
      // })
    },
    epolicy(item) {
      this.epoli = item
      console.log(item, 'epolicy');
    },
    itemCative(item) {
      this.cativeList = item
      console.log(this.cativeList, 'cativeList');
    },
    // openModify() {   //于11.6日 因为需求变更不在需要
    //   this.$refs.openmodify.dialogFormVisible = true
    //   this.$refs.openmodify.dialogXg = true
    // },
    projectOen(item) {
      this.cativeList = item
    },
    openSelect() {
      this.$refs.selectOrg.dialogFormVisible = true
    },
    addHolder() {
      this.$refs.addOrg.dialogVisible = true
    },
    openInsured() {
      this.$refs.addOrg.isInsured = true
      this.$refs.addOrg.dialogVisible = true
    },
    editInsured() {
      this.$refs.addOrg.isInsured = true
      let arr = []
      arr.push(this.cativeList)
      this.$refs.addOrg.projectList = arr
      this.$refs.addOrg.dialogVisible = true
      this.$nextTick(() => {
        console.log('0900', this.insuredInfoParam)
        let form = { ...this.insuredInfoParam }
        form.projectName = ''
        this.$refs.addOrg.ruleForm = form
      })
    },
    getMsg(e) {
      //选择投保人信息
      if (e) {
        this.hasHolder = true
        this.editHolder = true
        this.hasInsured = false
        this.sameHolder = false
        this.$nextTick(() => {
          this.$refs.addHolder.data = this.organizationEntity
        })
      }
    },
    changeSame(e) {
      // this.disable = e   于11.6日 因为需求变更不在需要
      // if (this.disable) {
      //   let data = JSON.parse(JSON.stringify(this.organizationEntity))
      //   if (data.projectList1) {
      //     data.projectList1.forEach(element => {
      //       this.projectList1 = element
      //     });
      //   }
      // }
      // if (!this.disable) {
      //   let data = JSON.parse(JSON.stringify(this.insuredInfoParam))
      //   if (data.projectList1) {
      //     data.projectList1.forEach(element => {
      //       this.projectList1 = element
      //     });
      //   }
      // }
      console.log(e)
      if (e) {
        if (this.hasHolder) {
          let data = JSON.parse(JSON.stringify(this.organizationEntity))
          this.industryOneS = data.industryOne
          data.isPolicyHolder = true
          this.hasInsured = true
          data.areaCascaser = [
            data.provinceCode,
            data.cityCode,
            data.countyCode,
          ]
          data.industryId2 = [data.industryOne]
          if (data.industryTwo) {
            data.industryId2 = [data.industryOne, data.industryTwo]
          }
          data.manageId2 = [data.economyFieldOne, data.economyFieldTwo]
          data.businessFile = Array.isArray(data.businessFile)
            ? data.businessFile
            : [data.businessFile]
          data.prodLicenseFile = Array.isArray(data.prodLicenseFile)
            ? data.prodLicenseFile
            : [data.prodLicenseFile]
          this.$nextTick(() => {
            this.$refs.addInsured.data = data
            this.$store.commit('policyInfo/insuredInfoParam', data)
          })
        } else {
          this.sameHolder = false
          this.$baseMessage('请先填写投保人信息', 'error')
        }
      } else {
        let data = JSON.parse(JSON.stringify(this.insuredInfoParam))
        data.isPolicyHolder = false
        this.$refs.addInsured.data = data
        this.$store.commit('policyInfo/insuredInfoParam', data)
        this.$nextTick(() => {
          this.hasInsured = false
        })
      }
    },
    async getIndustryData() {
      //获取管理分类信息
      let res = await dictItem(true, 20003)
      if (res.code == '0000') {
        this.industryData = res.data
      }
    },
    async refresh(e) {
      this.sameHolder = false
      if (e == '') {
        //获取被保人
        this.hasInsured = true
        this.$nextTick(() => {
          this.$refs.addInsured.data = this.insuredInfoParam
        })
      } else {
        //获取投保人
        this.hasHolder = true
        this.$nextTick(() => {
          this.$refs.addHolder.data = this.organizationEntity
        })
      }
    },
    focusError() {
      setTimeout(() => {
        this.$message.error({
          title: '提示',
          message: document.getElementsByClassName('el-form-item__error')[0]
            .innerText,
        })
        let isError = document.getElementsByClassName('is-error')
        isError[0].querySelector('input').focus()
      }, 100)
    },
    async nextStep() {
      if (!this.hasHolder) {
        this.$baseMessage('请先填写投保人信息', 'error')
        return
      }
      if (!this.hasInsured) {
        this.$baseMessage('请先填写被保人信息', 'error')
        return
      }
      if (!this.$refs.IssuingCompany.save()) {
        console.log('这是保险机构信息')
        // this.focusError()
        return
      }
      if (!this.$refs.warrantyParam.save()) {
        console.log('这是保单信息')
        this.focusError()
        return
      }
      if (!this.$refs.accident.save()) {
        console.log('这是事故预防信息')
        this.focusError()
        return
      }
      // await this.$refs.comment.save()
      let data = {
        accidentRate: this.accidentRate,
        // comment: this.comment,
        insuredInfoParam: this.insuredInfoParam,
        insurersInfo: this.insurersInfo,
        organizationEntity: this.organizationEntity,
        warrantyParam: this.warrantyParam,
      }
      const roles = window.sessionStorage.getItem('roles')
      let rolesArr = []
      if (roles != undefined && roles != undefined) {
        if (roles.indexOf(',') != -1) {
          rolesArr = roles.split(',')
        } else {
          rolesArr = [roles]
        }

        if (rolesArr.includes('RL1453259613846778543')) {
          this.$router.push({
            name: 'MyPreviewPolicy',
            query: {
              id: this.id,
            },
          })
          return
        } else {
          let cativeObj = true
          this.$router.push({
            name: 'priviewPolicy',
            query: {
              id: this.id,
              cativeArr: this.cativeList,
              cativeObj: cativeObj
            },
          })
          return
        }
      }

      this.$router.push({
        name: 'priviewPolicy',
        query: {
          id: this.id,
        },
      })

      // let res = await addPolicy(data)
      // if (res.code === '0000') {
      //   this.$baseMessage('提交成功', 'success')
      // }
    },
  },
}
</script>

<style lang='scss'>
#updatePolicy .el-step__icon {
  width: 26px;
  height: 26px;
  font-size: 16px;
}
</style>
<style lang='scss' scoped>
#updatePolicy {
  background-color: #f6f8f9;

  .emptyBox {
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .conBox {
    border-radius: 6px;
    margin-top: 10px;
    padding-bottom: 10px;
    background-color: #fff;

    .title {
      display: flex;
      height: 40px;
      width: 96%;
      margin: 0 auto;
      align-items: center;
      padding: 0 20px;
      font-size: 12px;
      border-bottom: 1px solid #ccc;

      span:nth-child(1) {
        display: inline-block;
        width: 5px;
        height: 16px;
        background-color: #096dd9;
      }

      span:nth-child(4) {
        color: #ffa940;
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
}

#updatePolicy .header {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  background-color: #fff !important;
  height: 130px;

  .el-steps {
    width: 70%;
  }

  .headerTip {
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    background-color: #cce7ff;
    text-align: center;
  }

  .el-steps--simple {
    background-color: #fff;
  }
}
#addHolder {
  width: 100%;
  padding: 30px 30px 10px 50px;
  box-sizing: border-box;
}
</style>