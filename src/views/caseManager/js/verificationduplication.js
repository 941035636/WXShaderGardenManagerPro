export default class verificationduplication {
    isRepeat(arr,index,val) {
        arr.splice(index,1); 
        let isPass = true;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                isPass = false;
                break;
            }
        }
        return isPass;
    }
}