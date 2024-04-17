<template>
  <el-dialog
    :title="ruleForm['id'] ? '修改菜单' : '新增菜单'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="1000"
    @close="close"
  >
    <div class="div-center" style="margin: 0 auto">
      <el-form ref="form" :model="ruleForm" :rules="rules" label-width="120px">
        <el-form-item label="上级菜单名称：" prop="region">
          <span>{{ dataMenu.parentName }}</span>
        </el-form-item>
        <el-form-item label="菜单类型：" prop="functionType">
          <el-select
            v-model="ruleForm.functionType"
            class="w300"
            placeholder="请选择菜单类型"
          >
            <el-option label="菜单" value="M"></el-option>
            <el-option label="按钮" value="A"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称：" prop="functionName">
          <el-input v-model="ruleForm.functionName" class="w300"></el-input>
        </el-form-item>
        <div v-if="ruleForm.functionType == 'A'">
          <el-row
            class="rowLine"
            v-for="(item, index) in ruleForm.urlConfLists"
            :key="index"
          >
            <el-col :span="8">
              <el-form-item
                label-width="120px"
                :label="'url' + (index + 1 > 9 ? index + 1 : '0' + (index + 1))"
              >
                <el-select v-model="item.requestType" class="w120">
                  <el-option label="POST" value="post"></el-option>
                  <el-option label="GET" value="get"></el-option>
                  <el-option label="PUT" value="put"></el-option>
                  <el-option label="DELETE" value="delete"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label-width="0">
                <el-input
                  class="w220"
                  placeholder="请输入url"
                  v-model="item.url"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label-width="0">
                <span v-if="index == 0" class="add-person" @click="addPerson">
                  <i class="el-icon-circle-plus mr10 f18"></i>
                  添加多个
                </span>
                <span v-else class="del-person" @click="delPerson(index)">
                  <i class="el-icon-remove mr10 f18"></i>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item
          label="菜单地址："
          class="postType"
          style="display: flex"
          prop="functionUrl"
        >
          <el-input v-model="ruleForm.functionUrl" class="w300"></el-input>
          <el-tooltip
            class="item"
            effect="dark"
            content="菜单类型为菜单时具体值为URL，菜单类型为按钮时具体值为父元素的路由加按钮类型，开发提供。"
            placement="top"
          >
            <el-icon style="margin-left: 10px" icon-name="question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="图标：">
          <el-input v-model="ruleForm.icon" class="w300"></el-input>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              请前往
              <a target="_blank" href="https://fontawesome.dashgame.com/">
                fontawesome
              </a>
              选择对应的icon
            </div>
            <el-icon style="margin-left: 10px" icon-name="question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="组件名称：" prop="componentName">
          <el-input v-model="ruleForm.componentName" class="w300"></el-input>
          <el-tooltip
            class="item"
            effect="dark"
            content="此字段是组件中name的名称，开发提供。"
            placement="top"
          >
            <el-icon style="margin-left: 10px" icon-name="question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="组件地址：" prop="componentUrl">
          <el-input v-model="ruleForm.componentUrl" class="w300"></el-input>
          <el-tooltip
            class="item"
            effect="dark"
            content="一级目录需设置固定Layout，此字段是项目中组件所在目录层级可用@，开发提供。"
            placement="top"
          >
            <el-icon style="margin-left: 10px" icon-name="question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-radio-group v-model="ruleForm.isShow">
            <el-radio label="0">不显示</el-radio>
            <el-radio label="1">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="0">失效</el-radio>
            <el-radio label="1">有效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addMenu">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { doSave } from '@/api/menuManagement'
export default {
  name: 'AddOrAlter',
  props: {
    dataMenu: {
      type: Object,
      requires: true,
      default: () => {
        return null
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      inputVisible: false,
      inputValue: '',
      ruleForm: {
        componentName: '', //  组件名称
        componentUrl: '', // 组件地址
        functionCode: '', // 菜单code
        functionName: '', // 菜单名称
        urlConfLists: [{ requestType: '', url: '' }],
        functionType: '', // 菜单类型  M 菜单 A 按钮
        functionUrl: '', // 菜单跳转
        icon: '', // 图标 用font Awesome图标
        id: '', // id
        isRootMenu: 'Y', // 是否一级菜单 y是 n否
        isShow: '1', // 是否展示 0不展示 1展示
        parentCode: '', // 父级code 一级菜单不传
        status: '1', // 状态
      },
      rules: {
        componentName: [
          { required: true, message: '请输入组件名称', trigger: 'blur' },
        ], //  组件名称
        componentUrl: [
          { required: true, message: '请输入组件地址', trigger: 'blur' },
        ], // 组件地址
        functionName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ], // 菜单名称
        functionType: [
          { required: true, message: '请选择菜单类型', trigger: 'change' },
        ], // 菜单类型  M 菜单 A 按钮
        functionUrl: [
          { required: true, message: '请输入菜单跳转地址', trigger: 'blur' },
        ], // 菜单跳转
        isShow: [
          { required: true, message: '请选择是否展示', trigger: 'change' },
        ], // 是否展示 0不展示 1展示
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
    }
  },
  watch: {
    dataMenu: {
      handler(curVal, oldVal) {
        if (curVal.id) {
          this.ruleForm.componentName = curVal.componentName
          this.ruleForm.componentUrl = curVal.componentUrl
          this.ruleForm.functionCode = curVal.code
          this.ruleForm.functionName = curVal.name
          this.ruleForm.functionType = curVal.functionType
          this.ruleForm.functionUrl = curVal.functionUrl
          this.ruleForm.urlConfLists = curVal.urlConfLists.length
            ? curVal.urlConfLists
            : [{ requestType: '', url: '' }]
          this.ruleForm.icon = curVal.icon
          this.ruleForm.id = curVal.id
          this.ruleForm.isShow = curVal.isShow
          this.ruleForm.status = curVal.status
        }
      },
      deep: true,
    },
  },
  mounted() {
    console.log(this.dataMenu)
  },
  methods: {
    addPerson() {
      let obj = {
        requestType: '',
        url: '',
      }
      this.ruleForm.urlConfLists.push(obj)
    },
    delPerson(index) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.ruleForm.urlConfLists.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async menuPomise() {
      console.log(this.dataMenu)

      if (this.dataMenu.parentCode === '0' || !this.dataMenu.parentCode) {
        this.ruleForm.isRootMenu = 'Y'
      } else {
        this.ruleForm.isRootMenu = 'N'
        this.ruleForm.parentCode = this.dataMenu.parentCode
      }
      let res = await doSave(this.ruleForm)
      if (res.code === '0000') {
        this.$baseMessage(this.ruleForm.id ? '修改成功' : '添加成功', 'success')
        this.$parent.initData()
        this.dialogVisible = false
      }
    },
    // 提交菜单
    addMenu() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let text = '确定要新增菜单？'
          if (this.ruleForm.id) {
            text = '确认要修改菜单？'
          }
          this.$baseConfirm(
            text,
            '',
            () => {
              this.menuPomise()
            },
            () => {
              // this.$baseMessage('已取消', 'info')
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
      console.log(this.ruleForm)
    },
    close() {
      // this.dataMenu = null
      this.ruleForm = {
        componentName: '', //  组件名称
        componentUrl: '', // 组件地址
        functionCode: '', // 菜单code
        functionName: '', // 菜单名称
        urlConfLists: [{ requestType: '', url: '' }],
        functionType: '', // 菜单类型  M 菜单 A 按钮
        functionUrl: '', // 菜单跳转
        icon: '', // 图标 用font Awesome图标
        id: '', // id
        requestType: 'all',
        isRootMenu: 'Y', // 是否一级菜单 y是 n否
        isShow: '1', // 是否展示 0不展示 1展示
        parentCode: '', // 父级code 一级菜单不传
        status: '1', // 状态
      }
      this.$refs['form'].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.w300 {
  width: 300px;
}
</style>
<style>
.div-center {
  display: flex;
  justify-content: center;
}
.postType .el-form-item__content {
  margin: 0 !important;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.rowLine {
  width: 600px;
  margin: 0 auto !important;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

