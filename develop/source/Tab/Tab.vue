<template>
<div class="tab-list comp" data-name="tab">
    <ul>
        <li v-for="item in items" class="tab" 
            :class="{double: item.children, active: item.tab == tab}">
            <a :data-tab="item.tab" @click="selectTab(item)">{{item.name}}</a>
            <div class="sub-tab" v-if="item.tab == tab && item.children">
                <ul>
                    <li v-for="sub in item.children"
                        :class="{focus: sub.tab == subTab}">
                        <a @click="selectTab(item, sub)">{{sub.name}}</a>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</div>
</template>

<script type="text/javascript">

import ui from '../base/ui'

const params = {
    tab: '',
    subTab: '',
    items: []
}

export default {
    params,
    mixins: [ui],
    methods: {
        selectTab (tab, subTab) {
            this.tab = tab.tab
            if (!subTab && tab.subTab) {
                subTab = tab.children.find(
                    (sub)=> {return sub.tab === tab.subTab}
                )
            }

            if (subTab && subTab.tab) {
                this.subTab = subTab.tab
            }
            else {
                this.subTab = ''
            }

            var data = Object.assign(
                {}, tab, {tab: tab.tab, subTab: '', children: ''}
            )
            if (subTab) {
                data = Object.assign(data, subTab, {tab: tab.tab, subTab: subTab.tab})
            }
            this.emit('tab-change', data)
        }
    }
}

</script>

<style type="text/css" lang="less">
.tab-list{
    background: #f5f5f5;
    border: 1px solid #e4e4e4;
    border-right: 0;
    border-left: 0;
    color: #333;
    padding-left: 16px;
    font-size: 14px;
    position: relative;

    ul{
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .tab {
        display: inline-block;
        vertical-align: top;
        &.double.active {
            height: 98px;
        }
        &.active > a {
            position: relative;
            box-sizing: border-box;
            border-bottom: 3px solid #39bd8b;
            color: #39bd8b;
            font-weight: bold;
            z-index: 1;
        }
        a {
            display: inline-block;
            height: 51px;
            margin-bottom: -1px;
            line-height: 50px;
            padding: 0 16px;
        }
        .sub-tab {
            position: absolute;
            left: 0;
        }
    }

    .sub-tab {
        box-sizing: border-box;
        height: 24px;
        width: 100%;
        padding: 13px 16px;
        border-top: 1px solid #e4e4e4;
        color: #333;
        font-size: 13px;
        font-weight: normal;
        ul {
            padding: 0 16px;
        }
        li {
            display: inline-block;
            margin-right: 10px;
            padding: 0 10px;
            border-radius: 3px;
            &.focus {
                border: 1px solid #39bd8b;
                color: #39bd8b;
                padding: 0 9px;
            }
        }
        a {
            height: 22px;
            padding: 0;
            line-height: 22px;
        }
    }
}
</style>
