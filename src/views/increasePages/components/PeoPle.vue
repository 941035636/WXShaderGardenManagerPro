<template>
  <div id="Situation">

    <!-- 外勤人员 -->

    <div class="set-box">
      <i class="PeoBj"></i>
      <span v-if="params.peoPleType==00">停用后，如有推荐人将无法计算相关奖金，请确认？</span>
      <span v-if="params.peoPleType==01">启用后，如有推荐人将计算相关奖金，请确认？</span>
    </div>

    <div class="set-box">
      <i></i>
      <span class="set-num">姓名与员工号：</span>
      <span style="color: #287fdd;margin-right: 5px;">{{params.fieldPersonnelName?params.fieldPersonnelName:"-"}}</span>
      <span style="color: #287fdd">{{params.fieldPersonnelJobNo?params.fieldPersonnelJobNo:"-"}}</span>
    </div>


    <div class="submit-box">
      <el-button
        type="primary"
        size="small"
        round
        class="cancel"
        
        @click="onCancel()"
        >取消</el-button
      >
      <el-button
        type="success"
        size="small"
        round
        class="submit"
        @click="onSubmit()"
        >确认提交</el-button
      >
    </div>
  </div>
</template>

<script>
import fieldPerson from "../../../service/fieldPerson.js";
export default {
  props: {
    params: {
      type: Object,
      required: true,
      default: function () {
        return {};
      },
    },
   
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      fieldPerson: new fieldPerson(),
    };
  },

  mounted() {},
   
  methods: {
    onCancel() {
      this.$emit("sitCancel");
    },

    async onSubmit() {

      console.log('params',this.params); 
      // return  {status:this.params.peoPleType}
      let res = await this.fieldPerson.alterFieldPersonnelStatus(this.params.id);
          if (res.code === "0000") {
            this.$message.success("修改成功");
            this.$emit("onSubmit");
          }

    },
  },
};
</script>

<style lang="less" scoped>
#Situation {

  .set-box{
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 22px;
    color: #404040;
    i{
      margin: 0 15px 0 30px;
      width: 18px;
      height: 18px;
    }
    .PeoBj{
      
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAUVBMVEX/qUAAAAD/qEH/qD//nTv/qkH/qUH/qUD/qUD/qD//qkD/qkH/p0D/qUD/qUD/qUD/qUH/p0L/qkD/qkH/qkH/qkD/qkD/qUH/qED/qUD/qUDBtZSNAAAAG3RSTlP/AKJVDdF2tGjdDLpAc3/kpjqwM4e/1JKfq5caYaEnAAAAgUlEQVR4nG2QRw6AMAwEvdRAIPT6/4dCXISE4tNkIltrE2IVXT+OfVfwg1XeEFeTm6pFxKpFlZ8hKqOqGPcQdoYK1A5MK7AyDC1N0nADh9BETiADTiFHmcAMXPppygPelDbStik4G/82zjZeQwQgWAiN6pdFZr1RUwul1k4d53fCB6YHA+nv0QrdAAAAAElFTkSuQmCC");
      background-repeat: no-repeat;
    }

    .set-num {
      width: 100px;
      text-align: right;
      
    }
  }
  .submit-box {
    text-align: right;
  }

  .cancel {
    border-color: #bbbbbb;
    color: #5a5a5a;
    background: #f5f5f5;
  }

  .submit {
    border-color: #ffa940;
    color: #fff;
    background: #ffa940;
  }
  .form-div-button {
    .w80 {
      min-width: 80px;
      border: 1px solid #e6a23c;
      color: #e6a23c;
    }
    .el-button--warning {
      background-color: #ffe7ba;
    }
    .check-button {
      display: inline-block;
      border: 1px solid #e6a23c;
      color: #e6a23c;
      height: 36px;
      line-height: 36px;
      border-radius: 20px;
      padding: 0 20px;
      margin-right: 20px;
      cursor: pointer;
      background-color: #fff;
    }
    .el-button:hover {
      background-color: #ffe7ba;
    }
  }
}
</style>