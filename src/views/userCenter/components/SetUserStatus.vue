<template>
    <el-dialog :title="title" width="500px" :visible.sync="dialogTableVisible"  @close="close" destroy-on-close :close-on-click-modal="false">
        <div class="user-status">
            <div class="status-l">
              <i class="el-icon-warning"></i>
            </div>
            <div class="status-r">
              <p>{{conent}}</p>
              <p><span>登录账号：</span><span class="color-blue">{{dialogForm.userloginId}}</span></p>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button round size="medium" type="info" @click="close">取 消</el-button>
            <el-button type="warning" size="medium" round @click="submit">确认提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {elevator} from '@/server/accidenServer.js';
export default {
    name: "SetUserStatus",
    props: {},
    data() {
        return {
          Elevator: new elevator(),
          dialogTableVisible: false,
          starList:[],
          dialogForm: {}, //dialog表单
          rules:{},
          title:'账号停用',
          conent:'账号停用后，此账号将无法使用，请确认？',
        };
    },
    computed: {
        
    },
    mounted() {
    },
    methods: {
        async initData(row) {
            this.dialogForm = JSON.parse(JSON.stringify(row))
            if (row.status === "0") {
              this.title = '账号启用'
              this.conent = '账号启用后，此账号将继续使用，请确认？'
						} else {
              this.title = '账号停用'
              this.conent = '账号停用后，此账号将无法使用，请确认？'
						}
            this.dialogTableVisible = true
        },
        clear() {
            this.dialogTableVisible = false
        },
        close() {
            this.clear();
        },
        async submit() {
          let data = {
            "userCode": this.dialogForm.userCode,
            "status": this.dialogForm.status=='0'?'1':'0',
          }
          let res = await this.Elevator.bind_resources(data,this.dialogForm.userLoginId);
          if (res.code === "0000") {
            this.clear();
            this.$emit('successCallback')
            this.dialogVisible = false;
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.msg);
          }
        },
    },
};
</script>

<style lang="less" scoped>
.user-status {
  display: flex;
  margin: 0 30px;
  .status-l {
    i {
      color: #FFA940;
      font-size: 26px;
    }
  }
  .status-r {
    margin-left: 10px;
    font-size: 14px;
    color: #000;
    p {
      line-height: 24px;
    }
  }
}
</style>
