/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-21 00:35:24
 * @description   智子核心
 */
var tomoko = module.exports,

  fs = require('fs');


// project environment
Object.defineProperty(global, 'tomoko', {
  enumerable: true,
  writable: false,
  value: tomoko
});



// 工具
tomoko.util = require('./util');

// 日志
tomoko.log = require('./lib/log');

// 模块加载
tomoko.require = require('./lib/require');

// 配置类型
tomoko.Configuration = require('./lib/config');

// 配置对象
tomoko.config = new tomoko.Configuration();

// 项目
tomoko.project = require('./lib/project');

// tomoko info
tomoko.info = require('./package.json');

// 版本号
tomoko.version = tomoko.info.version;