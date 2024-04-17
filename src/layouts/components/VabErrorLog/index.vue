<template>
  <div v-if="errorLogs.length > 0">
    <el-badge :value="errorLogs.length" @click.native="open">
      <el-button type="danger">
        <font-awesome-icon :icon="['fas', 'bug']" />
        <!-- <vab-icon :icon="['fas', 'bug']" /> -->
      </el-button>
    </el-badge>

    <el-dialog
      :visible.sync="dialogTableVisible"
      append-to-body
      width="70%"
      title="yingji-admin异常捕获(温馨提示：错误必须解决)"
    >
      <el-table :data="errorLogs">
        <el-table-column label="报错路由">
          <template slot-scope="{ row }">
            <a :href="row.url" target="_blank">
              <el-tag type="success">{{ row.url }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="错误信息">
          <template slot-scope="{ row }">
            <el-tag type="danger" v-if="row.err.length">{{ row.err }}</el-tag>
            <el-tag type="danger" v-else>
              {{ decodeUnicode(row.err.message) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="错误详情" width="120">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover">
              <div style="color: red">
                {{ scope.row.err.stack ? scope.row.err.stack : scope.row.err }}
              </div>
              <el-button slot="reference">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column width="380" label="操作">
          <template slot-scope="{ row }">
            <a
              v-for="(item, index) in searchList"
              :key="index"
              :href="
                item.url + row.err.length
                  ? row.err
                  : decodeUnicode(row.err.message)
              "
              target="_blank"
            >
              <el-button style="margin-left: 5px" type="primary">
                <font-awesome-icon :icon="['fas', 'search']" />
                {{ item.title }}
              </el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="clearAll">
          暂不显示
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { abbreviation, title } from '@/config'
import { mapGetters } from 'vuex'

export default {
  name: 'VabErrorLog',

  data() {
    return {
      dialogTableVisible: false,
      title: title,
      abbreviation: abbreviation,
      searchList: [
        {
          title: '百度搜索',
          url: 'https://www.baidu.com/baidu?wd=',
        },
        {
          title: '谷歌搜索',
          url: 'https://www.google.com/search?q=',
        },
        {
          title: 'Magi搜索',
          url: 'https://magi.com/search?q=',
        },
      ],
    }
  },

  computed: {
    ...mapGetters({
      errorLogs: 'errorLog/errorLogs',
    }),
  },
  methods: {
    open() {
      console.log(this.errorLogs, '00000')

      this.dialogTableVisible = true
    },
    clearAll() {
      this.dialogTableVisible = false
      this.$store.dispatch('errorLog/clearErrorLog')
    },
    decodeUnicode(str) {
      str = str.replace(/\\/g, '%')
      str = unescape(str)
      str = str.replace(/%/g, '\\')
      str = str.replace(/\\/g, '')
      return str
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-badge {
    .el-button {
      display: flex;
      align-items: center;
      justify-items: center;
      height: 28px;
    }
  }
}
</style>
