'use strict';

var path = require('path')
var fs = require('fs')
var vueify = require('vueify')
var vue = require('vue')
var compiler = vueify.compiler;

var babel = require('babel-core')


exports.buildVue = function (fileInfo, callback) {
    try {
        compiler.compile(
            fileInfo.content,
            fileInfo.realPath,
            function (err, result) {
                if (err) {
                    console.error(err)
                }
                fileInfo.content = result;
                callback && callback(fileInfo)
            }
        );
    } catch (e) {
        console.log(e.stack);
    }
};

exports.build = function (fileInfo, callback) {
    if (fileInfo.extname === '.vue') {
        exports.buildVue(fileInfo, callback)
        return 200
    }
    else {
        if (fileInfo.name === 'index.js') {
            // 如果是index.js文件，则创建模块别名
            fileInfo.alias = fileInfo.target.replace('/index', '')
        }
        fileInfo.content = babel.transform(
            fileInfo.content, {"presets": ["es2015"]}).code;
        callback && callback(fileInfo)
        return 15
    }
}

