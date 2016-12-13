<template>
<div class="dialog-panel comp"
    data-comp="dialog"
    :class="clazz">
    <dialog-element :params="{native: native, style: dialogStyle, width: width, height: height}" v-ref:dialog>
        <div class="close rotate sm-close" @click="close" v-if="needClose"></div>
        <div class="dialog-wrapper" :class="{'pad-bottom': needFooter}">
            <div class="header">
                <slot name="title"></slot>
            </div>
            <div class="content">
                <slot name="content"></slot>
            </div>
            <div class="footer">
                <slot name="footer">
                    <div class="default-bottom">
                        <button class="button ensure-button" @click="ensure">{{ensureText}}</button>
                        <button class="button cancel-button" @click="close" v-if="needCancel">{{cancelText}}</button>
                    </div>
                </slot>
            </div>
        </div>
    </dialog-element>
</div>
</template>

<script type="text/javascript">

import Dialog from '../DialogPanel/index'

export default {
    extends: Dialog,
    data() {
        return {
            clazz: ['dialog', 'inline'],
            isModal: false
        }
    },
    methods: {
        close () {
            this.$emit('closing');
            if (this.$el) {
                this.$el.style.display = 'none';
            }

            if (this.$dialog.open) {
                this.$dialog.close();
            }
            this.$emit('closed');
        }
    }
};
</script>