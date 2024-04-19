<template>
  <el-dialog
    title="关联专家"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="1000px"
    :before-close="handleClose"
    @close="close"
    @open="initData"
  >
    <div class="switch">
      <div class="left_in">
        <div class="seach_user">
          <span>专家：</span>
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
          <el-table-column
            prop="safetyTechniciansName"
            label="姓名"
          ></el-table-column>
          <el-table-column
            prop="safetyTechniciansPhone"
            label="联系电话"
          ></el-table-column>
          <el-table-column
            prop="safetyTechniciansCertificate"
            label="证件号码"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="goRight(scope.row)">
                添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          small
          background
          :pager-count="5"
          layout="prev, pager, next"
          :total="totalLeft"
        ></el-pagination>
      </div>
      <div class="left_in">
        <div style="height: 32px" class="seach_user">
          <span>机构</span>
        </div>
        <el-table
          :data="tableDataRight"
          border
          style="width: 100%"
          tooltip-effect="dark"
        >
          <el-table-column
            prop="safetyTechniciansName"
            label="姓名"
          ></el-table-column>
          <el-table-column
            prop="safetyTechniciansPhone"
            label="联系电话"
          ></el-table-column>
          <el-table-column
            prop="safetyTechniciansCertificate"
            label="证件号码"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delRight(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          small
          background
          :pager-count="5"
          layout="prev, pager, next"
          :total="totalRight"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="correUserConfirm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>

  export default {
    name: 'Relation',
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
        addList: [],
        ruleFormLeft: {
          name: '',
          pn: 1,
          ps: 999,
        }, // 左边条件
        ruleFormRight: {
          pn: 1,
          ps: 999,
        }, // 右边条件
        servicename: '', // 标识（接口入参使用）
        id: '', // 接口入参使用
        multipleSelectionLeft: [],
        multipleSelectionRight: [],
        tableDataLeft: [],
        tableDataRight: [],
        cancleList: [], //取消提交数据
        cancleList2: [],
        totalLeft: 0,
        totalRight: 0,
      }
    },
    methods: {
      // 初始化
      async initData() {
        this.addList = []
        this.cancleList2 = []
        this.cancleList = []
        let res = await getLinkExpertList(this.ruleFormLeft)
        if (res.code === '0000') {
          this.tableDataLeft = res.list
          this.totalLeft = res.total
        }
        let rest = await getOrgExpertList(
          this.ruleFormRight,
          this.servicename,
          this.id
        )

        if (rest.code == '0000') {
          this.tableDataRight = rest.list
          this.cancleList = JSON.parse(JSON.stringify(rest.list))
          this.totalRight = rest.total
        }
      },
      // 查询按钮
      async seach() {
        if (/^[0-9]+.?[0-9]*$/.test(this.ruleFormLeft.name)) {
          this.ruleFormLeft.safetyTechniciansPhone = this.ruleFormLeft.name
          this.ruleFormLeft.safetyTechniciansName = ''
        } else {
          this.ruleFormLeft.safetyTechniciansPhone = ''
          this.ruleFormLeft.safetyTechniciansName = this.ruleFormLeft.name
        }
        let res = await getLinkExpertList(this.ruleFormLeft)
        if (res.code === '0000') {
          this.tableDataLeft = res.list
        }
      },
      // 关闭dialog
      handleClose() {
        this.$confirm('确认关闭？')
          .then((_) => {
            this.cancleSub()
            this.dialogVisible = false
          })
          .catch((_) => {})
      },
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
      cancle() {
        this.cancleSub()
        this.dialogVisible = false
      },
      async cancleSub() {
        if (this.cancleList2.length) {
          let res = await postOrgExpert(
            this.cancleList2,
            this.servicename,
            this.id
          )
        }
      },
      async correUser() {
        let arr = this.multipleSelectionRight.map((item) => {
          return item.id
        })
        console.log(arr)
        let res = await postOrgExpert(arr, this.servicename, this.id)
        console.log(res)
        if (res.code === '0000') {
          this.$baseMessage('关联专家成功', 'success')
          this.dialogVisible = false
        }
      },
      // 确认提交
      correUserConfirm() {
        console.log(this.multipleSelectionRight, 'sumbit')
        if (this.multipleSelectionRight.length > 0) {
          this.$confirm(
            '确定要关联用专家？',
            '',
            () => {
              this.correUser()
            },
            () => {}
          )
        } else {
          this.dialogVisible = false
        }
      },
      // 勾选框左侧
      handleSelectionChangeLeft(val) {
        this.multipleSelectionLeft = val
      },
      goRight(val) {
        let result = this.addList.find((item) => {
          return item == val.id
        })

        if (!result) {
          this.addList.push(val.id)
          this.tableDataRight.push(val)
          let rightIndex = this.tableDataLeft.findIndex(
            (item) => item.id === val.id
          )
          console.log(rightIndex, 'rightIndex')
          this.tableDataLeft.splice(rightIndex, 1)

          console.log(this.multipleSelectionLeft, val, 'before')
          this.multipleSelectionRight.push(val) //新增的数据，提交时使用
        } else {
          let rightIndex = this.addList.findIndex((item) => item.id === val.id)
          this.tableDataLeft.splice(rightIndex, 1)
          this.$baseMessage('该专家已添加', 'error')
        }
      },
      async delRight(val) {
        console.log(this.multipleSelectionRight, 'click')
        let that = this
        // 删除关联的专家
        this.$confirm(
          '确定要删除关联的专家？',
          '',
          () => {
            console.log(this.tableDataRight, 'rigth')
            this.tableDataRight = this.tableDataRight.filter(
              (item) => item.id !== val.id
            )
            this.multipleSelectionRight = this.multipleSelectionRight.filter(
              (item) => item.id !== val.id
            )
            let result = this.addList.find((item) => {
              return item == val.id
            })
            if (result) {
              this.addList.splice(
                this.addList.findIndex((item) => item === val.id),
                1
              )
            }
            let result2 = this.cancleList.find((item) => {
              return item.id == val.id
            })
            if (result2) {
              let result3 = this.cancleList2.find((item) => {
                return item == val.id
              })
              if (!result3) {
                this.cancleList2.push(val.id)
              }
            }
            this.delLikExpert(val)
          },
          () => {
            // this.$baseMessage('已取消', 'info')
          }
        )
      },
      async delLikExpert(val) {
        // 删除关联专家接口请求
        let arr = []
        arr.push(val.id)
        let res = await delLinkExpert(arr, this.servicename, this.id)
        if (res.code == '0000') {
          this.$baseMessage('删除成功', 'success')
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .contents {
    width: 80%;
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
    min-width: 450px;
    // float: left;
  }
  .seach_user {
    margin-bottom: 10px;
  }
  .seach {
    margin-left: 10px;
  }
</style>
