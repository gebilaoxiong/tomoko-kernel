/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-25 02:46:45
 * @description   选项测试
 */
var expect = require('chai').expect,

  options = require('../../../lib/utils/options');

describe('测试选项工具：utils/options', function() {

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

      options.mergeOptions(dest, source);

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

      options.mergeOptions(dest, source);

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

      options.mergeOptions(dest, source);

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
