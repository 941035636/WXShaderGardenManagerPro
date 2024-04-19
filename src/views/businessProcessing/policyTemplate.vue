<template>
    <div class="template">
        <div id="sdsds" v-html="html" style="margin-bottom:20px;"></div>
        <div style="margin-top:100px"></div>
    </div>
</template>
<script>
import {elevator} from '@/server/accidenServer.js'
    export default {
        data(){
            return{
                Elevator:new elevator(),
                html:'',
            }
        },
        created(){
            this.getDetailsPolicy(this.$route.query.appCode)
        },
        methods:{
            async getDetailsPolicy(row){	// 投保单详情
                this.html  = await this.Elevator.getAppFormTemplate(row)
            }
        }
    }
</script>
<style>
html,body,#app{
    overflow: visible !important;
}
</style>