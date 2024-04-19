<template>
    <div id="BaseTable">
        <div class="table-item" v-for="(item,index) in list" :key="index">
            <div class="table-item-title" :style="{ 'background-color': titleBgColor }" v-if="item.title">{{ item.title }}</div>
            <div class="table-item-title" :style="{ 'background-color': titleBgColor }" v-else> &emsp; </div>
            <div class="table-item-text">
                <el-tooltip class="item" effect="dark" :content="item.value" placement="top">
                    <div :style="{'color':item.color}">{{ item.value }}</div>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BaseTable",
    props: {
        list: {
            type: Array,
            default: function() {
                return [];
            },
        },
        titleBgColor: {
            type: String,
            default: "#E6F7FF",
        }
    },
    data() {
        return {}
    },
}
</script>

<style lang="less" scoped>
    #BaseTable {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        border-left: 1px solid #DFE5E8;
        border-bottom: 1px solid #DFE5E8;
        .table-item {
            width: calc(100% / 3);
        }
        .table-item-title, .table-item-text {
            line-height: 30px;
            text-align: center;
            color: #000;
            overflow: hidden;
        }
        .table-item-title {
            box-sizing: border-box;
            font-weight: 700;
            border-right: 1px solid #DFE5E8;
            border-bottom: 1px solid #DFE5E8;
            border-top: 1px solid #DFE5E8;
            background: #E6F7FF;
        }
        .table-item-title:nth-child(2n) {
            border-right: 0;
        }
        .table-item-text {
            box-sizing: border-box;
            width: 100%;
            height: 30px;
            padding: 0 10px;
            cursor: pointer;
            border-right: 1px solid #DFE5E8;
        }
    }
</style>