/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-25 01:57:09
 * @description   读写操作
 */
var fileSys = exports,

  lang = require('./lang'),

  iconv = require('iconv-lite'),

  crypto = require('crypto'),

  del = require('del'),

  fs = require('fs'),

  pth = require('path'),

  // 获取 git config
  gitConfig = require('git-config'),

  _ = require('lodash'),

  yml = require('js-yaml'),

  exists = fs.existsSync || pth.existsSync,

  arrayJoin = Array.prototype.join,

  IS_WIN = process.platform.indexOf('win') === 0,

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
 * 校验字符串是否为目录
 * @param  {Strign}                 path                      需要校验的字符串
 */
fileSys.isDir = function(path) {
  return exists(path) && fs.statSync(path).isDirectory();
};


/**
 * 创建文件夹
 * @param  {String}               path                        文件夹路径
 */
fileSys.mkdir = function(path) {
  // 路径不存在
  if (exists(path)) {
    return;
  }

  // 创建上层目录
  path.split(/\//).reduce(function(prev, next) {
    if (prev && !exists(prev)) {
      fs.mkdirSync(prev);
    }

    return prev + '/' + next;
  });

  // 最后一层
  if (!exists(path)) {
    fs.mkdirSync(path);
  }
}


/**
 * 将相对路径解析为绝对路径 (参考目录为proccess.cwd())
 * @param  {String}                 path                       需要解析的路径
 */
fileSys.realpath = function(path) {
  if (!path || !exists(path)) {
    return false;
  }

  path = fs.realpathSync(path);

  // windows中将反斜杠转换为正斜杠
  if (IS_WIN) {
    path = path.replace(/\\/g, '/');
  }

  if (path !== '/') {
    path = path.replace(/\/$/g, '');
  }

  return path;
};


/**
 * 规范化路径
 */
fileSys.normalize = function(path) {
  var type = typeof path;

  if (arguments.length > 1) {
    path = arrayJoin.call(arguments, '/');
  }
  // 数组
  else if (typeof path === 'object') {
    path = arrayJoin.call(path, '/');
  }
  // 空
  else if (path == null) {
    return '';
  }

  path = pth.normalize(path).replace(/\\/g, '/');

  // 目录
  if (path !== '/') {
    path.replace(/\/$/, '');
  }

  return path;
}


/**
 * 校验路径是否为文件
 * @param  {String}                   path                   路径
 */
fileSys.isFile = function(path) {
  return exists && fs.statSync(path).isFile();
}


/**
 * 是否是文件
 * @param  {String}                   path                    文件路径
 */
fileSys.isTextFile = function(path) {
  return RESOURCE_TYPE_REG.FILE.test(path || '');
};


/**
 * 是否是文件
 * @param  {String}                   path                    文件路径
 */
fileSys.isImageFile = function(path) {
  return RESOURCE_TYPE_REG.IMAGE.test(path || '');
};


/**
 * 判断内容是否为UTF8格式
 */
fileSys.isUtf8 = function(bytes) {
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
 * @param  {String}                     buffer                 位于缓冲区的文件内容
 */
fileSys.readBuffer = function(buffer) {
  if (fileSys.isUtf8(buffer)) {
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
 * @param  {String}                     path                    文件路径
 * @param  {String}                     convert                 是否需要转换
 */
fileSys.read = function(path, convert) {
  var content = false;

  if (exists(path)) {
    content = fs.readFileSync(path);

    if (convert || fileSys.isTextFile(path)) {
      content = fileSys.readBuffer(content);
    }
  } else {
    tomoko.log.error('unable to read file[' + path + ']: No such file or directory.');
  }

  return content;
};


/**
 * 读取json
 * @param  {String}                     path                    文件路径
 */
fileSys.readJSON = function(path) {
  var json = fileSys.read(path),
    result = {};

  try {
    result = JSON.parse(json);
  } catch (e) {
    tomoko.log.error('parse json file[' + path + '] fail, error [' + e.message + ']');
  }

  return result;
};


/**
 * 写操作
 * @param  {String}                     path                     文件路径
 * @param  {String}                     data                     文件内容
 * @param  {String}                     charset                  编码
 * @param  {Booean}                     append
 */
fileSys.write = function(path, data, charset, append) {
  if (!exists(path)) {
    fileSys.mkdir(fileSys.pathinfo(path).dirname);
  }

  if (charset) {
    data = iconv.encode(data, charset);
  }

  if (append) {
    fs.appendFileSync(path, data, null);
  } else {
    fs.writeFileSync(path, data, null);
  }
}


/**
 * 删除文件
 * @param  {String}                     path                     文件路径
 */
fileSys.del = function(path) {
  if (lang.isString(path)) {
    path = [path];
  }

  return del.sync(path, {
    force: true
  });
}


/**
 * 文件大小格式化
 * @param  {Number}                     size                     文件大小
 */
fileSys.formatSize = function(size) {
  var unit, index;

  if (size <= 0) return "0 bytes";

  unit = ["bytes", "kB", "MB", "GB"];
  index = Math.floor(Math.log(size) / Math.log(1000));

  return +(size / Math.pow(1000, index))
    .toPrecision(3) + " " + unit[index];
}


/**
 * 提取文件路径信息
 * @param  {String}                     filePath                  文件路径信息
 */
fileSys.pathinfo = function(filePath) {
  var info = {},
    pos;

  filePath = filePath.replace(/\\/g, '/');

  info.fullname = filePath;

  info.dirname = '';

  // 目录
  if ((pos = filePath.lastIndexOf('/')) > -1) {
    info.dirname = pos === 0 ?
      '/' : filePath.substring(0, pos);

    filePath = filePath.substring(pos + 1);
  }

  //文件名称及后缀
  info.filename = filePath;
  info.ext = '';

  if ((pos = filePath.lastIndexOf('.')) > -1) {
    info.ext = filePath.substring(pos).toLowerCase();
    info.filename = filePath.slice(0, pos);
    info.basename = info.filename + info.ext;
  } else {
    info.basename = info.filename = filePath;
    info.ext = '';
  }

  return info;
}


/**
 * 获取路径下符合条件的文件
 * @param  {String}                       path                        路径
 * @param  {Array}                        include                     包含的文件
 * @param  {Array}                        exclude                     例外
 * @param  {String}                       root                        根目录
 */
fileSys.find = function(path, include, exclude, root) {
  var list = [],
    realpath = fileSys.realpath(path),
    filterPath = path,
    fileState;

  // 相对root的路径
  if (root) {
    filterPath = path.substring(root.length);
  }

  // 路径不存在
  if (!realpath) {
    tomoko.log.error('unable to find [' + path + ']: No such file or directory.');
  }

  // 获取文件状态
  fileState = fs.statSync(realpath);


  if (
    // 文件夹
    fileState.isDirectory() &&
    // 过滤
    (include || fileSys.filter(filterPath, include, exclude))
  ) {
    fs.readdirSync(realpath).forEach(function(path) {
      list = list.concat(fileSys.find(realpath + '/' + path, include, exclude, root));
    });
  }
  // 处理文件
  else if (
    // 判断
    fileState.isFile() &&
    // 过滤
    fileSys.filter(filterPath, include, exclude)
  ) {
    list.push(realpath);
  }

  return list;
}


/**
 * 判断路径是否满足条件
 * @param  {String}                       filePath                    路径
 * @param  {Array}                        include                     包含的文件
 * @param  {Array}                        exclude                     例外
 */
fileSys.filter = function(filePath, include, exclude) {
  var isInclude, isExclude;

  if (include) {
    isInclude = match(filePath, include);
  } else {
    isInclude = true
  }

  if (exclude) {
    isExclude = match(filePath, exclude);
  }


  /**
   * 校验路径是否满足条件
   * @param  {String}                      filePath                    路径
   * @param  {Array}                       include                     包含的文件
   */
  function match(filePath, patterns) {
    var matched = false;

    //整理参数
    if (!lang.isArray(patterns)) {
      patterns = [patterns];
    }

    // 只要满足一个正则 就视为满足条件
    matched = patterns.some(function(pattern) {
      if (!pattern) {
        return true;
      }

      return filePath.search(pattern) > -1;
    });

    return matched;
  }

  return isInclude && !isExclude;
};


/**
 * 获取更新时间
 * @param  {String}                         path                        路径
 */
fileSys.mtime = function(path) {
  var time = 0;
  if (exists(path)) {
    time = fs.statSync(path).mtime;
  }
  return time;
};


/**
 * 获取数据的md5值
 * @param  {Object}                         data                         序列化的数据
 * @param  {Number}                         len                          长度
 */
fileSys.md5 = function(data, len) {
  var md5sum = crypto.createHash('md5'),
    encoding = typeof data === 'string' ? 'utf8' : 'binary';

  md5sum.update(data, encoding);
  len = len || 7;
  return md5sum.digest('hex').substring(0, len);
};


/**
 * 获取modifytime
 * @param  {String}                         path                        路径
 */
fileSys.getMtime = function(filepath) {
  var time = 0;

  if (exists(filepath)) {
    time = fs.statSync(filepath).mtime;
  }

  return time;
}


/**
 * 文件处理管道
 * @param  {String}                         type                          处理类型
 * @param  {Function}                       callback                      回调
 * @param  {*}                              def                           默认值
 */
fileSys.pipe = function(type, callback, def) {
  var processors, processorsType, settings;

  // 配置中的处理器
  // modules.parse.a => b,c
  if (!(processors = tomoko.config.get('modules.' + type) || def)) {
    return;
  }

  processorsType = typeof processors;

  // 字符串 b,c => [b, c]
  if (processorsType === 'string') {
    processors = processors.trim().split(/\s*,\s*/);
  } else if (processorsType === 'function') {
    processors = [processors]
  }

  // parse.a => parse
  type = type.split('.')[0];

  // 迭代配置中的处理器 [b, c]
  lang.each(processors, function(processor, index) {
    var processorType = typeof processor,
      key;

    // 字符串
    if (processorType === 'string') {
      key = type + '.' + processor;
      processor = tomoko.require(type, processor);
    }
    // object
    else {
      key = type + '.' + index;
    }

    // 处理
    if (typeof processor === 'function') {
      settings = tomoko.config.get('settings.' + key) || {};

      // 合并默认参数
      if (processor.defaultOptions) {
        settings = lang.extend({}, processor.defaultOptions, settings);
      }

      // 处理
      callback(processor, settings, key);
    }
    // 打印警告信息
    else {
      tomoko.log.warning('invalid processor [modules.' + key + ']');
    }

  });

};


/**
 * 是否是windows
 * @return {Boolean} [description]
 */
fileSys.isWin = function() {
  return IS_WIN;
};


/**
 * 返回 gitconfig
 * @param  {String}                         key                          获取指定键值
 */
fileSys.getGitConfig = function(key) {
  var gitConfigObj = gitConfig.sync();

  if (key) {
    return _.get(gitConfigObj, key);
  }

  return gitConfigObj;
};


/**
 * 复制文件
 * @param  {String}                         rSource                       需要复制的文件、文件夹路径
 * @param  {String}                         target                        dest路径
 * @param  {Array}                          include                       匹配的文件规则(正则数组)
 * @param  {Array}                          exclude                       不匹配的文件规则(正则数组)
 * @param  {[type]}                         uncover                       [description]
 * @param  {[type]}                         move                          [description]
 */
fileSys.copy = function(rSource, target, include, exclude, uncover, move) {
  var removedAll = false,
    source = fileSys.realpath(rSource);

  // source 不存在
  if (!source) {
    tomoko.log.error('unable to copy [' + rSource + ']: No such file or directory.')
  }

  // 读取
  var sourceState = fs.statSync(source);

  // 目录
  if (sourceState.isDirectory()) {
    var files = fs.readdirSync(source); // 读取目录下的所有文件

    // 过滤后递归调用copy
    files.forEach(function(name) {
      if (name != '.' && name != '..') {
        removedAll = fileSys.copy(
          source + '/' + name,
          target + '/' + name,
          include, exclude,
          uncover, move
        ) && removedAll;
      }
    });

    // move操作 或者是删除全部
    if (move && removedAll) {
      fs.rmdirSync(source);
    }
  }
  // 文件
  else if (sourceState.isFile() && fileSys.filter(source, include, exclude)) {
    if (uncover && exists(target)) {
      removedAll = false;
    } else {
      // write file
      fileSys.write(target, fs.readFileSync(source, null));
      if (move) {
        fs.unlinkSync(source);
      }
    }
  }
  // default: do nonthing
  else {
    removedAll = false;
  }

  return removedAll;
}


fileSys.exists = exists;