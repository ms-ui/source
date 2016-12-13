<template>
<div class="date-picker" @mousemove="clearTimer" @mouseout="hideCalendar">
    <div>
        <span @click="showCalendar" id="canlendar-button"
            class="range-input">{{info}}</span>
        <label class="calable" for="canlendar-button" v-on:click="showCalendar"></label>
        <i class="sm-calender"></i>
    </div>
    <div class="layer" :class="{hidden: !showLayer}" >
        <div class="range-type">
            <a @click="selectRange('lastMonth')" :class="{active: infoText == '上月'}">上月</a>
            <a @click="selectRange('thisMonth')" :class="{active: infoText == '本月'}">本月</a>
            <a @click="selectRange('lastWeek')" :class="{active: infoText == '最近7天'}">最近7天</a>
            <a @click="selectRange('lastDay')" v-if="cut.lastDay" :class="{active: infoText == '昨天'}">昨天</a>
            <a @click="selectRange('today')" v-if="cut.today" :class="{active: infoText == '今天'}">今天</a>

            <info>
                <h3>日期选择说明：</h3>
                <div v-if="limitDates">最大选择天数：{{limitDates}} 天</div>
                <div v-if="area">选择范围：
                    <div>{{area[0]}} ~ {{area[1]}}</div>
                </div>
            </info>
        </div>
        <div>
            <div class="date-wrapper">
                <input type="date" class="date-input start" v-model="begin" placeholder="请输入日期" :disabled="true">
                <calendar :params="beginParams" @value-change="setBegin"></calendar>
            </div>
            <div class="date-wrapper">
                <input type="date" class="date-input end" v-model="end" placeholder="请输入日期" :disabled="true">
                <calendar :params="endParams" @value-change="setEnd"></calendar>
            </div>
        </div>
        <i class="close-btn close rotate sm-close" @click="hideCalendar(0)"></i>
        <div class="button-panel">
            <button class="ensure button" @click.prevent="ensure">确定</button>
            <button class="cancel button" @click="hideCalendar(0)">取消</button>
        </div>
    </div>

</div>
</template>

<script>
/**
 * # 时间范围选择器
 *
 * @props
 *
 * ** value 传入时间
 * ** rtype 时间范围取值
 * ** area 可选时间范围
 * ** cut 快捷时间范围选择
 */

import moment from 'moment'
import Calendar from '../Calendar'
import Info from '../Info'
import ui from '../base/ui'

var format = 'YYYY-MM-DD';
var mday = moment();
var lastMonth = moment().add(-1, 'month');

/**
 * 时间变量
 */
var today = mday.format(format);
var tomorrow = moment().add(1, 'days').format(format);
var lastDay = moment().add(-1, 'days').format(format);
var firstDay = moment().startOf('month').format(format);
var lastWeek = moment().add(-7, 'days').format(format);
var lastYear = moment().add(-1, 'year').format(format);
var originDate = moment().add(-18, 'month').format(format);

// 一个月第一天不能用昨天结束
var lastOfMonth = lastDay;
if (mday.date() === 1) {
    lastOfMonth = firstDay
}

/**
 * 时间范围变量
 * @type {Object}
 */
var rangeMap = {
    today: [today, today, '今天'],
    thisWeek: [mday.startOf('week').format(format), lastDay, '本周'],
    thisMonth: [firstDay, lastOfMonth, '本月'],
    lastDay: [lastDay, lastDay, '昨天'],
    lastWeek: [lastWeek, lastDay, '最近7天'],
    lastMonth: [
        lastMonth.startOf('month').format(format),
        lastMonth.endOf('month').format(format),
        '上月'
    ]
};


var params = {
    show: true,
    format: 'YYYY-MM-DD',
    info: '',
    limitDates: 365, // 最大时间跨度
    value: rangeMap.lastWeek.slice(0, 2).join('~'),
    rtype: '',
    area: [originDate, today],
    cut: {today: 1, lastDay: 1}
};

export default {
    params,
    private: {
        showLayer: false,
        infoText: '',
    },
    mixins: [ui],
    ready () {
        Object.assign(this, this.params);
        if (this.rtype) {
            var range = rangeMap[this.rtype];
            this.info = range[2];
            this.setValue(range[0], range[1]);
            this.infoText = range[2];
            return;
        }
        this.info = this.infoText || this.value;
    },
    computed: {
        beginParams() {
            return {
                value: this.begin,
                maxDate: this.end,
                area: this.beginArea,
                type: 'date',
                limitDates: this.limitDates,
                y: 36,
                show: this.show
            }
        },
        endParams() {
            return {
                value: this.end,
                minDate: this.begin,
                area: this.endArea,
                type: 'date',
                limitDates: this.limitDates,
                y: 36,
                show: this.show
            }
        },
        begin () {
            return this.value.split('~')[0];
        },
        end () {
            return this.value.split('~')[1];
        },
        beginArea () {
            return this.area;
        },
        endArea () {
            return this.area;
        }
    },
    methods:{
        ensure () {
            // emit 会讲参数封装到e.data部分
            this.emit('range-change', {
                rtype: this.rtype,
                info: this.info,
                begin: this.begin,
                end: this.end,
                value: this.value
            });
            this.info = this.infoText || this.value;
            this.showLayer = false;
        },
        setValue (b , e) {
            this.infoText = '';
            this.value = (b || this.begin) + '~' + (e || this.end);
        },
        setBegin (e) {
            this.setValue(e.data.value);
        },
        setEnd (e) {
            this.setValue(0, e.data.value);
        },
        selectRange (rangeType) {
            var range = rangeMap[rangeType];
            this.setValue(range[0], range[1]);
            this.infoText = range[2];
            this.info = this.infoText || this.value;
            this.rtype = rangeType;
        },
        select (num, unit, text) {
            var m = moment();
            if (unit === 'fmonth') {
                m = m.add(num, 'month');
                this.setValue(m.startOf('month').format(this.format), m.endOf('month').format(this.format));
            }
            else if (unit === 'day') {
                var end = moment().add(num, 'days');
                this.setValue(end.format(this.format), end.format(this.format));
            }
            else {
                var end = moment().add(-1, 'days');
                this.setValue(m.add(num, unit).format(this.format), end.format(this.format));
            }
            this.infoText = text;
        },
        showCalendar (e){
            e.stopPropagation();
            this.show = true;
            this.showLayer = true;
        },
        clearTimer () {
            clearTimeout(this.timer || 100);
        },
        hideCalendar (e) {
            if (e === 0) {
                this.showLayer = false;
                return;
            }
            this.timer = setTimeout(() => {
                this.showLayer = false;
            }, 400);
        }
    },
    components: {Calendar, Info}
}
</script>

<style type="text/css" lang="less">
.date-picker {
    * {
        box-sizing: border-box;
    }
    font-size: 12px;
    position: relative;
    color: #333;
    width: 205px !important;

    .button-panel {
        position: absolute;
        bottom: 10px;
    }

    .info-sign {
        position: absolute;
        right: 45px;
        top: 0px;
    }

    .hidden {
        display: none;
    }

    .calable {
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
    }
    .range-type {
        a {
            display: inline-block;
            line-height: 15px;
            padding: 0px 5px;
        }
        .active {
            color: #42b983;
        }
    }
    .layer {
        position: absolute;
        top: 31px;
        left: 0;
        background: #FFF;
        width: 530px;
        height: 340px;
        padding: 10px;
        border: 1px solid #EEE;
        z-index: 100;
    }
    .date-wrapper {
        position: relative;
        display: inline-block;
        width: 250px;
    }

    .calendar {
        left: 0;
        top: 40px;
        height: 217px;
    }

    .range-input {
        width: 100%;
        text-align: left;
    }
    .sm-calender {
        position: absolute;
        right: 16px;
        top: 10px;
        width: 5px;
        height: 10px;
        font-size: 15px;
        color: #333;
    }
    .date-input {
        width: 238px;
        line-height: 22px;
    }
    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 12px;
        font-weight: bolder;
        cursor: pointer;
    }
    button {
        min-width: 3em;
    }
    button.cancel {
        color: #777 !important;
        border: 0;
        background: #FFF;
    }
}
</style>
