<template>
  <el-dialog
    id="userDetail"
    title="账号详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @open="initData"
  >
    <div class="row">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="8">
          <span class="title">姓名：</span>
          <span>{{ data ? data.name : '' }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">系统登录账号：</span>
          <span>{{ data ? data.userAccount : '' }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="8">
          <span class="title">账号类型：</span>
          <span>{{ typeUserName }}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">关联机构：</span>
          <span>{{ orgName }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="8">
          <span class="title">角色：</span>
          <span>{{ roleName }}</span>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
  import { getUserDetail, getYingJiZhanghaoList } from '@/api/userManagement'
  import {
    getBranchList,
    getOrgList,
    getExpertList,
  } from '@/api/userDataManagement'
  export default {
    name: 'UserDetail',
    props: {
      typeData: {
        type: Array,
        required: true,
        default: () => {
          return []
        },
      },
      roleData: {
        type: Array,
        required: true,
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        dialogVisible: false,
        userCode: '',
        data: null,
        releData: [],
      }
    },
    computed: {
      typeUserName() {
        return this.typeData && this.data
          ? this.typeData.find((item) => item.code === this.data.type).label
          : '/'
      },
      orgName() {
        if (this.releData.length > 0 && this.data) {
          let obj = this.releData.find(
            (item) => item.value === this.data.branchId
          )
          if (obj) {
            return obj.label
          } else {
            return '/'
          }
        } else {
          return '/'
        }
      },
      roleName() {
        let roleName = ''
        if (this.data) {
          let roleCodes = this.data.roleCodes.split(',')
          if (roleCodes) {
            roleCodes.forEach((element, index) => {
              let roleN = this.roleData.find(
                (item) => item.roleCode === element
              ).roleName
              if (roleCodes.length - 1 > index) {
                roleName += roleN + ','
              } else {
                roleName += roleN
              }
            })
            return roleName
          }
        }
        return roleName
      },
    },
    methods: {
      async initData() {
        let res = await getUserDetail(this.userCode)
        if (res.code === '0000') {
          this.data = res.data
          this.userTypeChange(res.data.type)
        }
      },
      async initReleData(val, obj, attr) {
        let res = await val(obj)
        if (res.code === '0000') {
          this.changeDataField(attr, res.list)
        }
      },
      changeDataField(val, list) {
        console.log(val, list)
        switch (val) {
          case '00':
            // 企业用户
            this.releData = list.map((item) => {
              return {
                value: item.id,
                label: item.custFullName,
              }
            })
            break
          case '01':
          // 专家用户
          case '02':
          // 应急局用户
          case '03':
          // 服务机构用户
          case '04':
            // 保险公司用户
            this.releData = list.map((item) => {
              return {
                value: item.id,
                label: item.name,
              }
            })
            break
        }
      },
      userTypeChange(val) {
        let data = {}
        let func = null
        switch (val) {
          case '00':
            // 企业用户
            data = {
              pn: 1,
              ps: 1000,
              status: '1',
            }
            func = getOrgList
            break
          case '01':
            // 专家用户
            data = {
              pn: 1,
              ps: 1000,
              status: '1',
            }
            func = getExpertList
            break
          case '02':
            // 应急局用户
            data = {
              pn: 1,
              ps: 1000,
              status: '1',
            }
            func = getYingJiZhanghaoList
            break
          case '03':
            // 服务机构用户
            data = {
              pn: 1,
              ps: 1000,
              type: '02',
              status: '1',
            }
            func = getBranchList
            break
          case '04':
            // 保险公司用户
            data = {
              pn: 1,
              ps: 1000,
              type: '01,04',
              status: '1',
            }
            func = getBranchList
            break
        }
        this.initReleData(func, data, val)
      },
    },
  }
</script>

<style lang="scss" scoped>
  #userDetail {
    .title {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    .row {
      line-height: 40px;
    }
  }
</style>
