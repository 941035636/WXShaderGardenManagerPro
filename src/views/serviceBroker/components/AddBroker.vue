<template>
  <div id="AddBroker">
    <el-dialog
			title="添加经纪人"
			:visible.sync="dialogFormVisible"
			:close-on-click-modal="false"
      width="800px"
      @close="close"
		>
      <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="100px" label-position="right">
        <el-form-item label="姓名" prop="agentName">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="dialogForm.agentName"
            class="w339"
            size="small"
            :debounce="700"
            :fetch-suggestions="getUser"
            placeholder="请输入姓名"
            :trigger-on-focus="false"
            hide-loading
            clearable
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="item-sel">
                <p>{{ item.userName }}</p>
                <p>账号：{{ item.userLoginId }}</p>
              </div>
            </template>
          </el-autocomplete>
          <!-- <el-select v-model="dialogForm.name" filterable reserve-keyword remote class="w339" :remote-method="getUser">
          <el-option
            v-for="item in userList"
            :key="item.userLoginId"
            :label="item.userName"
            :value="item.userLoginId">
            <p>{{ item.userName }}</p>
            <p>账号：{{ item.userLoginId }}</p>
          </el-option>
        </el-select> -->
        </el-form-item>
        <el-form-item label="标签" prop="agentLabel">
          <el-select class="w339" v-model="dialogForm.agentLabel" placeholder="请选择" size="small" clearable filterable>
            <el-option v-for="(item,index) in tagList" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="line-height:25px;color:#E99D42">
            <p><i class="el-icon-warning"></i>保险设计师主要做保险产品或保险方案的设计</p>
            <p>保险规划师主要负责市场开发和全面营销工作</p>
            <p>保险服务师主要负责客户服务计划、方案的制订、执行和总结</p>
          </div>
        </el-form-item>
        <el-form-item label="擅长领域" prop="agentSpeciality">
          <el-input class="w503" type="textarea" v-model="dialogForm.agentSpeciality" placeholder="请输入擅长领域"></el-input>
        </el-form-item>
        <el-form-item label="产品区域" prop="productArea">
          <el-switch
            v-model="dialogForm.status"
            active-color="#E1E1E2"
            inactive-color="#00E065"
            :active-value="'01'"
            :inactive-value="'00'"
            active-text="各地市"
            inactive-text="全国"
            @change="changeSwitch"
            disabled>
          </el-switch>
          <div v-if="dialogForm.status =='01'">
            <el-cascader
                v-model="dialogForm.selectedOptions"
                class="w280"
                size="small"
                :options="areaList"
                placeholder="请选择区域"
                :props="{
                  multiple:true,
                  checkStrictly:true,
                }"
                @change="(e)=>changeSetData(e)"
            ></el-cascader>
          </div>
          <div v-else>
            <p style="color:#E99D42"><i class="el-icon-warning"></i>没有产品的地区展示全国经纪人信息</p>
          </div>
        </el-form-item>
        <el-form-item label="手机号" prop="agentPhone">
          <el-input class="w339" placeholder="请输入" size="small" v-model="dialogForm.agentPhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="agentEmail">
          <el-input class="w339" placeholder="请输入" size="small" v-model="dialogForm.agentEmail"></el-input>
        </el-form-item>
        <el-form-item label="照片" prop="coverPicture">
					<el-upload
            action="#"
						class="avatar-uploader1"
						accept=".jpg,.JPG,.png,.PNG,.jpeg,.HPEG"
						:before-upload="beforeAvatarUpload1"
            :http-request="Upload1"
						:show-file-list="false"
						:on-success="handleAvatarSuccess1"
					>
						<span class="avatar-uploader-icon">
							<el-button size="small" type="primary"
								>点击上传</el-button
							><span style="margin-left:10px;color:#E99D42">请上传282*165的图片</span>
						</span>					
					</el-upload>
          <p class="text-tip">只能上传 JPG/JPEG/PNG图片，且不超过 10MB</p>
          <img :src="imageUrl1" v-if="imageUrl1" class="avatar1" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="info" @click="close">取 消</el-button>
        <el-button type="warning" size="medium" round @click="submit">确认提交</el-button>
      </span>
    <!-- <button type="submit" @click="buttonClick">测试一下</button> -->
    </el-dialog>
  </div>
</template>
<script>
import correctionManagement from "@/service/CorrectionManagement";
import ResourcesService from '@/service/ResourcesService'
import BrokerServer from '@/service/brokerServer'
import videoService from "@/service/videoService";
import MiddleUtil from "../../../util/MiddleUtil.js"
export default {
  props:{
    areaList: {
      type: Array,
      required: true,
      default: () => {
          return []
      }
    },
  },
  data(){
    var checkPhone = (rule, value, callback) => {
			var reg = /^1[23456789]\d{9}$/;
			if (!reg.test(value) && value) {
				callback(new Error("请输入正确的手机号码"));
			} else {
				callback();
			}
    };
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value) || !value) {
        callback()
      } else {
        callback(new Error('请输入正确邮箱'))
      }
    };
    return{
      CorrectionManagement:new correctionManagement(),
      resourcesService: new ResourcesService(),
      brokerServer:new BrokerServer(),
      videoService: new videoService(),
      dialogFormVisible:false,
      dialogForm:{
        status:'01',
        selectedOptions:[],
        "agentEmail": "",  //邮箱
        "agentLabel": "", // 标签
        "agentName": "", // 代理人名称
        "agentPhone":"", // 手机号
        "agentSpeciality": "", // 擅长领域
        "agentStatus": "01",  // 状态 00-失效 01-有效
        "agentUserCode": "", // 经纪人用户编码
        "channelCode": "sequip", // 渠道编码
        "coverPicture": "", //  图片id
        "productArea": "", //  产品区域
      }, 
      userList:[],
      imageUrl1:"",
      tagList:[
        {
          name:"保险规划师",
          value:"01"
        },
        {
          name:"保险服务师",
          value:"02"
        },
        {
          name:"保险设计师",
          value:"03"
        },
      ],
      rules:{
        agentName:[{required: true, message: '请输入名称', trigger: 'change'},
                  {min: 1,max: 30,	message: '长度在 1 到 30 个字符',trigger: 'blur'}],
        agentLabel:[{required: true, message: '请选择标签', trigger: 'change'}],
        agentSpeciality:[{required: true, message: '请输入擅长领域', trigger: 'change'},
                        {min: 1,max: 50,	message: '长度在 1 到 50 个字符',trigger: 'blur'}],
        agentPhone:[{ required: true, message: '请输入手机号', trigger: 'blur' },
                    { required: true, validator: checkPhone, trigger: "blur" }],
        agentEmail:[{required: true, message: '请输入邮箱', trigger: 'change'},
                    {required: false,validator: validateEmail,trigger: "blur"}],
        productArea:[{required: true, message: '请选择地区', trigger: 'change'}],
        coverPicture:[{required: true, message: '请上传照片', trigger: 'change'}],
      }
    }
  },
  methods:{
    //测试触发更新，没有啥用
    // buttonClick(){
    //     MiddleUtil.$emit('demo','msg');
    // },
    getUser(val,cb){
      let data = {
        channelCode: 'sequip',
        userName:val,
        pageNum: 1,
        pageSize: 20
      }
      this.CorrectionManagement.getUserByNo(data).then((res) => {
        var List = []
        if (res.code == '0000') {
          List = res.list.map((item) => {
            return { value: item.userName, ...item }
          })
          if(res.list.length<=0){
            this.$message.error('暂未查询到姓名信息，请重新查询')
            this.dialogForm.agentName = "";
          }
          cb(List) // 调用 callback 返回建议列表的数据
        }
      })
      
      // let res = await this.CorrectionManagement.getUserByNo(data)
      // if(res.code == '0000'){
      //   this.userList = res.list;
      // }
      // console.log(res)
    },
    changeSwitch(e){
      if(e == '00'){
        this.dialogForm.productArea = '000000'
      }else{
        this.dialogForm.productArea = ""
      }
    },
    handleSelect(val){
      this.dialogForm.agentUserCode = val.userCode;
    },
    beforeAvatarUpload1(file) {
			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				this.$message.error("视频封面图片大小不超过10MB!");
			}
			return isLt10M;
		},
    async Upload1(file) {
			// 图片上传
			const formData = new FormData();
			formData.append("files", file.file);
			formData.append("type", file.file.type);
			formData.append("applicationName", "abts-svc");
			formData.append("businessTypeCode", "media");
			formData.append("free", "1");
			let data = formData;
      let res = await this.videoService.uploadVideoImg(data);
			if (res.code == "0000") {
        this.dialogForm.coverPicture = res.list[0].fileId;
			}
    },
    handleAvatarSuccess1(res, file) {
			this.imageUrl1 = URL.createObjectURL(file.raw);
		},
    changeSetData(e){
      let area = [];
      e.forEach(item =>{
        area.push(item[item.length-1])
      })
      this.dialogForm.productArea = area.join(',')
    },
    async addBroker(){
      let res = await this.brokerServer.addBroker(this.dialogForm)
      console.log(res)
      if(res.data.code == '0000'){
        this.dialogFormVisible = false;
        this.$message.warning('提交成功')
        MiddleUtil.$emit('demo','msg');
        this.$parent.getBrokerList();
      }
    },
    async enditBroker(){
      let res = await this.brokerServer.brokerPut(this.dialogForm.id,this.dialogForm)
      console.log(res)
      if(res.data.code == '0000'){
        this.dialogFormVisible = false;
        this.$message.warning('修改成功')
        MiddleUtil.$emit('demo','msg');
        this.$parent.getBrokerList();
      }
    },
    close(){
      this.dialogFormVisible = false;
      this.imageUrl1 = ""
      this.dialogForm={
        status:'01',
        selectedOptions:[],
        "agentEmail": "",  //邮箱
        "agentLabel": "", // 标签
        "agentName": "", // 代理人名称
        "agentPhone":"", // 手机号
        "agentSpeciality": "", // 擅长领域
        "agentStatus": "01",  // 状态 00-失效 01-有效
        "agentUserCode": "", // 经纪人用户编码
        "channelCode": "sequip", // 渠道编码
        "coverPicture": "", //  图片id
        "productArea": this.$parent.rolShow?'000000':"", //  产品区域
      }
       
    },
    submit(){
      this.$refs.dialogForm.validate(async (value)=>{
        if(value){
          if(this.dialogForm.id){
            this.enditBroker();
          }else{
            this.addBroker();
          }
          
        }
      })
    },
  }
}
</script>
<style lang="less">
.my-autocomplete li .item-sel {
      padding: 5px 10px 10px 10px;
      border-bottom: 1px solid #ccc;
    }
  #AddBroker{
    
    .w339{
      width:339px;
    }
    .w503{
      width:503px;
    }
    .el-upload--text {
      height: 40px;
      border: none;
      width: 62%;
      border-radius: 0;
    }
    .el-upload {
      text-align: left;
    }
    .avatar1 {
      width: 282px;
      display: inline-block;
    }
    .text-tip {
      font-size: 14px;
      color: #096dd9;
      line-height: 20px;
    }
  }
</style>