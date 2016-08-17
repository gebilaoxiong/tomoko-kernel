/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-08-15 15:52:37
 * @description   资源编译
 */

module.exports = function(options, callback) {
  var files = tomoko.project.getSource();

  // 编译yml等资源
  tomoko.util.each(files, function(file, subpath) {

    // beforeEach
    if (options.beforeCompile) {
      options.beforeCompile(file, files);
    }

    // 编译
    file = tomoko.compile(file);

    // afterEach
    if (options.afterCompile) {
      options.afterCompile(file, files);
    }
  });

  if (callback) {
    callback(files);
  }
};