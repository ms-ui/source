<template>
<div class="smui-proegress">
    <progress :value="value" :max="max" @change="changeValue">
</div>
</template>

<script type="text/javascript">

export default {
    props: {
        value: {
            default: 50
        },
        max: {
            default: 100
        }
    },
    methods: {
        changeValue () {
            this.$emit('change-value', {value: this.value});
        }
    }
}
</script>

<style type="text/css" lang="less">
.smui-proegress {
    display: inline-block;
    progress {
        width: 160px;
        height: 20px;
        border: 1px solid #0064B4;  
        background-color:#e6e6e6;
        color: #0064B4; /*IE10*/
    }
    progress::-moz-progress-bar { background: #0064B4;}
    progress::-webkit-progress-bar { background: #FFF;}
    progress::-webkit-progress-value  { background: #0064B4;}
}
</style>