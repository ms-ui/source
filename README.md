## smui 使用说明

### 安装


***npm导入项目依赖***

```sh
cd myproject
npm install smui -s -d

```

***引入模块***


```js

// 引入所有模块

import * as smui from 'smui'

// 引入部分模块, 仍然会加载所有组件

import {Table, Calendar} from 'smui'

// 按需导入文件

import Table from 'smui/Table'
import Pager from 'smui/Pager'

```

## 构建

polly | build | pack

* polly 解决v1和v2的差异
* build 将vue打包成js文件
* pack 将构建结果合并成单一文件


### 构建输出 Vue1.0

```
npm run build#smui
```

### 构建输出 Vue2.0

```
npm run build#msui
```