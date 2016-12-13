<template>
    <div class="select-timer-control">
        <div class="tip-bar">
            <p class="action">
                <span @click="setActionArea('workday')">工作日</span>|
                <span @click="setActionArea('weekend')">周末</span>|
                <span @click="setActionArea('all')">全部</span>|
                <span @click="resetValue()">重置</span>
            </p>
            <p class="tip"><span class="unselected-tip"></span>暂停时间段</p>
            <p class="tip"><span class="selected-tip"></span>投放时间段</p>
        </div>
        <div>
            <ul class="week-container">
                <li class="day-line day-th-line">
                    <ul class="day-container">
                        <li class="week-th"></li>
                        <li v-for="hour in 24"
                        :class="{'hour-th':1,'selected':actionFlags.sLine['s'+hour]}"
                        @click="setHourLine(hour)">
                            <span class="sm-download"></span>
                        </li>
                    </ul>
                </li>
                <li v-for="(day, $index) in 7" class="day-line">
                    <ul class="day-container">
                        <li class="week-th" :data-value="$index">
                            <label>
                                <input type="checkbox"
                                :checked="!!actionFlags.hLine['h'+day]"
                                @click="setDayLine(day)" name="week-day">
                                {{weekName[day]}}
                            </label>

                        </li>
                        <li v-for="hour in 24"
                        @click="setSingleHour(day, hour)">
                            {{hour}}
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script type="text/javascript">
// 节点名前缀-day前缀
var pd = 'd';
// 节点名前缀-hour前缀
var ph = 'h';

// 构建一个初始的对象矩阵
var map = (function() {
    var map = {};
    for (var i = 0; i < 7; i++) {
        map[pd + i] = {};
        for (var j = 0; j < 24; j++) {
            map[pd + i][ph + j] = 0;
        }
    }
    return map;
})();

// 用于校验更新toolbar视图的频率，防止单位时间内过多无用循环更新
var toolbarCheckTimer = null;
module.exports = {
    props: ['params'],
    methods: {
        /**
         * 获取选中时间字符串
         * @return {string} 选中时间字符串
         */
        getSelectedString: function() {
            var map = this.valueMap;
            var valueArr = [];
            var startStr = '',
                endStr = '';
            function joinStr(day, hour, value) {
                if (value) {
                    var vStr = (day + 1) * 100 + hour;
                    !startStr && (startStr = vStr);
                    endStr = vStr+1;
                }
                // 结串的条件是：必须有startStr,且 本行到达末尾元素或者当前值为空
                if ((!value || hour == 23) && startStr) {
                    valueArr.push(startStr + '-' + endStr);
                    startStr = endStr = '';
                };
            };
            // 又是暴力的遍历
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 24; j++) {
                    joinStr(i, j, map[pd + i][ph + j]);
                }
            }
            return valueArr.join(';');
        },
        /**
         * 检查并更新横竖两条操作栏，会做全局遍历，慎用
         * 如果短时间内多次调用只执行最后一次
         */
        checkeToolBarStatus: function() {
            var me = this;

            function doCheck() {
                var map = me.valueMap;
                var af = me.actionFlags;
                af.hLine = {};
                af.sLine = {};
                for (var i = 0; i < 7; i++) {
                    for (var j = 0; j < 24; j++) {
                        var tvalue = map[pd + i][ph + j];
                        if (!(af.hLine['h' + i] === 0)) {
                            af.hLine['h' + i] = tvalue;
                        };
                        if (!(af.sLine['s' + j] === 0)) {
                            af.sLine['s' + j] = tvalue;
                        };
                    }
                }
            }
            clearTimeout(toolbarCheckTimer);
            toolbarCheckTimer = setTimeout(doCheck, 200);
        },
        /**
         * 根据选中节点树，初始化时间矩阵图
         * @param {[type]} valueObj 选中的节点树
         */
        setValueMap: function(valueObj) {
            var me = this;
            var map = me.valueMap;
            var af = me.actionFlags;
            af.hLine = {};
            af.sLine = {};
            for (var i = 0; i < 7; i++) {
                valueObj[pd + i] = valueObj[pd + i] || {};
                for (var j = 0; j < 24; j++) {
                    var tvalue = valueObj[pd + i][ph + j];
                    tvalue = tvalue ? tvalue : 0;
                    map[pd + i][ph + j] = tvalue;

                    if (!(af.hLine['h' + i] === 0)) {
                        af.hLine['h' + i] = tvalue;
                    };
                    if (!(af.sLine['s' + j] === 0)) {
                        af.hLine['s' + j] = tvalue;
                    };
                }
            }
        },
        resetValue: function(){
            var me = this;
            var ov = me.params && me.params.period || ''
            var valueObj = me.setStrToValueObj(ov);
            me.setValueMap(valueObj);
        },
        setActionArea: function(flag) {
            var tagObj = {
                workday: 1,
                weekend: 0,
                all: 2
            };
            var tag = +tagObj[flag];
            for (var i = 0; i < 7; i++) {
                this.setDayLine(i, (i < 5 && tag) || (i >= 5 && !tag) || (tag == 2));
            }
        },
        setDayLine: function(day, value) {
            var me = this;
            var tvalue = +!me.actionFlags.hLine['h' + day];
            if (!util.isUndefined(value)) {
                tvalue = +!!value;
            };
            for (var i = 0; i < 24; i++) {
                me.valueMap[pd + day][ph + i] = tvalue;
            }
            me.checkeToolBarStatus();
        },
        setHourLine: function(hour) {
            var me = this;
            var tvalue = +!me.actionFlags.sLine['s' + hour];
            for (var i = 0; i < 7; i++) {
                me.valueMap[pd + i][ph + hour] = tvalue;
            }
            me.checkeToolBarStatus();
        },
        setSingleActionFlag: function(day, hour) {
            var me = this;
            var map = me.valueMap;
            var svalue = 1,
                hvalue = 1;
            if (!map[pd + day][ph + hour]) {
                svalue = 0;
                hvalue = 0;
            } else {
                for (var i = 0; i < 7; i++) {
                    if (!map[pd + i][ph + hour]) {
                        svalue = 0;
                        break;
                    };
                }
                for (i = 0; i < 24; i++) {
                    if (!map[pd + day][ph + i]) {
                        hvalue = 0;
                        break;
                    };
                }
            };
            me.actionFlags.sLine['s' + hour] = svalue;
            me.actionFlags.hLine['h' + day] = hvalue;
        },
        setSingleHour: function(day, hour) {
            var cValue = this.valueMap[pd + day][ph + hour];
            this.valueMap[pd + day][ph + hour] = +!cValue;
            this.setSingleActionFlag(day, hour);
        },
        /**
         * 将str转意为对应的节点树
         * @param {[type]} valueStr 字符串
         */
        setStrToValueObj: function(valueStr) {
            var valueObj = {};
            if (valueStr) {
                valueStr.split(';').map(function(item) {
                    var cstr = item.split('-');
                    var d = item[0] - 1;
                    valueObj[pd + d] = valueObj[pd + d] || {};
                    var start = +cstr[0].substr(1, 2);
                    var end = +cstr[1].substr(1, 2);
                    for (var i = start, j = end; i < j; i++) {
                        valueObj[pd + d][ph + i] = 1;
                    }
                });
            };
            return valueObj;
        }
    },
    ready: function() {
        this.resetValue();
    },
    data: function() {
        var data = {
            actionFlags: {
                sLine: {},
                hLine: {}
            },
            valueMap: map,
            weekName: [
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
                '星期日'
            ]
        };
        var af = data.actionFlags;
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 24; j++) {
                af.hLine['h' + i] = 0;
                af.sLine['s' + j] = 0;
            }
        }
        return data;
    }
};
</script>
<style type="text/css" lang="less">
@pieceSize: 25px;
@fontSize: 13px;
@selectedColor: #f7873d;
@unSelectedColor: #ccc;
@hoverColor: #fbd4ba;
@containerWidth: (@pieceSize * 24 + 120);

.select-timer-control {
    font-size: @fontSize;
    width: @containerWidth;
    padding: 10px;
    margin: 0 auto;

    .tip-bar {
        height: 18px;
        line-height: 18px;
        padding: 10px 0;

        .action {
            display: inline-block;

            span {
                display: inline-block;
                padding: 0 5px;
                cursor: pointer;
            }
        }
        .tip {
            display: inline-block;
            float: right;
            margin-left: 20px;

            span {
                display: inline-block;
                height: 13px;
                margin-top: 2px;
                width: 13px;
                vertical-align: top;
                margin-right: 5px;
            }
            .selected-tip {
                background-color: @selectedColor;
            }
            .unselected-tip {
                background-color: @unSelectedColor;
            }
        }
    }
    .week-container {
        .day-line {
            display: block;
        }
        .day-th-line{
            margin-top: 16px;

        }
        .day-container {
            li {
                display: inline-block;
                width: 25px;
                height: 16px;
                font-size: 0;
            }
            .week-th {
                width: 88px;
                font-size: 13px;
                background-color: #fff;
                box-sizing: border-box;
                height: @pieceSize;
                line-height: @pieceSize;
                label{
                    cursor: pointer;
                }
            }
            .hour-th, .hour-td {
                width: @pieceSize;
                height: @pieceSize;
                vertical-align: bottom;
                overflow: hidden;
                border: 1px solid #fff;
                border-width: 1px 1px 0 0;
                box-sizing: border-box;
            }
            .hour-td {
                color: #fff;
                text-align: center;
                line-height: @pieceSize;
                font-size: 12px;
                cursor: pointer;
            }
            .selected-0 {
                background-color: @unSelectedColor;
            }
            .selected-1 {
                background-color: @selectedColor;
            }
            .selected-1:hover {
                background-color: @hoverColor;
            }
            .hour-th {
                cursor: pointer;
                font-size: 14px;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
                color: #ccc;
            }
            .hour-th:hover, .hour-th.selected {
                color: #f7873d;
            }
        }
    }
}
</style>