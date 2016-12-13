import util from '../base/util'
import DialogPanel from '../DialogPanel/index'
import Prompt from './Prompt.vue'
import Toast from './Toast.vue'
import InlineDialog from './InlineDialog.vue'
import Loading from './Loading.vue'
import Popup from './Popup.vue'

var Dialog = util.wrapper(DialogPanel)
Dialog.InlineDialog = InlineDialog
Dialog.DialogPanel = DialogPanel
Dialog.Toast = Toast

Dialog.toast = function (option) {
    let Factor = util.wrapper(Toast)
    let toast = new Factor()
    toast.show(option)
    return toast
}

Dialog.popup = function (option) {
    let Factor = util.wrapper(Popup)
    let pop = new Factor()
    pop.show(option)
    return pop;
}

Dialog.loading = function (option) {
    let Factor = util.wrapper(Loading)
    let loading = new Factor()
    loading.show(option)
    return loading;
}

Dialog.alert = function (message, ensure) {
    var dialog = new Dialog({
        data: {
            width: '200'
        }
    });

    if ('string' === typeof message) {
        message = {
            content: message,
            needClose: false,
            needCancel: false
        }
    }

    dialog.showModal(message);
    dialog.$on('ensure', function () {
        ensure && ensure.call(dialog);
        dialog.close();
    });
    return dialog;
};

Dialog.confirm = function (message, ensure, cancel) {
    var dialog = new Dialog({
        data: {
            width: 200,
            needClose: false,
            needCancel: true
        }
    });

    if ('string' === typeof message) {
        message = {
            content: message,
        }
    }

    dialog.showModal(message);
    dialog.$on('ensure', function () {
        ensure && ensure.call(dialog);
        dialog.close();
    });

    dialog.$on('closed', function () {
        cancel && cancel.call(dialog);
    });
    return dialog;
};


Dialog.prompt = function (option, ensure, cancel) {
    if (typeof option === 'string') {
        option = {
            title: option,
            type: 'text'
        }
    }

    if (option.options) {
        option.type = 'select';
    }
    if (!option.type) {
        option.type = 'text';
    }
    if (!option.error) {
        option.error = '';
    }
    option.needClose = false;

    var c = option.container;

    var dialog = new Dialog({
        container: c,
        data: option,
        content: Prompt
    });

    if (option.container) {
        dialog.show(option);
    }
    else {
        dialog.showModal();
    }

    dialog.$on('finished', function (e) {
        ensure && ensure.call(dialog, e.value);
        dialog.close();
    });

    dialog.$on('cancel', function () {
        cancel && cancel.call(dialog);
        dialog.close();
    });
    return dialog;
};

exports.inlineEdit = function (option, ensure, cancel) {
    option = Object.assign(option, {inline: true, needClose: true, needFooter: true});
    return exports.prompt(option, ensure, cancel);
};

Object.assign(Dialog, exports);

module.exports = Dialog