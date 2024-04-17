<template>
  <div id="previewPolicy">
    <div class="header">
      <el-steps process-status="finish" :active="1" simple>
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
      </div>

      <add-holder ref="addHolder" class="mt10" />
    </div>
    <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f14 ml10 mr20">被保人信息</span>
      </div>

      <add-insured ref="addInsured" />
    </div>

    <div class="conBox" v-if="insuredInfoParam.industryOne == '15'">
      <!-- (cativeArr && cativeArr.industryOne == '15') ||
        cativeObj == true ||
        cativeT == true || -->
      <div class="title">
        <span></span>
        <span class="color-blue f14 ml10 mr20">项目信息</span>
      </div>
      <div id="addHolder">
        <!-- 新增时走这个form -->
        <el-form
          v-if="cativeT == true"
          label-position="left"
          label-width="140px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                {{ cativeList.projectName }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="项目地址：">
                <!-- {{ cativeList.provinceName }}/{{ cativeList.cityName }}/{{
                  cativeList.countyName
                }}{{ cativeList.detailAddress }} -->
                {{ cativeList.projectProvinceName }}/{{
                  cativeList.projectCityName
                }}/{{ cativeList.projectCountyName
                }}{{ cativeList.projectDetailAddress }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          v-if="
            (cativeArr && cativeArr.industryOne == '15') || cativeObj == true
          "
          label-position="left"
          label-width="140px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目名称：">
                {{ cativeArr.projectName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col v-if="cativeObj == true" :span="10">
              <el-form-item label="项目地址：">
                {{ cativeArr.provinceName }}/{{ cativeArr.cityName }}/{{
                  cativeArr.countyName
                }}{{ cativeArr.detailAddress }}
              </el-form-item>
            </el-col> -->
            <el-col :span="10">
              <el-form-item label="项目地址：">
                {{ cativeArr.projectProvinceName }}/{{
                  cativeArr.projectCityName
                }}/{{ cativeArr.projectCountyName
                }}{{ cativeArr.projectDetailAddress }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="conBox">
      <div class="title">
        <span></span>
        <span class="color-blue f14 ml10 mr20">保单信息</span>
      </div>
      <policy-info ref="policyInfo" />
    </div>
    <div class="mb20 conBox">
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
      <el-form class="mt20 ml10" label-position="right" label-width="120px">
        <el-form-item label="投保满意度">
          <el-rate
            class="mt5"
            :value="comment"
            :texts="texts"
            disabled
            :text-color="'#f7ba2a'"
            show-text
          ></el-rate>
        </el-form-item>
      </el-form>
    </div> -->
    <p class="mt10" style="text-align: center; margin: 0">
      <el-button class="mr20" @click="backLast">返回修改</el-button>
      <el-button type="primary" @click="nextStep">确认提交</el-button>
    </p>
  </div>
</template>

<script>
import Accident from './components/accident'
import addHolder from '../addPolicy/components/addHolder.vue'
import addInsured from '../addPolicy/components/addInsured.vue'
import Comment from '../addPolicy/components/comment.vue'
import policyInfo from './components/policyInfo.vue'
import { mapMutations, mapGetters } from 'vuex'
import { dictItem } from '@/api/policyManagement'
import { editOrg } from '@/api/userDataManagement'
import { addPolicy, editPolicy } from '@/api/policyManagement'

export default {
  name: 'priviewPolicy',
  components: {
    addHolder,
    addInsured,
    Comment,
    policyInfo,
    Accident,
  },
  data() {
    return {
      comments: null,
      userCode: '',
      texts: ['很差', '差', '一般', '好', '很好'],
      cativeList: {},//项目信息
      cativeArr: {},//修改项目信息
      // cativeObj: true
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
      projectList1: 'formDatas/projectList1',
      orgID: 'formDatas/id'
    }),
  },
  created() {
    this.cativeList = this.$route.query.cativeList
    this.cativeT = this.$route.query.cativeT
    this.cativeArr = this.$route.query.cativeArr
    this.cativeObj = this.$route.query.cativeObj
    let data = JSON.parse(JSON.stringify(this.organizationEntity))
    if (data.projectList1) {
      data.projectList1.map(element => {
        this.cativeArr = element;
      });
    }
    console.log(this.cativeList, 'this.cativeList1111');
    console.log(this.cativeT, 'this.cativeT ');
    console.log(this.cativeObj, 'this.cativeObj');
    console.log(this.cativeArr, 'this.cativeArr222222');
  },
  activated() {
    if (this.$route.query.code != this.userCode) {
      // this.getInit()
      console.log('activated')
      this.userCode = this.$route.query.code
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$refs.addHolder.data = this.organizationEntity
      this.$refs.addInsured.data = this.insuredInfoParam
      this.$refs.policyInfo.data = this.warrantyParam
      this.$refs.policyInfo.Data = this.insurersInfo
      this.$refs.accident.data = this.accidentRate
    },
    async backLast() {
      await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
      this.$router.go(-1)
    },
    async nextStep() {
      this.$confirm('即将提交, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        if (this.insuredInfoParam.industryOne != '15') {
          console.log(this.insuredInfoParam, 'this.insuredInfoParam');
          this.insuredInfoParam.projectName = ''
          this.insuredInfoParam.projectProvinceCode = ''
          this.insuredInfoParam.projectProvinceName = ''
          this.insuredInfoParam.projectCityCode = ''
          this.insuredInfoParam.projectCityName = ''
          this.insuredInfoParam.projectCountyCode = ''
          this.insuredInfoParam.projectCountyName = ''
          this.insuredInfoParam.projectDetailAddress = ''
        } else if (this.cativeArr) {
          this.insuredInfoParam["projectName"] = this.cativeArr.projectName
          this.insuredInfoParam["projectProvinceCode"] = this.cativeArr.projectProvinceCode;
          this.insuredInfoParam["projectProvinceName"] = this.cativeArr.projectProvinceName;
          this.insuredInfoParam["projectCityCode"] = this.cativeArr.projectCityCode;
          this.insuredInfoParam["projectCityName"] = this.cativeArr.projectCityName;
          this.insuredInfoParam["projectCountyCode"] = this.cativeArr.projectCountyCode;
          this.insuredInfoParam["projectCountyName"] = this.cativeArr.projectCountyName;
          this.insuredInfoParam["projectDetailAddress"] = this.cativeArr.projectDetailAddress;
        } else {
          this.insuredInfoParam["projectName"] = this.cativeList.projectName
          this.insuredInfoParam["projectProvinceCode"] = this.cativeList.projectProvinceCode;
          this.insuredInfoParam["projectProvinceName"] = this.cativeList.projectProvinceName;
          this.insuredInfoParam["projectCityCode"] = this.cativeList.projectCityCode;
          this.insuredInfoParam["projectCityName"] = this.cativeList.projectCityName;
          this.insuredInfoParam["projectCountyCode"] = this.cativeList.projectCountyCode;
          this.insuredInfoParam["projectCountyName"] = this.cativeList.projectCountyName;
          this.insuredInfoParam["projectDetailAddress"] = this.cativeList.projectDetailAddress;

        }




        let data = {
          accidentRate: this.accidentRate,
          comment: this.comment,
          insuredInfoParam: this.insuredInfoParam,
          insurersInfo: this.insurersInfo,
          organizationEntity: this.organizationEntity,
          warrantyParam: this.warrantyParam,
          orgID: this.orgID,
        }
        if (this.$route.query.id) {
          if (data.orgID != '') {
            let res1 = await editOrg(data.organizationEntity, data.organizationEntity.id)
            if (res1.code == '0000') {
              this.$store.commit('formDatas/id', '')
            }
          }
          let res = await editPolicy(data, this.$route.query.id)
          if (res.code == '0000') {
            this.$baseMessage('修改保单成功', 'success')
            await this.$store.dispatch('tabsBar/delVisitedRoute', {
              path: '/policy/update',
            })
            await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
            // this.$router.push({
            //   path: 'finishWork',
            // })

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
                  name: 'MyFinishWork',
                })
                return
              } else {
                this.$router.push({
                  name: 'finishWork',
                })
                return
              }
            }
            this.$router.push({
              name: 'finishWork',
            })
          }
        } else {
          let res = await addPolicy(data)
          if (res.code === '0000') {
            // let res = await editOrg(data.organizationEntity, data.organizationEntity.id)
            // if (res.code == '0000') {
            // }
            await this.$store.dispatch('tabsBar/delVisitedRoute', this.$route)
            await this.$store.dispatch('tabsBar/delVisitedRoute', {
              path: '/policy/addPolicy',
            })
            // MyFinishWork

            const roles = window.sessionStorage.getItem('roles')
            let rolesArr = []
            if (roles.indexOf(',') != -1) {
              rolesArr = roles.split(',')
            } else {
              rolesArr = [roles]
            }

            if (rolesArr.includes('RL1453259613846778543')) {
              this.$router.push({
                name: 'MyFinishWork',
              })
            } else {
              this.$router.push({
                name: 'finishWork',
              })
            }
            // this.$router.push({
            //   path: 'finishWork',
            // })
            this.$baseMessage('提交成功', 'success')
          }
        }
      })
    },
  },
}
</script>

<style lang='scss'>
#previewPolicy .el-form-item__label {
  color: #919191;
}

#previewPolicy .el-step__icon {
  width: 26px;
  height: 26px;
  font-size: 16px;
}

#previewPolicy .el-form-item {
  margin-bottom: 6px;
}
</style>
<style lang='scss' scoped>
#previewPolicy {
  background-color: #f6f8f9;
  padding-bottom: 20px;

  .emptyBox {
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .conBox {
    border-radius: 6px;
    margin-top: 10px;
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

#previewPolicy .header {
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