// popup调用background的js函数
$('#bg').click(() => {
    //alert("调用background的js函数");
    //var bg = chrome.extension.getBackgroundPage();
    //bg.bgtest();
    // aa();


});

//Jenkins构建
//$('#testContentFun222').click(() => {

//    //var allEsb = "ec98305d-f21b-4d7f-a0df-8c30c8c019d0,3cb54080-ac2e-46cd-8595-89bb8ab7d389,e54959a5-eb42-4f63-b6c3-67d5b46fd735,c0bc89ec-ee2b-439e-b340-698fdcca6b49,d65c4a58-0d6f-4a51-81b8-7f1f30283cd5,450a02c2-c494-4289-a264-a831ac0249d8,cbf74334-dddd-4313-b0b5-2856103eb3a5,4a8c5182-eeb7-4a3e-901c-b9731b07000d".split(',');
//    //for (let i = 0; i < allEsb.length; i++) {
//    //    setTimeout(() => {
//    //        window.open("http://prod-tool.beisen-inc.com/MultitenantData/GetById?id=" + allEsb[i] + "&applicationName=TenantBase&metaObjectName=EmployeeInformation&tenantId=602996", "_blank")
//    //    }, 1000);

//    //}
//});

//Jenkins构建
$('#testContentFun').click(() => {

    var selectESB = $(".demo").val();
    if (selectESB != null) {
        var allEsbStr = selectESB.toString().split(',');
        // window.open("https://sso.beisencorp.com/login");

        for (let i = 0; i < allEsbStr.length; i++) {
            setTimeout(() => {
                window.open("http://jci.beisencorp.com/view/CoreHr/job/" + allEsbStr[i] + "/build?delay=0sec&auto=" + $("#ctorType").val() + "&branch=" + $("#branchSelect").val(), "_blank")
            }, 3000);

        }
    }
    else {
        alert("请选择构建的服务！")
    }
    // alert(selectESB);
    //sendMessageToContentScript(requestData, (response) => {
    //    alert("Pup调用content成功了");
    //});


});

$('#ssoLogin').click(() => {
    window.open("https://sso.beisencorp.com/login");
});

//获取cookie的方法
$('#ssoLoginTest').click(() => {
    chrome.cookies.get({
        url: "https://beisen2.yufuid.com/#/?basic=true",
        name: "access_token"
    }, function (cookies) {
        if (cookies && cookies.value) {
            //自动延长cookie时间
            SelfHttpGet("https://jci.beisencorp.com//securityRealm/singleLogin?id_token=" + cookies.value);
            window.open("http://jci.beisencorp.com/");
        }
    });
});


//初始化处理下拉列表
$(function () {
    $('.demo').fSelect();
    zUI.tab.loadTab({
        elem: '.zUI-bar',
        clicks: [
            function (index, nav, wrap) {
                console.log(nav);
            },
            function (index, nav, wrap) {
                console.log(nav);
            },
            function (index, nav, wrap) {
                console.log(nav);
            }
        ]
    });
});

var bg = chrome.extension.getBackgroundPage();
//alert(bg.bgtest());
sendMessageToContentScript('getTenantInfo', (response) => {
    if (response) {
        var headInfo = JSON.parse(response);
        $("#strShow").val(headInfo.TenantId);
    }
});
sendMessageToContentScript('getPageInfo', (response) => {
    if (response) {
        var PageInfo = JSON.parse(response);
        $("#detailShow").val(PageInfo.DetailPage);
        $("#indexShow").val(PageInfo.IndexPage);
        $("#tableShow").val(PageInfo.TableList);
        $("#formShow").val(PageInfo.FormView);
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
function getToken(domain, key) {
    chrome.cookies.getAll({
        domain: domain  // "beisen2.yufuid.com"
    }, (cookies) => {
        alert(cookies.map(c => c.name + "=" + c.value).join(';'));
    });
}
function SelfHttpGet(aUrl) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
            alert("成功");
    }

    anHttpRequest.open("GET", aUrl, true);
    anHttpRequest.send();
}