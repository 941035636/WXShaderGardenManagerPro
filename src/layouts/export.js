/**
 * @description 公共布局及样式自动引入
 */

import Vue from 'vue'

const requireComponents = require.context('./components', true, /\.vue$/)
requireComponents.keys().forEach((fileName) => {
  const componentConfig = requireComponents(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})

const requireCommonComponents = require.context('@/components', true, /\.vue$/)
console.log(requireCommonComponents)
requireCommonComponents.keys().forEach((fileName) => {
  console.log(fileName)
  const componentConfig = requireCommonComponents(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})

const requireThemes = require.context('@/assets/styles/themes', true, /\.scss$/)
requireThemes.keys().forEach((fileName) => {
  require(`@/assets/styles/themes/${fileName.slice(2)}`)
})
