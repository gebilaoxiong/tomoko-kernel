/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-25 02:47:49
 * @description   
 */
var expect = require('chai').expect,

  lang = require('../../../lib/utils/lang');


describe('测试选项工具：utils/lang', function() {

  describe('#type()', function() {

    it('字面量类型判断', function() {
      expect(lang.type({})).to.be.equal('object');
      expect(lang.type(true)).to.be.equal('boolean');
      expect(lang.type(1)).to.be.equal('number');
      expect(lang.type('')).to.be.equal('string');
      expect(lang.type(/\s/)).to.be.equal('regexp');
      expect(lang.type(null)).to.be.equal('null');
      expect(lang.type(undefined)).to.be.equal('undefined');
    });

    it('对象类型判断', function() {
      expect(lang.type(new Object)).to.be.equal('object');
      expect(lang.type(new Boolean(true))).to.be.equal('boolean');
      expect(lang.type(new Number(1))).to.be.equal('number');
      expect(lang.type(new String(''))).to.be.equal('string');
      expect(lang.type(new RegExp('\\s'))).to.be.equal('regexp');
    });
  });

})