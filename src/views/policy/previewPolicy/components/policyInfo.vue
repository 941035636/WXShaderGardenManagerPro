<template>
  <div id="policyInfo">
    <el-form label-position="left" label-width="140px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="保险期间：">
            {{ data.startTime }} 至 {{ data.endTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保险机构：">
            {{ Data.issuingCompanyName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="保单号：">
            {{ data.policyNo }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投保单号：">
            {{ data.applicationFormCode }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="实收保费：">
            <span class="color-red">￥{{ data.actualPrem }}元</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="累计责任限额：">
            {{ data.limitValue }}万元
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="保单影印件：">
            <span @click="checkLsp" class="downloadfile">查看附件</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签单日期：">
            {{ data.signTime | setTime }}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="bigTable">
        <ul class="top">
          <li>扩展信息</li>
          <li>
            <el-form-item label="基础保费">
              <span v-if="data.prem">￥{{ data.prem }}</span>
              <span v-else>--</span>
            </el-form-item>
            <el-form-item label="费率调整因子">
              <span v-if="data.rateFactor">{{ data.rateFactor }}</span>
              <span v-else>--</span>
            </el-form-item>
            <el-form-item label="投保方式">
              <span v-if="data.premTypeRemark">
                {{ data.premTypeRemark }}
              </span>
              <span v-else>--</span>
            </el-form-item>
            <el-form-item label="投保数量">
              <span v-if="data.insureNumRemark">
                {{ data.insureNumRemark }}
              </span>
              <span v-else>--</span>
            </el-form-item>
          </li>
        </ul>
        <ul class="bottom">
          <li>共保体信息</li>
          <li>
            <div v-for="(item, index) in Data.policyInsuredInfos" :key="index">
              <span>
                <TipsText :text="item.issuingCompanyName" :length="10" />
              </span>
              <span>{{ item.premiumRate }}%</span>
            </div>
          </li>
        </ul>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getFile } from '@/api/resources.js'
import TipsText from '@/components/TipsText'
import { mapGetters } from 'vuex'
export default {
  components: {
    TipsText,
  },
  data() {
    return {
      data: {},
      Data: {},
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',
      getStrEnumAll: 'enums/getStrEnumAll',
      branchId: 'user/branchId',
      accountType: 'user/accountType',
    }),
  },

  methods: {
    checkLsp() {
      console.log(this.data, '---==00')
      this.$confirm('确认下载该文件？')
        .then(async (_) => {
          let id = this.data.fileRecordEntitys[0].id
          console.log(id, '00909900')
          let res = await getFile('/files/downloadfile/' + id)
          console.log(res, 'res')
        })
        .catch((_) => {})
    },
  },
}
</script>

<style lang='scss' scoped>
#policyInfo {
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
  .bigTable {
    border-radius: 5px;
    width: 800px;
    li {
      list-style: none;
      padding-left: 20px;
    }
    .top {
      border: 1px solid #ccc;
      display: flex;
      margin-bottom: 0;
      padding-left: 0;
      li:first-child {
        background-color: #e6f7ff;
        display: flex;
        width: 120px;
        padding-left: 10px;
        align-items: center;
        color: #096dd9;
        font-weight: bold;
      }
    }
    .bottom {
      margin: 0;
      border: 1px solid #ccc;
      border-top: none;

      display: flex;

      padding-left: 0;
      li:first-child {
        background-color: #e6f7ff;
        display: flex;
        width: 120px;
        padding: 30px 0 30px 10px;
        align-items: center;
        color: #096dd9;
        font-weight: bold;
      }
      li:last-child {
        display: flex;
        flex-direction: column;
        width: 60%;
        padding: 5px 20px;
        div {
          flex: 1;
          line-height: 32px;
          height: 32px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
<style>
.bigTable .el-form-item {
  margin: 8px 0;
}
</style>