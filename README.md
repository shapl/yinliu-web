# 淘宝联盟APP任务引流（前端）

## 安装依赖包：

```
cd /www/wwwroot/yinliu-web/

npm i

```

## 开发
```
npm run dev
```

## 部署（方式1：纯静态）

```
npm run generate
```

把根目录生成的dist目录内容，复制到网站根目录。


## 部署（方式2：node.js + pm2）

```
pm2 start npm --name yinliu -- run start
```

本地访问`http://localhost:3000`，服务端需做反向代理。


# 其他问题处理方案


## 样式预处理器

```
sass: npm install --save-dev sass-loader node-sass
less: npm install --save-dev less-loader less
stylus: npm install --save-dev stylus-loader stylus
```

## 版本兼容

less-loader 报错 `TypeError: this.getOptions is not a function	at Object.lessLoader ：`，降级解决。

```
npm uninstall less-loader
npm install less-loader@5.0.0
```