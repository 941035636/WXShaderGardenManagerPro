<template>
  <div :class="'logo-container-' + layout">
    <router-link to="">
      <!-- 这里是logo变更的位置 -->
      <vab-remix-icon v-if="logo" class="logo" :icon-class="logo" />
      <span
        class="title"
        :class="{ 'hidden-xs-only': layout === 'horizontal' }"
        :title="title"
      >
        <!-- {{ title }} -->
        <span class="title-l">企安查</span>
        <span class="title-r">隐患排查系统</span>
      </span>
    </router-link>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { logo } from '@/config'

export default {
  name: 'VabLogo',
  data() {
    return {
      title: this.$baseTitle,
    }
  },
  computed: {
    ...mapGetters({
      logo: 'settings/logo',
      layout: 'settings/layout',
    }),
  },
}
</script>
<style lang="scss" scoped>
@mixin container {
  position: relative;
  height: $base-top-bar-height;
  overflow: hidden;
  line-height: $base-top-bar-height;
  background: $base-menu-background;
}

@mixin logo {
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 5px;
  color: $base-title-color;
  vertical-align: middle;
}

@mixin title {
  display: inline-block;
  overflow: hidden;
  font-size: 1rem;
  // line-height: 55px;
  line-height: 25px;
  color: $base-title-color;
  text-overflow: ellipsis;
  // white-space: nowrap;
  vertical-align: middle;
  font-weight: 700;
  .title-l {
    text-align: left;
    display: block;
    color: $base-color-white;
  }
  .title-r {
    text-align: left;
    display: block;
    color: $base-color-cecece;
    font-weight: 500;
    font-size: 0.8rem;
    margin-top: -5px;
  }
}

.logo-container-horizontal {
  @include container;

  .logo {
    @include logo;
  }

  .title {
    @include title;
  }
}

.logo-container-vertical {
  @include container;

  height: $base-logo-height;
  line-height: $base-logo-height;
  text-align: center;

  .logo {
    @include logo;
  }

  .title {
    @include title;

    // max-width: calc(#{$base-left-menu-width} - 50px);
  }
}
</style>
