<template>
<div class="line-box" :style="style">
    <ul class="line-list">
        <li v-for="n in rows" v-if="rows > 0">{{ n + 1 }}</li>
    </ul>
    <div class="textarea-container" :style="style">
        <textarea :disabled="textareaDisabled == 1"
            v-model="contentText"
            class="input-textarea"></textarea>
    </div>
</div>
</template>
<script type="text/javascript">
var Vue = require('vue');
var util = require('./util');

import ui from '../base/ui'

var params = {
    contentText: '',
    rows: 10,
    cols: 30,
    doms: {
        textarea: null,
        ulNum: null
    },
    textareaDisabled: false
}

export default {
    params,
    mixins: [ui],
    computed: {
        style: function(){
            return {
                width: this.cols + 'rem',
                height: this.rows + 'rem'
            };
        }
    },
    methods: {
        textChanged: function(e) {
            var lines = this.contentText.split('\n')
            this.rows = lines.length
            this.emit('text-changed', lines)
        }
    },
    watch:{
        'contentText' (){
            this.textChanged();
        }
    }
}

</script>
<style type="text/css" lang="less">
.line-box {
    position: relative;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    min-height: 10rem;
    box-sizing: content-box;
    overflow: hidden;

    .line-list {
        display: block;
        width: 30px;
        text-align: center;
        background-color: #e3e3e3;
        padding-top: 2px;
        font-size: 13px;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;

        li {
            height: 25px;
            line-height: 25px;
            text-align: center;
        }
    }

    .textarea-container {
        padding-left: 35px;
        box-sizing: border-box;
    }

    textarea {
        width: 100%;
        font-size: 13px;
        border: 0;
        outline: none;
        line-height: 25px;
        min-height: 200px;
        overflow: hidden;
        padding-left: 5px;
    }
}
</style>
