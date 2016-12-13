export default {
    props: ['params'],
    data() {
        var params = {
            clazz: ['msui', 'sm-skin'],
            uiType: 'msui',
            VueVersion: 1
        }

        // params 主要是对外可访问的数据，传入参数
        if (this.$options.params) {
            Object.assign(params, this.$options.params)
        }

        // private 用于表示内部状态数据
        if (this.$options.private) {
            Object.assign(params, this.$options.private)
        }

        return params
    },
    beforeMount() {
        this.VueVersion = 2 // 只有vue2.0才会触发的钩子
    },
    mounted() {
        this.__initComp.call(this)
    },
    compiled () {
        this.__initComp.call(this)
    },
    ready () {
        this.__isReady = true
    },
    watch: {
        params: {
            handler (value) {
                this.setOptions(value)
            },
            deep: true
        }
    },
    methods: {
        __initComp() {
            if (this.__isReady) {
                return
            }
            this.prepare()
            if (this.$options.ready) {
                let fns = [].concat(this.$options.ready)
                fns.forEach((fn) => {fn.call(this)})
            }
        },
        prepare () {
            if (this.params) {
                this.setOptions(this.params)
            }
            // 为所有组件挂载统一的class
            if (this.$el && this.$el.classList) {
                this.$el.classList.add('smui')
                if (this.uiType) {
                    this.$el.classList.add(this.uiType)
                }
            }
            this.__ready = true
        },
        emit (type, data) {
            // 提供统一的事件出口, 统一数据格式
            this.$emit(type, {data: data})
        },
        setOptions(params) {
            // 设置统一的参数入口
            Object.assign(this, params)
        }
    }
}