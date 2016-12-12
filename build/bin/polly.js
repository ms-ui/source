
exports.fixV1 = function (fileInfo) {
    var content = fileInfo.content
    content = content
        .replace(/v-for="\(([a-z]+[,\s]+[a-z]+)\)/ig, function (ss, tt) {
           return ss.replace(tt, tt.split(',').reverse().join(','))
        })

    // 置换 v-ref
    content = content.replace(/ref="(\w+)"/ig, function (s, t) {return 'v-ref:' + t })
    fileInfo.content = content
}

exports.fixV2 = function (fileInfo) {
    var content = fileInfo.content
    content = content
        .replace(/v-for="\(([a-z]+[,\s]+[a-z]+)\)/ig, function (ss, tt) {
           return ss.replace(tt, tt.split(',').reverse().join(','))
        })

    // 置换 v-ref
    content = content.replace(/v-ref:(\w+)/ig, function (s, t) {return 'ref="' + t + '"' })
    fileInfo.content = content
}

exports.fixExtName = function (fileInfo) {
    var content = fileInfo.content

    // 文件后缀改为js
    content = content.replace(/\.vue/gi, '')

    // 文件输出后缀修改为js
    fileInfo.target = fileInfo.target.replace('.vue', '.js');

    fileInfo.content = content
}