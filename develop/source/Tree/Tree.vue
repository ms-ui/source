<template>
<div class="tree-wrapper">
    <ul :class="clazz">
        <li v-for="item in items" class="tree-item">
            <div :data-id="item.id">
                <i v-if="item.children" @click="toggle(item)" class="sm-add"></i>
                <i v-else="item.children" class="sm-plan"></i>
                <span @click="clickItem(item)" class="item">{{item.name}}</span>
            </div>
            <div :id="'node-' + item.id">
                <tree-node :params="{items: item.children}"
                    @item-clicked="clickSub"
                    v-if="item.children"></tree-node>
            </div>
        </li>
    </ul>
</div>
</template>

<script type="text/javascript">

import ui from '../base/ui'

var params = {
    clazz: ['tree-list'],
    items: [],
    title: '',
    showItem: ''
}

export default {
    name: 'tree-node',
    params: params,
    mixins: [ui],
    methods: {
        toggle (item) {
            let node = this.$el.querySelector('#node-' + item.id)
            let display = item.fold ? 'block' : 'none'
            item.fold = !item.fold
            if (node) {
                node.style.display = display
            }
            this.emit('toggle', item)
        },
        clickItem (item) {
            this.emit('item-clicked', item)
        },
        clickSub (e) {
            this.emit('item-clicked', e.data)
        }
    }
}
</script>

<style type="text/css" lang="less">
.tree-wrapper {
    ul {
        margin-left: 1rem;
        list-style-type: none;
        padding: 10px;
    }
    .list-icon {
        display: inline;
        margin-right: 10px;
        color: #777;
    }
    li {
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        span {
            text-decoration: none;
            display: inline-block;
            color: #777;
            font-size: 14px;
            display: inline-block;
            margin-left: 15px;
            width: 100%;
        }

        span:hover {
            color: #42b983;
        }

        i {
            color: #777;
            position: absolute;
            top: 4px;
            font-size: 0.6em;

        }
    }

    .expand-transition {
        transition: all .7s ease;
        height: auto;
        padding: 10px;
    }

    /* .expand-enter 定义进入的开始状态 */
    /* .expand-leave 定义离开的结束状态 */
    .expand-enter, .expand-leave {
        height: 0;
        padding: 0 10px;
        opacity: 0;
    }
}
</style>
