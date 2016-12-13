<template>
<div class="info-sign" v-on:mouseover="showInfo" v-on:mouseout="hideInfo">
    <i class="sm-question" @click="showInfo"></i>
    <div class="info" v-show="auto || show">
        <slot>{{content}}</slot>
    </div>
</div>
</template>

<script type="text/javascript">
/**
 * ### 气泡信息提示
 *
 * @props
 * ** auto
 *     - 是否自动显示气泡
 *
 * @slot
 *     - 内容自动为气泡中内容
 */

import ui from '../base/ui'
export default {
    mixins: [ui],
    data () {
        return {
            show: false,
            auto: false,
            content: '信息'
        }
    },
    methods: {
        showInfo () {
            this.show = true
        },
        hideInfo () {
            this.show = false
        }
    }
}

</script>

<style type="text/css" lang="less">
.info-sign {
    position: relative;
    line-height: 1.5em;
    padding: 5px 0;
    display: inline;
    .info {
        box-sizing: border-box;
        position: absolute;
        background: #FFF;
        display: block;
        top: 32px;
        left: -102px;
        width: 216px;
        padding: 8px 16px;
        border: 1px solid rgba(34,36,38,.2);
        border-radius: 4px;
        box-shadow: 0 2px 3px rgba(34,36,38,.15);
        color: #333;
        font-size: 13px;
        font-weight: normal;
        line-height: 1.8;
        z-index: 999;

        &:after, &:before {
            content: '';
            position: absolute;
            left: 102px;
            border: 6px solid transparent;
            border-bottom-width: 10px;
        }
        &:before {
            top: -17px;
            border-bottom-color: rgba(34,36,38,.2);
        }
        &:after {
            top: -16px;
            border-bottom-color: #FFF;
        }
    }
}
</style>
