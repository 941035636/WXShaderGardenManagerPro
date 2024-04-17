<template>
  <div id="threeCheck">
    <div class="condition-wrapper">
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">企业名称：</span>
            <el-input
              size="small"
              v-model="form.orgName"
              placeholder="请输入企业名称"
              class="w300"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">社会信用代码：</span>
            <el-input
              v-model="form.blCode"
              size="small"
              class="w300"
              placeholder="请输入企业社会信用代码"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">企业地址：</span>
            <el-cascader
              filterable
              v-model="areaList"
              :options="areaOptions"
              placeholder="请选择企业地址"
              class="w300"
              clearable
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">检查类型：</span>
            <el-select
              class="w300"
              v-model="form.checkType"
              clearable
              placeholder="请选择检查类型"
            >
              <el-option
                v-for="(item, index) in checkTypeList"
                :key="index"
                :label="item.label"
                :value="item.strCode"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">检查日期：</span>
            <el-date-picker
              style="margin-top: 4px"
              class="w300"
              type="daterange"
              v-model="timeData"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
            ></el-date-picker>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <span class="item3">行业分类：</span>
            <el-cascader
              class="w300"
              filterable
              v-model="indystryList"
              :options="industryData"
              :props="{
                label: 'itemText',
                value: 'itemValue',
                children: 'sysDictItemEntitys',
              }"
              clearable
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="24">
          <div style="display: flex; justify-content: center">
            <el-button class="ml20" type="primary" shape="round" @click="query">
              查询
            </el-button>
            <el-button class="ml20" shape="round" @click="reset">
              重置
            </el-button>
            <!-- v-if="$hasBtn('list-add')" -->
            <el-button
              type="primary"
              @click="addCheckRecord"
              v-if="$hasBtn('add-CheckRecord')"
            >
              添加检查记录
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-wrapper">
      <el-row>
        <el-col :span="24">
          <div style="margin-bottom: 8px">
            <span class="searchList">查询列表</span>
            <span class="totNum ml15">共{{ total }}条记录</span>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        :header-cell-style="setRowClass"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          align="center"
          width="200px"
          label="检查类型"
        >
          <template slot-scope="scope">
            <div>
              <span>
                {{
                  checkTypeList.find(
                    (item) => item.strCode == scope.row.checkType
                  ).label
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="left" label="企业信息">
          <template slot-scope="scope">
            <div>
              <p>{{ scope.row.orgName }}</p>
              <p>社会信用代码：{{ scope.row.blCode }}</p>
              <p>
                行业类型：{{ scope.row.industryName
                }}{{ scope.row.industrySecondName }}
              </p>
              <p>
                企业地址：{{ scope.row.provinceName }}/{{
                  scope.row.cityName
                }}/{{ scope.row.countyName }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="left" label="检查信息">
          <template slot-scope="scope">
            <div>
              <p class="span-group">
                <span>检查项：{{ scope.row.checkNum }}</span>
                <span>
                  隐患数：
                  <i class="cred" style="font-style: normal">
                    {{ scope.row.dangerNum }}
                  </i>
                </span>
                <span>整改数：{{ scope.row.rectifyNum }}</span>
              </p>
              <p>
                <span>检查日期：{{ scope.row.checkTime }}</span>
              </p>
              <p v-if="scope.row.isPunish">
                <span>
                  是否被处罚：
                  <el-switch
                    v-model="scope.row.isPunish"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :disabled="true"
                  ></el-switch>
                </span>
                <span style="margin-left: 30px">
                  处罚金额：
                  <span v-if="scope.row.punishAmount">￥</span>
                  {{ scope.row.punishAmount }}
                </span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          align="center"
          width="250"
          label="操作信息"
        >
          <template slot-scope="scope">
            <div>
              <p>{{ scope.row.updatePerson }}</p>
              <p>{{ scope.row.updateTime }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="center" width="200px" label="操作">
          <template slot-scope="scope">
            <div>
              <p
                class="c096DD9 edit"
                v-if="$hasBtn('update-check')"
                @click="edit(scope.row)"
              >
                修改
              </p>
              <p
                class="c096DD9 check-detail"
                v-if="$hasBtn('delete-check')"
                @click="delData(scope.row)"
              >
                删除
              </p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="form.pn"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <div>
      <add-check
        ref="addCheck"
        :titleName="titleName"
        :checkTypeList="checkTypeList"
        :industryData="industryData"
        :areaOptions="areaOptions"
      ></add-check>
    </div>
  </div>
</template>

<script>
import { addCheck } from '../components'
import { getAreaDetail } from '@/api/Areas'
import { getDictData } from '@/api/userManagement'
import { getList, getDetail, delCheck } from '@/api/threeCheck'
import { mapGetters } from 'vuex'
export default {
  name: 'threeCheckList',
  components: {
    addCheck,
  },
  data() {
    return {
      titleName: '添加检查记录',
      total: 10,
      areaOptions: [],
      industryData: [], // 行业分类
      timeData: [], // 检查时间集合
      areaList: [], //企业地址集合
      indystryList: [],
      form: {
        blCode: '', //社会信用代码
        checkType: '', //检查类型
        cityCode: '', //市编码 ,
        cityName: '', //市名称 ,
        countyCode: '', //区编码 ,
        countyName: '', //区名称 ,
        desc: '', // 是否为倒序 ,
        endCheckTime: '', //截止检查日期 ,
        industryCode: '', // 一级行业分类编码 ,
        industryName: '', // 一级行业分类名称 ,
        industrySecondCode: '', // 二级行业分类编码 ,
        industrySecondName: '', // 二级行业分类名称 ,
        orderby: '', // 排序字段 ,
        orgName: '', //企业名称 ,
        provinceCode: '', // 省编码 ,
        provinceName: '', // 省名称 ,
        startCheckTime: '', // 起始检查日期
        pn: 1,
        ps: 10,
      },
      tableData: [],
    }
  },
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  created() {
    this.getDict()
    this.getAera()
    this.getList()
  },
  methods: {
    async getList() {
      this.checkTypeList = this.getStrEnumAll.CheckTypeEnum
      let res = await getList(this.form)
      if (res.code == '0000') {
        this.tableData = res.list
        this.total = res.total
      }
    },
    query() {
      this.form.industryCode =
        this.indystryList.length > 0 ? this.indystryList[0] : ''
      this.form.industrySecondCode =
        this.indystryList.length > 0 ? this.indystryList[1] : ''
      this.form.provinceCode = this.areaList[0] || ''
      this.form.cityCode = this.areaList[1] || ''
      this.form.countyCode = this.areaList[2] || ''
      if (this.timeData.length > 0) {
        this.form.startCheckTime = this.timeData[0] + ' 00:00:00' || ''
        this.form.endCheckTime = this.timeData[1] + ' 23:59:59' || ''
      }

      console.log(this.form)
      this.getList()
    },
    reset() {
      ;(this.timeData = []), // 检查时间集合
        (this.areaList = []), //企业地址集合
        (this.indystryList = []),
        (this.form = {
          blCode: '', //社会信用代码
          checkType: '', //检查类型
          cityCode: '', //市编码 ,
          cityName: '', //市名称 ,
          countyCode: '', //区编码 ,
          countyName: '', //区名称 ,
          desc: '', // 是否为倒序 ,
          endCheckTime: '', //截止检查日期 ,
          industryCode: '', // 一级行业分类编码 ,
          industryName: '', // 一级行业分类名称 ,
          industrySecondCode: '', // 二级行业分类编码 ,
          industrySecondName: '', // 二级行业分类名称 ,
          orderby: '', // 排序字段 ,
          orgName: '', //企业名称 ,
          provinceCode: '', // 省编码 ,
          provinceName: '', // 省名称 ,
          startCheckTime: '', // 起始检查日期
          pn: 1,
          ps: 10,
        })
      this.getList()
    },
    async edit(val) {
      this.titleName = '修改检查记录'
      let res = await getDetail(val.id)
      if (res.code == '0000') {
        console.log(res, 'xfdgdfgdfsg')
        let areaList = [] // 地区，回显使用
        areaList[0] = res.data.provinceCode
        areaList[1] = res.data.cityCode
        areaList[2] = res.data.countyCode
        res.data['areaList'] = areaList
        let industryList = [] // 行业回显
        industryList[0] = res.data.industryCode
        if (res.data.industrySecondCode) {
          industryList[1] = res.data.industrySecondCode
        }
        res.data['industryList'] = industryList
        this.$refs.addCheck.form = res.data
        console.log(this.$refs.addCheck.form)
        this.$refs.addCheck.dialogVisible = true
      }
    },
    checkDetail() {
      this.$refs.addCheck.dialogVisible = true
    },
    addCheckRecord() {
      // 添加检查记录
      this.titleName = '添加检查记录'
      this.$refs.addCheck.dialogVisible = true
    },
    delData(val) {
      // 删除
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res = await delCheck(val.id)
          console.log(res)
          if (res.code == '0000') {
            this.$message.success('删除成功')
            this.getList()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    setRowClass({ row, column, rowIndex, columnIndex }) {
      return rowIndex == 0 ? 'background: #E8E8E8' : ''
    },
    handleCurrentChange(pn) {
      this.form.pn = pn
      this.getList()
    },
    async getDict() {
      const { code, data } = await getDictData(true, 20003)
      if (code == '0000') {
        this.industryData = data
      }
    },
    async getAera() {
      const { code, data } = await getAreaDetail(sysConfig.provice, 0, {
        levels: '1,2,3',
      })
      if (code == '0000') {
        this.areaOptions = data
      }
    },
  },
}
</script>

<style lang="scss">
#threeCheck {
  .el-form-item__label {
    margin-top: 1px;
  }
  .condition-wrapper {
    margin: 20px 20px 8px 20px;
  }
  .condition-wrapper .el-cascader--small {
    line-height: 40px;
  }
  .row-bg {
    margin-bottom: 8px;
    line-height: 40px;
  }
  .table-wrapper {
    margin: 8px 20px 20px 20px;
    p {
      margin: 0;
    }
    .span-group {
      span {
        margin-right: 25px;
      }
    }
  }
  .check-detail,
  .edit {
    cursor: pointer;
  }
  .pagination-wrapper {
    padding: 20px 0;
  }
  .c096DD9 {
    color: #096dd9;
  }
  .cFA8C16 {
    color: #fa8c16;
  }
  .c52CC6F {
    color: #52cc6f;
  }
  .cred {
    color: red;
  }
}
</style>

<style>
html body #threeCheck .el-table .el-table__header-wrapper .cell {
  font-weight: 800;
}
</style>