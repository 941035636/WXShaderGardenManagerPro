<template>
  <div class="wrapper" id="classification">

    <header class="wrapper-content" style="margin-bottom:10px;">
      <el-row>
        <el-col class="wrpHeader">
          <div>设置栏目分类</div>
          <div>|</div>
          <div class="color_blue">( {{ firstName || '-' }} )设置</div>
          <div>
            <el-button type="text" @click="$router.push({ name: 'columnList' })" icon="iconfont icon-fanhui">
              返回</el-button>
          </div>
        </el-col>
      </el-row>
    </header>

    <div class="wrapper-content">
      <el-row>
        <el-col :span="12" class="ititys" style="padding:10px;height:70px"></el-col>
        <el-col :span="12" class="titrlys rlduiq " style="height:70px">
          <el-button type="primary" @click="goaddCaten(2, '添加分类', form.parentId)" round>添加分类</el-button>
        </el-col>
      </el-row>


      <div class="content">
        <el-table :data="classificationList" style="width: 100%;" :header-cell-style="getRowClass" row-key="id"
          :tree-props="{ children: 'chirdList' }" default-expand-all :expand-on-click-node="false">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="名称" show-overflow-tooltip width="800">
            <template slot-scope="scope">
              <div class="tbJump">
                <div>
                  <sapn v-if="scope.row.type == '三级栏目' || scope.row.type == '3'" style="width:32px;display:inline-block">
                  </sapn>
                  <input class="inlineinput" type="text" v-model="scope.row.sort" @blur="change(scope.row)"
                    oninput="value=value.replace(/[^0-9且或()]/g, '')" />
                  <span>{{ scope.row.name }}</span>
                  <span>-</span>
								  <span>{{ scope.row.typeCode || "" }}</span>
                </div>
                <div style="color:#509dfd;display: flex;justify-content: center;align-items: center;cursor: pointer;" v-if="scope.row.type == '二级栏目' || scope.row.type == '2'"
                  @click="goaddCaten(3, '添加子分类', scope.row.id)">
                  添加子分类
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="180" align="center">
            <template slot-scope="scope">
              <div :style="{
                color: scope.row.status == '关闭' ? '#b3b3b3' : '#1dd867'
              }">
                {{ scope.row.status }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text"
                @click="goIcation(scope.row.id, scope.row.parentId, scope.row.sort, scope.row.typeCode, scope.row.name, scope.row.status, '修改分类', scope.row.type)">修改</el-button>
              <el-button type="text" @click="delClass(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>



      <div class="block juzong mag20 mag20bot">
        <BasePagenations :tolnum='tolnum' @handleSizeChange='handleSizeChange' @handleCurrentChange='handleCurrentChange'>
        </BasePagenations>
      </div>

    </div>

    <addCate ref="addCate" @upData="upData"></addCate>
  </div>
</template>
<script>

import newsService from "../../service/newsService.js";
import addCate from './components/addCate.vue'
export default {
  components: { addCate },
  data() {
    return {
      firstName:"",
      newsService: new newsService(),
      classificationList: [], //类别列表
      tolnum: 0, //页码
      form: {
        pn: 1,
        ps: 10,
        // status:1,
        // orderby: "sort",
        // desc: true,
        type: 2,
        parentId: ""
      },
      data: {
        id: 0,
        isDelete: false,
        name: "",
        parentId: "",
        status: 1,
        type: 2,
        sort: 0
      }
    };
  },

  mounted() {
    if (this.$route.query.columnInfo) {
      this.form.parentId = this.$route.query.columnInfo;
      this.firstName = this.$route.query.firstName;
      this.getClassification();
    } else {
    }
  },
  methods: {

    //  修改或者创建成功以后，重新调用列表
    upData(val) {
      this.getClassification();
    },


    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f5f5f5";
      } else {
        return "";
      }
    },

    goaddCaten(type, title, parentId) {
      this.$refs.addCate.centerDialogVisible = true
      this.$refs.addCate.title = title
      this.$refs.addCate.form = {
        isDelete: false,
        name: "",
        parentId,
        status: 1,
        type,
        sort: 0,
      }
    },
    //修改栏目信息
    goIcation(id, pid, sort, typeCode, name, status, title, type) {
      this.$refs.addCate.centerDialogVisible = true
      this.$refs.addCate.title = title
      this.$refs.addCate.form = {
        id: id,
        isDelete: false,
        typeCode: typeCode,
        name: name,
        parentId: pid,
        status: status === "显示" ? 1 : status === "正常" ? 1 : status === "关闭" ? 2 : 1, //
        type: type == "二级栏目" ? 2 : type == "2" ? 2 : type == "三级栏目" ? 3 : type == "3" ? 3 : "",
        sort: sort || 0,
      }
    },

    //删除一个类别
    delClass(id) {
      this.$confirm("删除本类别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(() => {
          this.newsService.delColumn(id).then(res => {
            if (res.data.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getClassification();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //查询列表
    async getClassification() {
      let columnList = await this.newsService.getColumnList(this.form);
      if (columnList.data.code == "0000") {
        this.tolnum = columnList.data.total;
        this.classificationList = columnList.data.list;
      } else {
        this.$confirm("查询失败", "提示", {
          confirmButtonText: "确定"
        });
      }
    },

    //分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.form.ps = val;
      this.getClassification();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      console.log(val);
      this.form.pn = val;
      this.getClassification();
    }, //分页方法


    //编号修改
    change(row) {
      this.data.name = row.name;
      this.data.parentId = row.parentId;
      if (row.status === "显示" || row.status === "正常") {
        this.data.status = 1;
      } else if (row.status === "关闭") {
        this.data.status = 2;
      }
      this.data.type = row.type == "二级栏目" ? 2 : row.type == "2" ? 2 : row.type == "三级栏目" ? 3 : row.type == "3" ? 3 : "",
        this.data.sort = row.sort;
      this.data.id = row.id;
      this.data.typeCode = row.typeCode;
    },


    async reserve() {
      let createColumn = await this.newsService.createColumn(this.data);
      if (createColumn.data.code == "0000") {
        this.getClassification();
      }
    }
  },
  watch: {
    "data.sort": {
      handler() {
        this.reserve();
      }
    }
  }
};
</script>

<style lang="less">
#classification {
  // 去除el-table中折叠按钮
  .el-table [class*=el-table__row--level] .el-table__expand-icon {
    display: none !important;
  }
  //无子数据的tb去除自带的占位
  .el-table__indent{
    padding-left: 0 !important;
  }
  .el-table__placeholder {
    display: none !important;
  }
}
</style>

<style lang="less" scoped>
body {
  background: #f8f8f8;
}

.wrpHeader {
  display: flex;
  align-items: center;
  font-size: 15px;
  height: 60px;
  padding-left: 20px;

  div {
    margin-right: 10px;
  }

  .color_blue {
    color: #409EFF;
    margin-right: 20px;
  }

  .el-button--text {
    color: #404040;
  }
}

.content {
  width: 100%;
  height: 100%;
  padding: 0 30px;
  box-sizing: border-box;

  /* 隐藏无子设备的展开图表 */

  .inlineinput {
    width: 32px;
    height: 35px;
    border: 1px solid #f2f2f2;
    line-height: 35px;
    text-align: center;
    color: #6683d5;
    margin-right: 5px;
  }


  .tbJump {
    display: flex;
    justify-content: space-between;

    //input type = number 时 去除加减按钮
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }

    /* 火狐 */
    input {
      -moz-appearance: textfield;
    }
  }

}



.mouseover {
  cursor: pointer;
}

.fon-24 {
  font-size: 24px;
}

.xuhao {
  width: 38px;
  height: 38px;
  border: 1px solid #f2f2f2;
  text-align: center;
  line-height: 38px;
  margin-right: 10px;
  color: #6683d5;
  margin-top: 8px;
}

.pad {
  padding-left: 20px;
  padding-right: 20px;
  height: 55px;
  line-height: 55px;
}

.juzhong {
  line-height: 55px;
}
</style>
