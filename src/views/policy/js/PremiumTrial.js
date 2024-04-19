import PRODUCT from "../../../global/global-product"
import ELEVATOR from "../../../global/global-divisor-code"
const {
    PRODUCT_CODE_GD,
    PRODUCT_CODE_XJ,
    PRODUCT_CODE_SZ,
    PRODUCT_CODE_GZ,
    PRODUCT_CODE_HB,
    PRODUCT_CODE_HN,
    PRODUCT_CODE_CC,
    PRODUCT_CODE_XA,
    PRODUCT_CODE_CQ,
    PRODUCT_CODE_LN,

} = PRODUCT
const {
    ELEVATOR_TYPE_CODE1,
    ELEVATOR_TYPE_CODE2,
    ELEVATOR_TYPE_CODE3,
    ELEVATOR_TYPE_CODE4,
    ELEVATOR_TYPE_CODE7,
    ELEVATOR_TYPE_CODE8,
    ELEVATOR_TYPE_CODE9,
    ELEVATOR_TYPE_CODE10,
    ELEVATOR_TYPE_CODE11,
} = ELEVATOR
export default class PremiumTrial {
    constructor(hideLoading) {
            if (hideLoading !== undefined) {
                this.hideLoading = hideLoading
            }
        }
        /**
         * 
         * @param {string} productCode 
         * @param {string} elevatorType 
         * @param {string} height 
         * @param {string} weight 
         */
    type(productCode = "", elevatorType = "", height = "", weight = "") {
            if (productCode == PRODUCT_CODE_XJ || productCode == PRODUCT_CODE_CQ) { // 新疆
                if (elevatorType == '1') {
                    return ELEVATOR_TYPE_CODE9
                } else if (elevatorType == '2') {
                    return ELEVATOR_TYPE_CODE10
                } else if (elevatorType == '3') {
                    return ELEVATOR_TYPE_CODE11
                }
            } else if (productCode != PRODUCT_CODE_GD && productCode != PRODUCT_CODE_XA && productCode != PRODUCT_CODE_CQ) { // 除去广东
                if (elevatorType == '1') { //直梯
                    if (weight >= 1500) {
                        return ELEVATOR_TYPE_CODE1
                    } else if (weight < 1500) {
                        return ELEVATOR_TYPE_CODE2
                    }

                } else if (elevatorType == '2') { //扶梯
                    if (height <= 6) {
                        return ELEVATOR_TYPE_CODE3
                    } else if (height > 6) {
                        return ELEVATOR_TYPE_CODE4
                    }
                } else if (elevatorType == '3') { //货梯
                    return ELEVATOR_TYPE_CODE11
                }
            }
            return '9999'
        }
        /**
         * 
         * @param {string} productCode 
         */
    safety(productCode = "") {
            switch (productCode) {
                case PRODUCT_CODE_CC:
                    return '0000';
                case PRODUCT_CODE_XJ:
                    return '0000';
                default:
                    return '9999'
            }

        }
        /**
         * 
         * @param {Array} productCode 
         */
    elevatorVerify(eleList = []) {
        let ele = [];
        eleList.map(item => {
            let flagList = 0;
            let flag = true;
            for (let i = 0; i < ele.length; i++) {
                if (item.equipmentsCode == ele[i] || item.licenceNo == ele[i]) {
                    flag = false;
                    break
                }

            }
            if (flag) {
                for (let i = 0; i < eleList.length; i++) {
                    if (item.equipmentsCode && item.equipmentsCode == eleList[i].equipmentsCode) {
                        flagList++;
                    } else if (item.licenceNo && item.licenceNo == eleList[i].licenceNo) {
                        flagList++;
                    }
                    if (flagList == 2) {
                        break
                    }
                }
            }

            if (flagList == 2) {
                let licenceNo = item.equipmentsCode ? item.equipmentsCode : item.licenceNo;
                ele.push(licenceNo)
            }
        })

        return ele

    }

}