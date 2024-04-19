export default[
   {
       path: '/workbench',
       component: resolve => require(['../views/workBench/workBench.vue'], resolve),
       meta:{
           title:'工作台'
       }
   },
]