export default class numberHelper {
    constructor() {
        // ...
    }

    //  1-( ) 2-( ] 3-[ ) 4-[ ] 5- =a 6- （ ，+∞) 7-[ +∞)'
    static Range(paramNum, minNum, maxNum, rangeType) {

        let returnBool = false;
        switch (rangeType) {
            case 1:
                returnBool = (paramNum > minNum && paramNum < maxNum);
                break;
            case 2:
                returnBool = (paramNum > minNum && paramNum <= maxNum);
                break;
            case 3:
                returnBool = (paramNum >= minNum && paramNum < maxNum);
                break;
            case 4:
                returnBool = (paramNum >= minNum && paramNum <= maxNum);
                break;
            case 5:
                returnBool = (paramNum === minNum);
                break;
            case 6:
                returnBool = (paramNum > minNum && paramNum < maxNum);
                break;
            case 7:
                returnBool = (paramNum >= minNum && paramNum < maxNum);
                break;
        }

        return returnBool;
    }

    /**
   *
   * @desc   随机密码
   * @param  {Number} n
   * @return {String}
   */
  static RandomCipher(n) {
    var pasA_Z = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var pasNum = ['0','1','2','3','4','5','6','7','8','9']
    var pasCharacter = ['_','-','$','%','&','@','+','!']
    var password = '';
    var pasA_Z_Len = pasA_Z.length;
    var pasNum_Len = pasNum.length;
    var pasCharacter_Len = pasCharacter.length;
    let n1 = n - 3 - 1 // 字母
    let n2 = n - n1 - 3 // 特殊符号
    let n3 = n - n1 - n2 // 数字   
    for (var i=0; i<n1; i++){
        var x = Math.floor(Math.random()*pasA_Z_Len);
        password += pasA_Z[x];
    }
    for (var i=0; i<n2; i++){
        var x = Math.floor(Math.random()*pasCharacter_Len);
        password += pasCharacter[x];
    }
    for (var i=0; i<n3; i++){
        var x = Math.floor(Math.random()*pasNum_Len);
        password += pasNum[x];
    }
    return password;
  }
}
