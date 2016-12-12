'use strict';

var path = require('path');
var fs = require('fs');
var compiler = require('vueify-sync').compiler;

var babel = require('babel-core')


exports.buildVue = function (fileInfo) {
    try {
        fileInfo.content = compiler.compileSync(fileInfo.content, fileInfo.realPath);
    } catch (e) {
        console.log(e.stack);
    }
};

exports.build = function (fileInfo) {
    if (fileInfo.extname === '.vue') {
        exports.buildVue(fileInfo)
    }
    else {
        fileInfo.content = babel.transform(fileInfo.content).code;
    }
}

