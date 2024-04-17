<template>
  <el-dialog
    :title="inventoryId ? '修改岗位清单' : '添加岗位清单'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    @open="initData"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
    >
      <!-- <div style="margin: 0 0 20px 30px; border: 1px dashed #ccc"></div> -->
      <!-- @change="userTypeChange" -->
      <el-form-item label="部门名称：" prop="deptNo">
        <el-cascader
          ref="editCascader"
          v-model="ruleForm.depList"
          placeholder="请选择"
          class="w280"
          clearable
          filterable
          :options="departmentList"
          :props="{
            label: 'deptName',
            value: 'deptNo',
            children: 'children',
          }"
          @change="departmentChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="岗位名称：" prop="postNo">
        <el-select
          v-model="ruleForm.postNo"
          class="w280"
          placeholder="请选择岗位名称"
          @change="postChange"
        >
          <el-option
            v-for="item in position"
            :key="item.id"
            :label="item.postName"
            :value="item.postNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="清单名称：" prop="standardName">
        <el-input
          v-model="ruleForm.standardName"
          class="w280"
          placeholder="请输入清单名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="排查频次：" prop="frequency">
        <el-select
          v-model="ruleForm.frequency"
          class="w280"
          placeholder="请选择排查频次"
        >
          <el-option
            v-for="item in checkList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="register">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateCompellation } from '@/utils/validateFrom'
import { saveStandardList, dictTrue } from '@/api/listManage'
import {
  getByEntNo,
  getPostByDept, //根据部门获取岗位
} from '@/api/branchManage'
export default {
  name: 'AddOrAlter',
  props: {},
  data() {
    return {
      dialogVisible: false,
      inventoryId: '', //清单id
      departmentList: [], //部门集合
      position: [], //岗位集合
      checkList: [], //排查频次集合
      ruleForm: {
        depList: [], //部门一级 二级编码
        deptName: '', //部门名称 ,
        deptNo: '', // 部门编号 ,
        frequency: '', //排查频次 ,
        postName: '', // 岗位名称 ,
        postNo: '', // 岗位编号 ,
        standardName: '', //清单名称
      },
      // -----------------
      rules: {
        deptNo: [
          { required: true, message: '请选择部门名称', trigger: 'blur' },
        ],
        postNo: [
          { required: true, message: '请选择岗位名称', trigger: 'blur' },
        ],
        standardName: [
          { required: true, validator: validateCompellation, trigger: 'blur' },
        ],
        frequency: [
          { required: true, message: '请选择排查频次', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    postChange(val) {
      //选择机构
      this.ruleForm.postName = this.position.find(
        (item) => item.postNo == val
      ).postName

      console.log(this.ruleForm, 'this.ruleform--201')
    },
    // 弹框打开时执行
    async initData() {
      // 部门集合
      this.sysListFu()
      // 岗位集合
      this.departmentChange('init')
      // 清单集合
      this.getDictTrue()
    },
    async getDictTrue() {
      let res = await dictTrue('50003')
      if (res.code == '0000') {
        res.data.forEach((obj) => {
          obj.name = obj.itemText // 添加新属性名
          obj.code = obj.itemValue // 添加新属性名
          delete obj.itemText // 删除旧属性名
          delete obj.itemValue // 删除旧属性名
        })
        this.checkList = JSON.parse(JSON.stringify(res.data))
      }
    },

    // 获取部门信息
    async sysListFu() {
      let No = window.sessionStorage.getItem('enpNo')
      let res = await getByEntNo(No)
      if (res.code == '0000') {
        let arr = res.data
        // 去除一级未空的数据
        const filteredArr = arr.filter((obj) => obj.children.length > 0)
        // 最后一级children 为空时 替换为null
        function formatCascaderData(data) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].children.length < 1) {
              // children若为空数组，则将children设为undefined
              data[i].children = undefined
            } else {
              // children若不为空数组，则继续 递归调用 本方法
              formatCascaderData(data[i].children)
            }
          }
          return data
        }
        this.departmentList = formatCascaderData(filteredArr)
      }
    },

    //选择部门时执行
    async departmentChange(type = 'change') {
      if (this.ruleForm.depList.length > 1) {
        this.ruleForm.deptNo = this.ruleForm.depList[1]
        // 获取岗位信息
        let res = await getPostByDept(this.ruleForm.depList[1])
        if (res.code == '0000') {
          if (type != 'init') {
            this.ruleForm.postNo = ''
          }

          this.position = res.data
          if (res.data.length == 0) {
            this.$message({
              message: '此部门暂无岗位信息，请添加岗位',
              type: 'warning',
            })
          }
        }
      }
    },

    // 重置
    clear() {
      this.dialogVisible = false
      this.inventoryId = '' //清单id
      this.departmentList = [] //部门集合
      this.position = [] //岗位集合
      this.checkList = [] //排查频次集合
      this.ruleForm = {
        depList: [], //部门一级 二级编码
        deptName: '', //部门名称 ,
        deptNo: '', // 部门编号 ,
        frequency: '', //排查频次 ,
        postName: '', // 岗位名称 ,
        postNo: '', // 岗位编号 ,
        standardName: '', //清单名称
      }
    },
    close() {
      this.clear()
    },
    async configRegister() {
      let data = { ...this.ruleForm }
      if (this.inventoryId) {
        data.id = this.inventoryId
      }
      let res = await saveStandardList(data)
      if (res.code === '0000') {
        this.$baseMessage(
          this.ruleForm.inventoryId ? '修改成功' : '添加成功',
          'success'
        )
        this.$parent.initData()
        this.clear()
      }
    },
    register() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let text = '确定要新增岗位清单？'
          if (this.inventoryId) {
            text = '确定要修改岗位清单？'
          }
          this.$baseConfirm(
            text,
            '',
            () => {
              this.configRegister()
            },
            () => {
              // this.$baseMessage('已取消', 'info')
            }
          )
          return
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss"></style>
