//import { json } from "body-parser";

function bgtest() {
    alert("background的bgtest函数！");
    getCurrentTabId(function (tab) { activeTabId = tab.id });
    alert(activeTabId + "---" + JSON.stringify(LastRequests));
    return JSON.stringify(LastRequests[activeTabId]);
}

var activeTabId;

function bgFormSubmit() {
    sendMessageToContentScript("getPageInfo", (response) => {
         
    });
}
function bb() {
    alert(divpp);
    alert(BSGlobal);
}
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //console.log('收到来自content-script的消息：');
    //console.log(JSON.stringify(request), sender, JSON.stringify(sendResponse));
    //sendResponse('我是background，我已收到你的消息：' + JSON.stringify(request));
});
//监听所有请求
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        chrome.tabs.query({ active: true }, function (tab) {
            // 当前页面的url
            var pageUrl = tab[0].url;
            // 在这可以写判断逻辑，将请求cancel掉，或者将请求打印出来

        });
    },
    {
        urls: ["*://*/*"]//"*://www.italent.com/*", "http://www.italent.link/*", "https://www.italent.link/*",
    },  //监听页面请求,你也可以通过*来匹配。
    ["blocking"]
);

// 监听页面的ajax
chrome.webRequest.onCompleted.addListener(details => {
    // sendMsgToContentScript(details, function (v) { });
    if (details.url.indexOf("api/v2/UI") >= 0) {

        var tabId = details.tabId;
        var thisUrlResult = transferUrl(details.url, tabId);
        console.log("我是正派的输出：" + JSON.stringify(thisUrlResult));
    }
}, {
    urls: [

        "*://*/*",
    ]
});

function transferUrl(url, tableId) {
    var dataExist = null;
    if (LastRequests.length > 0 && LastRequests[tableId] !== undefined) {
        dataExist = transferUrlData(url, LastRequests[tableId]);
    }
    else {
        dataExist = transferUrlData(url, null);
    }
    LastRequests[tableId] = dataExist;

    return dataExist;
}
function transferUrlData(url, dataInner) {
    if (dataInner === null) {
        dataInner = {};
    }

    if (url.indexOf("UI/IndexPage") >= 0)
        dataInner.IndexPage = url;
    if (url.indexOf("UI/TableList") >= 0)
        dataInner.TableList = url;
    if (url.indexOf("UI/FormView") >= 0)
        dataInner.FormView = url;
    if (url.indexOf("UI/DetailPage") >= 0)
        dataInner.DetailPage = url;
    return dataInner;
}

var LastRequests = new Array();
//{
//    "tabId": "",
//    "UrlList": {
//        "Indexpage": "",
//        "DetailPage": "",
//        "FormView": "",
//        "TableList": "",
//    }
//};
// backgrond向context_scripts发送消息
function TT(msg) {

    sendMessageToContentScript(msg, (response) => {
        //if (response)
        alert('backgrond收到来自content-script的回复：' + response);
    });
    sendMessage(BSGlobal);
}
var html = document.body.innerHTML;

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}
// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}
