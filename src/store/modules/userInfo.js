
const state={//要设置的全局访问的state对象
    //要设置的初始属性值
    userInfo:{}
}
const getters={//实时监听state值的变化(最新状态)
    renderUserInfo:state=>{//承载变化的showFooter的值
        // if( state.userInfo && state.userInfo.userId){
            return state.userInfo;
        // }  
    }
}


const mutations={//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    storeuserInfo(state,data){//如何变化userInfo,传入data数据
       state.userInfo=  data;   
    },
    //修改state中任意一个对象
    set(state, params) {
        Object.keys(params).forEach(key => {
            // 需要替换的值
            const val = params[key];
            const arr = key.split(".");
            if (arr.length > 1) {
                let obj = state;
                while ((arr.length - 1) && (obj = obj[arr.shift()]));
                obj[arr[0]] = val
            } else {
                state[key] = val
            }
        })
    }

}


const actions={//自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
    invokeUserdata(context,userData){//触发mutations里面的storeuserInfo,传入数据形参userData 对应到data
        context.commit('storeuserInfo',userData);
    },
    invokSet(context,val){
        context.commit('set',val);
        
    }

}

//getters 和 vue 中的 computed 类似 , 都是用来计算 state 然后生成新的数据 ( 状态 ) 的。


export default{
    namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
    state,
    actions,
    mutations,
    getters
};
