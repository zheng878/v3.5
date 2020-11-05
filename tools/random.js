exports.random = (array) => {
  let i = Math.floor(Math.random() * array.length)
  return array[i]
}