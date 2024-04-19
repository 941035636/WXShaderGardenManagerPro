<template>
    <div id="confirmClaimAmount">
        <div class="border-style">
            <span class="content-title">索赔金额确认</span>
            <span class="fr mt16 edit-icon" v-if="!processNull"  @click="toEditPass"><i class="el-icon-edit"></i> 修改</span>
            <el-form   :label-position="labelPosition">
                <el-button type="warning" plain v-if="processNull">去添加</el-button>
                <div v-if="!processNull">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="案件金额：">
                                <span class="col-black">{{formInline.no}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="估损金额：">
                                <span class="col-black">{{formInline.status}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="保险公司是否已核赔：">
                                <span class="col-black">{{formInline.no}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="理赔金额：">
                                <span class="col-black">{{formInline.status}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-table  :data="tableData1"  style="width: 80%;margin-top:20px;" :header-cell-style="getRowClass">
                        <el-table-column prop="index" label="序号" align="center"></el-table-column>
                        <el-table-column prop="name" label="文件名" align="center"></el-table-column>
                        <el-table-column prop="idNumber" label="资料类型" align="center"></el-table-column>
                        <el-table-column prop="occupation" label="资料描述" align="center"></el-table-column>
                        <el-table-column prop="phone" label="上传时间" align="center"></el-table-column>
                    </el-table>
                    <el-table  :data="tableData1"  style="width: 80%;margin-top:20px;" :header-cell-style="getRowClass">
                        <el-table-column prop="index" label="序号" align="center"></el-table-column>
                        <el-table-column prop="name" label="收款户名" align="center"></el-table-column>
                        <el-table-column prop="idNumber" label="收款账户" align="center"></el-table-column>
                        <el-table-column prop="occupation" label="开户银行" align="center"></el-table-column>
                    </el-table>
                </div>
            </el-form>
        </div>
        <el-dialog title="索赔核赔" :visible.sync="dialogVisible"  width="60%" :before-close="handleClose">
			<el-form   :label-position="rightPosition" label-width="120px" :inline="true">
                <div>
                    <el-row>
                        <el-form-item label="索赔金额：">
                            <el-input v-model="formInline.no" ></el-input>
                        </el-form-item>
                        <el-form-item label="估损金额：">
                            <el-input v-model="formInline.no" ></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="是否已核赔：">
                            <el-input v-model="formInline.no" ></el-input>
                        </el-form-item>
                        <el-form-item label="理赔金额：">
                            <el-input v-model="formInline.no"></el-input>
                        </el-form-item>
                    </el-row>
                </div>
			</el-form>
			<el-table  :data="tableData"  style="width: 80%;margin-left:10%;" :header-cell-style="getRowClass">
				<el-table-column prop="index" label="序号" align="center"></el-table-column>
				<el-table-column prop="name" label="文件名" align="center"></el-table-column>
				<el-table-column prop="idNumber" label="资料类型" align="center"></el-table-column>
				<el-table-column prop="occupation" label="资料描述" align="center"></el-table-column>
				<el-table-column prop="phone" label="上传时间" align="center"></el-table-column>
				<el-table-column align="center" width="40px">
                    <template slot-scope="scope">
                        <i @click="deleteClick(scope.row.index)" class="el-icon-circle-close"></i>
                    </template>
                </el-table-column>
			</el-table>
			<el-form   :label-position="rightPosition" label-width="120px">
                <div clsaa="inline-block">
                    <el-row>
						<el-col :span="7">
							<el-upload class="upload-demo inline-block" action="https://jsonplaceholder.typicode.com/posts/" drag :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture">
								<i class="el-icon-plus"></i>
								<div class="el-upload__text"><em>点击</em>或拖拽上传</div>
							</el-upload>
						</el-col>
                        <el-col :span="7" class="mt50">
                            <el-form-item label="资料类型：">
                                <el-select v-model="typeOptions" clearable placeholder="请选择人员岗位">
									<el-option
										v-for="item in typeOptions"
										:key="item.value"
										:label="item.label"
										:value="item.label">
									</el-option>
								</el-select>
                            </el-form-item>
							<el-form-item label="资料描述：">
								<el-input v-model="occupation" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
			</el-form>
            <el-table  :data="tableDataBand"  style="width: 80%;margin-left:10%;" :header-cell-style="getRowClass">
				<el-table-column prop="index" label="序号" align="center"></el-table-column>
				<el-table-column prop="name" label="收款户名" align="center"></el-table-column>
				<el-table-column prop="idNumber" label="收款账户" align="center"></el-table-column>
				<el-table-column prop="occupation" label="开户银行" align="center"></el-table-column>
				<el-table-column align="center" width="40px">
                    <template slot-scope="scope">
                        <i @click="deleteClick(scope.row.index)" class="el-icon-circle-close"></i>
                    </template>
                </el-table-column>
			</el-table>
            <span @click="addBand" class="add-person"><i class="el-icon-circle-plus"></i>添加收款账户</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="warning" @click="dialogVisible = false">保 存</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
export default {
    data() {
		return {
			tableData:[],
			tableData1:[],
			tableDataBand:[],
			occupation:'',
			idNumber:'',
			fileList2:[],
			dialogVisible:false,
			processNull:false,
			labelPosition: 'left',
			rightPosition: 'right',
			formInline: {
				no: '532414432455',
				status: '已结案'
			},
			typeOptions:[]
		}
    },
    methods: {
		toEditPass() {
			this.dialogVisible = true;

		},
		handleClose() {
			this.dialogVisible = false;
        },
        addBand() {
            this.tableDataBand.push(
                {
                    name:'',
                    idNumber:'',
                    occupation:'',
                    termValidity:''
                }
            );
        },
		//修改表头样式
        getRowClass({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            if (rowIndex == 0) {
                return 'background: #fefbf1;border-bottom:1px solid #f0dfbf;color:#cda160;font-size:16px;';
            } else {
                return 'background: #fff';
            }
		},
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		goTo(name) {
			let anchor = this.$refs[name];
			console.log(this.$refs[name].scrollTop);
            this.$nextTick(() => {
				 this.$refs[name].scrollTop = anchor.offsetTop
				 console.log(this.$refs[name].scrollTop);
            });
		}

		
	},
}
</script>
<style lang="less" scoped>
    #confirmClaimAmount {
        .add-person {
            margin-left: 5%;
            font-size: 18px;
            color: #db9728;
            cursor: pointer;
        }
        .el-icon-circle-close {
            color: #d81e06;
            font-size: 18px;
        }
        .el-dialog__footer {
            text-align: center;
            .el-button--warning {
                padding: 14px 50px;
                font-size: 14px;
                background-color: #c9984a;
                border-color: #c9984a;
                font-size: 18px;
            }
        }
    }

</style>