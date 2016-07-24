/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 23:11:56
 * @description   工具代码单元测试
 *                由于大部分是直接复制的lodash的
 *                所以这里没有测试的必要
 *                这里只会测试自定义的工具方法
 */
var expect = require('chai').expect,

  utils = require('../../lib/utils');


describe('测试工具代码：utils', function() {


  describe('#type()', function() {

    it('字面量类型判断', function() {
      expect(utils.type({})).to.be.equal('object');
      expect(utils.type(true)).to.be.equal('boolean');
      expect(utils.type(1)).to.be.equal('number');
      expect(utils.type('')).to.be.equal('string');
      expect(utils.type(/\s/)).to.be.equal('regexp');
      expect(utils.type(null)).to.be.equal('null');
      expect(utils.type(undefined)).to.be.equal('undefined');
    });

    it('对象类型判断', function() {
      expect(utils.type(new Object)).to.be.equal('object');
      expect(utils.type(new Boolean(true))).to.be.equal('boolean');
      expect(utils.type(new Number(1))).to.be.equal('number');
      expect(utils.type(new String(''))).to.be.equal('string');
      expect(utils.type(new RegExp('\\s'))).to.be.equal('regexp');
    });
  });


  describe('#mergeOptions()', function() {
    var dest, source;

    it('简单选项合并', function() {

      dest = {
        prop: 'prop',
        prop1: 'value1',
        prop2: 1,
        prop3: true
      };

      source = {
        prop1: 'value2',
        prop2: 2,
        prop3: false
      };

      utils.mergeOptions(dest, source);

      expect(dest).to.be.eql({
        prop: 'prop',
        prop1: 'value2',
        prop2: 2,
        prop3: false
      });

    });


    it('对象选项合并', function() {

      dest = {
        prop: 'prop',
        prop1: {
          subProp1: 'value1',
          subProp2: 'value2',
          subProp3: 1,
          prop3: new Boolean(true)
        }
      };

      source = {
        prop1: {
          subProp1: 'value1',
          subProp2: 'value3',
          subProp3: 2,
          prop3: new Boolean(false)
        }
      }

      utils.mergeOptions(dest, source);

      expect(dest).to.be.eql({
        prop: 'prop',
        prop1: {
          subProp1: 'value1',
          subProp2: 'value3',
          subProp3: 2,
          prop3: new Boolean(false)
        }
      });

      expect(dest.prop1).to.be.not.equal(source.prop1);

    });

    it('数组选项合并', function() {

      dest = {
        prop1: ['a', 'b', 'c'],
        prop2: [{
          name: 'a'
        }, {
          name: 'b'
        }, {
          name: 'c'
        }]
      };

      source = {
        prop1: ['d'],
        prop2: [{
          name: 'd'
        }]
      };

      utils.mergeOptions(dest, source);

      expect(dest).to.be.eql({
        prop1: ['a', 'b', 'c', 'd'],
        prop2: [{
          name: 'a'
        }, {
          name: 'b'
        }, {
          name: 'c'
        }, {
          name: 'd'
        }]
      });

      expect(dest.prop1).to.be.not.equal(source.prop1);
      expect(dest.prop2).to.be.not.equal(source.prop2);

    });

  })

});