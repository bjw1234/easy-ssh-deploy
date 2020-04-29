const util = require('util');
const scpClient = require('scp2');
const SSH = require('simple-ssh');
const moment = require('moment');
const exec = util.promisify(require('child_process').exec);

// 默认配置
const defaultConf = {
  sshConfig: {
    host: "",
    username: "root",
    password: "123456"
  },
  deployPath: "/data/public/",
  buildCommand: "build",
  localStaticFileName: "dist",
  serverStaticFileName: "assets"
}

/**
 * 文件上传
 * @param {scp2} client scp2实例
 * @param {object} config ssh服务器配置
 * @param {string} fromPath 需要上传的文件路径
 * @param {string} toPath 服务器文件路径
 */
function uploadFile(client, config, fromPath, toPath) {
  return new Promise((resolve, reject) => {
    client.scp(fromPath, { ...config, path: toPath }, err => {
      if (!err) resolve();
      reject();
    });
  });
}

/**
 * 配置合并
 * @param {object} userConfig 用户自定义配置
 * @param {object} defaultConfig 默认配置
 */
function mergeConfig(userConfig, defaultConfig) {
  const result = Object.create(null);
  Object.keys(defaultConfig).forEach(key => {
    const defaultVal = defaultConfig[key];
    const userVal = userConfig[key];
    // 用户值不存在
    if (!userVal) {
      result[key] = defaultVal;
    } else {
      // 用户值存在
      if (typeof userVal === 'object') {
        // 复杂值
        result[key] = mergeConfig(userConfig[key], defaultConfig[key]);
      } else {
        // 简单值
        result[key] = userVal;
      }
    }
  });
  return result;
}

async function main(config) {
  try {
    const deployConfig = mergeConfig(
      config,
      defaultConf,
    );

    // 创建ssh客户端
    const sshClient = new SSH({
      host: deployConfig.sshConfig.host,
      user: deployConfig.sshConfig.username,
      pass: deployConfig.sshConfig.password,
    });

    // console.log('[1/4] 正在编译代码...');
    // await exec(`npm run ${deployConfig.buildCommand}`);
    console.log('[2/4] 打包静态资源生成压缩包中...');
    await exec(`zip -r ${deployConfig.localStaticFileName}.zip ./${deployConfig.localStaticFileName}`);
    console.log('[3/4] 正在上传压缩包...');
    await uploadFile(
      scpClient,
      deployConfig.sshConfig,
      `./${deployConfig.localStaticFileName}.zip`,
      deployConfig.deployPath
    );

    console.log('[4/4] 正在解压并发布...');
    sshClient.exec(
      `
        cd ${deployConfig.deployPath} \n
        rm -rf ${deployConfig.localStaticFileName} \n
        rm -rf ${deployConfig.serverStaticFileName}-${moment().format('YYYYMMDD')} \n
        unzip -o ${deployConfig.localStaticFileName}.zip \n
        mv ${deployConfig.serverStaticFileName} ${deployConfig.serverStaticFileName}-${moment().format('YYYYMMDD')} \n
        mv ${deployConfig.localStaticFileName} ${deployConfig.serverStaticFileName} \n
      `
    )
      .on('error', (err) => {
        console.log(err);
        sshClient.end();
      })
      .start();

    // 删除本地压缩包
    await exec(`rm ./${deployConfig.localStaticFileName}.zip`);

  } catch (e) {
    console.error(e);
  }
}

module.exports = main;
