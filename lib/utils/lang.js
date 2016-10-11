/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 21:55:21
 * @description   语言扩展
 */
var _ = require('lodash'),

  objectToString = Object.prototype.toString,

  typeRe = /^\[object\s([^\]]+)\]$/,

  lang = exports;


/**
 * 将source的成员混淆到target中
 * @type {Object}                    target             待合并的对象 
 * @type {Object}                    source             需要合并的对象
 */
lang.extend = _.assignIn;


/**
 * forEach
 */
lang.each = _.each;


/**
 * inArray
 */
lang.inArray = _.findIndex;


/**
 * 将字符串转义为正则pattern
 */
lang.escapeReg = _.escapeRegExp;


/**
 * 类型判断函数
 */
'String Array Number Boolean Date Function RegExp Object'.split(' ')
  .forEach(function(method) {
    method = 'is' + _.capitalize(method);
    lang[method] = _[method];
  });


/**
 * 判断数据类型
 * @param  {mixed}                    input             需要判断类型的数据
 */
lang.type = function(input) {
  return objectToString
    .call(input)
    .replace(typeRe, '$1')
    .toLowerCase();
}



_.each([
  /* 属性访问器 */
  'get',

  /* 属性赋值器 */
  'set',

  /* 转换为数组 */
  'toArray'
], function(method) {

  lang[method] = _[method];

});


/**
 * 字符串处理:pad
 * @param  {String}                   str               需要处理的字符串
 * @param  {Number}                   len               长度
 * @param  {String}                   fill              填充文本
 * @param  {Boolean}                  pre               填充方向 默认为左
 */
lang.pad = function(str, len, fill, pre) {

  if (str.length < len) {
    // 填充文本
    fill = Array(len).join(fill || ' ');

    if (pre) {
      str = (fill + str).slice(-len);
    } else {
      str = (str + fill).substring(0, len);
    }
  }

  return str;
}


/**
 * 将字符串进行正则转义
 * @param  {String}                   input             需要转义的字符串
 */
lang.escapeReg = function(input) {
  return input.replace(/[\.\\\+\*\?\[\^\]\$\(\){}=!<>\|:\/]/g, '\\$&');
}