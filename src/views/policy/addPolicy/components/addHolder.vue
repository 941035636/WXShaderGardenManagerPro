<template>
  <div id="addHolder">
    <el-form label-position="left" label-width="140px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业名称：">
            <span v-if="data.custFullName && data.custFullName.length > 13">
              {{ data.custFullName.slice(0, 13) }}...
              <el-popover placement="top" width="300" v-model="visible3">
                <p>{{ data.custFullName }}</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="visible3 = false"
                  >
                    确定
                  </el-button>
                </div>
                <el-button
                  type="text"
                  class="downloadfile ml5"
                  slot="reference"
                >
                  更多
                </el-button>
              </el-popover>
            </span>

            <span v-else>{{ data.custFullName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="社会信用代码：">
            {{ data.blCode }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属行业：">
            <more-con :data="manageName" :length="13" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="经营地址：">
            <more-con
              :data="
                data.provinceName + '/' + data.cityName + '/' + data.countyName
              "
              :length="13"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moreCon from '@/components/moreCon'
export default {
  components: { moreCon },
  data() {
    return {
      data: {},
      visible3: false,
      visible4: false,
    }
  },
  computed: {
    manageName() {
      let name = []
      let result = ''
      if (this.data.industryOneName) {
        result = this.data.industryOneName + '/' + this.data.industryTwoName
      } else if (this.data.administrations) {
        this.data.administrations.forEach((item) => {
          name.push(item.itemText)
        })
        result = name.join(' / ')
      } else {
        result = this.data.economyNameOne + '/' + this.data.economyNameTwo
      }
      return result
    },
    industryName() {
      let name = []
      let result = ''
      if (this.data.sysDictItemEntitys) {
        this.data.sysDictItemEntitys.forEach((item) => {
          name.unshift(item.itemText)
        })
        result = name.join(' / ')
      } else {
        result = this.data.industryOneName + '/' + this.data.industryTwoName
      }
      return result
    },
  },
}
</script>

<style lang='scss' scoped>
#addHolder {
  width: 100%;
  padding: 30px 30px 10px 50px;
  box-sizing: border-box;
}
</style>
<style lang='scss'>
#addHolder {
  .el-form-item {
    margin-bottom: 6px;
  }
  .el-form-item__label {
    color: #919191;
  }
  .downloadfile {
    color: #fa8c16;
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>