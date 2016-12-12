// 必须放在最开始
process.env.NODE_ENV = 'production'

require('shelljs/global')
var walk = require('walk')
var fs = require('fs')
var polly = require('./bin/polly')
var build = require('./bin/build')
var pack = require('./bin/pack')

var spawn = require('child_process').spawn;

var path = require('path')
var package = require('./package.json');
var config = package.buildConf
var mdName = process.argv[2] || 'prod'


var targetDir = path.resolve(__dirname, config.output)
var sourceDir = path.resolve(__dirname, config.source)

rm('-rf', targetDir)
mkdir('-p', targetDir)

function start() {
    walker = walk.walk(sourceDir, {
         followLinks: false,
         filters: ['doc', 'node_modules']
    })

    walker.on('file', function (root, fileStats, next) {
        var filePath = path.resolve(root, fileStats.name)
        var targetPath = filePath.replace(sourceDir, targetDir)
        var content = fs.readFileSync(filePath)

        var fileInfo = {
            name: fileStats.name,
            realPath: filePath,
            extname: path.extname(filePath),
            content: content,
            target: targetPath
        }

        // 编译构建内容
        if (fileInfo.extname.match(/\.(js|vue)/)) {
            fileInfo.content = fileInfo.content.toString('utf8')
            polly.fixV1(fileInfo)
            polly.fixExtName(fileInfo)
            build.build(fileInfo)
        }

        // 写入文件
        fs.writeFileSync(fileInfo.target, fileInfo.content)
        next()
    });

    walker.on('directory', function (root, dirStat, next) {
        var dirname = path.resolve(root, dirStat.name)
        var tdir = dirname.replace(sourceDir, targetDir)
        mkdir('-p', tdir)
        next()
    });

    walker.on("errors", function (root, nodeStatsArray, next) {
        next()
    });

    // 构建结束打包所有文件
    walker.on('end', function () {
        pack.compact({
            main: path.resolve(targetDir, config.main),
            bundle: path.resolve(targetDir, config.bundle)
        })
    })
}

//process.env.NODE_ENV = 'dev'

// spawn(" open 'http://127.0.0.1:8080/?port=5858' ")
setTimeout(start, 500)




