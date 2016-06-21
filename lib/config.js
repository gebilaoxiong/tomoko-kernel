/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-20 23:09:55
 * @description   配置对象
 */

var Configuration,

  util = require('../util');


Configuration = module.exports = util.define({

  /**
   * 初始化
   */
  init: function() {
    var me = this;

    me.options = {};

    // 多个配置
    if (arguments.length) {
      me.merge.apply(me, arguments);
    }
  },

  /**
   * 合并配置
   */
  merge: function() {
    var me = this,
      options = me.options,
      params = util.toArray(arguments);

    params.unshift(options);

    me.options = util.mergeOptions.applu(null, params);
  },

  /**
   * 赋值
   * @param {String}              propExp           属性表达式
   * @param {Mix}                 value             属性值
   *
   * @example
   * config.set('info.name', 'xy');
   */
  set: function(propExp, value) {
    var me = this;

    // 覆盖配置
    if (arguments.length == 1) {
      me.options = value;
      return;
    }

    util.set(me.options, propExp)
  },

  /**
   * 访问器
   * @param {String}              propExp           属性表达式
   * 
   * @example
   * config.get('info.name');
   */
  get: function(propExp) {
    return util.get(me.options, propExp);
  }

});
