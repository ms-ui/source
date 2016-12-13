<template>
<div class="app-demo">
    <div class="header-line">
        <button @click="createPlan">+ 新建文章</button>
        
        <drop-list :params="{mod:'command', title: '批量操作', disabled: true}"
            @select-change="changeCommand" v-ref:batch>
            <ul>
                <li>删除</li>
                <li>修改</li>
                <li>启用</li>
                <li @click="op">暂停</li>
            </ul>
        </drop-list>
        <drop-list :params="{mod:'select', title: '选择状态'}"
            @select-change="changeStatus">
            <ul>
                <li :value="1">已开始</li>
                <li :value="2">已删除</li>
            </ul>
        </drop-list>
        <div class="pad-wrapper">
            <date-picker></date-picker>
        </div>
    </div>
    <rich-table :params="tableConf"
          @selected-changed="changeSelected" v-ref:table>
        </rich-table>
    <pager
        :params="pageInfo"
      @page-change="changePage"
      @size-change="changePage"
      @list-change="changeList">
    </pager>
</div>
</template>

<script type="text/javascript">
import tableConf from './tableConf'
import RichTable from 'smui/RichTable'
import DropList from 'smui/DropList'
import DatePicker from 'smui/DatePicker'
import Pager from 'smui/Pager'
import Dialog from 'smui/Dialog'

import Form from './Form.vue'

let dataList = new Array(100).fill(1).map(
    (item, idx) => {
        return {
            title: 'user' + idx,
            author: Math.ceil(Math.random() * 1000).toString(32),
            visitor: idx + 5
        }
    }
);

export default {
    data () {
        return {
            selected: [],
            tableConf: tableConf,
            pageInfo: {
                pageSize: 20,
                items: dataList,
                sizeOptions: [10,20,50],
                currentPage: 1
            }
        }
    },
    methods: {
        createPlan () {
            let dialog = new Dialog({
                data: {
                    width: 700
                },
                content: Form
            })

            dialog.showModal()

            dialog.$on('ensure', function () {
                Dialog.alert('新建成功', () => {dialog.close()} )
            })
        },
        changeList (e) {
            Object.assign(this.pageInfo, e.data)
            if (this.$refs.table) {
                this.$refs.table.items = e.data.list;
            }
        },
        changePage (e) {
            Object.assign(this.pageInfo, e.data)
            if (this.$refs.table) {
                this.$refs.table.setSelected([]);
            }
        },
        changeCommand (e) {
            Dialog.confirm(`确认要[${e.data.name}]所选物料？`)
        },
        changeStatus (e) {
            Dialog.confirm(`选择状态为[${e.data.name}]的物料？`)
        },
        changeSelected (e) {
            this.selected = e.data
            // 也可以直接双向绑定batch.disabled属性，但是不建议这么做
            this.$refs.batch.disabled = e.data.length === 0
        },
        op(e) {

        }
    },
    components: {
        DropList, RichTable, Pager, DatePicker
    }
}

</script>

<style type="text/css" lang="less">
.app-demo {
    padding: 10px;
    td i {
        cursor: pointer;
        float: right;
    }
    .header-line {
        height: 50px;
        line-height: 30px;
    }
    .date-picker {
        display: inline-block;
    }
    .pad-wrapper {
        width: 250px;
        display: inline-block;
    }
}
</style>
