# smart-map

智能楼宇项目

## 项目构架

底层框架: [Remax](https://remaxjs.org/)

前端组件库: [Vant-Weapp](https://youzan.github.io/vant-weapp/#/intron)

包管理工具: 使用 [yarn 2.x](https://yarnpkg.com/) 进行包管理.

NodeJS 版本需求: [NodeJS](https://nodejs.org/en/) 版本 >= 13.5.0.

### 项目架构说明

本项目采用 Remax 作为底层开发框架,Vant-Weapp 作为前端 UI 库进行开发.所有规范均符合 Remax 的文档要求.可参考 Remax 官方文档查看一些配置和插件.现简要说明下当前项目中的文档结构.

**注意:** 只能使用 yarn 进行包管理.

### 目录结构

项目大致是这样的,

    .
    ├── package.json
    ├── dist                                build后的静态资源文件夹,使用微信开发者工具导入该目录,即可预览小程序
    ├── typings                             TS类型声明
    └── src                                 源码目录
        ├── assets                          静态资源文件,存放一些图标,图片等
        ├── components                      公共组件.
        ├── extensions                      一些扩展,本项目中对部分基础类型数据进行了原型链的扩展.使其有一些丰富的功能
        ├── service                         请求API返回响应
        ├── pages                           项目页面组件.
            └── dirs                        不同路由组件不同的文件夹存放相关源码文件
        ├── app.tsx                         小程序的入口文件,改文件中写了蓝牙相关内容,以及一些全局数据,使用React Context进行管理.
        ├── app.config.ts                   小程序基础配置,如路由,一些全局样式,全局名称等参考小程序官方文档说明.
        └── app.less                        全局样式文件,一些全局的样式,可以写在该文件中.
    └── other files                         其他配置文件,如git,eslint,prettier,stylelint相关插件的一些配置.

## 根目录

### package.json

包含插件和插件集,以及一些开发依赖库

### dist 目录

执行 `yarn build` 后,产物默认会存放在这里.

## `/src` 目录

所有页面源码.

### 脚本命令

#### yarn install

安装项目所需依赖包.

#### yarn start

启动项目,启动成功后打开浏览器,在微信开发者工具中打开 dist 目录即可查看开发时的页面以及一些异常信息.

#### yarn build

构建项目,打包后的项目文件,体积会比 start 后小,压缩了源码,删减了一些警告信息.

#### yarn upgrade-interactive

使用 yarn 更新项目依赖包.做开发建议经常更新依赖,这样不仅能解决一些 bug,特别是 Remax 基础库.

#### yarn set version berry

更新 yarn 2 自身
