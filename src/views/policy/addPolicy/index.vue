<template>
  <div id="addPolicy">
    <div class="header">
      <el-steps process-status="finish" :active="active" simple>
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
        <span class="color-blue f16 ml10 mr20">投保人信息</span>
        <span v-if="!hasHolder">未注册企业，请点击</span>
        <span v-if="!hasHolder" @click="addHolder">
          <i class="f16 el-icon-circle-plus"></i>
          添加投保企业
        </span>
      </div>
      <div v-if="!hasHolder" class="emptyBox">
        <el-button class="w120" @click="openSelect" type="primary">
          选择投保人
        </el-button>
      </div>
      <add-holder v-else ref="addHolder" class="mt10" />
      <p class="mb20" v-if="editHolder" style="text-align: center; margin: 0">
        <el-button @click="openSelect">修改</el-button>
        <el-button @click="delHolder">删除</el-button>
      </p>
    </div>
    <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">被保人信息</span>
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
        <el-button class="w120" @click="openInsured" type="primary">
          填写被保人信息
        </el-button>
      </div>
      <add-insured v-else ref="addInsured" />
      <p
        class="mb20"
        v-if="hasInsured && !sameHolder"
        style="text-align: center; margin: 0"
      >
        <el-button @click="editInsured">修改</el-button>
      </p>
    </div>
    <div
      class="conBox"
      v-show="
        isShow && (industryOne == '15' || insuredInfoParam.industryOne == '15')
      "
    >
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">项目信息</span>
      </div>
      <!-- insuredInfoParam.industryOneName != '建筑施工' -->
      <div v-if="!epoli" class="emptyBox">
        <el-button class="w120" @click="openXm" type="primary">
          填写项目信息
        </el-button>
      </div>
      <addxiangm
        @itemCative="itemCative"
        @epolicy="epolicy"
        ref="addxiangm"
        class="mt10"
      />
      <!-- v-if="epoli" -->
      <div id="addHolder" v-if="epoli">
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
              <!-- <el-form-item label="项目地址：">
                {{ cativeList.provinceName }}/{{ cativeList.cityName }}/{{
                  cativeList.countyName
                }}{{ cativeList.detailAddress }}
              </el-form-item> -->
              <el-form-item label="项目地址：">
                {{ cativeList.projectProvinceName }}/{{
                  cativeList.projectCityName
                }}/{{ cativeList.projectCountyName
                }}{{ cativeList.projectDetailAddress }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- v-if="!disable" -->
        <p class="mb20" style="text-align: center; margin: 0">
          <!-- <el-button @click="openModify">修改</el-button> -->
          <el-button @click="openXm">修改</el-button>
        </p>
      </div>
    </div>

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
        <span class="color-blue f16 ml10 mr20">事故预防信息</span>
      </div>
      <accident ref="accident" />
    </div>
    <!-- <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">评价信息</span>
      </div>
      <comment ref="comment" />
    </div> -->
    <p class="mt20 mb20" style="text-align: center; margin: 0">
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
import { checkcomplete } from '@/api/myService'
import addOrg from '@/views/userData/highRisk/components/add.vue'
import Accident from './components/accident.vue'
import addHolder from './components/addHolder.vue'
import addInsured from './components/addInsured.vue'
import Openmodify from './components/openModify.vue'
import Comment from './components/comment.vue'
import IssuingCompany from './components/issuingCompany.vue'
import WarrantyParam from './components/WarrantyParam.vue'
import { mapMutations, mapGetters } from 'vuex'
import { dictItem } from '@/api/policyManagement'
import SelectOrg from './components/selectOrg.vue'
import { addPolicy, editPolicy } from '@/api/policyManagement'
import addxiangm from './components/addxiangm.vue'
export default {
  name: 'addPolicy',
  components: {
    addHolder,
    addInsured,
    IssuingCompany,
    WarrantyParam,
    Accident,
    Comment,
    addOrg,
    SelectOrg,
    addxiangm,
    Openmodify,
  },
  data() {
    return {
      // disable: false,
      active: 0,
      sameHolder: false,
      hasHolder: false,
      editHolder: false,
      hasInsured: false,
      epoli: false, //控制项目信息按钮隐藏线索
      industryData: [],
      industryOne: '',
      isShow: false, //控制项目信息
      cativeList: {},//项目信息
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
  mounted() {
    const roles = window.sessionStorage.getItem('roles')
    let rolesArr = []
    if (roles != undefined && roles != undefined) {
      console.log(1)
      if (roles.indexOf(',') != -1) {
        rolesArr = roles.split(',')
      } else {
        rolesArr = [roles]
      }

      if (rolesArr.includes('RL1453259613846778543')) {
        this.initOrgData()
        return
      }
    }
  },
  methods: {
    delHolder() {
      // 删除投保人信息，
      this.hasHolder = false
      this.editHolder = false
      this.hasInsured = false
      this.sameHolder = false
      this.$nextTick(() => {
        this.$refs.addHolder.data = {}
      })
      this.$nextTick(() => {
        this.$refs.addInsured.data = {}
      })
    },
    async initOrgData() {
      let res = await checkcomplete()
      if (res.code === '0000') {
        this.hasHolder = true
        this.$nextTick(() => {
          this.$store.commit(
            'policyInfo/organizationEntity',
            res.data.organizationResp
          )
          this.$refs.addHolder.data = res.data.organizationResp
        })
      }
    },
    openXm() {
      this.$refs.addxiangm.dialogFormVisible = true
      console.log(this.cativeList, 'this.cativeListthis.cativeListthis.cativeList');
      this.$refs.addxiangm.ruleForm = this.cativeList
    },
    itemCative(item) {
      this.$forceUpdate() // 解决修改是数据层太多无法修改
      this.cativeList = item
      console.log(this.cativeList, 'cativeList');
    },
    epolicy(item) {
      this.epoli = item
      console.log(item, 'epolicy');
    },
    openSelect() {
      console.log('00-00--')
      this.$refs.selectOrg.dialogFormVisible = true
    },
    openModify() {//修改项目信息组建
      this.$refs.openmodify.dialogFormVisible = true
    },
    projectOen(item) {
      this.cativeList = item
      console.log(this.cativeList, 'this.cativeList');
    },
    addHolder() {
      this.$refs.addOrg.dialogVisible = true
      this.$refs.addOrg.identification = true
    },
    openInsured() {
      this.$refs.addOrg.isInsured = true
      this.$refs.addOrg.dialogVisible = true
    },
    editInsured() {
      this.$refs.addOrg.isInsured = true
      this.$refs.addOrg.dialogVisible = true
      this.$nextTick(() => {
        console.log('0900')
        this.$refs.addOrg.ruleForm = this.insuredInfoParam
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
      // this.disable = e
      if (e == true) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      console.log(e)
      if (e) {
        if (this.hasHolder) {
          let data = JSON.parse(JSON.stringify(this.organizationEntity))
          this.industryOne = data.industryOne
          data.projectList1.map(val => {
            this.cativeList = val
          })
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
        this.$store.commit('policyInfo/insuredInfoParam', data)
        this.$refs.addInsured.data = data
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
      this.isShow = true
      // this.cativeList = this.insuredInfoParam
      console.log(this.insuredInfoParam, 'this.insuredInfoParam');
      this.insuredInfoParam.projectList.map(res => {
        this.cativeList = res
      })
      if (e == '') {
        //获取投保人
        this.editHolder = true
        this.hasInsured = true
        this.$nextTick(() => {
          this.$refs.addInsured.data = this.insuredInfoParam
        })
      } else {
        //获取被保人
        this.editHolder = true
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
      if (this.insuredInfoParam.industryOne == '15') {
        if (this.cativeList.projectName == null) {
          this.$baseMessage('请先填项目信息', 'error')
          return
        }
      }

      if (!this.$refs.IssuingCompany.save()) {
        console.log('这是保险机构信息')
        this.focusError()
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
        console.log(1)
        if (roles.indexOf(',') != -1) {
          rolesArr = roles.split(',')
        } else {
          rolesArr = [roles]
        }

        if (rolesArr.includes('RL1453259613846778543')) {
          console.log(123)
          this.$router.push({
            name: 'MyPreviewPolicy',
          })
          return
        } else {
          let cativeT = true
          this.$router.push({
            name: 'priviewPolicy',
            query: {
              cativeList: this.cativeList,
              cativeT: cativeT
            },
          })
          return
        }
      }
      this.$router.push({
        name: 'priviewPolicy',
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
#addPolicy .el-step__icon {
  width: 26px;
  height: 26px;
  font-size: 16px;
}
</style>
<style lang='scss' scoped>
#addPolicy {
  background-color: #f6f8f9;
  overflow: hidden;
  .emptyBox {
    height: 160px;
    display: flex;

    justify-content: center;
    align-items: center;
  }

  .conBox {
    border-radius: 6px;
    margin-top: 10px;
    overflow: hidden;
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
      border-bottom: 1px solid #e9e9e9;

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

#addPolicy .header {
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