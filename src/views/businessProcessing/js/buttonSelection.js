export default class buttonSelection {
    Accessarea(options22, provinceCode) {
        let options2 = JSON.parse(JSON.stringify(options22))
        let provincecode = provinceCode.slice(0, 2) + '0000';
        let cityCode = provinceCode.slice(0, 4) + '00';
        if (provincecode == '000000') {
            return options2;
        } else {
            for (var i = 0; i < options2.length; i++) {
                options2[i].disabled = true;
                if (provincecode == options2[i].value) {
                    options2[i].disabled = false;
                    if (cityCode.slice(2, 4) != '00') {
                        for (var j = 0; j < options2[i].children.length; j++) {
                            options2[i].children[j].disabled = true;
                            if (cityCode == options2[i].children[j].value) {
                                options2[i].children[j].disabled = false;
                            } else {
                                options2[i].children[j].children = [];
                            }
                        }
                    }
                } else {
                    options2[i].children = [];
                }
                if (provincecode == '440000') {
                    if (provincecode == options2[i].value) {
                        for (var l = 0; l < options2[i].children.length; l++) {
                            if (options2[i].children[l].value == '440300') {
                                options2[i].children[l].disabled = true;
                                options2[i].children[l].children = [];
                            }
                        }
                    }
                }
            }
            return options2;
        }
    }
}