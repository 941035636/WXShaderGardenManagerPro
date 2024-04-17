<template>
  <el-dialog
    id="companyAdd"
    title="详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="80%"
    append-to-body
    @open="getInit"
  >
    <div id="highRiskDetails">
      <el-form label-position="left" label-width="142px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业名称">
              {{ data.custFullName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社会信用代码：">
              {{ data.blCode }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在区域：">
              {{ data.provinceName }}/{{ data.cityName }}/{{
                data.countyName
              }}/{{ data.detailAddress }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="行业类型：">
              <span v-if="manageName && manageName.length > 13">
                {{ manageName.slice(0, 13) }}...
                <el-popover placement="top" width="300" v-model="visible2">
                  <p>{{ manageName }}</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="visible2 = false"
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

              <span v-else>{{ manageName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国民经济行业：">
              <span v-if="industryName && industryName.length > 13">
                {{ industryName.slice(0, 13) }}...
                <el-popover placement="top" width="300" v-model="visible4">
                  <p>{{ industryName }}</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="visible4 = false"
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

              <span v-else>{{ industryName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型：">
              {{ data.businessType == '01' ? '应保企业' : '鼓励企业' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营状态：">
              {{ status }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属年份：">
              {{ data.belongToYear }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否有效：">
              {{ data.dataStatus == true ? '有效' : '无效' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否在保：">
              {{ data.insureStatus == 1 ? '是' : '否' }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { getdetails } from '@/api/userDataManagement'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      dialogVisible: false,
      userCode: '',
      data: {},
      visible4: false,//国民经济行业的显示隐藏
      visible2: false,//行业类型的显示隐藏
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',
      getStrEnumAll: 'enums/getStrEnumAll',
      branchId: 'user/branchId',
      accountType: 'user/accountType',
    }),
    status() {
      if (this.data.orgStatus) {
        console.log(this.data.orgStatus, 'this.data.orgStatus');
        return this.getStrEnumAll.BusinesStatus.find((item) => {
          console.log(item, 'statusstatusstatusstatus');
          return item.code == this.data.orgStatus
        }).label
      } else {
        return '--'
      }
    },
    industryName() { //国民经济行业
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
    manageName() { //行业类型
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
      let res = await getdetails(this.userCode)
      if (res.code == '0000') {
        this.data = res.data
      }
    },

  },
}
</script>

<style lang="scss" scoped>
#highRiskDetails {
  background-color: #fff;
  width: 90%;
  margin: 0 auto;
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
<style >
#highRiskDetails .el-form-item__label {
  color: #919191;
}
#highRiskDetails .el-form-item {
  margin-bottom: 5px;
}
</style>
