<template>
  <el-dialog
    id="detail"
    title="政府机构详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @open="initData"
    width="50%"
  >
    <div class="box">
      <div class="title mb20 mt20">机构信息</div>
      <el-table :data="tableList" border :header-cell-style="getRowClass">
        <el-table-column
          prop="name"
          align="center"
          label="政府机构名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="dataAreaName"
          label="管辖区域"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="监管行业" align="center" show-overflow-tooltip>
          <template>
            <span v-for="(item, index) in supervisionIndustry1" :key="index">
              {{ item.industryName }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="title mb10 mt20">政府机构名称：</div>
      <p>
        <span>姓名：</span>
        <span>{{ data.contactName }}</span>
        <span>({{ typeName }})</span>
      </p>
      <p>
        <span>联系电话：</span>
        <span>{{ data.phoneNum }}</span>
      </p>
      <p>
        <span>联系地址：</span>
        <span>{{ data.perAreaName }}</span>
        <!-- <span v-if="data.cityName">/{{ data.cityName }}</span>
        <span v-if="data.countyName">/{{ data.countyName }}</span> -->
        <span v-if="data.address">,{{ data.address }}</span>
      </p>
      <!-- <div class="title mb10 mt20">关联信息</div> -->
      <!-- <p>
        <span>授权key：</span>
        <span>{{ data.urlKey }}</span>
      </p> -->
    </div>
  </el-dialog>
</template>

<script>
import { getAreaName } from '@/api/Areas'
import { getYingJiZhanghaoDetail } from '@/api/userManagement'
import { mapGetters } from 'vuex'
export default {
  name: 'YingJiJuDetail',
  props: {
    typeData: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    roleData: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      data: {},
      tableList: [],
      code: '',
      supervisionIndustry1: []
    }
  },
  computed: {
    typeName() {
      return this.typeData && this.data && this.data.duty
        ? this.typeData.find((item) => item.code === this.data.duty).label
        : ''
    },
    ...mapGetters({
      areaList: 'areas/areaList',
      areaListAll: 'areas/areaListAll',
      areaMap: 'areas/areaMap',
    }),
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#E6F7FF; color:#0050B3;'
      } else {
        return ''
      }
    },
    async initData() {
      let res = await getYingJiZhanghaoDetail(this.code)
      if (res.code === '0000') {
        let res1 = await getAreaName(res.data.addressAreaCode)

        res.data.perAreaName = new Array()
        res1.data.map((item) => {
          res.data.perAreaName.unshift(item.regionName)
        })
        res.data.perAreaName = res.data.perAreaName.join(',')
        this.data = res.data
        this.supervisionIndustry1 = res.data.supervisionIndustry
        this.tableList = [
          {
            name: res.data.name,

            dataAreaName:
              res.data.provinceName +
              '/' +
              res.data.cityName +
              '/' +
              res.data.countyName,
          },
        ]
        if (res.data.streetName) {
          this.tableList = [
            {
              name: res.data.name,

              dataAreaName:
                res.data.provinceName +
                '/' +
                res.data.cityName +
                '/' +
                res.data.countyName +
                '/' +
                res.data.streetName,
            },
          ]
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#detail {
  .title {
    display: inline-block;
    width: 120px;
    text-align: left;
    font-weight: 700;
  }
  .row {
    line-height: 40px;
  }
  .box {
    padding: 0 50px;
  }
}
</style>
