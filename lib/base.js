/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 21:33:02
 * @description   基础类型
 */
var Abstract = require('./abstract.js'),

  util = require('./utils'),

  hasOwnProperty = Object.prototype.hasOwnProperty,

  Base;

Base = module.exports = Abstract.extend({

  /**
   * 初始化类型
   * @param  {Object}               config              初始化选项
   */
  init: function(config) {
    var me = this;

    mergeOptions(me, config);
  }

});


/**
 * 合并选项
 * @param  {Object}                  dest   
 * @param  {Object}                  source             需要合并的对象
 */
function mergeOptions(dest, source) {
  var propName, prop;

  for (propName in source) {
    prop = source[propName];


    if (
      // 不能是原形链上的成员
      !hasOwnProperty.call(source, propName) ||
      // 不能重写方法成员
      util.isFunction(prop)
    ) {
      continue;
    }

    dest[propName] = prop;
  }
}