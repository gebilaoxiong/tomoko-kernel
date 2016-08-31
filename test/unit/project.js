/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-07-24 22:10:24
 * @description   项目测试
 */
var expect = require('chai').expect,

  pth = require('path'),

  fs = require('fs'),

  project = require('../../lib/project.js');


describe('测试项目：Project', function() {

  describe('#setProjectRoot()', function() {
    it('设置项目路径', function() {
      var path = './test/unit/test_project',
        result = pth.join(process.cwd(), '/test/unit/test_project')
        .replace(/\\/g, '/');

      project.setProjectRoot(process.cwd());

      expect(project.getProjectPath(path)).to.equal(result);
    });
  });

  /**
   * getProjectPath
   */
  describe('#getProjectPath()', function() {
    it('获取项目文件夹路径', function() {
      var result = pth.join(process.cwd(), '/')
        .replace(/\\/g, '/');

      expect(project.getProjectPath('')).to.equal(result);
    });


    it('获取项目文件夹下的文件路径', function() {
      var path = './node_modules',
        result = pth.join(process.cwd(), '/node_modules')
        .replace(/\\/g, '/');

      expect(project.getProjectPath(path)).to.equal(result);
    });
  });


  describe('#setTempRoot()', function() {
    it('设置临时文件夹路径', function() {
      var path = pth.join(process.cwd(), '/test/unit/test_temp/')
        .replace(/\\/g, '/');

      // 删除目录
      if(fs.existsSync(path)){
        fs.rmdirSync(path);
      }

      project.setTempRoot(path);
      expect(project.getTempPath('')).to.equal(path);
    });
  });


  describe('#getTempRoot()', function() {
    it('获取临时文件夹路径(设置了tempRoot)', function() {
      var result = pth.join(process.cwd(), '/test/unit/test_temp/')
        .replace(/\\/g, '/');

      expect(project.getTempPath('')).to.equal(result)
    });
  });

});