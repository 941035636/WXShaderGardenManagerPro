<template>
	<div id="ProductInfo">
		<Title :titles="title"></Title>
		<div class="content mt20">
			选择产品及相关信息 <span class="content-botton" @click="Chooseproducts">点击选择</span>
		</div>
		<AddProductInfo ref="myChildEleList" @func="getMsgFormSon" @funcYG="setYGBranch" @funcLHB="setLHB"></AddProductInfo>
		<div class="content-tabel" v-if="isShow">
			<el-table :data="form.tableData" :span-method="objectSpanMethod" border style="width: 100%;" fit :header-cell-style="getRowClass">
				<el-table-column prop="riskName" label="险种"></el-table-column>
				<el-table-column prop="dutyName" label="责任"></el-table-column>
				<el-table-column prop="name" label="限额"></el-table-column>
				<el-table-column prop="showValue" label="限额值">
					<template slot-scope="scope">
						<span v-if="scope.row.showValue / 10000 >= 1">{{scope.row.showValue/10000}}万元</span>
						<span v-else>{{scope.row.showValue}}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-form :model="employee" class="demo-ruleForm num-style" label-position="right" label-width="130px" :rules="rules" ref="employee">
			<el-form-item label="从业人员："  prop="employees" v-if="form.productSort == 'gz' || form.productSort == 'ty' || form.productSort == 'jz'">
				<el-input placeholder="请输入从业人员" v-model="employee.employees" class="item1" clearable  maxlength="5"></el-input>
			</el-form-item>
			<el-form-item label="设备数量："  prop="sequipmentNum" v-if="form.productSort == 'dt' || form.productSort == 'qp'">
				<el-input placeholder="请输入设备数量" v-model="employee.sequipmentNum" class="item1" clearable  maxlength="5"></el-input>
			</el-form-item>
			<el-form-item label="物业项目数量："  prop="propertyNum" v-if="form.productSort == 'wy'">
				<el-input placeholder="请输入物业项目数量" v-model="employee.propertyNum" class="item1" clearable  maxlength="5"></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import Title from './Title'
import AddProductInfo from './AddProductInfo'
import store from "../../../store/index"
import Bus from "@/util/busEvent"
export default {
	name:'ProductInfo',
	components:{
		Title,AddProductInfo
	},
	store,
	data() {
		var checkEmployees = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("请输入数量"));
			} else if (value == 0 || value > 50000 ) {
				callback(new Error("数量必须为大于0小于等于50000的正整数"));
			} else {
				callback();
			}
		};
		return {
			title:'产品信息',
			form:{},
			isShow:false,
			employee:{
				employees:'',
				sequipmentNum:'',
				propertyNum:''
			},
			rules: {
				employees: [{ required: true, validator: checkEmployees, trigger: "blur" }],
				sequipmentNum: [{ required: true, validator: checkEmployees, trigger: "blur" }],
				propertyNum: [{ required: true, validator: checkEmployees, trigger: "blur" }]
			},
		};
  },
  watch:{
    "form.projectCode":{
      handler(curVal,oldVal){
        console.log(this.form.projectCode)
        console.log(curVal)
       Bus.$emit("productBus",curVal)
      },
      deep:true,
      immediate:true
    }    
  },
	computed: {
		
	},
	created() {
		if(this.$route.query.flag == 'again'){
			this.getData();
		}
	},
	methods: {
		getData(){
			this.isShow = true;
			this.form = this.$store.getters.productInfo;
			this.employee = {
				employees:this.form.employees,
				sequipmentNum:this.form.sequipmentNum,
				propertyNum:this.form.propertyNum
			};
			this.form;
		},
		getRowClass({row,column,rowIndex,columnIndex}) {//修改表头样式
            if (rowIndex == 0) {
                return 'background-color: #EFF1F6;color:#6683D5;font-weight: 600;height:40px;';
            } else {
                return 'background: #fff';
            }
		},
		Chooseproducts(){
			this.$refs.myChildEleList.Opendialog(this.form);
		},
		setYGBranch(flag) {
			this.$emit('setFuncYG',flag);
		},
		setLHB(flag) {
			this.$emit('setFuncLHB',flag);
		},
		getMsgFormSon(data){
			console.log(data,'productinfo')
			this.isShow = true;
			this.form = data;
			this.employee = {
				employees:'',
				sequipmentNum:'',
				propertyNum:''
			};
		},
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			var beginIndex;
			var endIndex;
			for(var i=0;i<this.form.tableData.length;i++){
				var item = this.form.tableData[i];
				if(columnIndex == 0) {
					if(row.riskCode == item.riskCode) {
						if(!beginIndex && beginIndex != 0) { beginIndex = i; continue; }
						if(beginIndex || beginIndex == 0) { endIndex = i; continue; }
					}
				}
				if(columnIndex == 1) {
					if(row.riskCode == item.riskCode && row.dutyCode == item.dutyCode) {
						if(!beginIndex && beginIndex != 0) { beginIndex = i; continue; }
						if(beginIndex || beginIndex == 0) { endIndex = i; continue; }
					}
				}
			}
			if((beginIndex || beginIndex == 0) && (endIndex || endIndex == 0) &&  beginIndex == rowIndex) {
				var row = endIndex - beginIndex + 1;
				return { rowspan: row, colspan: 1 };
			}else if(!endIndex) {
				return { rowspan: 1, colspan: 1 };
			}else{
				return { rowspan: 0, colspan: 0 };
			}
		},
		submitForm3(){
			if(this.form.productCode){
				let obj = {};
				 this.$refs['employee'].validate((valid) => {
					if (valid) {
						obj = Object.assign(this.form,this.employee);
						console.log(obj,'产品数据')
						return obj;
					} else {
						this.$message({
							message: '请填写数量！',
							type: 'warning'
						});
						obj = false;
					}
				});
				return obj;
			}else{
				this.$message({
					message: '请选择产品和产品方案！',
					type: 'warning'
				});
				return false;
			}
		},
	}
};
</script>

<style lang="less">
#ProductInfo{
	background-color: #ffffff;
	margin: 10px;
	padding: 0px 40px 20px 40px;
	.content{
		line-height: 40px;
		.content-botton{
			display: inline-block;
			width: 168px;
			height: 40px;
			color: #6683D5;
			margin-left: 20px;
			text-align: center;
			border: 1px solid #ECECEC;
			border-radius: 4px;
			box-sizing: border-box;
			cursor: pointer;
		}
	}
	.content-tabel{
		margin: 20px;
		width: calc(100% - 40px);
		height: 100%;
	}
	.num-style {
		.item1{
			width: 350px;
		}
	}
	
}
</style>
