import Vue from 'vue'

exports.extend = function (target, source) {
    Object.assign(target, source);
    return target;
};

exports.isEqual = function (obj, target) {
    return Object.is(obj, target);
};

exports.byteLength = function (str) {
    return str.replace(/[^\x00-\xff]/g, 'xx').length;
};

exports.wrapper = function (Comp) {
    if (Vue.version.charAt(0) > 1) {
        return function (option) {
            option.extends = Comp
            return new Vue(option)
        }
    }
    else if (Vue.extend) {
        return Vue.extend({
            mixins: [Comp],
            el() {
                var dom = document.createElement('div');
                dom.class = 'dialog-instance';
                document.body.appendChild(dom);
                return dom;
            }
        })
    }
}