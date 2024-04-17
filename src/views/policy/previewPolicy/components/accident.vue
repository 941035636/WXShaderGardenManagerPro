<template>
  <div id="accidentInfo">
    <el-form label-position="left" label-width="140px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="服务费比例：">
            {{ data.accidentRate }}%
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="服务频次：">{{ data.frequency }}次</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="服务内容：">
            <more-con :data="data.accidentType" :length="13" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moreCon from '@/components/moreCon'
import { mapGetters } from 'vuex'
export default {
  components: { moreCon },
  data() {
    return {
      data: {},
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',
      getStrEnumAll: 'enums/getStrEnumAll',
      branchId: 'user/branchId',
      accountType: 'user/accountType',
    }),
  },
  methods: {},
}
</script>

<style lang='scss' scoped>
#accidentInfo {
  border-radius: 6px;
  background-color: #fff;
  width: 100%;
  padding: 30px 30px 10px 50px;
  box-sizing: border-box;
  .stitle {
    font-weight: bold;
    color: #000;
  }
  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>