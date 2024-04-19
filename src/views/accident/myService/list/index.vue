<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">项目类型：</span>
            <el-select
              v-model="ruleForm.preType"
              class="w524"
              clearable
              placeholder="请选择类型"
            >
              <el-option
                v-for="(item, key) in serveTypeList"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">服务起期：</span>
            <el-date-picker
              v-model="ruleForm.startTime"
              type="date"
              class="wid250"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期"
            ></el-date-picker>
            至
            <el-date-picker
              v-model="ruleForm.endTime"
              class="wid250"
              type="date"
              value-format="yyyy-MM-dd 23:59:59"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item-3">状态：</span>
            <el-select
              v-model="ruleForm.processStatus"
              class="w450"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                v-for="(item, key) in enumObj.AccidentStatusEnum"
                :key="key"
                :label="item.label"
                :value="item.code"
              ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="text-align: right">
            <el-button @click="reset" size="medium" round class="empty-button"
              >重置</el-button
            ><el-button
              type="warning"
              @click="seach"
              round
              size="medium"
              class="query-button mr20"
              >查 询</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- <div class="ml20 text-center">
        <el-button type="primary" shape="round" @click="seach">查询</el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
      </div> -->
    </div>
    <div class="table-split"></div>
    <div class="teble-list">
      <el-row>
        <el-col :span="10">
          <span>查询列表</span>
        </el-col>
        <el-col :span="14" style="text-align: right">
        </el-col>
      </el-row>
      <div class="mt20">
        <!--  -->
        <el-table :data="tableList" border :header-cell-style="getRowClass">
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <!-- <el-table-column prop="name" label="项目类型">
            <template slot-scope="scope">
              <div>
                <span class="project-type">
                  {{ scope.row.corporationName }}
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
                <span>{{ scope.row.startTime.split(' ')[0] || '' }}</span>
                <span>至</span>
                <span>{{ scope.row.endTime.split(' ')[0] || '' }}</span>
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
              <div>
                <span class="title">所属项目：</span>
                <span>{{ scope.row.projectName}}</span>
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
      </div>
      <div class="text-center mt10 mb10">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { getPlansList,deletesPlan,updatepalnstatus } from '@/service/accidentManagement'
  import userManage from '@/service/userManage'
  import { mapGetters } from 'vuex'
  export default {
    name: 'SafetyList',
    components: {},
    filters: {
      recheckRate(row) {
        let sum = Number(row.normal) + Number(row.major)
        let check = Number(row.noramlCheck) + Number(row.majorCheck)
        let percentage = (check / sum) * 100
        // if(check===0) {
        //   return '100%'
        // } else {
          return percentage.toFixed(0) + '%'
        // }
      },
      recheckRisk(row) {
        let sum = Number(row.controlled) + Number(row.unControlled)
        let check = Number(row.unControlled)
        let percentage = (check / sum) * 100
        // if(check===0) {
        //   return '100%'
        // } else {
          return percentage.toFixed(0) + '%'
        // }
      },
    },
    data() {
      return {
        userManage: new userManage(),
        serveTypeList:[],
        ruleForm: {
          pn: 1,
          ps: 10,
          beginCreateTime: '',
          endCreateTime: '',
          preType: '',
          name: '',
          processStatus: '',
          specialty: '',
          orderby: '',
          desc: false,
        },
        // 时间数组
        dateArray: [],
        tableList: [],
        typeData: [
          {
            code: '00',
            label: '服务机构',
          },
        ],
        total: 0,
      }
    },
    computed: {
      ...mapGetters({
        enumObj: 'getEnumAll',
      }),
    },
    created() {
      this.$store.dispatch("setEnumInfo");
      this.initData()
    },
    methods: {
      async initData() {
        this.getIndustryData()
        this.getList()
      },
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
      async getList() {
        let res = await getPlansList(this.ruleForm)
        if (res.code === '0000') {
          this.tableList = res.list
          this.total = res.total
        }
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f5f5'
        } else {
          return ''
        }
      },
      seach() {
        this.ruleForm.pn = 1
        this.ruleForm.ps = 10
        this.ruleForm.beginCreateTime =
          this.dateArray && this.dateArray[0]
            ? this.dateArray[0] + ' 00:00:00'
            : ''
        this.ruleForm.endCreateTime =
          this.dateArray && this.dateArray[1]
            ? this.dateArray[1] + ' 23:59:59'
            : ''
        this.getList()
      },
      // 分页变更
      handleCurrentChange(pn) {
        this.ruleForm.pn = pn
        this.getList()
      },
      // 重置
      reset() {
        this.ruleForm = {
          pn: 1,
          ps: 10,
          beginCreateTime: '',
          endCreateTime: '',
          preType: '',
          name: '',
          processStatus: '',
          specialty: '',
          orderby: '',
          desc: false,
        }
        this.getList()
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
              this.getList()
            }
          })
          .catch(() => {
            this.$message.info('已取消删除')
          })
      },
      // 去评价
      goEvaluate(row) {
        this.$message.warning('评价升级中，敬请期待')
      },
    },
  }
</script>

<style lang="less" scoped>
  #userList {
    background-color: #fff;
    margin: 0 20px;
    .elsearch {
      margin: 0 20px 20px;
      padding-top: 20px;
    }
    .row-bg {
      margin-bottom: 20px;
      line-height: 40px;
    }
    .table-split {
      height: 20px;
      background-color: #EAEAEA;
    }
    .teble-list {
      margin: 20px;
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
    .offline-box {
      display: inline-block;
      background-color: #FFA940;
      padding: 0px 6px;
      border-radius: 12px;
      color: #FFF;
    }
  }
</style>
