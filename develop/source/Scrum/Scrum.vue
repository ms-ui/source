<template>
<div class="scrum">
    <ul>
        <li v-for="item in items">
            <a @click="changeLink(item)">{{item.text}}</a>
            <i class="sm-arrow-right"></i>
        </li>
    </ul>
</div>
</template>

<script type="text/javascript">
import ui from '../base/ui'

export default {
    mixins: [ui],
    params: {
        items: []
    },
    methods: {
        changeLink(item) {
            this.emit('link-change', item)
        }
    }
}
</script>

<style type="text/css" lang="less">
.scrum {
    margin: 10px 0;
    ul {
        margin: 0;
        padding: 0;
    }

    li {
        list-style: none;
        display: inline-block;
        padding: 0;
        padding-right: 15px;
        color: #42b983;
        cursor: pointer;
    }

    li:last-child {
        color: #777;
        i {
            display: none;
        }
    }
}
</style>
