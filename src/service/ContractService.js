import $apiUrl from '../api/apiUrl'
import { post, get} from '../api/index'
export default class ContractService {
    searchContract(data) {
        return post($apiUrl.SEARCH_CONTRACT,data).then(res=>{
            return res;
		})
    }
    sendContract(data) {
        return post($apiUrl.SEND_CONTRACT,data).then(res=>{
            return res;
		})
    }

}
