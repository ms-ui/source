<template>
<div class="smui">
    <div class="mleft">
        <div class="tree-title">
            <a>全部文章</a>
        </div>
        <tree :params="{items: params.treeData}"></tree>
    </div>
    <div class="mright">
        <scrum :params="{items: params.scrumList}"></scrum>
        <setting></setting>
        <tab :params="{items: params.tabList, tab: tab, subTab: subTab}"
          @tab-change="changeTab"></tab>
        <data-panel :items="params.dataList"></data-panel>
    </div>
</div>
</template>

<script type="text/javascript">
import DataPanel from './DataPanel.vue'
import Setting from './Setting.vue'
import {Tree, Scrum, Tab} from 'smui'

export default {
    data () {
      return {
          tab: 'table',
          subTab: 'message',
          params: {
              searchTitle: '',
              treeData: []
          }
      }
    },
    methods: {
        changeTab(e) {
            this.tab = e.data.tab
            this.subTab = e.data.subTab
        }
    },
    components: {
        DataPanel, Tree, Tab, Scrum, Setting
    }
}
</script>

<style type="text/css" lang="less">

.tree-title {
    font-size: 14px;
    height: 45px;
    line-height: 45px;
    padding-left: 16px;
    border-bottom: 1px solid #e4e4e4;
}
.mleft {
  position: fixed;
  top: 0;
  width: 200px;
  border-right: 1px solid #CCC;
  min-height: 100vh;
}
.mright {
  margin-left: 200px;
}
.mright  .scrum {
  padding-left: 10px;
  height: 24px;
}
</style>
