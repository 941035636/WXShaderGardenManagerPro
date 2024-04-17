<template>
  <div id="issuingCompany">
    <el-form
      ref="ruleForm"
      label-position="right"
      label-width="120px"
      :model="FormData"
      :rules="rules"
    >
      <div class="company">
        <div class="mainCon">
          <el-form-item prop="issuingCompanyCode" label="出单公司">
            <el-select
              v-model="FormData.issuingCompanyCode"
              class="w300 mr20"
              filterable
              placeholder="请选择"
              @change="slcName"
            >
              <el-option
                v-for="item in companyList"
                :key="item.orgCode"
                :label="item.orgName"
                :value="item.orgCode"
              ></el-option>
            </el-select>
            <span class="fb mr10">是否共保体</span>

            <el-switch
              @change="changeOther"
              v-model="FormData.isCoinsurance"
            ></el-switch>
          </el-form-item>
          <br />
          <div class="companyTable" v-if="FormData.isCoinsurance">
            <el-button
              @click="dialogFormVisible = true"
              class="mb10"
              style="margin-left: 120px"
              size="mini"
              type="primary"
            >
              <i class="f16 el-icon-circle-plus-outline"></i>
              新增
            </el-button>
            <br />
            <el-form-item prop="policyInsuredInfos">
              <el-table
                :summary-method="getSummaries"
                show-summary
                ref="table"
                class="sum"
                :header-cell-style="getRowClass"
                :cell-style="{ 'text-align': 'left' }"
                :data="FormData.policyInsuredInfos"
                border
                style="width: 80%"
              >
                <el-table-column
                  width="50"
                  type="index"
                  label="序号"
                ></el-table-column>
                <el-table-column prop="underwriteType" label="类型">
                  <template slot-scope="scope">
                    {{ scope.row.underwriteType ? '首席' : '--' }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="issuingCompanyName"
                  label="保险机构"
                ></el-table-column>
                <el-table-column prop="premiumRate" label="承保比例">
                  <template slot-scope="scope">
                    <span>{{ scope.row.premiumRate }}%</span>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      class="deleteBtn"
                      @click="companyDel(scope.$index)"
                    >
                      删除
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      class="updateBtn"
                      @click="companyEdit(scope.$index, scope.row)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <el-dialog
      class="selOrg"
      title="共保体信息"
      :visible.sync="dialogFormVisible"
      width="700px"
      @close="close"
    >
      <el-form
        ref="ruleForm2"
        label-position="right"
        label-width="180px"
        :model="ruleForm2"
        :rules="rules2"
      >
        <el-form-item prop="underwriteType" label="是否首席">
          <el-checkbox
            @change="changeType"
            v-model="ruleForm2.underwriteType"
          ></el-checkbox>
        </el-form-item>
        <el-form-item prop="issuingCompanyCode" label="保险机构">
          <el-select
            v-model="ruleForm2.issuingCompanyCode"
            class="w300"
            filterable
            size="mini"
            placeholder="请选择"
            @change="slcName2"
          >
            <el-option
              v-for="item in company"
              :key="item.orgCode"
              :label="item.orgName"
              :value="item.orgCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="premiumRate" label="承保比例">
          <el-input
            size="mini"
            class="w300"
            clearable
            @change="changeRate"
            onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
            v-model="ruleForm2.premiumRate"
            placeholder="请输入比例"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  validateNumber,
  validatePositiveNum,
  validatePrem,
  validatePolicyNo,
  validateUnderWrite,
} from '@/utils/validateFrom'
import { getBranchList } from '@/api/userDataManagement'
export default {
  name: 'issuingCompany',
  data() {
    return {
      showTable: false,
      dialogFormVisible: false,
      FormData: {
        issuingCompanyName: '',
        issuingCompanyCode: '',
        policyInsuredInfos: [],
        isCoinsurance: false,
      },
      summmary: null,
      sameForm: [],
      ruleForm2: {
        underwriteType: false,
        premiumRate: null,
        issuingCompanyName: '',
        issuingCompanyCode: '',
      },
      isEdit: false,
      index: null,
      company: [],
      companyList: [],
      rules: {
        issuingCompanyName: [
          {
            required: true,
            message: '请选择保险机构',
            trigger: 'blur',
          },
        ],
        policyInsuredInfos: [
          { required: true, message: '请填写共保信息', trigger: 'blur' },
        ],
      },
      rules2: {
        issuingCompanyName: [
          {
            required: true,
            message: '请选择保险机构',
            trigger: 'blur',
          },
        ],
        premiumRate: [
          {
            required: true,
            validator: validateUnderWrite,
            trigger: 'blur',
          },
        ],
        underwriteType: [
          {
            required: false,
            message: '请选择类型',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getCompany()
  },
  methods: {
    getSummaries(param) {
      //保费占比求和
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
        } else if (index == 3) {
          const values = data.map((item) => Number(item[column.property]))
          if (column.property == 'premiumRate') {
            sums[index] =
              values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0) + '%'
          } else {
            sums[index] = 'N/A'
          }
        } else {
          sums[index] = '--'
        }
      })
      this.summmary = parseInt(sums[3])
      console.log(this.summmary, '00-0--00-')
      return sums
    },
    async getCompany() {
      let param = {
        pn: 1,
        ps: 1000,
        name: '',
        agencyNature: '',
        bl: '',
        status: '1',
        code: '',
        desc: false,
        orderby: '',
        type: '',
        servicename: 'insuranceCompanySvc',
      }
      let res = await getBranchList(param)
      if (res.code == '0000') {
        this.company = res.list
        const roles = window.sessionStorage.getItem('roles')
        const serOrg = JSON.parse(
          window.sessionStorage.getItem('servOrganizationResp')
        )
        let rolesArr = []
        if (roles != undefined && roles != undefined) {
          if (roles.indexOf(',') != -1) {
            rolesArr = roles.split(',')
          } else {
            rolesArr = [roles]
          }

          if (rolesArr.includes('RL1453259454203170817')) {
            console.log('rolesArr')
            if (serOrg.orgCode) {
              console.log(serOrg.orgCode, '++++++++')
              this.companyList = this.company.filter((item) => {
                return item.orgCode == serOrg.orgCode
              })
            }
          } else {
            this.companyList = this.company
          }
        }
      }
    },
    confirm() {
      if (!this.check()) {
        return
      }

      this.$refs.ruleForm2.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            this.FormData.policyInsuredInfos[this.index] = this.ruleForm2
            this.FormData.policyInsuredInfos = JSON.parse(
              JSON.stringify(this.FormData.policyInsuredInfos)
            )
            this.dialogFormVisible = false
          } else {
            this.FormData.policyInsuredInfos.push(this.ruleForm2)
            this.sameForm = JSON.parse(
              JSON.stringify(this.FormData.policyInsuredInfos)
            )
            this.dialogFormVisible = false
          }
        }
      })
    },
    check() {
      if (
        this.getTotal() == 100 &&
        !this.ruleForm2.underwriteType &&
        !this.FormData.policyInsuredInfos.find((item) => {
          return item.underwriteType == true
        })
      ) {
        this.$baseMessage('缺少首席，请修改', 'warning')
        return false
      }
      return true
    },
    changeOther(e) {
      if (e) {
        if (!this.FormData.issuingCompanyCode) {
          this.FormData.isCoinsurance = false
          this.$baseMessage('请先选择保险机构', 'warning')
        }
      } else {
        this.$confirm('将会清除共保数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            this.$set(this.FormData, 'policyInsuredInfos', [])
          })
          .catch(() => {
            this.$baseMessage(' 已取消', 'info')
            this.FormData.isCoinsurance = true
          })
      }
    },
    getTotal() {
      if (this.sameForm.length) {
        let arr = this.sameForm.map((item) => {
          return item.premiumRate
        })
        let arr1 = arr.map(Number)
        let total = arr1.reduce(function (sum, current) {
          return sum + current
        }, Number(this.ruleForm2.premiumRate))
        return total
      }
    },
    changeRate(e) {
      console.log(this.getTotal())
      if (this.getTotal() > 100) {
        this.$baseMessage('承保比例总和应为100%，请修改！', 'warning')
        this.ruleForm2.premiumRate = 0
      }
    },
    changeType(e) {
      console.log(e)
      if (
        this.sameForm.find((item) => {
          return item.underwriteType == e
        })
      ) {
        this.ruleForm2.underwriteType = false
        this.$baseMessage('首席已添加，请修改', 'warning')
      }
    },
    cancle() {
      this.ruleForm2 = {}
      this.dialogFormVisible = false
    },
    close() {
      this.isEdit = false
      this.index = null
      this.ruleForm2 = {
        underwriteType: null,
        premiumRate: null,
        issuingCompanyName: '',
        issuingCompanyCode: '',
      }
      this.$nextTick(() => {
        console.log(this.$refs, '--=--==')
        this.$refs.ruleForm2.resetFields()
      })
    },
    slcName(e) {
      console.log(e, '---')
      this.FormData.issuingCompanyName = this.company.find((item) => {
        return item.orgCode == e
      }).orgName
    },
    slcName2(e) {
      if (
        this.sameForm.find((item) => {
          return item.issuingCompanyCode == this.ruleForm2.issuingCompanyCode
        })
      ) {
        this.$baseMessage('该机构已添加', 'warning')
        this.ruleForm2.issuingCompanyName = ''
        this.ruleForm2.issuingCompanyCode = ''
        return
      }

      this.ruleForm2.issuingCompanyName = this.company.find((item) => {
        return item.orgCode == e
      }).orgName
    },
    companyDel(index) {
      //删除当前行数据
      this.$confirm('永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.FormData.policyInsuredInfos.splice(index, 1)
          this.$baseMessage('删除成功', 'success')
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    companyEdit(index) {
      let data = JSON.parse(JSON.stringify(this.FormData.policyInsuredInfos))

      this.dialogFormVisible = true
      this.isEdit = true
      this.index = index
      this.ruleForm2 = data.splice(index, 1)[0]
      this.sameForm = data
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      //表头样式
      if (rowIndex == 0) {
        return 'background:#f5f5f5;text-align:left;'
      } else {
        return ''
      }
    },
    save() {
      let flag = false

      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          console.log(this.FormData, valid, 'valid')
          this.$store.commit('policyInfo/insurersInfo', this.FormData)
          flag = true
          if (this.FormData.isCoinsurance && this.summmary != 100) {
            this.$baseMessage('共保比例总和需为100！', 'error')
            console.log('error')
            flag = false
          } else if (
            this.FormData.isCoinsurance &&
            this.summmary == 100 &&
            !this.FormData.policyInsuredInfos.find((item) => {
              return item.issuingCompanyCode == this.FormData.issuingCompanyCode
            })
          ) {
            this.$baseMessage('共保信息里须有出单公司', 'error')

            flag = false
          }
        }
      })
      console.log(flag, 'flag')
      return flag
    },
  },
}
</script>

<style lang='scss' scoped>
#issuingCompany .title {
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
}
#issuingCompany {
  background-color: #f5f6f8;
  .mainCon {
    padding: 30px;
  }
  .company {
    background-color: #fff;
    .companyTable {
      // padding-left: 120px;
    }
  }
  .policy {
    background-color: #fff;
    margin-top: 10px;
    .middlepart {
      line-height: 32px;
    }
  }
}
</style>