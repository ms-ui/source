<template>
<div class="post-form">
    <form>
        <slot></slot>
    </form>
    <div class="error">{{message}}</div>
</div>
</template>
<script type="text/javascript">

import ui from '../base/ui'
export default {
    params: {
        autoCheck: false,
        message: '',
        mod: 'add'
    },
    mixins: [ui],
    ready: function () {
        if (this.form) {
            return;
        }
        this.form = this.$el;
        if (this.$el.querySelector) {
            this.form = this.$el.querySelector('form');
            this.form.onsubmit = this.submit.bind(this);
        }
        if (this.mod === 'edit') {
            this.validate()
        }
    },
    methods: {
        validate: function (input) {
            var fields = this.form.querySelectorAll('.field')
            this.errorMessage = ''

            fields = Array.prototype.slice.call(fields)
            fields.forEach((field)=> {
                field.validate && field.validate()
                if (!field.validity.valid && !this.errorMessage) {
                    this.errorMessage = field.validationMessage
                }
            })
            if (this.errorMessage) {
                return false
            }
            return true
        },
        sendQuery: function () {

        },
        submit: function (e) {
            e.preventDefault();
            if (!this.validate()) {
                this.showError();
            }
            else {
                this.sendQuery();
            }
            return false;
        }
    }
}

</script>

<style type="text/css" lang="less">
.post-form {
    position: relative;
    input, textarea {
        outline: none;
        border: 1px solid #bbb;
    }
    .on {
        input:invalid {
            border: 1px solid red;
        }
        textarea:valid {
            border: 1px solid green;
        }
        textarea:invalid {
            border: 1px solid red;
        }
        input:disabled {
            border: 1px solid #CCC;
        }
    }
}
</style>
