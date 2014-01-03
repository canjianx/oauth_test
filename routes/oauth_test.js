/*jslint nomen: true, debug: true, evil: true, vars: true, browser:true, devel:true, indent:4 */

var OAuth = require("../modules/oauth.js").OAuth;
var util_zp = require("../modules/util_zp");
var $ = require("jquery");
var youdaoInfo = {
    "consumerKey": "f242b67217e8b80b5b529c9805baffa3",
    "consumerSecret": "9627b3387f617dd1290135a75c4528e3",

    "serviceProvider": {
        "signatureMethod": "HMAC-SHA1",
        "requestTokenURL": "http://sandbox.note.youdao.com/oauth/request_token",
        "userAuthorizationURL": "http://sandbox.note.youdao.com/oauth/authorize",
        "accessTokenURL": "http://sandbox.note.youdao.com/oauth/access_token"
    }
};

function parseOauthPar(parameters) {
    var i, len;
    var retAry = [];
    for (i = 0, len = parameters.length; i < len; ++i) {
        retAry.push(parameters[i].join("="));
    }
    return retAry.join("&");
}

function getRequestToken(callback) {
    var appConsumer = {
        "id" : youdaoInfo.consumerKey,
        "secret" : youdaoInfo.consumerSecret
    };
    var accessor = {
        consumerSecret: appConsumer.secret,
        tokenSecret: ""
    };
    var message = {
        action: youdaoInfo.serviceProvider.requestTokenURL,
        method: "POST",
        parameters: [
            ["oauth_consumer_key", "f242b67217e8b80b5b529c9805baffa3"],
            ["oauth_signature_method", "HMAC-SHA1"],
            ["oauth_timestamp", ""],
            ["oauth_nonce", ""],
            ["oauth_signature", ""]
        ]
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var par = parseOauthPar(message.parameters);
    util_zp.post(youdaoInfo.serviceProvider.requestTokenURL, par, function (data) {
        console.log(data);
    });
    //var parameterMap = OAuth.getParameterMap(message.parameters);
}


exports.request = function (req, res) {
    getRequestToken(function (data) {
    });
};