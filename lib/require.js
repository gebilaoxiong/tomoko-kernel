/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-25 01:30:19
 * @description   模块加载器
 */
var arraySlice = Array.prototype.slice,

  cache = {};


/**
 * 加载模块
 */
module.exports = function() {
  var name = arraySlice.call(arguments, 0),
    prefixes = tomoko.prefixes,
    i, len, names,
    pluginName, path;

  // 尝试从缓存中读取
  if (name in modules) {
    return cache[name];
  }

  // 尝试加载的模块名称
  names = [];

  for (i = 0, len = prefixes.length; i < len; i++) {
    pluginName = prefixes[i] + '-' + key;
    names.push(pluginName);

    try {
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