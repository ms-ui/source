var util = require('../base/util');

function Help(option) {
    this.el = option.el;
    this.name = option.name;
    this.maxLen = option.maxLen;
    this.wildcard = option.wildcard;
    this.el.placeholder = '';
    this.bindEvents()
}

Help.prototype.change = function () {
    if (this.maxLen) {
        var value = this.el.value;
        if (this.wildcard) {
            value = value.replace(/{|}/g, '');
        }
        var byteLen = util.byteLength(value);
        if (!this.el.validationMessage) {
            this.el.message = '还可输入' + (this.maxLen - byteLen ) + '个字符';
        }
    }
};

Help.prototype.bindEvents = function () {
    this.el.addEventListener('change', this.change.bind(this));
    this.el.addEventListener('keyup', this.change.bind(this));
};

module.exports = Help;