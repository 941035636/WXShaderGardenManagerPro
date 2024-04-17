export function passwordFormat(password) {
  const md5 = require('js-md5')
  let md5Password = md5(password)
  let passArray = md5Password.split('')
  for (let i = 1; i < passArray.length; i += 2) {
    let temporary = passArray[i]
    passArray[i] = passArray[i - 1]
    passArray[i - 1] = temporary
  }
  let totalNumber = 0

  passArray.forEach((item) => {
    totalNumber += parseInt(item, 16)
  })
  let lastChar = totalNumber % 2
  let result = passArray.join('') + lastChar
  return result
}
