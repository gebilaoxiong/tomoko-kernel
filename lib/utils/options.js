/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 22:38:07
 * @description   初始化选项工具
 */
var _ = require('lodash'),

  lang = require('./lang'),

  options = exports;


/**
 * 合并选项
 * @param  {Object}                 dest                待合并的对象
 * @param  {Object}                 source              需要合并的对象
 * @param  {Function}               curstom             合并方法
 */
options.mergeOptions = function(dest, source, curstom /*optional*/ ) {
  return _.mergeWith(dest, source, curstom || mergeOptionCustomizer);
}


/**
 * 参数合并策略
 * @param  {Object}                 left                待合并的对象
 * @param  {Object}                 right               需要合并的对象 
 */
function mergeOptionCustomizer(left, right) {
  var leftType, rightType;

  // 右侧属性值为undefined 或者 null
  if (right == null) {
    return left;
  }

  leftType = lang.type(left);
  rightType = lang.type(right);

  if (
    // 左侧属性值为undefined 或者 null
    left == null ||
    (
      // 左侧数据不为引用类型
      (leftType !== 'object' && leftType !== 'array') &&
      // 右侧数据为引用类型
      (rightType === 'object' || rightType === 'array')
    )
  ) {
    return _.cloneDeep(right);
  }

  if (
    // 类型相同
    leftType === rightType &&
    // 且 都为引用类型
    (leftType === 'object' || leftType === 'array')
  ) {
    right = _.cloneDeep(right);

    return leftType === 'object' ?
      _.assign({}, left, right) : left.concat(right);
  }
}