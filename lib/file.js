/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-08-10 18:59:04
 * @description   文件抽象类
 */
var File,

  Abstract = require('./abstract'),

  project = require('./project'),

  uri = require('./uri'),

  utils = require('./utils'),

  config = require('./config');


File = module.exports = Abstract.extend({

  /**
   * 相对于项目根目录的路径
   */
  subpath: '',

  /**
   * 目录名称
   */
  dirname: '',

  /**
   * 文件名称
   */
  filename: '',

  /**
   * 完整名称
   */
  fullname: '',

  /**
   * 文件后缀
   */
  ext: '',

  /**
   * 相对于项目目录路径
   */
  subpath: '',

  /**
   * 相对于项目文件夹名称
   */
  subdirname: '',

  /**
   * 初始化
   */
  init: function(filepath) {
    var me = this,
      realpath, info, root,
      len, reg, release;

    // 路径信息
    info = utils.pathinfo(filepath);


    me._isImage = true;
    me._isText = false;
    me.useCache = true;
    // 真实路径
    me.realpath = realpath = utils.realpath(filepath);
    me.releaseExt = getReleaseExt(info.ext);


    // 复制到实例上
    utils.extend(me, info);

    // 项目根目录
    root = project.getProjectPath();

    // 非图片
    if (utils.isTextFile(info.ext)) {
      me._isImage = false;
      me._isText = true;
    }

    // 相对于项目路径
    if (realpath && realpath.indexOf(root) === 0) {
      len = root.length;
      me.subpath = realpath.substring(len);
      me.subdirname = info.dirname.substring(len);

      // 映射属性
      utils.extend(me, uri.roadmap(me.subpath));
    }

    // 替换release文件的后缀
    if (me.release) {
      reg = new RegExp(utils.escapeReg(me.ext) + '$|' + utils.escapeReg(me.releaseExt) + '$', 'i');

      release = this.release.replace(/[\/\\]+/g, '/');
      if (release[0] !== '/') {
        release = '/' + release;
      }

      me.release = normalizePath(release, reg, me.releaseExt);
    }
  },

  /**
   * 测试文件是否存在
   */
  exists: function() {
    var me = this;

    return utils.exists(me.fullname);
  },

  /**
   * 是否为文本文件
   */
  isText: function() {
    var me = this;

    return me._isText;
  },


  /**
   * 是否是图片文件
   */
  isImage: function() {
    var me = this;

    return me._isImage;
  },

  /**
   * 获取文件的内容
   */
  getContent: function() {
    var me = this;

    if (typeof me._content === 'undefined') {
      me._content = utils.read(me.realpath, me.isText());
    }
    return me._content;
  },

  /**
   * 设置文件内容
   */
  setContent: function(content) {
    var me = this;

    me._content = content;

    return me;
  },

  /**
   * 校验路径是否为文件
   */
  isFile: function() {
    var me = this;

    return utils.isFile(me.realpath);
  },

  getMtime: function() {
    var me = this;

    return utils.getMtime(me.realpath);
  }
});

function getReleaseExt(ext) {
  if (ext) {
    var releaseExt = config.get('roadmap.ext' + ext);
    if (releaseExt) {
      ext = normalizeExt(releaseExt);
    }
  }
  return ext;
}

function normalizeExt(releaseExt) {
  if (releaseExt[0] !== '.') {
    releaseExt = '.' + releaseExt;
  }
  return releaseExt;
}

function normalizePath(path, reg, releaseExt) {
  return path
    .replace(reg, '')
    .replace(/[:*?"<>|]/g, '_') + releaseExt;
}