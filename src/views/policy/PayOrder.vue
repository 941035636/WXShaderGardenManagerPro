<template>
    <div id="payOrder">
        <div class="ts-wrapper mt30">
            <Step :two="true" :three="true"></Step>
            <div class="mt20 success-text ml50">
                <i class="el-icon-success"></i>
                <span>订单提交成功</span>
            </div>
        </div>
    </div>
</template>
<script>
import Step from './components/Step';
import productService from '@/service/ProductService'
export default {
    name:'',
    components: {
        Step
    },
    data() {
        return {
            orderInfo: {},
            radio: '1',
            productService: new productService(),
            info: {
                accountVoList:[
                    {
                       bankName: '', 
                       bankAccountName: '',
                       bankAccountNo: ''
                    }
                ]
            }
        }
    },
    created() {
        
    },
    methods: {
       
        clearInfo() {
            window.sessionStorage.removeItem('vuex')
            window.sessionStorage.removeItem('personList')
        }
    },
    beforeRouteLeave (to, from, next) {
        this.clearInfo();
        next();
    }
    
}
</script>
<style lang="less" scoped>
    #payOrder {
        .el-radio__label {
            font-size: 20px;
            padding-left: 10px;
        }
        .ts-wrapper{
            width: 1200px;
            margin: 30px auto;
            background-color: #fff;
            .success-text {
                height: 500px;
                line-height: 500px;
                text-align: center;
                color: #259b24;
                .el-icon-success {
                    font-size: 40px;
                }
                span {
                    font-size: 25px;
                    margin-left: 10px;
                }
            }
            .order-text {
                display: inline-block;
            }
            .money-style {
                color: #E51C23;
            }
            .mr5 {
                margin-right: 5px;
            }
            .ml5 {
                margin-left: 5px;
            }
            .line {
                padding-bottom: 20px;
                border-bottom: 1px dotted #ccc;
            }
        }
        .table-style {
            color: #101010;
            border: 1px solid #ccc;
            font-size: 20px;
            margin: 0 auto;
            tr {
                td:nth-child(1) {
                    padding: 20px;
                    width: 400px;
                    text-align: center;
                    border: 1px dotted #ccc;
                    border-top: 0;
                    border-left: 0;
                }
                td:nth-child(2) {
                    width: 600px;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px dotted #ccc;
                }
            }
            .color-red {
                color: #f83023;
            }
        }
        .ml80 {
            margin-left: 80px;
        }
        .span-line {
            // display: block;
            margin-top: 20px;
            margin-left: 20px;

        }
    }
</style>



