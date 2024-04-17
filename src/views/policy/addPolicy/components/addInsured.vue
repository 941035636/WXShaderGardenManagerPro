<template>
  <div id="addInsured">
    <el-form label-position="left" label-width="142px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业名称：">
            {{ data.custFullName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="社会信用代码：">
            {{ data.blCode }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="营业执照：">
            <span
              v-if="data.businessLicenseFileId"
              @click="checkBsp"
              class="downloadfile"
            >
              查看附件
            </span>
            <span v-else>--</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="经营地址：">
            <more-con :data="address" :length="13" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="详细地址：">
            <span v-if="data.detailAddress && data.detailAddress.length > 13">
              {{ data.detailAddress.slice(0, 13) }}...
              <el-popover placement="top" width="300" v-model="visible1">
                <p>{{ data.detailAddress }}</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="visible1 = false"
                  >
                    确定
                  </el-button>
                </div>
                <el-button
                  type="text"
                  class="downloadfile ml5"
                  slot="reference"
                >
                  更多
                </el-button>
              </el-popover>
            </span>

            <span v-else>{{ data.detailAddress }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属行业：">
            <more-con :data="manageName" :length="13" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="国民经济行业：">
            <more-con :data="industryName" :length="13" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="从业人员总数：">
            {{ data.employeeNum }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年营业额/工程造价：">
            {{ data.annualTurnover }}
          </el-form-item>
        </el-col>
      </el-row>

      <p class="stitle">法人代表/主要负责人</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名：">
            {{ data.lawMan }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话：">
            {{ data.lawManPhone }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="常用邮箱：">
            {{ data.securityChargerEmail || '--' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="应急值班电话：">
            {{ data.dutyTelephone || '--' }}
          </el-form-item>
        </el-col>
      </el-row>
      <p class="stitle">安全负责人</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名：">
            {{ data.securityCharger }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话：">
            {{ data.securityChargerPhone }}
          </el-form-item>
        </el-col>
      </el-row>
      <p class="stitle">安全生产许可证</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="许可证号：">
            {{ data.safetyProdLicense || '--' }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="许可证附件：">
            <span
              v-if="data.safetyProdLicenseFileId"
              @click="checkLsp"
              class="downloadfile"
            >
              查看附件
            </span>
            <span v-else>--</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="许可证有效期：">
            {{
              data.safetyProdLicenseStart
                ? data.safetyProdLicenseStart
                : '—' | setTime
            }}
            至
            {{
              data.safetyProdLicenseEnd
                ? data.safetyProdLicenseEnd
                : '—' | setTime
            }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="标准化等级：">
            {{ level }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moreCon from '@/components/moreCon'
import { mapGetters } from 'vuex'
import { getFile } from '@/api/resources.js'
export default {
  components: { moreCon },
  data() {
    return {
      visible1: false,
      data: {},
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
      result =
        this.data.provinceName +
        ' / ' +
        this.data.cityName +
        ' / ' +
        this.data.countyName

      return result
    },
    industryName() {
      let name = []
      let result = ''
      if (this.data.economyNameOne) {
        result = this.data.economyNameOne + '/' + this.data.economyNameTwo
      } else if (this.data.sysDictItemEntitys) {
        this.data.sysDictItemEntitys.forEach((item) => {
          name.unshift(item.itemText)
        })
        result = name.join(' / ')
      } else {
        result = this.data.industryOneName + '/' + this.data.industryTwoName
      }
      return result
    },
    level() {
      if (this.data.safetyProdLevel) {
        return this.getStrEnumAll.SafetyLevelEnum.find((item) => {
          return item.strCode == this.data.safetyProdLevel //2022.12.27  item.code修改城item.strCode
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
      if (this.data.industryOneName) {
        result = this.data.industryOneName + '/' + this.data.industryTwoName
      } else if (this.data.administrations) {
        this.data.administrations.forEach((item) => {
          name.push(item.itemText)
        })
        result = name.join(' / ')
      } else {
        result = this.data.economyNameOne + '/' + this.data.economyNameTwo
      }
      return result
    },
  },
  methods: {
    checkBsp() {
      console.log(this.data, 'data')
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
  },
}
</script>

<style lang='scss' scoped>
#addInsured {
  border-radius: 6px;
  background-color: #fff;
  width: 100%;
  padding: 30px 30px 10px 50px;
  box-sizing: border-box;
  .stitle {
    font-weight: bold;
    color: #000;
  }
  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
<style lang='scss'>
#addInsured {
  .el-form-item {
    margin-bottom: 6px;
  }
  .el-form-item__label {
    color: #919191;
  }
}
</style>