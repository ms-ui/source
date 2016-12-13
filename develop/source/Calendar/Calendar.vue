<template>
<div @click.stop=""  
    @touchstart.stop=""
    class="calendar"
    v-show="show"
    :style="style"
    transition="calendar" transition-mode="out-in">
    <div class="calendar-tools">
        <i class="sm-arrow-left float ileft" 
            :class="{disabled: !canPrev}"
            @click="prev" 
            :disabled="!canPrev"
            @touchstart="prev"></i>
        <i class="sm-arrow-right float iright" 
            :class="{disabled: !canNext}"
            @click="next" 
            :disabled="!canNext"
            @touchstart="next"></i>
        <div class="text center">
            <input type="number" v-model="page.year" 
                :value="page.year" @change="changeYear()" 
                :min="minYear"
                :max="maxYear"
                class="year-input">
             / 
            <input type="number" v-model="page.showMonth" 
                :value="page.showMonth" @change="changeMonth()"
                min="1" max="12"
                class="month-input">
        </div>
        <div v-if="message" class="toast warn">{{message}}</div>
    </div>
    <table cellpadding="5">
    <thead>
        <tr>
            <td v-for="week in weeks" class="week">{{week}}</td>
        </tr>
     </thead>
    <tr v-for="row in days">
        <td v-for="child in row" 
            :class="{'valid': child.valid, 'disabled':child.disabled, selected: child.selected}"
            @click="select(child.row, child.col, $event)"
            @touchstart="select(child.row, child.col, $event)">{{child.day}}
        </td>
    </tr>
    </table>
    <div class="calendar-time" v-show="type=='datetime'||type=='time'">
        <div class="timer">
            <input type="number" v-model="hour" @change="changeTime"
                :value="hour" min="0" max="23" maxlength="2">时
            <input type="number" v-model="minute" @change="changeTime"
                :value="minute" min="0" max="59" maxlength="2">分
            <input type="number" v-model="second" @change="changeTime"
                :value="second" min="0" max="59" maxlength="2">秒
        </div>
    </div>
</div>
</template>

<script>
import Moment from 'moment'

// 生成12月份数组
const monthArray = new Array(12).fill('0')
    .map(
        (x, idx) => {
            return idx < 9 ? '0' + (idx + 1) : '' + (idx + 1)
        }
    )

const weekArray = ['日', '一', '二', '三', '四', '五', '六']

let params = {
    show: false, // 是否显示
    value: '',   // 最终输出的格式化字符串
    area: false, // 可选时间（天）范围
    maxDate: false, // 最大时间限制
    minDate: false, // 最小时间限制
    message: '', // 提示信息
    x: 0,
    y: 0,
    hour: 0,    // 时
    minute: 0,  // 分
    second: 0, // 秒
    limitDates: false, // 限制最大选择天数
    page: {     // 日历渲染页信息
        year: 2016,
        month: 0,
        showMonth: 1
    },
    days: [],  // 日历天数组
    type: 'date', // 支持 ['date', 'datetime', 'daterange']
    format: 'YYYY-MM-DD',
    sep: '-',
    canPrev: true,
    canNext: true,
    weeks: weekArray,
    months: monthArray
}

import ui from '../base/ui'

export default {
    params: params,
    mixins: [ui],
    ready () {
        var time = new Moment(this.value)
        this.page = {
            year: time.year(),
            month: time.month(),
            showMonth: time.month() + 1
        }
    },
    watch: {
        params (value) {
            Object.assign(this, value)
        },
        value () {
            let time = new Moment(this.value)
            this.page.year = time.year()
            this.page.month = time.month()
            this.update()
        },
        maxDate (value) {
            this.update()
        },
        minDate (value) {
            this.update()
        }
    },
    computed: {
        style () {
            return {
                left: this.x + 'px',
                top: this.y + 'px'
            }
        },
        maxYear () {
            return new Date().getFullYear()
        },
        minYear () {
            return new Moment().add(-2, 'year').year()
        },
        
    },
    methods: {
        prepared() {
            this.update()
        },
        zero (n) {
            return n < 10 ? '0' + n : n
        },
        update () {
            var time = new Moment(this.value)
            if (this.type == 'datetime') {
                this.hour = time.hour()
                this.minute = time.minute()
                this.second = time.second()
                this.format = 'YYYY-MM-DD HH:mm:ss'
            }
            this.render()
        },
        changeYear () {
            if (this.page.year < 1970 || this.page.year > 2500) {
                this.page.year = new Moment(this.value).year()
            }
            this.render()
        },
        changeMonth () {
            if (this.page.showMonth < 1 || this.page.showMonth > 12) {
                this.page.showMonth = new Moment(this.value).month() + 1
            }
            this.page.month = this.page.showMonth - 1;
            this.render()
        },
        prev (e) {
            e.stopPropagation()
            var page = this.page
            var time = new Moment(
                new Date(page.year, page.month, 1)).subtract(1, 'month')
            page.year = time.year()
            page.month = time.month()
            this.render()
        },
        next (e) {
            e.stopPropagation()
            var page = this.page
            var time = new Moment(
                new Date(page.year, page.month, 1)).add(1, 'month')
            page.year = time.year()
            page.month = time.month()
            this.render()
        },
        render () {
            var year = this.page.year
            var month = this.page.month
            this.page.showMonth = this.page.month + 1

            var firstDate = new Date(year, month, 1) // 当月最后一天

            var m = new Moment(firstDate)

            var firstDayOfMonth = firstDate.getDay() // 当月第一天

            // 当月最后一天
            var lastDateOfMonth = m.daysInMonth()
            
            // 上一个一月的最后一天
            var lastDayOfLastMonth = m.subtract(-1, 'month').daysInMonth()

            var i = 0 // 当前列表编号
            var line = 0 // 第几行
            var temp = [] // 日期数组（一个二维数组）

            for (i = 1; i <= lastDateOfMonth; i++) {
                var dow = new Date(year, month, i).getDay()

                // 第一行
                if (dow == 0) {
                    temp[line] = []
                }
                else if (i == 1) {
                    temp[line] = []
                    var k = lastDayOfLastMonth - firstDayOfMonth + 1;

                    for (var j = 0; j < firstDayOfMonth; j++) {
                        let col = temp[line].length;
                        temp[line].push(
                            {row: line, col: col, day:k, disabled:true})
                        k++
                    }
                }

                let col = temp[line].length;
                var options = {row: line, col: col, day: i}
                var thisTime = new Moment(new Date(year, month, i))

                // 渲染过程中检查时间是否可选有效
                if (this.validate(thisTime)) {
                    options.valid = true

                    // 判断当前时间是否在选中范围
                    if (this.inSelection(thisTime)) {
                        options.selected = true
                    }
                }
                else {
                    options.disabled = true
                    options.outed = true
                }

                temp[line].push(options)

                // 最后一列
                if (dow == 6) {
                    line++
                    temp[line] = []
                }
                else if (i == lastDateOfMonth) {
                    var k = 1
                    for (dow; dow < 6; dow++) {
                        let col = temp[line].length;
                        temp[line].push({row: line, col: col, day: k, disabled: true})
                        k++
                    }
                }
            }//end for
            this.days = temp
        },
        toast (message) {
            this.message = message
            setTimeout(()=>{this.message = ''}, 1500);
        },
        select (k1, k2, e) {
            if (e !== undefined) {
                e.stopPropagation()
            }

            var time = new Moment(
                new Date(this.page.year, this.page.month, this.days[k1][k2].day))
   
            if (this.maxDate && this.area) {
                if (!this.isBetween(time, [this.area[0], this.maxDate])) {
                    this.toast('不能大于结束时间')
                    return
                }
            }
            if (this.minDate && this.area) {
                if (!this.isBetween(time, [this.minDate, this.area[1]])) {
                    this.toast('不能小于开始时间')
                    return
                }
            }
            if (this.limitDates) {

                if (
                    (this.maxDate && -time.diff(this.maxDate, 'days') > this.limitDates)
                    ||
                    (this.minDate && time.diff(this.minDate, 'days') > this.limitDates)
                    ) {
                    this.toast('时间跨度不能大于' + this.limitDates + '天')
                    return
                }
            }
            
            this.changeValue(time)
        },
        validate (value) {
            if (this.area && !value.isBetween(this.area[0], this.area[1])) {
                return false
            }
            return true;
        },
        isSelectable (time) {
            if (this.maxDate && this.area
                && this.isBetween(time, [this.area[0], this.maxDate]) ) {
                return true
            }
            if (this.minDate && this.area
                && this.isBetween(time, [this.minDate, this.area[1]]) ) {
                return true
            }
            return false
        },
        inSelection (time) {
            if (this.maxDate 
                && this.isBetween(time, [this.value, this.maxDate]) ) {
                return true
            }
            if (this.minDate 
                && this.isBetween(time, [this.minDate, this.value]) ) {
                return true
            }
            return false
        },
        isBetween (time, area) {
            return (time.isAfter(area[0]) ||  time.isSame(area[0], 'days'))
                && (time.isBefore(area[1]) ||  time.isSame(area[1], 'days'))
        },
        changeValue (target) {
            // area 是可选择日期范围
            if (!this.validate(target)) {
                return false
            }
            // 更新时间
            if (this.type === 'datetime') {
                target.hour(this.hour)
                target.minute(this.minute)
                target.second(this.second)
            }

            // 日期范围
            this.value = target.format(this.format)
            this.render()
            this.emit('value-change', {value: this.value})
        },
        changeTime () {
            this.changeValue(new Moment(this.value))
        }
    }
}
</script>
 
<style type="text/css" lang="less">
.calendar {
    width: 235px;
    padding: 10px;
    background: #fff;
    position: absolute;
    border: 1px solid #DEDEDE;
    border-radius: 2px;
    transition: all .5s ease;
    color: #333;
    .calendar-enter,
    .calendar-leave {
        opacity: 0;
        transform: translate3d(0,-10px, 0);
    }

    .toast.warn {
        color: #C00;
        background: #EEE;
        font-size: 12px;
        padding: 2px 10px;
        line-height: 18px;
        border: 1px solid #CCC;
        border-radius: 2px;
        position: absolute;
        display: inline-block;
        bottom: 0;
        left: 30%;
    }
}
 

.calendar:before {
    position: absolute;
    left:30px;
    top: -10px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #DEDEDE;
}
.calendar:after {
    position: absolute;
    left:30px;
    top: -9px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #fff;
}

.calendar { 
    .month-input {
        width: 40px !important;
        outline: none;
    }
    .year-input {
        width: 65px !important;
        outline: none;
    }

    .calendar-tools {
        height:32px;
        font-size: 18px;
        line-height: 32px;
        color:#42b983;
    }
    .calendar-tools .float.ileft{
        float:left;
        font-size: 16px;
    }
    .calendar-tools .float.iright{
        float:right;
        font-size: 16px;
    }
    .calendar-tools input{
        font-size: 18px;
        line-height: 32px;
        color: #42b983;
        width: 60px;
        text-align: center;
        border:none;
        background-color: transparent;
    }
    .calendar-tools>i{
        margin:0 12px;
        line-height: 32px;
        cursor: pointer;
        color:#707070;
    }

    .calendar-tools .disabled {
        color: #EEE;
    }

    .calendar-tools>i:hover{
        color:#42b983;
    }
    
    table {
        clear: both;
        width: 100%;
        margin-bottom:10px;
        border-collapse: collapse;
        color: #444444;
    }
    td {
        margin:2px !important;
        padding: 5px 0;
        width: 14.28571429%;
        text-align: center;
        vertical-align: middle;
        font-size: 12px;
        line-height: 125%;
        cursor: pointer;
    }
    td:hover{
        background:#f3f8fa;
    }
    td.week{
        pointer-events:none !important;
        cursor: default !important;    
    }
    td.disabled {
        color: #c0c0c0;
        background-color: none;
        pointer-events:none !important;
        cursor: default !important;
    }

    td.valid {
        color: #42b983;
        font-size:12px;
    }

    td.selected {
        color: #FFF;
        background-color: #42b983;
        font-size: 12px;
    }

    thead td {
      text-transform: uppercase;
    }
    .timer{
        margin:10px 0;
        text-align: center;
    }
    .timer input{
        border-radius: 2px;
        padding:5px;
        font-size: 14px;
        line-height: 18px;
        color: #42b983;
        width: 50px;
        text-align: center;
        border:1px solid #efefef;
    }
    .timer input:focus{
        border:1px solid #42b983;
    }
    .calendar-button{
        text-align: center;
        button{
            border:none;
            cursor: pointer;
            display: inline-block;
            min-height: 1em;
            vertical-align: baseline;
            background:#42b983;
            color:#fff;
            margin: 0 .25em 0 0;
            padding: 5px 10px;
            font-size: 1em;
            line-height: 1em;
            text-align: center;
            border-radius: .3em;
        }
        button.cancel{
            background:#efefef;
            color:#666;
        }
    }
}
</style>
