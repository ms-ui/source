var fs = require("fs")
var browserify = require('browserify')
//var vueify = require('vueify')

// browserify('../asset/index.js')
// //  .transform(vueify)
//   .bundle()
//   .pipe(fs.createWriteStream("../asset/bundle.js"))


    
// browserify('../asset/index.js')
//     .transform("babelify", {presets: ["es2015", "react"]})
//     .bundle()
//     .pipe(fs.createWriteStream("../asset/bundle.js"))


exports.compact = function (conf) {
    browserify(conf.main)
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(fs.createWriteStream(conf.bundle))
}
