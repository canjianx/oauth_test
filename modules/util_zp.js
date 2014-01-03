
/**
 * util by zp 
 */
/*jslint nomen: true, debug: true, evil: true, vars: true, browser:true, devel:true, indent:4 */
var util = require("util");
var http = require("http");
var url = require("url");
var BufferHelper = require("bufferhelper");
var iconv_lite = require("iconv-lite");

function getImage(URL, callback) {
    //var content = "";
    var bufferHelper = new BufferHelper();
    http.get(URL, function (res) {
        console.log(res);
        res.on("data", function (chunk) {
            bufferHelper.concat(chunk);
            //content += chunk;
        }).on("end", function () {
            var type = res.headers["content-type"];
            callback({ type: type, data: bufferHelper.toBuffer().toString() });
        });
    }).on("error", function (e) {
        callback("error");
    });
}
exports.getImage = getImage;

function bufToStr(buf, encode) {
    var content;
    if (encode) {
        if (encode && encode.toLowerCase() === "gbk") {
            content = iconv_lite.decode(buf.toBuffer(), encode);
        } else {
            var curBuffer = buf.toBuffer();
            var gb18030_to_utf8_iconv = new Iconv(encode, "UTF-8");
            curBuffer = gb18030_to_utf8_iconv.convert(curBuffer);
            content = curBuffer.toString();
        }
    } else {
        content = buf.toBuffer().toString();
    }
    return content;
}

function getPage(URL, callback, data, encode) {
    var bufferHelper = new BufferHelper();
    var urlObj = url.parse(url);
    http.get(urlObj, function (dataXHR) {
        dataXHR.on("data", function (chunk) {
            bufferHelper.concat(chunk);
        }).on("end", function () {
            var location = this.headers.location;
            var content = bufToStr(bufferHelper, encode);
            var newURL;
            if (location !== undefined) {
                newURL = urlObj.host + location;
                getPage(newURL, callback, data);
            } else {
                var redirectStr = "Your browser should have redirected you to ";
                var contentStr = util.inspect(content);
                if (contentStr.indexOf(redirectStr) !== -1) {
                    newURL = contentStr.replace(redirectStr, "");
                    console.log("redirected : " + newURL);
                    getPage(newURL, callback, data);
                } else {
                    callback(content, data);
                }
            }
        });
    });
}
exports.getPage = getPage;

function post(URL, data, callback) {
    var bufferhelper = new BufferHelper();
    var urlObj = url.parse(URL);
    urlObj.method = "POST";
    http.request(urlObj, function (res) {
        res.on("data", function (chunk) {
            bufferhelper.concat(chunk);
        }).on("end", function () {
        });
    });
}