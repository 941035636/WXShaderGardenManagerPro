<template>
<!-- 关联账号 -->
    <div class="RelationDetails" id="RelationDetails">
      <div class="head">关联账号</div>
      <el-table :data="userloginIdList" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="rowClass">
            <el-table-column  type="index" label="序号" align="center" width="100"></el-table-column>
            <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
            <el-table-column prop="taxpayerName" label="用户账号" align="center">
              <template slot-scope="scope">
                <span class="color-red">{{scope.row.userloginId}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taxpayerName" label="类型" align="center">
              <template slot-scope="scope">
                <span class="color-red">{{scope.row.userloginId?'主账号':''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taxpayerNo" label="操作" align="center">
              <template slot-scope="socpe">
                <el-button type="text" @click="resetPassword(socpe.row)">重置密码</el-button>
              </template>
            </el-table-column>
            
          </el-table>
          <ResetPassword ref="ResetPassword"/>
		</div>
</template>

<script>
import ResetPassword from './ResetPassword'
export default {
    components:{
      ResetPassword,
    },
    props: {
      userloginIdList:{
        type: Array,
        default:()=>{
          return []
        }
      }
    },
    data() {
        return {
          
				}
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      rowClass({row, column, rowIndex, columnIndex}) {//修改表头样式
        if (rowIndex == 0) {
          return 'color:#0050b3;font-weight: 600;background-color:#e6f7ff;font-size:14px;text-align: center;';
        } else {
          return;
        }
      },
      // 重置密码
      resetPassword(row) {
        this.$refs.ResetPassword.open(row)
      },
    },
};
</script>

<style lang="less" scoped>
  .RelationDetails{
		margin-top: 10px;
		background-color: #fff;
		padding: 20px 50px;
		.head{
      width: 100%;
      box-sizing: border-box;
      line-height: 22px;
      height: 22px;
      margin-bottom: 20px;
      color: #000000;
      font-size: 18px;
      font-weight: 700;
      padding-left: 24px;
      border-left: 4px solid #FFC069;
    }
		
	}
</style>

