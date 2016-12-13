<template>
<div class="pager menu" v-show="totalPage > 0">
    <div class="setter" v-if="sizeOptions.length > 1">
        每页显示：
        <select-list 
            :params="{items: sizeList, value: pageSize}"
            @value-change="selectSize"
            ref:sizer>  
        </select-list>
    </div>
    <div class="pagination-wrapper">
    <div class="pagination">
        <a class="icon item" v-bind:class="{ 'disabled': noPrevious }" v-on:click="selectPage(currentPage - 1)">
        <i class="sm-arrow-left"></i>
        </a>
        <a class="item" v-for="page in pages" track-by="$index"
           v-bind:class="{ 'active': page.number == currentPage, 'disabled': page.disabled }"
           v-on:click="selectPage(page.number)">
            {{page.text}}
        </a>
        <a class="icon item" v-bind:class="{ 'disabled': noNext }" v-on:click="selectPage(currentPage + 1)">
            <i class="sm-arrow-right"></i>
        </a>
    </div>
    </div>
    <div class="go" v-if="totalPage > 3">
        跳转到：
        <input type="number" :value="currentPage" @change.prevent="pageTo" size="4" min="1" :max="totalPage">
    </div>
</div>
</template>

<script type="text/javascript">
/**
 * ### 翻页组件
 *
 * @props
 * ** params
 *    - sizeOptions 单页数量选择项
 *    - currentPage 当前页号
 *    - pageSize    记录数量大小
 *    - totalSize   总数量
 *    - displayNum  显示项数量
 * 
 * ** items
 *     - 只有前端翻页需要传入items，否则不要
 *
 * @events
 *
 * ** page-change
 *    - 页号发生变化
 *    - 事件参数 {data: {currentPage}}
 *     
 * ** size-change
 *    - 大小发生变化
 *    - 事件参数 {data: {pageSize}}
 * 
 * ** list-change
 *    - 列表发生变化, 只有传入items参数才有效，用于前端自动分页
 *    - 事件参数 {data: {list}}
 * 
 * @example
 *
 * <pager 
 *     :params="params"
 *     :items="items"
 *     @page-change="changePage"
 *     @size-change="changeSize"
 *     @list-change="changeList">
 * </pager>
 */

import SelectList from '../SelectList'
import ui from '../base/ui'

var pageInfo = {
    sizeOptions: [20, 50, 100], // 单页数量选择项
    currentPage: 1, // 当前页号
    pageSize: 20,   // 记录数量大小
    totalSize: 100, // 总数量
    displayNum: 6, // 显示项数量
    items: false
}

export default {
    replace: true,
    inherit: false,
    params: pageInfo,
    private: {
        pages: [],
        sizeList: [],
        edgeNum: 2
    },
    mixins: [ui],
    components: {SelectList: SelectList},
    ready () {
        // 如果props设置了items
        if (this.items) {
            this.totalSize = this.items.length
            this.totalPage = Math.ceil(this.totalSize / this.pageSize)
        }

        // 重新生成卡片
        this.updatePages()

        this.sizeList = this.sizeOptions.map((x) => {
            return {name:x, value: x}
        })

        // 主动触发一次页面选择
        this.selectPage(this.currentPage);
    },
    watch: {
        currentPage () {
            this.updatePages()
        },
        'params.pageSize' () {
            this.updatePages()
        },
        'params.totalSize' () {
            Object.assign(this, this.params)
            this.updatePages()
        },
        'params.totalPage' () {
            Object.assign(this, this.params)
            this.updatePages()
        },
        sizeOptions (value) {
            // 需要动态更新选择列表组件，不支持动态双向更新了
            var sizer = this.$refs.sizer
            
            // v1.0不兼容情况
            sizer = sizer || this.$children[0];

            sizer.options = value
            sizer.value = this.pageSize
        }
    },
    computed: {
        noPrevious () {
            return this.currentPage === 1
        },
        noNext () {
            return this.currentPage === this.totalPage
        },
        totalPage () {
            return getTotalPage(this.pageSize, this.totalSize)
        }
    },
    methods: {
        updatePages () {
            this.pages = getPages(
                this.currentPage,
                this.totalPage,
                this.edgeNum,
                this.displayNum
            )
        },
        selectPage (num) {
            if (this.currentPage != num && num > 0 && num <= this.totalPage) {
                this.currentPage = num
                this.emit('page-change', {currentPage: num})
            }
            if (this.items) {
                let start = this.pageSize * (this.currentPage - 1)
                let end = start + this.pageSize
                let list = this.items.slice(start, end)
                this.emit('list-change', {list: list})
            }
        },
        pageTo (event) {
            let target = event.target
            if (target.value > 0) {
                this.selectPage(target.value)
            }
        },
        selectSize (event) {
            let size = event.data.value
            if (this.pageSize != size && size > 0) {
                this.pageSize = size

                // 如果当前页数是本地计算的
                this.totalPage = Math.ceil(this.totalSize / this.pageSize)
                this.updatePages()

                // 如果当前页超出边界，则选择最后一项
                if (this.currentPage > this.totalPage) {
                    this.selectPage(this.totalPage)
                }
                else {
                    // 否则重新触发当前页变化
                    this.selectPage(this.currentPage)
                }

                this.emit('size-change', {
                    totalPage: this.totalPage,
                    pageSize: this.pageSize
                })
            }
        }
    },
}

function getTotalPage(pageSize, totalSize) {
    var totalPage = pageSize < 1 ? 1 : Math.ceil(totalSize / pageSize)
    return Math.max(totalPage || 0, 1)
}

// Create page object used in template
function makePage(number, text, isActive) {
    return {
        number: number,
        text: text,
        disabled: number === -1,
    }
}

/**
* 产生内部列表项目
*/
function getInterval(currentPage, pageCount, displayCount) {
    var half = Math.ceil(displayCount / 2)
    var np = pageCount
    var upperLimit = np - displayCount
    var start = currentPage > half ? Math.max(Math.min(currentPage - half, upperLimit), 0) : 0
    var end = currentPage > half ? Math.min(currentPage + half, np) : Math.min(displayCount, np)
    return [start, end]
}

/**
* 获取列表项目
*/
function getPages(currentPage, totalPage, edgeCount, displayCount) {
    var ret = []
    var skipText = '...'
    var np = totalPage
    var interval = getInterval(currentPage - 1, totalPage, displayCount)

    // 生成左边列表项
    if (interval[0] > 0 && edgeCount > 0) {
        var end = Math.min(edgeCount, interval[0])
        for (var i = 0; i < end; i++) {
            var page = makePage(i + 1, i + 1)
            ret.push(page)
        }
        if (edgeCount < interval[0]) {
            var page = makePage(-1, skipText)
            ret.push(page)
        }
    }

    // 产生内部列表项目
    for (var i = interval[0]; i < interval[1]; i++) {
        var page = makePage(i + 1, i + 1)
        ret.push(page)
    }

    // 产生右侧列表项目
    if (interval[1] < np && edgeCount > 0) {
        if (np - edgeCount > interval[1]) {
            var page = makePage(-1, skipText)
            ret.push(page)
        }
        var begin = Math.max(np - edgeCount, interval[1])
        for (var i = begin; i < np; i++) {
            var page = makePage(i + 1, i + 1)
            ret.push(page)
        }
    }

    return ret
}
</script>

<style type="text/css" lang="less">

.pager {
    text-align: center;
    vertical-align: middle;
    margin: 10px 0;
    position: relative;
    a {
        cursor: pointer;
    }
    .setter {
        display: inline-block;
        vertical-align: middle;
        line-height: 1.5em;
        float: left;
    }
    .select-wrapper {
        line-height: 30px;
        .select {
            z-index: 5;
            line-height: 30px;
            height: 32px;

        }
    }
    .go {
        display: inline-block;
        float: right;
        margin-right: 20px;
        display: inline-block;
        margin-right: 20px;
        position: absolute;
        top: 0;
        right: 0;

        input {
            line-height: 30px;
            border-radius: 2px;
            width: 40px;
            border: 1px solid #DDD;
            text-align: center;
        }
    }
}

.pagination-wrapper {
    width: 400px;
    margin: 0 auto;
}

.pagination {
    margin: 0;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    vertical-align: middle;
    i {
        color: #333;
    }
    .item:first-child {
      border-radius: 0.28571429rem 0em 0em 0.28571429rem;
    }
    .item:last-child {
      border-radius: 0em 0.28571429rem 0.28571429rem 0em;
    }
    .item:last-child:before {
      display: none;
    }
    .item {
      min-width: 3em;
      text-align: center;
      min-width: 3em;
        text-align: center;
        line-height: 30px;
        border: 1px solid #CCC;
        margin-left: -1px;
    }
    .active.item {
      background-color: rgba(0, 0, 0, 0.05);
      color: rgba(0, 0, 0, 0.95);
      box-shadow: none;
    }

    .item.disabled,
    .item.disabled:hover {
      cursor: default;
      background-color: transparent !important;
      color: rgba(40, 40, 40, 0.3);
    }
}
</style>
