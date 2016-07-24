/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 15:09:15
 * @description   抽象类单元测试
 */
var expect = require('chai').expect,

  Abstract = require('../../lib/abstract.js');


describe('测试抽象类：Abstract', function() {
  var KlassA, KlassB;

  describe('定义类型 KlassA', function() {
    var instance;

    KlassA = Abstract.extend({

      prop1: 'value1',

      returnTrue: function() {
        return true;
      }
    });

    describe('#extend()', function() {
      it('判断是否包含静态方法: extend', function() {
        expect(KlassA).to.have.ownProperty('extend');
        expect(KlassA.extend).to.be.a('function');
      });
    });

    describe('实例化操作', function() {
      var instance = new KlassA();

      it('校验实例成员', function() {
        expect(instance).to.have.property('prop1', 'value1');

        expect(instance).to.have.property('returnTrue');
        expect(instance.returnTrue).to.be.a('function');
      });

      it('调用实例方法 #returnTrue()', function() {
        expect(instance.returnTrue()).to.equal(true);
      });
    });
  });


  describe('从 KlassA 派生KlassB，重写prop1、returnTrue 并添加新成员prop2、returnFalse', function() {
    var instance;

    KlassB = KlassA.extend({

      prop1: 'value2',

      prop2: 'value3',

      returnTrue: function() {
        return this.callParent();
      },

      returnFlase:function(){
        return false;
      }
    });

    describe('#extend()', function() {
      it('判断是否包含静态方法: extend', function() {
        expect(KlassB).to.have.ownProperty('extend');
        expect(KlassB.extend).to.be.a('function');
      });
    });

    describe('实例化操作', function() {
      var instance = new KlassB();

      it('校验实例成员', function() {
        expect(instance).to.have.property('prop1', 'value2');
        expect(instance).to.have.property('prop2', 'value3');

        expect(instance).to.have.property('returnTrue');
        expect(instance.returnTrue).to.be.a('function');

        expect(instance).to.have.property('returnFlase');
        expect(instance.returnFlase).to.be.a('function');
      });

      it('调用实例方法 #returnTrue()', function() {
        expect(instance.returnTrue()).to.equal(true);
      });

      it('调用实例方法 #returnFlase()', function() {
        expect(instance.returnFlase()).to.equal(false);
      });
    });
  });

});

function defineKlass(Klass) {



  return KlassA;
}