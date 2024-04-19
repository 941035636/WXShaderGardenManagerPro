/**
 * 处理传入接口时行业的格式
 * @param {*} arr1  所有行业集合
 * @param {*} arr   页面选择的行业集合（可多选）
 * @returns
 */
 export function getIndustrys(arr1, arr=[]) {
    let list = []
   arr.forEach((item) => {
      if (arr1.find((it) => it.itemValue == item[0])) {
        list.push({
          industryName: arr1.find((it) => it.itemValue == item[0]).itemText+','+ arr1.find((it) => it.itemValue == item[1]).itemText,
          industryCode: arr1.find((it) => it.itemValue == item[1]).itemValue,
        })
      }
    })
    return list
  }
 export function getIndustryName(arr1, arr) {
    let list = []
   arr.forEach((item) => {
  
        list.push([
         item.slice(0,2),
         item,
        ])

    })
    return list
  }
  /**
   * 处理传入接口时枚举类的格式
   * @param {*} arr1  所有枚举类集合
   * @param {*} arr   页面选择的code集合
   * @param {*} other   其他信息
   * @returns
   */
  export function getEnumslist(arr1, arr, other) {
    let list = []
    arr.forEach((item) => {
      if (item == '07') {
        list.push({
          serviceAccidentTypeName: other,
          serviceAccidentType: '07',
        })
      } else if (arr1.find((it) => it.strCode == item)) {
        list.push({
          serviceAccidentTypeName: arr1.find((it) => it.strCode == item).label,
          serviceAccidentType: arr1.find((it) => it.strCode == item).strCode,
        })
      }
    })
    return list
  }