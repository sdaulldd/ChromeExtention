//常驻后台，并且会注入到页面中
// 监听 ajax 请求


//直接调用注入的其他的js函数 注入的js可以有多个在mainfest中配置

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
    //获取页面的信息
    if (request === "getPageInfo") {
        console.log('收到来自popup【租户信息】的消息：', request);
        sendResponse(JSON.stringify(thisUrlResult));
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


//延迟加载的东西(延迟5s)
setTimeout(function () {
    console.log("这个是延迟函数!!!");
    TenantInfo();
    setTenantInfo();
    tip("我就是tip一下！！");
}, 5000);


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