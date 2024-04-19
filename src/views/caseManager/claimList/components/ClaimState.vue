<template>
    <div id="ClaimState">
        <div class="filter-state">
            <span>引用状态:</span>
            <div>
                <span 
                    v-for="item in stateList" 
                    :key="item.value" 
                    :class="{'state-active': item.value == stateIndex}"
                    @click="stateChange(item.value)"
                >{{ item.label }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ClaimState",
    props: {
        stateStatus: {
            type: String,
            default: '0',
        },
    },
    data() {
        return {
            stateList: [{
                label: '全部',
                value: 0,
            },{
                label: '未认领',
                value: 1,
            },{
                label: '已认领',
                value: 3,
            },{
                label: '已认领引用结案',
                value: 4,
            },],
            stateIndex: 1,
        }
    },
    watch: {
        stateStatus(newValue) {
            this.stateIndex = +newValue
        },
    },
    methods: {
        stateChange(value) {
            this.stateIndex = value
            this.$emit('stateChange', this.stateIndex + '')
        },
    }
}
</script>

<style lang="less" scoped>
#ClaimState {
    .filter-state {
        display: flex;
        align-items: center;
        div {
            display: flex;
            span {
                padding: 6px 20px;
                border: 1px solid #096DD9;
                border-radius: 50px;
                margin-left: 25px;
                color: #096DD9;
                cursor: pointer;
            }
        }
    }
}
</style>