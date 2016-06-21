/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-20 22:49:34
 * @description   语言扩展
 */

var _ = require('lodash'),

  arraySlice = Array.prototype.slice,

  lang = module.exports;


/**
 * 将source的成员混淆到target中
 * @type {Object}           target          
 * @type {Object}           source          
 */
lang.extend = _.assignIn;


/**
 * 类型判断函数
 */
'String Array Number Boolean Date Function RegExp Object'.split(' ')
  .forEach(function(method) {
    method = 'is' + _.capitalize(method);
    lang[method] = _[method];
  });



[
  /* 属性访问器 */
  'get',

  /* 属性赋值器 */
  'set',

  /* 转换为数组 */
  'toArray'
]
.forEach(function(method) {

  lang[method] = _[method];

});


/**
 * 类型定义工厂
 */
lang.define = function( /* parent, [partial]... */ ) {
  var parmas = arraySlice.call(arguments, 0),
    parent, klass;

  // parent
  if (lang.isFunction(parmas[0])) {
    parent = parmas.shift();
  }

  // 类型
  klass = function() {
    var me = this;
    me.init.apply(me, arguments);
  }

  // 继承基类
  if (parent) {
    proto.prototype = parent.prototype;
    klass.prototype = new proto();
    klass.prototype.constructor = klass;
    klass.super = parent;
  }

  // 扩展原型
  parmas.forEach(function(partial) {
    lang.extend(klass.prototype, partial);
  });

  return klass;
}

function proto() {}


/**
 * 合并配置参数
 */
lang.mergeOptions = function() {
  var options = {};

  _.toArray(arguments).forEach(function(partial) {
    options = _.mergeWith(options, partial, optionCustomizer)
  })

}

// 参数合并策略
function optionCustomizer(left, right) {
  if (_.isArray(left)) {
    return left.concat(right);
  }
}