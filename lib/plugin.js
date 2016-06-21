/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-21 10:27:04
 * @description   插件管理
 */

var arrayJoin = Array.prototype.join,

  log = require('./log');


// 缓存
require.cache = {};

// 前缀
require.prefixes = ['tomoko'];


/**
 * 插件加载
 */
require = module.exports = function() {
  var name = arrayJoin.call(arguments, '-'),
    cache = require,
    prefixes = require.prefixes,
    names, i, len;

  // 从缓存中获取
  if (name in cache) {
    return cache[name];
  }

  names = [];

  // 尝试加载
  for (i = 0, len = prefixes.length; i < len; i++) {
    // 添加前缀
    var plugin = prefixes[i] + '-' + name;
    // 路径
    var path = require.resolve(plugin);

    try {
      return cache[name] = require(path);
    } catch (e) {}
  }

  log.error('unable to load plugin [' + names.join('] or [') + ']');
}