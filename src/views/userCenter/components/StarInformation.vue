<template>
<!-- 认证资料信息 -->
  <div>
    <div class="StarInformation">
      <div class="head">星级（选填）</div>
      <el-form :model="form" class="demo-ruleForm" label-position="right" label-width="125px" ref="form">
            <el-form-item label="客户星级"  >
              <el-select v-model.trim="form.startLevel" placeholder="请选择客户星级" class="item4">
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
			</el-form>
		</div>
  </div>
</template>

<script>
import enumeration from '../../../../static/data/enumeration.json'
export default {
    props: {},
    data() {
        return {
          options1:enumeration['optionStar'],
          form:{
            startLevel:'',
          },
				}
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      initData(row){
        this.form.startLevel = row.startLevel ? row.startLevel.toString() :''
        console.log(this.form.startLevel);
      },
      submit() {
        let flag = false
        this.$refs.form.validate((valid)=>{
          if(valid) {
            flag = true
          }
        })
        return !flag || this.form
      }      
    },
};
</script>

<style lang="less" scoped>
  .StarInformation{
		margin-top: 10px;
		background-color: #fff;
		padding: 20px 50px;
		.head{
      width: 100%;
      box-sizing: border-box;
      line-height: 22px;
      height: 22px;
      margin-bottom: 20px;
      color: #000000;
      font-size: 18px;
      font-weight: 700;
      padding-left: 24px;
      border-left: 4px solid #FFC069;
    }
		.item4{
			width: 280px;
		}
	}
</style>
