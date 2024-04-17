<template>
  <div id="planList">
    <div class="pd20">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">项目计划</span>
        <span>
          <el-button
            @click="addPlan"
            v-if="projectDetails.processStatus != '3'"
            type="primary"
          >
            添加服务计划
          </el-button>
        </span>
        <span class="ml20">
          已制定
          <span class="color-FF9228">{{ planList.length }}</span>
          次服务
        </span>
      </div>

      <el-table
        class="mt20 mb20"
        :data="planList"
        border
        :header-cell-style="getRowClass"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="expertTypeName" label="服务计划">
          <template slot-scope="scope">
            <div class="fb" style="color: #096dd9">
              <TipsText
                v-if="scope.row.corporationName"
                :text="scope.row.corporationName"
                :length="20"
              />
              <TipsText
                v-if="scope.row.planName"
                :text="scope.row.planName"
                :length="20"
              />
            </div>
            <div>
              <span>服务时间：</span>
              <span>{{ scope.row.startTime | setTime }}</span>
              <span>至</span>
              <span>{{ scope.row.endTime | setTime }}</span>
            </div>
            <div>
              <span>服务专家：</span>
              <span
                v-for="(item, key) in scope.row.accidentPreExpertEntityList"
                :key="key"
              >
                {{ key !== 0 ? '、' : '' }}
                {{ item.name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="preFirstTypeName"
          label="服务类型"
        ></el-table-column>
        <el-table-column prop="contactPhone" label="完成情况">
          <template slot-scope="scope">
            <div
              v-if="scope.row.planStatus == 1"
              class="color-FF9228 pointer"
              @click="updatepalnstatus(scope.row, true)"
            >
              <i class="el-icon-edit"></i>
              <span>处理计划</span>
            </div>
            <div
              v-if="scope.row.planStatus == 2"
              class="color-FF9228 pointer"
              @click="planHandle(scope.row, true)"
            >
              <i class="el-icon-edit"></i>
              <span>处理计划</span>
            </div>
            <div v-if="scope.row.planStatus == 3">
              <div
                v-if="
                  scope.row.preFirstType == '01' ||
                  scope.row.preFirstType == '07'
                "
              >
                服务形式：
                <span>
                  {{ scope.row.serviceType == '1' ? '线上' : '线下' }}
                </span>
              </div>
              <div v-if="scope.row.preFirstType == '06'">
                服务方式：
                <span v-if="scope.row.serviceType == 0">
                  组织安全技术交流研讨会
                </span>
                <span v-if="scope.row.serviceType == 1">
                  推介安全生产科技成功和先进技术装备
                </span>
              </div>
              <div v-if="scope.row.preFirstType == '05'">
                服务方式：
                <span v-if="scope.row.serviceType == 1">应急预案编制</span>
                <span v-if="scope.row.serviceType == 2">应急救援演练</span>
              </div>
              <div v-if="scope.row.preFirstType == '04'">
                安全评分：{{ scope.row.safetyScore }}分 / 安全等级：  
                <span v-if="scope.row.safetyLevel == '1'">一级</span>
                <span v-if="scope.row.safetyLevel == '2'">二级</span>
                <span v-if="scope.row.safetyLevel == '3'">三级级</span>
              </div>
              <div v-if="scope.row.preFirstType !== '03'">
                <div v-if="scope.row.preFirstType == '01'">
                  <span>服务企业：</span>
                  <span>{{ scope.row.corporationNum }}家</span>
                  <span class="ml15">/ 参加人数：</span>
                  <span>{{ scope.row.personNum }}人</span>
                </div>

                <div v-if="scope.row.preFirstType != '01'">
                  <span>服务情况说明：</span>
                  <span>{{ scope.row.preContent }}</span>
                </div>
              </div>
              <div v-if="scope.row.preFirstType == '03'">
                <div>
                  <span>
                    共检查{{
                      scope.row.unAccordNum +
                      scope.row.accordNum +
                      scope.row.unRelate
                    }}项：
                  </span>
                  <span>符合{{ scope.row.unAccordNum }}项、</span>
                  <span>不符合{{ scope.row.accordNum }}项、</span>
                  <span>不涉及{{ scope.row.unRelate }}项</span>
                </div>
                <div class="inspect-border">
                  <div
                    class="
                      display-flex
                      text-center
                      bg-FFF7E6
                      color-D46B08
                      border-bottom
                    "
                  >
                    <span class="w33p">一般/整改</span>
                    <span class="w33p border-left border-right">重大/整改</span>
                    <span class="w33p">整改率</span>
                  </div>
                  <div class="display-flex text-center">
                    <span class="w33p color-blue">
                      {{ scope.row.normal }} / {{ scope.row.noramlCheck }}
                    </span>
                    <span class="w33p border-left border-right color-red">
                      {{ scope.row.major }} / {{ scope.row.majorCheck }}
                    </span>
                    <span class="w33p">
                      {{ scope.row | recheckRate }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="支出金额(元)"
          show-overflow-tooltip
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <div class="color-red">
              ￥{{
                scope.row.expendFund ? scope.row.expendFund.toFixed(2) : '0.00'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="服务状态" width="150" align="center">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.planStatus == 1" class="color-FF9228">
                待进行
              </span>
              <span v-if="scope.row.planStatus == 2" class="color-green">
                进行中
              </span>
              <span v-if="scope.row.planStatus == 3" class="color-blue">
                已完成
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              class="detailBtn mr10"
              type="text"
              @click="palnDetail(scope.row, false)"
            >
              查看
            </el-button>
            <el-dropdown
              v-if="scope.row.planStatus == 1 || scope.row.planStatus == 2"
              trigger="click"
            >
              <el-button type="text" class="moreBtn">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="scope.row.planStatus == 1"
                  class="updateBtn"
                  @click.native="updatepalnstatus(scope.row, true)"
                >
                  处理计划
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.planStatus == 2"
                  class="updateBtn"
                  @click.native="planHandle(scope.row, true)"
                >
                  处理计划
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.planStatus == 1 || scope.row.planStatus == 2"
                  class="deleteBtn"
                  @click.native="deletesPlans(scope.row)"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="split"></div>
    <div class="pd20">
      <div class="title">
        <span></span>
        <span class="color-blue f16 ml10 mr20">合同/支付凭证</span>
        <el-switch v-model="hasFile" @change="changeFile"></el-switch>
        （可选）
      </div>
      <div class="mt20" v-if="hasFile">
        <div class="mb10 display-flex">
          <el-upload
            v-if="projectDetails.processStatus !== 3"
            class="upload-demo"
            action="/contarct"
            :http-request="Upload"
            multiple
            :file-list="projectFileContarct"
            :show-file-list="false"
            :limit="9"
            :before-upload="beforeAvatarUpload"
            accept=".doc , .docx  , .pdf , .rar , .zip"
            :on-exceed="onExceed"
          >
            <span>合同附件：</span>
            <el-button class="ml30" size="small" type="primary">
              点击上传
            </el-button>
            <span class="fileTip">
              只支持DOC/DOCX/PDF/ZIP/RAR，大小不超过20M（最多可上传9件）
            </span>
          </el-upload>
          <span v-else>合同附件：</span>
        </div>
        <el-table
          :data="projectFileContarct"
          border
          :header-cell-style="getRowClass"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="文件名"
          ></el-table-column>
          <el-table-column prop="createTime" label="上传时间"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row)">
                下载
              </el-button>
              <el-button
                v-if="projectDetails.processStatus !== 3"
                type="text"
                @click="deletFile(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt10 mb10 display-flex">
          <el-upload
            v-if="projectDetails.processStatus !== 3"
            class="upload-demo"
            action="/payorder"
            :http-request="Upload"
            multiple
            :file-list="projectFilePayorder"
            :show-file-list="false"
            :limit="9"
            :before-upload="beforeAvatarUpload"
            accept=".doc , .docx  , .pdf , .rar , .zip"
            :on-exceed="onExceed"
          >
            <span>支付凭证：</span>
            <el-button class="ml30" size="small" type="primary">
              点击上传
            </el-button>
            <span class="fileTip">
              只支持DOC/DOCX/PDF/ZIP/RAR，大小不超过20M（最多可上传9件）
            </span>
          </el-upload>
          <span v-else>支付凭证：</span>
        </div>
        <el-table
          :data="projectFilePayorder"
          border
          :header-cell-style="getRowClass"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="文件名"
          ></el-table-column>
          <el-table-column prop="createTime" label="上传时间"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row)">
                下载
              </el-button>

              <el-button
                v-if="projectDetails.processStatus !== 3"
                type="text"
                @click="deletFile(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <add-plan
      ref="addPlan"
      :project-details="projectDetails"
      @successCb="successCb"
    ></add-plan>
    <detail-plan ref="detailPlan" />
  </div>
</template>

<script>
import AddPlan from '../../components/addPlan'
import detailPlan from '../../../plan/detailPlan/index.vue'
import {
  updatepalnstatus,
  projectFile,
  deleteFiles,
  updatePlan,
  deletesPlan,
} from '@/api/accidentManagement'
import { getFile } from '@/api/resources'
import { validateRate } from '@/utils/validateFrom'
import { mapGetters } from 'vuex'
export default {
  name: 'planList',
  components: {
    AddPlan,
    detailPlan,
  },
  filters: {
    recheckRate(row) {
      let sum = Number(row.normal) + Number(row.major)
      let check = Number(row.noramlCheck) + Number(row.majorCheck)
      let percentage = (check / sum) * 100 || 0
      return percentage.toFixed(0) + '%'
    },
    recheckRisk(row) {
      let sum = Number(row.controlled) + Number(row.unControlled)
      let check = Number(row.unControlled)
      let percentage = (check / sum) * 100
      return percentage.toFixed(0) + '%'
    },
  },
  props: {
    planList: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    projectDetails: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    projectFileContarct: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    projectFilePayorder: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      data: {},
      hasFile: false,
      activeName: 'first',
      tableList: [],
      fileList: [],
      dialogFormVisible: false,
      texts: ['1分', '2分', '3分', '4分', '5分'],
      showBtn: true,
      form: {
        id: '',
        agreeLevel: null,
        degreeOfCooperation: null,
      },
      rules: {
        degreeOfCooperation: [
          { required: true, validator: validateRate, trigger: 'change' },
        ],
        agreeLevel: [
          { required: true, validator: validateRate, trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters({
      enmuList: 'enums/getStrEnumAll',
    }),
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
    changeFile(e) {
      let flag = true
      if (!this.hasFile) {
        if (
          this.projectFileContarct.length ||
          this.projectFilePayorder.length
        ) {
          this.$baseMessage('请先清除附件信息', 'warning')
          this.hasFile = true
          flag = false
        }
      }

      return flag
    },
    changeFiles() {
      let flag = true
      if (this.hasFile) {
        if (
          this.projectFileContarct.length <= 0 ||
          this.projectFilePayorder.length <= 0
        ) {
          this.$baseMessage('请先添加附件信息', 'warning')
          // this.hasFile = true
          flag = false
        }
      }

      if (!this.hasFile) {
        flag = true
      }
      if (!this.changeFile()) {
        flag = false
      }
      return flag
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleClose() {
      this.form = {
        id: '',
        agreeLevel: null,
        degreeOfCooperation: null,
      }
    },
    addPlan() {
      this.$nextTick(() => {
        this.$refs.addPlan.initData(this.projectDetails)
      })
    },
    rateDetail(row) {
      this.$set(this.form, 'agreeLevel', row.agreeLevel)
      this.$set(this.form, 'degreeOfCooperation', row.degreeOfCooperation)
      this.showBtn = false
      this.dialogFormVisible = true
    },
    planHandle(row, flag) {
      console.log(row, '1212121')
      this.$router.push({
        path: 'planHandle',
        query: {
          id: row.id,
          isHandle: flag,
          preType: row.preFirstType,
        },
      })
    },
    palnDetail(row, flag) {
      this.$refs.detailPlan.id = row.id
      this.$refs.detailPlan.type = row.preFirstType
      this.$refs.detailPlan.dialogVisible = true
    },
    async updatepalnstatus(row) {
      let res = await updatepalnstatus(row.id)
      if (res.code === '0000') {
        this.planHandle(row, true)
      }
    },
    // 删除计划
    deletesPlans(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deletesPlan(row.id)
          if (res.code === '0000') {
            this.$message.success('删除成功')
            this.successCb()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 图片上传
    async Upload(file) {
      console.log(file, 123)
      const formData = new FormData()
      formData.append('files', file.file)
      const res = await projectFile(
        formData,
        `/${this.$route.query.id}${file.action}`
      )
      if (res.code == '0000') {
        this.successCb()
        this.$baseMessage('成功', 'success')
      }
    },
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 20
      if (!isLt10M) {
        this.$baseMessage('单文件上限20MB!', 'error')
      }
      return isLt10M
    },
    onExceed() {
      this.$baseMessage('最多支持9个附件', 'warning')
    },
    // 去评价
    goEvaluate(row) {
      console.log(row)
      this.form.id = row.id
      this.showBtn = true
      this.dialogFormVisible = true
    },
    evaluate() {
      // 评价提交
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let res = await updatePlan(this.form)
          if (res.code === '0000') {
            this.$message.success('评价成功！')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            this.successCb()
          }
        } else {
          return false
        }
      })
    },
    successCb() {
      this.$emit('successCb')
    },
    getPreTypeName(row) {
      let value = this.enmuList.AccidentTypeEnum.find(
        (item) => item.code == row
      )
      return (value && value.label) || '无'
    },
    // 下载文件
    async downloadFile(row) {
      let res = await getFile(row.url)
    },
    // 删除文件
    deletFile(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deleteFiles(row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.successCb()
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
#planList {
  background-color: #fff;

  .split {
    height: 10px;
    background-color: #f6f8f9;
  }
  .title {
    display: flex;
    height: 40px;
    width: 100%;
    margin: 0 auto;
    align-items: center;

    font-size: 12px;
    border-bottom: 1px solid #e9e9e9;
  }
  .fileTip {
    color: #355e92;
    margin-left: 20px;
  }
  .title > span:nth-child(1) {
    display: inline-block;
    width: 5px;
    height: 16px;
    background-color: #096dd9;
  }
  .el-rate {
    margin-top: 6px;
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
  .inspect-border {
    border: 1px solid #ccc;
  }
  .border-bottom {
    border-bottom: 1px solid #ccc;
  }
  .border-left {
    border-left: 1px solid #ccc;
  }
  .border-right {
    border-right: 1px solid #ccc;
  }
}
</style>
