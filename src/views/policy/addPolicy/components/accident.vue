<template>
  <div id="accident">
    <el-form
      ref="ruleForm"
      label-position="right"
      label-width="120px"
      :inline="true"
      :model="FormData"
      :rules="rules"
    >
      <el-form-item label="服务费比例" prop="accidentRate">
        <el-input
          v-model="FormData.accidentRate"
          size="small"
          placeholder="请输入比例"
          class="w280"
          clearable
        >
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="服务频次" prop="frequency">
        <el-input
          v-model="FormData.frequency"
          size="small"
          placeholder="请输入服务频次"
          class="w280"
          clearable
        >
          <template slot="append">次</template>
        </el-input>
      </el-form-item>
      <br />
      <el-form-item label="主要服务项目" prop="serviceAccidentType">
        <el-select
          v-model="FormData.serviceAccidentType"
          class="w450"
          multiple
          placeholder="请选择主要服务项目"
          @change="changeService"
          @remove-tag="removeTag"
        >
          <el-option
            v-for="item in getStrEnumAll.ServiceItemsEnum"
            :key="item.strCode"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { validateNumPercent, validatePositiveNum } from '@/utils/validateFrom'
import { mapGetters } from 'vuex'
export default {
  name: 'accident',
  components: {},
  props: {},
  data() {
    return {
      rules: {
        accidentRate: [
          {
            required: true,
            validator: validateNumPercent,
            trigger: 'blur',
          },
        ],
        frequency: [
          {
            required: true,
            validator: validatePositiveNum,
            trigger: 'blur',
          },
        ],
        serviceAccidentType: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
      },

      FormData: {
        accidentRate: null, //约定的事故预防服务费用比例
        frequency: null, //约定的事故预防服务费用比例
        serviceAccidentType: [],
        accidentType: '',
      },
    }
  },

  watch: {},
  computed: {
    ...mapGetters({
      getStrEnumAll: 'enums/getStrEnumAll',
    }),
  },
  methods: {
    changeService(e) {
      console.log(e)
      this.FormData.accidentType = this.FormData.serviceAccidentType.join('/')
      console.log(this.FormData.accidentType, '==')
    },
    removeTag(e) {},
    save() {
      let flag = false
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.$store.commit('policyInfo/accidentRate', this.FormData)
          flag = true
        }
      })
      return flag
    },
  },
}
</script>
<style lang="scss" scoped>
#accident {
  padding: 30px;

  background-color: #fff;
}
</style>
<style >
#accident .el-form-item__content {
  line-height: 32px;
  height: 32px !important;
}
</style>
