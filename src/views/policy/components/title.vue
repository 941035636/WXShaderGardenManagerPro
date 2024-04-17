<template>
  <div id="titlesCla">
    <div class="futit">
      <!-- <span class="bg-c"></span> -->
      <div class="text-title pl10">
        <span class="ml20">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NewTitle',
    props: {
      label: {
        type: String,
        default: () => {
          return ''
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  #titlesCla {
    border-bottom: 1px solid #dfe0e2;
    // .bg-c {
    //   line-height: 20px;
    //   display: inline-block;
    //   width: 5px;
    //   height: 20px;
    //   vertical-align: bottom;
    //   background-color: #f5c277;
    // }
    .text-title {
      font-size: 18px;
      color: #3470ff;
      font-weight: 500;
      padding: 15px 0;
      background: #fff;
    }
  }
</style>
