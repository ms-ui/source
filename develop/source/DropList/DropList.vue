<template>
<div class="command-list button" 
    @mouseleave="show = false" 
    :class="{disabled: disabled}">
    <label class="title" @click="show = !show" :disabled="disabled">{{title}} 
        <i class="drop-icon sm-arrow-dropdown"></i></label>
    <div class="layer" @click="selectItem" v-show="show && !disabled">
        <slot></slot>
    </div>
</div>
</template>

<script type="text/javascript">
import ui from '../base/ui'

var params = {
    value: '',
    name: '',
    title: '选择操作',
    mod: 'command',
    disabled: false,
    show: false
}

export default {
    params,
    mixins: [ui],
    methods: {
        selectItem (e) {
            let target = e.target
            if (target.tagName !== 'LI' && target.tagName !== 'A') {
                return
            }
            this.name = target.textContent
            

            if (this.mod === 'select') {
                this.title = this.name
                this.value = target.value
            }

            this.show = false
            this.emit('select-change', {
                value: this.value,
                name: this.name
            })
        }
    }
}
</script>
<style type="text/css" lang="less">
.command-list {
    position: relative;
    display: inline-block;
    min-width: 100px;
    border: 1px solid #DDD;
    border-radius: 2px;
    cursor: pointer;

    .layer {
        border: 1px solid #DDD;
        min-width: 86px;
        position: absolute;
        top: 28px;
        left: 0;
        background: #FFF;
        z-index: 777;
        padding: 5px 0;
        border: 1px solid #DDD;
    }

    li {
        padding: 0 10px;
        line-height: 2em;
    }

    li:hover {
        background-color: #EEE;
        color: #39bd8b;
    }
}
.command-list:disabled {
    color: #EEE;
    .layer {
        display: none !important;
    }

}
</style>
