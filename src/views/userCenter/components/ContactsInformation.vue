<template>
<!-- 认证资料信息 -->
  <div>
    <div class="ContactsInformation">
      <div class="head">联系人信息</div>
      <el-form :model="form" class="demo-ruleForm" label-position="right" label-width="125px" :rules="rules" ref="form">
				<el-row>
          <el-col :span="8">
            <el-form-item label="联系人" prop="fullname">
              <el-input placeholder="请输入社会信用代码" v-model.trim="form.fullname" class="item4" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人电话" prop="phone" >
              <el-input placeholder="请输入联系人电话" v-model.trim="form.phone" class="item4" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" class="item4" autocomplete></el-input>
        </el-form-item>
        <el-form-item label="联系地址" required>
						<div style="display:flex;">
							<el-form-item prop="selectedOptions" >
								<el-cascader :options="areaData"  placeholder="请选择" v-model="form.selectedOptions" @change="handleChange" class="item1"  clearable></el-cascader>
							</el-form-item>
							<el-form-item prop="linkAddress">
								<el-input v-model="form.linkAddress" class="item4" autocomplete></el-input>
							</el-form-item>
						</div>
					</el-form-item>
			</el-form>
		</div>
  </div>
</template>

<script>
import getCascaderObj from '../js/selectedOptions'
export default {
    props: {
      areaData:{
        type:Array,
        default:()=>{
          return []
        }
      },
    },
    data() {
        var checkPhone = (rule, value, callback) => {
          var reg = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\d3)|(\d{3}\-))?(1[3456789]\d{9})$)/;
          if (!value) {
            return callback(new Error("请输入电话号码"));
          } else if (!reg.test(value)) {
            callback(new Error("请输入正确的电话号码"));
          } else {
            callback();
          }
        };
        return {
          select:new getCascaderObj(),
          form:{
            phone:'',
            fullname:'',
            email:'',
            selectedOptions:'',
            linkAddress:'',
            linkManAreaCode:'',
            linkManAreaName:'',
          },
          rules: {
            fullname:[{ required: true, message: '联系人姓名不能为空', trigger: 'blur'},
              { min: 2,max: 20, message: '联系人长度2-20个字符', trigger: 'blur'}],
            phone: [{ required: true, validator: checkPhone, trigger: "blur" },
              { max: 15, message: '长度在15个字符', trigger: 'blur'}],
            email:[{ required: true,type: 'email', message: '联系人邮箱不能为空', trigger: 'blur'}],
            selectedOptions: [{ required: true, message: "请选择联系地址", trigger: "change" }],
            linkAddress: [{ required: true, message: "请输入详细地址", trigger: "blur" },{ min: 2,max:100, message: '长度在2-100位之间', trigger: 'blur'}],
          }
				}
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      async initData(row){
        this.form.fullname = row.fullname
        this.form.phone = row.phone
        this.form.email = row.email
        this.form.selectedOptions = [...row.selectedOptions1]
        this.form.linkAddress = row.area
        this.handleChange(this.form.selectedOptions)  // 设置地区名称和地区编码
      },
      handleChange(value){
        if(value!=""){
          var vals = this.select.getlable(this.form.selectedOptions, this.areaData);
          if(vals.length == '1'){
            this.form.linkManAreaName = vals[0].label;
            this.form.linkManAreaCode = vals[0].value;
          }else if(vals.length == '2'){
            this.form.linkManAreaName = vals[0].label + '/' + vals[1].label;
            this.form.linkManAreaCode = vals[1].value;
          }else{
            this.form.linkManAreaName = vals[0].label + '/' + vals[1].label + '/' + vals[2].label;
            this.form.linkManAreaCode = vals[2].value;
          }
        }
      },
      submit() {
        let flag = false
        this.$refs.form.validate((valid)=>{
          if(valid) {
            flag = true
          }
        })
        return !flag || this.form
      },
    },
};
</script>

<style lang="less" scoped>
  .ContactsInformation{
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
    .item1{
			width: 280px;
			margin-right: 20px;
		}
		.item4{
			width: 280px;
		}
	}


</style>
