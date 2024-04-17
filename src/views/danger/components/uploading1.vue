<template>
  <div class="box">
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :action="this.baseURL + `/files/v1/upload/file`"
      name="file"
      :headers="headers"
      :limit="9"
      :data="upLoadData"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-remove="fileRemove"
      accept=".jpg, .jpeg, .png, PNG"
      :on-exceed="onExceed"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
import { baseURL } from '@/config'
import store from '@/store'

export default {
  data() {
    return {
      baseURL: baseURL,
      fileList: [],
      headers: {
        authorization: store.getters['user/accessToken'],
      },
      upLoadData: {},
    }
  },
  methods: {
    async handleAvatarSuccess(res, file) {
      if (res.code == '0000') {
        await this.fileList.push({
          uid: file.uid,
          url: URL.createObjectURL(file.raw),
          id: res.data.id,
        })
        this.transmit()
      }
    },
    fileRemove(file, fileList) {
      this.fileList = fileList
      this.transmit()

      //       this.fileList = this.fileList.filter((item) => {
      //   return item.uid != file.uid
      // })
    },
    // 图片上传
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('单文件上限10MB!')
      }
      return isLt10M
    },
    onExceed() {
      // this.$message.warning('最多支持10个附件')
    },
    transmit() {
      let arrList = []
      this.fileList.forEach((res) => {
        arrList.push(res.id)
      })
      this.$emit('imageData', arrList)
    },
    delete() {
      console.log('10101010')
      this.fileList = []
    },
  },
}
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  .buttonClass {
    width: 200px;
    height: 100px;
    background-color: aqua;
  }
}
</style>

