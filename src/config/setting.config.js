/**
 * @description 导出默认通用配置
 */
const setting = {
  // 开发以及部署时的URL
  publicPath: '',
  // 生产环境构建文件的目录名
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  // 进行编译的依赖
  transpileDependencies: [],
  // 默认的接口地址 如果是开发环境和生产环境走mock-server，当然你也可以选择自己配置成需要的接口地址

  // baseURL: process.env.NODE_ENV === 'development' ? '' : '', //根据环境访问不同的域名
  baseURL: 'localhost:1001',//当前访问的是本地域名

  //标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: '共享田园管理端',
  //简写
  abbreviation: 'am',
  //开发环境端口号
  devPort: '80',
  //版本号
  version: process.env.VUE_APP_VERSION,
  copyright: 'am',
  //是否显示页面底部自定义版权信息
  footerCopyright: false,
  //是否显示顶部进度条
  progressBar: true,
  //缓存路由的最大数量
  keepAliveMaxNum: 99,
  // 路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  //不经过token校验的路由
  routesWhiteList: ['/login', '/register', '/404', '/401'],
  //加载时显示文字
  loadingText: '正在加载中...',
  //token名称accessToken
  tokenName: 'token',
  // 传入请求中header中tokenname
  headerToken: 'authorization',
  //token在localStorage、sessionStorage存储的key的名称
  tokenTableName: 'yingji-admin-' + new Date().getFullYear(),
  //token存储位置localStorage sessionStorage
  storage: 'localStorage',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: false,
  //是否显示logo，不显示时设置false，显示时请填写remixIcon图标名称，暂时只支持设置remixIcon
  logo: false, //'vuejs-fill',
  //是否显示在页面高亮错误
  errorLog: ['development', 'production'],
  //是否开启登录拦截
  loginInterception: true,
  //是否开启登录RSA加密
  loginRSA: true,
  // 是否开启密码加密
  passwordMD5: true,
  // 是否开启请求省市区接口
  areasInterception: true,
  // 是否开启请求枚举类接口
  enumsInterception: true,
  // 查询多个类型区域信息 0 不带全部， 1 带全部 2 map类型
  areas: [0, 1, 2],
  //intelligence和all两种方式，前者后端权限只控制permissions不控制view文件的import（前后端配合，减轻后端工作量），all方式完全交给后端前端只负责加载
  authentication: 'all',
  //vertical布局时是否只保持一个子菜单的展开
  uniqueOpened: true,
  //vertical布局时默认展开的菜单path，使用逗号隔开建议只展开一个
  defaultOopeneds: [],
  //需要加loading层的请求，防止重复提交
  debounce: ['doEdit', 'accidentServiceCorp', 'aseByArea'],
  //需要自动注入并加载的模块
  providePlugin: {},
  //npm run build时是否自动生成7z压缩包
  build7z: false,
  //代码生成机生成在view下的文件夹名称
  templateFolder: 'project',
  //是否显示终端donation打印
  donation: true,
}
module.exports = setting