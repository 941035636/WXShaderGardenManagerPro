<template>
  <el-dialog
    title="关联用户"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    @open="initData"
  >
    <div class="contents">
      <div>
        <span class="title">角色名称：</span>
        <span>{{ roleData.roleName }}</span>
      </div>
      <div>
        <span class="title">角色编码：</span>
        <span>{{ roleData.roleCode }}</span>
      </div>
    </div>
    <div class="switch">
      <div class="left_in">
        <div class="seach_user">
          <span>用户名：</span>
          <el-input
            v-model="ruleFormLeft.name"
            style="width: 150px"
            placeholder="请输入内容"
          ></el-input>
          <el-button class="seach" @click="seach('left')">查询</el-button>
        </div>
        <el-table
          :data="tableDataLeft"
          border
          style="width: 100%"
          tooltip-effect="dark"
          @selection-change="handleSelectionChangeLeft"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="用户名"></el-table-column>
          <el-table-column prop="userName" label="账号"></el-table-column>
        </el-table>
        <!-- <el-pagination
          small
          background
          :pager-count="5"
          layout="prev, pager, next"
          :total="1000"
        ></el-pagination> -->
      </div>
      <div class="left_in_rigth">
        <div>
          <el-icon icon-name="arrow-left" @click.native="goLeft" />
        </div>
        <div>
          <el-icon icon-name="arrow-right" @click.native="goRight" />
        </div>
      </div>
      <div class="left_in">
        <div class="seach_user">
          <span>用户名：</span>
          <el-input
            v-model="ruleFormRight.name"
            style="width: 150px"
            placeholder="请输入内容"
          ></el-input>
          <el-button class="seach" @click="seach('right')">查询</el-button>
        </div>
        <el-table
          :data="tableDataRight"
          border
          style="width: 100%"
          tooltip-effect="dark"
          @selection-change="handleSelectionChangeRight"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="用户名"></el-table-column>
          <el-table-column prop="userName" label="账号"></el-table-column>
        </el-table>
        <!-- <el-pagination
          small
          background
          :pager-count="5"
          layout="prev, pager, next"
          :total="1000"
        ></el-pagination> -->
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="correUserConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getUserList } from '@/api/userManagement'
  import { correUserSave } from '@/api/roleManagement'
  export default {
    name: 'CorreUsers',
    props: {
      roleData: {
        type: Object,
        requires: true,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        dialogVisible: false,
        ruleFormLeft: {
          name: '',
          pn: 1,
          ps: 999,
        }, // 左边条件
        ruleFormRight: {
          name: '',
          roleCode: '',
          pn: 1,
          ps: 999,
        }, // 右边条件
        multipleSelectionLeft: [],
        multipleSelectionRight: [],
        tableDataLeft: [],
        tableDataRight: [],
      }
    },
    methods: {
      // 初始化
      async initData() {
        console.log()
        this.ruleFormRight.roleCode = this.roleData.roleCode
        let res = await getUserList(this.ruleFormRight)
        console.log(res)
        if (res.code === '0000') {
          this.tableDataRight = res.list
        }
      },
      // 查询按钮
      async seach(attr) {
        if (attr === 'left') {
          let res = await getUserList(this.ruleFormLeft)
          if (res.code === '0000') {
            // 左侧数据赋值
            let contrastTemp = {}
            let tempList = []
            for (var i = 0; i < this.tableDataRight.length; i++) {
              let item = this.tableDataRight[i]
              contrastTemp[item.userCode] = 'yes'
            }
            for (var j = 0; j < res.list.length; j++) {
              if (!contrastTemp[res.list[j].userCode]) {
                tempList.push(res.list[j])
              }
            }
            this.tableDataLeft = tempList
          }
        } else {
        }
      },
      // 关闭dialog
      close() {
        this.ruleFormLeft = {
          name: '',
          pn: 1,
          ps: 999,
        } // 左边条件
        this.ruleFormRight = {
          name: '',
          roleCode: '',
          pn: 1,
          ps: 999,
        } // 右边条件
        this.multipleSelectionLeft = []
        this.multipleSelectionRight = []
        this.tableDataLeft = []
        this.tableDataRight = []
      },
      async correUser() {
        let userCodeList = this.tableDataRight.map((item) => item.userCode)
        let data = {
          roleCode: this.roleData.roleCode,
          userCodes: userCodeList,
        }
        console.log(data)
        let res = await correUserSave(data)
        if (res.code === '0000') {
          this.$baseMessage('关联用户成功', 'success')
          this.dialogVisible = false
        }
      },
      // 确认提交
      correUserConfirm() {
        this.$baseConfirm(
          '确定要关联用户？',
          '',
          () => {
            this.correUser()
          },
          () => {
            // this.$baseMessage('已取消', 'info')
          }
        )
      },
      goLeft() {
        if (this.multipleSelectionRight.length <= 0) {
          return false
        }
        this.tableDataLeft.push(...this.multipleSelectionRight)
        for (var i = 0; i < this.multipleSelectionRight.length; i++) {
          let itemi = this.multipleSelectionRight[i]
          let rightIndex = this.tableDataRight.findIndex(
            (item) => item.userCode === itemi.userCode
          )
          this.tableDataRight.splice(rightIndex, 1)
        }
        this.multipleSelectionRight = [] // 清空选择数据
      },
      // 勾选框左侧
      handleSelectionChangeLeft(val) {
        this.multipleSelectionLeft = val
      },
      goRight() {
        console.log(this.multipleSelectionLeft)
        if (this.multipleSelectionLeft.length <= 0) {
          return false
        }
        this.tableDataRight.push(...this.multipleSelectionLeft)
        for (var i = 0; i < this.multipleSelectionLeft.length; i++) {
          let itemi = this.multipleSelectionLeft[i]
          let rightIndex = this.tableDataLeft.findIndex(
            (item) => item.userCode === itemi.userCode
          )
          this.tableDataLeft.splice(rightIndex, 1)
        }
        this.multipleSelectionLeft = [] // 清空选择数据
      },
      // 勾选框右侧
      handleSelectionChangeRight(val) {
        this.multipleSelectionRight = val
      },
    },
  }
</script>

<style lang="scss" scoped>
  .contents {
    width: 50%;
    margin: 0 auto;
    line-height: 40px;
  }
  .switch {
    // display: flex;
    // overflow: hidden;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  .left_in_rigth {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 90px;
  }
  .left_in {
    // float: left;
  }
  .seach_user {
    margin-bottom: 10px;
  }
  .seach {
    margin-left: 10px;
  }
</style>
