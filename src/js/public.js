/****************************************************************************/
var bottomWebview = 'H506BEA0F',
	lineUrl = '';

/*获取验证码时，倒计时*/
var w = 59;
function time(code) {
    closeLoading();
    if (w === 0) {
        code.removeAttribute("disabled");
        code.innerHTML = "获取验证码";
        w = 59;
    } else {
        code.setAttribute("disabled", true);
        code.innerHTML = w + "秒后重新获取";
        w--;
        setTimeout(function() {
            time(code);
        }, 1000)
    }
}

function disableWait(t, obj, waitMessage) {
    var objTag = obj.tagName.toLowerCase();
    if (objTag !== "input" && objTag != "button") {
        return;
    }
    var v = objTag !== "input" ? obj.innerText : obj.value;
    var i = setInterval(function() {
        if (t > 0) {
            switch (objTag) {
                case "input":
                    obj.value = (--t) + waitMessage;
                    break;
                case "button":
                    obj.innerText = (--t) + waitMessage;
                    break;
                default:
                    break;
            }
            obj.disabled = true;
        } else {
            window.clearInterval(i);
            switch (objTag) {
                case "input":
                    obj.value = v;
                    break;
                case "button":
                    obj.innerText = v;
                    break;
                default:
                    break;
            }
            obj.disabled = false;
        }
    }, 1000);
}

var isEmptyObject = function( obj ) {
    var name;
    for ( name in obj ) {
        return false;
    }
    return true;
}

	//给Array增加一个函数,判断数组是否数组中
		/**
		Array.prototype.contains = function (obj) {
		    var i = this.length;
		    while (i--) {
		        if (this[i] === obj) {
		            return true;
		        }
		    }
		    return false;
		}
		**/
/***************************************************************************/
/*公用变量*/
var act='',url='',para='{}',pwd = false,
    num = /^[0-9]+.?[0-9]*$/,
    mobile_reg = /^1[34578]\d{9}$/,
    email_reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    codeNum = /^[0-9]\d{5}$/,
    pwdreg = /^[0-9A-Za-z]{6,20}$/;

/***************************************************************************/

//获取页面元素的相关属性
function getStyle(obj,attr){
    return obj.currentStyle?obj.currentStyle[attr]/*兼容IE浏览器*/:getComputedStyle(obj)[attr]/*兼容大众浏览器*/;  //该行代码中，之所以使用方括号，是为了改变获取的属性类型（如width，height等等），若使用点运算符，则不能改变属性类型
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}