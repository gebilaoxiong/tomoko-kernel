/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-20 23:12:08
 * @description   项目（路径)
 */
var project = exports,

  fs = require('fs'),

  pth = require('path'),

  exists = fs.existsSync || pth.existsSync;


// 项目路径
project.cwd = process.cwd();


/**
 * 将相对路径解析为绝对路径
 * @param  {String}               path                路径
 */
project.resolve = function(path) {
  return pth.resolve(project.cwd, path);
}


/**
 * 加载项目中的文件
 * @param  {String}               path                文件路径
 */
project.require = function(path) {

  if (!project.exists(path)) {
    tomoko.log.error('path [' + path + '] is not exists.');
  }

  return require(project.resolve(path));
}


/**
 * 判断项目中的文件或目录是否存在
 * @param  {String}                 path              路径
 */
project.exists = function(path) {
  path = project.resolve(path);
  return exists(path);
}


/**
 * 加载项目个性化配置
 * @param  {String}                  path             路径
 */
project.importConfig = function(path) {

  // 默认路径
  if (!path) {
    path = './config/tomoko.config';
  }

  if (!project.exists(path)) {
    tomoko.log.error('file [' + path + '] does not exists')
  }

  project.require(path);
}


// 项目信息
project.info = project.require('./package.json');