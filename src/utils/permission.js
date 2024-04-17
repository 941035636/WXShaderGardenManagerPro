import store from '@/store'

/**
 * @description 检查权限
 * @param value
 * @returns {boolean}
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters['user/permissions']
    const permissionPermissions = value

    return permissions.some((role) => {
      return permissionPermissions.includes(role)
    })
  } else {
    return false
  }
}
// 用来控制按钮的显示
export function hasBtnPermission(permission) {
  const myBtns = store.getters['user/buttons']
  console.log(myBtns, permission, '看看权限校验这个值是什么');
  return myBtns.findIndex((item) => item.functionUrl === permission) > -1
}
