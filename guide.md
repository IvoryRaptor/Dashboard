
# MongoDB
<br>
### page表 ----页面基本参数  


Option           | 例子                | Description
:----------------|:------------------|:----------------------------------------
template         | "TablePage"         | 页面模板 例如列表页，树型页
resource         | "group"            | 对应resource表的key
table            |                    | 主列表选项 { operations: 最后一列操作按钮 , columns: 需要显示的列key, select: 行是否可选 }
filter           |                    | 顶部搜索框等配置
modal            |                    | 分别配置不同弹出框需要显示的项目 { "edit" : [], "create": [], "view" :[] }
path             |"/permission/group" | 页面对应的路由URL
setup            |                    | 页面加载时需要发的消息 参考dva setup


##### 例子： 

```json
{ 
    "_id" : ObjectId("5a3876c8e0437b8a8ada27a1"), 
    "template" : "TablePage",  
    "resource" : "group", 
    "table" : {   
        "operations" : [
            {
                "action" : "edit"
            }, 
            {
                "action" : "delete"
            }
        ], 
        "columns" : [
            "name"
        ]
    }, 
    "filter" : { }, 
    "modal" : {
        "edit" : [
            "name",
            "role"
        ], 
        "create" : [
            "name",
            "role"
        ], 
        "view" : [
            "name",
            "role"
        ]
    }, 
    "path" : "/permission/group", 
    "setup" : [
        {
            "type" : "group/fetch"
        }, 
        {
            "type" : "role/$all"
        }
    ]
}
``` 
<br><br>

### resource ---资源配置 


Option           | 例子                | Description
:----------------|:-------------------|:----------------------------------------
key              | "group"            | 对应page配置里的resource
action           |                    | 当前资源支持的操作
fields           |                    | 资源下每个字段的属性，控制页面编辑时的显示
 

```json
{ 
    "_id" : ObjectId("5a38be8fe0437b8a8ada27a0"), 
    "key" : "group", 
    "model" : {
        "template" : "MasterModelTemplate"
    }, 
    "template" : "Resource", 
    "action" : {
        "get" : ObjectId("5a38aeb7e0437b8a8ada27aa"), 
        "save" : ObjectId("5a38aeb7e0437b8a8ada27aa"), 
        "list" : ObjectId("5a38aeb7e0437b8a8ada27aa"), 
        "all" : ObjectId("5a38aeb7e0437b8a8ada27aa")
    }, 
    "fields" : {
        "_id" : {
            "template" : "InputField"
        }, 
        "name" : {
            "required" : true, 
            "template" : "InputField"
        }, 
        "role" : {
            "input" : "checkbox", 
            "type" : "array", 
            "source" : "role", 
            "template" : "ArraySourceField"
        }
    }
}
```
 
<br><br>
### locale ---语言包配置 


* ##### 放到"pages"内

```json
"group" : {
        "fields" : {
            "_id" : "编号", 
            "name" : "组名", 
            "role" : "角色"
        }
    },
```
*** 

<br><br><br>
# Code 

### src/pages/permission

* ### 增加group的routes : permission/routes/group/index.js


```javascript
import React from 'react'
import { Page } from 'components'
import { connectResource } from '../../../../goshawk/'

const goshawk = window.goshawk
const Group = ({ ...props }) => {
  const page = goshawk.pages[window.location.pathname]
  if (!page) {
    return null
  }
  page.template.init({ page, ...props }) // 初始化页面参数 
  const pageConf = {
    /********** 列表配置
     定制列表显示内容 :
     col : [{ key: 'abc', render: row => () }],

     定制操作按钮显示 :
     buttons: [{ action: 'abc', handle: (row) => {} }],
     
    ***********/
    tableConf: { 
      select: true,
    },

    /******** 弹出层配置
    弹出层分为 create, edit , view 三种, 
    以修改edit弹出层内容为例:
    edit: {
        fields: [{ 
            key: 'name', 
            render: data => <h1>name</h1> 
            setValue: (object, { value, name }) => {}
        }],
        okText: 'Fuck',
    }
    fields 控制条目显示及修改
    ********/
    modalConf: { 
      create: {},
      edit: {},
      view: {},
    },

    filterConf: {
        //搜索框配置
    },
  }
  return (
    <Page inner>
      {page.template.render(pageConf)}
    </Page>
  )
}
export default connectResource('group', () => ({}))(Group)

```
<br><br>
* ### router 配置动态加载 --> permission/index.js :

```javascript
goshawk.router({
    path: '/permission/group',
    component: () => import('./routes/group/'),
  })
```












