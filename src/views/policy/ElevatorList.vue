<template>
    <div>
        <el-dialog :title="pageFlag?'我的设备':title" :visible.sync="dialogFormVisible"  :close-on-click-modal="modul" width="70%" @close="close">
            <div class="ts-ele-tab">
                <ul class="ts-ele-tab-list" v-if="pageFlag">    <!-- 查看全部数据，不显示tab栏 true显示，flase不显示-->
                    <li :class="{'ele-present':flag==key}" v-for="(item,key) in list" :key="key" @click="setTab(key)">{{item}}</li>
                </ul>
                <div class="ts-ele-search">
                        <el-input placeholder="请输入内容" v-model.trim="value" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
                <div class="ts-ele-add-btn">
                        <el-button type="warning" plain id="ts-ele-btn1" @click="addPolicy">添加到投保单</el-button>
                </div>
            </div>  
            <!-- 表格数据 -->
            <ElevatorListData  v-if="tableData.length !=0" class=" mb10" :tableData="tableData" ref="myElevatorListData"></ElevatorListData> 
            <!-- 分页功能 -->
             <div class="ts-pagination" v-if="tableData.length !=0">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        layout="prev, pager, next"
                        :total="total">
                    </el-pagination>
            </div >
            <div v-if="tableData.length !=0 && pageFlag" class="ts-tab-btn">我的设备中没有？<span @click="elementListAll(productCode)">去看看</span></div>
            <div v-if="tableData.length ==0" class="ts-ele-list-not">
                <p>
                    <img src="../../assets/images/slider/wsj-01.png" alt="">
                </p>
                <h2>
                    我的设备中没有？ 
                    <span @click="elementListAll(productCode)">去看看</span> 
                </h2>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import ElevatorListData from './components/ElevatorListData';
import Ppagination from './components/Ppagination';
import productService from '@/service/ProductService';



export default {
 components: {
      ElevatorListData,Ppagination
    },
    data(){
        return{
            productService: new productService(),
            modul:false,
            list:["待续保","未在保",],
            dialogFormVisible:false,
            flag:0,
            value:'',
            productCode:'',
            tableData:[],   // 电梯数据
            page:1,
            total:0,
            pageFlag:false,
            title:'',

        }
    },
    created(){
        
    },
    methods: {
        setTab(val){
            this.flag=val
            this.elementList(this.productCode)
        },
         flagTrue(val){
            this.dialogFormVisible=true;
            this.productCode=val
            this.elementList(val)
        },
        async elementList(val){
            
            let state=1;
            if(this.flag==0){
                state = 1
            }else if(this.flag ==1){
                state = 3
            };
            let form = {    
                code :'',           //  电梯编号/出厂编号 
                pageNum :this.page,        // 页码
                pageSize :'10',       // 条数
                productCode:val,        // 产品编码
                state :state,      //  0全部,1带续保,2保障中,3未在保 
                userCode :window.localStorage.getItem('userCode'),   // 用户编号
            }
          let res = await   this.productService.elementList(form);
          if(res.code=='0000'){
              this.tableData = res.list;
              this.total=res.total;
                this.pageFlag=true;

            //   if(res.list.length!=0){

            //   }
              
          }
        },
        async elementListAll(val){
            let form = {    
                code :'',           //  电梯编号/出厂编号 
                pageNum :this.page,        // 页码
                pageSize :'10',       // 条数
                productCode:val,        // 产品编码
                state :0,      //  0全部,1带续保,2保障中,3未在保 
                userCode :'',   // 用户编号
            }
          let res = await   this.productService.elementList(form);
          if(res.code=='0000'){
              this.tableData = res.list;
              if(res.list.length==0){
                  this.$message.error('暂无数据')
              }
              this.total=res.total;
              this.pageFlag=false;
              const map = new Map()
              .set(this.$globalProductCode.PRODUCT_CODE_QUANGUO,'全国电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_GD,'广东电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_SZ,'深圳电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_GZ,'贵州电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_HB,'河北电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_HLJ,'黑龙江电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_KM,'昆明电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_HBTS,'唐山电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_CC,'长春电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_XJ,'新疆电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_HK,'海口电梯清单列表')
              .set(this.$globalProductCode.PRODUCT_CODE_NJ,'南京电梯清单列表');
              this.title=map.get(val)
              
              
          }
        },
        async search(){
            
            let state=1;
            if(this.flag==0){
                state = 1
            }else if(this.flag ==1){
                state = 3
            };
            let form = {    
                code :this.value,           //  电梯编号/出厂编号 
                pageNum :1,        // 页码
                pageSize :'10',       // 条数
                productCode:this.productCode,        // 产品编码
                state :this.pageFlag?state:'',      //  0全部,1带续保,2保障中,3未在保 
                userCode :this.pageFlag?window.localStorage.getItem('userCode'):'',   // 用户编号
            }
          let res = await   this.productService.elementList(form);
          if(res.code=='0000'){
              this.tableData = res.list;
              this.total=res.total
              
          }
        },
         
        handleCurrentChange(val) {  // 页数
            this.page = val;
            if(this.pageFlag){
                this.elementList(this.productCode)
            }else{
                this.elementListAll(this.productCode)
            }
        },
        addPolicy(){    // 将选中数据添加到投保单
            this.$refs.myElevatorListData.addPolicy()
            
        },
        close(){    // 关闭弹窗回调函数
            this.$emit('close')
        }
    }
}
</script>

<style>
.ts-wrapper{
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
}
.mt30{
    margin-top: 30px;
    padding: 50px;
}
.ts-ele-title,
.ts-ele-tab{
    position: relative;
}
.ts-ele-search{
    position: absolute;
    top: -10px;
    right: 160px;
}
.ts-ele-add-btn{
    position: absolute;
    right: 0;
    top: -10px;
}
.ts-ele-tab{
  height: 50px;

}
.ts-ele-tab-list {
  display: flex;
  flex-direction: row;
}
.ts-ele-tab-list li {
  font-size: 16px;
  color: #666;
  height: 38px;
  line-height: 38px;
  border-bottom: 2px solid transparent;
  margin-right: 30px;
  cursor: pointer;
}
.ts-ele-tab-list .ele-present{
    border-color: #c9984a;
    color: #c9984a;
}
#ts-ele-btn1{
    background-color: #c9984a ;
    color: #fff;
    border-radius: 5px ; 
}
.ts-pagination{
    text-align: center;
}
.ts-ele-list-not{
    height: 342px;
    text-align: center;
}
.ts-ele-list-not h2{
    color: #999999;
    font-size: 20px;
    margin-top: 20px;
}
.ts-ele-list-not h2 >span{
    color: #d3964b;
    cursor: pointer;
}
.ts-tab-btn{
    text-align: center;
}
.ts-tab-btn >span{
    color: #d3964b;
    cursor: pointer;
    margin-top: 10px;
}
</style>

