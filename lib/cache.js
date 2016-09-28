/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-08-12 13:39:07
 * @description   文件缓存
 */
var Abstract = require('./Abstract'),

  fs = require('fs'),

  util = require('./utils'),

  log = require('./log'),

  project = require('./project'),

  Cache;


Cache = module.exports = Abstract.extend({

  /**
   * 路径
   * @param  {String}                           path                      文件的路径
   * @param  {String}                           dir                       缓存目录名称
   */
  init: function(path, dir) {
    var me = this,
      file = util.realpath(path),
      info, basename, hash;

    if (!util.isFile(path)) {
      log.error('unable to cache file[' + path + ']: No such file.')
    }

    // last modify time
    me.timestamp = util.mtime(file).valueOf();

    // 文件信息
    info = util.pathinfo(file);
    basename = project.getCachePath(dir, info.basename);

    hash = util.md5(file, 10);

    me.cacheFile = basename + '-' + hash + '.tmp';
    me.cacheInfo = basename + '-' + hash + '.json';
  },

  /**
   * 保存缓存
   * @param  {String}                           content                    文件内容
   * @param  {Object}                           pathInfo                   路径信息
   */
  save: function(content) {
    var me = this,
      info;

    info = {
      timestamp: me.timestamp
    };

    util.write(me.cacheInfo, JSON.stringify(info));
    util.write(me.cacheFile, content);
  },

  /**
   * 从持久化的缓存中恢复
   */
  revert: function(file) {
    var me = this,
      info;

    log.debug('revert file from cache');
    
    // 校验缓存是否有效
    if (!Cache.enable || !util.exists(me.cacheInfo) || !util.exists(me.cacheFile)) {
      log.debug('cache is expired')
      return false;
    }

    log.debug('cache file exists');
    
    info = util.readJSON(me.cacheInfo);
    log.debug('read cache info');

    // 对比
    if (info.timestamp !== me.timestamp) {
      return false;
    }

    if (file) {
      file.info = info.info;
      file.content = fs.readFileSync(this.cacheFile);
    }

    log.debug('revert cache finished');

    return true;
  }
});


/**
 * 是否启用缓存
 * @type {Boolean}
 */
Cache.enable = true;


/**
 * 清除缓存
 * @param  {String}                           name                        缓存类别名称
 */
Cache.clean = function(name) {
  var path;

  name = name || '';

  // 获取缓存路径
  path = project.getCachePath(name);

  if (util.exists(path)) {
    util.del(path)
  }
};