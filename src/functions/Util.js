/**
 * Iterableなオブジェクトだかチェックします
 * https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
 * 
 * @param {*} obj 
 * @returns 
 */
exports.isIterable =function(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}
