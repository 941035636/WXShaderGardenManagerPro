<template>
  <div id="userList">
    <div class="elsearch">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目名称：</span>
            <el-input
              v-model="ruleForm.projectName"
              size="small"
              class="w300"
              clearable
              placeholder="请输入项目名称"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目地址：</span>
            <el-cascader
              v-model="areaCascaser"
              filterable
              class="w300"
              :options="areaList"
              :props="{ checkStrictly: true }"
              clearable
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="施工许可证号：" />
            <el-input
              v-model="ruleForm.licenseKey"
              size="small"
              class="w300"
              clearable
              placeholder="请输入施工许可证号"
            />
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">项目状况：</span>
            <el-select
              v-model="ruleForm.projectStatus"
              class="w300"
              clearable
              placeholder="请选择项目状况"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="在建" value="01"></el-option>
              <el-option label="不在建" value="02"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">施工单位：</span>
            <el-input
              v-model="ruleForm.orgName"
              size="small"
              class="w300"
              clearable
              placeholder="请输入施工单位"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="施工单位社会信用代码：" />
            <el-input
              v-model="ruleForm.orgBlCode"
              size="small"
              class="w300"
              clearable
              placeholder="请输入施工单位社会信用代码"
            />
          </div>
        </el-col>
      </el-row>
      <el-row v-if="spread" class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <Label1 long="是否购买安责险：" />
            <el-select
              v-model="ruleForm.isBuy"
              class="w300"
              clearable
              placeholder="请选择是否购买安责险"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">建设单位：</span>
            <el-input
              v-model="ruleForm.buildOrgName"
              size="small"
              class="w300"
              clearable
              placeholder="请输入建设单位"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">是否关联：</span>
            <el-select
              v-model="ruleForm.isRelation"
              class="w300"
              clearable
              placeholder="请选择是否关联"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="true"></el-option>
              <el-option label="否" value="false"></el-option>
            </el-select>
          </div>
        </el-col>
        <!-- <el-col :span="6">
          <div style="display: flex">
            <span class="item3">所属年份：</span>
            <el-date-picker
              class="w300"
              @change="handChangeyear"
              v-model="ruleForm.belongToYear"
              type="year"
              value-format="yyyy"
              placeholder="请选择"
            ></el-date-picker>
          </div>
        </el-col> -->
      </el-row>
      <div class="ml20 text-center">
        <el-button class="ml20" type="primary" shape="round" @click="seach">
          查询
        </el-button>
        <el-button class="ml20" shape="round" @click="reset">重置</el-button>
        <!-- v-if="$hasBtn('safety-add')" -->
        <el-button type="primary" @click="add">新增</el-button>
        <el-button
          v-if="!spread"
          class="btn"
          type="text"
          @click="spread = true"
        >
          展开
          <i class="el-icon-arrow-up" />
        </el-button>
        <el-button
          v-if="spread"
          class="btn"
          type="text"
          @click="spread = false"
        >
          收起
          <i class="el-icon-arrow-down" />
        </el-button>
      </div>
    </div>

    <div class="teble-list">
      <el-row>
        <el-col :span="14">
          <div class="totNum ml15">
            <span class="searchList">查询列表</span>
            <span class="totNum ml15">共{{ total }}条记录</span>
          </div>
        </el-col>
        <el-col :span="10" style="text-align: right">
          <span style="color: #fa364b; margin-right: 10px">
            单次导入最多3000条，请合理安排数据
          </span>
        </el-col>
      </el-row>
      <el-row style="padding: 10px 0px; display: flex">
        <el-col :span="24">
          <span class="totNum ml15" style="line-height: initial">
            安责险情况：全省建筑工地需购买安责险项目共{{
              numBertotal.projectSum
            }}个，目前已购买{{ numBertotal.purchasedSum }}个，剩下{{
              numBertotal.notPurchasedSum
            }}个项目未购买，现购买率为{{ numBertotal.purchasedRatio }}%
          </span>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button round type="primary" @click="uploadUser">
            批量导入
          </el-button>
          <el-button
            round
            type="primary"
            @click="download"
            :disabled="tableList.length <= 0"
          >
            导出
          </el-button>
          <el-button round type="primary" @click="business">项目管理</el-button>
        </el-col>
      </el-row>
      <div class="mt8">
        <el-table
          class="elTable"
          :data="tableList"
          border
          header-row-class-name="headName"
          :header-cell-style="getRowClass"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column
            min-width="250"
            label="项目信息"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>项目名称：{{ scope.row.projectName }}</p>
              <p>
                项目地址：{{ scope.row.provinceName }} /
                {{ scope.row.cityName }} /
                {{ scope.row.countyName }}
              </p>
              <p>施工许可证号： {{ scope.row.licenseKey }}</p>
              <p>建设单位： {{ scope.row.buildOrgName }}</p>
              <p>监理单位： {{ scope.row.supervisorOrgName }}</p>
              <p>工程总造价（万元）：{{ scope.row.totalProjectCost }}</p>
              <p>工程总面积（㎡）： {{ scope.row.totalProjectArea }}</p>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
            label="施工单位信息"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{ scope.row.orgName }}</p>
              <p>{{ scope.row.orgBlCode }}</p>
            </template>
          </el-table-column>
          <el-table-column
            min-width="50"
            prop="projectStatus"
            label="项目状况"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            min-width="70"
            prop="isBuy"
            label="是否购买安责险"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            min-width="50"
            prop="isRelation"
            label="是否关联"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作时间" min-width="100">
            <template slot-scope="scope">
              <div>
                <p class="row-factor1 cursor1">
                  机构名称：{{
                    scope.row.belongToOrgName
                      ? scope.row.belongToOrgName
                      : '---'
                  }}
                </p>
                <p class="row-factor1 cursor1">
                  机构类型：
                  {{
                    scope.row.belongToOrgType
                      ? typeData.find(
                          (item) => item.strCode == scope.row.belongToOrgType
                        ).label
                      : '---'
                  }}
                  <span v-if="scope.row.belongToOrgType == '02'">
                    /{{ scope.row.governmentType }}
                  </span>
                </p>
                <!-- <p v-if="scope.row.belongToOrgType == '03'">
                  保司-{{ scope.row.belongToOrgName }}
                </p>
                <p v-if="scope.row.belongToOrgType == '02'">
                  政府机构-{{ scope.row.belongToOrgName }}
                </p>
                <p
                  v-if="
                    scope.row.belongToOrgType != '02' &&
                    scope.row.belongToOrgType != '03'
                  "
                >
                  {{ scope.row.belongToOrgName }}
                </p>
                <p>{{ scope.row.belongToOrgName }}</p> -->
                <p>{{ scope.row.updateTime }}</p>
                <!-- <el-switch
                  v-model="scope.row.dataStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changStatus(scope.row)"
                ></el-switch> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="$hasBtn('organization-update')"
                class="updateBtn"
                @click.native="update(scope.row)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                v-if="$hasBtn('organization-update')"
                class="updateBtn"
                @click.native="delet(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="ruleForm.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <Add ref="add"></Add>
    <RegFileUploadDialog ref="fileRef"></RegFileUploadDialog>
  </div>
</template>

<script>
import {
  mation,
  mationsList,
  statusjz,
  deleteJZsg,
  totalNum,
  download
} from '@/api/Construction.js'
import { getSysDate } from '@/api/userManagement'
import Label1 from '@/components/label/index'
import RegFileUploadDialog from '../add/RegFileUploadDialog.vue'
import { mapGetters } from 'vuex'
import Add from '../add/index.vue'
export default {
  name: 'SafetyList',
  components: { Add, Label1, RegFileUploadDialog },
  data() {
    return {
      spread: false, //控制展开收起
      ruleForm: {
        licenseKey: '',//施工许可证号
        totalProjectCost: '',//工程总造价
        totalProjectArea: '',//工程总面积
        buildOrgName: '',//建设单位
        supervisorOrgName: '',//监理单位
        projectStatus: '',// 项目状况
        isBuy: '', // 是否购买安责险
        orgBlCode: '',//施工单位社会信用代码code
        orgName: '',//施工单位
        isRelation: '',//是否关联
        pn: 1,
        ps: 10,
        expertType: '',
        cityCode: "",
        cityName: '',
        countyCode: "",
        countyName: "",
        provinceCode: "",
        provinceName: '',
        dataStatus: '',
        // belongToYear: '',//月份
      },
      tableList: [],
      total: 0,
      areaCascaser: [],//地址合集
      numBertotal: {},
      typeData: []
    }
  },
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
      areaList: 'areas/areaList',
    }),
  },
  created() {
    this.initData()
    this.totalNum()
    this.getUserType()
  },
  methods: {
    async initData() {
      // this.mationsList()
    },
    getUserType() {
      let userList = this.getStrEnumAll.UserTypeEnum
      let lista = this.getStrEnumAll.SupervisionOrgTypeEnum
      this.typeData = userList.map((item => {
        item['children'] = []
        if (item.strCode == '02') {
          item['children'] = lista
        }
        return item
      }))
    },
    async totalNum() {
      let res = await totalNum()
      console.log(res, 'totalNum');
      if (res.code == '0000') {
        this.numBertotal = res.data
      }
    },
    uploadUser() {
      console.log('we')
      this.$refs.fileRef.fileImportShow = true
    },
    // handChangeyear(e) {
    //   let strtime = JSON.stringify(e)
    //   this.ruleForm.belongToYear = strtime.substring(1, 5)
    // },
    async mationsList() {
      let res = await mationsList(this.ruleForm)
      this.tableList = res.list
      this.total = res.total
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5;'
      } else {
        return ''
      }
    },
    async download() {//导出
      let resT = await getSysDate()
      let date = null
      if (resT.code === '0000') {
        date = resT.data
      } else {
        this.$baseMessage('获取服务器时间失败，已改为获取系统时间', 'error')
        let newDate = new Date()
        date = newDate.toLocaleString()
      }
      this.ruleForm.ps = this.total
      let res = await download(this.ruleForm)
      console.log(res, '211111');
      let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      const fileName = `建筑施工项目${date}.xls`
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(link.href)
      this.ruleForm.ps = 10
    },

    seach() {
      this.ruleForm.pn = 1
      this.ruleForm.ps = 10
      this.ruleForm.provinceCode = this.areaCascaser[0] || ''
      this.ruleForm.cityCode = this.areaCascaser[1] || ''
      this.ruleForm.countyCode = this.areaCascaser[2] || ''
      this.mationsList()
    },
    async delet(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        hj: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await deleteJZsg(row.id)
          if (res.code === '0000') {
            this.$baseMessage('删除成功', 'success')
            this.mationsList()
          }
        })
        .catch(() => {
          this.$baseMessage('已取消删除', 'info')
        })
    },
    // 分页变更
    handleCurrentChange(pn) {
      this.ruleForm.pn = pn
      this.mationsList()
    },
    // 重置
    reset() {
      this.ruleForm = {
        orgName: '',
        pn: 1,
        ps: 10,
        expertType: '',
        cityCode: "",
        cityName: '',
        countyCode: "",
        countyName: "",
        provinceCode: "",
        provinceName: '',
        dataStatus: '',
        belongToYear: '',//月份
        licenseKey: '',//施工许可证号
        totalProjectCost: '',//工程总造价
        totalProjectArea: '',//工程总面积
        buildOrgName: '',//建设单位
        supervisorOrgName: '',//监理单位
        projectStatus: '',// 项目状况
        isBuy: '', // 是否购买安责险
        orgBlCode: '',//施工单位社会信用代码code
        orgName: '',//施工单位
        isRelation: '',//是否关联
      }
      this.areaCascaser = [],//地址合集
        this.mationsList()
    },
    update(row) {
      console.log(row, 'queryString');
      this.$refs.add.dialogVisible = true
      // let areaId = [row.provinceCode, row.cityCode, row.countyCode]
      // let orgStr = row.orgName
      // this.$refs.add.ruleForm = JSON.parse(JSON.stringify(row)) //编辑回显
      // this.$refs.add.ruleForm.areaId = areaId//编辑回显省市区  
      // this.$refs.add.ruleForm.custFullName = orgStr
      // this.$refs.add.code = row.id
      this.$refs.add.userCode = row.id
      console.log(this.$refs.add.userCode, 'this.$refs.add.userCode');
    },
    add(row) {
      this.$refs.add.dialogVisible = true
      this.$refs.add.code = row.id
    },
    // async changStatus(row) {
    //   //改变状态
    //   let res = await statusjz(row.id)
    //   if (res.code === '0000') {
    //     this.$baseMessage('成功', 'success')
    //   }
    // },
    business() {
      this.$router.push({
        path: 'historyDirector',
        query: {

        },
      })
    }
  },
}
</script>

<style lang="scss" scoped>
#userList {
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }

  .teble-list {
    margin: 30px 20px 20px 20px;
  }

  .elTable {
    p {
      margin: 0;
    }
  }
}
</style>
<style>
html body .el-table .headName .cell {
  font-weight: bold;
}
</style>
