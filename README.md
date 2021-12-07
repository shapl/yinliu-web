# 淘宝联盟APP任务引流（前端部分）

## 安装依赖包：

```
cd /www/wwwroot/yinliu-web/

npm i

```

## 执行pm2任务
```
pm2 start npm --name yinliu -- run start
```

## 预处理器

```
sass: cnpm install --save-dev sass-loader node-sass
less: cnpm install --save-dev less-loader less
stylus: cnpm install --save-dev stylus-loader stylus
```

## 版本兼容

less-loader 报错 `TypeError: this.getOptions is not a function	at Object.lessLoader ：`

```
npm uninstall less-loader
npm install less-loader@5.0.0
```