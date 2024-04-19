<template>
  <div id="riskRecord">
    <Title title="风险记录" class="mb10"></Title>
    <div v-if="isAuth('10084') && $route.query.isHandle === 'true'" class="mb10 text-right">
      <el-button type="primary" @click="addRiskRecord">添加风险记录</el-button>
    </div>
    <el-table :data="dangerList" border :header-cell-style="getRowClass" >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="remark" label="风险源"></el-table-column>
      <el-table-column prop="expertTypeName" label="风险等级" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.level === 1" class="color-red">红</div>
          <div v-if="scope.row.level === 2" class="col-FFA940">橙</div>
          <div v-if="scope.row.level === 3" class="color-orange">黄</div>
          <div v-if="scope.row.level === 4" class="color-blue">蓝</div>
        </template>
      </el-table-column>
      <el-table-column prop="foundation" label="具体描述"></el-table-column>
      <el-table-column label="管控状态" width="150" align="center">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.rectifyStatus == 1" class="color-FF9228">
              未管控
            </span>
            <span v-if="scope.row.rectifyStatus == 2" class="color-green">
              已管控
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <div v-if="isAuth('10087') && scope.row.rectifyStatus == 1" class="pointer">
            <a @click="addControl(scope.row)">填写整改</a>
          </div>
          <el-button v-if="isAuth('10085')" type="text" @click="palnDetail(scope.row)">查看</el-button>
          <el-button
            v-if="isAuth('10086') && scope.row.rectifyStatus == 1"
            type="text"
            @click="updateDanger(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="isAuth('10093') && scope.row.rectifyStatus == 1"
            type="text"
            @click="delet(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <addRiskRecord :planDetail="planDetail" ref="addRiskRecord" @successCb="successCb"></addRiskRecord>
    <addControl
      ref="addControl"
      :planDetail="planDetail"
      @successCb="successCb"
    ></addControl>
    <riskRecordDtails ref="riskRecordDtails"></riskRecordDtails>
  </div>
</template>

<script>
  import addRiskRecord from './addRiskRecord'
  import addControl from './addControl'
  import riskRecordDtails from './riskRecordDtails'
  import { deleteDanger } from '@/service/accidentManagement'
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
        this.$refs.addRiskRecord.initData(this.planDetail, row)
      },
      addControl(row) {
        this.$refs.addControl.initData(row)
      },
      async palnDetail(row) {
        this.$refs.riskRecordDtails.initData(row)
      },
      // 图片上传
      async Upload(file) {
        this.fileList = []
        // const formData = new FormData();
        // formData.append('files', file.file)
        // formData.append('type', file.file.type)
        // formData.append("channelcode", "sequip")
        // formData.append("resCode", "I001")
        // let data = formData
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

<style scoped lang="less">
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
