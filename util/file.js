/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-21 00:46:27
 * @description   文件读取
 */
var file = exports,

  fs = require('fs'),

  pth = require('path'),

  exists = fs.existsSync || pth.existsSync;


/**
 * 判断path是否存在
 */
file.exists = exists;
