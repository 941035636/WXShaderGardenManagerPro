<template>
  <div id="addCheck">
    <el-dialog
      :title="titleName"
      :visible.sync="dialogVisible"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="260px"
      >
        <el-form-item label="检查类型" prop="checkType">
          <el-select
            class="w217"
            v-model="form.checkType"
            placeholder="请选择检查类型"
          >
            <el-option
              v-for="(item, index) in checkTypeList"
              :key="index"
              :label="item.label"
              :value="item.strCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称" prop="orgName">
          <el-input
            class="w217"
            v-model="form.orgName"
            placeholder="请输入企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业社会信用代码" prop="blCode">
          <el-input
            class="w217"
            v-model="form.blCode"
            placeholder="请输入社会信用代码"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="企业经营地址" prop="areaList">
              <el-cascader
                :options="areaOptions"
                v-model="form.areaList"
                filterable
                placeholder="请选择企业地址"
                class="w217"
                clearable
                @change="changeArea"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="detailAddress" label-width="160px">
              <el-input
                v-model="form.detailAddress"
                class="w217"
                placeholder="请输入详细地址"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="行业类型" prop="industryList">
          <el-cascader
            v-model="form.industryList"
            :options="industryData"
            :props="{
              label: 'itemText',
              value: 'itemValue',
              children: 'sysDictItemEntitys',
            }"
            clearable
            @change="changeIns"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="检查时间" prop="checkTime">
          <el-date-picker
            v-model="form.checkTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="检查项" prop="checkNum">
          <el-input-number
            v-model="form.checkNum"
            class="w217"
            :min="0"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="隐患数" prop="dangerNum">
          <el-input-number
            v-model="form.dangerNum"
            class="w217"
            :min="0"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="整改数" prop="rectifyNum">
          <el-input-number
            v-model="form.rectifyNum"
            class="w217"
            :min="0"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="企业是否被惩罚" v-if="form.checkType == '03'">
          <el-switch v-model="form.isPunish"></el-switch>
        </el-form-item>
        <el-form-item
          label="处罚金额"
          prop="punishAmount"
          v-if="form.checkType == '03' && form.isPunish"
        >
          <el-input-number
            v-model="form.punishAmount"
            class="w217"
            :min="0"
            label="描述文字"
          ></el-input-number>
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item class="submit-box" style="margin-left: 50px">
          <el-button @click="backClose">返回</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { subMit, editCheck } from '@/api/threeCheck'
import {
  validateMoney,
  validateMoneys,
  validateNumber,
} from '@/utils/validateFrom'
import { isPositiveNum, isNumber } from '@/utils/validate'
export default {
  name: 'addCheck',
  props: {
    titleName: {},
    checkTypeList: {},
    industryData: {},
    areaOptions: {},
  },
  data() {
    // 隐患数验证
    var validDangerNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入内容!'))
      } else if (!isNumber(value)) {
        callback(new Error('请输入1-8位数值!'))
      } else if (value > this.form.checkNum) {
        callback(new Error('隐患数不能大于检查项!'))
      } else {
        callback()
      }
    }
    //整改数验证
    var validRectifyNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入内容!'))
      } else if (!isNumber(value)) {
        callback(new Error('请输入1-8位正数值!'))
      } else if (value > this.form.dangerNum) {
        callback(new Error('整改数不能大于隐患数!'))
      } else {
        callback()
      }
    }
    //隐患数数验证
    var validcheckNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入内容!'))
      } else if (!isPositiveNum(value)) {
        callback(new Error('请输入1-8位正数值!'))
      } else {
        callback()
      }
    }
    return {
      money: 0.0,
      dialogVisible: false,
      form: {
        areaList: [], // 地区集合
        industryList: [], // 行业集合
        orgName: '', //  企业名称
        blCode: '', //社会信用代码
        checkTime: '', // 检查日期
        checkType: '', //检查类型
        provinceCode: '', // 省编码
        provinceName: '', // 省名称
        cityCode: '', //市编码
        cityName: '', // 市名称
        countyCode: '', //区编码
        countyName: '', //  区名称
        detailAddress: '', // 具体地址
        industryCode: '', // 一级行业分类编码
        industryName: '', //一级行业分类名称
        industrySecondCode: '', // 二级行业分类编码
        industrySecondName: '', //  二级行业分类名称
        checkNum: '', //检查项
        dangerNum: 0, // 隐患项
        rectifyNum: 0, // 整改项
        isPunish: false, // 是否处罚-1处罚—0未处罚
        punishAmount: 0, //  处罚金额
      },
      rules: {
        checkType: [
          { required: true, message: '请选择检查类型', trigger: 'blur' },
        ],
        orgName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur',
          },
        ],
        blCode: [
          { required: true, message: '请输入社会信用代码', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur',
          },
        ],
        areaList: [
          { required: true, message: '请选择省市县', trigger: 'change' },
        ],
        industryList: [
          { required: true, message: '请选择行业类型', trigger: 'change' },
        ],
        checkTime: [
          { required: true, message: '请选择检查日期', trigger: 'blur' },
        ],
        checkNum: [
          { required: true, validator: validcheckNum, trigger: 'blur' },
        ],
        dangerNum: [
          { required: true, validator: validDangerNum, trigger: 'blur' },
        ],
        rectifyNum: [
          { required: true, validator: validRectifyNum, trigger: 'blur' },
        ],
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur',
          },
        ],
        // isPunish: [
        //   { required: true, message: '请选择是否被处罚', trigger: 'blur' },
        // ],
        punishAmount: [
          { required: true, validator: validateMoneys, trigger: 'blur' },
        ],
      },
    }
  },

  watch: {
    dialogVisible: {
      handler(curVal, oldVal) {
        if (!curVal) {
          this.$refs.form.clearValidate()
          this.reset()
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters({
      areaMap: 'areas/areaMap',
    }),
  },
  created() {},
  methods: {
    async subForm() {
      console.log(this.form)
      if (this.form.id) {
        let res = await editCheck(this.form)
        if (res.code == '0000') {
          this.$parent.getList()
          this.cancel()
        }
      } else {
        let res = await subMit(this.form)
        console.log(res)
        if (res.code == '0000') {
          this.$parent.getList()
          this.cancel()
        }
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.subForm()
        }
      })
    },
    async changeArea(e) {
      console.log(e)
      //选择地区下拉框
      if (e) {
        this.form.provinceCode = e[0]
        this.form.cityCode = e[1]
        this.form.countyCode = e[2]
      } else {
        return
      }
      console.log(this.areaMap)
      this.form.provinceName = this.areaMap[this.form.provinceCode] || '' // 省编码转中文
      this.form.cityName = this.areaMap[this.form.cityCode] || '' // 市编码转中文
      this.form.countyName = this.areaMap[this.form.countyCode] || '' // 区编码转中文
      console.log(this.form)
    },
    changeIns() {
      if (this.form.industryList) {
        // 一级行业转换
        this.form.industryCode = this.form.industryList[0]
        this.form.industryName = this.industryData.find(
          (item) => item.itemValue == this.form.industryList[0]
        ).itemText
        // 二级行业转换
        if (this.form.industryList[1]) {
          this.form.industrySecondCode = this.form.industryList[1]
          this.form.industrySecondName = this.industryData
            .find((item) => item.itemValue == this.form.industryList[0])
            .sysDictItemEntitys.find(
              (item) => item.itemValue == this.form.industryList[1]
            ).itemText
        } else {
          this.form.industrySecondCode = ''
          this.form.industrySecondName = ''
        }
      }
    },
    cancel() {
      this.$refs.form.clearValidate()
      this.dialogVisible = false
      this.reset()
    },
    reset() {
      this.form = {
        areaList: [], // 地区集合
        industryList: [], // 行业集合
        orgName: '', //  企业名称
        blCode: '', //社会信用代码
        checkTime: '', // 检查日期
        checkType: '', //检查类型
        provinceCode: '', // 省编码
        provinceName: '', // 省名称
        cityCode: '', //市编码
        cityName: '', // 市名称
        countyCode: '', //区编码
        countyName: '', //  区名称
        detailAddress: '', // 具体地址
        industryCode: '', // 一级行业分类编码
        industryName: '', //一级行业分类名称
        industrySecondCode: '', // 二级行业分类编码
        industrySecondName: '', //  二级行业分类名称
        checkNum: '', //检查项
        dangerNum: 0, // 隐患项
        rectifyNum: 0, // 整改项
        isPunish: false, // 是否处罚-1处罚—0未处罚
        punishAmount: 0, //  处罚金额
      }
    },
    backClose() {
      this.cancel()
    },
  },
}
</script>

<style>
</style>