<template>
  <div id="dangerList">
    <Title v-if="$route.query.isHandle" title="隐患记录"></Title>
    <div v-if="false" class="display-flex mt20 mb20">
      <div class="danger-progress">
        <el-progress
          type="dashboard"
          :percentage="recheckRate"
          :color="colors"
        ></el-progress>
      </div>
      <div class="danger-major">
        <p>
          <span class="color-red-F5222D f20">重大隐患</span>
          <span class="ml10 color-gray-9 f14">数量</span>
        </p>
        <p>
          <span class="color-red-F5222D f36">{{ planDetail.major }}</span>
          <span class="ml10 f18">/ 已整改{{ planDetail.majorCheck }}项</span>
        </p>
      </div>
      <div class="danger-commonly">
        <p>
          <span class="color-blue f20">一般隐患</span>
          <span class="ml10 color-gray-9 f14">数量</span>
        </p>
        <p>
          <span class="color-blue f36">{{ planDetail.normal }}</span>
          <span class="ml10 f18">/ 已整改{{ planDetail.noramlCheck }}项</span>
        </p>
      </div>
    </div>
    <div v-if="$route.query.isHandle === 'true'" class="mt10 mb10">
      <el-button type="primary" @click="addDanger">添加隐患记录</el-button>
    </div>
    <el-table
      :data="dangerList"
      border
      max-height="300"
      :header-cell-style="getRowClass"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column min-width="150" prop="remark" label="隐患描述/检查依据">
        <template slot-scope="scope">
          <div class="display-flex">
            隐患描述：
            <moreCon :data="scope.row.remark" :length="18" />
          </div>
          <div class="display-flex">
            检查依据：
            <moreCon :data="scope.row.foundation" :length="18" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="expertTypeName"
        label="隐患等级"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">一般隐患</span>
          <span v-if="scope.row.level === 2">重大隐患</span>
          <span v-if="scope.row.rectifyStatus == 1" class="color-FF9228">
            (待进行)
          </span>
          <span v-if="scope.row.rectifyStatus == 2" class="color-green">
            (已整改)
          </span>
          <span v-if="scope.row.rectifyStatus == 3" class="color-green">
            (未整改)
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="advice"
        show-overflow-tooltip
        label="整改建议"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="checkDate" label="检查时间">
        <template slot-scope="scope">
          {{ scope.row.checkDate | setTime }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="detailBtn mr10"
            @click="palnDetail(scope.row)"
          >
            查看
          </el-button>
          <el-dropdown
            v-if="$route.query.isHandle && scope.row.rectifyStatus != 2"
            trigger="click"
          >
            <el-button type="text" class="moreBtn">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="
                  scope.row.rectifyStatus == 1 || scope.row.rectifyStatus == 3
                "
                class="moreBtn"
                @click.native="addRectification(scope.row)"
              >
                填写整改
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
    <add-danger ref="addDanger" @successCb="successCb"></add-danger>
    <add-rectification
      ref="addRectification"
      @successCb="successCb"
    ></add-rectification>
    <danger-details ref="dangerDetails"></danger-details>
  </div>
</template>

<script>
import AddDanger from './addDanger'
import AddRectification from './addRectification'
import DangerDetails from './dangerDetails'
import moreCon from '@/components/moreCon'
import { deleteDanger } from '@/api/accidentManagement'
import { mapGetters } from 'vuex'
export default {
  name: 'ServiceAdd',
  components: {
    AddDanger,
    AddRectification,
    DangerDetails,
    moreCon,
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
    handleClick(tab, event) {},
    addDanger() {
      this.$refs.addDanger.initData(this.planDetail)
    },
    updateDanger(row) {
      console.log(row, 'row')
      this.$refs.addDanger.initData(this.planDetail, row)
    },
    addRectification(row) {
      this.$refs.addRectification.initData(row, this.planDetail)
    },
    async palnDetail(row) {
      this.$refs.dangerDetails.initData(row)
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
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deleteDanger(row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.$emit('successCb')
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
  },
}
</script>

<style scoped lang="scss">
#dangerList {
  margin: 0px 20px 20px;
  .danger-progress {
    padding: 0 100px;
    border-right: 1px solid #ccc;
  }
  .danger-major {
    padding: 0 100px;
  }
  .danger-commonly {
    padding: 0 100px;
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
