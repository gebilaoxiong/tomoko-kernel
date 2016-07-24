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


// 模块前缀
tomoko.prefix = ['tomoko'];

//日志操作
tomoko.log = require('./lib/log');

// 工具函数
tomoko.util = require('./lib/utils');

// 模块加载器
tomoko.require = require('./lib/require.js');

// 抽象类型
tomoko.Abstract = require('./lib/abstract.js');

// 基础类型
tomoko.Base = require('./lib/base.js');

// 配置类型
tomoko.Config = require('./lib/config.js');