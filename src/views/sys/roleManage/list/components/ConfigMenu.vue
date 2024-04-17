<template>
  <el-dialog
    title="配置菜单"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    @open="initData"
  >
    <div class="contents">
      <div>
        <span class="title">角色名称：</span>
        <span>{{ roleData.roleName }}</span>
      </div>
      <div>
        <span class="title">角色编码：</span>
        <span>{{ roleData.roleCode }}</span>
      </div>
      <div class="tree_one_div">
        <span class="title">菜单名称：</span>
        <div class="trees_sel">
          <el-tree
            ref="tree"
            :data="data"
            show-checkbox
            node-key="code"
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps"
          ></el-tree>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loadingbut" @click="menuConfirm">
        {{ loadingbuttext }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getTree, corrMenu } from '@/api/menuManagement'
  export default {
    name: 'ConfigMenu',
    props: {
      roleData: {
        type: Object,
        requires: true,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        dialogVisible: false,
        loadingbut: false, //审核提交加载中
        loadingbuttext: '确 定',
        data: [],
        defaultCheckedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      }
    },
    methods: {
      close() {
        this.data = []
        this.defaultCheckedKeys = []
      },
      async initData() {
        let res = await getTree(this.roleData.roleCode)
        if (res.code === '0000') {
          this.data = res.data.allResourceMenu
          if (res.data.relatedResourceMenu) {
            this.defaultCheckedKeys = res.data.relatedResourceMenu.map(
              (item) => {
                return item.functionCode
              }
            )
          }
          console.log(this.defaultCheckedKeys)
        }
      },
      async menuConfirm() {
        if (!this.roleData.roleCode) {
          return false
        }
        this.loadingbut = true
        this.loadingbuttext = '提交中...'
        let data = {
          functionCodes: this.$refs.tree.getCheckedKeys(),
          roleCode: this.roleData.roleCode,
        }
        let res = await corrMenu(data)
        if (res.code === '0000') {
          this.$baseMessage('关联菜单成功', 'success')
          this.loadingbut = false
          this.loadingbuttext = '确 定'
          this.dialogVisible = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .contents {
    width: 50%;
    margin: 0 auto;
    line-height: 40px;
    .title {
      display: inline-block;
      text-align: left;
      width: 80px;
    }
    .tree_one_div {
      display: flex;
    }
    .trees_sel {
      width: 50%;
      overflow-y: auto;
      height: 200px;
    }
  }
</style>
