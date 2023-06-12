//常驻后台，并且会注入到页面中
// 监听 ajax 请求 
//import { func } from "prop-types";


//直接调用注入的其他的js函数 注入的js可以有多个在mainfest中配置

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // debugger;
    if (request === "getTenantInfo") {
        if (divpp === "") {
            TenantInfo();
        }
        if (setSuccess == false)
            setTenantInfo();
        console.log('收到来自popup【租户信息】的消息：', request);
        tip(JSON.stringify(request));
        sendResponse(divpp);
    }
    //获取页面的信息
    else if (request === "getPageInfo") {
        console.log('收到来自popup【租户信息】的消息：', request);
        //sendResponse(JSON.stringify(thisUrlResult));
    }
    else if (request.key === "submitJenkins") {
        alert('要构建了，不要怕：' + request.value);
        // SubmitForm(request.value);
    }
    else {
        sendResponse(request);
        console.log('收到来自 【其他消息】的消息：', request);
    }

});
window.addEventListener('ajaxReadyStateChange', function (e) {
    console.log("最后一次" + e.detail);
    if (e.detail.readyState === 4 && e.detail.responseURL.indexOf("weixin") >= 0 && e.detail.status === 200) {
        // console.log("最后一次" + e.detail); // XMLHttpRequest Object
    }
});

var divpp = "";
var setSuccess = false;
//与后端background进行消息交互	 执行6秒
var startTime = new Date().getTime();
var interval = setInterval(function () {
    if (new Date().getTime() - startTime > 6000) {
        clearInterval(interval);
        return;
    }
    chrome.runtime.sendMessage
        (
            {
                doc: "yes",
                data: "123",
            },
            function (response) {

                //tip(JSON.stringify("content-script向background 发送消息"));
                //tip('收到来自background的回复：' + response);
            }
        );
}, 500);

//页面初始化需要处理的数据
window.onload = function () {
    SSOAutoLogin();
    //自动化构建
    setTimeout(function () {
        AutoRelease();
    }, 3000);
    //jenkins 自动登录
    JenkinsAutoLogin();
    TenantInfo();
    setTimeout(function () {
        setTenantInfo();
    }, 1000);
   
    //自动读取Name
    AutoShowName();
}


//public funs==========start
//1、获取用户信息 Italent网站
function TenantInfo() {
    if (window.location.href.indexOf("italent") == -1)
        return;
    //document.getElementsByClassName('company-name')[0].innerText="变化"
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.title = 'othersctip';
    script.innerHTML = "var objTemp = {loginUserInfo: BSGlobal.loginUserInfo,tenantInfo: BSGlobal.tenantInfo};document.body.setAttribute('data-fp',JSON.stringify(objTemp));";
    document.head.appendChild(script);
    //document.head.removeChild(script);
    divpp = document.body.getAttribute('data-fp');
    console.log(divpp);
}
//2、自动化构建  Jenkins
function AutoRelease() {
    if (window.location.href.indexOf("jci.beisencorp.com") == -1)
        return;
    //console.log(window.location.href);
    //分支
    var branch = getQueryString("branch", window.location.href);
    if (branch != null) {
        //两个特殊的搞一下
        if (window.location.href.indexOf("service.Beisen.PPS.TenantBase.OnBoarding") != -1 || window.location.href.indexOf("service.Beisen.PPS.Industry.QuickEntry") != -1) {
            var selects = $("input[value='GIT_BRANCH']")[0].nextSibling;
            selects.value = branch;
        }
        else {
            var selects = $("input[value='SOURCE_CONTENT']")[0].nextSibling;
            selects.value = branch;
        }

    }
    //是否自动构建
    var auto = getQueryString("auto", window.location.href);
    if (auto == null || auto != 1)
        return;

    //var form1 = document.getElementsByName("parameters")[0];
    var btn = document.getElementsByName("Submit")[0];


    //alert("执行自动构建");
    //执行自动构建
    //form1.submit();
    btn.click();
    console.log("调用成功！！");
    //changeUrlAndReload();
}
//3、SSO单点自动登录
function SSOAutoLogin() {
    if (window.location.href.indexOf("sso.beisencorp.com/login") == -1)
        return;
    fireKeyEventV2(document.getElementById('username'), "corp\\liliandong");
    fireKeyEventV2(document.getElementById('password'), "Ruojia0121$");
    var btn = document.getElementsByTagName("button")[0];
    btn.click();
}

function JenkinsAutoLogin() {
    //https://beisen2.yufuid.com/#/?basic=true
    if (window.location.href != "https://beisen2.yufuid.com/#/")
        return;
    console.log("我输出一下");
    setTimeout(function () {
        window.open('https://beisen2.yufuid.com/sso/ai-6bca869e8e8546b0bb2b714adef43f94');
    }, 1000);
}
//3、自动读取员工姓名和邮箱
function AutoShowName() {
    if (window.location.href.indexOf("http://prod-tool.beisen-inc.com/MultitenantData/GetById") == -1)
        return;
    //$(document.body).append("<div style='position: absolute;top:10px;z-index:999999;padding-left:55%;color:red'>第二次</div>");
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.title = 'othersctipUserName';
    script.innerHTML = "var strOut3 = \"\"; $('tbody tr').each(function (i) {$(this).children('td').each(function (j) {if (j == 0 && $(this).text() == \"BeisenUserID\") { strOut3=$(this).next().next().text()+','+$(this).next().next().next().text(); }});});$(document.body).append(\"<div id='appengDivs' style = 'position: absolute; top: 10px; z-index: 999999; padding-left: 55%; color: red' >\"+strOut3+\"</div>\");";
    //$(\"#appengDivs\").val(strOut3)
    document.head.appendChild(script);
}


//public tools==========start

var tipCount = 0;
// 简单的消息通知
function tip(info) {
    info = info || '';
    var ele = document.createElement('div');
    ele.className = 'common-dialog-box';
    ele.style.top = tipCount * 70 + 20 + 'px';
    ele.innerHTML = `<div>${info}</div>`;
    document.body.appendChild(ele);
    ele.classList.add('animated');
    tipCount++;

    ele.style.top = '-100px';
    setTimeout(() => {
        //ele.remove();
        tipCount--;
    }, 14000);

}
//模拟键盘输入
function fireKeyEventV2(inpEle, keyChar) {
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', true, true);
    inpEle.value = keyChar;
    inpEle.dispatchEvent(evt);
}

//暂时没用到
function getToken() {
    debugger;
    //cookie是一个字符串
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == "token") {
            return arr[1];
        }
    }
    return "";
}
//public funs==========stop
