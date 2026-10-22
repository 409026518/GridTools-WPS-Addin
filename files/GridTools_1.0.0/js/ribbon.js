//这个函数在整个wps加载项中是第一个执行的
function OnAddinLoad(ribbonUI){
    if (typeof (window.Application.ribbonUI) != "object"){
        window.Application.ribbonUI = ribbonUI
    }
    return true
}

function GetUrlPath() {
    let e = document.location.toString()
    return -1!=(e=decodeURI(e)).indexOf("/")&&(e=e.substring(0,e.lastIndexOf("/"))),e
}

function GetImage(control) {
    return GetUrlPath() + "/images/" + control.Id + ".svg"
}

//按钮点击统一入口
function OnAction(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnExprToValue":
            HandleExpr(true)
            break
        case "btnExprSum":
            HandleExpr(false)
            break
    }
}

//判断是否为纯四则运算表达式（只允许数字、括号、运算符）
function IsExpr(s) {
    if (s === null || s === undefined) return false
    var t = String(s).replace(/\s+/g, "")
    if (t === "" || t === "/") return false
    if (!/^[0-9+\-*/().×÷]+$/.test(t)) return false
    if (!/[0-9]/.test(t)) return false
    return true
}

//整理表达式：去空格、全角符号转半角
function CleanExpr(s) {
    return String(s).replace(/\s+/g, "")
        .replace(/×/g, "*").replace(/÷/g, "/")
        .replace(/＋/g, "+").replace(/－/g, "-")
        .replace(/＊/g, "*").replace(/／/g, "/")
        .replace(/（/g, "(").replace(/）/g, ")")
}

//安全求值（已由 IsExpr 限制字符白名单）
function EvalExpr(s) {
    return eval("(" + s + ")")
}

//取单元格显示文本
function CellText(cell) {
    try { return cell.Text } catch (e) { return "" }
}

//写回数值：优先 Value2，失败再试 Value
function WriteCellNum(cell, num) {
    try { cell.Value2 = num; return true } catch (e) {}
    try { cell.Value = num; return true } catch (e) {}
    return false
}

//遍历选区（支持多区域选择）
function EachCell(sel, callback) {
    var areas = null
    try { areas = sel.Areas } catch (e) {}
    if (areas && areas.Count > 1) {
        for (var i = 1; i <= areas.Count; i++) EachCell(areas.Item(i), callback)
        return
    }
    var rows = 1, cols = 1
    try { rows = sel.Rows.Count; cols = sel.Columns.Count } catch (e) {}
    for (var r = 1; r <= rows; r++) {
        for (var c = 1; c <= cols; c++) {
            var cell = null
            try { cell = sel.Cells.Item(r, c) } catch (e) { continue }
            callback(cell)
        }
    }
}

//主逻辑：bWrite=true 表达式转数值；false 仅求和
function HandleExpr(bWrite) {
    var app = window.Application
    var sel = null
    try { sel = app.Selection } catch (e) {}
    if (!sel) { alert("请先选中要处理的单元格区域"); return }

    var changed = 0, okCount = 0, failCount = 0, total = 0
    EachCell(sel, function (cell) {
        var txt = CellText(cell)
        if (!IsExpr(txt)) return
        var v = null
        try { v = EvalExpr(CleanExpr(txt)) } catch (e) { failCount++; return }
        if (typeof v !== "number" || !isFinite(v)) { failCount++; return }
        okCount++
        total += v
        if (bWrite) {
            var num = Math.round(v * 1000000) / 1000000
            if (WriteCellNum(cell, num)) changed++
            else failCount++
        }
    })

    var msg
    if (bWrite) {
        if (changed === 0 && failCount === 0) {
            msg = "选中区域里没有找到可转换的表达式。\n（仅识别类似 (3150+1000)*1800 的四则运算文本）"
        } else {
            msg = "转换完成：成功替换 " + changed + " 个单元格。"
            if (failCount > 0) msg += "\n失败 " + failCount + " 个。"
        }
    } else {
        if (okCount === 0) {
            msg = "选中区域里没有找到可计算的表达式。"
        } else {
            msg = "共识别 " + okCount + " 个表达式\n总和 = " + FormatNum(total)
        }
    }
    alert(msg)
}

//数字显示：整数直接显示，小数最多保留6位
function FormatNum(n) {
    var r = Math.round(n * 1000000) / 1000000
    return String(r)
}
