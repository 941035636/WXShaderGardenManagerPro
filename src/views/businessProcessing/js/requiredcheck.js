import moment from 'moment';
import Vue from 'vue'; //引入vue
let vm = new Vue();//实例化 Vue
export default class getRequiredCheck {
    getResult (forms,form,flag,isQMFlag,schanelCode) {
        let data = {
            'lable': '',
            'value': true
        }
        let reg = /^(?=.*\d)[A-Za-z0-9\-\_]{1,30}$/;
        let correctNos = forms.name.find(item =>(item.value == '00'));
        let signTimes = forms.name.find(item =>(item.value == '01'));
        let startTimes = forms.name.find(item =>(item.value == '02'));
        let endTimes = forms.name.find(item =>(item.value == '03'));
        let policyHolders = forms.name.find(item =>(item.value == '04'));
        let threeInOneCode = forms.name.find(item =>(item.value == '05'));
        let premiums = forms.name.find(item =>(item.value == '06'));
        let premiumS = forms.name.find(item =>(item.value == '07'));
        let agent = forms.name.find(item =>(item.value == '08'));
        if(correctNos){
            forms.name.find(item =>(item.value == '00')).newCode = forms.list.find(item =>(item.value == '00')).newCode
            if(!correctNos.newCode){
                data.lable = '请输入冲正后的保单号！'
                data.value = false
                return data
            }
            if(correctNos.code == correctNos.newCode){
                if(form.orderType == 1){
                    data.lable = '冲正后的保单号不能与原保单一致！'
                    data.value = false
                    return data
                }else{
                    data.lable = '冲正后的批单号不能与原批单一致！'
                    data.value = false
                    return data
                }
            }
            if(!reg.test(correctNos.newCode)){
                data.lable = '保单号/批单号为1到30位字母、数字！'
                data.value = false
                return data
            }
        }
        if(signTimes){
            forms.name.find(item =>(item.value == '01')).newCode = forms.list.find(item =>(item.value == '01')).newCode
            if(!signTimes.newCode){
                data.lable = '请选择冲正后的签单日期！'
                data.value = false
                return data
            }
            if(moment(signTimes.code).format('YYYY-MM-DD') == signTimes.newCode){
                data.lable = '冲正后的签单日期不能与原保单一致！'
                data.value = false
                return data
            }
        }
        if(startTimes){
            forms.name.find(item =>(item.value == '02')).newCode = forms.list.find(item =>(item.value == '02')).newCode
            if(!startTimes.newCode){
                data.lable = '请选择冲正后的保险起期！'
                data.value = false
                return data
            }
            if(moment(startTimes.code).format('YYYY-MM-DD HH:mm:ss') == moment(startTimes.newCode).format('YYYY-MM-DD HH:mm:ss')){
                data.lable = '冲正后的保险起期不能与原保单一致！'
                data.value = false
                return data
            }
            if(endTimes){
                let endTime1 = new Date(endTimes.newCode).getTime();
                let endTime2 = new Date(vm.$stringHelper.isGetEndDate1(startTimes.newCode)).getTime();
                if(endTime1 > endTime2){
                    data.lable = '冲正后的保险期间不能超过一年！'
                    data.value = false
                    return data
                }
            }else{
                let endTime1 = new Date(form.endTime).getTime();
                let endTime2 = new Date(vm.$stringHelper.isGetEndDate1(startTimes.newCode)).getTime();
                if(endTime1 > endTime2){
                    data.lable = '冲正后的保险期间不能超过一年！'
                    data.value = false
                    return data
                }
            }
        }
        if(endTimes){
            forms.name.find(item =>(item.value == '03')).newCode = forms.list.find(item =>(item.value == '03')).newCode
            if(!endTimes.newCode){
                data.lable = '请选择冲正后的保险止期！'
                data.value = false
                return data
            }
            if(moment(endTimes.code).format('YYYY-MM-DD HH:mm:ss') == moment(endTimes.newCode).format('YYYY-MM-DD HH:mm:ss')){
                data.lable = '冲正后的保险止期不能与原保单一致！'
                data.value = false
                return data
            }
            if(!startTimes){
                let endTime1 = new Date(endTimes.newCode).getTime();
                let endTime2 = new Date(vm.$stringHelper.isGetEndDate1(form.startTime)).getTime();
                if(endTime1 > endTime2){
                    data.lable = '冲正后的保险期间不能超过一年！'
                    data.value = false
                    return data
                }
            }
        }
        if(policyHolders){
            forms.name.find(item =>(item.value == '04')).newCode = forms.list.find(item =>(item.value == '04')).newCode
            if(!policyHolders.newCode){
                data.lable = '请输入冲正后的投保人名称！'
                data.value = false
                return data
            }
            if(policyHolders.code == policyHolders.newCode){
                data.lable = '冲正后的投保人名称不能与原保单一致！'
                data.value = false
                return data
            }
            if(policyHolders.newCode.length > 75 || policyHolders.newCode.length < 2){
                data.lable = '投保人名称(2-75位)！'
                data.value = false
                return data
            }
        }
        if(threeInOneCode){
            forms.name.find(item =>(item.value == '05')).newCode = forms.list.find(item =>(item.value == '05')).newCode
            if(!threeInOneCode.newCode){
                data.lable = '请输入冲正后的统一信用代码！'
                data.value = false
                return data
            }
            if(threeInOneCode.code == threeInOneCode.newCode){
                data.lable = '冲正后的统一信用代码不能与原保单一致！'
                data.value = false
                return data
            }
            if(!reg.test(threeInOneCode.newCode)){
                data.lable = '统一信用代码为1到30位字母、数字！'
                data.value = false
                return data
            }
        }
        if(premiums){
            forms.name.find(item =>(item.value == '06')).newCode = forms.list.find(item =>(item.value == '06')).newCode
            forms.name.find(item =>(item.value == '06')).reason = forms.list.find(item =>(item.value == '06')).reason
            let premium = (premiums.newCode*100)/100
            if(flag) {
                if(premium < 0){
                    data.lable = '冲正后的保费金额必须大于等于0！'
                    data.value = false
                    return data
                }
            }else{
                premium =  Math.abs(premium)
            }

            if(!premium){
                data.lable = '请输入冲正后的保费金额！'
                data.value = false
                return data
            }
            if(premiums.code == premium){
                data.lable = '冲正后的保费金额不能与原保单一致！'
                data.value = false
                return data
            }
            let Reg = /^\d+(\.\d{0,2})?$/;
            if(!Reg.test(premium)){
                data.lable = '冲正后的保费金额最多保留两位小数！'
                data.value = false
                return data
			}
            if(!premiums.reason) {
                data.lable = '请选择保费冲正原因！'
                data.value = false
                return data
            }
            
        }
        if(premiumS){
            if(!premiumS.reason) {
                data.lable = '请选择保单/批单冲正原因！'
                data.value = false
                return data
            }
            
        }
        if(agent) {
            forms.name.find(item =>(item.value == '08')).newCode = forms.list.find(item =>(item.value == '08')).newCode
            if(isQMFlag && !agent.newCode) {
                data.lable = '请选择冲正后的全面营销信息！'
                data.value = false
                return data
            }
            if(agent.code == '无' && !agent.newCode && schanelCode != '05'){
                data.lable = '请选择冲正后的全面营销信息！'
                data.value = false
                return data
            } else if(agent.newCode && agent.code.indexOf(agent.newCode) != -1) {
                data.lable = '冲正后的全面营销信息不能与原保单一致！'
                data.value = false
                return data
            }
        }
        return data
    }
}
  