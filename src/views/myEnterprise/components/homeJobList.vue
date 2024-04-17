<!-- 清单排查 -->
<template>
  <div id="Inventory">
    <div class="title-box">
      <!-- <p class="title-name">
        {{
          endata.sysPost && endata.sysPost.postName
            ? endata.sysPost.postName
            : '-'
        }}-隐患排查清单
      </p> -->
      <!-- <el-row class="title-item">
        <el-col :span="8">
          <span class="pl20">录入人员：{{ endata.userName || '-' }}</span>
        </el-col>
        <el-col :span="8">
          <span>所属部门：{{ endata.sysDept.deptName || '-' }}</span>
        </el-col>
        <el-col :span="8">
          <span>
            所在岗位：{{
              endata.sysPost && endata.sysPost.postName
                ? endata.sysPost.postName
                : '-'
            }}
          </span>
        </el-col>
      </el-row> -->
      <p>
        <span class="pr20">
          共计
          <span>{{ DangerByUserArr.total }}</span>
          条记录
        </span>
        排查进度：本周期内共有
        <span class="col18">{{ ByUserCount.checkHiddenTotal || '0' }}</span>
        个排查清单，应查共计
        <span class="col18">{{ ByUserCount.checkTotal || '0' }}</span>
        项、已查
        <span class="col18">{{ ByUserCount.checkNum || '0' }}</span>
        项、未查
        <span class="col18">{{ ByUserCount.unCheckNum || '0' }}</span>
        项，完成率
        <span class="col18">{{ ByUserCount.completionRate || '00.00%' }}</span>
        ，发现隐患数：
        <span class="col18">{{ ByUserCount.hiddenNum || '0' }}</span>
        个
      </p>

      <el-table
        :data="DangerByUserArr.records"
        border
        header-row-class-name="headName"
        :header-cell-style="getRowClass"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="清单名称" min-width="200">
          <template slot-scope="scope">
            <div>
              <div>{{ scope.row.standardName }}</div>
              <div style="color: #096dd9">
                周期：
                {{
                  scope.row.frequencyFlag +
                  '' +
                  ' 至 ' +
                  '' +
                  scope.row.frequencyFlagTwo
                }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属部门（岗位）" min-width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.deptName && scope.row.postName">
              {{ scope.row.deptName + '（' + scope.row.postName + '）' }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="frequency"
          label="排查频次"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="已排查">
          <template slot-scope="scope">
            <div style="color: #f4b478">{{ scope.row.checkNum }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="未排查">
          <template slot-scope="scope">
            <span class="color-blue">{{ scope.row.uncheckNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发现隐患数" align="center">
          <template slot-scope="scope">
            <div style="color: #be352a">{{ scope.row.findHazardNum }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="进度">
          <template slot-scope="scope">
            <div style="font-weight: bold">{{ scope.row.completionRate }}</div>
            <div v-if="scope.row.flag === '0'" style="color: #f5222d">
              未按时完成
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <span
              v-if="scope.row.checkOver === '1' || headquarters"
              style="color: #1990ff; cursor: pointer"
              @click="goDanger(scope.row, '1')"
            >
              查看
            </span>
            <span
              v-if="scope.row.checkOver != '1' && !headFlag"
              style="color: #1990ff"
              @click="goDanger(scope.row)"
            >
              {{ scope.row.checkNum > 0 ? '继续排查' : '开始排查' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="DangerByUserArr.total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="详情" width="1200px" :visible.sync="dialogFormVisible11">
      <StartDanger :endata="endatas" :key="key" />
    </el-dialog>
  </div>
</template>
<script>
import StartDanger from './startDanger.vue'
export default {
  components: {
    StartDanger,
  },
  props: {
    endata: {
      type: Object,
      required: true,
    },
    ByUserCount: {
      type: Object,
      required: true,
    },
    DangerByUserArr: {
      required: true,
    },
  },
  data() {
    return {
      dialogFormVisible11: false,
      endatas: {},
      headquarters: false,
      headFlag: false, // 首页隐患排查企业总部管理员不能开始排查，因菜单展示问题，不能配置菜单权限
      key: false,
    }
  },
  created() {
    let headquartersData = window.sessionStorage.getItem('roles').split(',')
    for (let key in headquartersData) {
      if (headquartersData[key] === 'RL1453251619998273537') {
        this.headquarters = true
      }
      if (headquartersData[key] === 'RL1661181862950866945') {
        // 企业总部管理员
        this.headFlag = true
      }
    }
  },
  methods: {
    handleCurrentChange(e) {
      this.$emit('handleCurrentChange', e)
    },
    goDanger(e, key) {
      // if (key) {
      //   this.key = true
      // }
      // this.endatas = e
      // this.dialogFormVisible11 = true

      this.$router.push({
        path: 'startDanger',
        query: {
          row: JSON.stringify(e),
          key: key,
          name: this.endata.userName,
        },
      })
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f5f5f5'
      } else {
        return ''
      }
    },
    // handleCurrentChange(pn) {
    //   this.pn = pn
    // },
  },
}
</script>
<style lang="scss" scoped>
#Inventory {
  .title-box {
    padding: 10px;
    .title-name {
      font-size: 20px;
      text-align: center;
      font-weight: bold;
      font-size: 24px;
      color: #101010;
    }
    .title-item {
      border: 1px dashed #1890ff;
      border-radius: 5px;
      line-height: 60px;
    }
  }
  .col18 {
    color: #1890ff;
  }
}
</style>