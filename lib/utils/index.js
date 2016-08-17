/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 22:08:37
 * @description   工具类
 */
var lang = require('./lang'),

  options = require('./options'),

  fs = require('./fs'),
  
  util = exports;


lang.extend(util, lang);

lang.extend(util, options); 

lang.extend(util, fs); 

