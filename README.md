# ssc30-admin

本项目覆盖的功能包括并不限于：

- SSC 3.0 后台管理
- 友报账 - 基础档案
- 友账表 - 基础档案
- 友账表 - 会计平台（部分页面）

## 进行开发

安装依赖

```
npm install
```

以调试模式运行

```
npm run dev
```

打开 http://127.0.0.1:3008/ 访问首页

## 在本地测试编译结果

Development feature, like webpack HMR, is not include in demo mode. As this you could host this demo on a web server.

```
npm run build
npm run demo
```

Open http://127.0.0.1:3008/

## 发布到阿里云

**注意**: 先确认有权限登录阿里云服务器

发布之前先在本地测试一下，运行如下命令

```
npm run build
npm run demo
```

然后在浏览器中测试一下页面显示没有问题，点一点按钮看看是否可以正常提交数据。

升级版本号，比如升级到0.1.4

先修改`package.json`中的版本号

```
git add package.json
git commit -m 'new release'
git tag -a v0.1.4 -m 'new release'
git push --follow-tags
```

运行如下命令，先调用webpack进行打包，然后将结果通过rsync同步到阿里云服务器上。

```
npm run release
YBZ_PROD_SERVER=10.3.14.240 npm run release # 重新指定后端服务器地址
```

## 发布友报账

```
npm run release:ybz
```

## 发布友账表

```
npm run release:yzb
```

## React components tree

<pre>
ArchContainer
|-- Grid 布局
|   |-- Row
|   |   `-- Col
|   |       `-- AdminCardActions 数据操作按钮
|   `-- Row
|       `-- Col
|           `-- AdminTable 表格
|-- AdminEditDialog
|   `-- AdminEditForm 编辑表单
`-- AdminEditDialog
    `-- AdminEditForm 创建表单
</pre>

组件结构图

![](https://docs.google.com/drawings/d/1tDPkbnKg0LESWVVfw_bP96HA5pJObeLsaCRxSUEdUbo/pub?w=960&h=720)

## Components

### AdminEditForm

#### Actions



## redux state tree

### 档案管理

```json
{
  "arch": {
    "data": {
      "items": [
        {
          "id": '0',
          "col1": 'row1, col1',
          "col2": 'row1, col2',
          "cols": [
            { "type": 'text', label: 'col1', value: 'row1, col1' },
            { "type": 'text', label: 'col2', value: 'row1, col2' }
          ]
        },
        {
          "id": '1',
          "col1": 'row2, col1',
          "col2": 'row2, col2',
          "cols": [
            { type: 'text', label: 'col1', value: 'row2, col1' },
            { type: 'text', label: 'col2', value: 'row2, col2' }
          ]
        }
      ],
      "currentItemCount": null,
      "startIndex": null,
      "totleItems": null
    },
    "selectedRows": '',
    "editDialog": {
      show: false,
      rowId: 0,
      formData: [
        { type: 'text', label: 'col1', value: 'row1, col1' },
        { type: 'text', label: 'col2', value: 'row1, col2' }
      ]
    },
    editFormData: [
      { type: 'text', label: 'col1', value: 'row1, col1' },
      { type: 'text', label: 'col2', value: 'row1, col2' }
    ],
    submitting: false,
    submited: false,
    createDialog: {
      show: false
    },
    createFormData: [
      { type: 'text', label: 'col1', value: 'row1, col1' },
      { type: 'text', label: 'col2', value: 'row1, col2' }
    ]
    adminAlert: {
      show: false,
      error: {
        code: 0,
        message: ''
      }
    }
  }
}
```

### 角色管理

```json
{
  "arch": {
    "data": {
      "items": [
        {
          "id": '0',
          "col1": 'row1, col1',
          "col2": 'row1, col2',
          "cols": [
            { "type": 'text', label: 'col1', value: 'row1, col1' },
            { "type": 'text', label: 'col2', value: 'row1, col2' }
          ]
        },
        {
          "id": '1',
          "col1": 'row2, col1',
          "col2": 'row2, col2',
          "cols": [
            { type: 'text', label: 'col1', value: 'row2, col1' },
            { type: 'text', label: 'col2', value: 'row2, col2' }
          ]
        }
      ],
      "currentItemCount": null,
      "startIndex": null,
      "totleItems": null
    },
    "selectedRows": '',
    "editDialog": {
      show: false,
      rowId: 0,
      formData: [
        { type: 'text', label: 'col1', value: 'row1, col1' },
        { type: 'text', label: 'col2', value: 'row1, col2' }
      ]
    },
    editFormData: [
      { type: 'text', label: 'col1', value: 'row1, col1' },
      { type: 'text', label: 'col2', value: 'row1, col2' }
    ],
    submitting: false,
    submited: false,
    createDialog: {
      show: false
    },
    createFormData: [
      { type: 'text', label: 'col1', value: 'row1, col1' },
      { type: 'text', label: 'col2', value: 'row1, col2' }
    ]
    adminAlert: {
      show: false,
      error: {
        code: 0,
        message: ''
      }
    }
  }
}
```

## Demos

- AdminEditForm http://127.0.0.1:3008/admin/#/demo/form

## Naming rule

### user operations

- `Create`, `Add` - create or add new entries
- `Read`, `Retrieve`, `Search`, `View` - read, retrieve, search, or view existing entries
- `Update`, `Edit` - update or edit existing entries
- `Delete`, `Deactivate`, `Remove` - delete/deactivate/remove existing entries

### Action name

`<noun>-<verb>`，比如`Project-Create`, `User-Login`，这样以object type（而不是action type）进行分组。

https://medium.com/lexical-labs-engineering/redux-best-practices-64d59775802e#7f41

## 创建新页面的一般步骤

比如页面名称叫做“基础档案配置页面”，那么名称定为`ArchSetting`

1. 创建Container，位置`./containers/ArchSettingPage.js`
1. 创建Action，位置`./actions/archSetting.js`
1. 创建Action type，位置`./constants/ArchSettingActionTypes.js`
1. 创建Reducer，位置`./reducers/archSetting.js`
  - 并添加到`combineReducers()`中，位置`./reducers/index.js`
1. 添加到Sidebar中，位置`./components/Sidebar.js`
1. 添加到Router中，位置`./index.js`
1. 创建fake API，位置`../../app_admin.js`
  - 创建middleware，位置`../server/routes/fakeApiArchSetting.js`

## Redux actions and reducers

![Redux actions and reducers](https://docs.google.com/drawings/d/163ixocYs8FJHo4WalW_bsZWg0w3PwZfg7xrSDM8Kq_E/pub?w=960&h=720)

## 常用网址

- 内网测试地址 http://10.1.78.23:3008/admin
- 外网测试地址 http://10.3.14.237:3000/admin
- SSC 3.0 on Google Drive - https://drive.google.com/drive/folders/0B_RIK8efdyq-QUx6RG9yaVR2cjA?usp=sharing
- API文档 https://xxd3vin.github.io/swagger-ui/?url=https://xxd3vin.github.io/attachments/yonyou-ssc30/swagger-api.json

## ref

- https://github.com/marmelab/admin-on-rest 可以借鉴UI
- https://google.github.io/styleguide/jsoncstyleguide.xml 可以借鉴JSON API Design
