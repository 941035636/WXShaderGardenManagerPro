<template>
    <div id="ClaimDialog">
        <el-dialog :title=title :visible.sync="dialogVisible" :width=width>
            <slot name="body"></slot>
            <slot name="footer"></slot>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "ClaimDialog",
    props: {
        title: {
            type: String,
            default: "默认标题",
        },
        value: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: '30%',
        },
    },
    computed: {
        dialogVisible: {
            get() {
                return this.value;
            },
            set(newValue) {
                this.$emit('input', newValue)
            },
        },
    },
}
</script>

<style lang="less">
#ClaimDialog {
    color: #000;
    .el-dialog__body {
        padding-top: 0px;
    }
    .el-dialog {
        margin-top: 11vh!important;
    }
}
</style>
