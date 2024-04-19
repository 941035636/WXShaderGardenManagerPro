<template>
    <div>
        <!-- Form -->

        <el-dialog title="设备信息" :visible.sync="dialogFormVisible"  >
        <el-form :model="form">
            
            <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-radio-group v-model="form.radio">
                    <el-radio :label="1">设备代码</el-radio>
                    <el-radio :label="2">出厂编号</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="设备代码" :label-width="formLabelWidth">
                <el-input class="ts-ele-input" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="出厂编号" :label-width="formLabelWidth">
                <el-input class="ts-ele-input" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-radio-group v-model="form.radio">
                    <el-radio :label="1">直梯</el-radio>
                    <el-radio :label="2">扶梯</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="载重" :label-width="formLabelWidth">
                <el-input class="ts-ele-input" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="提升高度" :label-width="formLabelWidth">
                <el-input class="ts-ele-input" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电梯使用场所" :label-width="formLabelWidth">
                <el-select class="ts-ele-input" v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="电梯使用年限" :label-width="formLabelWidth">
                <el-input class="ts-ele-input" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电梯生产商" :label-width="formLabelWidth">
                <el-select class="ts-ele-input" v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            flag:false,
            dialogFormVisible: false,
            form: {
                radio:1,
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
                },
            formLabelWidth: '120px'
        }
    },
    methods:{
        flagTrue(){
            this.dialogFormVisible=true
        }

    }
}
</script>

<style>
.ts-ele-input{
    width: 458px;
}
</style>
