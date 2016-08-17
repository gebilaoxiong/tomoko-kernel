/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-08-12 14:22:20
 * @description   编译
 */
var compile,

  util = require('./utils'),

  File = require('./file'),

  Cache = require('./cache'),

  log = tomoko.log,

  CACHE_DIR;


// 缓存目录
CACHE_DIR = "/compile/deploy";


compile = module.exports = function(file) {
  var me = this,
    cache, revertFile;

  if (util.isString(file)) {
    file = new File(file);
  }

  // 缓存
  cache = file.cache = new Cache(file.realpath, CACHE_DIR);
  revertFile = {};


  if (file.isFile()) {
    // 从缓存中恢复
    if (file.useCache && cache.revert(revertFile)) {
      // 读取文本文件
      if (file.isText()) {
        revertFile.content = revertFile.content.toString('utf8');
      }

      file.setContent(revertFile.content);
    }
    // 将文件处理后放入缓存
    else {
      file.setContent(util.read(file.realpath));
      process(file); // 处理
      cache.save(file.getContent());
    }
  } 
  // others
  else if (file.useCompile && file.ext && file.ext !== '.') {
    process(file);
  }

  file.compiled = true;
  log.debug('compile [' + file.realpath + '] end');

  return file;
}


/**
 * 处理文件
 * @param  {String}                     file                  需要编译的文件
 */
function process(file) {
  if (file.useParser !== false) {
    pipe(file, 'parser', file.ext);
  }

  if (!file.releaseExt) {
    return;
  }

  if (file.usePreprocessor !== false) {
    pipe(file, 'preprocessor', file.releaseExt);
  }

  if (file.usePostprocessor !== false) {
    pipe(file, 'postprocessor', file.releaseExt);
  }
}


/**
 * 文件处理管道
 * @param  {File}                       file                  文件抽象类
 * @param  {String}                     type                  处理类型
 * @param  {String}                     ext                   文件后缀
 * @param  {Boolean}                    keep                  是否不处理
 */
function pipe(file, type, ext, keep) {
  var key = type + ext;

  tomoko.util.pipe(key, function(processor, settings, key) {
    // 文件内容
    var content = file.getContent(),
      result;

    settings.filename = file.filename;

    try {
      log.debug('pipe [' + key + '] start');
      result = processor(content, file, settings);
      log.debug('pipe [' + key + '] end');

      // 不处理
      if (keep) {
        file.setContent(content);
      }
      // 木有返回值
      else if (typeof result === 'undefined') {
        log.warning('invalid content return of pipe [' + key + ']');
      }
      // 成功装逼
      else {
        file.setContent(result);
      }

    } catch (e) {
      //log error
    }
  });
}