<template>
  <div id="production">
    <Title
      title="预案详情"
      class="mb10"
      v-if="$route.query.isHandle === 'true'"
    ></Title>
    <div class="mb10 text-left">
      <el-button
        type="primary"
        @click="addproduction"
        v-if="$route.query.isHandle === 'true'"
      >
        添加记录
      </el-button>
    </div>
    <el-table
      :data="dangerList"
      border
      style="width: 95%"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        type="index"
        label="序号"
        width="66"
        align="center"
      ></el-table-column>
      <el-table-column prop="accidentPreRecordEntity.scene" label="针对场景">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.accidentPreRecordEntity.scene
                ? scope.row.accidentPreRecordEntity.scene
                : ''
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="附件" width="273" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="
              scope.row.fileRecordEntities &&
              scope.row.fileRecordEntities.length
            "
            @click="checkEnclosure(scope.row.fileRecordEntities)"
            type="text"
            class="moreBtn"
          >
            查看附件
          </el-button>

          <div class="text" v-else>--</div>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="210"
        align="center"
        v-if="$route.query.isHandle === 'true'"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button type="text" class="moreBtn">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                class="updateBtn"
                @click.native="updateDanger(scope.row)"
              >
                修改
              </el-dropdown-item>
              <el-dropdown-item
                class="deleteBtn"
                @click.native="delet(scope.row.accidentPreRecordEntity)"
              >
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加 -->
    <addEarlyWarning
      ref="addproduction"
      :plan-detail="planDetail"
      @successCb="successCb"
    ></addEarlyWarning>

    <!-- 查看附件 -->
    <voucher-list ref="voucherList" />
  </div>
</template>

<script>
import { deleteRecord } from '@/api/accidentManagement'
import Title from '@/components/Title'
import addEarlyWarning from './addEarlyWarning'
import VoucherList from '@/views/case/caseDetail/VoucherList.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Production',
  components: {
    Title,
    addEarlyWarning,
    VoucherList,
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

    // 添加记录
    addproduction() {
      console.log('this.$refs.addproduction')
      console.log(this.planDetail)
      this.$nextTick(() => {
        this.$refs.addproduction.initData(this.planDetail)
      })
    },

    // 查看附件
    checkEnclosure(data) {
      console.log('查看附件')
      console.log(data)

      this.$refs.voucherList.tableData = data
      this.$refs.voucherList.dialogVisible = true
    },

    //成功提示框
    successCb() {
      this.$emit('successCb')
    },

    // 修改
    async updateDanger(row) {
      // console.log('修改页面')
      // console.log(row)
      console.log(row)

      this.$nextTick(() => {
        this.$refs.addproduction.initData(this.planDetail, row)
      })
    },

    // 删除
    async delet(row) {
      console.log(row)
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deleteRecord(row.id)
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
#production {
  margin: 0px 20px 20px;

  // element-ui
  .el-table thead {
    color: rgba(255, 255, 255, 100) !important;
  }
  .cell {
    color: rgba(255, 255, 255, 100) !important;
    font-weight: bold !important;
  }

  // 上传图片样式
  .avatar-uploader-icon {
    width: 140px;
    height: 140px;
    line-height: 140px;
  }

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
