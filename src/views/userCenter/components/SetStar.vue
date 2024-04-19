<template>
    <el-dialog title="变更星级" width="850px" :visible.sync="dialogTableVisible"  @close="close" destroy-on-close :close-on-click-modal="false">
        <div>
            <el-form ref="dialogForm" :rules="rules" :model="dialogForm" label-width="160px" label-position="right">
              <div class="product-spilt">
                  <el-form-item label="企业名称：" >
                    <span class="color-blue">{{dialogForm.name}}</span>
                </el-form-item>
              </div>
                <el-form-item label="客户星级：" prop="starLevel">
                    <el-select v-model="dialogForm.starLevel" placeholder="请选择" size="small" clearable class="w280" filterable>
                        <el-option v-for="(item,index) in starList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <!-- <div class="box">
                      <el-row class="row-F2F2">
                        <el-col :span="12" class="col-border-bottom">
                          <span>上门拜访</span>
                          <span class="span-r">4+N</span>
                        </el-col>
                        <el-col :span="12" class="col-border-bottom col-border-left">
                          <span>1</span>
                          <span class="span-r">4+N</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12" class="col-border-bottom">
                          <span>1</span>
                          <span>2</span>
                        </el-col>
                        <el-col :span="12" class="col-border-bottom col-border-left">
                          <span>1</span>
                          <span>2</span>
                        </el-col>
                      </el-row>
                    </div> -->
                    
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button round size="medium" type="info" @click="close">取 消</el-button>
            <el-button type="warning" size="medium" round @click="submit">确认提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
import enumeration from '../../../../static/data/enumeration.json'
import UserService from '@/service/UserService'
export default {
    name: "SetStar",
    props: {},
    data() {
        return {
          userService: new UserService(),
          dialogTableVisible: false,
          starList: enumeration['optionStar'],
          dialogForm: {
            name:'',
            starLevel:'',
            userCode:'',
            orgCode:'',
            isAttestation:'01',
            isUpdateFlag: false,
            channelCode:'sequip'
          }, //dialog表单
          rules:{
            starLevel:[{
              required:true,
              message:'请选择星级',
              trigger: 'blur',
            }]
          },
        };
    },
    computed: {
        
    },
    mounted() {
    },
    methods: {
        async initData(row,flag) {
            if(flag == 'update') {
              this.dialogForm.isUpdateFlag = true
              this.dialogForm.starLevel = row.startLevel.toString()
            } else {
              this.dialogForm.starLevel = '';
              this.dialogForm.isUpdateFlag = false
            }
            this.dialogForm.name = row.custFullName
            // this.dialogForm.userCode = row.userCode
            this.dialogForm.orgCode = row.orgCode
            this.dialogTableVisible = true
        },
        clear() {
            this.dialogTableVisible = false
            this.$nextTick(() => {
                this.$refs["dialogForm"].resetFields();
            });
            
        },
        close() {
            this.clear();
        },
        async submit() {
          this.$refs.dialogForm.validate(async (value)=>{
            if(value) {
              let form = JSON.parse(JSON.stringify(this.dialogForm))
              let res;
              if(!form.isUpdateFlag) {
                delete form.isUpdateFlag
                delete form.name
                res = await this.userService.saveStartLevel(form)
              } else {
                delete form.isUpdateFlag
                delete form.name
                res = await this.userService.updateStartLevel(form)
              }
              if(res.code === '0000') {
                  this.clear();
                  this.$emit('successCallback')
              }
            }
          })
          this.dialogVisible = false;
        },
        // 处理选中省市区方法
        handleChangeArea(e) {
            this.ruleForm.provinceCode = e[0];
            this.ruleForm.provinceName = this.areaMap[e[0]] || "";
            this.ruleForm.cityCode = e[1];
            this.ruleForm.cityName = this.areaMap[e[1]] || "";
            this.ruleForm.countyCode = e[2];
            this.ruleForm.countyName = this.areaMap[e[2]] || "";
        },
    },
};
</script>

<style lang="less" scoped>
.w280 {
    width: 280px;
}
.box {
  border: 1px solid #ccc;
  border-bottom: none;
}
.product-spilt {
  border-bottom: 2px dashed #ccc;
  margin-bottom: 22px;
}
.row-F2F2 {
  background-color: #F2F2F2;
}
.col-border-left {
  border-left: 1px solid #ccc;
}
.col-border-bottom {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  span {
    margin:0 10px;
  }
  .span-r {
    background-color: #40A9FF;
    border-radius: 10px;
    height: 20px;
    line-height: 20px;
    margin-top: 10px;
    padding: 0 10px;
    color: #FFF;
  }
}


</style>
