<template>
    <div>
        <el-dialog class="ts-import" :title="title" :visible.sync="dialogFormVisible" :before-close="updataNum"  :close-on-click-modal="modul" width="70%">
            <div class="ts-ele-tab">
                <div class="ts-ele-add-btn">
                    <el-button type="warning" plain id="ts-ele-btn1" v-if="isShow" @click="addPerson">添加</el-button>
                </div>
            </div>  
            <el-table :data="tableData"  border class="table ts-table" height="300" >
				<el-table-column
			      type="index"
			      width="55"
			      align="center" >
			    </el-table-column>
				<el-table-column prop="name" label="姓名" align="center">
				</el-table-column>
                <el-table-column prop="licenceType" label="证件类型" align="center">
				</el-table-column>
				<el-table-column prop="id" label="证件号码" align="center">
				</el-table-column>
				<el-table-column prop="post" label="人员岗位"  align="center">
				</el-table-column>
				<el-table-column label="操作" align="center" v-if="isShow">
					<template slot-scope="scope">
						<el-button type="text"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
						<el-button type="text"  @click="handleDelete(scope.$index, scope.row)">移除</el-button>
					</template>
				</el-table-column>
			</el-table> 
            <el-pagination class="mt40 text-center"
                background
                layout="total"
                :total="total">
            </el-pagination>
        </el-dialog>
        <el-dialog title="修改投保人员信息" :visible.sync="dialogEdit" :before-close="handleClose">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                    <el-input class="ts-ele-input" v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="licenceType">
                    <el-select v-model="form.licenceType" clearable placeholder="请选择证件类型">
                        <el-option
                        v-for="item in  idType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth" prop="id">
                    <el-input class="ts-ele-input" v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="人员岗位" :label-width="formLabelWidth" prop="post">
                    <el-select v-model="form.post" clearable placeholder="请选择人员岗位">
                        <el-option
                        v-for="(item1,index) in typeOptions"
                        :key="index"
                        :label="item1.label"
                        :value="item1.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" v-if="form.post == '其他'">
                    <el-input class="ts-ele-input" v-model="form.postDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('form')">取 消</el-button>
                <el-button type="primary"  @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
        <AddPerson ref="myChildPer"></AddPerson>
    </div>
</template>

<script>
import AddPerson from './AddPerson'
export default {
    components: {
        AddPerson
    },
    data(){
        return{
            title: "投保人员清单",
            modul:false,
            dialogFormVisible:false,
            tableData:[],
            multipleSelection: [],
            isShow: false,
            total: 0,
            flag:false,
            dialogEdit: false,
            editIndex:0,
            typeOptions:[
                {
                    value: '1',
                    label: '安装工'
                },
                {
                    value: '2',
                    label: '维保工'
                },
                {
                    value: '3',
                    label: '改造工'
                },
                {
                    value: '4',
                    label: '内勤人员'
                },
                {
                    value: '5',
                    label: '其他'
                }
            ],
            idType: [{
                value: 'cardType_0',
                label: '中国居民身份证'
            },
            {
                value: 'cardType_12',
                label: '澳门身份证'
            },
            {
                value: 'cardType_1',
                label: '护照'
            },
            {
                value: 'cardType_2',
                label: '军官证'
            }],
            form: {
                name: '',
                id: '',
                post: '',
                postDesc: ''
            },
            formLabelWidth: '120px',
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                id: [
                    { required: true, message: '请选择证件号码', trigger: 'blur' }
                ],
                post: [
                    { required: true, message: '请选择人员岗位', trigger: 'blur' }
                ],
                licenceType: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' }
                ],
            },
        }
    },
    created(){
         
    },
    methods: {
        flagTrue(list,flag) {
            this.dialogFormVisible = true;
            this.tableData = list;
            this.total = list ? list.length:0;
            if(flag == '1') {
                this.isShow = false;
            } else {
                this.isShow = true;
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this[formName].licenceType == "中国居民身份证") {
                    if(this.$stringHelper.isIdCard(this[formName].id)) {
                        window.sessionStorage.setItem('personList',JSON.stringify(this.tableData));
                        this.tableData = JSON.parse(window.sessionStorage.getItem('personList'));
                        this.resetForm(formName);
                    } else {
                        this.$message({
                            type: 'error',
                            message: '中国居民身份证输入有误，请重新输入中国居民身份证!'
                        });
                    }
                } else {
                    window.sessionStorage.setItem('personList',JSON.stringify(this.tableData));
                    this.tableData = JSON.parse(window.sessionStorage.getItem('personList'));
                    this.resetForm(formName);
                }
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        handleClose() {
            this.resetForm('form');
        },
        resetForm(formName) {
            this.dialogEdit = false;
            this.$refs[formName].resetFields();
        },
        addPerson() {
            this.$refs.myChildPer.flagTrue();
        },
        handleEdit(index,data) {
            this.editIndex = index;
            this.dialogEdit = true;
            this.form = data;
        },
        handleDelete(index,data) {
            this.$confirm('是否删除该投保人员信息?', '删除数据', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
                this.tableData.splice(index,1);
                this.total = this.tableData.length;
                window.sessionStorage.setItem('personList',JSON.stringify(this.tableData));
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除!'
				});          
			});
        },
        updataNum() {
            this.dialogFormVisible = false;
            this.$parent.computedPerson();
        },
        computedPerson() {
            this.tableData = JSON.parse(window.sessionStorage.getItem('personList'));
            this.total = this.tableData.length;
        },
    }
}
</script>

<style lang="less" scoped>
.ts-wrapper{
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
}
.mt30{
    margin-top: 30px;
    padding: 50px;
}
.ts-ele-title,
.ts-ele-tab{
    position: relative;
}
.ts-ele-search{
    position: absolute;
    top: -10px;
    right: 160px;
}
.ts-ele-add-btn{
    position: absolute;
    right: 0;
    top: -10px;
}
.ts-ele-tab{
  height: 50px;

}
.ts-ele-tab-list {
  display: flex;
  flex-direction: row;
}
.ts-ele-tab-list li {
  font-size: 16px;
  color: #666;
  height: 38px;
  line-height: 38px;
  border-bottom: 2px solid transparent;
  margin-right: 30px;
  cursor: pointer;
}
.ts-ele-tab-list .ele-present{
    border-color: #c9984a;
    color: #c9984a;
}
#ts-ele-btn1{
    background-color: #c9984a ;
    color: #fff;
    border-radius: 5px ; 
}
.ts-import > .el-dialog > .el-dialog__header{
    border-bottom: 1px solid #ccc;
}
.text-center {
    text-align: center;
}
</style>

