/* 公共引入,勿随意修改,修改时需经过确认 */
import Vue from 'vue'
import './element'
// import './support'
import '@/assets/styles/vab.scss'
import '@/remixIcon'
import '@/colorfulIcon'
import '@/config/permission'
import '@/utils/errorLog'
import './awesIcon'
import VabPermissions from './permissions'
import Vab from '@/utils/vab'

Vue.use(Vab)
Vue.use(VabPermissions)
