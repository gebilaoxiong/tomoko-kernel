/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-20 23:09:55
 * @description   配置
 */

var Configuration,

  util = require('./utils'),

  Abstract = require('./abstract.js');


Configuration = Abstract.extend({

  /**
   * 初始化
   */
  init: function(options) {
    var me = this;

    me.options = options || {};
  },

  /**
   * 合并配置
   */
  merge: function(options) {
    var me = this;

    util.mergeOptions(me.options, options);
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

    util.set(me.options, propExp, value);
  },

  /**
   * 访问器
   * @param {String}              propExp           属性表达式
   * 
   * @example
   * config.get('info.name');
   */
  get: function(propExp) {
    var me = this;

    return util.get(me.options, propExp);
  },

  /**
   * 获取配置对象
   */
  getOptions: function() {
    return this.options;
  }

})



module.exports = new Configuration();