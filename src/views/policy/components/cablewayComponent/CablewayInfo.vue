<template>
    <div id="cablewayInfo">
        <el-dialog title="我的索道" :visible.sync="dialogFormVisible"  :close-on-click-modal="modul" width="70%" @close="close">
            <div class="ts-ele-tab">
                <ul class="ts-ele-tab-list">
                    <li :class="{'ele-present':flag==key}" v-for="(item,key) in list" :key="key" @click="setTab(key)">{{item}}</li>
                </ul>
                <div class="ts-ele-search">
                        <el-input placeholder="请输入索道名称" v-model.trim="value" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
                <div class="ts-ele-add-btn">
                        <el-button type="warning" plain id="ts-ele-btn1" @click="addPolicy">添加到投保单</el-button>
                </div>
            </div>  
            <!-- 表格数据 -->
            <el-table  v-if="tableData.length !=0" class="mb10" :data="tableData">
                
            </el-table> 
            <div v-if="tableData.length ==0" class="ts-ele-list-not">
                <p>
                    <img src="../../../../assets/images/slider/wsj-01.png" alt="">
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
export default {
    data() {
        return{
            tableData: [],
            list:["待续保","未在保",],
            dialogFormVisible:false,
            modul:false,
            flag:0,
            value:'',
        }
    },
    methods: {
        setTab(val){
            this.flag = val
            this.elementList(this.productCode)
        },
        flagTrue(val){
            this.dialogFormVisible=true;
            this.productCode=val
            this.elementList(val)
        },
        async search(){
            
        },
        addPolicy(){    
            
            
        },
        close(){    // 关闭弹窗回调函数
            this.$emit('close')
            this.dialogFormVisible = false;
        }
    }
    
}
</script>
<style lang="less" scoped>
    #cablewayInfo {
        .ts-ele-tab {
            position: relative;
        }
        .ts-ele-search {
            position: absolute;
            top: -10px;
            right: 160px;
        }
        .ts-ele-add-btn {
            position: absolute;
            right: 0;
            top: -10px;
        }
        .ts-ele-tab {
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
        .ts-ele-tab-list .ele-present {
            border-color: #c9984a;
            color: #c9984a;
        }
        #ts-ele-btn1 {
            background-color: #c9984a ;
            color: #fff;
            border-radius: 5px ; 
        }
        .ts-ele-list-not {
            height: 342px;
            text-align: center;
        }
        .ts-ele-list-not h2 {
            color: #999999;
            font-size: 20px;
            margin-top: 20px;
        }
        .ts-ele-list-not h2 >span {
            color: #d3964b;
            cursor: pointer;
        }
    }
</style>


