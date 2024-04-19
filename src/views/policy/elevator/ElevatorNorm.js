import PRODUCT from "../../../global/global-product"
const {
    PRODUCT_CODE_GD,
    PRODUCT_CODE_SZ,
    PRODUCT_CODE_GZ,
    PRODUCT_CODE_HB,
    PRODUCT_CODE_HN,
    PRODUCT_CODE_HLJ,
    PRODUCT_CODE_KM,
    PRODUCT_CODE_HBTS,
    PRODUCT_CODE_CC,
    PRODUCT_CODE_XJ,
    PRODUCT_CODE_QUANGUO,
    PRODUCT_CODE_HK,
    PRODUCT_CODE_NJ,
    PRODUCT_CODE_XA,
    PRODUCT_CODE_CQ,
    PRODUCT_CODE_LN,
} = PRODUCT
export default class ElevatorNorm {
    constructor(hideLoading) {
            if (hideLoading !== undefined) {
                this.hideLoading = hideLoading
            }
        }
        /**
         * @param {string} productCode 
         */
    template(productCode = '') { // 电梯模版
        const map = new Map()
            .set(PRODUCT_CODE_GD, this.eleTemplate1)
            .set(PRODUCT_CODE_XJ, this.eleTemplate2)
            .set(PRODUCT_CODE_SZ, this.eleTemplate3)
            .set(PRODUCT_CODE_QUANGUO, this.eleTemplate3)
            .set(PRODUCT_CODE_KM, this.eleTemplate3)
            .set(PRODUCT_CODE_HB, this.eleTemplate3)
            .set(PRODUCT_CODE_HN, this.eleTemplate3)
            .set(PRODUCT_CODE_GZ, this.eleTemplate3)
            .set(PRODUCT_CODE_HBTS, this.eleTemplate3)
            .set(PRODUCT_CODE_HK, this.eleTemplate3)
            .set(PRODUCT_CODE_NJ, this.eleTemplate3)
            .set(PRODUCT_CODE_HLJ, this.eleTemplate4)
            .set(PRODUCT_CODE_CC, this.eleTemplate5)
            .set(PRODUCT_CODE_XA, this.eleTemplate6)
            .set(PRODUCT_CODE_CQ, this.eleTemplate7)
            .set(PRODUCT_CODE_LN, this.eleTemplate8);


        return map.get(productCode)()
    }
    eleTemplate1() { // 广东
        return 1
    }
    eleTemplate2() { // 新疆
        return 2
    }
    eleTemplate3() { // 昆明,海口,唐山,河北,贵州,深圳,郑州,全国/南京
        return 3
    }
    eleTemplate4() { // 黑龙江
        return 4
    }
    eleTemplate5() { // 吉林
        return 5
    }
    eleTemplate6() { // 西安
        return 6
    }
    eleTemplate7() { // 重庆
        return 7
    }
    eleTemplate8() { // 辽宁
            return 8
        }
        /**
         * @param {object} form 
         */
    area(form = {}) { // 电梯的坐落区域校验
            const map = new Map()
                .set(PRODUCT_CODE_SZ, this.productSZ)
                .set(PRODUCT_CODE_GZ, this.productGZ)
                .set(PRODUCT_CODE_KM, this.productKM)
                .set(PRODUCT_CODE_HB, this.productHB)
                .set(PRODUCT_CODE_HBTS, this.productHBTS)
                .set(PRODUCT_CODE_HN, this.productHN)
                .set(PRODUCT_CODE_HLJ, this.productHLJ)
                .set(PRODUCT_CODE_CC, this.productCC)
                .set(PRODUCT_CODE_XJ, this.productXJ)
                .set(PRODUCT_CODE_GD, this.productGD)
                .set(PRODUCT_CODE_HK, this.productHK)
                .set(PRODUCT_CODE_NJ, this.productNJ)
                .set(PRODUCT_CODE_QUANGUO, this.productQUANGUO)
                .set(PRODUCT_CODE_XA, this.productXA)
                .set(PRODUCT_CODE_CQ, this.productCQ)
                .set(PRODUCT_CODE_LN, this.productLN);
            return map.get(form.productCode)(form)
        }
        /**
         * @param {object} form 
         */
    productGD(form = {}) { // 广东除深圳
            if (form.productCode == PRODUCT_CODE_GD && form.areaCodeFirst != '440000' || form.productCode == PRODUCT_CODE_GD && form.areaCodeFirst == '440000' && form.areaCodeSecond == '440300') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productSZ(form = {}) { // 深圳电梯
            if (form.productCode == PRODUCT_CODE_SZ && form.areaCodeFirst != '440000' || form.areaCodeSecond != '440300') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productGZ(form = {}) { // 贵州电梯

            if (form.productCode == PRODUCT_CODE_GZ && form.areaCodeFirst != '520000') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productHB(form = {}) { // 河北电梯
            if (form.productCode == PRODUCT_CODE_HB && form.areaCodeFirst != '130000' || form.productCode == PRODUCT_CODE_HB && form.areaCodeFirst == '130000' && form.areaCodeSecond == '130200') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productHBTS(form = {}) { // 河北唐山电梯
            if (form.productCode == PRODUCT_CODE_HBTS && form.areaCodeFirst != '130000' || form.areaCodeSecond != '130200') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productHN(form = {}) { // 河南电梯
            if (form.productCode == PRODUCT_CODE_HN && form.areaCodeFirst != '410000') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productHLJ(form = {}) { // 黑龙江电梯
            if (form.productCode == PRODUCT_CODE_HLJ && form.areaCodeFirst != '230000') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productCC(form = {}) { // 长春电梯
            if (form.productCode == PRODUCT_CODE_CC && form.areaCodeFirst != '220000') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productKM(form = {}) { // 昆明电梯
            if (form.productCode == PRODUCT_CODE_KM && form.areaCodeFirst != '530000') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productXJ(form = {}) { // 新疆电梯
            if (form.productCode == PRODUCT_CODE_XJ && form.areaCodeFirst != '650000') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productHK(form = {}) { // 新疆电梯
            if (form.productCode == PRODUCT_CODE_HK && form.areaCodeFirst != '460000') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productNJ(form = {}) { // 南京电梯|| form.areaCodeSecond !='440300' 
            if (form.productCode == PRODUCT_CODE_NJ && form.areaCodeSecond != '320100') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productXA(form = {}) { // 南京电梯|| form.areaCodeSecond !='440300' 
            if (form.productCode == PRODUCT_CODE_XA && form.areaCodeFirst != '610000') {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productQUANGUO(form = {}) { // 全国电梯
            if (form.productCode == PRODUCT_CODE_QUANGUO &&
                form.areaCodeFirst == '440000' ||
                form.areaCodeFirst == '520000' ||
                form.areaCodeFirst == '130000' ||
                form.areaCodeFirst == '410000' ||
                form.areaCodeFirst == '230000' ||
                form.areaCodeFirst == '220000' ||
                form.areaCodeFirst == '530000' ||
                form.areaCodeFirst == '650000' ||
                form.areaCodeFirst == '460000' ||
                form.areaCodeSecond == '320100'
            ) {
                return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
            } else {
                return "0000"
            };

        }
        /**
         * @param {object} form 
         */
    productCQ(form = {}) { // 重庆电梯|| form.areaCodeSecond !='500000' 
        if (form.productCode == PRODUCT_CODE_CQ && form.areaCodeFirst != '500000') {
            return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
        } else {
            return "0000"
        };
    }

    /**
     * @param {object} form 
     */
    productLN(form = {}) { // 辽宁电梯|| form.areaCodeSecond !='210000' 
        if (form.productCode == PRODUCT_CODE_LN && form.areaCodeFirst != '210000') {
            return "当前电梯坐落区域同产品销售区域不一致为不影响后续理赔，请您如实填写";
        } else {
            return "0000"
        };
    }

}