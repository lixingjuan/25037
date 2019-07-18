var request = require("request");   //
var cheerio = require("cheerio");   //jq
const https = require('https')      //https服务
const fs = require('fs')    //文件操作
const express = require('express');
const app = express();



var dataArr = []
var dataJson = fs.readFileSync('./json/json.json', 'utf8');
//获取所有url的数据，然后存在数组 dataArr[]里面
let getAllimgData = new Promise((resolve, reject) => {
    let dataArr = []
    // 放置要爬取的URL,一会替换成一个获取url的条数函数
    let urlManage = [
        'https://www.ivsky.com/tupian/ziranfengguang/',
        'https://www.ivsky.com/tupian/ziranfengguang/index_2.html',
        'https://www.ivsky.com/tupian/ziranfengguang/index_3.html',
        'https://www.ivsky.com/tupian/ziranfengguang/index_4.html',
        'https://www.ivsky.com/tupian/ziranfengguang/index_5.html',
        'https://www.ivsky.com/tupian/ziranfengguang/index_6.html',
    ]
    urlManage.map((item) => {
        request(item, function (error, response, body) {
            $ = cheerio.load(body); //获取html页面
            $("ul.ali li img").each(function (i, ele) { //获取body下所有的图片路径 
                let imgData = {
                    alt: $(ele).attr('alt'), // 获取alt
                    href: 'https:' + $(ele).attr('src') // 获取图片地址
                };
                dataArr.push(imgData) // 存入最终结果数组
            })
            fs.writeFile('./json/' + 'json.json', JSON.stringify(dataArr, null, 0), 'utf8', (err) => { console.log('JSON写入成功') })
        })
        return dataArr;
    })
    resolve()
}).then(() => {
    // 读取json文件
    let dataArr = JSON.parse(dataJson)
    // 标记图片数量
    let markNumber = 0
    saveImage(dataArr, markNumber);
}, () => {
    console.log("出错了")
})

// 从dataJson文件里面读取数据，然后保存图片
let saveImage = (dataArr, markNumber) => {
    let markNumberArr = []
    markNumberArr.push(markNumber);
    let url = dataArr[markNumber].href;
    let altContent = dataArr[markNumber].alt;
    https.get(url, (req, res) => {
        var imgData = '';
        req.on('data', function (chunk) {
            imgData += chunk;
        })
        req.setEncoding('binary');
        req.on('end', function () {
            //创建文件夹
            fs.mkdir('./images', function (error) {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('创建目录成功');
            })
            fs.mkdir('./images/' + markNumber, function (error) {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('创建目录1成功');
            })
            //创建图片
            fs.writeFile('./images/' + markNumber + '/' + markNumber + '.jpg', imgData, 'binary', (err) => {
                console.log('保存图片成功')
            })
            //创建放置描述文本的txt
            fs.writeFile('./images/' + markNumber + '/alt.txt', altContent || '本图片的描述文本', 'utf8', (error) => {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('写入成功');
            })
        })
        return markNumber;
    })
    markNumber = markNumber + 1;
    if (markNumber === 100) {
        console.log(markNumberArr)
        return;
    }
    saveImage(dataArr, markNumber)
}

// // // 服务器监听3000端口
// let server = app.listen(3000, function () {
//     let host = server.address().address;
//     let port = server.address().port;
//     console.log('Your App is running at http://%s:%s', host, port);
// });

// app.get('/', async (req, res, next) => {
//     res.send({
//         dataJson,
//     });
// });