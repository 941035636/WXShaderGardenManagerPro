<template>
  <div>
    <div v-loading="loading" class="container">
      <!--标题-->
      <div class="system-board-title">
        <!-- <span>系统看板</span> -->
        <div class="query">
          <span>系统指标</span>
          <el-date-picker
            v-model="startYear"
            :picker-options="dealDateStartOptions"
            value-format="yyyy"
            type="year"
            placeholder="选择年"
            @change="getStatistics"
          ></el-date-picker>
        </div>
      </div>
      <el-row>
        <el-col
          v-for="(item, key) in colList"
          :key="key"
          :span="8"
          class="gutter-row"
        >
          <div class="gutter-box">
            <div
              class="system-card"
              :style="{
                backgroundImage: `url(${item.bgcUrl})`,
              }"
            >
              <span>{{ item.title }}</span>
              <div class="line">
                <span></span>
                <img src="@/assets/images/fenge.png" />
                <span></span>
              </div>
              <div class="contents">
                <div class="img-area">
                  <img :src="item.iconUrl" alt="" />
                </div>
                <div class="text-area">
                  <span class="num">{{ item.num }}</span>
                  <span class="quantity">单位：{{ item.company }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import { getStatistics } from '@/api/user'
  import { mapGetters } from 'vuex'
  export default {
    name: 'Statis',
    components: {},
    filters: {
      getPrem(v) {
        let num = v / 10000
        return parseInt(num)
      },
    },
    props: {},
    data() {
      return {
        loading: false, // 局部加载
        dealDateStartOptions: {
          disabledDate(time) {
            //禁用当前时间之前的时间
            let t = new Date('2021-01-01').getTime()
            return time.getTime() < t
          },
        },
        startYear: '', // 时间
        count: {
          corpCount: '0',
          insuredAmount: '0',
          claimAmountl: '0',
          caseCount: '0',
          accidentCount: '0',
        },
        colList: [
          {
            title: '投保企业数量',
            bgcUrl: require('@/assets/images/bgc-1.png'),
            iconUrl: require('@/assets/images/icon-1.png'),
            company: '家',
            key: 'insuranceNum',
            companyUnit: 1,
            num: 0,
          },
          {
            title: '累计保费',
            bgcUrl: require('@/assets/images/bgc-2.png'),
            iconUrl: require('@/assets/images/icon-2.png'),
            company: '万元',
            companyUnit: 10000,
            key: 'totalPerm',
            num: 0,
          },
          {
            title: '累计保额',
            bgcUrl: require('@/assets/images/bgc-3.png'),
            iconUrl: require('@/assets/images/icon-3.png'),
            company: '亿元',
            companyUnit: 100000000,
            key: 'totalAmount',
            num: 0,
          },
          {
            title: '预防费用',
            bgcUrl: require('@/assets/images/bgc-4.png'),
            iconUrl: require('@/assets/images/icon-4.png'),
            company: '万元',
            companyUnit: 10000,
            key: 'preventionPerm',
            num: 0,
          },
          {
            title: '累计案件赔案',
            bgcUrl: require('@/assets/images/bgc-5.png'),
            iconUrl: require('@/assets/images/icon-5.png'),
            company: '件',
            companyUnit: 10000,
            key: 'caseNum',
            num: 0,
          },
          {
            title: '理赔金额',
            bgcUrl: require('@/assets/images/bgc-6.png'),
            iconUrl: require('@/assets/images/icon-6.png'),
            company: '元',
            companyUnit: 1,
            key: 'totalLoss',
            num: 0,
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        areaList: 'areas/areaList',
        areaListAll: 'areas/areaListAll',
        areaMap: 'areas/areaMap',
        userDataPopedomAreas: 'user/userDataPopedomAreas',
      }),
    },
    created() {},
    mounted() {
      this.getStatistics()
    },
    methods: {
      async getStatistics() {
        let obj = {
          startYear: this.startYear ? this.startYear + '-01-01 00:00:00' : '',
        }
        let { code, data } = await getStatistics(obj)
        if (code === '0000') {
          this.colList = this.colList.map((item) => {
            let num = data[item.key] / item.companyUnit
            item.num = Math.ceil(num)
            return item
          })
        }
      },
      // 处理选中应急局管辖区域省市区方法
      handleChangeJurisdiction(e) {
        this.ruleForm.dataArea = e[e.length - 1]
        let provinceName = this.areaMap[e[0]] || ''
        let cityName = this.areaMap[e[1]] || ''
        let countyName = this.areaMap[e[2]] || ''
        this.ruleForm.dataAreaName = `${provinceName}${cityName}${countyName}`
      },
    },
  }
</script>
<style scoped lang="scss">
  .container {
    padding: 20px 20px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
    .system-board-title {
      width: 100%;
      height: 52px;
      line-height: 52px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      .name {
        height: 52px;
        line-height: 52px;
        font-size: 22px;
        position: relative;
        padding-left: 20px;
      }
      .query {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 52px;
        line-height: 52px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding-right: 10px;
        span {
          display: inline-block;
          margin-right: 6px;
        }
      }
    }
    .gutter-row {
      padding: 0 10px;
      box-sizing: border-box;
      .gutter-box {
        margin: 10px 0;
        .system-card {
          background-position: 0 0;
          background-repeat: repeat-x;
          background-size: contain;
          border-radius: 4px;
          border: 1px solid #eaeaea;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
          padding: 0 28px;
          span {
            color: #fff;
            display: inline-block;
            font-size: 18px;
            text-align: center;
            padding: 10px 0;
            line-height: 1.5;
          }
          .line {
            display: flex;
            span {
              width: 100%;
              height: 1px;
              background-color: hsla(0, 0%, 100%, 0.3);
              -webkit-box-flex: 1;
              -ms-flex: 1;
              flex: 1;
              padding: 0;
            }
            img {
              vertical-align: middle;
              border-style: none;
            }
          }
          .contents {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            padding-bottom: 12px;
            .img-area {
              width: 64px;
              height: 64px;
              border-radius: 100%;
              text-align: center;
              line-height: 64px;
              background-color: hsla(0, 0%, 100%, 0.3);
            }
            .text-area {
              -webkit-box-flex: 1;
              -ms-flex: 1;
              flex: 1;
              -webkit-transform: translateX(-32px);
              transform: translateX(-32px);
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-orient: vertical;
              -webkit-box-direction: normal;
              -ms-flex-direction: column;
              flex-direction: column;
              text-align: center;
              .num {
                font-size: 30px;
                font-weight: 700;
              }
              .quantity {
                font-size: 18px;
                padding-left: 6px;
              }
            }
          }
        }
      }
    }
  }
  .area-text {
    margin-left: 20px;
    font-size: 18px;
    color: #101010;
    display: inline-block;
    width: 30%;
    line-height: 32px;
    text-align: right;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
