import apiUrl from '@/api/apiUrl.js'
import { post, get } from '@/api/index.js'
class ProductConfig {
    constructor () {}
    // 新增产品
    addOrUpdata(data) {
        return post(apiUrl.PRODUCTINSERTORUPDATA,data).then(res=>{
            return res
        })
    }
    // 获取产品详情
    getProductDetails(id) {
        return get(apiUrl.GETPRODUCTDETAILS + id).then(res=>{
            return res
        })
    }
    // 产品列表查询
    getList(data) {
        return post(apiUrl.PRODUCTGETLIST,data).then(res=>{
            return res
        })
    }
    // 新增属性
    addConfig(data) {
        return post(apiUrl.CONFIGINSERTORUPDATE,data).then(res=>{
            return res
        })
    }
    // 获取属性详情
    getConfigDetails(id,flag) {
        return get(apiUrl.GETPRODUCTVONFIGDETAILS+id + '/' + flag).then(res=>{
            return res
        })
    }
    // 列表属性
    getProdConfigList(data) {
        return post(apiUrl.PRODUCTCONDIGGETLIST,data).then(res=>{
            return res
        })
    }
    // 产品详情
    getProdConfigAllDetails(data) {
        return get(apiUrl.GETPRODUCTVONFIGALLDETAILS,data).then(res=>{
            return res
        })
    }
    // 删除属性
    deletsEmpty(data) {
        return post(apiUrl.POSTEMPTY,data).then(res=>{
            return res
        })
    }
}
export default ProductConfig