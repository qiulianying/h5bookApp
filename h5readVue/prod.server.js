var express = require("express");
var app = express();

app.use(express.static("./dist"));

app.get("/", function(req, res){
    res.send("hello vue")
});

app.listen(2333);
console.log("listent at:" + "http://localhost:2333");
console.log("这里作为本机测试启动类型");
