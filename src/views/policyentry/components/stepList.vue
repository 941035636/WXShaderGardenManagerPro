<template>
    <div class="step-line common-style">
        <el-steps :active="stepNum" align-center class="mb10">
            <el-step title="填写保单"></el-step>
            <el-step title="上传清单"></el-step>
            <el-step title="确认信息"></el-step>
            <el-step title="提交成功"></el-step>
        </el-steps>
        <span class="branch-name" v-if="showBranch">业务归属：{{branchName}}</span>
    </div> 
</template>
<script>
export default {
    props:['stepNum','showBranch'],
	data() {
        return {
            branchName:window.sessionStorage.getItem('branchName')
        }
    }
}
</script>