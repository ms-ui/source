<template>
<div class="loading-box"
    :class="{mask: showMask, full: isFull}"
    v-show="isShow">
    <slot><i :class="['content', icon]" v-if="icon"></i></slot>
</div>

</template>
<script type="text/javascript">
import ui from '../base/ui'

export default {
    mixins: [ui],
    params: {
        isShow: false,
        isFull: true,
        needMask: true,
        showMask: false,
        timeout: 10000,
        delay: 500,
        icon: 'sm-loading',
    },
    methods: {
        show (option) {
            if (option) {
                Object.assign(this, option);
            }
            this.isShow = true;
            setTimeout(()=> {this.close()}, this.timeout);

            var $vm = this;
            this.isShow = true;
            
            // 故意延迟再展现mask效果，避免不必要遮罩
            if (this.needMask) {
                setTimeout(() => {
                    $vm.showMask = true;
                }, this.delay);
            }
        },
        close () {
            if (this.$el) {
                this.$el.remove();
            }
        }
    }
}

</script>

<style type="text/css" lang="less">
.loading-box.mask {
    background: rgba(0,0,0,0.2);
}
.loading-box.full {
    position: fixed;
}

.loading-box {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10001;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.01);

    .close {
        font-size: 1.5em;
    }
    i.content {
        font-size: 3em;
        color: lightskyblue;
        margin-left: -20px;
        margin-top: -20px;
    }
    div.content {
        width: 100%;
        left: 0;
        text-align: center;
    }

    .content {
        position: absolute;
        left: 50%;
        top: 50%;
    }
    .close {
        position: absolute;
        top: 5px;
        right: 5px;
    }
    .sm-loading {
        animation: loading 1s infinite step-start;
    }
    @keyframes loading {
        .loading-anime(7);
    }
    .loading-anime(@i) when(@i >= 0) {
        .loading-anime(@i - 1);
        @p: 12.5 * @i;
        @selector: e('@{p}%');
        @{selector} {
            transform: rotate(45deg * @i);
        }
    }
}
</style>
