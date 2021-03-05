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
    var thistenandid = BSGlobalCopy.tenantInfo.tenantId + '--' + BSGlobalCopy.loginUserInfo.id;
    //var thistenantName = BSGlobalCopy.tenantInfo.abbreviation;

    var pApend = ctorElement(thistenandid);
    ctorElementInput(thistenandid);

    var showData = document.getElementsByClassName('company-name')[0];
    insertAfter(pApend, showData);
    //document.body.setAttribute('data-fp', JSON.stringify(BSGlobalCopy.tenantInfo, ['tenantId', 'name', 'abbreviation', 'source']));
}
//构建文本展示
function ctorElement(html) {
    var pApend = document.createElement("p");
    pApend.className = "company-name";
    pApend.style = "color: red";
    pApend.id = "appendId";
    pApend.onclick = function () {
        var e = document.getElementById("appendInputId");
        e.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        alert("复制链接成功！");
    };
    pApend.innerHTML = html;
    return pApend;
}
//构建赋值用的赋值input
function ctorElementInput(html) {
    var pApend = document.createElement("input");
    pApend.id = "appendInputId";
    pApend.innerHTML = html;
    return pApend;
}

function copyLink() {
    var e = document.getElementById("appendId");
    e.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("复制链接成功！");
}
$('#appendId').click(() => {
    copyLink();
});