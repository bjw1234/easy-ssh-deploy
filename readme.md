# 介绍
自动化发布工具

通过执行以下步骤，达到自动发布代码的目的：

* 执行本地 `npm` 命令，打包生成静态文件，例如 `npm run build`
* 压缩本地生成的静态文件
* `ssh` 登录，上传压缩包到指定的目录
* 备份之前的代码包，解压缩文件
* 完成，删除本地压缩包

# 用法

**安装**

```bash
npm install easy-ssh-deploy --save-dev
```

**使用**

新建 `deploy.js` 文件

```js
const deploy = require('easy-ssh-deploy');

deploy({
    sshConfig: {
    host: "",
    username: "root",
    password: "123456"
  },
  deployPath: "/data/public/",
  buildCommand: "build",
  localStaticFileName: "dist",
  serverStaticFileName: "assets"
});
```

**执行**

```bash
node ./deploy.js
```

* `ssConfig`: ssh相关配置
* `deployPath`: 远程服务器路径
* `buildCommand`: 本地打包命令，会使用`npm run`执行，默认 `build`
* `localStaticFileName`: 本地打包完成后的文件名，默认 `dist`
* `serverStaticFileName`: 服务器端静态文件名，默认 `aasets`

