<template>
    <div>
        <el-dialog class="ts-import" title="导入设备信息" :visible.sync="dialogFormVisible"  :close-on-click-modal="modul" width="70%">
            <div class="ts-ele-tab">
                <div class="ts-ele-add-btn">
                        <el-button type="warning" plain id="ts-ele-btn1">添加到投保单</el-button>
                </div>
            </div>  
            <ImportElevatorListData class=" mb10"  :tableData="tableData"></ImportElevatorListData> 
            <Ppagination class="mt40"></Ppagination>
        </el-dialog>
    </div>
</template>

<script>

import ImportElevatorListData from './ImportElevatorListData';
import Ppagination from './Ppagination';

export default {
 components: {
      ImportElevatorListData,Ppagination
    },
    data(){
        return{
            modul:false,
            list:["全部","保障中","已失效","续保",],
            dialogFormVisible:false,
            flag:0,
            input3:'',
            tableData:[]
        }
    },
    created(){
        
    },
    methods: {
        setTab(val){
            this.flag=val
        },
        flagTrue(list){
            this.dialogFormVisible=true
            this.tableData=list
            
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
.ts-import > .el-dialog > .el-dialog__header{
    border-bottom: 1px solid #ccc;
}
</style>

