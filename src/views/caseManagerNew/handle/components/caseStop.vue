<template>
<!-- 案件中止组件 -->
    <div id="caseStop">
        <div class="case-stop">
            <i class="el-icon-video-pause"></i>
            <el-table
                :data="getPauseVo"
                border
                :header-cell-style="getRowClass"
                >
                <el-table-column
                    prop="settleTypeName"
                    label="类型"
                    width="180">
                    <template slot-scope="sopced">
                        <span style="color:#1890FF">
                            {{sopced.row.pauseType}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pauseTime"
                    label="中止时间"
                    width="180"
                >
                </el-table-column>
                <el-table-column
                    prop="settleTypeName"
                    label="原因说明"
                >
                    <template slot-scope="sopced">
                        {{sopced.row.pauseReason}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="case-stop-r">
                <el-button type="primary"  round  @click="relieveStop">解除中止</el-button>
            </div>
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
        ...mapActions(['cancelPauseStatus']),
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
            return 'background:#FFF7E6; color: #000'
            } else {
            return ''
            }
        },
        relieveStop() {
			this.$confirm('此操作将“解除中止”, 是否继续?', '解除中止', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.cancelPauseStatus();
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消'
				});          
			});
		},
    }
}
</script>
<style lang="less" scoped>
    #caseStop {
        background-color:#fffaea;
        margin-top: 10px;
        .case-stop {
			background-color: #fffaea;
            padding: 10px 20px 10px;
			margin: 0px 0 20px;
            display: flex;
            justify-content: center;
            align-items: center;
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
		}
    }
</style>