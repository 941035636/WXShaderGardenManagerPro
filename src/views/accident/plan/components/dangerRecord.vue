<template>
  <div id="dangerList">
    <Title title="隐患记录"></Title>
    <div class="display-flex mt20 mb20">
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
    <div v-if="isAuth('10092') && $route.query.isHandle === 'true'" class="mt10 mb10 text-right">
      <el-button type="primary" @click="addDanger">添加隐患记录</el-button>
    </div>
    <el-table :data="dangerList" border :header-cell-style="getRowClass">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="remark" label="隐患描述"></el-table-column>
      <el-table-column prop="expertTypeName" label="隐患等级">
        <template slot-scope="scope">
          <div v-if="scope.row.level === 1" class="color-blue">一般隐患</div>
          <div v-if="scope.row.level === 2" class="color-red">重大隐患</div>
        </template>
      </el-table-column>
      <el-table-column prop="foundation" label="判断依据"></el-table-column>
      <el-table-column prop="advice" label="整改建议"></el-table-column>
      <el-table-column label="隐患状态" width="150" align="center">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.rectifyStatus == 1" class="color-FF9228">
              待进行
            </span>
            <span v-if="scope.row.rectifyStatus == 2" class="color-green">
              已整改
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <div v-if="isAuth('10091') && scope.row.rectifyStatus == 1" class="pointer">
            <a  @click="addRectification(scope.row)">填写整改</a>
          </div>
          <el-button v-if="isAuth('10088')" type="text" @click="palnDetail(scope.row)">查看</el-button>
          <el-button
            v-if="isAuth('10089') &&scope.row.rectifyStatus == 1"
            type="text"
            @click="updateDanger(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="isAuth('10090') && scope.row.rectifyStatus == 1"
            type="text"
            @click="delet(scope.row)"
          >
            删除
          </el-button>
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
  import Title from '@/components/Title'
  import { deleteDanger } from '@/service/accidentManagement'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceAdd',
    components: {
      AddDanger,
      AddRectification,
      DangerDetails,
      Title,
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
      addDanger() {
        this.$refs.addDanger.initData(this.planDetail)
      },
      updateDanger(row) {
        this.$refs.addDanger.initData(this.planDetail, row)
      },
      addRectification(row) {
        this.$refs.addRectification.initData(row)
      },
      async palnDetail(row) {
        // console.log(res)
        // return
        this.$refs.dangerDetails.initData(row)
        // this.$router.push({
        //   path: 'planDetails',
        //   query: {
        //     id: row.id,
        //   },
        // })
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
