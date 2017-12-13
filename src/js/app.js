(function($, owner) {
	/**
	 * 用户登录通过密码
	 **/
	owner.loginByPassword = function(params, callback) {
		callback = callback || $.noop;
		params   = params || {};
		params.account  = params.account || '';
		params.password = params.password || '';
		/*if (!BDF.checkPhone(params.account)) {
			return callback('请正确输入手机号码');
		}*/
//		alert(JSON.stringify(params))
		if (!BDF.checkPass(params.password)) {
			return callback('密码为6-20个字母、数字、下划线');
		}
		//远程验证
		BDF.api('/user/Account/login', {
                'type': 'GET',
                'data': {
                    "account" : params.account,
                    "passwd" : params.password
                }
			}, function (result) {
        	if(result){
        		if(result.status == 0){
        			var loginInfo = {
        				account : params.account,
        				user_id : result.data.user_id,
        				token	: result.data.token
        			}
        			return owner.createState(loginInfo, callback);
        		}else{
        			return callback("用户名或密码错误");
        		}
        	}else{
        		return callback("网络错误，请联系管理员");
        	}
        });
	};
	
	/**
	 * 用户登录通过手机验证码
	 **/
	owner.loginByVerify = function(params, callback) {
		callback = callback || $.noop;
		params   = params || {};
		params.account  = params.account || '';
		params.verify 	= params.verify || '';
		if (!BDF.checkPhone(params.account)) {
			return callback('请输入正确的手机号码');
		}
		if (!params.verify) {
			return callback('请输入正确的验证码');
		}
		//远程验证
		BDF.api('/user/Account/login', {
                'type': 'GET',
                'data': {
                    "account" : params.account,
                    "verify_code" : params.verify
                }
           }, function (result) {
        	if(result){
        		if(result.status == 0){
        			var loginInfo = {
        				account : params.account,
        				user_id : result.data.user_id,
        				token	: result.data.token
        			}
        			return owner.createState(loginInfo, callback);
        		}else{
        			return callback("用户名或验证码错误");
        		}
        	}else{
        		return callback("网络错误，请联系管理员");
        	}
        });
	};
	
	/**
	 * 重置密码
	 **/
	owner.resetPassword = function(params, callback) {
		callback = callback || $.noop;
		var params   			= params || {};
		params.account  		= params.account || '';
		params.password 		= params.password || '';
		params.confirm_password = params.confirm_password || '';
		params.verify 			= params.verify || '';
		if (!BDF.checkPhone(params.account)) {
			return callback('请输入正确的手机号码');
		}		
		if(!BDF.checkPass(params.password) || !BDF.checkPass(params.confirm_password)){
			return plus.nativeUI.toast("密码为6-20个字母、数字、下划线");
		}else{
			if(!(params.password === params.confirm_password)){
				return plus.nativeUI.toast("两次输入的密码不一致！");
			}
			//远程验证
			BDF.api('/user/Account/resetPwd', {
	                'type': 'POST',
	                'data': {
	                    "account" : params.account,
	                    "newpwd" : params.password,
	                    "renewpwd" : params.confirm_password,
	                    "verify_code" : params.verify
	                }
	           }, function (result) {
	        	if(result){
	        		if(result.status == 0){
	        			return callback(false);
	        		}else{
	        			return callback("参数错误");
	        		}
	        	}else{
	        		return callback("网络错误，请联系管理员");
	        	}
	        });			
		}
	};

	/**
	 * 用户注册
	 **/
	owner.sendMobileVeiafy = function(params, callback) {
		callback 		= callback || $.noop;
		params 	 		= params || {};
		params.mobile   = params.mobile || '';
		params.act   	= params.act || '';
		if (!BDF.checkPhone(params.mobile)) {
			return callback('请正确输入手机号码');
		}
		if (!params.act) {
			return callback('参数错误');
		}
		//远程验证
		BDF.api('/user/Account/sendMobileVerify', {
                'type': 'GET',
                'data': {
                    "mobile": params.mobile,
                    "act": params.act
                }
          }, function (result) {
        	if(result){
        		if(result.status == 0){
        			return callback(false);
        		}else{
        			return callback("验证码发送失败，请重试");
        		}
        	}else{
        		return callback("网络错误，请联系管理员");
        	}
        });
	};
	
	/**
	 * 用户注册
	 **/
	owner.register = function(params, callback) {
		callback 		= callback || $.noop;
		params 	 		= params || {};
		params.account  	= params.account || '';
		params.verify   	= params.code || '';
		params.password	= params.password,
		params.confirm_password	= params.confirm_password,
		params.introducer = params.introducer || 0;
		params.regionCode = params.zipcode || 0;
		//远程验证
		if(!BDF.checkPass(params.password) || !BDF.checkPass(params.confirm_password)){
			return plus.nativeUI.toast("密码为6-20个字母、数字、下划线");
		}else{
			if(!(params.password === params.confirm_password)){
				return plus.nativeUI.toast("两次输入的密码不一致！");
			}
			BDF.api('/user/Account/register', {
	                'type': 'GET',
	                'data': {
	                    "account" : params.account,
	                    "verify_code" : params.verify,
	                    "password" : params.password,
	                    "confirm_password" : params.confirm_password,
	                    "introducer" : params.introducer,
	                    "region_code" : params.regionCode
	                }
	           }, function (result) {
		        	if(result){
		        		if(result.status == 0){
		        			var loginInfo = {
		        				account : params.account,
		        				user_id : result.data.user_id,
		        				token	: result.data.token
		        			}
		        			return owner.createState(loginInfo, callback);
		        		}
		        		if(result.status == '0041021'){
		        			return callback("该手机号码已经注册，请直接登录");
		        		}
		        		return callback("请填写正确的验证码");
		        	}else{
		        		return callback("网络错误，请联系管理员44444");
		        	}
	        });
		}
	};	
	
	/**
	 * 用户注册
	 **/
	owner.checkMobileVerify = function(params, callback) {
		callback 		= callback || $.noop;
		params 	 		= params || {};
		params.mobile   = params.account || '';
		params.verify   = params.code || '';
		params.act  		= params.act || '';
		//远程验证
		BDF.api('/user/Account/verifyMobileCode', {
                'type': 'GET',
                'data': {
                    "mobile": params.mobile,
                    "verify_code": params.verify,
                    "act": params.act
                }
           	}, function (result) {
           	console.info(JSON.stringify(result));
	        	if(result){
	        		if(result.status == 0){
	        			return callback(false);
	        		}else{
	        			return callback("请填写正确的验证码");
	        		}
	        	}else{
	        		return callback("网络错误，请联系管理员");
	        	}
        });
	};
	
	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};
	
	/**
	 * 验证邮箱
	 **/	
	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取当前状态
	 **/
	owner.createState = function(data, callback) {
		var state 		 = {};
		var origin_state = owner.getState() || {};
		var result;
		//合并数据
		state = $.extend(true, origin_state, data);
		//写入状态
		result = owner.setState(state);
		//创建本地用户缓存
		owner.localUser();
		return callback(result);
	};
	
	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || '{}';
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		return localStorage.setItem('$state', JSON.stringify(state));
	};
	/**
	 * 清除当前状态
	 **/
	owner.clearState = function() {
		return localStorage.setItem('$state', {});
	};


	owner.localUser = function(user_id) {
		var uid = owner.getState().user_id;
		var user_id = user_id || uid;
		if(user_id > 0){
			BDF.api('/user/User/getUserInfo', {'data':{'user_id':user_id}},function (result) {
				if(result.status == 0){
					return localStorage.setItem('$localUser', JSON.stringify(result.data));
				}
			})
		}
	};
	owner.getLocalUser = function(key) {
		var userLocalInfo = JSON.parse(localStorage.getItem('$localUser')) || {};
		if(key){
			return userLocalInfo[key];
		}
		return userLocalInfo;
	};
	
	owner.getRealUserInfo = function(key, callback) {
		//获取用户的实时数据
		if(owner.getLocalUser('user_id')){
			BDF.api('/user/User/getUserInfo', {}, function (result) {
					if(result.status == 0){
						return callback(result.data[key]);
					}
				}
			)
		}
	};
	
	
	owner.getRealUserInfoByKeys = function(keys, callback) {
		//获取用户的实时数据
		if(owner.getLocalUser('user_id')){
			BDF.api('/user/User/getUserInfo', {}, function (result) {
					if(result && result.status == 0){
						var one = {};
						$.each(keys, function(k, value){
							one[value] = result.data[value];
						})
						return callback(one);
					}
				}
			)
		}
	};
	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	};

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	};
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));