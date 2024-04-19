<template>
  <div id="caseProgress">
    <div class="jindu">
      案件进度
    </div>
    <div class="progress_value">
      <!-- <el-steps direction="vertical" :space="100" :active="2" process-status="wait" finish-status="success">
        <el-step v-for="(item,index) in detail" :key="index" :description="item.createTime" :title="item.trackRecord!=null?item.trackRecord:state.find(itm => itm.value==item.status).label"></el-step>
      </el-steps> -->

      <!-- 进度  -->
      <div class="el-steps el-steps--vertical">
        <div v-for="(item,index) in stepList" :key="index" class="el-step is-vertical" style="flex-basis: 80px;cursor: pointer;" @click="goAnchor(index)">
          <div :class="item.createTime!=''? 'el-step__head is-success':'el-step__head is-wait'">
            <div class="el-step__line" style="margin-right: 0px;">

              <i
                class="el-step__line-inner"
                :style="item.createTime!=''? 'transition-delay: 0ms;border-width: 1px;height:100%;':'transition-delay: 0ms;border-width: 0px;height:0%;'"
              ></i>

            </div>
            <div class="el-step__icon is-text">
              <div class="el-step__icon-inner">

                <i v-if="item.createTime!=''" class="el-step__icon-inner is-status el-icon-check"></i>

              </div>
            </div>
          </div>
          <div class="el-step__main">
            <!-- is-wait -->
            <div class="rightconte">
              <div :class="item.createTime!=''? 'el-step__title is-success':'el-step__title is-wait'">
                {{item.label}}
                <span v-if="item.createTime!=''" class="succ">已完成</span>
                <span v-else class="succs">待处理</span>
              </div>
              <div v-if="item.createTime!=''" :class="item.createTime!=''? 'el-step__description is-success':'el-step__description is-wait'">{{item.createTime||'2020-10-10 20:20:00'}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 进度 -->
    </div>
    <!-- <div v-if="channelStatus == '06' || channelStatus == '07'" class="progress_tip">该案件已结案，请知晓！</div> -->
  </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
  name: "Progress",
  props: {
    channelStatus: {
      type: String,
      default: () => "01",
      required: false
    },
    // detail: {
    //   type: Object,
    //   default: () => [],
    //   required: false
    // }
  },
  computed:{
     ...mapGetters([
        "caseTrackList",
        
    ]),
    stepList(){
      if(this.caseTrackList){
        this.stepData.map(item=>{
          return item.createTime = this.caseTrackList.find(it => it.status == item.value)!=undefined
          ?this.caseTrackList.find(it => it.status == item.value).createTime:''
        })
        return this.stepData;
      }else{
        return this.stepData
      }
    },
  },
  data() {
    return {
      stepData:
      [
        {
          value: "00", 
          label: "已报案",
          createTime:''
        },
        {
          value: "04", 
          label: "案件受理",
          createTime:''
        },
        {
          value: "08", 
          label: "案件基本信息",
          createTime:''
        },
        {
          value: "09", 
          label: "事故经过",
          createTime:''
        },
        {
          value: "10", 
          label: "索赔信息",
          createTime:''
        },
        {
          value: "11", 
          label: "赔付信息",
          createTime:''
        },
        {
          value: "12", 
          label: "上传索赔材料",
          createTime:''
        },
        {
          value: "05", 
          label: "结案审核",
          createTime:''
        },
        {
          value:'06',
          label:'已结案',
          createTime:''
        },
        {
          value:'13',
          label:'回访结束',
          createTime:''
        },
      ]
    }
  },
  methods: {
    goAnchor(index){
      this.$emit("handlerGoAnchor",index)
    }
  }
};
</script>
<style scoped>
#caseProgress {
  /* height: 300px; */
  padding-top: 20px;
}
.progress_tip {
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #6270bd;
  width: 80%;
}
.el-steps--vertical {
}
.el-step__icon {
  align-items: initial;
}
.el-step__icon-inner{
  line-height: initial;
}
.el-step__title{
  line-height: initial !important;
  padding-bottom: 0!important;
}
.el-step__title.is-wait{
  color: #101010;
}
.el-step__description{
  padding-top: 10px;
  padding-right:0px
}
.el-step__description.is-wait{
  color: #101010;
}
.progress_value {
  /* display: flex;
  justify-content: center; */
  padding-left: 20px;
  padding-right: 20px;
}
.jindu{
  font-size: 18px;
  font-weight: bold;
  color: #096DD9;
  line-height: 40px;
  margin-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 20px;
  border-bottom: 1px solid #BBBBBB;
}
.rightconte{
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  color: #101010 !important;
}
.succ{
  display: inline-block;
  padding: 0 10px 0 10px;
  border: 1px solid #E3FFE8;
  background-color: #E3FFE8;
  color: #30CA1F;
  border-radius: 17px;
}
.succs{
  display: inline-block;
  padding: 0 10px 0 10px;
  border: 1px solid #D8F1FF;
  background-color: #D8F1FF;
  color: #1890FF;
  border-radius: 17px;
}
.el-step__title.is-success,.el-step__description.is-success {
    color: #101010 !important;
}
</style>