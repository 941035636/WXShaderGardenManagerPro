<template>
    <div id="Insureds">
        <!-- 被保人信息 -->
        <div class="ts-insure-scheme mb20">
            职业为电梯修理及维护工人（包括高空作业人员）和电梯安装工人（包括高空作业人员）
        </div>
    </div>
</template>
<script>
export default {
    props: {
        ruleForms:{
            type: Object,
            required:true
        }
    },
    components: {
       
    },
    mounted() {
        this.ruleForm = this.ruleForms ? this.ruleForms:{};
    },
    data() {
        return {

        }
    },
    created(){
         
    },
    methods: {
        
    }
}
</script>
<style lang="less" scoped>
    #Insureds {
        .ts-insure-scheme{
            font-weight: 700;
            padding-left: 70px;
            padding-right: 70px; 
        }
    }
</style>


