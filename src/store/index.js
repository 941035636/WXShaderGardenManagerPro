/*jshint esversion: 6 */
import vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist'//Vuex 持久化存储 (必需)
import caseInfo from './modules/caseInfo' //用户信息
import userInfo from './modules/userInfo' //用户信息
import policyentry  from './modules/policyentry';
import enums  from './modules/enums';
import caseInfoNew  from './modules/caseInfoNew';
vue.use(Vuex);

const vuexLocal = new VuexPersistence({
	storage: window.sessionStorage
})
const store = new Vuex.Store({
	modules: {
		caseInfo,userInfo,policyentry,enums,caseInfoNew
	},
	plugins: [vuexLocal.plugin]
});

export default store;
