<template>
    <div class="box">
        <!-- 结果页面 -->
        <div class="contentClass">
            <div class="iconClass"><i class="el-icon-circle-check"></i></div>
            <div class="textClass">新版本已提交成功，待审核！</div>
            <div class="butClass">
                <div class="ButCancel" @click="closeclick">关闭</div>
                <div class="ButAffirm" @click="backtrackList">返回列表</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    computed:{
       
	},
	mounted() {
		
	},
	methods: {
        closeclick(){
            this.backtrackList();
        },
        backtrackList(){
            this.$router.push({
                path:'/case/datum/list',
            })
        }
    }
}
</script>
<style lang="less" scoped>
.box{
    background-color: #fff;
    height:400px;
    display: flex;
    justify-content: center;
    align-items: center;
    .contentClass{
        width: 400px;
        .iconClass{
            height: 100px;
            font-size: 60px;
            font-weight: bold;
            color: #FA8C16;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .textClass{
            font-size: 28px;
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .butClass{
            display: flex;
            height: 100px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            .ButCancel{
                width: 120px;
                height: 44px;
                border: 1px solid #BBBBBB;
                background-color: #FBFBFB;
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                cursor: pointer;
            }
            .ButAffirm{
                width: 174px;
                height: 45px;
                background-color: #1890FF;
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: #fff;
                cursor: pointer;
            }
        }
    }
}
</style>