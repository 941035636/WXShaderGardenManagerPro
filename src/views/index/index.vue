<template>
  <div class="pb20 bgc">
    <Statis></Statis>
    <Dynamic></Dynamic>
  </div>
</template>

<script>
  import Statis from './components/Statis'
  import Dynamic from './components/Dynamic'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Statis,
      Dynamic,
    },
    computed: {
      ...mapGetters({
        accountType: 'user/accountType',
      }),
    },
  }
</script>

<style lang="scss">
  .bgc {
    background-color: #f6f8f9;
  }
</style>
