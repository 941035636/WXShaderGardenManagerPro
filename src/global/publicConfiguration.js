export default class takeBack {
    switchs(show) {
        if (show) {
            let data = {
                'title': '展开',
                'icon': 'el-icon-arrow-down',
                'show': false
            }
            return data;
        } else {
            let data = {
                'title': '收回',
                'icon': 'el-icon-arrow-up',
                'show': true
            }
            return data;
        }
    }
}