<template>
  <div id="planSummary">
    <el-form label-position="left" label-width="140px">
      <el-row v-if="planType == '01'">
        <el-col :span="8">
          <el-form-item label="服务形式：">
            <span v-if="planDetail.serviceType == 1">线上</span>
            <span v-if="planDetail.serviceType == 2">线下</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="服务企业清单：">
            共{{ corpList.length }}家企业
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="参加人员数量：">
            <span>{{ planDetail.personNum }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="planType == '03'" class="border-bottom">
        <el-col :span="20">
          <el-form-item label="检查结果：">
            <span>
              本次服务共检查：
              <span class="color-orange">{{ planDetail | theSum }}</span>
              项
            </span>
            <span class="color-green ml10">符合</span>
            <span class="ml10">{{ planDetail.unAccordNum }} 项</span>
            <span class="color-orange ml10">不符合</span>
            <span class="ml10">{{ planDetail.accordNum }} 项</span>
            <span class="color-gray-5 ml10">不涉及</span>
            <span class="ml10">{{ planDetail.unRelate }} 项</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="border-bottom" v-if="planType == '04'">
        <el-col :span="9">
          <el-form-item label="安全评分：">
            {{ planDetail.safetyScore }}
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="安全等级：">
            {{
              planDetail.safetyLevel
                ? getStrEnumAll.AccidentSafetyLevelEnum[planDetail.safetyLevel]
                    .label
                : ''
            }}
          </el-form-item>
          <!-- 
          <el-form-item
            v-for="item in getStrEnumAll.AccidentSafetyLevelEnum"
            :key="item.strCode"
            label="安全等级"
          >
            {{ item.label }}
          </el-form-item> -->
        </el-col>
      </el-row>
      <el-row class="border-bottom" v-if="planType == '05'">
        <el-col :span="9">
          <el-form-item label="服务方式：">
            <span v-if="planDetail.serviceType == 1">应急预案编制</span>
            <span v-if="planDetail.serviceType == 2">应急救援演练</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="border-bottom" v-if="planType == '06'">
        <el-col :span="9">
          <el-form-item label="服务方式：">
            <span v-if="planDetail.serviceType == 0">
              组织安全技术交流研讨会
            </span>
            <span v-if="planDetail.serviceType == 1">
              推介安全生产科技成功和先进技术装备
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="border-bottom" v-if="planType == '07'">
        <el-col :span="8">
          <el-form-item label="服务形式：">
            <span v-if="planDetail.serviceType == 1">线上</span>
            <span v-if="planDetail.serviceType == 2">线下</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="planType != '01'">
        <el-col :span="18">
          <el-form-item label="服务情况说明：">
            <span>{{ planDetail.preContent }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <div class="fb mt20 mb20">服务照片</div>
        <div v-if="summaryFile && summaryFile.length">
          <div v-for="(item, key) in summaryFile" :key="key" class="img-box">
            <el-image
              :src="item.imgUrl"
              :alt="item.name"
              :preview-src-list="[item.imgUrl]"
            ></el-image>
          </div>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moreCon from '@/components/moreCon'
import { mapGetters } from 'vuex' //枚举类
export default {
  components: {
    moreCon,
  },
  data() {
    return {
      data: {},
    }
  },
  filters: {
    theSum(row) {
      let sum =
        Number(row.unAccordNum) + Number(row.accordNum) + Number(row.unRelate)
      return sum || 0
    },
  },
  props: {
    planType: {
      type: String,
      required: true,
      default: () => {
        return '01'
      },
    },
    corpList: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    summaryFile: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    planDetail: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  mounted() {},
}
</script>

<style lang='scss' scoped>
#planSummary {
  width: 100%;
  padding: 10px 30px 10px 30px;
  box-sizing: border-box;
  .img-box {
    width: 150px;
    height: 150px;
    display: inline-block;
    margin-left: 10px;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang='scss'>
#planSummary {
  .border-bottom {
    border-bottom: 1px solid #e9e9e9;
  }
  .el-form-item {
    margin-bottom: 6px;
  }
  .el-form-item__label {
    color: #919191;
  }
  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>