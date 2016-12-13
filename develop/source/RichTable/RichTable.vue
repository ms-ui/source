<template>
<div class="smui-table simple-table">
    <table @click="click">
        <thead v-for="hd in headRow" :class="hd">
            <tr>
                <td v-if="selected" data-col="select"
                    @mouseover="selectHover = true">
                    <input type="checkbox" class="select-all" 
                        v-model="checkAll" :checked="checkAll"
                        @click="selectAll" :id="hd + 'checkall-ipt'">
                    <div v-if="checkAll && needCheckAllPages" 
                        class="select-flip"
                        v-show="selectHover"
                        @mouseout="selectHover = false">
                        <label :for="hd + 'checkall-ipt'">
                            <input type="checkbox" class="select-all" 
                            v-model="checkAll" :checked="checkAll"
                            @click="selectAll">
                            选择本页</label>
                        <label>
                            <input type="checkbox" v-model="checkAllPages"
                                :checked="checkAll && checkAllPages"
                                @click="checkAllPages == true">选全部
                        </label>
                    </div>
                </td>
                <td v-for="field in fields" :data-col="field">
                    <div v-html="headFilter(field)" 
                        :style="{width: fieldWidth[field] || '100px'}"></div>
                    <div class="plugin-items" v-html="headPlugin(field)"></div>
                </td>
            </tr>
        </thead>
        <tbody>
        <tr v-for="(row, item) in items">
            <td v-if="selected" :data-col="select">
                <input type="checkbox" v-model="selected" :value="row"></input>
            </td>
            <td v-for="field in fields"
                :data-col="field" :data-row="row">
                <div v-html="cellFilter(field, item)"></div>
                <div class="plugin-items" v-html="cellPlugin(field, item)"></div>
            </td>
        </tr>
        </tbody>
    </table>
</div>
</template>

<script type="text/javascript">

import Vue from 'vue'
import ui from '../base/ui'

// 接口属性
var params = {
    cellTextMap: {},
    headTextMap: {},
    selected: [],
    fields: [],
    items: [],
    fieldWidth: {},
    headRow: ['fixed', 'origin']
}

// 私有属性
var states = {
    selectHover: false,
    checkAllPages: false, 
    needCheckAllPages: true,
    canCheckAllPages: false, // 需要选择全部数据
    indeterminate: false,
    checkAll: false
}

export default {
    params: params,
    private: states,
    mixins: [ui],
    computed: {
        checkAll () {
            if (this.selected.length === 0) {
                this.indeterminate = 0
                return false
            }
            else if (this.selected.length === this.items.length) {
                this.indeterminate = 2
                return true
            }
            else if (this.selected.length < this.items.length) {
                this.indeterminate = 1
                return false
            }
        }
    },
    watch: {
        selected (value) {
            this.emit('selected-changed', value)
        },
        indeterminate (value) {
            var $all = this.$el.querySelectorAll('.select-all')
            for (let item of $all) {
                item.checked = value === 2
                item.indeterminate = value === 1
            }
        }
    },
    methods: {
        click (event) {
            var option = event.target.dataset;
            var target = event.target.closest('td');
            this.emit('td-click', target);
            if (this.action && option.action 
                && this.action.hasOwnProperty(option.action)) {
                var row = target.dataset.row;
                event.data = this.items[+row];
                event.field = target.dataset.col;
                event.option = option;
                this.action[option.action].call(this, event);
            }
        },
        selectAll (e) {
            if (e.target.checked) {
                this.selected = this.items.map((item, idx) => {return idx})
            }
            else {
                this.selected = [];
            }
        },
        setFields (fields) {
            this.fields = fields;
        },
        setItems (items) {
            this.items = items;
        },
        getSelected () {
            return this.selected || [];
        },
        setSelected (value) {
            this.selected = value;
        },
        headFilter (field) {
            if (this.headTextMap) {
                return this.headTextMap[field] || field;
            }
            else {
                return field;
            }
        },
        cellFilter (key, item) {
            var value = item[key];
            var cellTextMap = this.cellTextMap;
            if (cellTextMap && typeof cellTextMap[key] === 'function') {
                return item && cellTextMap[key].call(this, item[key], item, key);
            } else if (cellTextMap && cellTextMap.fieldFilter) {
                // 如果没有对应字段处理函数，使用默认通用字段解析函数（fieldFilter）
                return item && cellTextMap.fieldFilter.call(this, item[key], item, key);
            }
            else {
                return value === null ? (this.emptyText || '-') : item[key];
            }
        },
        headPlugin (field) {

        },
        cellPlugin (field, item) {

        }
    }
};

</script>

<style type="text/css" lang="less">
.simple-table {
    border: 1px solid #e4e4e4;
    border-top: none;
    border-right: none;
    .select-flip {
        position: absolute;
        z-index: 9;
        width: 80px;
        height: 75px;
        padding: 6px;
        line-height: 2rem;
        border: 1px solid #DDD;
        top: -1px;
        left: -1px;
        border-radius: 2px;
        box-shadow: 2px 2px #CCC;
        background-color: #EEE;
        label {
            width: auto!important;
            display: block;
        }
    }
    .plugin-items {
        display: inline-block;
        position: absolute;
        right: 5px;
        top: 10px;
    }
    thead.fixed {
        width: 100%;
        position: absolute;
        display: none;
    }
    table {
        border-spacing: 0;
        width: 100%;
    }
    thead {
        background-color: #f5f5f5;
        tr td {
            line-height: 2em;
            vertical-align: baseline;
            background: #EEE;
        }
    }

    td[data-col="select"] {
        width: 50px;
    }
    td {
        color: #333;
        font-size: 12px;
        line-height: 1.5em;
        border-top: 1px solid #e4e4e4;
        border-right: 1px solid #e4e4e4;
        padding: 8px 5px;
        position: relative;
        vertical-align: middle;
    }
}
</style>
