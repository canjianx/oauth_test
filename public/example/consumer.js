/*jslint nomen: true, debug: true, evil: true, vars: true, browser:true, devel:true, indent:4 */
var OAuth;
var consumer = {};

consumer.example = {
    consumerKey: "myKey",
    consumerSecret: "mySecret",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1",
        requestTokenURL: "http://localhost/oauth-provider/request_token",
        userAuthorizationURL: "http://localhost/oauth-provider/authorize",
        accessTokenURL: "http://localhost/oauth-provider/access_token",
        echoURL: "http://localhost/oauth-provider/echo"
    }
};

consumer.madgex = {
    consumerKey: "key",
    consumerSecret: "secret",
    accessToken: "requestkey",
    accessTokenSecret: "requestsecret",
    echo: "accesskey",
    echoSecret: "accesssecret",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1",
        requestTokenURL: "http://echo.lab.madgex.com/request-token.ashx",
        accessTokenURL: "http://echo.lab.madgex.com/access-token.ashx",
        echoURL: "http://echo.lab.madgex.com/echo.ashx"
    }
};

consumer.mediamatic = {
    consumerKey: "e388e4f4d6f4cc10ff6dc0fd1637da370478e49e2",
    consumerSecret: "0b062293b6e29ec91a23b2002abf88e9",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1",
        requestTokenURL: "http://oauth-sandbox.mediamatic.nl/module/OAuth/request_token",
        userAuthorizationURL: "http://oauth-sandbox.mediamatic.nl/module/OAuth/authorize",
        accessTokenURL: "http://oauth-sandbox.mediamatic.nl/module/OAuth/access_token",
        echoURL: "http://oauth-sandbox.mediamatic.nl/services/rest/?method=anymeta.test.echo"
    }
};

consumer.termie = {
    consumerKey: "key",
    consumerSecret: "secret",
    accessToken: "requestkey",
    accessTokenSecret: "requestsecret",
    echo: "accesskey",
    echoSecret: "accesssecret",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1",
        requestTokenURL: "http://term.ie/oauth/example/request_token.php",
        userAuthorizationURL: "accessToken.html",
        accessTokenURL: "http://term.ie/oauth/example/access_token.php",
        echoURL: "http://term.ie/oauth/example/echo_api.php"
    }
};

consumer.youdaoyun = {
    consumerKey: "f242b67217e8b80b5b529c9805baffa3",
    consumerSecret: "9627b3387f617dd1290135a75c4528e3",
    accessToken: "requestkey",
    accessTokenSecret: "requestsecret",
    echo: "accesskey",
    echoSecret: "accesssecret",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1",
        requestTokenURL: "http://note.youdao.com/oauth/request_token",
        userAuthorizationURL: "http://note.youdao.com/oauth/authorize",
        accessTokenURL: "http://note.youdao.com/oauth/access_token",
        echoURL: "http://sandbox.note.youdao.com/oauth"
    }
};

consumer.initializeForm = function initializeForm(form, etc, usage) {
    var selector = etc.elements[0];
    var selection = selector.options[selector.selectedIndex].value;
    var selected = consumer[selection];
    if (selected !== null) {
        consumer.setInputs(etc, {
            URL: selected.serviceProvider[usage + "URL"],
            consumerSecret: selected.consumerSecret,
            tokenSecret: selected[usage + "Secret"]
        });
        consumer.setInputs(form, {
            oauth_signature_method: selected.serviceProvider.signatureMethod,
            oauth_consumer_key: selected.consumerKey,
            oauth_token: selected[usage]
        });
    }
    return true;
};

consumer.setInputs = function setInputs(form, props) {
    var p;
    for (p in props) {
        if (props.hasOwnProperty(p)) {
            if (props[p] !== undefined && form[p] !== undefined && form[p] !== null && props[p] !== null) {
                form[p].value = props[p];
            }
        }
    }
};

consumer.signForm = function signForm(form, etc) {
    form.action = etc.URL.value;
    var accessor = {
        consumerSecret: etc.consumerSecret.value,
        tokenSecret: etc.tokenSecret.value
    };
    var message = {
        action: form.action,
        method: form.method,
        parameters: []
    };
    var e, p;
    for (e = 0; e < form.elements.length; ++e) {
        var input = form.elements[e];
        if (input.name !== null && input.name !== "" && input.value !== null && (!(input.type === "checkbox" || input.type === "radio") || input.checked)) {
            message.parameters.push([input.name, input.value]);
        }
    }
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    //alert(outline("message", message));
    var parameterMap = OAuth.getParameterMap(message.parameters);
    for (p in parameterMap) {
        if (parameterMap.hasOwnProperty(p) && p.substring(0, 6) === "oauth_" && form[p] !== null && form[p].name !== null && form[p].name !== "") {
            form[p].value = parameterMap[p];
        }
    }
    return true;
};




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

function getRequestToken () {
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
        parameters:[
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
    
    $.post(youdaoInfo.serviceProvider.userAuthorizationURL, par, function(data) {
        console.log(data);
    })
    //var parameterMap = OAuth.getParameterMap(message.parameters);
}
function parseOauthPar (parameters) {
    var i, len;
    var retAry = [];
    for (i=0, len=parameters.length; i < len; ++i) {
        retAry.push(parameters[i].join("="));
    }
    return retAry.join("&");
}
$(function(){
    $("#jqueryRequest").click(function (){
        getRequestToken();
    })
})