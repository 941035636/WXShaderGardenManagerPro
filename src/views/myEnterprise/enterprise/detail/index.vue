<template>
  <div id="EnterpriseListDeatil">
    <el-dialog
      id="EnterpriseListDialog"
      title="企业资料"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="80%"
      append-to-body
      @open="getInit"
      @close="close"
    >
      <el-form label-position="left" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业名称：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社会信用代码：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业执照：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营地址：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属行业：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="国民经济行业：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="从业人员总数：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年营业额/工程照价：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="经营状态：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营范围：">
              某某危险化学品有限公司
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle-title">法人代表/主要负责人</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名：">张三</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">1589369898</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="常用邮箱：">---</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应急值班电话：">
              <!-- {{ data.dutyTelephone || '--' }} -->
              1589366882
            </el-form-item>
          </el-col>
        </el-row>
        <p class="stitle-title">安全负责人</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名：">李四</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">15893368525</el-form-item>
          </el-col>
        </el-row>
        <p class="stitle-title">安全生产许可证</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="许可证号：">
              485645645646546564564
              <!-- {{ data.safetyProdLicense || '--' }} -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="许可证附件：">
              <!-- v-if="data.safetyProdLicenseFileId" -->
              <span @click="checkLsp" class="downloadfile">查看附件</span>
              <!-- <span v-else>--</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="许可证有效期：">
              2020-01-01 至 2023-12-12
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="标准化等级：">未达标</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center">
        <el-button style="color: #096dd9" @click="modify">修改资料</el-button>
      </div>
    </el-dialog>
    <modifyDetail ref="modifyDetail" />
  </div>
</template>
<script>
import modifyDetail from '../modify/index'
export default {
  components: {
    modifyDetail,
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  methods: {
    async getInit() {},
    close() {},
    modify() {
      this.$refs.modifyDetail.dialogVisible = true
    },
  },
}
</script>
<style lang="scss" scpoed>
#EnterpriseListDeatil {
}
</style>
<style lang='scss'>
#EnterpriseListDialog {
  .el-form-item__label {
    color: #919191;
  }
  .stitle-title {
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