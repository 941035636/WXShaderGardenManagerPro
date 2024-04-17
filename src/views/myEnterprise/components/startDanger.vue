<!-- 开始排查 -->
<template>
  <div id="Inventory">
    <div class="title-box">
      <el-row class="row-x">
        <el-col :span="22">
          <p class="title-name">{{ endata.standardName }}</p>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>

      <el-row class="row-x">
        <el-col :span="22">
          <p>
            当前进度：共计
            <span>{{ endata.checkNum + endata.uncheckNum }}</span>
            项、已查
            <span>{{ endata.checkNum || '0' }}</span>
            项、未查
            <span>{{ endata.uncheckNum || '0' }}</span>
            项，完成率
            <span>{{ endata.completionRate || '00.00%' }}</span>
            ，发现隐患数：
            <span>{{ endata.findHazardNum || '0' }}</span>
            个
          </p>
        </el-col>
        <el-col :span="2">
          <el-button
            round
            type="primary"
            v-if="endata.checkOver != '1'"
            @click="submit"
          >
            全部检查完成
          </el-button>
        </el-col>
      </el-row>

      <el-table
        :data="dataList"
        border
        header-row-class-name="headName"
        :header-cell-style="getRowClass"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="checkType"
          label="检查类别"
          min-width="40"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="checkProjectTypeOne"
          label="检查项目"
          min-width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="checkStandard"
          label="检查标准"
          align="center"
        ></el-table-column>
        <el-table-column align="center" min-width="60" label="隐患级别">
          <template slot-scope="scope">
            <span>
              {{ transition(scope.row.hazardLevel) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="隐患类型">
          <template slot-scope="scope">
            <div class="color-blue">
              {{
                hiddenDangerState[scope.row.hazardTypeOne] +
                '-' +
                hiddenDangerState[scope.row.hazardTypeTwo]
              }}
            </div>
            <!-- <div
              style="
                color: #fa8c16;
                cursor: pointer;
                text-decoration: underline;
              "
              v-if="scope.row.isPass === '0'"
              @click="pass(scope.row.id, '0')"
            >
              修改“不合格信息”
            </div> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-radio
              v-model="scope.row.isPass"
              label="1"
              :disabled="headquarters || key"
              @input="pass(scope.row.id, '1')"
            >
              合格
            </el-radio>
            <el-radio
              v-model="scope.row.isPass"
              label="0"
              :disabled="headquarters || key"
              @input="pass(scope.row.id, '0')"
            >
              不合格
            </el-radio>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <HazardReg ref="hazardReg" @closed="closed" :id="id" />
  </div>
</template>
<script>
import HazardReg from './hazardReg.vue'
import { getItems } from '@/api/user'
import {
  getHiddenByUser,
  checkPass,
  checkNoPass,
  checkOver,
} from '@/api/checkApi'
export default {
  components: {
    HazardReg,
  },
  props: {
    endata: {
      type: Object,
      required: true,
    },
    key: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      total: 0,
      pn: 1,
      dataList: [],
      dataForm: {},
      id: '',
      hiddenDangerRanks: [],
      hiddenDangerState: [],
      headquarters: false,
    }
  },
  created() {
    this.getItems()
    this.getItems1()
  },
  watch: {
    endata: {
      handler(curVal, oldVal) {
        let headquartersData = window.sessionStorage.getItem('roles').split(',')
        for (let key in headquartersData) {
          if (headquartersData[key] === 'RL1453251619998273537') {
            this.headquarters = true
          }
        }
        this.getInit()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    transition(e) {
      let test = ''
      this.hiddenDangerRanks.forEach((item) => {
        if (item.itemValue === e) {
          test = item.itemText
        }
      })
      return test
    },
    async getItems() {
      let res = await getItems('50001')
      if (res.code == '0000') {
        this.hiddenDangerRanks = res.data
      }
    },
    async getItems1() {
      let res = await getItems('50002')
      if (res.code == '0000') {
        this.hiddenDangerState = this.setDiGuiDataObj(res.data)
      }
    },
    // 重新设置行业数据
    setDiGuiDataObj(list, obj = {}) {
      //递归获取下拉框数据
      for (let i = 0, j = list.length; i < j; i++) {
        if (list[i].sysDictItemEntitys) {
          obj[list[i].itemValue] = list[i].itemText
          this.setDiGuiDataObj(list[i].sysDictItemEntitys, obj)
        } else {
          obj[list[i].itemValue] = list[i].itemText
        }
      }
      return obj
    },
    closed() {
      this.getInit()
    },
    async submit() {
      let key = true
      this.dataList.forEach((e) => {
        if (e.isPass === null || e.isPass === undefined || e.isPass === '') {
          key = false
        }
      })
      if (key) {
        let res = await checkOver({ id: this.endata.id })
        if (res.code === '0000') {
          this.$message({
            message: '全部检查完成',
            type: 'success',
          })
        }
      } else {
        this.$message({
          message: '请选择完成后再提交',
          type: 'error',
        })
      }
    },
    async pass(id, key) {
      if (key === '0') {
        this.noPass()
        this.id = id
      } else {
        let res = await checkPass(id)
        this.getInit()
      }
    },
    noPass() {
      this.$refs.hazardReg.dialogVisible = true
    },
    async getInit() {
      let res = await getHiddenByUser(this.endata.id)
      if (res.code == '0000') {
        this.dataList = res.data
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    handleCurrentChange(pn) {
      this.pn = pn
    },
  },
}
</script>
<style lang="scss" scoped>
#Inventory {
  .title-box {
    .title-name {
      font-size: 20px;
      text-align: center;
    }
    .title-item {
      border: 1px dashed #1890ff;
      border-radius: 5px;
      line-height: 60px;
    }
  }
  .row-x {
    overflow-x: hidden;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .col18 {
    color: #1890ff;
  }
}
</style>