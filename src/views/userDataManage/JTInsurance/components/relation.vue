<template>
  <el-dialog
    title="关联产品"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="65%"
    @close="close"
    @open="initData"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
      label-position="left"
      label-width="100px"
    >
      <el-row>
       
        <el-col :span="10">
          <el-form-item label="产品编码：" prop="accidentProductCode">
            <el-input
              v-model="ruleForm.accidentProductCode"
              clearable
              class="w280"
              placeholder="请输入产品编码"
            ></el-input> </el-form-item
        ></el-col>
         <el-col :span="10">
          <el-form-item label="产品名称" prop="accidentProductName">
            <el-input
              v-model="ruleForm.accidentProductName"
              clearable
              class="w280"
              placeholder="请输入产品名称"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="2"
          ><el-button @click="add" type="primary">添加</el-button></el-col
        >
      </el-row>
    </el-form>
    <el-table
      :data="tableList"
      border
      header-row-class-name="headName"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        prop="accidentProductCode"
        label="产品编码"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="accidentProductName" label="产品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!scope.row.flag">  {{scope.row.accidentProductName}}</span> <el-button  v-if="!scope.row.flag" class="ml10" type="text" @click="update(scope.row, scope.$index)"> 更新 </el-button>
        <el-form>
          <el-form-item v-if="scope.row.flag" :error="scope.row.error">
            <el-input class="w250" type="text" v-model="newForm.accidentProductName"></el-input>
            <el-button  v-if="scope.row.flag" class="ml10" type="text" @click="edit(scope.row, scope.$index)"> 确认 </el-button>
          </el-form-item></el-form>
         
        </template>
      </el-table-column>

      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-button style="color:#f00" type="text" @click="del(scope.row, scope.$index)"> 删除 </el-button>
        
        </template>
      </el-table-column>
     
    </el-table>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
      <el-button type="warning" round @click="register">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import userManage from "@/service/userManage.js";
export default {
  name: "relateMember",
  data() {
    return {
      dialogVisible: false,
        userManage: new userManage(),
      flag:false,//控制新增还是修改
      index:null,
      servicename:'',
      id:'',
      newForm:{
  accidentProductName: "", // 用户姓名
        accidentProductCode: "", //登录账号
        organizationType:1
      },
      ruleForm: {
        accidentProductName: "", // 用户姓名
        accidentProductCode: "", //登录账号
        organizationType:1
      },
      rules:{
    accidentProductName: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
            {
            min: 1,
            max: 30,
            message: "产品名称只支持1到30位",
            trigger: "blur",
          },
        ],
    accidentProductCode: [
          { required: true, message: "请输入产品编码", trigger: "blur" },
             {
            min: 1,
            max: 30,
            message: "产品编码只支持1到30位",
            trigger: "blur",
          },
        ],
      },
      tableList: [],
      userCode: "",
    };
  },

  methods: {
  async  initData() {
  
      let data = {
        servicename: this.servicename,
        code: this.id,
      };
    
      let res = await this.userManage.detailOrganization(data);
      if(res.code=='0000'){
           res.data.accidentProductList.map((item)=>{
          item.flag = false;
          item.error=''
        })
        this.tableList = res.data.accidentProductList
       
      }
    },
         getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#b8d9fd;text-align:center;color:#0050b3";
      } else {
        return "";
      }
    },
    add(){
         this.$refs["ruleForm"].validate((valid) => {
            if (valid) {
             this.addPro();
            } else {
              return false;
            }
          });
        },
   async edit(row,id){
  let res = await this.userManage.putAccidentPro(this.servicename, this.id, this.newForm);
  if(res.code=='0000'){
    this.$message.success('修改成功')
    this.tableList.map((item)=>{
      item.flag=false
    })
     this.initData()
  }
    },
 async addPro() {
  let res = ''
  let txt = '关联'
  
       res = await this.userManage.linkAccidentPro(this.servicename, this.id, [this.ruleForm]);
      let data = JSON.parse(JSON.stringify(this.ruleForm))
    this.tableList.push(data); 
    
   this.$set(this.tableList,this.index,JSON.parse(JSON.stringify(this.ruleForm)))
       if(res.code=='0000'){
           this.$message.success(txt+'成功')
           this.initData()
           
         }
       this.ruleForm={
            accidentProductName: "", // 用户姓名
        accidentProductCode: "", //登录账号
        organizationType:1
       }
    },
    update(row,index) {
      this.tableList.map((item)=>{
        item.flag=false
      })
     this.tableList[index].flag=true
      this.newForm = JSON.parse(JSON.stringify(this.tableList[index]))
  
    },
    del(row,index) {
      console.log(row);
 //删除当前行数据
 console.log(index);
      this.$confirm("永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then( async() => {
         let  res = await this.userManage.delAccidentPro(this.servicename, row.id);
          // 移除对应索引位置的数据，可以对row进行设置向后台请求删除数据
          if(res.code=='0000'){
               this.tableList.splice(index, 1);
          this.$message.success("删除成功");
          this.initData()
          }
          
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    clear() {
      this.ruleForm.accidentProductName = "";
      this.ruleForm.accidentProductCode = "";
      this.tableList = []
    },
    close() {
      this.clear();
    },
    
   async register() {
this.dialogVisible = false
return
      let len = this.tableList.length
      console.log(len,'====');
      if(len){
         let res = await this.userManage.linkAccidentPro(this.servicename, this.id, this.tableList);
         if(res.code=='0000'){
           this.$message.success('关联产品成功')
           
         }
      }else{

        this.$message.warning('请先添加产品')
      }
    },
  },
};
</script>

<style lang="less">
.w280 {
  width: 280px;
}
</style>
