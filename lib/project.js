/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-25 01:30:19
 * @description   项目
 */

var utils = require('./utils'),

  log = require('./log'),

  File = require('./File'),

  arrayJoin = Array.prototype.join,

  TEMP_ROOT, PROJECT_ROOT;


/**
 * 获取项目路径
 */
exports.getProjectPath = function() {
  return PROJECT_ROOT ?
    buildPath(PROJECT_ROOT, arguments) :
    buildPath(arguments);
};


/**
 * 设置项目路径
 */
exports.setProjectRoot = function(root) {
  if (utils.isDir(root)) {
    PROJECT_ROOT = utils.realpath(root);
  } else {
    log.error('invalid project root path [' + path + ']')
  }
};


/**
 * 设置临时目录
 * @param {Strign}                      tmp                         临时目录路径
 */
exports.setTempRoot = function(tmp) {
  TEMP_ROOT = initDir(tmp);
};



/**
 * 获取临时文件夹路径
 */
exports.getTempPath = function() {
  var dirs, name, tmp,
    dir, i, len;

  if (!TEMP_ROOT) {
    dirs = ['LOCALAPPDATA', 'APPDATA', 'HOME'];
    name = (tomoko && tomoko.cli && tomoko.cli.name) || 'tomoko';

    for (i = 0, len = dirs.length; i < len; i++) {
      dir = dirs[i];

      if (tmp = process.env[dir]) {
        break;
      }
    }

    tmp = tmp || __dirname + '/../';
    exports.setTempRoot(tmp + '/.' + name + '-tmp');
  }

  return buildPath(TEMP_ROOT, arguments);
};


/**
 * 读取json文件
 */
exports.readJSON = function(path) {
  // 获取路径
  path = exports.getProjectPath(path);

  if (!utils.exists(path)) {
    log.error('the file is not exist [' + path + ']');
  }

  if (!utils.isTextFile(path)) {
    log.error('不是有效的文本文件: [' + path + ']');
  }

  return utils.readJSON(path);
};


/**
 * 校验项目文件是否存在
 * @param  {String}                     path                        文件名称
 */
exports.exists = function(path) {
  // 获取路径
  path = exports.getProjectPath(path);

  return utils.exists(path);
};


/**
 * 获取modifytime
 * @param  {String}                         path                        路径
 */
exports.getMtime = function(path) {
  // 获取路径
  path = exports.getProjectPath(path);

  return utils.getMtime(path);
}


/**
 * 加载项目中的文件
 * @param  {String}                     path                        文件名称
 */
exports.require = function(path) {
  // 获取路径
  path = exports.getProjectPath(path);

  return require(path);
};


/**
 * 获取项目资源
 */
exports.getSource = function() {
  var root = exports.getProjectPath(),
    include = tomoko.config.get('project.include'),
    exclude = tomoko.config.get('project.exclude'),
    source = {};

  utils.find(root, include, exclude, root)

  // 转换为File类型
  .forEach(function(filepath) {

    var file = new File(filepath);

    source[file.subpath] = file;
  });

  return source;
};


/**
 * 获取缓存路径
 */
exports.getCachePath = function() {
  return buildPath(exports.getTempPath('cache'), arguments);
};


/**
 * 构建路径
 * @param  {String}                     root                        根目录
 * @param  {Array}                      param                       其他路径参数
 */
function buildPath(root, param) {
  var path = root;

  if (param && param.length > 0) {
    path = root + '/' + arrayJoin.call(param, '/');
  }

  return utils.normalize(path);
}


/**
 * 初始化文件夹
 * @param  {String}               path                     文件夹路径
 */
function initDir(path) {
  var dirPath;

  if (utils.exists(path)) {
    if (!utils.isDir(path)) {
      log.error('unable to set path[' + path + ']');
    }
  }
  // create
  else {
    utils.mkdir(path);
  }

  dirPath = utils.realpath(path);

  if (dirPath) {
    return dirPath;
  } else {
    log.error('unable to create dir [' + path + ']');
  }
}