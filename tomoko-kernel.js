/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-06-21 00:35:24
 * @description   智子核心
 */
var tomoko = module.exports,
  
  colors = require('colors'),

  fs = require('fs');


// project environment
Object.defineProperty(global, 'tomoko', {
  enumerable: true,
  writable: false,
  value: tomoko
});


colors.enabled = true;


tomoko.colors = colors;

// 工具函数
tomoko.util = require('./lib/utils');

// 模块前缀
tomoko.prefixes = ['tomoko'];

//日志操作
tomoko.log = require('./lib/log');

// 模块加载器
tomoko.require = require('./lib/require.js');

// 抽象类型
tomoko.Abstract = require('./lib/abstract.js');

// 基础类型
tomoko.Base = require('./lib/base.js');

// 配置
tomoko.config = require('./lib/config.js');

// 项目工具
tomoko.project = require('./lib/project.js');

// 资源管理
tomoko.uri = require('./lib/uri');

// 编译
tomoko.compile = require('./lib/compile');

// 缓存
tomoko.Cache = require('./lib/cache');

// 释放
// tomoko.release = require('./lib/release');

// 文件
tomoko.File = require('./lib/file');

// 版本号
tomoko.version = tomoko.util.readJSON(__dirname + '/package.json').version;