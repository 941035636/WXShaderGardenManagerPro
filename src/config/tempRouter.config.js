const routerInfo = [
  {
    id: 3243,
    code: 'FC1353584169028030464',
    name: '系统设置',
    functionType: 'M',
    isRootMenu: 'Y',
    parentCode: '',
    icon: 'cog',
    isShow: '1',
    sort: 3242,
    functionUrl: '/sys',
    componentUrl: 'Layout',
    isSelect: 'N',
    children: [
      {
        id: 3247,
        code: 'FC1353584169028456432',
        name: '角色管理',
        functionType: 'M',
        isRootMenu: 'N',
        parentCode: 'FC1353584169028030464',
        icon: null,
        isShow: '1',
        sort: 3247,
        functionUrl: 'roleManage',
        componentUrl: '@/views/sys/roleManage/list',
        isSelect: 'N',
        children: [
          {
            id: 3247,
            code: 'FC1353584169028456432',
            name: '角色详情',
            functionType: 'M',
            isRootMenu: 'N',
            parentCode: 'FC1353584169028030464',
            icon: null,
            isShow: '0',
            sort: 3247,
            functionUrl: 'RoleManageDetail',
            componentUrl: '@/views/sys/roleManage/detail/index.vue',
            isSelect: 'N',
          },
        ],
      },
      {
        id: 3248,
        code: 'FC1353584169532263282',
        name: '菜单管理',
        functionType: 'M',
        isRootMenu: 'N',
        parentCode: 'FC1353584169028030464',
        icon: null,
        isShow: '1',
        sort: 3248,
        functionUrl: 'menuManage',
        componentUrl: '@/views/sys/menuManage/list',
        isSelect: 'N',
      },
    ],
  },
  {
    id: 3242,
    code: 'FC1353584169028030434',
    name: '账号管理',
    functionType: 'M',
    isRootMenu: 'Y',
    parentCode: '',
    icon: 'user',
    isShow: '1',
    sort: 3243,
    functionUrl: '/account',
    componentUrl: 'Layout',
    isSelect: 'N',
    children: [
      {
        id: 3244,
        code: 'FC1353584384707530752',
        name: '用户账号',
        functionType: 'M',
        isRootMenu: 'N',
        parentCode: 'FC1353584169028030434',
        icon: null,
        isShow: '1',
        sort: 3244,
        functionUrl: 'user',
        componentUrl: '@/views/account/user/list',
        isSelect: 'N',
      },
      {
        id: 3246,
        code: 'FC1353584169028030456',
        name: '监管账号',
        functionType: 'M',
        isRootMenu: 'N',
        parentCode: 'FC1353584169028030434',
        icon: null,
        isShow: '1',
        sort: 3246,
        functionUrl: 'supervise',
        componentUrl: '@/views/account/supervise/list',
        isSelect: 'N',
      },
    ],
  },
  {
    id: 3245,
    code: 'FC1353584507520946176',
    name: '安责险业务',
    functionType: 'M',
    isRootMenu: 'Y',
    parentCode: '',
    icon: 'book',
    isShow: '1',
    sort: 3245,
    functionUrl: '/business',
    componentUrl: 'Layout',
    isSelect: 'N',
    children: [
      {
        id: 3249,
        code: 'FC1353584169532690183',
        name: '保单管理',
        functionType: 'M',
        isRootMenu: 'N',
        parentCode: 'FC1353584507520946176',
        icon: null,
        isShow: '1',
        sort: 3249,
        functionUrl: 'policy',
        componentUrl: '@/views/business/policy/list',
        isSelect: 'N',
        // children: [
        //   {
        //     id: 3250,
        //     code: 'FC1353584283719740198',
        //     name: '添加保单',
        //     functionType: 'M',
        //     isRootMenu: 'N',
        //     parentCode: 'FC1353584169532690183',
        //     icon: null,
        //     isShow: '0',
        //     sort: 3250,
        //     functionUrl: 'detail',
        //     componentUrl: '@/views/business/policy/detail',
        //     isSelect: 'N',
        //   },
        // ],
      },
    ],
  },
]
export default routerInfo
