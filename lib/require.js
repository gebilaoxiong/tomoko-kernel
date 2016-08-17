/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-25 01:30:19
 * @description   模块加载器
 */
var arrayJoin = Array.prototype.join,

  cache = {},

  prefixes = tomoko.prefixes;

/**
 * 加载模块
 */
module.exports = function() {
  var name = arrayJoin.call(arguments, '-'),
    i, len, names,
    pluginName, path;

  // 尝试从缓存中读取
  if (name in cache) {
    return cache[name];
  }

  // 尝试加载的模块名称
  names = [];

  for (i = 0, len = prefixes.length; i < len; i++) {

    try {
      pluginName = prefixes[i] + '-' + name;
      names.push(pluginName);
      path = require.resolve(pluginName);

      try {
        return cache[name] = require(path);
      }
      // 模块内部错误
      catch (e) {
        tomoko.log.error('load plugin [' + pluginName + '] error : ' + e.message);
      }
    }

    // 向上抛出
    catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }
    }
  }

  tomoko.log.error('unable to load plugin [' + names.join('] or [') + ']');
};



module.exports.cache = cache