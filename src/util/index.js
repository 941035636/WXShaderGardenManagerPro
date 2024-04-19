/**
 * 是否有权限
 * @param {*} key
 */
 export default function isAuth (key) {
  let state = false;
	JSON.parse(sessionStorage.getItem('list')).find(item =>{
		if(item.key == key){
			state = true
		}
  })
  return state;
}