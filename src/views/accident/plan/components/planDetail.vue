<template>
  <div id="details">
    <div class="row">
      <h3 style="font-weight:600;margin-bottom:10px">{{planDetail.preFirstTypeName}}{{planDetail.preSecondTypeName != ''?'-'+planDetail.preSecondTypeName:''}}</h3>
      <el-row type="flex">
        <el-col :span="8">
          <span class="title">服务时间：</span>
          <span>{{ planDetail.startTime | format("YYYY-MM-DD") }}</span>
          <span>至</span>
          <span>{{ planDetail.endTime | format("YYYY-MM-DD") }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">服务人员：</span>
          <!-- <span>无</span> -->
          <span v-for="(item, key) in serviceList" :key="key">
            {{ key !== 0 ? '、' : '' }}
            {{ item.name }}
          </span>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
      <el-row type="flex" class="row-bg mt10">
        <el-col :span="16">
          <span class="title">服务描述：</span>
          <span>{{ planDetail.checkRemark }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg">
        <el-col :span="16" style="display:flex">
          <span class="title">服务企业：</span>
          <el-table :data="tableList" border :header-cell-style="getRowClass">
            <el-table-column label="企业名称" prop="custFullName"></el-table-column>
            <el-table-column label="统一社会信用代码" prop="blCode"></el-table-column>
            <!-- <el-table-column label="行业类型" prop="sysDictItemEntitysName"></el-table-column> -->
            <el-table-column label="所在地区" prop="areaName"></el-table-column>
            <el-table-column label="联系人" prop="contactName"></el-table-column>
            <el-table-column label="联系方式" prop="contactPhone"></el-table-column>
          </el-table>
        </el-col>
        <!-- <el-col :span="8">
          <span class="title">企业名称：</span>
          <span class="color-blue">{{ planDetail.corporationName }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">行业类型：</span>
          <span>
            {{ planDetail.industryOneName }}
            {{ planDetail.industryTwoName }}
            {{ planDetail.industryThreeName }}
            {{ planDetail.industryFourName }}
          </span>
        </el-col>
        <el-col :span="8">
          <span class="title">所在地区：</span>
          <span class="color-blue">
            {{ planDetail.provinceCode }}
            {{ planDetail.cityCode }}
            {{ planDetail.countryCode }}
            {{ planDetail.detailAddress }}
          </span>
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
  import { smalltoBIG } from '@/util/validate'
  export default {
    name: 'ServiceAdd',
    components: {},
    props: {
      planDetail: {
        type: Object,
        required: true,
        default: () => {
          return {}
        },
      },
      organizationResp: {
        // type: Object,
        required: true,
        default: () => {
          return {}
        },
      },
      serviceList: {
        type: Array,
        required: true,
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        data: {},
      }
    },
    computed: {
      bigMoney() {
        return smalltoBIG(this.planDetail.accidentPreFund) || '零'
      },
      tableList(){
        if(this.organizationResp && this.organizationResp.id) {
          let list = []
          // this.organizationResp.sysDictItemEntitys.forEach((item)=>{
          //   list.unshift(item.itemText)
          // })
          let obj = JSON.parse(JSON.stringify(this.organizationResp))
          obj.sysDictItemEntitysName = list.join('、')
          obj.areaName = `${obj.provinceName}${obj.cityName}${obj.countyName}${obj.streetName}`
          return [obj]
        } else {
          return []
        }
        
      },
    },
    mounted() {},
    methods: {
      // 设置表头样式
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
    },
  }
</script>

<style scoped lang="less">
  #details {
    margin-top: 20px;
    .row {
      margin-left: 30px;
      padding-top: 20px;
      .row-bg {
        margin-bottom: 20px;
        .project-type {
          display: inline-block;
          padding: 4px 10px;
          background-color: #ffa940;
          color: #fff;
          border-radius: 20px;
        }
      }
    }
  }
</style>
