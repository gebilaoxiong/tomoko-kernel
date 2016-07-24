/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-25 01:57:09
 * @description   读写操作
 */
var io = exports,

  lodash = require('lodash'),

  iconv = require('iconv-lite'),

  fs = require('fs'),

  pth = require('path'),

  exists = fs.existsSync || pth.existsSync,

  RESOURCE_EXTS = {},

  RESOURCE_TYPE_REG = {};


// 文件资源后缀
RESOURCE_EXTS['FILE'] = [
  'css', 'tpl', 'js', 'php',
  'txt', 'json', 'xml', 'htm',
  'text', 'xhtml', 'html', 'md',
  'conf', 'po', 'config', 'tmpl',
  'coffee', 'less', 'sass', 'jsp',
  'scss', 'manifest', 'bak', 'asp',
  'tmp', 'haml', 'jade', 'aspx',
  'ashx', 'java', 'py', 'c', 'cpp',
  'h', 'cshtml', 'asax', 'master',
  'ascx', 'cs', 'ftl', 'vm', 'ejs',
  'styl', 'jsx', 'handlebars'
];

// 图片资源
RESOURCE_EXTS['IMAGE'] = [
  'svg', 'tif', 'tiff', 'wbmp',
  'png', 'bmp', 'fax', 'gif',
  'ico', 'jfif', 'jpe', 'jpeg',
  'jpg', 'woff', 'cur', 'webp',
  'swf', 'ttf', 'eot', 'woff2'
];


['FILE', 'IMAGE'].forEach(function(category) {
  var types = RESOURCE_EXTS[category],
    // 类别正则
    regExp = new RegExp('\\.(?:' + types.join('|') + ')$', 'i');

  RESOURCE_TYPE_REG[category] = regExp;
});


/**
 * 是否是文件
 * @param  {String}                   path                    文件路径
 */
io.isTextFile = function(path) {
  return RESOURCE_TYPE_REG.FILE.test(path || '');
};


/**
 * 是否是文件
 * @param  {String}                   path                    文件路径
 */
io.isImageFile = function(path) {
  return RESOURCE_TYPE_REG.IMAGE.test(path || '');
};


/**
 * 判断内容是否为UTF8格式
 */
io.isUtf8 = function(bytes) {
  var i = 0;
  while (i < bytes.length) {
    if (( // ASCII
        0x00 <= bytes[i] && bytes[i] <= 0x7F
      )) {
      i += 1;
      continue;
    }

    if (( // non-overlong 2-byte
        (0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF)
      )) {
      i += 2;
      continue;
    }

    if (
      ( // excluding overlongs
        bytes[i] == 0xE0 &&
        (0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
      ) || ( // straight 3-byte
        ((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
          bytes[i] == 0xEE ||
          bytes[i] == 0xEF) &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
      ) || ( // excluding surrogates
        bytes[i] == 0xED &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9F) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
      )
    ) {
      i += 3;
      continue;
    }

    if (
      ( // planes 1-3
        bytes[i] == 0xF0 &&
        (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
      ) || ( // planes 4-15
        (0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
      ) || ( // plane 16
        bytes[i] == 0xF4 &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
      )
    ) {
      i += 4;
      continue;
    }
    return false;
  }
  return true;
};


/**
 * 从缓冲区读取内容
 * @param  {String}                    buffer                 位于缓冲区的文件内容
 */
io.readBuffer = function(buffer) {
  if (io.isUtf8(buffer)) {
    buffer = buffer.toString('utf8');

    if (buffer.charCodeAt(0) === 0xFEFF) {
      buffer = buffer.substring(1);
    }
  } 
  // gbk编码格式
  else {
    buffer = iconv.decode(buffer, 'gbk');
  }
  return buffer;
};


/**
 * 读取文件
 * @param  {String}                   path                    文件路径
 * @param  {String}                   convert                 是否需要转换
 */
io.read = function(path, convert) {
  var content = false;

  if (exists(path)) {
    content = fs.readFileSync(path);

    if (convert || io.isTextFile(path)) {
      content = io.readBuffer(content);
    }
  } else {
    tomoko.log.error('unable to read file[' + path + ']: No such file or directory.');
  }

  return content;
};


/**
 * 读取json
 * @param  {String}                   path                    文件路径
 */
io.readJSON = function(path){
    var json = _.read(path),
        result = {};

    try {
        result = JSON.parse(json);
    } catch(e){
        tomoko.log.error('parse json file[' + path + '] fail, error [' + e.message + ']');
    }

    return result;
};