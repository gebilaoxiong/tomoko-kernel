/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-25 01:01:13
 * @description   日志操作
 */

// 输出日志等级
exports.L_ALL = 0x01111;
exports.L_NOTICE = 0x00001;
exports.L_DEBUG = 0x00010;
exports.L_WARNI = 0x00100;
exports.L_ERROR = 0x01000;
exports.L_NORMAL = 0x01101;


exports.level = exports.L_NORMAL;

// 异常处理方式
exports.throw = false;


exports.alert = false;


/**
 * 打印信息句柄
 * @type {Object}
 */
exports.handlers = {
  any: function(type, msg) {},

  debug: function(msg) {
    process.stdout.write('\n [DEBUG] ' + msg + '\n');
  },

  notice: function(msg) {
    process.stdout.write('\n [NOTICE] ' + msg + '\n');
  },

  warning: function(msg) {
    process.stdout.write('\n [WARNI] ' + msg + '\n');
  },

  error: function(msg) {
    process.stdout.write('\n [ERROR] ' + msg + '\n');
  }
};


/**
 * 输出当前时间
 * @param  {Boolean}                  withoutMilliseconds           不显示毫秒
 */
exports.now = function(withoutMilliseconds) {
  var now = new Date(),
    ret;

  ret = [
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ].join(':').replace(/\b\d\b/g, '0$&');

  if (!withoutMilliseconds) {
    ret += '.' + ('00' + now.getMilliseconds()).substr(-4);
  }

  return ret;
};


/**
 * 输出日志信息
 * @param  {String}                     type                        日志类型
 * @param  {String}                     msg                         日志信息
 */
function log(type, msg) {
  var code = exports['L_' + type.toUpperCase()] || 0;
  if ((exports.level & code) > 0) {
    var handler = exports.handlers[type];
    if (handler) {
      handler(msg);
    }

    exports.handlers.any(type, msg);
  }
}


/**
 * 输出调试信息
 * @param  {String}                     msg                         日志信息
 */
exports.debug = function(msg) {
  log('debug', exports.now() + ' ' + msg);
};


/**
 * 输出提示信息
 * @param  {String}                     msg                         日志信息
 */
exports.notice = function(msg) {
  log('notice', msg);
};


/**
 * 输出警告信息
 * @param  {String}                     msg                         日志信息
 */
exports.warning = function(msg) {
  log('warning', msg);
};



/**
 * 输出错误信息
 * @param  {String|Error}               err                         错误信息
 */
exports.error = function(err) {
  // 将string转换为字符串
  if (!(err instanceof Error)) {
    err = new Error(err.message || err);
  }

  if (exports.alert) {
    err.message += '\u0007';
  }

  // 是否抛出异常
  if (exports.throw) {
    throw err
  } 
  // 打印异常信息
  else {
    log('error', err.message, exports.L_ERROR);
    process.exit(1);
  }
};
