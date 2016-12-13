<template>
<div class="press-tab">
    <slot>
    <a v-for="item in items"
        :class="{active: value == item.name}"
        @click="changeTab(item.name)"
        >{{item.text || item.name}}</a>
    </slot>
</div>
</template>

<script type="text/javascript">

import ui from '../base/ui'

const params = {
    items: [],
    tab: ''
}

export default {
    params,
    mixins: [ui],
    methods: {
        changeTab (tab) {
            this.tab = tab;
            this.emit('tab-change', {tab});
        }
    }
};

</script>

<style type="text/css" lang="less">
.press-tab {
    height: 30px;
    display: inline-block;
    border: 1px solid #CCC;
    border-radius: 5px;
    background-color: #FFF;
    margin: 10px 18px;
    a {
        display: inline-block;
        width: 84px;
        line-height: 30px;
        border-right: 1px solid #CCC;
        padding: 0 5px;
        text-align: center;
        background-color: #FFF;
        float: left;
        color: #333;
        background: linear-gradient(#FFF, #ebebeb);
        cursor: pointer;
    }
    a.active {
        background: linear-gradient(#ebebeb, #FFF);
        cursor: auto;
    }
    a:first-child {
        border-radius: 5px 0px 0px 5px;
        border-right: 1px solid #CCC;
    }
    a:last-child {
        border-radius: 0px 5px 5px 0;
        border-right: 0;
    }
}
</style>
