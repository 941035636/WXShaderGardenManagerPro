<template>
<!-- 案件中止组件 -->
    <div id="caseStopDetails">
        <div class="case-stop">
            <el-row class="con-row">
                <el-col :span="2" class="con-col">
                    <i class="el-icon-video-pause"></i>
                </el-col>
                <el-col :span="8" class="con-col">
                    <div>
                        中止类型：
                        <span>{{this.pauseVo.pauseType}}</span>
                    </div>
                    <div class="mt10">
                        中止时间：
                        <span>{{this.pauseVo.pauseTime}}</span>
                    </div>
                </el-col>
                <el-col :span="14" class="con-col">
                    <div>
                        原因：
                        {{this.pauseVo.pauseReason}}
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
export default {
    data() {
		return {
		}
    },
    computed:{
        ...mapGetters({
            pauseVo:'pauseVo'
        }),
        getPauseVo(){
            return [this.pauseVo]
        }
    },
    props:{
       
    },
    created() {
    },
    methods: {
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#FFF7E6; color: #000'
            } else {
            return ''
            }
        },
        
    }
}
</script>
<style lang="less" scoped>
    #caseStopDetails {
        border-top: 1px dashed #ccc;
        // background-color:#fffaea;
        margin-top: 10px;
        .case-stop {
			// background-color: #fffaea;
            padding: 10px 20px 10px;
			margin: 0px 0 0px;
            // display: flex;
            // justify-content: center;
            // align-items: center;
			.el-icon-video-pause {
				color: #ffa940;
				font-size: 34px;
				line-height: 56px;
				margin-right: 20px;
			}
            .case-stop-r {
                text-align: right;
                width: 200px;
            }
            div {
                color: #000;
            }
		}
    }
</style>