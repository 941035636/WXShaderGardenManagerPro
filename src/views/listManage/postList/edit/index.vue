<template>
  <el-dialog
    :title="id ? '修改清单记录' : '添加清单记录'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    @open="initData"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-form-item label="检查类别" label-width="200px" prop="checkType">
        <el-input
          v-model.trim="ruleForm.checkType"
          placeholder="请输入检查类别"
          type="text"
          class="w280"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="检查项目"
        label-width="200px"
        prop="checkProjectTypeOne"
      >
        <el-input
          placeholder="请输入检查项目"
          v-model.trim="ruleForm.checkProjectTypeOne"
          type="text"
          class="w280"
        ></el-input>
      </el-form-item>

      <el-form-item label="检查标准" label-width="200px" prop="checkStandard">
        <el-input
          v-model.trim="ruleForm.checkStandard"
          type="textarea"
          class="w280"
        ></el-input>
      </el-form-item>

      <el-form-item label="隐患级别" label-width="200px" prop="hazardLevel">
        <el-select
          v-model="ruleForm.hazardLevel"
          class="w280"
          placeholder="请选择"
        >
          <el-option
            v-for="item in hazardLevelList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="隐患类型"
            label-width="200px"
            prop="hazardTypeOne"
          >
            <el-select
              v-model="ruleForm.hazardTypeOne"
              class="w200"
              placeholder="请选择隐患类型一级"
              @change="userTypeChange"
            >
              <el-option
                v-for="item in hazardTypeOneList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label=""
            lable-width="0px"
            inline="false"
            prop="hazardTypeTwo"
          >
            <el-select
              v-model="ruleForm.hazardTypeTwo"
              class="w200"
              placeholder="请选择隐患类型二级"
            >
              <el-option
                v-for="item in hazardTypeTwoList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveStandardInfo, dictTrue } from '@/api/listManage'
import {
  validateCheckType,
  validateCheckProjectTypeOne,
  validateCheckStandard,
} from '@/utils/validateFrom'
import { init } from 'echarts/core'
export default {
  name: 'AddOrAlter',
  props: {},
  data() {
    return {
      dialogVisible: false,
      id: '', //当前清单id
      standardId: '', //岗位清单id
      ruleForm: {
        checkType: '', // 检查类别 ,
        checkProjectTypeOne: '', // 检查项目名称 ,
        checkStandard: '', // 检查标准 ,
        hazardLevel: '', // 隐患级别 ,
        hazardTypeOne: '', // 隐患类型1 ,
        hazardTypeTwo: '', // 隐患类型2 ,
      },
      // 隐患级别
      hazardLevelList: [],
      // 隐患类型
      hazardTypeOneList: [],
      hazardTypeTwoList: [],
      rules: {
        checkType: [
          { required: true, validator: validateCheckType, trigger: 'blur' },
        ],
        checkProjectTypeOne: [
          {
            required: true,
            validator: validateCheckProjectTypeOne,
            trigger: 'blur',
          },
        ],
        checkStandard: [
          { required: true, validator: validateCheckStandard, trigger: 'blur' },
        ],
        hazardLevel: [
          { required: true, message: '请选择隐患级别', trigger: 'blur' },
        ],

        hazardTypeOne: [
          { required: true, message: '请选择隐患类型一级', trigger: 'blur' },
        ],

        hazardTypeTwo: [
          { required: true, message: '请选择隐患类型二级', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    async initData() {
      await this.getDictTrue()

      // 回显
      if (this.ruleForm.hazardTypeOne) {
        await this.userTypeChange('init')
      }
    },

    async getDictTrue() {
      let res = await dictTrue('50001')
      if (res.code == '0000') {
        res.data.forEach((obj) => {
          obj.name = obj.itemText // 添加新属性名
          obj.code = obj.itemValue // 添加新属性名
          delete obj.itemText // 删除旧属性名
          delete obj.itemValue // 删除旧属性名
        })
        this.hazardLevelList = JSON.parse(JSON.stringify(res.data))
      }
      let res1 = await dictTrue('50002')
      if (res1.code == '0000') {
        this.hazardTypeOneList = replaceProperties(res1.data)
      }

      // 隐患级别 数据处理
      function replaceProperties(data) {
        console.log(data)
        function dfs(node) {
          if (node.itemText) {
            node.name = node.itemText
            delete node.itemText
          }
          if (node.itemValue) {
            node.code = node.itemValue
            delete node.itemValue
          }
          if (node.sysDictItemEntitys) {
            node.children = node.sysDictItemEntitys
            delete node.sysDictItemEntitys
          }
          if (node.children) {
            for (let child of node.children) {
              dfs(child)
            }
          }
        }
        for (let item of data) {
          dfs(item)
        }
        return data
      }
    },

    // 查询隐患二级数据
    userTypeChange(type = 'change') {
      if (type != 'init') {
        this.ruleForm.hazardTypeTwo = ''
      }
      this.hazardTypeTwoList = this.hazardTypeOneList.find(
        (item) => item.code == this.ruleForm.hazardTypeOne
      ).children
    },
    register() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.configRegister()
          return
        } else {
          return false
        }
      })
    },
    async configRegister() {
      let data = { ...this.ruleForm }
      if (this.id) {
        data.id = this.id
      }
      if (this.standardId) {
        data.standardId = this.standardId
      }
      let res = await saveStandardInfo(data)
      if (res.code === '0000') {
        this.$baseMessage(this.id ? '修改成功' : '添加成功', 'success')
        this.$parent.initData()
        this.clear()
      }
    },

    clear() {
      this.dialogVisible = false
      this.id = '' //当前清单id
      this.standardId = '' //岗位清单id
      this.ruleForm = {
        checkType: '', // 检查类别 ,
        checkProjectTypeOne: '', // 检查项目名称 ,
        checkStandard: '', // 检查标准 ,
        hazardLevel: '', // 隐患级别 ,
        hazardTypeOne: '', // 隐患类型1 ,
        hazardTypeTwo: '', // 隐患类型2 ,
      }
      // 隐患级别
      this.hazardLevelList = []
      // 隐患类型
      this.hazardTypeOneList = []
      this.hazardTypeTwoList = []
    },
    close() {
      this.clear()
    },
  },
}
</script>

<style lang="scss"></style>
