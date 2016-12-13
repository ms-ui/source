var fs = require("fs")
var browserify = require('browserify')

exports.compact = function (conf) {
    browserify(conf.main)
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(fs.createWriteStream(conf.bundle))
}
