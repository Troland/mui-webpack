;(function(mui, root) {
	var _NAMESPACE = "BDF",
		_dout_ = null,
		_dcontent_ = null,
		_config = {
			isCCTV: false,
			DEBUG: true,
			apiUrl: 'http://47.52.228.84:8081',
			publicApiUrl: 'http://47.52.228.84:8082'
		},
		_token = '';
	var mustLoginPage = [
		//充值
		"beecloud-html",
		//账户
		"act-detail-html",
		"act-recharge-detail-html",
		"act-sum-html",
		"act-sum-sub-html",
		"act-user-info-html",
		"act-withdraw-detail-html",
		"act-favourite-html",
		//银行卡
		"bank-add-html",
		"bank-add-submit-html",
		"bankcard-html",
		"bank-sub-html",
		//实名认证
		"certification-html",
		//订单中心
		"ord-info-sub-html",
		"ord-info-html",
		"ord-list-info-html",
		"ord-list-html",
		//安全中心
		"sec-index-html",
		"sec-modifpassword-html",
		"sec-nickname-html",
		//系统设置
		"setting-html",
		"aboutus-html",
		"feedback-html",
		//版本检测
		"ver-check-html",
		//提现
		"conversion-html",
		"selectbank-sub-html",
		"selectbank-html",
		"withdraw-html",
		"withdraq-sub-html"
	];

	function $() {
		var elements = new Array();
		for(var i = 0; i < arguments.length; i++) {
			var element = arguments[i];
			if(typeof element == 'string') {
				element = document.getElementById(element);
			}
			if(arguments.length == 1) {
				return element;
			}
			elements.push(element);
		}
		return elements;
	}
	//判断元素是否在数组中,同上另一种写法
	function contains(arr, obj) {
		var i = arr.length;
		while(i--) {
			if(arr[i] === obj) {
				return true;
			}
		}
		return false;
	}
	// 格式化日期时间字符串，格式为"YYYY-MM-DD HH:MM:SS"
	function dateToStr(d) {
		return(d.getFullYear() + "-" + ultZeroize(d.getMonth() + 1) + "-" + ultZeroize(d.getDate()) + " " + ultZeroize(d.getHours()) + ":" + ultZeroize(d.getMinutes()) + ":" + ultZeroize(d.getSeconds()));
	};

	function ultZeroize(v, l) {
		var z = "";
		l = l || 2;
		v = String(v);
		for(var i = 0; i < l - v.length; i++) {
			z += "0";
		}
		return z + v;
	};

	function gInit() {
		_dout_ = document.getElementById("output");
		_dcontent_ = document.getElementById("dcontent");
	};

	// 输出内容
	function outSet(s) {
		gInit();
		_dout_.innerText = s + "\n";
		(0 == _dout_.scrollTop) && (_dout_.scrollTop = 1); //在iOS8存在不滚动的现象
	};

	// 输出行内容
	function outLine(s) {
		_dout_.innerText += s + "\n";
		(0 == _dout_.scrollTop) && (_dout_.scrollTop = 1); //在iOS8存在不滚动的现象
	};

	function getClass(element) {
		if(!(element = $(element))) return false;
		return element.className.replace(/\s+/, ' ').split(' ');
	}

	function hasClass(element, className) {
		if(!(element = $(element))) return false;
		var classes = getClass(element);
		for(var i = 0; i < classes.length; i++) {
			if(classes[i] === className) {
				return true;
			}
		}
		return false;
	}

	function addClass(element, className) {
		if(!(element = $(element))) return false;
		if(hasClass(element, className)) return true;
		element.className += (element.className ? ' ' : '') + className;
		return true;
	}

	function removeClass(element, className) {
		if(!(element = $(element))) return false;
		var classes = getClass(element);
		var length = classes.length;
		for(var i = length - 1; i >= 0; i--) {
			if(classes[i] === className) {
				delete(classes[i]);
			}
		}
		element.className = classes.join(' ');
		return(length == classes.length ? false : true);
	}

	function toggleClass(element, className) {
		if(!(element = $(element))) return false;
		if(hasClass(element, className)) {
			removeClass(element, className);
		} else {
			addClass(element, className);
		}
	}

	function toggle(element, value) {
		if(!(element = $(element))) return false;
		if(element.style.display != 'none') {
			element.style.display = 'none';
		} else {
			element.style.display = value || '';
		}
		return true;
	}

	function getQueryArgs() {
		var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
			items = qs.length ? qs.split("&") : [],
			len = items.length;
		args = {};
		for(i = 0; i < len; i++) {
			var item = items[i].split("="),
				name = decodeURIComponent(item[0]),
				value = decodeURIComponent(item[1]);
			if(name.length) args[name] = value;
		}
		return args;
	}

	function addQueryArg(url, key, value) {
		if(url.indexOf("?") == -1) url += "?";
		else url += "&";
		url += encodeURIComponent(key) + "=" + encodeURIComponent(value);
		return url;
	}

	//5分制转化，大于0.5分按1分算
	function scoreConvert(score) {
		return Math.round(((score * 1) / 10).toFixed(1));
	}

	//手机号验证
	function checkPhone(phone) {
		return(/^1[3|4|5|7|8]\d{9}$/).test(phone);
	}

	//密码验证
	function checkPassword(password) {
		return(/^(\w){6,20}$/).test(password);
	}

	//电话号码验证
	function checkTel(tel) {
		return(/^(\(\d{3,4}\)|\d{3,4}-{0,1}|\s)?\d{7,8}$/).test(tel);
		// return (/^(\d{3,4}-?|\s)?\d{7,8}$/).test(tel);
	}

	//获取本地推送标识信息
	function getPushInfo() {
		var info = plus.push.getClientInfo();
		outSet("获取客户端推送标识信息：");
		outLine("token: " + info.token);
		outLine("clientid: " + info.clientid);
		outLine("appid: " + info.appid);
		outLine("appkey: " + info.appkey);
	}

	//读取所有推送消息
	function listAllPush() {
		var msgs = null;
		switch(plus.os.name) {
			case "Android":
				msgs = plus.push.getAllMessage();
				break;
			default:
				break;
		}
		if(!msgs) {
			outSet("此平台不支持枚举推送消息列表！");
			return;
		}
		outSet("枚举消息列表（" + msgs.length + "）：");
		for(var i in msgs) {
			var msg = msgs[i];
			outLine(i + ": " + msg.title + " - " + msg.content);
		}
	}

	//清空所有推动消息
	function clearAllPush() {
		plus.push.clear();
		outSet("清空所有推送消息成功！");
	}

	//请求‘简单通知’推送消息
	function requireNotiMsg() {
		var url = pushServer + 'type=noti&appid=' + encodeURIComponent(plus.runtime.appid);
		url += ('&cid=' + encodeURIComponent(plus.push.getClientInfo().clientid));
		if(plus.os.name == 'iOS') {
			url += ('&token=' + encodeURIComponent(plus.push.getClientInfo().token));
		}
		url += ('&title=' + encodeURIComponent('Hello H5+'));
		url += ('&content=' + encodeURIComponent('欢迎回来体验HTML5 plus应用！'));
		url += ('&version=' + encodeURIComponent(plus.runtime.version));
		plus.runtime.openURL(url);
	}

	//请求‘透传数据’推送消息
	function requireTranMsg() {
		var url = pushServer + 'type=tran&appid=ZvMP6CN1xl7pzqTEWVBkn4';
		url += ('&cid=' + encodeURIComponent(plus.push.getClientInfo().clientid));
		if(plus.os.name == 'iOS') {
			url += ('&token=' + encodeURIComponent(plus.push.getClientInfo().token));
		}
		// url += ('&title='+encodeURIComponent('Hello H5+'));
		// url += ('&content='+encodeURIComponent('带透传数据推送通知，可通过plus.push API获取数据并进行业务逻辑处理！'));
		// url += ('&payload='+encodeURIComponent('{title:"Hello H5+ Test",content:"test content",payload:{id:"1234567890"}}'));
		// url += ('&version='+encodeURIComponent(plus.runtime.version));
		// alert("url="+url);
		plus.runtime.openURL(url);
	}

	//本地创建一条推送消息
	function createLocalPushMsg() {
		var options = {
			cover: false
		};
		var str = BDF.dateToStr(new Date());
		str += ": 欢迎使用Html5 Plus创建本地消息！";
		plus.push.createMessage(str, "LocalMSG", options);
		outSet("创建本地消息成功！");
		outLine("请到系统消息中心查看！");
		if(plus.os.name == "iOS") {
			outLine('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
		}
	}

	if(!root[_NAMESPACE]) root[_NAMESPACE] = {};
	root[_NAMESPACE].AppConfig = _config;
	root[_NAMESPACE]['api'] = api;
	root[_NAMESPACE]['$'] = $;
	root[_NAMESPACE].contains = contains;
	root[_NAMESPACE].getClass = getClass;
	root[_NAMESPACE].hasClass = hasClass;
	root[_NAMESPACE].addClass = addClass;
	root[_NAMESPACE].removeClass = removeClass;
	root[_NAMESPACE].toggleClass = toggleClass;
	root[_NAMESPACE].toggle = toggle;
	root[_NAMESPACE].addQueryArg = addQueryArg;
	root[_NAMESPACE].getQueryArgs = getQueryArgs;
	root[_NAMESPACE].scoreConvert = scoreConvert;
	root[_NAMESPACE].checkPhone = checkPhone;
	root[_NAMESPACE].checkPass = checkPassword;
	root[_NAMESPACE].checkTel = checkTel;
	root[_NAMESPACE].requireTranMsg = requireTranMsg;
	root[_NAMESPACE].createLocalPushMsg = createLocalPushMsg;
	root[_NAMESPACE].requireNotiMsg = requireNotiMsg;
	root[_NAMESPACE].getPushInfo = getPushInfo;
	root[_NAMESPACE].listAllPush = listAllPush;
	root[_NAMESPACE].clearAllPush = clearAllPush;
	root[_NAMESPACE].dateToStr = dateToStr;
	root[_NAMESPACE].ultZeroize = ultZeroize;
	root[_NAMESPACE].gInit = gInit;
	root[_NAMESPACE].outSet = outSet;
	root[_NAMESPACE].outLine = outLine;

	var error_tpl;

	function toggleErrorTpl(flag) {
		if(error_tpl) {
			if(flag) {
				BDF.addClass(error_tpl, 'show');
				BDF.addClass(mui('.mui-content')[0], 'hide');
				mui('.btn-refresh')[0].addEventListener('tap', function() {
					plus.webview.currentWebview().reload();
				}, false);
			} else {
				BDF.addClass(error_tpl, 'hide');
				BDF.addClass(mui('.mui-content')[0], 'show');
			}
		}
	}

	//AJAX请求
	function api(url, options, callback) {
		var _options = {
			public: false, //是否公共平台接口，默认false-否，若非公共平台可以忽略不传递
			type: "GET",
			data: {},
			dataType: "json",
			timeout: 5000
		};

		if(typeof options == "function") {
			callback = options;
		} else {
			_options = mui.extend(_options, options);
		}

		url = _options.public ? _config.publicApiUrl + url : _config.apiUrl + url;
		delete _options.public;
		var userinfo = getCurrentUser();
		_token = userinfo && userinfo["token"];
		url = addQueryArg(url, "_tid", userinfo && userinfo["token"]);
		// 开发环境输出调试信息
		if(_config.DEBUG) {
			console.log("*****************************************");
			console.log('url: ' + url + ' --- method: ' + _options.type + ' --- dataType: ' + _options.dataType + ' --- data: ' + JSON.stringify(_options.data));
			console.log("userinfo: " + JSON.stringify(userinfo));
			console.log("option :" + JSON.stringify(_options));
			console.log("*****************************************");
		}
		mui.ajax(url, {
			data: _options.data,
			dataType: _options.dataType,
			type: _options.type,
			timeout: _options.timeout,
			success: function(result) {
				toggleErrorTpl(true);
				if(_config.DEBUG) console.log("result: " + JSON.stringify(result));
				if(result.status == '0041014') {
					localStorage.setItem('$state', JSON.stringify({}));
					var webViewId = plus.webview.currentWebview().id;
					if(contains(mustLoginPage, webViewId)) {
						openWebview('login-html', '/main/login/login.html');
						return false;
					}
				}
				callback(result);
			},
			error: function(xhr, type, errorThrown) {
				//异常处理
				toggleErrorTpl(true);
				callback(false);
				// 开发环境输出调试信息
				if(_config.DEBUG) {
					console.log("*****************************************");
					console.log("EOOR_xhr:" + JSON.stringify(xhr));
					console.log("EOOR_type:" + JSON.stringify(type));
					console.log("EOOR_thrown:" + JSON.stringify(errorThrown));
					console.log("*****************************************");
				}
			}
		});
	}

	//获取用户信息的本地存储
	function getCurrentUser() {
		var userinfo = localStorage.getItem("$state");
		return userinfo && JSON.parse(userinfo);
	}

	//show加载提示框
	function showLoading() {
		if(root.plus) {
			plus.nativeUI.showWaiting();
		} else {
			document.addEventListener("plusready", function() {
				plus.nativeUI.showWaiting();
			}, false);
		}
	}

	//hide加载提示框
	function closeLoading() {
		if(root.plus) {
			plus.nativeUI.closeWaiting();
		} else {
			document.addEventListener("plusready", function() {
				plus.nativeUI.closeWaiting();
			}, false);
		}
	}

	//创建并打开Webview窗口
	function openWebview(id, href, opts) {
		if(checkPageLogin(id)) {
			var _options = {
				id: id,
				url: href,
				styles: {
					popGesture: "close",
					statusbar: {
						background: "#E44346"
					}
				},
				show: {
					aniShow: "pop-in",
					duration: 200
				}
			};
			_options = mui.extend(_options, opts);
			mui.openWindow(_options);
		} else {
			var btnArray = ['确认', '取消'];
			mui.confirm('现在是否需要注册或者登录？', '登录提示', btnArray, function(e) {
				if(e.index == 0) {
					//删除用户银行卡信息
					plus.webview.open('/main/login/login.html', 'login-html', {}, {
						aniShow: "zoom-out"
					});
				}
			});
		}
	}

	//验证当前页是否需要登录
	function checkPageLogin(webViewId) {
		var result = true;
		if(contains(mustLoginPage, webViewId)) {
			var stateText = localStorage.getItem("$state") || '{}';
			var userLoginStatus = JSON.parse(stateText);
			if(!userLoginStatus.account) {
				result = false;
			}
		}
		return result;
	}

	root.showLoading = showLoading;
	root.closeLoading = closeLoading;
	root.getCurrentUser = getCurrentUser;
	root.openWebview = openWebview;
	root.checkPageLogin = checkPageLogin;
	root._globalConfig = _config;

	root.toastAlert = function(title, msg, opt) {
		title = title || '恭喜您!';
		msg = msg || '成功!';
		var html = '<div>' +
			'<div class="mui-popup mui-popup-in">' +
			'<div class="mui-popup-inner">' +
			'<div class="mui-popup-text">' +
			'<p class="title">' + title + '</p>' +
			'<p class="msg">' + msg + '</p>' +
			'<input type="checkbox" checked="checked" disabled/>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="mui-popup-backdrop mui-active"></div>' +
			'</div>';
		var popupWrapper = document.createElement('div');
		popupWrapper.setAttribute('id', 'toast-popup');
		document.body.appendChild(popupWrapper);
		popupWrapper.innerHTML = html;
		var _timeoutId = setTimeout(function() {
			document.body.removeChild(document.getElementById('toast-popup'));
			clearTimeout(_timeoutId);
			_timeoutId = null;
		}, 2000);
	};
})(mui, window);