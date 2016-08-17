/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-08-11 14:36:49
 * @description   路径管理
 */
var utils = require('./utils'),

  log = require('./log'),

  File = require('./File');



/**
 * 将资源映射到deploy路径
 * @param  {String}                     subpath                     相对于root的路径                
 */
exports.roadmap = function(subpath) {
  var map = tomoko.config.get('roadmap.path') || [],
    i, len, item,
    reg, matches, ret;

  for (i = 0, len = map.length; i < len; i++) {
    item = map[i];
    reg = item.reg;

    if (!reg) {
      log.error('[roadmap.' + map + '.' + i + '] missing property [reg].');
    }

    // 捕获路径中的字符
    if (!(matches = subpath.match(reg))) {
      continue;
    }

    ret = {};
    replaceProperties(item, matches, ret);

    return ret;
  }
};



function replaceProperties(source, matches, target) {
  var type = typeof source;

  // 引用类型
  if (type === 'object') {

    if (!target) {
      target = utils.isArray(source) ? [] : {};
    }

    utils.each(source, function(value, key) {
      target[key] = replaceProperties(value, matches);
    });

    return target;
  }
  // 字符串
  else if (type === 'string') {
    return replaceDefine(replaceMatches(source, matches));
  }

}


function replaceMatches(value, matches) {
  return value.replace(/\$(\d+|&)/g, function(all, $) {
    var key = $ === '&' ? '0' : $;

    return matches.hasOwnProperty(key) ? (matches[key] || '') : all;
  })
}


function replaceDefine(value) {
  return value.replace(/\[([^\/\]]+)\]/g, function(all, $){
    var val = tomoko.config.get($);

    if(val == null){
      log.error('undefined property [' + $ + '].');
    }

    return val;
  })
}