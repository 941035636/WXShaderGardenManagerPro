<template>
  <div id="Achievements">
    <div class="elesearch">
      <el-row type="flex" class="row-bg">
        <!-- <el-col :span="8"><div>
					<span class="item2">姓名：</span>
					<el-input placeholder="请输入姓名" v-model="form.userName" size="medium" class="item1" clearable></el-input>
				</div></el-col>
				<el-col :span="8"><div>
					<span class="item2">工号：</span>
					<el-input placeholder="请输入工号" v-model="form.userNo" size="medium" class="item1" clearable></el-input>
				</div></el-col> -->
        <el-col :span="8">
          <div>
            <span class="item2">外勤人员：</span>
            <el-select v-model="form.fieldPersonnelJobNo" placeholder="请选择外勤人员" class="item1" size="medium" filterable
              clearable>
              <el-option v-for="item in condList.fieldPersonnelList" :key="item.itemCode" :label="item.itemName"
                :value="item.itemCode"></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span class="item2">分支机构：</span>
            <el-select v-model="form.fieldPersonnelBranchCode" placeholder="请选择分支机构" class="item1" size="medium"
              filterable clearable>
              <el-option v-for="item in condList.branchList" :key="item.itemCode" :label="item.itemName"
                :value="item.itemCode"></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span class="item2">推荐人：</span>
            <el-select v-model="form.referrerJobNo" placeholder="请选择推荐人" class="item1" size="medium" filterable
              clearable>
              <el-option v-for="item in condList.referrerList" :key="item.itemCode" :label="item.itemName"
                :value="item.itemCode"></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="8">
          <div style="text-align: right; padding-right: 10px">
            <el-button @click="empty" icon="el-icon-delete" round class="clear">清空条件</el-button>
            <el-button type="warning" @click="searchview" round class="submit">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="content-table">
      <div class="screen-tab">
        <ul class="screen-tab-list">
          <li v-for="item in RenewalStatusEnum" :key="item.code" :class="{ active: form.status == item.code }"
            @click="onStatus(item.code)">
            {{ item.msg }}
          </li>
        </ul>
      </div>

      <div class="set-sccount-manager">
        <div @click="setManager('')">添加外勤人员</div>
      </div>

      <div style="padding: 0 21px 21px 21px; background-color: #ffffff">
        <el-table :data="data1" style="width: 100%" highlight-current-row show-header border fit
          :header-cell-style="tableHeaderColor">
          <el-table-column label="所属机构" align="center">
            <template slot-scope="scope">
              <p>
                <span>{{ scope.row.fieldPersonnelBranchName }} </span>
              </p>
            </template>
          </el-table-column>

          <el-table-column label="姓名" align="center" min-width="70">

            <template slot-scope="scope">
              <p class="cur-op">
                <span>{{ scope.row.fieldPersonnelName ? scope.row.fieldPersonnelName : "-" }}</span>
                <span>{{ scope.row.fieldPersonnelJobNo ? scope.row.fieldPersonnelJobNo : "-" }}</span>
              </p>
            </template>

          </el-table-column>

          <el-table-column label="加入时间" align="center" width="160">
            <template slot-scope="scope">
              <p class="cur-op">
                <span>{{ scope.row.fieldPersonnelJoinTime.substring(0,10) }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column label="状态" align="center" width="160">
            <template slot-scope="scope">
              <span style="color: #f5222d" v-if="scope.row.status == 00">停用</span>
              <span style="color: #52c41a" v-else-if="scope.row.status == 01">有效</span>
              <span v-else></span>
            </template>
          </el-table-column>

          <el-table-column label="推荐人" align="center">
            <template slot-scope="scope">
              <span>
                {{
                    scope.row.referrerName ? scope.row.referrerName : "-"
                }}

                {{
                    scope.row.referrerJobNo ? scope.row.referrerJobNo : "-"
                }}
                {{
                    scope.row.referrerBranchName ? "" + scope.row.referrerBranchName : ""
                }}



              </span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="更新时间" align="center">
            <template slot-scope="scope">
              <p class="cur-op">
                <span>{{ scope.row.updateTime }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" align="center" width="180px">
            <template slot-scope="scope">
              <el-dropdown trigger="click">
                <el-button type="text" class="moreBtn">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item class="moreBtn" @click.native="setManager(scope.row)">
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item class="moreBtn" @click.native="follow(scope.row)">
                    <span v-if="scope.row.status == 00">启用</span>
                    <span v-else>停用</span>
                  </el-dropdown-item>
                  <el-dropdown-item class="moreBtn" @click.native="deletesPlans(scope.row)">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="content-total">
      <el-pagination v-if="total != 0" background @current-change="handleCurrentChange" :current-page="form.pn"
        :page-size="form.ps" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dislogTitle" :visible.sync="dialogVisible" width="805px" :before-close="handleClose">
      <div>
        <PeoPle v-if="tag == 'PeoPle'" @sitCancel="dialogVisible = false" :show="dialogVisible" :params="followObj"
          @onSubmit="fFn" />

        <Situation v-if="tag == 'follow'" :reasonWxEnum="reasonWxEnum" @sitCancel="sitCancel" :show="dialogVisible"
          :params="followObj" @onSubmit="fFn" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fieldPerson from "../../service/fieldPerson.js";
import UserService from '@/service/UserService.js'
import Situation from "./components/Situation.vue";

import PeoPle from "./components/PeoPle.vue";
export default {
  components: {
    Situation,
    PeoPle,
  },
  data() {
    return {
      UserService: new UserService(),
      fieldPerson: new fieldPerson(),
      form: {
        desc: false, //是否为倒叙
        fieldPersonnelBranchCode: "", //外勤人员所属机构编码
        fieldPersonnelJobNo: "", //外勤人员员工号
        fieldPersonnelName: "", //外勤人员姓名
        orderby: "", //排序字段
        pn: 1, //请求第几页
        ps: 10, //页面大小
        referrerJobNo: "", //推荐人员工号
        referrerName: "", //推荐人姓名
        status: "", //状态 00-停用 01-有效
      },

      condList: [], //查询条件接口

      data1: [], //列表数据
      // 分页器
      total: 0,
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,

      datas: [],
      exhibition: false,
      row: {},
      dialogVisible: false,

      //tab切换
      RenewalStatusEnum: [
        { code: "", msg: "全部" },
        { code: "01", msg: "有效" },
        { code: "00", msg: "已停用" },
      ],

      dislogTitle: "", //弹框标题

      dialogVisible: false, //弹框隐显
      tag: "", //弹框显示类型


      // 弹框接收参数
      followObj: {
        id: "",
        fieldPersonnelName: "",//外勤人员工姓名
        fieldPersonnelJobNo: "",//外勤人员员工号
        peoPleType: "",//修改类型
        referrerJobNo: "",//推荐人员工号
        referrerName: "",//推荐人姓名
        hasReferrer: "",//是否有推荐人标识
        fieldPersonnelJoinTime: "",//外勤人有加入时间
        fieldPersonnelBranchName:"",//外勤人员公司
          referrerBranchName:"",//推荐人公司
      },

      reasonWxEnum: [], // 全面营销人员

    };
  },
  created() {
    this.loadBranch();
    this.getAchData();
    this.getController()
  },
  methods: {
    // 获取全面营销人员
    async getController() {
      let data = {
        jtBranchCode: '',
        hrPersonCategory: '08',
        pageSize: 10000,
        pageNum: 1
      }
      let res = await this.UserService.getUserByNo(data)
      console.log(res,'res---------');
      if (res.code == "0000") {
        this.reasonWxEnum = res.list;
      }

      console.log('全面营销人员',this.reasonWxEnum);

    },

    // 表头文字样式
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F0F0F1;color:black;";
      }
    },

    //tab切换
    onStatus(code) {
      console.log(code);
      this.form.status = code;
      this.getAchData();
    },
    //删除
    deletesPlans(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.fieldPerson.delFieldPersonnel(row.id);
          if (res.code === "0000") {
            this.$message.success("删除成功");
            this.getAchData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 获取分支机构
    async loadBranch() {
      let res = await this.fieldPerson.fieldPersonnelCond();
      if (res.code == "0000") {
        console.log(res, "res");
        this.condList = res.data;
      }
    },
    handleCurrentChange: function (pageNum) {
      //页码
      this.form.pn = pageNum;
      this.getAchData();
    },
    searchview() {
      //查询
      this.currentPage = 1;
      this.getAchData();
    },
    //清空
    empty() {
      //清空
      this.form = {
        desc: false, //是否为倒叙
        fieldPersonnelBranchCode: "", //外勤人员所属机构编码
        fieldPersonnelJobNo: "", //外勤人员员工号
        fieldPersonnelName: "", //外勤人员姓名
        orderby: "", //排序字段
        pn: 1, //请求第几页
        ps: 10, //页面大小
        referrerJobNo: "", //推荐人员工号
        referrerName: "", //推荐人姓名
        status: "", //状态 00-停用 01-有效
      },
      
      this.$nextTick(()=>{
        this.currentPage = 1;
      });
      this.getAchData();
    },
    //获取外勤人员列表
    async getAchData() {


      console.log(this.form);

      let res = await this.fieldPerson.fieldPersonnelList(this.form);

      if (res.code == "0000") {
        this.data1 = res.list;
        this.total = res.total;
      }
    },

    // 弹框
    handleClose() {
      this.dialogVisible = false;
    },

    //--停用或启用
    follow(row) {
      this.tag = "PeoPle";
      this.dialogVisible = true;
      this.followObj = {
        id: row.id,
        fieldPersonnelName: row.fieldPersonnelName,//员工姓名
        fieldPersonnelJobNo: row.fieldPersonnelJobNo,//员工号
        peoPleType: "",//修改类型
        referrerJobNo: "",//推荐人员工号
        referrerName: "",//推荐人姓名
        hasReferrer: "",//是否有推荐人标识
        fieldPersonnelJoinTime: "",//外勤人有加入时间
        fieldPersonnelBranchName:"",//外勤人员公司
        referrerBranchName:"",//推荐人公司

      }; // 跟进续保 主键

      if (row.status == "00") {
        this.dislogTitle = "外勤人员启用";
        this.followObj.peoPleType = "01"
      } else {
        this.dislogTitle = "外勤人员停用";
        this.followObj.peoPleType = "00"
      }
    },

    //--添加外勤人员
    setManager(row) {
      console.log(row, "setManger");
      if (row) {//修改外勤人员

        this.followObj = {
          id: row.id,
          fieldPersonnelName: row.fieldPersonnelName?row.fieldPersonnelName:"",//外勤人员工姓名
          fieldPersonnelJobNo:row.fieldPersonnelJobNo?row.fieldPersonnelJobNo:"",//外勤人员员工号
          peoPleType: "",//修改类型  01 00 
          referrerJobNo:row.referrerJobNo?row.referrerJobNo:"",//推荐人员工号
          referrerName: row.referrerName?row.referrerName:"",//推荐人姓名
          hasReferrer: row.hasReferrer,//是否有推荐人标识 1 0 
          fieldPersonnelJoinTime: row.fieldPersonnelJoinTime?row.fieldPersonnelJoinTime:"",//外勤人有加入时间
           fieldPersonnelBranchName:row.fieldPersonnelBranchName?row.fieldPersonnelBranchName:"",//外勤人员公司
        referrerBranchName:row.referrerBranchName?row.referrerBranchName:"",//推荐人公司
        }; // 跟进续保 主键

        this.dislogTitle = "修改外勤人员";

      } else {//添加用户code

        this.followObj = {
          id: "",
          fieldPersonnelName: "",//外勤人员工姓名
          fieldPersonnelJobNo: "",//外勤人员员工号
          peoPleType: "",//修改类型
          referrerJobNo: "",//推荐人员工号
          referrerName: "",//推荐人姓名
          hasReferrer: "",//是否有推荐人标识
          fieldPersonnelJoinTime: "",//外勤人有加入时间
          fieldPersonnelBranchName:"",//外勤人员公司
          referrerBranchName:"",//推荐人公司
        }; // 跟进续保 主键

        this.dislogTitle = "添加外勤人员";
      }


      this.tag = "follow";

      this.dialogVisible = true;
    },
    //外勤人员关闭
    sitCancel() {
      this.dialogVisible = false;
    },
    //确认
    fFn() {
      this.dialogVisible = false;
      this.getAchData();
      this.loadBranch()
    },
  },
};
</script>

<style lang="less">
#Achievements {
  padding-bottom: 80px;

  .elesearch {
    width: calc(100% - 40px);
    min-height: 134px;
    padding: 20px 20px 10px;
    margin: 20px 20px 20px 20px;
    box-sizing: border-box;
    background-color: #fff;

    .row-bg {
      margin-bottom: 20px;

      .item1 {
        width: 65%;
      }

      .item2 {
        display: inline-block;
        width: 30%;

        text-align: right;
        font-size: 16px;
        color: #666666;
        margin-right: 10px;
        // overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 15px;
      }

      .clear {
        color: #000;
        border-color: #e9e9e9;
        background-color: #e9e9e9;
      }

      .submit {
        color: #fff;
        border-color: #ffa940;
        background-color: #ffa940;
      }
    }
  }

  .content1 {
    width: 100%;
    text-align: right;
    padding: 31px 37px 20px 21px;
    box-sizing: border-box;
  }

  .content-table {
    width: 100%;
    padding: 0 20px 30px;
    box-sizing: border-box;
  }

  .screen-tab {
    width: 100%;
    height: 40px;
    line-height: 42px;
    margin-top: 12px;
    background: #fff;
    border-bottom: 2px solid #ffa940;

    .screen-tab-list {
      display: flex;
      align-items: center;

      li {
        position: relative;
        padding: 0 30px;
        font-size: 16px;
        cursor: pointer;
      }

      li.active {
        // color: #fa8c16;
        color: rgba(251, 251, 251, 1);
        background: #ffa940;
      }
    }
  }

  .set-sccount-manager {
    box-sizing: border-box;
    display: flex;
    flex-direction: row-reverse;
    padding: 17px 16px;
    background: #ffffff;
    cursor: pointer;

    div {
      padding: 8px 25px;
      color: #fff;
      border-radius: 19px;
      background: #1890ff;
    }
  }

  .content-total {
    width: calc(100% - 50px);
    margin: 0 30px 0 20px;
    height: 60px;
    line-height: 60px;
    text-align: right;
  }

  .generation {
    display: inline-block;
    width: 103px;
    height: 34px;
    border: 1px solid #c9984a;
    border-radius: 4px;
    box-sizing: border-box;
    text-align: center;
    line-height: 34px;
    margin-left: 10px;
    font-size: 14px;
    color: #c9984a;
    font-weight: 600;
    background-color: #fff8ee;
    cursor: pointer;
  }

  .color6 {
    color: #666666;
  }

  .color-blue {
    cursor: pointer;
    color: #2d8cf0;
  }

  .register-btn {
    display: inline-block;
    width: 162px;
    height: 44px;
    background: rgba(201, 152, 74, 1);
    border-radius: 4px;
    font-family: Adobe Heiti Std;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
    line-height: 44px;
    cursor: pointer;
  }

  .col-red {
    color: #f5222d;
  }

  .col-gre {
    color: #52c41a;
  }

  .cur-op {
    cursor: pointer;
  }

  .col-grey {
    color: #848484;
  }

  .col-blue {
    color: #0432ff;
  }
}
</style>
