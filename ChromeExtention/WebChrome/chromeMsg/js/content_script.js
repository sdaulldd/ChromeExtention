//常驻后台，并且会注入到页面中
//alert("content-script.js 已经注入");

//直接调用注入的其他的js函数 注入的js可以有多个在mainfest中配置
//aa();

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === "getTenantInfo") {
        if (divpp === "") {
            TenantInfo();
            setTenantInfo();
        }
        console.log('收到来自popup【租户信息】的消息：', request);
        tip(JSON.stringify(request));
        sendResponse(divpp);
    }
    else {
        sendResponse(request);
        console.log('收到来自 【其他消息】的消息：', request);
    }

});
var divpp = "";


setTimeout(function () {

}, 1000);


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

                tip(JSON.stringify("content-script向background 发送消息"));
                tip('收到来自background的回复：' + response);
            }
        );
}, 500);

var tipCount = 0;
// 简单的消息通知
function tip(info) {
    info = info || '';
    var ele = document.createElement('div');
    ele.className = 'chrome-plugin-simple-tip slideInLeft';
    ele.style.top = tipCount * 70 + 20 + 'px';
    ele.innerHTML = `<div>${info}</div>`;
    document.body.appendChild(ele);
    ele.classList.add('animated');
    tipCount++;
    setTimeout(() => {
        ele.style.top = '-100px';
        setTimeout(() => {
            ele.remove();
            tipCount--;
        }, 4000);
    }, 5000);
}

//获取用户信息
function TenantInfo() {
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