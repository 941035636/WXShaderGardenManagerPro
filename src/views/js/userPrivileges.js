import Jurisdiction from "../../../static/data/Jurisdiction-data.json";
export default class privileges {
    users(list) { //获取整理用户权限
        let data = [];
        let arr1 = [];
        list.forEach(item => {
            if (item.functionType == 'N') { // functionType M是菜单N是按钮
                let items = {
                    functionName: item.functionName,
                    functionCode: item.functionCode
                }
                arr1.push(items);
            }
            if (item.functionType == 'M' && item.children) {
                item.children.forEach(item1 => {
                    if (item1.functionType == 'N') {
                        let items = {
                            functionName: item1.functionName,
                            functionCode: item1.functionCode
                        }
                        arr1.push(items);
                    }
                    if (item1.functionType == 'M' && item1.children) {
                        item1.children.forEach(item2 => {
                            if (item2.functionType == 'N') {
                                let items = {
                                    functionName: item2.functionName,
                                    functionCode: item2.functionCode
                                }
                                arr1.push(items);
                            }
                            if (item2.functionType == 'M' && item2.children) {
                                item2.children.forEach(item3 => {
                                    if (item3.functionType == 'N') {
                                        let items = {
                                            functionName: item3.functionName,
                                            functionCode: item3.functionCode
                                        }
                                        arr1.push(items);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
        Jurisdiction.data.forEach(item => {
            arr1.forEach(ele => {
                // if (ele.functionCode == item.code[0] || ele.functionCode == item.code[1] || ele.functionCode == item.code[2]) {
                //     item.label = true;
                //     data.push(item);
                // }
                if (item.code.some(v1 => v1 == ele.functionCode)) {
                    item.label = true;
                    data.push(item);
                }
            })
        })
        return data;
    }
}