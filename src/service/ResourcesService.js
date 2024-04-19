import {post,get,deletes} from '@/api/index'
import apiUrl from '@/api/apiUrl'
export default class ResourcesService{

  // 构造方法
  constructor(){

  }

  /**
   * 文件上传 地址 用于element upload直接给action参数的
   * @param {string} applicationName 服务名称
   * @param {string} businessTypCode 业务code
   * @param {string} free 是否自由访问
   */
  uploadFileUrl(applicationName = '', businessTypCode = '', free = 1){
    return apiUrl.BATCH_UPLOAD+'?applicationName='+applicationName+'&businessTypeCode='+businessTypCode+'&free='+free
  }

  /**
   * 文件上传
   * @param {string} applicationName 服务名称
   * @param {string} businessTypeCode 业务code
   * @param {string} free 是否自由访问
   * @param {string} files 文件
   */
  uploadFile (applicationName = '', businessTypeCode = '', free = 1, files) {
    console.log(files)
    var formData = new FormData();
    // 多个文件 给formdata添加多个files
    for(var i = 0;i<files.length;i++){
      formData.append("files", files[i]);
    }
    return post(apiUrl.BATCH_UPLOAD+'?applicationName='+applicationName+'&businessTypeCode='+businessTypeCode+'&free='+free, formData).then(res => {
      if(res.code == '0000'){
        return res;
      }
    })
  }

  /**
   * 展示本地上传文件
   * @param {file} file 
   */
  downloadOViewLocationFile(file, isDownload = false){
    try{
      let href = this.getObjectURL(file);
      if(isDownload){
        this.downLoadA(href, file.name)
        // window.location.href = href;
        return true;
      }
      return href;
    }catch(error){
      console.log("view file error")
    }
    return "error";
  }

  /**
   * 下载或在线查看文件 后台所返回的地址 调用当前函数
   * @param {string} url 后台返回的地址参数
   * @param {string} applicationName 服务名称
   * @param {string} businessTypCode 业务code
   * @param {string} businessDataTag 标示
   * @param {string} free 是否自由访问
   * @param {string} fileId 文件id
   * @param {string} isDownload 是否下载
   */
  // applicationName = '', businessTypCode = '', businessDataTag = '', free = 1, fileId
  // url res-svc/v3/download?applicationName=服务名......
  downloadOrViewFile (url = '', isDownload = false) {
    /*
      如果碰到循环 暂时这样只想到这种用法
        this.clauseList.forEach(async item => {
          let reso = await this.resourcesService.downloadOrViewFile(item.resourceId);
          item['filePath'] = reso.url;
        })
    */
    // 返回参数
    let returnData = {
      "code": "0000",
      "url": ""
    };
    let urlData = this.getUrlParams(url);
    if(urlData.free == '1'){ // 不需要权限的时候 
      var str = url.substr(url.indexOf("?"),url.length);
      return new Promise((resolve, reject)=>{
        try{
          let href = apiUrl.DOWNLOAD_FILE + str;

          if(isDownload){
            returnData['code'] = this.downLoadA(href, '');
          }else{
            returnData.url = href;
          }
          resolve(returnData);
        }catch(error){
          returnData.code = '9999';
          console.log("get downloadOrviewFile promise error")
          resolve(error);
        }
      })
    }else{
      // 需要权限
      let params = 
      {
        "applicationName": urlData.applicationName,
        "businessTypeCode": urlData.businessTypeCode,
        "businessDataTag": urlData.businessDataTag,
        "free": urlData.free,
        "fileId": urlData.fileId
      }
      return new Promise((resolve, reject)=>{
        get(apiUrl.DOWNLOAD_FILE, params, null, {'responseType': 'blob'}, true).then(res => {
          console.log(res);
          try{
              let href = this.getObjectURL(res.data);
              if(isDownload){
                // 获取文件名 下载
                let fileName = this.getFileName(res.headers['content-disposition']);
                returnData['code'] = this.downLoadA(href, fileName);
              }else{
                returnData['url'] = href;
              }
              resolve(returnData)
          }catch(error){
            returnData['code'] = '9999';
            resolve(returnData);
          }
        }).catch( error=>{
          reject(error)
        })
      })
      
    }
  }
  /**
   * 导出
   * @param {string} url 后台返回的地址参数
   * @param {string} isDownload 是否下载
   */
  // applicationName = '', businessTypCode = '', businessDataTag = '', free = 1, fileId
  // url res-svc/v3/download?applicationName=服务名......
  exportsViewFile (url = '', data = '', isDownload = true) {
   
    // 返回参数
    let returnData = {
      "code": "0000",
      "url": ""
    };
      return new Promise((resolve, reject)=>{
        get(url, data, null, {'responseType': 'blob'}, true).then(res => {
          console.log(res);
          try{
              let href = this.getObjectURL(res.data);
              if(isDownload){
                // 获取文件名 下载
                let fileName = this.getFileName(res.headers['content-disposition']);
                returnData['code'] = this.downLoadA(href, fileName);
              }else{
                returnData['url'] = href;
              }
              resolve(returnData)
          }catch(error){
            returnData['code'] = '9999';
            reject(returnData);
          }
        }).catch( error=>{
          reject(error)
        })
      })
      
  }
  
  // URL截取后面的字符串转换成对象
  getUrlParams(url) {
    var obj = new Object();
    if(url.indexOf("?") != -1) {//判断？后面是否有字符
      var str = url.substr(url.indexOf("?")+1,url.length);//从第一个字符开始截取
      var strs = str.split("&");//以&符号分离
      for(var i = 0; i < strs.length; i++) {
        //decodeURI：将字符解码
        //decodeURIComponent：加密
        obj[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }
    return obj;
  }

  /**
   * 获取文件名称
   * @param {string} str 
   */
  getFileName(str){
    // 获取等于下标
    let fileName = str.substr(str.indexOf("=")+1,str.length);
    return decodeURIComponent(fileName)//从第一个字符开始截取
  }
  /**
   * 获取文件展示地址
   * @param {blob} file 文件blob
   */
  getObjectURL(file) {
    let url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file);            
        } catch (error) {
          console.log("not webkiturl")
        }
    } else if (window.URL != undefined) { // mozilla(firefox)
      try {
        url = window.URL.createObjectURL(file);
      } catch (error) {
        console.log("not url")
      }
    }
    return url;
  }

  /**
   * 通过axios获取数据然后通过a标签下载
   * @param {string}} href 
   * @param {string} types 
   * @param {string} fileName
   */
  downLoadA(href, fileName){
    try{
      let downloadElement = document.createElement("a");
      downloadElement.href = href;
      if(fileName){
        downloadElement.download = fileName; //下载后文件名
      }
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
      return "0000";
    }catch(error){
      return "9999";
    }
  }
  exportFile(url,data) {
    return new Promise((resolve, reject)=>{
      get(url, data, null, {'responseType': 'blob'}, true).then(res => {
        try{
            let fileName = this.getFileName(res.headers['content-disposition']);
            let href = this.getObjectURL(res.data);
            this.downLoadA(href, fileName);
            resolve(res)
        }catch(error){
          reject(error);
        }
      }).catch( error=>{
        reject(error)
      })
    })
  }
}

