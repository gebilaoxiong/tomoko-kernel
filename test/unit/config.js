/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 22:10:24
 * @description   配置类型单元测试
 */
var expect = require('chai').expect,

  Config = require('../../lib/config');


describe('测试配置类型：Config', function() {
  var config;

  describe('测试初始化操作', function() {

    // 实例化一个配置
    config = new Config({
      prop1: 'value1',

      objectProp: {
        prop2: 'value2',
        prop3: 'value3'
      },

      arrayProp: ['value4', 'value5']
    });


    it('测试属性options是否正确初始化', function() {
      expect(config.options).to.be.eql({
        prop1: 'value1',

        objectProp: {
          prop2: 'value2',
          prop3: 'value3'
        },

        arrayProp: ['value4', 'value5']
      });
    });

  });


  describe('测试合并配置：#merge()', function() {


    it('合并对象属性', function() {
      var options = {
        prop2: 'value2',

        arrayProp: ['value6', 'value7']
      }

      // 合并
      config.merge(options);

      expect(config.options).to.be.eql({
        prop1: 'value1',

        prop2: 'value2',

        objectProp: {
          prop2: 'value2',
          prop3: 'value3'
        },

        arrayProp: ['value4', 'value5', 'value6', 'value7']
      });
    });

  });


  describe('测试取值操作：#get()', function() {

    it('测试获取属性值', function() {
      expect(config.get('prop1')).to.be.equal('value1');
    });

    it('测试获取属性访问表达式的值', function() {
      expect(config.get('objectProp.prop2')).to.be.equal('value2');
      expect(config.get('arrayProp[0]')).to.be.equal('value4');
    });

  });


  describe('测试赋值操作：#set()', function() {

    it('测试对属性值赋值', function() {
      config.set('prop1', 'value8');
      expect(config.get('prop1')).to.be.equal('value8');
    });

    it('测试对属性表达式赋值', function(){
      config.set('objectProp.prop2','value9');
      expect(config.get('objectProp.prop2')).to.be.equal('value9');

      config.set('arrayProp[0]','value10');
      expect(config.get('arrayProp[0]')).to.be.equal('value10');
    })

  });


});