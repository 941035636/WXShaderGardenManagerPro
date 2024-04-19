<template>
  <el-dialog
    title="查看风险辨识详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
  >
    <el-timeline>
      <el-timeline-item :timestamp="data.createTime | format" placement="top">
        <div>
          <Table :box-two="true" lable-left="风险等级">
            <template slot="rightTwo">
              <span v-if="data.level === 1" class="color-red">红</span>
              <span v-if="data.level === 2" class="col-FFA940">橙</span>
              <span v-if="data.level === 3" class="color-orange">黄</span>
              <span v-if="data.level === 4" class="color-blue">蓝</span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="风险源">
            <template slot="rightTwo">
              <span>{{ data.remark }}</span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="辨识日期">
            <template slot="rightTwo">
              <span>{{ data.checkDate | format("YYYY-MM-DD") }}</span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="具体描述">
            <template slot="rightTwo">
              <span>{{ data.foundation }}</span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="管控措施建议">
            <template slot="rightTwo">
              <span>{{ data.advice }}</span>
            </template>
          </Table>
          <Table
            :box-two="true"
            :border-bot-flag="true"
            lable-left="风险照片"
            lable-right=""
            value-right=""
          >
            <template slot="rightTwo">
              <div class="display-flex">
                <div
                  v-for="(v1, key1) in imgUrlList"
                  :key="key1"
                  class="danger-img-box"
                  @click="enlargeImg(v1)"
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
        :timestamp="item.accidentPreRecheckEntity.createTime | format"
        placement="top"
      >
        <div>
          <Table :box-two="true" lable-left="管控状态">
            <template slot="rightTwo">
              <span class="color-green">
                {{
                  item.accidentPreRecheckEntity.rectificationStatus === 2
                    ? '已整改'
                    : '未整改'
                }}
              </span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="管控日期">
            <template slot="rightTwo">
              <span>
                {{ item.accidentPreRecheckEntity.reviewDate | format("YYYY-MM-DD") }}
              </span>
            </template>
          </Table>
          <Table :box-two="true" lable-left="管控描述">
            <template slot="rightTwo">
              <span>{{ item.accidentPreRecheckEntity.reviewResult }}</span>
            </template>
          </Table>
          <Table
            :box-two="true"
            :border-bot-flag="true"
            lable-left="管控照片"
            lable-right=""
            value-right=""
          >
            <template slot="rightTwo">
              <div class="display-flex">
                <div
                  v-for="(v1, key1) in item.imgUrl"
                  :key="key1"
                  class="danger-img-box"
                  @click="enlargeImg(v1)"
                >
                  <img :src="v1" />
                </div>
              </div>
            </template>
          </Table>
        </div>
      </el-timeline-item>
    </el-timeline>
    <ImgDialog ref="ImgDialog" />
  </el-dialog>
</template>

<script>
  import { getDanger } from '@/service/accidentManagement'
  import ResourcesService from '@/service/ResourcesService'
  import Table from './table'
  import ImgDialog from '@/components/ImgDialog'
  export default {
    name: 'dangerDetails',
    components: {
      Table,
      ImgDialog,
    },
    props: {},
    data() {
      return {
        dialogVisible: false,
        ResourcesService: new ResourcesService(),
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
        try{
          for (let key of this.data.url) {
            let data = await this.getImgFile(key)
            imgUrlList.push(data)
          }
          this.imgUrlList = imgUrlList
        }catch(e){
          console.log(e);
        }
        
      },
      async getDanger(val) {
        let res = await getDanger(val.id)
        if (res.code === '0000') {
          res.data.dangerRecheckResp.forEach((item) => {
            item.imgUrl = []
            try{
              item.url.forEach(async (v1) => {
                let imgUrl = await this.getImgFile(v1)
                item.imgUrl.push(imgUrl)
              })
            }catch(e){
              console.log(e);
            }
          })
          this.list = res.data.dangerRecheckResp
        } else {
          this.list = []
        }
      },
      async getImgFile(id) {
        let { url } = await this.ResourcesService.downloadOrViewFile(id)
        return url
      },
      enlargeImg(src) {
        this.$refs.ImgDialog.open(src)
      },
    },
  }
</script>

<style lang="less" scoped>
  .danger-img-box {
    width: 100px;
    height: 100px;
    margin-left: 10px;
    margin-top: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .display-flex {
    display: flex;
    flex-wrap: wrap;
  }
</style>
