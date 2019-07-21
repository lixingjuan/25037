## github 静态页面地址

https://lixingjuan.github.io/25037/

## 爬取网站地址为
https://www.ivsky.com/tupian

## 项目启动
- node server.js
- node index.js

## 设计思路
1. 首先遍历获取指定链接的图片以及其描述文本
2. 将获取到的数据转化内为json格式存储于 /json/json.json文件中
3. 以对象的形式存储，包含每张图片地址以及描述
4. 前台从爬取的图片文件中直接读取保存的图片渲染页面，格式转换后渲染页面
5. 遍历中通过设置变量的方式控制图片的数量

## 踩坑
- .gitlab-ci.yml 的配置上
- `-d ./ -b master`——————  ./ 是生成的页面的位置 master 是目标分支
- 注意缩进，同级的一定要对齐
- `${GITLAB_USER_NAME}-${GITLAB_USER_LOGIN}` ———————— 目标的用户名和密码

```yml
image: node
deploy:
  cache:
    paths:
    - node_modules/
    - yarn.lock
    - .cache/
  script:
  - yarn --cache-folder ./.cache
  - node index.js
  - yarn global add gh-pages --cache-folder ./.cache
  - git config --global user.email ${GITLAB_USER_EMAIL}
  - git config --global user.name ${GITLAB_USER_NAME}-${GITLAB_USER_LOGIN}
  - gh-pages -g `date +%Y.%m.%d.%H.%M.%S` -d ./ -b master -r https://${GIT_USER}:${GIT_PASS}@github.com/lixingjuan/25037.git
  only:  
  - master
```