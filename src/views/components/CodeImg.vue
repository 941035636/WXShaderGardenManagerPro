<template>
    <div id="codeImg">
        <el-col :span="6">
            <img class="codeImg" :src="codeImg" alt="" id="img">
        </el-col>
        <el-col :span="6" id="imgDom">
            <el-button type="text" @click="changeImg()"> <i class="el-icon-refresh"></i>换一张</el-button>
        </el-col>
    </div>
</template>

<script>
import userService from '../../service/UserService'
import axios from 'axios'
export default {
    data() {
		return {
            codeImg:'',
            userService: new userService(),
		}
    },
    mounted() {
		this.getCodeImg();
    },
    methods: {
        async getCodeImg() {//获取验证码
            let data = await this.userService.getImgCode();
            this.codeImg = data;
        },
        changeImg() {
            this.getCodeImg();
        }
	},
}
</script>

<style>
</style>
