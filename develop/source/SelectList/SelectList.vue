<template>
<div class="select-wrapper">
    <div v-if="name && !value" class="select-tip">{{name}}</div>
    <select v-model="value" class="select" :id="uiId" v-on:change="changeValue">
      <slot>
        <option v-for="item in items" v-bind:value="item.value">{{item.name}}</option>
      </slot>
    </select>
    <i class="drop-icon sm-arrow-dropdown" :for="uiId"></i>
</div>
</template>
<script type="text/javascript">
/**
 * ## Select 选择组件
 *
 * @props
 * 
 * ** options
 *   - 元素可以是数字、字符串或对象。如果是对象，需要name属性
 *
 * ** value
 *   - value取值必须是对应options的取值，是对象或简单数据类型
 *
 * @events
 * 
 * ** value-change
 *   - 参数 {data: {value}}
 */
import ui from '../base/ui'

export default {
    mixins: [ui],
    data () {
        let uid = (Math.random().toFixed(3) * 1000).toString(32)
        return {
            uiId: `select_${uid}`,
            name: '',
            items: [],
            value: ''
        }
    },
    watch: {
        'params.items' (value) {
            this.items = value
        }
    },
    methods: {
        getValue () {
            return this.value
        },
        changeValue () {
            this.emit('value-change', {value: this.value})
        }
    }
}
</script>

<style type="text/css" lang="less">

.select-wrapper {
  position: relative;
  display: inline-block;
  box-sizing: border-box;

  .select-tip {
      position: absolute;
      top: 0;
      left: 0;
      line-height: 30px;
      padding: 0 10px;
      color: #999;
  }

  .drop-icon {
      position: absolute;
      right: 8px;
      top: 10px;
      font-size: 12px;
      color: #777;
  }

  .select {
      padding: 0 10px;
      padding-right: 25px;
      background-color: transparent;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #c0c8c9;
      border-radius: 4px;
      position: relative;
      background-repeat: no-repeat;
      background-size: 1.5rem 1rem;
      background-position: right center;
      font: inherit;
      color: inherit;
      z-index: 3;
      height: 28px;
      -webkit-appearance: none;
      -moz-appearance: none;
            appearance: none;
      
      &:focus {
        outline: none;
      }
  }
}
</style>
