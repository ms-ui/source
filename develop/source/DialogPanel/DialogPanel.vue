<template>
<div class="dialog-panel" :class="clazz">
    <dialog-element :params="{native: native, style: dialogStyle, width: width, height: height}" v-ref:dialog>
        <div class="close rotate sm-close" @click="close" v-if="needClose"></div>
        <div class="dialog-wrapper" :class="{'pad-bottom': needFooter}">
            <div class="header" v-if="title">
                <slot name="title">
                    <div :show="title" v-html="title"></div>
                </slot>
            </div>
            <div class="content">
                <slot name="content">
                    <component 
                        :is="contentView"
                        :params="data"
                        v-if="comps[contentView]"
                        v-ref:view>
                    </component>
                    <div v-else="comps[contentView]" v-html="content"></div>
                </slot>
            </div>
            <div class="footer" v-if="needFooter">
                <slot name="footer">
                    <div class="default-bottom">
                        <button class="button ensure-button" @click="ensure">{{ensureText}}</button>
                        <button class="button cancel-button" @click="close" v-if="needCancel">{{cancelText}}</button>
                    </div>
                </slot>
            </div>
        </div>
    </dialog-element>
</div>
</template>

<script type="text/javascript">
import ui from '../base/ui'
import Vue from 'vue'
import DialogElement from './DialogElement.vue'

// 判断浏览器是否完整支持Dialog特性
const isNative = !!(document.createElement('dialog') || {}).showModal;

const params = {
    title: '',
    content: '',
    native: isNative, // 是否使用原生的Dialog元素增强体验
    removeOnClose: true, // 关闭删除寄生元素
    ensureText: '确定',
    cancelText: '取消',
    clazz: {full: false},
    needClose: true,
    needFooter: true,
    data: {},
    style: {},
    width: '',
    height: '',
    headerView: 'head',
    contentView: 'ContentView',
    footerView: 'foot',
    needCancel: true
}

function getContainer() {
    var dom = document.createElement('div');
    dom.id = 'dialog-instance';
    var panel = document.querySelector('#dialog-container-wrapper');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'dialog-container-wrapper';
        document.body.append(panel);
    }
    panel.appendChild(dom);
    return dom;
}

export default {
    params: params,
    replace: false,
    mixins: [ui],
    created () {
        let content = this.$options.content
        if (typeof content === 'object') {
            if (Vue.version.charAt(0) === '1') {
                content = Vue.extend(content)
            }
            this.$options.components.ContentView = content 
        }
        else if (typeof content === 'string') {
            this.content = content
        }
    },
    ready () {
        this.$dialog = this.$refs.dialog;
    },
    components: {
        DialogElement: DialogElement
    },
    methods: {
        appendTo (container) {
            container.appendChild(this.$el);
        },
        showModal (option) {
            this.show(option, true)
        },
        set (option) {
            if (typeof option === 'string') {
                option = {
                    content: option
                };
            }
            Object.assign(this, option);
        },
        delegateEvent (target) {
            // 代理子元素的所有事件
            var $vm = this;
            // 绑定引用，方便调用
            $vm.view = target;
            target.$emit = (function (type, e) {
                //$vm.$emit.apply($vm, Array.prototype.slice(arguments, 0))
                $vm.$emit(type, e)
            }).bind(target)
        },
        show (option, isModal) {
            this.set(option);

            // 如果没有指定el元素，则需要创建并且挂载之
            if (!this.$el || !this.$el.parentElement) {
                this.$mount(getContainer(option))
            }

            // 调用dialogElement的showModal方法
            if (isModal) {
                this.$refs.dialog.showModal();
            }
            else {
                this.$refs.dialog.show();
            }

            // 如果是子组件注入，采用事件代理机制
            if (this.$refs.view) {
                this.delegateEvent(this.$refs.view)
            }
        },
        ensure: function ensure() {
            let view = this.$refs.view
            if (view && view.ensure) {
                view.ensure()
            }
            else {
                this.$emit('ensure');
            }
        },
        close () {
            this.$emit('closing');
            if (this.$dialog.open) {
                this.$dialog.close();
            }
            this.$emit('closed');
        },
        hide () {
            this.$dialog.hide();
            this.$emit('hide');
        }
    },
    computed: {
        comps () {
            var comps = {};
            for (var key in this.$options.components) {
                comps[key] = key;
            }
            return comps;
        }
    }
}

</script>

<style type="text/css" lang="less">
    @border-radius: 4px;

    .wild-dialog {
        .dialog {
            left: 30%;
            top: 10%;
        }
    }

    .dialog {
        position: absolute;
        min-width: 180px;
        padding: 0;
        border: 1px solid rgba(34,36,38,.2);
        border-radius: @border-radius;
        box-sizing: border-box;
        box-shadow: 0 2px 3px rgba(34,36,38,.15);
        background-color: #FFF;
        z-index: 80;
        .header {
            margin: 0;
            font-size: 13px;
            border-radius: 4px 4px 0 0;
            color: #333;
            box-sizing: border-box;
            height: 40px;
            padding: 10px 38px 10px 16px;
            border-bottom: 1px solid #e4e4e4;
            background-color: #f5f5f5;
            line-height: 20px;
        }
        .content {
            padding: 28px;
            display: block;
            min-width: 120px;
        }
        .dialog-wrapper.pad-bottom {
            position: relative;
        }
        .footer {
            padding: 12px 16px;
            bottom: 0;
            border-top: 1px solid #e4e4e4;
            width: 100%;
            /*position: absolute;*/
            box-sizing: border-box;

            .default-bottom {
                text-align: right;
                min-width: 100px;
            }
            button {
                margin-left: 5px;
                cursor: pointer;
                width: 56px;
                min-width: 20px;
                line-height: 24px;
                height: 24px;
            }
            .ensure-button{
                &:hover{
                    border: 1px solid #2bbc89;
                }
            }

            .cancel-button {
                padding: 0;
                border: 0;
                width: 28px;
                background-color: #fff;
                outline-color: #fff;
                background-image: none;
                margin-left: 13px;
                margin-right: 0px;
            }
        }
        &::backdrop {
            background-color: rgba(0, 0, 0, 0.2);
        }
        .close {
            position: absolute;
            cursor: pointer;
            right: 11px;
            top: 12px;
            font-size: 14px;
            color: #333;
            z-index: 3;
        }
    }

    .dialog.fixed {
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
    }
    .dialog.full {
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        overflow: auto;
    }

    .dialog.inline {
        padding-bottom: 0;
        min-width: 150px;
        .close {
            right: 2px;
            top: 2px;
        }
        .footer {
            display: none;
        }
        .content {
            min-height: 20px;
            padding: 5px;
        }
    }
</style>
