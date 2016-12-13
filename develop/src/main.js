import Vue from 'vue'
window.Vue = Vue

import App from 'components/App.vue'
import Dialog from 'smui/Dialog'
console.log('Vue.version = [%s]' , Vue.version)

require('smui/style/skin.less')
require('./css/main.less')

let dataList = new Array(100).fill(8).map(
    (item, idx) => {
        return {
            title: 'user' + idx,
            author: 'author' + idx,
            visitor: 'visitor' + idx + 5
        }
    }
);

let treeData = [
    {
        name: '前端',
        link: '#front',
        children: [
            {name: 'JS', link:'#js'},
            {name: 'HTML', link:'#html'},
            {name: 'CSS', link:'#css'}
        ]
    },
    {
        name: 'Java',
        link: '#front',
        children: [
            {name: 'Java', link:'#js'},
            {name: 'J2EE', link:'#html'},
            {name: 'J2ME', link:'#css'}
        ]
    },
    {
        name: 'PHP',
        link: '#front',
        children: [
            {name: 'php', link:'#js'},
            {name: 'smarty', link:'#html'},
            {name: 'fuel', link:'#css'}
        ]
    }
]

let tabList = [
    {name: '表格', tab: 'table'},
    {name: '表单', tab: 'form'},
    {
        name: '消息',
        tab: 'dialog',
        subTab: 'message',
        children: [
            {name: '消息', tab: 'message'},
            {name: '弹窗', tab: 'dialog'}
        ]
    }
]

let scrumList = [
    {text: '计划', name: 'plan'},
    {text: '单元', name: 'unit'},
    {text: '关键词', name: 'keyword'}
]

let searchTitle = ''




let AppDemo = {
    extends: App,
    data() {
        return {
            params: {
                searchTitle,
                scrumList,
                tabList,
                dataList,
                treeData
            }
        }
    }
}

let app = new Vue({
    components: {App: AppDemo}
}).$mount('#main')
