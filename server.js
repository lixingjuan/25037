

const Koa = require('koa')
const serve = require('koa-static')
const {
    join
} = require('path')

const app = new Koa()

// const superagent = require('superagent')

app.use(serve(join(__dirname, '')));

app.listen(8000, () => {
    console.log('服务器启动成功！')
})
