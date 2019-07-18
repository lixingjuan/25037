// const Koa = require('koa');
// const app = new Koa();

// app.use(require('koa-static')(__dirname + '/pages/'));
// app.listen(8000, function () {
//     console.log('Requester is listening on port '+ 8000);
// });

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
