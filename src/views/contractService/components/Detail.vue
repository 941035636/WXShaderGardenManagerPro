<template>
  <div id="Detail">
    <div class="brInfo">
      <el-row class="mb20 mt10">
        <el-col :span="12">
          <span>单位：</span>
          <span class="text-color">{{ detailObj.branchName }}</span>
        </el-col>
        <el-col :span="12">
          <span>客户经理：</span>
          <p style="display: inline">
            <span class="text-color" style="margin: 0 10px">{{
              detailObj.managerName
            }}</span>
          </p>
        </el-col>
      </el-row>
    </div>
    <div class="brInfo mt20">
      <h3 class="title">合同信息</h3>
      <el-row class="mt10">
        <el-col :span="12">
          <span>客户名称：</span>
          <span class="text-color">{{ detailObj.customerName }}</span>
        </el-col>
      </el-row>
      <el-row class="mt10">
        <el-col :span="12">
          <span>合同编号：</span>
          <span class="text-color">{{ detailObj.contractNo }}</span>
        </el-col>
        <el-col :span="12">
          <span>合同期间：</span>
          <span class="text-color"
            >{{ detailObj.contractStartDate }}
            至
            {{ detailObj.contractEndDate }}
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="brInfo mt20">
      <h3 class="title">续约信息</h3>
      <el-row class="mt10" v-if="detailObj.renewalStatus==1||detailObj.renewalStatus==2">
        <el-col :span="8">
          <span>续约状态：</span>
          <span class="text-color">{{ detailObj.renewalStatusName }}</span>
        </el-col>
      </el-row>



      <el-row class="mt10" v-if="detailObj.renewalStatus==2">
        <el-col :span="12">
          <span>合同编号：</span>
          <span class="text-color">{{ detailObj.renewalContractNo }}</span>
        </el-col>
        <el-col :span="12">
          <span>合同期间：</span>
          <span class="text-color"
            >{{ detailObj.renewalContractStartDate }}
            至
            {{ detailObj.renewalContractEndDate }}
          </span>
        </el-col>
      </el-row>


      <el-row class="mt10" v-if="detailObj.renewalStatus==3">
        <el-col :span="24">
          <span>续约状态：</span>
          <span class="text-color">{{ detailObj.firstReasonName }} {{ detailObj.secondReasonCode }}</span>
        </el-col>
        <el-col :span="24">
          <span>客户跟进具体情况：</span>
          <span class="text-color"
            >{{ detailObj.trackInfo }}
          </span>
        </el-col>
      </el-row>


      <el-row class="mt10" v-if="detailObj.renewalStatus==4">
        <el-col :span="24">
          <span>续约状态：</span>
          <span class="text-color">{{ detailObj.firstReasonName }}</span>
        </el-col>
        <el-col :span="24">
          <span>客户跟进具体情况：</span>
          <span class="text-color"
            >{{ detailObj.trackInfo }}
          </span>
        </el-col>
      </el-row>



    </div>
  </div>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      detailObj: {},
    };
  },
  watch: {
    detail: {
      handler(newValue) {
        this.detailObj = newValue;
        console.log("续约详情信息 this.detailObj", this.detailObj);
        console.log("---", JSON.stringify(this.detailObj) != "{}");
      },
      deep: true,
    },
  },
};
</script>

<style lang="less">
#Detail {
  color: #000;
  .brInfo {
    line-height: 50px;
  }
  .borbtm {
    border-bottom: 1px dashed #ccc;
  }
  .title {
    font-weight: 600;
  }
  .text-color {
    color: #000;
  }
  .files {
    span {
      display: block;
      line-height: 30px;
      cursor: pointer;
    }
    span:hover {
      color: blue;
    }
  }
  .ser-text {
    margin: 0 5px;
  }
  .n {
    font-style: normal;
  }
}
</style>