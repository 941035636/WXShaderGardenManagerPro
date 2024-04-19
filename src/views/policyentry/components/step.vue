<template>
    <div class="step-line common-style">
        <el-steps :active="stepNum" align-center class="mb10">
            <el-step title="填写保单"></el-step>
            <el-step title="确认信息"></el-step>
            <el-step title="提交成功"></el-step>
        </el-steps>
        <p class="branch-name" v-if="showBranch"><span class="tip-text">业务归属：{{branchName}} <span class="ml20 col-red" v-if="branchYGShow">推送业管分支机构：{{branchName}}</span></span></p>
    </div> 
</template>
<script>
export default {
    props:['stepNum','showBranch'],
	data() {
        return {
            branchName:window.sessionStorage.getItem('branchName'),
            branchYGShow:false
        }
    },
    methods: {
        setFlag(val) {
            if(val == 'Y') {
                this.branchYGShow = true;
            } else {
                this.branchYGShow = false;
            }
        }
    }
}
</script>