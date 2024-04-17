<template>
  <el-dialog
    title="查看隐患详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
  >
    <el-timeline>
      <el-timeline-item :timestamp="data.createTime | setTime" placement="top">
        <div>
          <Table :box-two="true" lable-left="隐患等级">
            <template #rightTwo>
              <span class="color-red">
                {{ data.level === 1 ? '一般' : '重大' }}
              </span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="检查日期">
            <template #rightTwo>
              <span>{{ data.checkDate | setTime }}</span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="隐患描述">
            <template #rightTwo>
              <span>{{ data.remark }}</span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="判断依据">
            <template #rightTwo>
              <span>{{ data.foundation }}</span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="整改建议">
            <template #rightTwo>
              <span>{{ data.advice }}</span>
            </template>
          </Table>
          <Table
            :box-two="true"
            :border-bot-flag="true"
            lable-left="隐患照片"
            lable-right=""
            value-right=""
          >
            <template #rightTwo>
              <div class="display-flex">
                <div
                  v-for="(v1, key1) in imgUrlList"
                  :key="key1"
                  class="danger-img-box"
                >
                  <img :src="v1" />
                </div>
              </div>
            </template>
          </Table>
        </div>
      </el-timeline-item>
      <el-timeline-item
        v-for="(item, key) in list"
        :key="key"
        :timestamp="item.accidentPreRecheckEntity.createTime | setTime"
        placement="top"
      >
        <div>
          <Table :box-two="true" lable-left="整改状态">
            <template #rightTwo>
              <span class="color-green">
                {{
                  item.accidentPreRecheckEntity.rectificationStatus === 2
                    ? '已整改'
                    : '未整改'
                }}
              </span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="复查日期">
            <template #rightTwo>
              <span>
                {{ item.accidentPreRecheckEntity.reviewDate | setTime }}
              </span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="复查描述">
            <template #rightTwo>
              <span>{{ item.accidentPreRecheckEntity.reviewResult }}</span>
            </template>
          </Table>
          <Table
            :box-two="true"
            :border-bot-flag="true"
            lable-left="隐患照片"
            lable-right=""
            value-right=""
          >
            <template #rightTwo>
              <div class="display-flex">
                <div
                  v-for="(v1, key1) in item.imgUrl"
                  :key="key1"
                  class="danger-img-box"
                >
                  <img :src="v1" />
                </div>
              </div>
            </template>
          </Table>
        </div>
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script>
import { getDanger } from '@/api/accidentManagement'
import { getImgFile } from '@/api/resources'
import Table from './table'
export default {
  name: 'AddOrAlter',
  components: {
    Table,
  },
  props: {},
  data() {
    return {
      dialogVisible: false,
      data: {},
      list: [],
      imgUrlList: [],
    }
  },
  computed: {},
  mounted() {
    // this.initRole()
  },
  methods: {
    async initData(val) {
      this.dialogVisible = true
      this.getDanger(val)
      this.data = val
      let imgUrlList = []
      for (let key of this.data.url) {
        let data = await this.getImgFile(key)
        imgUrlList.push(data)
      }
      this.imgUrlList = imgUrlList
    },
    async getDanger(val) {
      let res = await getDanger(val.id)
      if (res.code === '0000') {
        res.data.dangerRecheckResp.forEach((item) => {
          item.imgUrl = []
          if (item.url) {
            item.url.forEach(async (v1) => {
              let imgUrl = await this.getImgFile2(v1)
              item.imgUrl.push(imgUrl)
            })
          }
        })
        this.list = res.data.dangerRecheckResp
      } else {
        this.list = []
      }
    },
    async getImgFile(url) {
      let res = await getImgFile(url.url)
      return res.data
    },
    async getImgFile2(url) {
      let res = await getImgFile(url)
      return res.data
    },
  },
}
</script>

<style lang="scss" scoped>
.danger-img-box {
  width: 100px;
  height: 100px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
