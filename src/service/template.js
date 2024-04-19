import $apiUrl from '../api/apiUrl';
import $axios from 'axios';

export default class templaet {
    /*
    *    新增自定义模板
    */
    templateAdd(form) {
        return $axios({
            method: 'post',
            url: $apiUrl.CUSTOM_TEMPLATE,
            data: form
        }).then(res => {
            return res;
        })
    }
    /*
    *    新增自定义模板
    */
    templateUpdate(form) {
        return $axios({
            method: 'put',
            url: $apiUrl.CUSTOM_TEMPLATE,
            data: form
        }).then(res => {
            return res;
        })
    }
    /*
    *   删除自定义模板
    */
    templateDelete(id) {
        return $axios({
            method: 'delete',
            url: $apiUrl.CUSTOM_TEMPLATE+'/'+id,
            data: ''
        }).then(res => {
            return res;
        })
    }
    /*
    *   查询自定义模板
    */
    templateDetails(id) {
        return $axios({
            method: 'get',
            url: $apiUrl.CUSTOM_TEMPLATE_DETAILS+'/'+id,
            data: ''
        }).then(res => {
            return res;
        })
    }
    /*
    *    查询模板列表
    */
    templateList(form) {
        return $axios({
            method: 'get',
            url: $apiUrl.CUSTOM_TEMPLATE,
            params: form
        }).then(res => {
            return res;
        })
    }
    
    /*
     *  预览自定义模板
     * form  
     * templateCode 模板编号
     * ex 文件名
    */
    templatePreview(form = {},templateCode = '',ex = new Date().getTime()) {
        return $axios({
            method: 'post',
            url: $apiUrl.CUSTOM_TEMPLATE_LOAD + templateCode+'/' + ex,
            data: form,
            responseType: "arraybuffer"
        }).then(res => {
            let blob = new Blob([res.data]);
            let str = res.headers['content-disposition'];
            const fileName = str.substr(str.indexOf("=")+1,str.length);
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = decodeURIComponent(fileName);
            link.click();
            window.URL.revokeObjectURL(link.href);
            return res;
        })
    }
    /*
    *    操作日志
    */
    logList(form) {
        return $axios({
            method: 'get',
            url: $apiUrl.CUSTOM_LOG,
            params: form
        }).then(res => {
            return res;
        })
    }
    
    
} 