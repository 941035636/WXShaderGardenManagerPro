<template>
  <el-dialog
    title="项目转移"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="55%"
    @close="close"
    @open="initData"
  >
    <p class="mb20">原项目申请人</p>

    <el-row class="mb10">
      <el-col :span="8">申请人：{{ transferList.commissionerName }} </el-col>
      <el-col :span="8">
        登录账号：{{ transferList.commissionerAccount }}</el-col
      >
      <el-col :span="8">
        所属分支机构：{{ transferList.orgType }}-{{ transferList.orgName }}
      </el-col>
    </el-row>
    <p class="color-red mb10">转移{{ Num }}条数据</p>

    <p class="divder"></p>

    <p class="mb10">新项目申请人</p>
    <p class="mb10">{{ transferList.orgType }}-{{ transferList.orgName }}</p>
    <el-table
      :data="transferList.userCateoryRespList"
      border
      header-row-class-name="headName"
      :cell-style="{ 'text-align': 'left' }"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        prop="userName"
        label=""
        width="50"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.row">
            <span style="display: none">1</span></el-radio
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="userLoginAccount"
        label="登录账号"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="userName"
        label="姓名"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column prop="userCode" label="用户编码"> </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="warning" round @click="submit">确认提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Transfer } from "@/service/accidentManagement";
export default {
  name: "relateMember",
  data() {
    return {
      dialogVisible: false,
      type: "",
      radio: {},
      orgName: "",
      ruleForm: {
        userName: "", // 用户姓名
        userLoginId: "", //登录账号
      },
      pn: 1,
      ps: 10,
      total: 0,
      servicename: "",
      id: "",
      tableList: [],
      userCode: "",
    };
  },
  props: {
    transferList: {
      type: Object,
      required: true,
      default: {},
    },
    transferNum: {
      type: Array,
      required: true,
      default: [],
    },
  },
  computed: {
    Num() {
      let num = 0;
      num = this.transferNum.length;
      return num;
    },
  },
  created() {},
  methods: {
    async initData() {},
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#b8d9fd;text-align:left;color:#0050b3";
      } else {
        return "";
      }
    },
async submit(){
  if(!this.radio.id){
    this.$message.error('请选择后提交！')
  }else{
    let arr = []
     this.transferNum.map((item)=>{
      arr.push(item.id)
    })
    let data = {
      oldCommissionerCode : this.transferList.commissionerCode,
      oldCommissionerName : this.transferList.commissionerName,
      newCommissionerCode : this.radio.userCode,
      newCommissionerName : this.radio.userName,
      ids:arr
    }
    let res = await Transfer(data)
    if(res.code =='0000'){
      this.$message.success('项目转移成功')
      this.dialogVisible=false;
      this.$emit('getMsg','刷新')
    }
  }
console.log(this.radio,'++++++');
},
    clear() {
      this.radio = {};
    },
    close() {
      this.clear();
    },
  },
};
</script>

<style lang="less">
.w280 {
  width: 280px;
}
.divder {
  height: 1px;
  border-bottom: 1px dashed #ccc;
  margin: 10px auto;
  width: 100%;
}
</style>
