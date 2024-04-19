<template>
    <div class="ts-border">
        <h2 class="ts-insure-title">
            {{title}}
        </h2>
         <!-- <el-divider></el-divider> -->
    </div>
</template>

<script>
export default {
    props:['title']
        
    
}
</script>

<style scoped>
.ts-border{
    /* border-bottom: 1px solid #ccc;  */
    margin-bottom: 20px;
}
.ts-insure-title{
    color: #d1a86c;
    font-size: 20px;
    padding: 17px 0px;
    padding-left: 10px;
    /* border-left: 4px solid  #d1a86c; */
    background-color: #efe4c0;
}
</style>
