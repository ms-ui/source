// 必须放在最开始
var releaseType = process.argv[2] || 'production'
process.env.NODE_ENV = releaseType

require('shelljs/global')
var walk = require('walk')
var fs = require('fs')
var polly = require('./bin/polly')
var build = require('./bin/build')
var pack = require('./bin/pack')

var spawn = require('child_process').spawn;
var path = require('path')

var package = require('./package.json');
var pwdir = process.cwd();
var pkg = path.resolve(pwdir, 'package.json')

if (fs.existsSync(pkg)) {
    package = require(pkg)
}

var config = package.buildConf
var targetDir = path.resolve(pwdir, config.output)
var sourceDir = path.resolve(pwdir, config.source)

rm('-rf', targetDir)
mkdir('-p', targetDir)

function start() {
    var delay = 0;
    walker = walk.walk(sourceDir, {
         followLinks: false,
         filters: ['doc', 'node_modules']
    })

    walker.on('file', function (root, fileStats, next) {
        var filePath = path.resolve(root, fileStats.name)
        var targetPath = filePath.replace(sourceDir, targetDir)
        var content = fs.readFileSync(filePath)
        var waiting = 0;

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

            // 根据当前vue的版本切换修复目标
            if (config.version === '2') {
                polly.fixV2(fileInfo)
            }
            else {
                polly.fixV1(fileInfo)
            }

            polly.fixExtName(fileInfo)
            waiting = build.build(fileInfo)
        }

        if (waiting) {
            delay += waiting
            setTimeout(function () {
                // 写入文件
                fs.writeFileSync(fileInfo.target, fileInfo.content)

                // 只有子目录的文件夹需要建立alias文件
                if (fileInfo.alias && sourceDir !== root) {
                    var moduleName = path.basename(path.dirname(fileInfo.target))
                    fs.writeFileSync(fileInfo.alias, fileInfo.content.replace('./', './' + moduleName + '/'))
                }
            }, 300);
        }
        else {
            fs.writeFileSync(fileInfo.target, fileInfo.content)
        }
        
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
        setTimeout(function () {
            pack.compact({
                main: path.resolve(targetDir, config.main),
                bundle: path.resolve(targetDir, config.bundle)
            })
        }, delay);
    })
}

//process.env.NODE_ENV = 'dev'

// spawn(" open 'http://127.0.0.1:8080/?port=5858' ")
start()




