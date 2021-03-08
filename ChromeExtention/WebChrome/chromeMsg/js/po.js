
// popup调用background的js函数
$('#bg').click(() => {
    //alert("调用background的js函数");
    //var bg = chrome.extension.getBackgroundPage();
    //bg.bgtest();
    // aa();


});
sendMessageToContentScript('getTenantInfo', (response) => {
    if (response) {
        var headInfo = JSON.parse(response);
        $("#strShow").val(headInfo.TenantId);
    }
});
//test
$('#test').click(() => {
    //alert("调用background的js函数");
    var bg = chrome.extension.getBackgroundPage();
    alert(bg);
});
// popup主动发消息给content-script
$('#con').click(() => {
    sendMessageToContentScript('getTenantInfo', (response) => {
        if (response) {
            var headInfo = JSON.parse(response);
            $("#strShow").val(response);
        }
    });
});

// popup调用background的js函数
$('#bgtocon').click(() => {
    var bg = chrome.extension.getBackgroundPage();
    bg.TT("popup调用background的js函数");
});
//切换菜单事件
chrome.tabs.getSelected(null, function (tab) {
    console.log("我切换选项卡：" + tab.url);

    //chrome.tabs.sendMessage(tab.id, { greeting: "hello" }, function (response) {
    //    console.log(response);　　// 向content-script.js发送请求信息
    //});
});

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