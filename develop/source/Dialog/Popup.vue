<template>
<div class="popup" :class="clazz" v-if="isShow">
    <i class="sm-close close" @click="close"></i>
    <div class="title" v-if="title">{{title}}</div>
    <div class="content" v-html="message"></div>
    <div class="footer" v-if="needClose">
        <div class="close-button button" @click="close">关闭</div>
    </div>
</div>

</template>
<script type="text/javascript">
import ui from '../base/ui'

export default {
    mixins: [ui],
    params: {
        message: '',
        title: '',
        delay: 2000,
        needClose: false,
        isShow: false
    },
    methods: {
        show (option) {
            Object.assign(this, option)
            this.isShow = true
            if (this.delay !== false) {
                setTimeout(()=> {
                    this.isShow = false
                }, this.delay)
            }
        },
        close () {
            this.isShow = false
            this.emit('close')
        }
    }
}

</script>

<style type="text/css" lang="less">
.popup {
    position: fixed;
    z-index: 9999;
    bottom: 10px;
    right: 10px;
    padding: 10px;
    font-size: 12px;
    border: 1px solid #CCC;
    border-radius: 5px;
    min-width: 250px;
    background: #FFF;


    .close {
        position: absolute;
        top: 5px;
        right: 5px;
    }

    .title {
        background: #EEE;
        border-bottom: 1px solid #CCC;
        line-height: 2em;
        padding-left: 10px;
    }

    .content {
        padding: 40px 10px 20px;
        min-height: 30px;
        max-width: 300px;
    }
    .footer {
        height: 40px;
    }
    .close-button {
        float: right;
        color: #FFF;
        border: 1px solid #39bd8b;
        background: linear-gradient(rgba(57, 189, 139, 0.7),#39bd8b);
    }
}
</style>
