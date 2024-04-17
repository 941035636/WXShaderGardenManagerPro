<template>
  <div id="selectOrg">
    <el-dialog
      class="selOrg"
      title="选择项目信息"
      :visible.sync="dialogFormVisible"
      width="1200px"
    >
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="150px"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item label="项目名称：">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="ruleForm.projectName"
            class="w450"
            size="small"
            :debounce="700"
            :fetch-suggestions="querySearch"
            placeholder="请输入项目名称"
            :trigger-on-focus="true"
            hide-loading
            clearable
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="item-sel">
                <p>{{ item.projectName }}({{ item.belongToYear }})</p>
                <p>
                  {{ item.provinceName }}{{ item.cityName
                  }}{{ item.countyName }},{{ item.detailAddress }}
                </p>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <div class="orgTip">
            <i class="el-icon-warning"></i>
            请输入项目名称
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { project } from '@/api/userDataManagement'
export default {
  name: 'InsuranceFactor',
  props: {},
  components: {
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
      areaList: 'areas/areaList',
      getStrEnumAll: 'enums/getStrEnumAll',
      organizationEntity: 'policyInfo/organizationEntity',
      insuredInfoParam: 'policyInfo/insuredInfoParam'
    }),

  },
  mounted() {
  },

  data() {
    return {
      dialogXg: '',
      construction: '建筑施工',
      dialogFormVisible: false,
      ruleForm: {
        projectName: '',//项目名称
        address: '',//经营地址
        detailAddres: '',//详细地址
      },
      rules: {

      },
      List: [], //模糊查询列表
      projectList: []
    }
  },
  methods: {
    querySearch(queryString, cb) {
      if (this.dialogXg) { //修改查询 项目信息 
        project(this.insuredInfoParam.blCode, queryString).then((res) => {
          var List = []
          setTimeout(() => {
            if (!res.list) {
              cb(List)
            }
          }, 2000)
          if (res.list) {
            // List = res.list.map((item) => {
            res.list.forEach((item) => {
              if (item.dataStatus) {
                console.log(item, 'elementelement');
                List.push(item)
              }
              this.projectList = item
              return { value: item.projectName, ...item }
            })
            cb(List) // 调用 callback 返回建议列表的数据
          }
        })
      } else {
        var List = []
        if (queryString) {
          List = this.organizationEntity.projectList.filter((item) => {
            if (item.projectName.indexOf(queryString) != -1) {
              this.projectList = item
              return { value: item.projectName, ...item }
            }
          })
          if (List.length == 0) {
            this.$message.error('暂无项目信息，请重新搜索');
          }
          cb(List) // 调用 callback 返回建议列表的数据
        }
      }
    },
    handleSelect(e) {
      console.log(e, 'this.$refs.addHolder.data = this.organizationEntity');
      e['construction'] = '建筑施工'
      this.dialogFormVisible = false
      this.$emit('projectOen', e)
    }
  },

}
</script>

<style lang='scss' >
.my-autocomplete li .item-sel {
  padding: 5px 10px 10px 10px;
  border-bottom: 1px solid #ccc;

  p {
    margin: 0;
    height: 26px;
    line-height: 26px;
    font-size: 13px;
  }
}
.orgTip {
  background-color: #dbf9ef;
  color: #34c697;
  width: 450px;
  box-sizing: border-box;
  padding-left: 10px;
  i {
    font-size: 16px;
    margin-right: 5px;
  }
}
</style>
