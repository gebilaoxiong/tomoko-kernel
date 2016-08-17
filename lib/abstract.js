/**
 * @authors     gebilaoxiong (gebilaoxiong@gmail.com)
 * @date        2016-07-18 09:05:53
 * @description 抽象类
 *              赋予了类派生子类的能力 (extend)
 *              以及调用基类方法的能力 (callParent)
 */
var Abstract,

  EventEmitter = require('events').EventEmitter,

  objectHasOwnProperty = Object.prototype.hasOwnProperty,

  arraySlice = Array.prototype.slice,

  ignoreMembersRE = /^(prototype|constructor)$/;


Abstract = module.exports = classFactory(EventEmitter, {});



/**
 * 定义或是继承一个类型 
 * @param  {Function}                     parent                      基类构造函数(可选)
 */
function classFactory( /*parent, partial1, partial2, ...*/ ) {
  var params = arraySlice.call(arguments, 0),
    parent;

  // 传入了基类构造函数
  if (typeof params[0] === 'function') {
    parent = params.shift();
  }

  // 构造函数
  function klass() {
    var me = this;
    me.init && me.init.apply(me, arguments);
  }

  // 继承
  if (parent) {
    klass.prototype = Object.create(parent.prototype);
    klass.prototype.constructor = klass;
    klass.$super = parent;
  }

  // 扩展原型
  params.forEach(function(partial) {
    mergePartial(klass, partial);
  });

  // 派生方法
  klass.extend = extend;

  // 调用基类方法
  klass.prototype.callParent = function(params) {
    var caller, method, owner;

    try {
      // 找到调用的方法
      caller = arguments.callee.caller.caller;
      owner = caller.$owner;
      method = owner.$super.prototype[caller.$name];

    } catch (e) {}

    if (!method) {
      method = noop;
    }

    return method.apply(this, params);
  };

  return klass;
}


/**
 * 派生子类型
 * @param  {Object}                       partial                     子类成员
 */
function extend( /*partial1, partial2, ...*/ ) {
  var me = this,
    params = arraySlice.call(arguments, 0),
    klass;

  // 基类为调用的类型
  params.unshift(me);

  klass = classFactory.apply(me, params);

  return klass;
}


/**
 * 将部分类合并到原型上 (浅度复制)
 * @param  {Object}                       partial                     子类成员
 */
function mergePartial(klass, partial) {
  var proto = klass.prototype,
    memberName, member, method;

  // 迭代成员
  for (memberName in partial) {

    if (
      // 过滤掉一些成员
      ignoreMembersRE.test(memberName) &&
      // 原型链上的成员
      !objectHasOwnProperty.call(partial, memberName)
    ) {
      continue;
    }

    member = partial[memberName];

    // 如果成员是函数
    // 标记下他的属性名称
    // 以及他的构造函数
    if (typeof member === 'function') {
      method = member;
      member = wrapMethod(method);
      // 标记成员名称
      member.$name = memberName;
      member.$owner = klass;
    }

    proto[memberName] = member;
  }
}


/**
 * 包裹一个方法并标记他
 * @param  {Function}                       method                      成员方法
 */
function wrapMethod(method) {
  return function() {
    return method.apply(this, arguments);
  };
}


/**
 * 空函数
 */
function noop() {}