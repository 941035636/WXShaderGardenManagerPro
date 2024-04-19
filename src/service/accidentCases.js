import $apiUrl from '../api/apiUrl'
import $axios from 'axios';

export default class accidentCases {
    /**
     * 下载事故案例附件列表文件
     * @param {*} data
     * @returns
     */
    informationDownloadFile(caseId, fileId) {
        return $axios({
            method: 'GET',
            url: `${$apiUrl.INFORMATION_DOWNLOAD_FILE}/${caseId}/${fileId}`,
            responseType: 'arraybuffer',
        }).then(res => {
            return res
        })
    }

    /**
     * 类别查询
     * @returns
     */
    caseCategor() {
        return $axios({
            method: 'GET',
            url: $apiUrl.CASE_CATEGOR,
        }).then(res => {
            return res.data
        })
    }
    /**
     * 事故案例列表
     * @param {*} data
     * @returns
     */
    caseList(params) {
        return $axios({
            method: 'GET',
            url: $apiUrl.CASE_LIST_NEW,
            params,
        }).then(res => {
            return res.data
        })
    }

    /**
     * 获取服务器时间
     * @returns
     */
    getSysDate() {
        return $axios({
            method: 'GET',
            url: $apiUrl.GETDATE,
        }).then(res => {
            return res.data
        })
    }
}