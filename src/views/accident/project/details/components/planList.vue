<template>
  <div id="planList">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="服务计划" name="first">
        <div>
          <el-row>
            <el-col :span="16">
              <div v-if="isAuth('120014') && projectDetails.approveStatus !== 7" class="mb10">
                <el-button type="primary" @click="addPlan">添加服务计划</el-button>
                <span class="ml20">
                  已制定
                  <span class="color-FF9228">{{ planList.length }}</span>
                  次服务
                </span>
              </div>
              <span v-else>&nbsp;</span>
            </el-col>
            <el-col :span="8" class="mb10">
              <div class="text-right">
                <el-input placeholder="请输入服务单位" v-model.trim="searchInput" @input="clearInput" class="input-search"><i class="el-input__icon el-icon-search" slot="suffix" @click="searchs"></i></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <el-table :data="tableList" border :header-cell-style="getRowClass">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <!-- <el-table-column prop="name" label="项目类型">
            <template slot-scope="scope">
              <div>
                <span class="project-type">
                  {{ scope.row.preFirstTypeName }}
                </span>
              </div>
              <div>
                {{ scope.row.createTime }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column prop="expertTypeName" label="服务计划">
            <template slot-scope="scope">
              <div class="color-blue">{{ scope.row.corporationName }}</div>
              <div>
                <span class="title">服务时间：</span>
                <span>{{ scope.row.startTime | format('YYYY-MM-DD') }}</span>
                <span>至</span>
                <span>{{ scope.row.endTime | format('YYYY-MM-DD') }}</span>
              </div>
              <div>
                <span class="title">服务专家：</span>
                <span
                  v-for="(item, key) in scope.row.accidentPreExpertEntityList"
                  :key="key"
                >
                  {{ key !== 0 ? '、' : '' }}
                  {{ item.name }}
                </span>
              </div>
              <!-- <div v-if="scope.row.chargePersonName">
                <span class="title" v-if="scope.row.preFirstType == '02'">安全风险管控责任人：</span>
                <span class="title" v-if="scope.row.preFirstType == '03'">事故隐患整改负责人：</span>
                <span>{{ scope.row.chargePersonName}}</span>
              </div> -->
              <div>
                <span class="title">服务类型：</span>
                <span class="color-blue">{{ scope.row.preFirstTypeName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="contactPhone" label="完成情况">
            <template slot-scope="scope">
              <div
                v-if="isAuth('120015') && scope.row.planStatus == 1"
                class="color-FF9228 pointer"
                @click="updatepalnstatus(scope.row, true)"
              >
                <i class="el-icon-edit"></i>
                <span>跟进处理计划</span>
              </div>
              <div
                v-if="isAuth('120015') && scope.row.planStatus == 2"
                class="color-FF9228 pointer"
                @click="planHandle(scope.row, true)"
              >
                <i class="el-icon-edit"></i>
                <span>跟进处理计划</span>
              </div>
              <div v-if="scope.row.planStatus == 3">
                <div v-if="scope.row.preFirstType !== '02' && scope.row.preFirstType !== '03'">
                  <div>
                    <span>实施日期：</span>
                    <span>{{ scope.row.implementationTime | format }}</span>
                    <span class="offline-box">{{scope.row.offline == false ? '线上' : '线下'}}</span>
                  </div>
                  <div>
                    <span>参加企业数量：</span>
                    <span>{{ scope.row.corporationNum }}</span>
                    <span class="ml15">参加人数：</span>
                    <span>{{ scope.row.personNum }}</span>
                  </div>
                  
                  <div>
                    <span>服务内容：</span>
                    <span>{{ scope.row.checkRemark }}</span>
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
                    <span class="color-blue">符合{{ scope.row.unAccordNum }}项、</span>
                    <span class="color-red">不符合{{ scope.row.accordNum }}项、</span>
                    <span>不涉及{{ scope.row.unRelate }}项</span>
                  </div>
                  <div>
                    <span>企业整改负责人姓名：</span>
                    <span>{{ scope.row.chargePersonName }}</span>
                  </div>
                  <div>
                    <span>企业整改负责人联系电话：</span>
                    <span>{{ scope.row.chargePersonPhone }}</span>
                  </div>
                  <div>
                    <span>服务内容：</span>
                    <span>{{ scope.row.checkRemark }}</span>
                  </div>
                </div>
                <!-- 安全评估 -->
                <div v-if="scope.row.preFirstType == '02'">
                  <div>
                    <span>风险管控责任人姓名：</span>
                    <span>{{ scope.row.chargePersonName }}</span>
                  </div>
                  <div>
                    <span>风险管控责任人联系电话：</span>
                    <span>{{ scope.row.chargePersonPhone }}</span>
                  </div>
                  <div>
                    <span>服务内容：</span>
                    <span>{{ scope.row.checkRemark }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="服务评价"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="isAuth('120013')" class="color-FF9228 pointer" @click="goEvaluate(scope.row)">
                <i class="el-icon-edit"></i>
                <span>去评价</span>
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
              <el-button type="text" @click="palnDetail(scope.row, false)">
                查看
              </el-button>
              <el-button v-if="isAuth('120016') && (scope.row.planStatus == 1 || scope.row.planStatus == 2)" type="text" @click="deletesPlans(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="合同/支付凭证" name="second">
        <div class="mb10 display-flex">
          <el-upload
            v-if="isAuth('120007') && projectDetails.approveStatus !== 7"
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
            <el-button size="small" type="primary">点击上传</el-button>
            <span>
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
          <el-table-column prop="name" label="文件名"></el-table-column>
          <el-table-column prop="createTime" label="上传时间"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button v-if="isAuth('120008')" type="text" @click="downloadFile(scope.row)">
                下载
              </el-button>
              <el-button
                v-if="isAuth('120009') && projectDetails.approveStatus !== 7"
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
            v-if="isAuth('120010') && projectDetails.approveStatus !== 7"
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
            <el-button size="small" type="primary">点击上传</el-button>
            <span>
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
          <el-table-column prop="name" label="文件名"></el-table-column>
          <el-table-column prop="createTime" label="上传时间"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button v-if="isAuth('120011')" type="text" @click="downloadFile(scope.row)">
                下载
              </el-button>
              <el-button
                v-if="isAuth('120012') && projectDetails.approveStatus !== 7"
                type="text"
                @click="deletFile(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <add-plan ref="addPlan" :serveTypeList="serveTypeList" :projectDetails="projectDetails" @successCb="successCb"></add-plan>
  </div>
</template>

<script>
  import AddPlan from '../../components/addPlan'
  import {
    updatepalnstatus,
    projectFile,
    deleteFiles,
    deletesPlan,
  } from '@/service/accidentManagement'
  import userManage from '@/service/userManage'
  import ResourcesService from '@/service/ResourcesService'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ServiceAdd',
    components: {
      AddPlan,
    },
    filters: {},
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
    watch:{
      // planList()
      planList: function (newValue, oldValue) {
				this.tableList = newValue;
				return newValue;
			},
    },
    data() {
      return {
        ResourcesService: new ResourcesService(),
        userManage: new userManage(),
        serveTypeList:[],
        data: {},
        activeName: 'first',
        tableList: [],
        fileList: [],
        searchInput:'',
      }
    },
    computed: {
      ...mapGetters({
        enmuList: 'getEnumAll',
      }),
    },
    mounted() {
      this.getIndustryData()
    },
    methods: {
      async getIndustryData() {
        //获取行业分类数据
        let res = await this.userManage.dictGet(true, 20004);
        if (res.code == "0000") {
          this.serveTypeList = res.data.map(item=>{
            if(item.sysDictItemEntitys) {
              item.sysDictItemEntitys = item.sysDictItemEntitys.map(v1=>{
                return {
                  itemValue:v1.itemValue,
                  itemText:v1.itemText,
                }
              })
            } else {
              delete item.sysDictItemEntitys
            }
            return item
          });
        }
      },
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
      addPlan() {
        this.$refs.addPlan.initData(this.projectDetails)
      },
      planHandle(row, flag) {
        this.$router.push({
          path: '/accidents/planHandle',
          query: {
            id: row.id,
            isHandle: flag+'',
            preType: row.preFirstType,
          },
        })
      },
      palnDetail(row, flag) {
        this.$router.push({
          path: '/prev/plan/detail',
          query: {
            id: row.id,
            isHandle: flag,
            preType: row.preFirstType,
          },
        })
      },
      async updatepalnstatus(row) {
        let res = await updatepalnstatus(row.id)
        if (res.code === '0000') {
          this.planHandle(row, true)
        }
      },
      // 图片上传
      async Upload(file) {
        console.log(file, 123)
        const formData = new FormData()
        formData.append('files', file.file)
        const res = await projectFile(
          formData,
          `${this.$route.query.id}${file.action}`
        )
        if (res.code == '0000') {
          this.successCb()
          this.$message.success('成功')
        }
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 20
        if (!isLt10M) {
          this.$message.error('单文件上限20MB!')
        }
        return isLt10M
      },
      onExceed() {
        this.$message.warning('最多支持9个附件')
      },
      // 去评价
      goEvaluate(row) {
        this.$message.warning('评价升级中，敬请期待')
      },
      successCb() {
        this.$emit('successCb')
      },
      getPreTypeName(row) {
        return this.enmuList.AccidentTypeEnum[row] || '无'
      },
      // 下载文件
      async downloadFile(row) {
        let res = await this.ResourcesService.downloadOrViewFile(row.downLoadUrl,true)
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
              this.$message.success('删除成功')
              this.successCb()
            }
          })
          .catch(() => {
            this.$message.info('已取消删除')
          })
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
      // 清除输入框的数据
      clearInput(){
          if(this.searchInput.length===0){
            this.tableList = this.planList
          }
      },
      // 模糊搜索
      searchs(){
          if(this.searchInput===''){
              return
          }
          this.tableList = this.planList.filter(item=>{
              return item.corporationName === this.searchInput
          })
          
      },
    },
    
  }
</script>

<style scoped lang="less">
  #planList {
    margin: 20px 20px;
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
    .input-search{
      width: 250px;
    }
    .offline-box {
      display: inline-block;
      background-color: #FFA940;
      padding: 0px 6px;
      border-radius: 12px;
      color: #FFF;
    }
  }
</style>
<style lang="less">
#planList{
  .el-upload--text{
      width: 100%;
			height: 40px;
			border: none;
      color: #000;
			border-radius: 4px;
			text-align: center;
			line-height: 40px;
		}
}
</style>