export default class getCascaderObj{
	getlable(val, opt){
		return val.map(function (value, index, array) {
			for (var itm of opt) {
				if (itm.value == value) { opt = itm.children; return itm; }
			}
			return null;
		});
	}
}