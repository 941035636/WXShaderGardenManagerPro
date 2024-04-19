<template>
    <div>
        <div  class="ts-step">
            <ul class="ts-step-module">
                <li class="ts-step-title ts-step-type">
                     <!-- <img src="../../../assets/images/slider/step-01.png" alt=""> -->
                     <img src="../../../assets/images/slider/step-11.png" alt="">
                    <div>投保单填写</div>
                </li>
                
                <li :class="{'ts-step-title':true,'ts-step-type':true}">
                    <img src="../../../assets/images/slider/step-08.png" alt="">
                </li>
                <li :class="{'ts-step-title':true,'ts-step-type':two}">
                     <img  v-if="!two" src="../../../assets/images/slider/step-02.png" alt="">
                    <img v-if="two" src="../../../assets/images/slider/step-10.png" alt="">
                    <div>预览并提交</div>
                </li>
                <li :class="{'ts-step-title':true,'ts-step-type':two}">
                    <img v-if="!two" src="../../../assets/images/slider/step-04.png" alt="">
                    <img v-if="two" src="../../../assets/images/slider/step-08.png" alt="">
                </li>
                <li :class="{'ts-step-title':true,'ts-step-type':three}">
                    <img v-if="!three" src="../../../assets/images/slider/step-03.png" alt="">
                    <img v-if="three" src="../../../assets/images/slider/step-06.png" alt="">
                    <div>完成</div>
                </li>
            </ul>
            <p></p>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        two:{
            type:Boolean,
            default:false
        },
        three:{
            type:Boolean,
            default:false
        }
    }
}
</script>

<style scoped>
.ts-step{
    position: relative;
    width: 1000px;
    height: 200px;
    margin: 0 auto;
    padding-bottom:10px; 
    /* background-color:red; */

   
}
.ts-step-module{
    width: 940px;
    height: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.ts-step-module > li {
    position: relative;
    width: 75px;
    height: 75px;
    border-radius:50%; 
    background-color: #eff1f2;
    z-index: 999;
    display: flex;
    justify-content:center;
    align-items: center;
}
.ts-step p {
    position: absolute;
    top: 100px;
    width: 100%; 
    height: 1px;
    z-index: 0;
    border-bottom: 1px dashed #ccc;
}
.ts-step-module li:nth-child(2n){
    width: 30px;
    height: 30px;
    border-radius:50%; 
    margin: 0 100px;
    display: flex;
    justify-content:center;
    align-items: center;
    background-color: #eff1f2;

}
.ts-step-title {
    position: relative;
  
}

.ts-step-title div{
    width: 100px;
    text-align: center;
    position: absolute;
    font-size: 20px;
    bottom: -40px;
    left: -10px;
   
}
.ts-step-module .ts-step-type{
    background-color:#d4ad6e !important;
    color: #d4ad6e;
}
</style>
