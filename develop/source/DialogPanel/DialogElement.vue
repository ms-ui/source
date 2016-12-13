<template>
<div>
    <div>
        <dialog 
            is="dialog" class="dialog" :class="clazz" :style="dialogStyle"
            v-if="native">
            <slot></slot>
        </dialog>
    </div>
    <div class="dialog" :class='{poly: isModal}' v-if="!native && isShow">
        <div class="mask-layer" v-if="isModal"></div>
        <div class="main-wrapper" :class="clazz" :style="dialogStyle">
            <slot></slot>
        </div>
    </div>
</div>
</template>

<script type="text/javascript">
import util from '../base/util'
import Vue from 'vue'

import ui from '../base/ui'

var params = {
    isShow: false,
    isFull: false,
    isModal: false,
    native: true,
    style: {},
    clazz: [],
    x: 100,
    y: 100,
    width: 100,
    height: 100
}

export default {
    params: params,
    props: ['params'],
    mixins: [ui],
    methods: {
        show () {
            this.isShow = true
            if (this.native && this.$el.parentElement) {
                var dialog = this.$el.querySelector('dialog')
                dialog.show()
            }
            else if (this.isModal) {
                this.fixSize()
                setTimeout(() => {this.fixSize()}, 150);            }
        },
        showModal () {
            this.isShow = true;
            this.isModal = true;
            if (this.native && this.$el.parentElement) {
                var dialog = this.$el.querySelector('.dialog');
                dialog.showModal();
            }
            else if (this.isModal) {
                setTimeout(() => {this.fixSize()}, 200);
            }
        },
        fixSize () {
            var el = document.body.querySelector('.dialog-wrapper')
            if (!this.height && el) {
                this.height = el.clientHeight;
            }

            if (!this.width && el) {
                this.width = el.clientWidth;
            }
        },
        open () {
            this.isShow = true;
        },
        remove () {
            this.isShow = false;
            this.$el.remove();
        },
        close () {
            this.isShow = false;
            if (this.native) {
                this.$el.remove();
            }
        },
        hide () {
            this.isShow = false;
        }
    },
    computed: {
        dialogStyle () {
            if (!this.isModal) {
                return this.style;
            }
            var pos = {};

            // 原生样式不计算位置
            if (this.isModal && !this.native) {
                pos.left = Math.floor(
                (document.body.clientWidth - this.width) / 2) + 'px';
                pos.top = Math.floor(
                (document.body.clientHeight - this.height)/2) + 'px';

            }
            
            return Object.assign({
                width:  (this.width && this.width + 'px'),
                height: (this.height && this.height + 'px')
            }, this.style, pos);
        }
    }
}
</script>

<style type="text/css" lang="less">
.dialog {
    
    .main-wrapper {
        z-index: 999;
        background: #FFF;
        position: absolute;
        min-width: 200px;
        min-height: 100px;
    }
}
.dialog.poly {
    width: 100vw;
    height: 100vh;
    background: none;
    border: none;
    position: fixed;
    top: 0;
    left: 0;

    .mask-layer {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 777
    }
    .main-wrapper {
        position: absolute;
        left: 50%;
        width: 400px;
        background: #FFF;
    }
}
</style>
