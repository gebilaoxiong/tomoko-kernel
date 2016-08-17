/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 21:44:25
 * @description   基类单元测试
 */
var expect = require('chai').expect,

  Base = require('../../lib/base.js');


describe('测试基类：Base', function() {
  var KlassA;

  KlassA = Base.extend({

    prop1: 'value1',

    returnTrue: function() {
      return true;
    }
  });

  describe('实例化操作', function() {
    var instance;

    instance = new KlassA({
      prop1: 'value2',

      returnTrue: function() {
        return false;
      }
    });

    describe('判断实例化操作过程中的覆盖操作是否正常', function() {

      it('判断属性是否能被重写', function() {
        expect(KlassA.prototype).to.have.property('prop1', 'value1');
        expect(instance).to.have.ownProperty('prop1', 'value2');
      });

      it('判断方法是否不能被重写', function() {
        expect(instance.returnTrue).to.equal(KlassA.prototype.returnTrue);
      });

    });
    
  });
});