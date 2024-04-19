import productCategory2 from "../../static/data/productCategory2.json";
export function getProductCategory2(code){
  let { industryTwo } = productCategory2.find(item=>item.productCode === code) || {industryTwo:''}
  return industryTwo
}