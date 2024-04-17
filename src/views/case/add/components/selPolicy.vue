<template>
  <div id="selectPolicy">
    <el-dialog
      class="selOrg"
      title="选择保单"
      :visible.sync="dialogFormVisible"
      width="900px"
      @close="close"
    >
      <div class="serchBox">
        <el-select size="small" class="w120 mr10" v-model="type">
          <el-option label="被保人名称" value="1"></el-option>
          <el-option label="保单号" value="2"></el-option>
        </el-select>
        <el-input
          class="w300"
          v-if="type == 1"
          placeholder="请输入企业名称"
          v-model="FormData.name"
        ></el-input>
        <el-input
          v-else
          class="w300"
          placeholder="请输入保单号"
          v-model="FormData.policyNo"
        ></el-input>
        <el-button class="ml20 mr20" size="mini" @click="search" type="primary">
          查询
        </el-button>
        <span class="orgTip1">
          <i class="el-icon-warning"></i>
          请选择匹配的查询条件
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        header-row-class-name="headName"
        :header-cell-style="getRowClass"
        style="width: 90%"
      >
        <el-table-column align="center" label="选择" width="65">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index">
              <div></div>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="保单信息">
          <template slot-scope="scope">
            <el-row class="mt8 mb8">
              <el-col v-if="scope.row.custFullName" :span="18">
                <span class="fb" style="color: #096dd9">
                  <TipsText :text="scope.row.custFullName" :length="14" />
                </span>
              </el-col>
            </el-row>
            <el-row class="mt8 mb8">
              <el-col :span="13">
                <span class="color-gray-3">保险期间：</span>
                <span>
                  {{ scope.row.startTime | setTime }} 00时 至
                  {{ scope.row.endTime | setTime }} 24时
                </span>
              </el-col>
              <el-col :span="11">
                <span class="color-gray-3">保单号：</span>
                <span>{{ scope.row.policyNo }}</span>
              </el-col>
            </el-row>

            <el-row class="mt8 mb8">
              <el-col v-if="scope.row.issuingCompanyName" :span="13">
                <span class="color-gray-3">保险机构：</span>
                <span>
                  <TipsText :text="scope.row.issuingCompanyName" :length="10" />
                </span>
              </el-col>
              <el-col v-if="scope.row.issuingCompanyName" :span="11">
                <span class="color-gray-3">所属行业：</span>
                <span v-if="scope.row.industryNameTwo">
                  {{ scope.row.industryNameTwo }}
                </span>
                <span v-else>--</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="13">
                <span class="color-gray-3">保费：</span>
                <span class="color-f45f5f">￥{{ scope.row.actualPrem }}</span>
              </el-col>
              <el-col :span="11">
                <span class="color-gray-3">保单状态：</span>
                <span v-if="scope.row.policyStatus == '00'" class="color-blue">
                  待生效
                </span>
                <span v-if="scope.row.policyStatus == '01'" class="color-green">
                  保障中
                </span>
                <span
                  v-if="scope.row.policyStatus == '02'"
                  class="color-gray-3"
                >
                  已过期
                </span>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="FormData.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { getPolicyList } from '@/api/policyManagement'
export default {
  name: 'InsuranceFactor',
  data() {
    return {
      dialogFormVisible: false,
      type: '1',
      radio: null,
      total: 0,
      tableData: [],
      FormData: {
        name: '',
        policyNo: '',
        pn: 1,
        ps: 5,
      },
    }
  },
  methods: {
    handleCurrentChange(pn) {
      this.FormData.pn = pn
      this.search()
    },
    async search() {
      if (!this.FormData.name && !this.FormData.policyNo) {
        this.$baseMessage('请先输入查询信息', 'error')
        return
      }
      let res = await getPolicyList(this.FormData)
      if (res.code == '0000') {
        this.tableData = res.list
        this.total = res.total
      }
    },
    close() {
      this.$nextTick(() => {
        this.FormData = {
          name: '',
          policyNo: '',
          pn: 1,
          ps: 5,
        }
        this.radio = null
        this.tableData = []
      })
    },

    confirm() {
      console.log(this.radio, 'radio')
      let data = {}
      if (this.radio === 0) {
        data = this.tableData[0]
      } else if (this.radio) {
        data = this.tableData[this.radio]
      } else {
        this.$baseMessage('请先选择保单', 'error')
        return
      }
      this.$emit('getMsg', data)
      this.dialogFormVisible = false
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:center;'
      } else {
        return ''
      }
    },
    cancle() {
      this.form = {}

      this.dialogFormVisible = false
    },
  },
}
</script>

<style lang='scss' >
#selectPolicy .el-dialog__body {
  padding-left: 40px;
}
.serchBox {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .orgTip1 {
    color: #34c697;

    i {
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
.el-table .headName .cell {
  font-weight: bold;
}
</style>
