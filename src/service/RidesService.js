import {post,get,patch,put,deletes}from '@/api/index'
import apiUrl from '@/api/apiUrl'
export default class Rides {
    constructor(){

    }
    /**
     * 设置rides缓存
     * @param {string} channel 渠道编码
     * @param {string} key key名字
     * @param {string} data 
     * @param {string} type 1 rides 2 数据库
     */ 
    setRides(data={},key="",channel='',type=""){
        return post(apiUrl.POSTRIDER+channel+'/'+key+'/'+type,data).then(res=>{
            return res
        })
    }
    /**
     * 获取rides缓存
     * @param {string} channel 渠道编码
     * @param {string} key key名字
     */ 
    getRides(key='',channel='',type=''){
        return get(apiUrl.GETRIDER+channel+'/'+key+'/'+type).then(res=>{
            return res
        })
    }

}