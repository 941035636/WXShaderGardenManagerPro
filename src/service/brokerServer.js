import $apiUrl from '../api/apiUrl'
import $axios from 'axios';

export default class brokerServer {
  // 服务经纪添加
    addBroker(data) {
      return $axios({
        method: 'post',
        url: $apiUrl.ADDAGENT,
        data: data
      }).then(res => {
        console.log(res)
        return res;
      })
    }
  // 服务经纪列表
  brokerList(data) {
    return $axios({
      method: 'post',
      url: $apiUrl.AGENTQUERYLIST,
      data: data
    }).then(res => {
      console.log(res)
      return res;
    })
  }
  brokerDel(id){  
    return $axios({
      method: 'delete',
      url: $apiUrl.AGENTDEL+'/'+id,
    }).then(res => {
      console.log(res)
      return res;
    })
  }
  brokerPut(id,data){  
    return $axios({
      method: 'put',
      url: $apiUrl.AGENTALTER+'/'+id,
      data:data
    }).then(res => {
      console.log(res)
      return res;
    })
  }
  getDetail(id){
    return $axios({
      method: 'get',
      url: $apiUrl.AGENTDETAIL+'/'+id,
    }).then(res => {
      console.log(res)
      return res;
    })
  }

  //预约记录信息列表
 appointList(data){
    return $axios({
      method:'post',
      url:$apiUrl.APPOINTRECORD,
      data:data
    }).then(res=>{
      console.log(res);
      return res;
    })
  }

  //预约记录状态更新
  appointPut(id,data){  
    return $axios({
      method: 'put',
      url: $apiUrl.APPOINTUPDATE+'/'+id,
      data:data
    }).then(res => {
      console.log(res)
      return res;
    })
  }
  
  //预约记录
  getAgentNote(){  
    return $axios({
      method: 'get',
      url: $apiUrl.AGENTUNHANDLED,
    }).then(res => {
      console.log(res)
      return res;
    })
  }

  //预约记录状态更新
  stateRecord(id){  
    return $axios({
      method: 'put',
      url: $apiUrl.STATERECORD+'/'+id,
    }).then(res => {
      console.log(res)
      return res;
    })
  }

}
