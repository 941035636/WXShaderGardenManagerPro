<template>
  <div id="ueditor"></div>
</template>
<script>
import'../../../../static/UEditor/ueditor.config.js'
import'../../../../static/UEditor/ueditor.all.js'
import'../../../../static/UEditor/lang/zh-cn/zh-cn.js'
import'../../../../static/UEditor/ueditor.parse.min.js'

export default {
  data() {
    return {
      ueditor:{},
      flag:true,
    }
  },
  props:{
    content:{
      type:String,
      default:()=>""
    },
    config:{
      type:Object,
      default:()=>{
        return {
          initialFrameWidth: null,
          initialFrameHeight: 600,
          UEDITOR_HOME_URL: 'static/UEditor/'
        }
      }
    },
  },
  computed: {
    DefaultConfig() { //默认设置
        let obj = this.config;
        let serverUrl = this.$apiUrl.ueditor //服务器地址
        return {
            serverUrl,
            ...obj
        }
    }
  },
  mounted(){
    this.initUeditor();
  },
  
  watch:{
    content:{
      handler(cur,old){
        this.ueditor.setContent(cur);
      }
    }
  },
  methods:{
    initUeditor(){
      this.$nextTick(() => {
        this.ueditor = UE.getEditor('ueditor',this.DefaultConfig) // 初始化UE
        this.ueditor.addListener("ready", () => {
            if (this.content == "") {
                this.ueditor.setContent('');
            } else {
                this.ueditor.setContent(this.content);
            }
        });
        this.ueditor.addListener("contentChange", () => { //监听内容变化
            this.getUEContent();
        })
      })
    },
    getUEContent() { // 获取内容方法
        let content = this.ueditor.getContent();
        // content = content.replace(/<p([\s\S]*?)<\/p>/g, "<div$1</div>"); // 将默认p标签设置为div标签
        this.$emit("getUEContent", content)
        
    }
  },
  destroyed(){
    this.ueditor.destroy();
  },
}
</script>