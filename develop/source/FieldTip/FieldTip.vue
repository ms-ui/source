<template>
<div class="field-tip" :style="style">
    <div class="warning" v-if="warning">{{warning}}</div>
    <div class="message" v-if="message" v-else="warning" v-html="message">
    </div>
</div>
</template>

<script type="text/javascript">
/**
 * ### 字段提示组件
 * > 辅助Input输入元素错误/输入信息提示
 *
 * @props
 *
 * ** for
 *     - 寄生元素
 *     - 如果没指定，则使用前一个元素
 *
 * ** left
 *     - 相对偏移X位置
 *
 * ** top
 *     - 相对偏移y位置
 *
 * ** placed
 *     - 如果没有信息，指定需要显示的默认信息
 */
import ui from '../base/ui'

var params = {
    message: '',
    warning: '',
    for: '',
    position: 'absolute',
    show: false,
    placed: '',
    auto: false,
    tries: 0,
    width: 0,
    left: 0,
    top: 0,
    x: 0,
    y: 0
}

export default {
    params,
    mixins: [ui],
    computed: {
        style () {
            if (!this.show || (!this.message && !this.warning)) {
                return {display: 'none'}
            }
            var st = {
                position: this.position,
                left: this.x + 'px',
                top: this.y + 'px',
                display: 'block'
            }
            if (this.width) {
                st.width = this.width + 'px'
            }
            return st
        }
    },
    ready() {
        this.init()
    },
    methods: {
        attachTo (el) {
            this.x = el.offsetWidth + el.offsetLeft + (+this.left)
            this.y = el.offsetTop + (+this.top)
        },
        init () {
            var $vm = this
            var target = null
            if (!$vm.$el) {
                return
            }
            if (this.placed) {
                this.message = this.placed.replace(
                    /\[([a-z\/]+)\]/g, function (match, seg) {
                        return '<' + seg + '>'
                    }
                )
            }

            // 如果属性配置for为target
            if (this.for) {
                target = this.$parent.$el.querySelector(this.for)
            }

            var fork = 0
            var check = function () {
                $vm.attachTo(target)
                clearTimeout(fork)
                fork = setTimeout(() => {
                    $vm.warning = target.validationMessage
                    $vm.message = target.message || $vm.palced
                }, 100)
            }

            // 选择同级的field元素
            if (!target && $vm.$el.parentElement) {
                $vm.$el.parentElement.querySelector('.field')
            }
            // 否则默认选择邻节点
            if (!target) {
                target = $vm.$el.previousElementSibling
            }
            if (target) {
                $vm.attachTo(target)
                target.addEventListener('change', check)
                // 方便手动触发校验
                target.showMessage = check
                $vm.show = true
            }
            if (!target && this.tries < 3) {
                setTimeout(() => {
                    $vm.init()
                }, 1000)
                this.tries++
                return
            }
            if (this.auto) {
                check()
            }
            this.target = target
        }
    }
}

</script>

<style type="text/css" lang="less">
.field-tip {
    position: absolute;
    max-width: 200px;
    line-height: 1.5em;
    font-size: 12px;
    left: 0;
    top: 0;
    .warning {
        color: #C00;
    }
    .message {
        color: #333;
    }
}

</style>
