<template>
	<div id="InsuredInfoOther">
		<Title :titles="title"></Title>
		<div class="content mt20">
			<el-table :data="addList"  style="width: 90%;margin-left:5%;" center border :header-cell-style="getRowClass" class="mt20">
                <el-table-column type="index" label="序号" align="center" width="80">
                </el-table-column>
				<el-table-column  label="姓名" prop="name"></el-table-column>
				<el-table-column  label="证件类型" prop="licenceType"></el-table-column>
				<el-table-column  label="证件号" prop="code"></el-table-column>
				<el-table-column label="投保房屋详细地址" width="400">
                    <template slot-scope="scope">
                        <span>{{scope.row.houseProvinceName}}{{scope.row.houseCityName}}{{scope.row.houseCountyName}}{{scope.row.houseLocation}}</span>
					</template>
                </el-table-column>
            </el-table>
		</div>
	</div>
</template>

<script>
import Title from './Title'
import store from "../../../store/index"
export default {
	name:'InsuredInfoOther',
	components:{
		Title
	},
	props:{
		'addList':Array
	},
	store,
	data() {
		return {
			title:'被保人清单',
		};
  	},
	computed: {
		
	},
	created() {
		
	},
	methods: {
		//修改表头样式
        getRowClass({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (rowIndex == 0) {
                // return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;font-weight:500;';
                return 'background: #e8e8e8;color:#101010;font-size:16px;font-weight:500;';
            } else {
                return 'background: #fff';
            }
		},
	}
};
</script>

<style lang="less">
#InsuredInfoOther{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
}
</style>
