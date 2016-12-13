<template>
<div class="prompt-content">
    <div v-if="tip">{{tip}}</div>
    <input type="text" @change="changeValue" 
        v-if="type=='text'" :maxlength="max" :minlength="min" 
        name="content" v-model="value"/>
    <input type="number" @change="changeValue" 
        v-if="type=='number'" :max="max" :min="min" 
        :step="step" v-model="value"/>
    <div class="error">{{error}}</div>
</div>
</template>

<script type="text/javascript">
import ui from '../base/ui'

export default {
    params: {
        tip: '',
        min: 0,
        max: 9999,
        step: 0.1,
        value: '',
        error: '',
        type: 'text'
    },
    mixins: [ui],
    methods: {
        ensure: function () {
            if (this.validate(this.value)) {
                this.$emit('finished', {value: this.value});
            }
        },
        changeValue: function (e) {
            this.error = ''
            let target = e.target
            if (target && target.validationMessage) {
                this.error = target.validationMessage;
            }
            this.validate(this.value);
        },
        validate: function (value) {
            return true;
        }
    }
}
</script>

<style type="text/css" lang="less">

.alert {
    .dialog {
        width: 300px;
    }
}

.error {
    color: #C00
}

.prompt-content input {
    line-height: 20px;
}
.prompt-content.inline .text{
    width: 50%;
    float: left;
    margin: 2px 0;
}

.prompt-content .field-tip {
    display: block;
    position: static;
}

.prompt-content.inline button {
    width: 30%;
    min-width: 50px;
    border: 1px solid white;
    background-color: #4593ff;
    color: #FFF;
    float: right;
    margin-right: 5px;
    border-radius: 5px;
}
</style>
