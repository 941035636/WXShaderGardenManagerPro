<template class='template'>
    <div class="wrapper" id="addColum">
        <div class="wrapper-content">
            <el-dialog class="box-aler" :title="title" :visible.sync="centerDialogVisible" width="800px" center>
                <div class="wrapper">
                    <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-ruleForm">

                        <el-form-item label="栏目名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入名称" size="small" class="with100"
                                clearable></el-input>
                        </el-form-item>

                        <el-form-item label="栏目编码" prop="typeCode">
                            <el-input v-model="form.typeCode" placeholder="请输入编码" size="small" class="with100"
                                clearable></el-input>
                        </el-form-item>
                        <el-form-item label="模板状态：" prop="status">
                            <span style="margin-right:5px;">关闭</span>
                            <el-switch v-model="form.status" active-color="#1dd867" inactive-color="#ff4949"
                                :active-value="1" :inactive-value="2">
                            </el-switch>
                            <span style="margin-left:5px;">正常</span>
                        </el-form-item>
                        <el-form-item>
                            <div class="dialpg-btn">
                                <el-button round size="medium" @click="centerDialogVisible = false">取 消</el-button>
                                <el-button type="primary" size="medium" round @click="submitForm('form')">确认提交</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import newsService from "@/service/newsService.js";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            centerDialogVisible: false,
            title: "",
            newsService: new newsService(),
            isIdOne: true,
            form: {
                isDelete: false,
                typeCode: "",
                name: "",
                parentId: "",
                status: 1,
                type: 1,
                sort: 0
            },
            rules: {
                typeCode: [{ required: true, message: "请输入编码", trigger: "blur" }, {
                    min: 2,
                    max: 50,
                    message: '长度在 2 到 50 个字符',
                    trigger: 'blur'
                },
                {
                    pattern: /^[\da-z]+$/,
                    message: "支持小写字母和数字",
                    trigger: ["blur"]
                }
                ],
                name: [{ required: true, message: "请输入名称", trigger: "blur" }, {
                    min: 2,
                    max: 50,
                    message: '长度在 2 到 50 个字符',
                    trigger: 'blur'
                }],
                status: [{ required: true, message: "请选择状态", trigger: "change" }]
            }
        };
    },

    computed: {
        ...mapGetters({
            enumObj: "getEnumAll",
        }),
    },

    watch: {
        centerDialogVisible: {
            // 执行方法
            handler(newValue, oldValue) {
                if (!newValue) {
                    //表单重置,重置为初始化时值
                    this.$nextTick(() => {
                        this.form = this.$options.data.call(this).form
                    })
                    console.log('this.form', this.form);
                }
            },
            deep: true, // 深度监听
            // immediate: true, // 最初绑定值的时候也执行函数
        },
    },

    mounted() {

    },
    methods: {
        //创建栏目or创建列表
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    console.log(this.title,this.form,'-------------');
                    if (this.title == '添加栏目') {
                        this.newsService.creClm(this.form).then(res => {
                            if (res.data.code == "0000") {
                                this.$message({
                                    message: "创建成功",
                                    type: "success"
                                });

                                this.centerDialogVisible = false
                                this.$refs.form.resetFields()  //重置props绑定的值
                                this.$emit("upData", true);

                            } else {
                                this.$message.error({
                                    message: "创建失败，请联系管理员"
                                });
                            }
                        });
                    }
                    if (this.title == '修改栏目') {
                        this.newsService.createColumn(this.form).then(res => {
                            if (res.data.code == "0000") {

                                this.$message({
                                    message: "修改成功",
                                    type: "success"
                                });

                                this.centerDialogVisible = false
                                this.$refs.form.resetFields()  //重置props绑定的值
                                this.$emit("upData", true);
                            } else {
                                this.$messag.error({
                                    message: '"修改失败，请联系管理员'
                                });
                            }
                        });


                    }

                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //修改栏目或修改类比
    }
};
</script>

<style lang="less" scoped>
#addColum {
    .with20 {
        width: 20%;
        float: left;
        text-align: center;
    }

    .dialpg-btn {
        text-align: right;

    }
}
</style>
