<template>
  <el-dialog
    id="detail"
    title="投诉详情"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
  >
    <div class="box">
      <p>
        <span class="span-title">投诉人名称：</span>
        <span>{{ detail.name }}</span>
      </p>
      <p>
        <span class="span-title">投诉人社会信用代码：</span>
        <span>{{ detail.blCode }}</span>
      </p>
      <p>
        <span class="span-title">投诉时间：</span>
        <span>{{ detail.complainTime }}</span>
      </p>
      <p>
        <span class="span-title">被投诉人：</span>
        <span>
          {{ detail.respondentName }}（{{
            getResponseType(detail.respondentType)
          }}）
        </span>
      </p>
      <p>
        <span class="span-title">投诉内容及诉求：</span>
        <span>{{ detail.remark }}</span>
      </p>
      <p>
        <span class="span-title">投诉办理单位：</span>
        <span>{{ detail.complaintHandlingUnit }}</span>
      </p>
      <p>
        <span class="span-title">投诉人确认：</span>
        <span>{{ detail.complaintHandlingConfirm }}</span>
      </p>
      <p>
        <span class="span-title">投诉办理结果：</span>
        <span>{{ detail.complaintHandlingResult }}</span>
      </p>
    </div>
  </el-dialog>
</template>

<script>
import { findComplaintById } from '@/api/supervise'
import { mapGetters } from 'vuex'
export default {
  name: 'Details',
  data() {
    return {
      dialogVisible: false,
      detail: {},
      // 投诉确认
      confirmOptions: [],
    }
  },
  computed: {
    ...mapGetters({
      enumData: 'enums/getStrEnumAll',
    }),
  },
  methods: {
    initData(row) {
      this.findComplaintById(row.id)
      this.confirmOptions = this.enumData.SolveStatusEnums || []
      this.dialogVisible = true
    },
    getResponseType(type) {
      if (type) {
        let obj = this.enumData.RespondentEnum.find((item) => {
          return item.strCode == type
        })
        return obj.label
      }
    },
    async findComplaintById(id) {
      let { code, data } = await findComplaintById(id)
      if (code === '0000') {
        console.log(data)
        let complaintHandlingConfirm = this.confirmOptions.find(
          (it) => it.strCode === data.complaintHandlingConfirm
        )
        data.complaintHandlingConfirm = complaintHandlingConfirm
          ? complaintHandlingConfirm.label
          : ''
        data.complainTime = data.complainTime.split(' ')[0]
        this.detail = data
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#detail {
  .title {
    display: inline-block;
    width: 120px;
    text-align: left;
    font-weight: 700;
  }
  .row {
    line-height: 40px;
  }
  .box {
    padding: 0 50px;
  }
  .span-title {
    display: inline-block;
    font-weight: 700;
  }
}
</style>
