<template>
    <div class="case-tabs">
        <div class="case-tabs-tab">
            <p :class="[class1,{'selection':tabFlag=='1'}]" @click="checkoutTab(1)">出险信息</p>
            <p :class="[class1,{'selection':tabFlag=='2'}]" @click="checkoutTab(2)">索赔信息</p>
            <p :class="[class1,{'selection':tabFlag=='3'}]" @click="checkoutTab(3)">结案信息</p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            class1:'case-tabs-box',
            tabFlag:'1',
        }
    },
    created(){
        
    },
    computed: {
        ...mapGetters([
            'isHandleButton',
        ])
    },
    methods:{
        checkoutTab(index){
            if((index == 2 || index ==3) && !this.isHandleButton){
                this.$message.warning('请进行案件受理')
                return
            }
            this.tabFlag=index;
            this.$emit('tabsChange',index)
        },
    },
}
</script>

<style lang="less" scoped>
.case-tabs{
    width: 100%;
    margin-top: 10px;
    background-color: #ffffff;
    .case-tabs-tab{
        width: 100%;
        height: 57px;
        display: flex;
    }
    .case-tabs-box{
        width: 141px;
        height: 100%;
        line-height: 57px;
        text-align: center;
        color: #767676;
        font-size: 18px;
        cursor: pointer;
    }
    .selection{
        color: #0050B3;
        border-bottom: 2px solid #0050B3;
    }
}

</style>
