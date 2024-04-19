<template>
    <div class="tags">
        <span >{{data.value1}}</span>
        <span v-if="data.value2" :style="data.value3?'color:#999999;':'color:#000;'"><span>></span>{{data.value2}}</span>
        <span  v-if="data.value3" style="color:#000;"><span>></span>{{data.value3}}</span>
    </div>
</template>

<script>
import bus from './bus.js';
export default {
    data() {
        return {
            data:{}
        }
    },
    methods: {
        
    },
    computed: {
        
    },
    created(){
        this.data = JSON.parse(window.sessionStorage.getItem('luyou'))
    },
    methods:{
        save(){
            this.data = JSON.parse(window.sessionStorage.getItem('luyou'))
        }
    }
}
</script>

<style lang='less'>
.tags {
    width: 100%;
    height: 50px;
    overflow: hidden;
    // background: #FFFFFF;
    line-height: 50px;
    font-size: 16px;
    color: #BBBBBB;
    padding-left: 20px;
    box-sizing: border-box;
    span{
        margin-right: 10px;
    }
}
</style>
