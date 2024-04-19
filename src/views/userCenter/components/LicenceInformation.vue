<template>
<!-- 认证资料信息 -->
  <div>
    <div class="LicenceInformation" id="LicenceInformation">
      <div class="head">认证资料</div>
      <el-form :model="form" class="demo-ruleForm" label-position="right" label-width="125px" :rules="rules" ref="form">
				<el-form-item label="社会信用代码：" prop="threeInOneCode" >
					<el-input placeholder="请输入社会信用代码" v-model.trim="form.threeInOneCode" class="item4" clearable></el-input>
				</el-form-item>
				<el-form-item label="营业执照：" prop="imageUrl1">
          <img v-if="form.imageUrl1" :src="form.imageUrl1" class="avatar1">
					<el-upload class="avatar-uploader1" accept="image/*" :show-file-list="false"  action="#" :http-request="Upload" :on-success="handleAvatarSuccess" v-else>
              <img v-if="form.imageUrl1" :src="form.imageUrl1" class="avatar1">
              <span v-else class="avatar-uploader-icon">
                <i  class="el-icon-plus mt40"></i>
                <br>
                <span>点击上传</span>
              </span>	
            </el-upload>
				</el-form-item>
			</el-form>
		</div>
  </div>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
export default {
    props: {},
    data() {
      var checkCode = (rule, value, callback) => {
        let reg = /^(?=.*\d)[A-Za-z0-9]{2,20}$/;
        var regs = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!value) {
          return callback(new Error("请输入证件号"));
        } else if (!reg.test(value) ) {
          callback(new Error("请输入正确的社会信用代码"));
        } else {
          callback();
        }
      };
        return {
            Elevator:new elevator(),
            form:{
              threeInOneCode:'',
              fileId:'',
              imageUrl1:'',
            },
            rules: {
              threeInOneCode: [{ required: true, validator: checkCode, trigger: "blur" }],
              imageUrl1:[{ required: true, message: '证件执照不能为空'}],
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
      async initData(row,isSerch=false){
        if(!isSerch) {
          let flag
          if(row.userType == 'sequip_C' ) {
            flag = 'bl'
          } else {
            flag = 'gai'
          }
          let bl = this.getPaperworkInfoList(row.paperworkInfoList,flag)
          this.form.threeInOneCode = bl.value
          this.form.fileId = bl.url
          this.form.imageUrl1 = row.imageUrl1
        } else {
          this.form.threeInOneCode = row
        }
      },
      // 获取数组的指定内容
      getPaperworkInfoList(list,code) {
        return list.find(item=>item.code === code) || {
                "code":"",
                "name":"",
                "value":"",
                "url":"",
                "preSignUrl":"",
                "filePath":"",
            }
      },
      async Upload(file){ // 图片上传
        const formData = new FormData();
        formData.append('files', file.file)
        formData.append('type', file.file.type)
        formData.append("channelcode", "sequip"); 
        formData.append("resCode", "I002");
        let data = formData
        const res = await this.Elevator.cateUploadAuth(data,'user-svc','0','blUrl');
        let {code} = res
        if(code == "0000"){
          this.form.fileId = res.list[0].fileId;
        }
      },
      handleAvatarSuccess(res, file) {
        this.form.imageUrl1 = URL.createObjectURL(file.raw);
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
  .LicenceInformation{
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
			width: 200px;
			margin-right: 20px;
		}
		.item2{
			width: 250px;
		}
		.item4{
			width: 280px;
		}
		.item5{
			width: 300px;
		}
    .w500{
      width: 500px;
    }
    .avatar-uploader1{
      width: 193px;
      height: 193px;
      border: 1px dashed #BBBBBB;
      padding: 7px;
      margin-right: 10px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    .avatar-uploader1 .el-upload:hover {
      border-color: #409EFF;
    }
    
    .avatar1{
      width: 178px;
      height: 178px;
      display: block;
    }
   
		
	}


</style>
<style lang="less">
#LicenceInformation {
  .el-upload--text {
    width: 178px !important;
    height: 178px !important;
  }
  .avatar-uploader-icon {
    i {
      font-size: 55px;
    }
    span {
      font-size: 16px;
    }
    
    text-align: center;
    color: #999999;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}

</style>
