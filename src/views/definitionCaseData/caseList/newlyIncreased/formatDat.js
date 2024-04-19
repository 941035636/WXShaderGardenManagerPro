/**
 * 封装数据处理方法，用于案件自定义配置;
 * 数据最终格式
 * {
 *    caseType:'',//  案件类型, 制式性资料,制式资料 0  案件资料 1
 *    filDesc:'',//资料描述
 *    litigation:'',//诉讼非诉讼，1诉讼，2非诉讼，3诉讼、非诉讼
 *    payType:'',//赔付方式
 *    required:'',//是否必填 0 非必填 1 必填
 *    type:'',/资料名
 *    typeCode:'',//资料编码
 *    parentCode:'',//父级的code
 *    sequence:'',//排序字段
 * }
 */

/**
 * //数组去重，字符串数组
 * @param {*} arr 
 * @returns 处理好的数组
 */

function noRepeat(arr) {
    var newArr = [...new Set(arr)]; //利用了Set结构不能接收重复数据的特点
    return newArr
};

/**
 * 扁平化数组，俺家资料弹窗列表展示、选择使用。
 * @param {*} arr 
 * @returns
 */
function flatData(arr) {
    let arrData = [];
    let arrList = JSON.parse(JSON.stringify(arr));
    arrList.forEach(item => {
        //status判断这个数据是否停用
        if (item.status == '0' && item.children) {
            item.children.forEach(e => {
                if (e.status == '0') {
                    arrData.push({
                        outermostTypeName: item.typeName,//案件类型名字
                        outermostTypeCode: item.typeCode,//案件类型code
                        outermostTypeVal: item.typeVal,//案件类型 制式资料 0  案件资料 1
                        outermostTypeDesc: item.typeDesc,//案件类型描述
                        outermostSequence: item.sequence,//排序字段
                        childLevelTypeName: e.typeName,//文件名称
                        childLevelTypeCode: e.typeCode,//文件code
                        childLevelTypeDesc: e.typeDesc,//文件描述
                        childLevelSequence: e.sequence,//文件排序字段
                        selected: false,//是否选中
                        mustShow: true,//是否必填是否展示
                        must: false,//是否必填选中
                    });
                };
            });
        };
    });
    return arrData;
};

/**
 * 一维数组处理成二维数组，渲染列表使用
 */
function processingData(arr) {
    let arrList = JSON.parse(JSON.stringify(arr));//深拷贝数组
    let arrData = [];
    arrList.forEach(item => {
        //selected是否选中的值
        if (item.selected) {
            arrData.push(item);
        };
    });
    let tree = [];
    arrData.forEach((_item, index) => {
        tree.push(_item.outermostTypeCode);
    });
    let newArr = this.noRepeat(tree);
    let ultimately = [];
    for (let key in newArr) {
        ultimately.push({
            outermostTypeCode: newArr[key],//案件类型code
            children: [],
        });
    };
    ultimately.forEach(_i => {
        arrData.forEach(_a => {
            if (_i.outermostTypeCode == _a.outermostTypeCode) {
                _i.outermostTypeName = _a.outermostTypeName;
                _i.outermostTypeVal = _a.outermostTypeVal
                _i.children.push(_a);
            }
        });
    });
    return ultimately;

};


/**
 * 
 * @param {*} arr 
 * @param {*} types 
 * @returns 
 */
function unique(arr, types = ['typeCode', 'payType','litigation']) {
    if (!Array.isArray(arr)) {
        throw new TypeError('type error!')
    }
    const result = []
    arr.forEach(item => {
        if (result.findIndex(t => types.every(type => t[type] === item[type])) === -1) {
            result.push(item)
        }
    })
    return result
}
/**
 *提交数据处理
 */
function submitData(arr,ializationList) {
    let arrList = JSON.parse(JSON.stringify(arr));//深拷贝数组
    let Tile = [];
    arrList.forEach(item => {
        item.jsonData.forEach(_i => {
            _i.children.forEach(_e => {
                Tile.push({
                    caseType: _e.outermostTypeVal,//案件类型, 制式性资料
                    filDesc: _e.childLevelTypeDesc,//资料描述
                    litigation: item.lawsuitName == '诉讼' ? '1' : '2',//诉讼非诉讼，1诉讼，2非诉讼，3诉讼、非诉讼
                    payType: item.typeName,//赔付方式
                    required: _e.must ? '1' : '0',//是否必填 0 非必填 1 必填
                    type: _e.childLevelTypeName,//资料名
                    typeCode: _e.childLevelTypeCode,//资料编码
                    parentCode: _i.outermostTypeCode,//父级的code
                    sequence: _e.childLevelSequence,//排序字段
                })
            });
        });
    });
    let outsideArr = [];
    Tile.forEach(_e => {
        ializationList.forEach(_type => {
            if(_e.parentCode == _type.typeCode){
                outsideArr.push(
                    {
                        caseType: _type.typeVal,//案件类型, 制式性资料
                        filDesc: _type.typeDesc,//资料描述
                        litigation: _e.litigation,//诉讼非诉讼，1诉讼，2非诉讼，3诉讼、非诉讼
                        payType:_e.payType,//赔付方式
                        required: _e.required,//是否必填 0 非必填 1 必填
                        type: _type.typeName,//资料名
                        typeCode: _type.typeCode,//资料编码
                        parentCode: _type.parentTypeCode,//父级的code
                        sequence: _type.sequence,//排序字段
                    }
                )
            }
        })
    });
    let allArr = [...Tile,...unique(outsideArr)];
    return allArr;
};


/**
 * 
 * @returns 
 * 根据code查询，名字
 */
function translation(code, ializationList) {
    let text = '';
    ializationList.forEach(item => {
        if (item.typeCode == code) {
            text = item.typeName;
        }
    });
    return text;
};

function setRank(arr, ializationList) {
    let tree = [];
    arr.forEach((item, index) => {
        tree.push(item.parentCode);
    });
    let newArr = noRepeat(tree);
    let ultimately = [];
    for (let key in newArr) {
        ultimately.push({
            outermostTypeCode: newArr[key],
            outermostTypeName: translation(newArr[key], ializationList),
            children: [],
        })
    };
    ultimately.forEach(_i1 => {
        arr.forEach(_i2 => {
            if(_i2.parentCode == _i1.outermostTypeCode){
                let childrenList = {
                    outermostTypeCode:_i2.parentCode,
                    outermostTypeVal: _i2.caseType,//案件类型 制式资料 0  案件资料 1
                    childLevelTypeName: _i2.type,//文件名称
                    childLevelTypeCode: _i2.typeCode,//文件code
                    childLevelTypeDesc: _i2.filDesc,//文件描述
                    childLevelSequence: _i2.sequence,//文件排序字段
                    selected: true,//是否选中
                    mustShow: true,//是否必填是否展示
                };
                if(_i2.required.constructor === Boolean){
                    childrenList.must = JSON.parse(_i2.required);
                }else if(_i2.required.constructor === String){
                    childrenList.must = _i2.required == '0' ? false : true
                }

                _i1.children.push(childrenList);
            };
        });
    });
    return ultimately;
};
/**
 * 案件资料配置列表数据回显处理事件
 */
function handleData(arr, items, ializationList) {
    let itemsData = items.filter(_key => _key.parentCode != 'LX');
    itemsData.forEach(item => {
        if (item.litigation == '1') {
            item.litigationName = '诉讼';
        } else {
            item.litigationName = '非诉讼';
        }
    });
    let tableArr = JSON.parse(JSON.stringify(arr));
    tableArr.forEach(item => {
        itemsData.forEach(i => {
            if (item.compensateWayName == i.payType && item.lawsuitName == i.litigationName) {
                item.jsonData.push(i);
            }
        })
    });
    tableArr.forEach(_i => {
        _i.jsonData = setRank(_i.jsonData, ializationList);
    });
    return tableArr
};

/*
 *案件资料配置，详情页面回显示事件 
 */

function detailsHandleData(arr, items, ializationList) {
    let itemsData = items.filter(_key => _key.parentCode != 'LX');//回显的数据
    itemsData.forEach(item => {
        if (item.litigation == '1') {
            item.litigationName = '诉讼';
        } else {
            item.litigationName = '非诉讼';
        }
    });
    let tableArr = JSON.parse(JSON.stringify(arr));
    tableArr.forEach(item => {
        itemsData.forEach(i => {
            if (item.compensateWayName == i.payType && item.lawsuitName == i.litigationName) {
                item.jsonData.push(i);
            }
        })
    });
    tableArr.forEach(_i => {
        _i.jsonData = setRank(_i.jsonData, ializationList);
    });
    tableArr.forEach(item => {
        if(item.jsonData && item.jsonData.length > 0){
            item.jsonData.forEach(_item => {
                items.forEach(i => {
                    if(_item.outermostTypeCode == i.typeCode){
                        _item.outermostTypeName = i.type
                    }
                })
            })
        }
    })
    return tableArr;
 };
 function detailsHandleData1(arr){
    let itemsData = [];
    arr.forEach(item => {
        item.children.forEach(_item => {
            itemsData.push({
                compensateWayName:item.payType,
                litigation:_item.litigation,
                lawsuitName:_item.litigation == '1' ? '诉讼' : '非诉讼',
                jsonData:_item.children
            })
        })
    })
    return itemsData;
 }


/**
 * 案件资料配置用合并单元格用到的函数
 * @param {*} arr 
 * @returns 
 */
function mannerDate(arr) {
    let ArrData = [];
    arr.forEach(_item => {
        if (_item.typeVal == '3') {
            ArrData.push({
                compensateWayName: _item.typeName,
                lawsuitName: '诉讼',
                jsonData: [],
                ..._item
            });
            ArrData.push({
                compensateWayName: _item.typeName,
                lawsuitName: '非诉讼',
                jsonData: [],
                ..._item
            })
        } else if (_item.typeVal == '1') {
            ArrData.push({
                compensateWayName: _item.typeName,
                lawsuitName: '诉讼',
                jsonData: [],
                ..._item
            });
        } else if (_item.typeVal == '2') {
            ArrData.push({
                compensateWayName: _item.typeName,
                lawsuitName: '非诉讼',
                jsonData: [],
                ..._item
            });
        }
    });
    return ArrData;
};

/**
 * 修改案件资料，数据回显示处理
 */
function amendClick(arr,flatData) {
    let flatlist = JSON.parse(JSON.stringify(flatData));//深拷贝数组
    let changeData = [];
    arr.forEach(item => {
        if(item.children && item.children.length > 0){
            item.children.forEach(i => {
                changeData.push(i);
            })
        };
    });
    changeData.forEach(item1 => {
        flatlist.forEach(item2 => {
            if(item2.childLevelTypeCode == item1.childLevelTypeCode){
                item2.selected = item1.selected;
                item2.must = item1.must;
            };
        });
    });
    return flatlist;
};
export default {
    noRepeat,
    flatData,
    processingData,
    submitData,
    handleData,
    mannerDate,
    amendClick,
    detailsHandleData,
    detailsHandleData1
}