# 介绍
自动化发布工具

通过执行以下步骤，达到自动发布代码的目的：

* 执行本地 `npm` 命令，打包生成静态文件，例如 `npm run build`
* 压缩本地生成的静态文件
* `ssh` 登录，上传压缩包到指定的目录
* 备份之前的代码包，解压缩文件
* 完成，删除本地压缩包

# 配置

需要在根目录新建 `.deploy.json` 文件，在这个文件中应该有以下配置：

```json
{
  "sshConfig": {
    "host": "192.168.126.142",
    "username": "root1",
    "password": "dYXWWWamwZs5"
  },
  "deployPath": "/data/console/public/",
  "buildCommand": "test",
  "localStaticFileName": "baiDist",
  "serverStaticFileName": "baiAssets"
}
```

* `ssConfig`: ssh相关配置
* `deployPath`: 远程服务器路径
* `buildCommand`: 本地打包命令，默认 `npm run build`
* `localStaticFileName`: 本地打包完成后的文件名，默认 `dist`
* `serverStaticFileName`: 服务器端静态文件名，默认 `aasets`

