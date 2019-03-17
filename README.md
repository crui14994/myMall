## 使用说明

> 本项目把后端代码放在server文件夹中，实际上是前后端分离的！

``` bash
# 在项目目录和server目录分别进行安装依赖
cnpm install

# 在mongoDB中新建数据库mymall，并导入goods和user（两个文件在mock目录下）
mongoimport --db mymall --collection goods --drop --file dumall-goods(文件地址)
mongoimport --db mymall --collection users --drop --file dumall-users(文件地址)

# 使用pm2启动node的服务器，同事mongoDB数据库开机
pm2 start bin/www(www文件地址)

# 运行项目
npm run dev

# 打包
npm run build
```


## Vue2.0+Node.js+MongoDB全栈打造商城系统
---

## 前言
商城系统，用到的技术栈
> Vue + Vue-Router + Vuex + nodejs + express + mongodb + mongoose

## 一.实现功能
1. 该系统包括商品列表模块,登录模块,购物车模块,地址模块,订单确认模块订单成功模块。
2. 基于Vuex对登录和购物车数量进行管理。
3. 基于Node.js开发商品列表，用户信息及购物车等所需接口(商品列表分页和排序功能;价格过滤功能)。

## 二.项目结构分析：

    build/----文件是 webpack 的打包编译配置文件
    config/----文件夹存放的是一些配置项，比如我们服务器访问的端口配置等
    dist/----该文件夹一开始是不存在，在我们的项目经过 build 之后才会产出
    mock/----文件夹用来存放我们的mock的json数据
    server/----node用于创建后台接口的文件夹；与本项目目录实际是分开的，前后端分离
    src/----在此文件夹下开发vue
        assets/----存放静态资源文件和小图片，此文件夹下的图片编译打包会打包成base64格式
        components/----文件夹用来存放我们的 Vue 公共组件
        router/----文件夹存放的是vue-router相关配置
        views/---保存页面vue文件
        App.vue----根组件，所有的子组件都将在这里被引用
        main.js----入口文件的 js 逻辑
    static/----文件夹用来存放我们的静态资源文件

## 三.工具的使用
## 服务端
---
### 1.Express应用生成器
使用Express应用生成器，生成Express项目，通过应用生成器工具 express 可以快速创建一个应用的骨架。
在命令行执行下面命令安装
```
npm install express-generator -g
```
生成本地需要搭建的项目nodeproject,在当前目录下或者进入自己工作目录下执行以下命令：
```
express nodeproject
npm install //安装成功后安装依赖
npm start  //启动,在浏览器中打开 http://localhost:3000/
```
参考：[Express应用生成器](http://wiliam.me/2016/12/22/20161222132357.html)

---
### 2.pm2---node 进程管理工具
安装
```
cnpm install pm2 -g
```
用法
```
$ npm install pm2 -g     # 命令行安装 pm2
$ pm2 start app.js -i 4  # 后台运行pm2，启动4个app.js
                         # 也可以把'max' 参数传递给 start
                         # 正确的进程数目依赖于Cpu的核心数目
$ pm2 start app.js --name my-api # 命名进程
$ pm2 list               # 显示所有进程状态
$ pm2 monit              # 监视所有进程
$ pm2 logs               # 显示所有进程日志
$ pm2 stop all           # 停止所有进程
$ pm2 restart all        # 重启所有进程
$ pm2 reload all         # 0 秒停机重载进程 (用于 NETWORKED 进程)
$ pm2 stop 0             # 停止指定的进程
$ pm2 restart 0          # 重启指定的进程
$ pm2 startup            # 产生 init 脚本 保持进程活着
$ pm2 web                # 运行健壮的 computer API endpoint (http://localhost:9615)
$ pm2 delete 0           # 杀死指定的进程
$ pm2 delete all         # 杀死全部进程
```
参考：[pm2---node 进程管理工具](https://www.jianshu.com/p/c9dc9ff5fa9c)




## VUE
---
### 1.vue-lazyload实现图片懒加载
安装
```
cnpm install vue-lazyload --save
```
main.js中引入并注册vue-lazyload
```
import VueLazyload from 'vue-lazyload' //图片懒加载插件
// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: 'static/loading-svg/loading-bars.svg'
})
```
页面中的使用
```
<img :src="item.imgurl" alt="">
```
替换成：
```
<img v-lazy="item.imgurl" alt="">
```
对loading时候的gif图做下简单样式处理：
```
img[lazy='loading']{
    display:block;
    width:50px;
    height:50px;
    margin:0 auto;
}
```
参考：[vue-lazyload实现图片懒加载](https://www.jianshu.com/p/f9b1183b13af)

---
### 2.vue滚动加载插件vue-infinite-scroll
安装
```
cnpm install vue-infinite-scroll --save
```
vue在main.js中引用
```
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
```
复制html到页面
```
<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
  ...
</div>
```
在vue页面的data中定义一个busy属性，对应的是html中infinite-scroll-disabled选项
> busy为true的时候代表正在执行加载，这时候滚动不会触发方法，
```
data () {
    busy: false //是否正在加载过程中
  }
```
在methods中定义一个loadMore方法，对应的是html中v-infinite-scroll选项，当滚动到距离底部指定位置时触发的方法
```
methods: {
    loadMore: function() {
      this.busy = true;
     //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        //这里请求接口去拿数据，实际应该是调用一个请求数据的方法

      }, 1000);
    }
  }
```
参考：[vue滚动加载插件vue-infinite-scroll](https://blog.csdn.net/thatway_wp/article/details/79422368)




## 四.开发过程问题汇总

## 服务端
---
### 1.在外部写好数据库的形式，然后导入mongoDB数据库 （必须在MongoDB的bin目录下运行，否则会报错） 
  ```
  mongoimport --db mymall --collection goods --drop --file primer-dataset.json
  ```
-db test  想往哪个数据库里面导入

--collection restaurants想往哪个集合中导入

--drop 把集合清空

--file primer-dataset.json哪个文件



---
### 2.mongoose.model创建集合

mongoose是通过model来创建mongodb中对应的集合（collection）
```
module.exports = mongoose.model(‘DepotLoc’, schema);
```
DepotLoc不会出现在数据库中，在数据库中会将集合描述小写，并且如果这个集合名尾巴没有s，数据库内部处理，会形成depotLocs集合 


---
### 3.MongoDB配置
创建3个文件夹 data ，etc ，logs
> 中间这个文件夹中我们新建一个mongo.conf用于配置mongodb；配置它的目的就是以后我们启动数据库不用再去"--dbpath"指定数据存放的位置了，直接执行这个配置文件即可。

修改etc文件下面的mongo.conf配置文件，然后随便用个编辑器打开它输入以下内容后保存。
```
# 数据库路径
$ dbpath=d:\MongoDB\data\

# 日志输出文件路径
$  logpath=d:\MongoDB\logs\mongodb.log

# 错误日志采用追加模式
$ logappend=true

# 启用日志文件（默认启用）
$ journal=true

# 过滤一些无用的日志信息（需要调试设置为false）
$ quiet=true

# 端口号
$ port=27017

# 指定存储引擎（通常不需要，如果报错再加进去）
$ storageEngine=mmapv1
```
此时我们的环境变量已经配好了，所以可以直接输入命令行了（反之如果你没有配置环境变量，那么就需要进入mongodb安装的bin目录下启动服务）
```
mongod --config D:\MongoDB\etc\mongo.conf
```
参考：[MongoDB配置](https://www.jianshu.com/p/1ff7bc87bd05)

----
### 4.登录拦截（如：在没有登录前不能加入购车等） 和 验证是否登录
登录拦截 ：在server下的app.js的路由前加入如下代码
```
//登录拦截
app.use(function (req,res,next) {
  if(req.cookies.userId){
    next();
  }else{
      console.log("url:"+req.originalUrl);
      //过滤不需要拦截的路由
      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){
          next();
      }else{
          res.json({
            status:'10001',
            msg:'当前未登录',
            result:''
          });
      }
  }
});


app.use('/', indexRouter);
app.use('/users', users);
app.use('/goods', goods);
```
验证是否登录：在routes的user.js中加入如下下代码
```
//判断当前是否登录
router.get("/checkLogin", function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});
```

> 注意：在登录成功时要先把信息存入cookie
```
 res.cookie("userId", doc.userId, {
    path: '/',
    maxAge: 1000 * 60 * 60
  });
  res.cookie("userName", doc.userName, {
    path: '/',
    maxAge: 1000 * 60 * 60
  });
```
----
### 4.nginx反向代理-解决前端跨域问题及（vue-route+webpack部署单页路由项目，访问刷新出现404问题）
> 问题原因：
刷新页面时访问的资源在服务端找不到，因为vue-router设置的路径不是真实存在的路径。要在nginx配置里添加vue-route的跳转设置；详细配置如下：
```
#gzip  on;
    server {
        listen       80;
        server_name  mymall.sczhengshi.com;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;
        root C:\Users\Administrator\Desktop\server\mymall\public;
    
        location / {
            add_header 'Access-Control-Allow-Origin' '*';
            proxy_pass http://localhost:8282;
            try_files $uri $uri/ @router; #需要指向下面的@router否则会出现vue的路由在nginx中刷新出现404
            index index.html index.htm;
        }
         #对应上面的@router，主要原因是路由的路径资源并不是一个真实的路径，所以无法找到具体的文件
        #因此需要rewrite到index.html中，然后交给路由在处理请求资源
        location @router {
            rewrite ^.*$ /index.html last;
        }


        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
    server {
        listen       80;
        server_name  api.sczhengshi.com;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
           add_header 'Access-Control-Allow-Origin' '*';
           proxy_pass http://localhost:3000;
        }
        # location /api/* {
        #    add_header 'Access-Control-Allow-Origin' '*';
        #    proxy_pass http://localhost:3000;
        # }
        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
```


## VUE
----
### 1.vue中axios解决跨域问题
vue中axios不支持vue.use()方式声明使用。在main.js中引入axios，然后将其设置为vue原型链上的属性，这样在组件中就可以直接 this.axios使用了
```
import axios from 'axios';
Vue.prototype.axios=axios;
```
> 这里需要注意一点，就是在axios中把请求到的数据 使用this复制给data是无效的，使用箭头函数可以解决。

vue cli脚手架前端调后端数据接口时候的本地代理跨域问题;为什么存在跨域问题？因为这是非同源互相通讯，具体可以自己去google了解，这里只需要在webpack配置一下proxyTable就OK了，在config中找到index.js如下 ：
```
dev: {
    proxyTable: {
      '/api': {
        target: 'http://10.1.5.11:8080/',//设置你调用的接口域名和端口号 
        changeOrigin: true,     //跨域
        pathRewrite: {
          '^/api': '/'          //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://10.1.5.11:8080/xxx/duty?time=2017-07-07 14:57:22'，直接写‘/api/xxx/duty?time=2017-07-07 14:57:22’即可
        }
      }
    }
}
```
跨域成功，但是这只是开发环境（dev）中解决了跨域问题，生产环境中真正部署到服务器上如果是非同源还是存在跨域问题
首先在/config目录下新建一个文件,我这里叫api.config.js
```
//判断是否是生产环境
var isPro = process.env.NODE_ENV === 'production' //process.env.NODE_ENV用于区分是生产环境还是开发环境
//根据环境不同导出不同的baseURL
module.exports = {
    baseURL: isPro ? 'http://api.sczhengshi.com/' : '/api'
}
```
然后，在main.js中引入axios和刚才那个文件
```
import axios from 'axios';
import apiConfig from './../config/api.config.js'
axios.defaults.baseURL=apiConfig.baseURL;
Vue.prototype.axios = axios; //在后面的页面中不用再引入，只需this.axios

```
```
然后第二步后端服务器配置一下cros跨域即可，就是access-control-allow-origin：*允许所有访问的意思。综上：开发的环境下我们前端可以自己配置个proxy代理就能跨域了，真正的生产环境下还需要后端的配合的。
```
//设置跨域访问 (在server下的app.js加入以下代码)
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
```


参考：[vue中axios解决跨域问题和拦截器使用](https://blog.csdn.net/kirinlau/article/details/78611774)

----
### 2.vue-lazyload 动态切换图片问题
使用 vue-lazyload 当需要动态切换图片时，DOM绑定的图片不会变，查看插件官方文档跟demo都没有说到这一问题， 难道这个问题就不能解决了，后翻了翻Issuse刚好前辈提了这一问题，原来需要加个 key，遂加之则图片就可以动态切换了
```
<img v-lazy="ImgSrc" :key="ImgSrc">
```
----
### 2.vue项目打包上传到服务器
更改config/index.js中的build  的assetsPublicPath 值中加上.
```
// Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './', 

    /**
```
> 如果部署在服务器中不是一级页面 如：www.test.com/mall 就需要给src/router/index.js添点东西;如果是www.test.com则不用
```
export default new Router({
  mode : 'history',
  base: '/mall/',  //添加的地方
  ...
 }
```

### 3.Vue.js里面使用Axios发送Post请求出现跨域
> 具体报错如:Access to XMLHttpRequest at 'http://api.sczhengshi.com/goods/addCart' from origin 'http://mymall.sczhengshi.com' has been blocked by CORS policy: Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response.
--------------------- 
项目中引入 
```
import qs from 'qs'
```
然后我们发送Axios的时候使用qs.stringify
````
this.axios
        .post("/users/login", qs.stringify({
          userName: this.userName,
          userPwd: this.userPwd
        }))
        .then(response => {
          ...
        });
```