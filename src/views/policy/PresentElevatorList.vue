<template>
    <div>
        <el-dialog  class="ts-import" title="导入设备信息" :visible.sync="dialogFormVisible"  :close-on-click-modal="modul"  @close="close" width="70%">
            <ImportElevatorListData  class=" mb10" :operation="operation"  :tableData="tableData" @handleDelete="handleDelete" @handleEdit="handleEdit" ></ImportElevatorListData> 
            <EditElevator ref="myChild" @flagTrue="flagTrue"></EditElevator>
        </el-dialog>
    </div>
</template>

<script>

import ImportElevatorListData from './components/ImportElevatorListData';
import Ppagination from './components/Ppagination';
import EditElevator from './elevator/EditElevator';

export default {
    props:{
        operation:{
            type:Boolean,
            default:false,
        }
    },
 components: {
      ImportElevatorListData,EditElevator
    },
    data(){
        return{
            modul:false,
            dialogFormVisible:false,
            innerVisible:false,
            flag:0,
            input3:'',
            tableData:[],
            policyData:[],  // 缓存数据
        }
    },
    created(){
        
    },
    methods: {
        setTab(val){
            this.flag=val
        },
        flagTrue(list){
            this.dialogFormVisible=true;
            this.tableData=  JSON.parse(window.sessionStorage.getItem('elevatorMessage'));
        },
        handleDelete(index){    // 删除数据
            this.tableData.splice(index,1);
            window.sessionStorage.setItem('elevatorMessage',JSON.stringify(this.tableData));
        }, 
        handleEdit(index){   // 修改数据
            this.$refs.myChild.flagTrue(this.tableData[index].productCode,index);
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
.ts-import > .el-dialog > .el-dialog__header{
    border-bottom: 1px solid #ccc;
}
</style>

