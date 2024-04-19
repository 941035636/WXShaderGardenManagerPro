export default class Menulist {
    userlists(userData) {
       
        localStorage.setItem('loginAccount', userData.loginAccount);
        sessionStorage.setItem('userName', userData.userName);
        sessionStorage.setItem('userCode', userData.userCode);
        sessionStorage.setItem('authorization', userData.token);
        sessionStorage.setItem('refreshToken', userData.refreshToken);
        sessionStorage.setItem('tokenExpireTime', userData.tokenExpireTime);
        sessionStorage.setItem('userId', userData.userId);
        sessionStorage.setItem('provinceCode', userData.provinceCode);
        sessionStorage.setItem('productCode', userData.productCode);
        sessionStorage.setItem('branchCode', userData.branchCode);
        sessionStorage.setItem('branchName', userData.branchName);
        let item = [];
        // for (let i = 0; i < userData.resourceVMS.length; i++) {
        //     if (userData.resourceVMS[i].functionType == 'M') {
        //         if (userData.resourceVMS[i].children) {
        //             var allN = true;
        //             var ki = 0;
        //             for (var g = 0; g < userData.resourceVMS[i].children.length; g++) {
        //                 ki++;
        //                 if (userData.resourceVMS[i].children[g].functionType == 'M') { //判断二级菜单里是否有全是按钮的菜单
        //                     allN = false;
        //                 }
        //             }
        //             if (ki == userData.resourceVMS[i].children.length) {
        //                 if (allN) {
        //                     item.push({
        //                         icon: userData.resourceVMS[i].icon,
        //                         index: userData.resourceVMS[i].functionHierarchy,
        //                         title: userData.resourceVMS[i].functionName,
        //                         functionCode: userData.resourceVMS[i].functionCode
        //                     })
        //                 } else {
        //                     let secondMenu = []; //二级菜单list
        //                     for (var j = 0; j < userData.resourceVMS[i].children.length; j++) {
        //                         if (userData.resourceVMS[i].children[j].functionType == 'M') {
        //                             secondMenu.push({
        //                                 index: userData.resourceVMS[i].children[j].functionHierarchy,
        //                                 title: userData.resourceVMS[i].children[j].functionName,
        //                                 functionCode: userData.resourceVMS[i].children[j].functionCode
        //                             })
        //                         }
        //                     }
        //                     item.push({
        //                         icon: userData.resourceVMS[i].icon,
        //                         index: JSON.stringify(i),
        //                         title: userData.resourceVMS[i].functionName,
        //                         functionCode: userData.resourceVMS[i].functionCode,
        //                         subs: secondMenu
        //                     })
        //                 }
        //             }
        //         }else{
        //             item.push({
        //                 icon: userData.resourceVMS[i].icon,
        //                 index: userData.resourceVMS[i].functionHierarchy,
        //                 title: userData.resourceVMS[i].functionName,
        //                 functionCode: userData.resourceVMS[i].functionCode
        //             })
        //         }
        //     }
        // }
        let arr = userData.resourceVMS[userData.resourceVMS.length - 1].children;
        for (let i = 0; i < arr.length; i++) {
            
            if (arr[i].functionType == 'M') {
                
                if (arr[i].children) {
                    var allN = true;
                    var ki = 0;
                    for (var g = 0; g < arr[i].children.length; g++) {
                        ki++;
                        if (arr[i].children[g].functionType == 'M') { //判断二级菜单里是否有全是按钮的菜单
                            allN = false;
                        }
                    }
                    if (ki == arr[i].children.length) {
                        if (allN) {
                            item.push({
                                icon: arr[i].icon,
                                index: arr[i].functionHierarchy ? arr[i].functionHierarchy : String(i),
                                title: arr[i].functionName,
                                functionCode: arr[i].functionCode
                            })
                        } else {
                            let secondMenu = []; //二级菜单list
                            for (var j = 0; j < arr[i].children.length; j++) {
                                if (arr[i].children[j].functionType == 'M') {
                                    if (arr[i].children[j].children) {
                                        var third = true;
                                        var thirds = 0;
                                        for (var q = 0; q < arr[i].children[j].children.length; q++) {
                                            thirds++;
                                            if (arr[i].children[j].children[q].functionType == 'M') { //判断三级菜单里是否有全是按钮的菜单
                                                third = false;
                                            }
                                        }
                                        if (thirds == arr[i].children[j].children.length) {
                                            if (third) {
                                                secondMenu.push({
                                                    index: arr[i].children[j].functionHierarchy ? arr[i].children[j].functionHierarchy : String(j),
                                                    title: arr[i].children[j].functionName,
                                                    functionCode: arr[i].children[j].functionCode
                                                })
                                            } else {
                                                let thirdMenu = []; //三级菜单list
                                                for (var o = 0; o < arr[i].children[j].children.length; o++) {
                                                    if(arr[i].children[j].children[o].functionType === 'M') {
                                                        thirdMenu.push({
                                                            index: arr[i].children[j].children[o].functionHierarchy ? arr[i].children[j].children[o].functionHierarchy : String(o),
                                                            title: arr[i].children[j].children[o].functionName,
                                                            functionCode: arr[i].children[j].children[o].functionCode
                                                        })
                                                    }
                                                    
                                                }
                                                secondMenu.push({
                                                    index: arr[i].children[j].functionHierarchy ? arr[i].children[j].functionHierarchy : String(j),
                                                    title: arr[i].children[j].functionName,
                                                    functionCode: arr[i].children[j].functionCode,
                                                    sub: thirdMenu
                                                })
                                            }
                                        }
                                    } else {
                                        secondMenu.push({
                                            index: arr[i].children[j].functionHierarchy ? arr[i].children[j].functionHierarchy : String(j),
                                            title: arr[i].children[j].functionName,
                                            functionCode: arr[i].children[j].functionCode
                                        })
                                    }
                                }
                            }
                            item.push({
                                icon: arr[i].icon,
                                index: arr[i].functionHierarchy ? arr[i].functionHierarchy : String(i),
                                title: arr[i].functionName,
                                functionCode: arr[i].functionCode,
                                subs: secondMenu
                            })
                        }
                    }
                    
                } else {
                    item.push({
                        icon: arr[i].icon,
                        index: arr[i].functionHierarchy ? arr[i].functionHierarchy : String(i),
                        title: arr[i].functionName,
                        functionCode: arr[i].functionCode
                    })
                }
            }
        }
        return item;
    }
}