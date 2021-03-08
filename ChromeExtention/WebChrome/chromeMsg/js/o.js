//c插入到页面的脚本
; (function () {
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, { detail: this });
        window.dispatchEvent(ajaxEvent);
    }

    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
        var realXHR = new oldXHR();
        realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
        realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
        realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
        realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
        realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
        realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
        realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
        realXHR.addEventListener('readystatechange', function () { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
        return realXHR;
    }

    window.XMLHttpRequest = newXHR;
})();

function aa() {
    alert("o.js的函数");
}

//插入某个元素的后面
function insertAfter(newElement, targentElement) {
    var parent = targentElement.parentNode;
    if (parent.lastChild === targentElement) {
        parent.appendChild(newElement);
    }
    else {
        parent.insertBefore(newElement, targentElement.nextSibling)
    }
};

function setTenantInfo() {
    var BSGlobalCopy = JSON.parse(divpp);


    var pApendTenantId = ctorElement("appendtenantId", BSGlobalCopy.tenantInfo.tenantId, "租户ID");
    var pApendTuserid = ctorElement("appenduserId", BSGlobalCopy.loginUserInfo.id, "用户ID");

    var showData = document.getElementsByClassName('company-name')[0];

    insertAfter(pApendTenantId, showData);
    insertAfter(pApendTuserid, pApendTenantId);
    //document.body.setAttribute('data-fp', JSON.stringify(BSGlobalCopy.tenantInfo, ['tenantId', 'name', 'abbreviation', 'source']));
}
//构建文本展示
function ctorElement(id, html, fieldName) {
    var pApend = document.createElement("p");
    pApend.className = "company-name";
    pApend.style = "color: red";
    pApend.id = id;
    pApend.onclick = function (pApend) {
        copyLink(pApend, fieldName);
    };
    pApend.innerHTML = html;
    return pApend;
}

function copyLink(element, fieldName) {
    var Url2 = element.target.innerHTML;
    var oInput = document.createElement('input');
    oInput.value = Url2;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    alert(fieldName + "已复制到剪切板！");
}