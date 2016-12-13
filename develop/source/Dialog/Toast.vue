<template>
<div class="toast" :class="clazz" v-show="isShow">
    <slot>
        <div>{{title}}</div>
        <div>{{message}}</div>
    </slot>
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
        isShow: true,
        clazz: ['info']
    },
    methods: {
        show (option) {
            Object.assign(this, option)
            setTimeout(()=> {
                this.isShow = false
            }, this.delay);
        }
    }
}

</script>

<style type="text/css" lang="less">
@keyframes toast-opacity
{
    0%   {        
        opacity: 0;
    }
    50%   {
        opacity: 1;
    }
    75% {
        opacity: 0.75;
    }
    100%   {
        opacity: 0;
    }
}

.toast {
    position: absolute;
    top: 35%;
    left: 30%;
    text-align: center;
    font-size: 12px;
    padding: 5px 10px;
    background: #EEE;
    border: 1px solid #CCC;
    border-radius: 5px;
    animation: toast-opacity 2s;
}

.toast {
    &.info {
        border: 1px solid #d5f1fd;
        background-color: #eaf8fe;
    }
    &.tip {
        border: 1px solid #e7f6e1;
        background-color: #f3faf0;
        color: #777;
    }
    &.warn {
        border: 1px solid #fec;
        background-color: #fff7e6;
        color: #d00;
    }
    &.error {
        border: 1px solid #fdc;
        background-color: #ffeee6;
    }
}
</style>
