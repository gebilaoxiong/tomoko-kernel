/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-21 10:27:04
 * @description   插件管理
 */

var arrayJoin = Array.prototype.join,

  log = require('./log');


/**
 * 插件加载
 */
var _ = module.exports = function() {
  var name = arrayJoin.call(arguments, '-'),
    cache = _.cache,
    prefixes = _.prefixes,
    names, i, len;

  // 从缓存中获取
  if (name in cache) {
    return cache[name];
  }

  names = [];

  // 尝试加载
  for (i = 0, len = prefixes.length; i < len; i++) {
    try {
      // 添加前缀
      var plugin = prefixes[i] + '-' + name;
      
      // 判断模块是否存在
      require.resolve(plugin);

      names.push(plugin);

      return cache[name] = require(plugin);
    } catch (e) {}
  }

  log.error('unable to load plugin [' + names.join('] or [') + ']');
}


// 缓存
_.cache = {};

// 前缀
_.prefixes = ['tomoko'];