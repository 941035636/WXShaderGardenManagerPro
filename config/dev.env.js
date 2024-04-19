var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_TESHE: '"http://gw-dev.jiangtai.com/sequip-svc"', 
  ROOT_ROLECODE: '"19RL1725877804115168823"', 
  ROOT_CASE_CLOSED_CODE: '"19RL1725877804115167653"', 

})
