<template>
<!-- 认证资料信息 -->
    <div class="accountDetails" id="accountDetails">
      <div class="conent">
        <div class="conent-l">
          <div class="l-head">
            <p class="head-title">{{enterprise.orgFullName}}</p>
            <p class="head-num">NO:{{enterprise.erpCode}}</p>
            <div class="head-num">
              <p v-if="getIsShow(enterprise.custOrganizationElementList,'elementCode','applicantType','valuesCode')=='sequip_05'">
                <i class="el-icon-success color-gre"></i>
                <span>检测机构</span>
              </p>
              <p v-if="getIsShow(enterprise.custOrganizationElementList,'elementCode','applicantType','valuesCode')!=='sequip_05'">
                <i class="el-icon-error color-red"></i>
                <span>非检测机构</span>
              </p>
            </div>
          </div>
          <el-form
            size="mini"
            ref="form"
            :model="enterprise"
            label-position="left"
            label-width="100px">
            <el-form-item label="企业类型：">
                {{enterprise.custOrganizationElementList | getCurrentOrgElementVOList('elementCode','userType','elementValues')}} /
                {{enterprise.custOrganizationElementList | getCurrentOrgElementVOList('elementCode','orgType','elementValues')}}
            </el-form-item>
            <el-form-item label="所在区域：">
                {{enterprise.provinceName}} /
                {{enterprise.orgAddress}}
            </el-form-item>
            <el-form-item label="用户级别：">
              <div style="display:flex" v-if="startData.starLevel">
                <span style="color:#f7ba2a;margin-right:5px">{{startData.starLevel}}星级客户</span>
                <div>
                  <el-rate style="margin-top:4px" v-model="startData.starLevel" disabled></el-rate>
                </div>
              </div>
              <div v-else>无</div>
            </el-form-item>
          </el-form>
          <el-table :data="enterprise.paperworkInfoList" style="width: 100%" highlight-current-row show-header border fit :header-cell-style="rowClass">
            <el-table-column  type="index" label="序号" align="center" width="100"></el-table-column>
            <el-table-column prop="name" label="证件类型" align="center"></el-table-column>
            <el-table-column prop="value" label="证件号" align="center"></el-table-column>
            <el-table-column prop="taxpayerNo" label="操作" align="center">
              <template slot-scope="socpe">
                <el-button type="text" @click="clickImg(socpe.row)">附件查看</el-button>
              </template>
            </el-table-column>
            
          </el-table>
        </div>
        <div class="conent-r">
            <div class="sigle-content">
              <div class="sigle-title">联系人信息</div>
              <div class="sigle-name">姓名：{{enterprise.custOrganizationElementList | getCurrentOrgElementVOList('elementCode','linkManName','elementValues')}}（{{enterprise.custOrganizationElementList | getCurrentOrgElementVOList('elementCode','linkManPhone','elementValues')}}）</div>
              <div class="sigle-name">邮箱：{{enterprise.custOrganizationElementList | getCurrentOrgElementVOList('elementCode','linkManEmil','elementValues')}}</div>
              <div class="sigle-name">联系地址：{{enterprise.custOrganizationElementList | getCurrentOrgElementVOList('elementCode','linkManAreaName','elementValues')}}{{enterprise.custOrganizationElementList | getCurrentOrgElementVOList('elementCode','linkManDetailAddress','elementValues')}}</div>
            </div>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
		</div>
</template>

<script>
import userService from '@/service/UserService.js';
export default {
    props: {
      enterprise:{
        type: Object,
        default: ()=>{
          return {}
        }
      },
      business:{
        type: Object,
        default: ()=>{
          return {}
        }
      },
      startData:{
        type: Object,
        default: ()=>{
          return {}
        }
      }
    },
    filters:{
      getCurrentOrgElementVOList(list=[],listCodeFlag,currentFlag,currentKeyFlag){
        let obj = list.find((item)=>item[listCodeFlag]===currentFlag) || {}
        return obj[currentKeyFlag] || ''
      },
      strFormat(str){
        if (str) {
          return str;
        }
        return "--";
      }
    },
    data() {
        return {
          dialogVisible:false,
          userService: new userService(),
          list:[],
          value1:1,
          dataSource:{},
          codeToText:[],
          dialogImageUrl:'',
          form:{
            star:'',
          },
				}
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      getIsShow(list=[],listCodeFlag,currentFlag,currentKeyFlag){
        let obj = list.find((item)=>item[listCodeFlag]===currentFlag) || {}
        return obj[currentKeyFlag] || ''
      },
      loadArea() {
          this.getArea('2').then(data=> { this.codeToText = data; });
      },
      rowClass({row, column, rowIndex, columnIndex}) {//修改表头样式
        if (rowIndex == 0) {
          return 'color:#0050b3;font-weight: 600;background-color:#e6f7ff;font-size:14px;text-align: center;';
        } else {
          return;
        }
      },
      // 下载附件
      async clickImg(row) {
        if(row.url) {
          let dataImg1 = await this.userService.getKaptchaImg(this.$apiUrl.COM_INDENT_SHOW + row.preSignUrl);
          this.dialogVisible = true
          this.dialogImageUrl =  dataImg1.data
        } else {
          this.$message.error('暂无附件信息')
        }
      },
      selectStar() {},
    },
};
</script>

<style lang="less" scoped>
  .accountDetails{
		background-color: #fff;
		padding: 20px 50px;
    margin-top: 10px;
		.conent{
      display: flex;
      .conent-l {
        box-sizing: border-box;
        width: 70%;
        border-right: 1px dashed #ccc;
        padding-right: 30px;
        .l-head {
          display: flex;
          margin-bottom: 10px;
          .head-title {
            font-size: 16px;
            font-weight: 600;
            margin-right: 20px;
          }
          .head-num {
            font-size: 14px;
            margin-left: 10px;
          }
        }
      }
      .conent-r {
        box-sizing: border-box;
        width: 30%;
        padding-left: 30px;
        line-height: 40px;
        img {
          vertical-align: middle;
        }
        span {
          display: inline-block;
          height: 40px;
          line-height: 40px;
        }
        .sigle-content {
          margin-right:20px;
          padding: 15px;
          min-width: 200px;
          border: 1px solid #d9d9d9;
          background-color: #f7f7f7;
          border-radius: 5px;
          .sigle-title {
            font-weight: 700;
            color: #101010;
          }
          // .sigle-name {
          //   overflow: hidden; /*超出部分隐藏*/
          //   text-overflow: ellipsis; /* 超出部分显示省略号 */
          //   white-space: nowrap; /*规定段落中的文本不进行换行 */
          //   width: 280px;
          // }
        }
      }
    }
	}
</style>
<style lang="less">
#accountDetails {
  .el-form-item {
    margin-bottom: 5px;
  }
}
</style>
