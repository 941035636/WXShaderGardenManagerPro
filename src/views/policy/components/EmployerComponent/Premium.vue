<template>
    <div id="premium" class="mb20">
        <Title title="保费计算"></Title>
        <div class="ml70">
            <ul>
                <li class="f14 pb10 lh40 mb10"><el-button class="ts-ele-btn" type="warning" size="medium" @click="calMoney">立即计算</el-button></li>
                <li class="f14 pb10" v-if="showMoney">计算公式：</li>
                <li class="f14 pb10 lh40 ml40" v-if="showMoney">总保险费 = {{this.calpremiums.singlePremiums[0].premiumDesignDesc}}</li>
            </ul>
            <ul class="ts-bg-flex">
                <li class="ts-bg-column">险种/方案</li>
                <li class="ts-bg-column">人员数量</li>
                <li class="ts-bg-column">基本保险费总值（元）</li>
                <li class="ts-bg-column">附加保险费总值（元）</li>
                <li class="ts-bg-column">总保险费（元）</li>
                <li class="ts-bg-column">保费详情</li>
            </ul>
            <ul class="ts-bg-flex bgfff" v-if="showMoney">
                <li class="ts-bg-column">{{this.calpremiums.singlePremiums[0].riskPremiums[0].riskName}}</li>
                <li class="ts-bg-column">{{this.calpremiums.singlePremiums[0].factorResps[0].factorRate}}</li>
                <li class="ts-bg-column">{{this.calpremiums.singlePremiums[0].riskPremiums[0].riskPremiuml.toFixed(2)}}</li>
                <li class="ts-bg-column">0.00</li>
                <li class="ts-bg-column">{{this.calpremiums.totalPremium.toFixed(2)}}</li>
                <li class="ts-bg-column"><span class="freeDetail" @click="showFreeDetail(calpremiums,'offic')">保费详情</span></li>
            </ul>
            <ul class="ts-bg-flex  bgfff" v-if="showMoney1">
                <li class="ts-bg-column">{{this.calpremiums1.singlePremiums[0].riskPremiums[0].riskName}}</li>
                <li class="ts-bg-column">{{this.calpremiums1.singlePremiums[0].factorResps[0].factorRate}}</li>
                <li class="ts-bg-column">{{this.calpremiums1.singlePremiums[0].riskPremiums[0].riskPremiuml.toFixed(2)}}</li>
                <li class="ts-bg-column">0.00</li>
                <li class="ts-bg-column">{{this.calpremiums1.totalPremium.toFixed(2)}}</li>
                <li class="ts-bg-column"><span class="freeDetail" @click="showFreeDetail(calpremiums1,'normal')">保费详情</span></li>
            </ul>
            <ul class="no-info mb20" v-if="hideBorder">
                <div class="no-info-style">请在填写完投保信息后点击【保费计算】</div>
            </ul>
            <el-dialog title="保费详情" :visible.sync="dialogVisible" width="80%">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="姓名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="licenceType"
                        label="证件类型"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="证件号码">
                    </el-table-column>
                    <el-table-column
                        prop="post"
                        label="人员岗位">
                    </el-table-column>
                    <el-table-column
                        prop="risk"
                        label="险种/方案">
                    </el-table-column>
                    <el-table-column
                        prop="mainMoney"
                        label="基本保险费(元)">
                    </el-table-column>
                    <el-table-column
                        prop="subMoney"
                        label="附加保险费(元)">
                    </el-table-column>
                    <el-table-column
                        prop="allMoney"
                        label="总保险费(元)">
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import Title from '../Title';
import UserService from '@/service/UserService';
import productService from '@/service/ProductService'
export default {
    components: {
        Title
    },
    props: {
        productDetali:{
            type: Object,
            required:true
        }
    },
    data() {
        return {
            UserService: new UserService(),
            productService: new productService(),
            showMoney:false,
            showMoney1: false,
            hideBorder:true,
            premium:{},
            calpremiums: {},
            calpremiums1: {},
            tableData:[],
            offic:[],
            normal:[],
            dialogVisible:false
        }
    },
    created() {
        this.productDetali = this.productDetali;
    },
    methods: {
        //计算保费
        async calMoney() {
            this.premium = this.$parent.getPremiumInfo();
            let riskInfo = this.premium.compRisk;
            console.log(riskInfo);
            let personInfo = this.premium.personInfo;
            if(!personInfo || personInfo.length == 0) {
                return;
            } else if(JSON.stringify(riskInfo) == '{}') {
                return;
            } else {
                let offic = [];
                let normal = [];
                for(let i = 0; i < personInfo.length; i ++){
                    if(personInfo[i].post == '内勤人员') {
                        offic.push(personInfo[i]);
                    } else {
                        normal.push(personInfo[i]);
                    }
                }
                let factorVOList = this.productDetali.list //获取保费计算因子
                let factorType = factorVOList[factorVOList.map(item => item.sign ).indexOf('employeeNum')]  //保费计算因子
                let factorType1 = factorVOList[factorVOList.map(item => item.sign ).indexOf('coverSize')]  //保费计算因子
                let factorType24 = factorVOList[factorVOList.map(item => item.sign ).indexOf('hoursDangerPeople')]  //保费计算因子
                let params = [];
                let params1 = [];
                if(normal.length == 0) {
                    if(riskInfo.mainInfo1.liabilityList.length == 0) {
                        this.$message({
                            message: '请选择（ 办公室内勤人员）投保方案！！',
                            type: 'warning'
                        });
                        return false;
                    }
                    params = [{
                        "productCode": window.sessionStorage.getItem('Gucode'),	
                        "insuranceVOS": [				
                            {
                                "count": 1,				
                                "programCode": riskInfo.mainInfo1.code,	
                                "riskBeans": [					
                                    {
                                        "riskCode": riskInfo.mainInfo1.liabilityList[0].riskCode	
                                    }
                                ]
                            }
                        ],
                        "factorInfos": [	
                            {
                                "factorCode": factorType.code,	
                                "stringFactor": offic.length						
                            }
                        ],
                        "renewalStatus": "1",								
                        "channelNo": "sequip"								
                    }];
                    if(window.sessionStorage.getItem('Gucode') == '19PR103408') {
                        let name = riskInfo.valueType1 == '1' ? '住院' : '误工';
                        let addName = riskInfo.mainInfo1.programName + name;
                        let list = riskInfo.programList;
                        let hourAdd = list[list.map(item => item.programName).indexOf(addName)];
                        let hourParams = {
                            "count": 1,				
                            "programCode": hourAdd.code,	
                            "riskBeans": [					
                                {
                                    "riskCode": hourAdd.liabilityList[0].riskCode	
                                }
                            ]
                        }
                        params[0].insuranceVOS.push(hourParams);
                        let cor = {
                            "factorCode": factorType24.code,	
                            "stringFactor": 0						
                        };
                        if(riskInfo.checked2) {
                            cor.stringFactor = offic.length
                        }
                        params[0].factorInfos.push(cor);
                    }
                    if(factorType1) {
                        let cor = {
                            "factorCode": factorType1.code,	
                            "stringFactor": offic.length						
                        };
                         params[0].factorInfos.push(cor);
                    }
                    let res = await this.productService.premium(params);
                    if(res.code == '0000') {
                        this.money = res.data.totalPremium.toFixed(2);
                        this.calpremiums = res.data;
                        this.showMoney = true;
                        this.hideBorder = false;
                    }
                } else if(offic.length == 0) {
                    if(riskInfo.mainInfo.liabilityList.length == 0) {
                        this.$message({
                            message: '请选择（电梯安装工、改造工、维护工等）投保方案！！',
                            type: 'warning'
                        });
                        return false;
                    }
                    params1 = [{
                        "productCode": window.sessionStorage.getItem('Gucode'),	
                        "insuranceVOS": [				
                            {
                                "count": 1,				
                                "programCode": riskInfo.mainInfo.code,	
                                "riskBeans": [					
                                    {
                                        "riskCode": riskInfo.mainInfo.liabilityList[0].riskCode	
                                    }
                                ]
                            }
                        ],
                        "factorInfos": [	
                            {
                                "factorCode": factorType.code,	
                                "stringFactor": normal.length						
                            }
                        ],
                        "renewalStatus": "1",								
                        "channelNo": "sequip"								
                    }];
                    if(factorType1) {
                        let cor = {
                            "factorCode": factorType1.code,	
                            "stringFactor": normal.length						
                        };
                         params1[0].factorInfos.push(cor);
                    }
                    if(window.sessionStorage.getItem('Gucode') == '19PR103408') {
                        let name = riskInfo.valueType == '1' ? '住院' : '误工';
                        let addName = riskInfo.mainInfo.programName + name;
                        let list = riskInfo.programList;
                        let hourAdd = list[list.map(item => item.programName).indexOf(addName)];
                        let hourParams = {
                            "count": 1,				
                            "programCode": hourAdd.code,	
                            "riskBeans": [					
                                {
                                    "riskCode": hourAdd.liabilityList[0].riskCode	
                                }
                            ]
                        }
                        params1[0].insuranceVOS.push(hourParams);
                        let cor = {
                            "factorCode": factorType24.code,	
                            "stringFactor": 0						
                        };
                        if(riskInfo.checked1) {
                            cor.stringFactor = normal.length
                        }
                        params1[0].factorInfos.push(cor);
                    }
                    let res1 = await this.productService.premium(params1);
                    if(res1.code == '0000') {
                        this.money = res1.data.totalPremium.toFixed(2);
                        this.calpremiums1 = res1.data;
                        this.showMoney1 = true;
                        this.hideBorder = false;
                    }
                } else {
                    if(riskInfo.mainInfo.liabilityList.length == 0) {
                        this.$message({
                            message: '请选择（电梯安装工、改造工、维护工等）投保方案！！',
                            type: 'warning'
                        });
                        return false;
                    }
                    if(riskInfo.mainInfo1.liabilityList.length == 0) {
                        this.$message({
                            message: '请选择（ 办公室内勤人员）投保方案！！',
                            type: 'warning'
                        });
                        return false;
                    }
                    params = [{
                        "productCode": window.sessionStorage.getItem('Gucode'),	
                        "insuranceVOS": [				
                            {
                                "count": 1,				
                                "programCode": riskInfo.mainInfo.code,	
                                "riskBeans": [					
                                    {
                                        "riskCode": riskInfo.mainInfo.liabilityList[0].riskCode	
                                    }
                                ]
                            }
                        ],
                        "factorInfos": [	
                            {
                                "factorCode": factorType.code,	
                                "stringFactor": offic.length						
                            }
                        ],
                        "renewalStatus": "1",								
                        "channelNo": "sequip"								
                    }];
                    params1 = [{
                        "productCode": window.sessionStorage.getItem('Gucode'),	
                        "insuranceVOS": [				
                            {
                                "count": 1,				
                                "programCode": riskInfo.mainInfo1.code,	
                                "riskBeans": [					
                                    {
                                        "riskCode": riskInfo.mainInfo1.liabilityList[0].riskCode	
                                    }
                                ]
                            }
                        ],
                        "factorInfos": [	
                            {
                                "factorCode": factorType.code,	
                                "stringFactor": normal.length						
                            }
                        ],
                        "renewalStatus": "1",								
                        "channelNo": "sequip"								
                    }];
                    if(window.sessionStorage.getItem('Gucode') == '19PR103408') {
                        let name = riskInfo.valueType1 == '1' ? '住院' : '误工';
                        let addName = riskInfo.mainInfo.programName + name;
                        let list = riskInfo.programList;
                        let hourAdd = list[list.map(item => item.programName).indexOf(addName)];
                        let hourParams = {
                            "count": 1,				
                            "programCode": hourAdd.code,	
                            "riskBeans": [					
                                {
                                    "riskCode": hourAdd.liabilityList[0].riskCode	
                                }
                            ]
                        }
                        params1[0].insuranceVOS.push(hourParams);
                        let cor = {
                            "factorCode": factorType24.code,	
                            "stringFactor": 0						
                        };
                        if(riskInfo.checked1) {
                            cor.stringFactor = offic.length
                        }
                        params1[0].factorInfos.push(cor);
                    }
                    if(window.sessionStorage.getItem('Gucode') == '19PR103408') {
                        let name = riskInfo.valueType1 == '1' ? '住院' : '误工';
                        let addName = riskInfo.mainInfo.programName + name;
                        let list = riskInfo.programList;
                        let hourAdd = list[list.map(item => item.programName).indexOf(addName)];
                        let hourParams = {
                            "count": 1,				
                            "programCode": hourAdd.code,	
                            "riskBeans": [					
                                {
                                    "riskCode": hourAdd.liabilityList[0].riskCode	
                                }
                            ]
                        }
                        params[0].insuranceVOS.push(hourParams);
                        let cor = {
                            "factorCode": factorType24.code,	
                            "stringFactor": 0						
                        };
                        if(riskInfo.checked2) {
                            cor.stringFactor = offic.length
                        }
                        params[0].factorInfos.push(cor);
                    }
                    if(factorType1) {
                        let cor0 = {
                            "factorCode": factorType1.code,	
                            "stringFactor": offic.length						
                        };
                         params[0].factorInfos.push(cor0);
                        let cor = {
                            "factorCode": factorType1.code,	
                            "stringFactor": normal.length						
                        };
                         params1[0].factorInfos.push(cor);
                    }
                    let res = await this.productService.premium(params);
                    let res1 = await this.productService.premium(params1);
                    if(res.code == '0000' && res1.code == '0000') {
                        this.money = (res.data.totalPremium + res1.data.totalPremium).toFixed(2);
                        this.calpremiums = res.data;
                        this.calpremiums1 = res1.data;
                        this.showMoney = true;
                        this.showMoney1 = true;
                        this.hideBorder = false;
                    }
                }
                this.offic = offic;
                this.normal = normal;
            }
        },
        getPolicyInfoNoVal() {
            return this.ruleForm;
        },
        showFreeDetail(data,name) {
            for(let i = 0 ; i < this[name].length; i ++) {
                this[name][i].mainMoney =  (data.singlePremiums[0].riskPremiums[0].riskPremiuml/this[name].length).toFixed(2)
                this[name][i].allMoney =  (data.singlePremiums[0].riskPremiums[0].riskPremiuml/this[name].length).toFixed(2)
                this[name][i].subMoney =  "0.00";
                this[name][i].risk =  data.singlePremiums[0].riskPremiums[0].riskName;
            }
            this.tableData = this[name];
            this.dialogVisible = true;
        }
    }
}
</script>
<style lang="less" scoped>
    #premium {
        .ml70 {
            margin-left: 70px;
            .col-black {
                color: #101010;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
            }
        }
        .f700 {
            font-weight: 700;
        }
        .pl160{
            padding-left: 160px;
        }
        .pl120 {
            padding-left: 120px;
        }
        .el-select {
            width: 301px;
        }
        .el-input {
            width: 350px;
        }

        .no-info {
            border: 1px dotted #cd9d51;
            width: 1090px;
            .no-info-style {
                text-align: center;
                margin: 40px auto;
            }
        }
        .ts-bg-column{
            height: 45px;
            line-height: 45px;
            text-align: center;
            color: #c9984a;
            font-size: 14px;
            background-color: #fefbf1;
            border: 1px solid  #f0dfbf;
        }
        .bgfff {
            .ts-bg-column{
                height: 45px;
                line-height: 45px;
                text-align: center;
                color: #c9984a;
                font-size: 14px;
                background-color: #fff;
                border: 1px solid  #f0dfbf;
            } 
        }
        .ts-bg-flex,
        .ts-bt-flex{
            display: flex;
            flex-direction: row;
        }
        .ts-bg-flex li,
        .ts-bt-flex li{
            width: 180px;
        }
        .freeDetail {
            cursor: pointer;
        }
    }
</style>