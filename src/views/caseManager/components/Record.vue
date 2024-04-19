<template>
    <el-dialog title="同步记录" width="50%" :visible.sync="dialogTableVisible"  @close="close" destroy-on-close :close-on-click-modal="false">
        <div id="history">
            <div class="history-left">
                <p :class="{'ml10 mr10 flex pb10 pt10 curser':true,'bac-ccc':item.id==currentData.id}  " v-for="(item,key) in list" :key="key" @click="changeCurrent(item)">
                    <span>{{item.updateTime}}</span>
                    <span class="col-blue" v-if="key==0">当前</span>
                </p>
            </div>
            <div class="history-right">
                <el-row class="mt10">
                    <el-col :span="12">报案号：{{reportInfo.reportNo}}</el-col>
                    <el-col :span="12">同步时间：{{reportInfo.updateTime}}</el-col>
                </el-row>
                <div class="mt10">
                    <div class="yaml-editor">
                        <pre v-if="showJson">{{jsonData}}</pre>
                        <span v-else>{{jsonData}}</span>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import CaseService from '@/service/CaseService.js';
export default {
    name: "History",
    props: {},
    data() {
        return {
            dialogTableVisible: false,
            radio:'',
            jsonData:{},
            list:[],
            currentData:{},
            caseSrrvice: new CaseService(),
            reportInfo:{},
            showJson: true
        };
    },
    computed: {
        
    },
    mounted() {
        // this.initRole()
    },
    methods: {
        async initData(row) {
            this.reportInfo = row;
            let res = await this.caseSrrvice.getSyncCaseRecord(row.reportNo);
            if(res.code == '0000') {
                this.list = res.list;
                this.changeCurrent(this.list[0])
            }
            this.dialogTableVisible = true
            
        },
        // 选中当前属性
        changeCurrent(val) {
            this.currentData = val
            this.reportInfo = val;
            try {
                let content = JSON.parse(val.msg)
                this.jsonData = JSON.stringify(content,null,4)
                this.showJson = true;
            } catch (error) {
                this.jsonData = val.msg;
                this.showJson = false;
            }
        },
        clear() {
            this.dialogTableVisible = false
        },
        close() {
            this.clear();
        },
    },
};
</script>

<style lang="less">
#history {
    display: flex;
    .history-left {
        width: 26%;
        background-color: #F7F7F7;
        padding: 10px 0;
        .flex {
            display: flex;
            justify-content: space-between;
        }
    }
    .history-right {
        margin-left: 2%;
        width: 72%;
        .yaml-editor{
            margin-top: 10px;
            min-height: 400px;
            border: 1px solid #eaeaea;
            box-sizing: border-box;
            color: #CB6F5C;
            padding: 20px;
        }
    }

}
.w280 {
    width: 280px;
}
.el_radio {
    margin-top: 10px;
    margin-left: 0 !important;
    margin-right: 10px !important;
}
.col-blue {
    color: #096dd9;
}
.bac-ccc {
    background-color: #ccc;
}

</style>
