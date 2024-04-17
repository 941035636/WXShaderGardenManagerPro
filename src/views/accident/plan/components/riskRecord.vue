<template>
  <div id="riskRecord">
    <Title
      v-if="$route.query.isHandle === 'true'"
      title="风险记录"
      class="mb10"
    ></Title>
    <div v-if="$route.query.isHandle === 'true'" class="mb10 text-left">
      <el-button type="primary" @click="addRiskRecord">添加风险记录</el-button>
    </div>
    <el-table
      :data="dangerList"
      border
      style="width: 90%"
      :header-cell-style="getRowClass"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="remark" label="风险源/依据">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
          <span v-if="scope.row.foundation">/{{ scope.row.foundation }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expertTypeName" label="风险等级/状态">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">重大</span>
          <span v-if="scope.row.level === 2">较大</span>
          <span v-if="scope.row.level === 3">一般</span>
          <span v-if="scope.row.level === 4">低</span>
          <span v-if="scope.row.rectifyStatus == 1" class="color-FF9228">
            (待进行)
          </span>
          <span v-if="scope.row.rectifyStatus == 2" class="color-green">
            (已管控)
          </span>
          <span v-if="scope.row.rectifyStatus == 3" class="color-blue">
            (未管控)
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="advice" label="防范措施"></el-table-column>
      <el-table-column
        label="辨识日期"
        width="150"
        prop="checkDate"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.checkDate | setTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            class="detailBtn mr10"
            type="text"
            @click="palnDetail(scope.row)"
          >
            查看
          </el-button>
          <el-dropdown
            v-if="
              ($route.query.isHandle && scope.row.rectifyStatus == 1) ||
              scope.row.rectifyStatus == 3
            "
            trigger="click"
          >
            <el-button
              v-if="
                scope.row.rectifyStatus == 1 || scope.row.rectifyStatus == 3
              "
              type="text"
              class="moreBtn"
            >
              更多
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="
                  scope.row.rectifyStatus == 1 || scope.row.rectifyStatus == 3
                "
                class="moreBtn"
                @click.native="addControl(scope.row)"
              >
                填写管控
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  scope.row.rectifyStatus == 1 || scope.row.rectifyStatus == 3
                "
                class="updateBtn"
                @click.native="updateDanger(scope.row)"
              >
                修改
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  scope.row.rectifyStatus == 1 || scope.row.rectifyStatus == 3
                "
                class="deleteBtn"
                @click.native="delet(scope.row)"
              >
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <addRiskRecord
      ref="addRiskRecord"
      :plan-detail="planDetail"
      @successCb="successCb"
    ></addRiskRecord>
    <addControl
      ref="addControl"
      :plan-detail="planDetail"
      @successCb="successCb"
    ></addControl>
    <riskRecordDtails ref="riskRecordDtails"></riskRecordDtails>
  </div>
</template>

<script>
import addRiskRecord from './addRiskRecord'
import addControl from './addControl'
import riskRecordDtails from './riskRecordDtails'
import { deleteDanger } from '@/api/accidentManagement'
import Title from '@/components/Title'
import { mapGetters } from 'vuex'
export default {
  name: 'RiskRecord',
  components: {
    Title,
    addRiskRecord,
    addControl,
    riskRecordDtails,
  },
  props: {
    dangerList: {
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
    isShow: {
      type: Boolean,
      default: () => {
        return true
      },
    },
  },
  data() {
    return {
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
      ],
      activeName: 'first',
      tableList: [{}],
      fileList: [],
    }
  },
  computed: {
    recheckRate() {
      let allList = this.dangerList.filter((item) => {
        return !item.delete
      })
      let rechecList = allList.filter((item) => {
        return item.rectifyStatus === 2
      })
      let percentage = (rechecList.length / allList.length) * 100 || 0
      return Number(percentage.toFixed(0))
    },
  },
  mounted() {},
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    addRiskRecord() {
      this.$refs.addRiskRecord.initData(this.planDetail)
    },
    updateDanger(row) {
      console.log(row, 'row')
      this.$refs.addRiskRecord.initData(this.planDetail, row)
    },
    addControl(row) {
      this.$refs.addControl.initData(row, this.planDetail)
    },
    async palnDetail(row) {
      this.$refs.riskRecordDtails.initData(row)
    },
    // 图片上传
    async Upload(file) {
      this.fileList = []

      let data = [file.file]
      const res = await this.ResourcesService.uploadFile(
        'sequip-svc',
        'payInfo',
        '0',
        data
      )
      if (res.code == '0000') {
        this.id = res.list[0].fileId
        this.name = res.list[0].fileName
      }
    },
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('单文件上限10MB!')
      }
      return isLt10M
    },
    onExceed() {
      // this.$message.warning('最多支持10个附件')
    },
    successCb() {
      this.$emit('successCb')
    },
    async delet(row) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deleteDanger(row.id)
          if (res.code === '0000') {
            this.$message.success('删除成功')
            this.$emit('successCb')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
  },
}
</script>

<style scoped lang="scss">
#riskRecord {
  margin: 0px 20px 20px;
  .upload-demo {
    .upload-btn {
      width: 100px;
    }
  }
  .project-type {
    display: inline-block;
    padding: 2px 10px;
    background-color: #e6f7ff;
    color: #096dd9;
    border-radius: 20px;
  }
}
</style>
