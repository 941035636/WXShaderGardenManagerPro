# manage-system #
后台管理系统
## 前言 

**基于 vue.js 的前端开发环境，用于前后端分离后的单页应用开发，可以在开发时使用 ES Next、scss 等最新语言特性。项目包含：**
<br> 基础库: vue.js、vue-router、vuex、axios
<br> 编译/打包工具：webpack、babel

## 目录结构描述 
```
├── README.md            项目介绍
├── index.html           入口页面
├── build              构建脚本目录
│  ├── build-server.js         运行本地构建服务器，可以访问构建后的页面
│  ├── build.js            生产环境构建脚本
│  ├── dev-client.js          开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
│  ├── dev-server.js          运行本地开发服务器
│  ├── utils.js            构建相关工具方法
│  ├── webpack.base.conf.js      wabpack基础配置
│  ├── webpack.dev.conf.js       wabpack开发环境配置
│  └── webpack.prod.conf.js      wabpack生产环境配置
├── config             项目配置
│  ├── dev.env.js           开发环境变量
│  ├── index.js            项目配置文件
│  ├── prod.env.js           生产环境变量
│  └── test.env.js           测试环境变量
├── mock              mock数据目录
│  └── hello.js
├── package.json          npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
├── src               源码目录  
│  ├── main.js             入口js文件
│  ├── app.vue             根组件
│  ├── components           公共组件目录
│  │  └── title.vue
│  ├── assets             资源目录，这里的资源会被wabpack构建
│  │  └── images
│  │    └── logo.png
│  ├── router             前端路由
│  │  └── index.js          唯一路由出口
│  |──store                    |- 状态机存放目录
│  |    |- modules                  |- 模块拆分
│  |    └── index.js                |- 状态机主要输出文件
│  |  
│  ├── view              页面目录
│  │ ├── hello.vue
│  │ └── notfound.vue
│  ├── api               接口管理
│  │ ├── apiUrl.js       接口名称管理
│  │ └── index.js        接口请求配置文件 
│  │
│  ├── global             全局管理
│  │ ├── global-font.js   前端路由地址公共变量
│  │ └── public-global.js 前端常量
│  │
│  ├── server            接口请求类 封装  （异步请求）
│  │
│  └── util               工具类
│
├── static             纯静态资源，不会被wabpack构建。
└── test              测试文件目录（unit&e2e）（待完善）
  └── unit              单元测试
    ├── index.js            入口脚本
    ├── karma.conf.js          karma配置文件
    └── specs              单测case目录
      └── Hello.spec.js
 
 ```
## 功能 
- [x] Element UI
- [x] 登录/注销
- [x] 表单
- [x] 图表 :bar_chart:
- [x] 图片上传
- [x] treeSelect:
- [x] 模糊查询功能

## git分支名称
**开发分支：**<br>
  feature/20190108lihaoservice<br>
**线上：**<br>
    开发：develop<br>
  测试：release<br>
 预生产、生产：master


## 安装步骤

	git clone git@172.16.7.168:XXXX    // 下载到本地
	cd 目录名称    // 进入模板目录
	npm（cnpm） install         // 安装项目依赖，等待安装完成之后

## 前端工程化命令配置
**本地开发**

	  // 开启服务器，浏览器访问 http://localhost:8080 
	  npm run dev
**线上：**<br>
  开发：<br>
    npm run start<br>
 测试：<br>
   npm run test<br>
  预生产：<br>
   npm run pre  <br>
  生产 ：<br>
   npm run online


## 项目开发操作
**一、如果我不想用到上面的某些组件呢，那我怎么在模板中删除掉不影响到其他功能呢？**

举个栗子，我不想用 vue-datasource 这个组件，那我需要分四步走。

第一步：删除该组件的路由，在目录 src/router/index.js 中，找到引入改组件的路由，删除下面这段代码。

```JavaScript
{
    path: '/vuetable',
    component: resolve => require(['../components/page/VueTable.vue'], resolve)     // vue-datasource组件
},
```

第二步：删除引入该组件的文件。在目录 src/components/page/ 删除 VueTable.vue 文件。

第三步：删除该页面的入口。在目录 src/components/common/Sidebar.vue 中，找到该入口，删除下面这段代码。
	
```HTML
<el-menu-item index="vuetable">Vue表格组件</el-menu-item>
```

第四步：卸载该组件。执行以下命令：
	
	npm un vue-datasource -S

完成。

**二、如何切换主题色呢？**
1.更改网站主题色
更改范围（element-ui主题色，侧边栏主题色）
第一步：更改element-ui主题配置文件 ‘./assets/styles/element-variables.scss’ 里 的 ‘$--color-primary’ 变量；
第二步：更改侧边栏主题配置文件‘../../assets/styles/public.less’里的 ‘@color-primary’变量同第一步中的‘$--color-primary’



登录：
账号：fkhjl001
密码：jiangtai@2018
