const state = { //要设置的全局访问的state对象
    
}
const getters = { //实时监听state值的变化(最新状态)
    
}


const mutations = { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    
}


const actions = { //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
}

//getters 和 vue 中的 computed 类似 , 都是用来计算 state 然后生成新的数据 ( 状态 ) 的。


export default {
    state,
    actions,
    mutations,
    getters
};