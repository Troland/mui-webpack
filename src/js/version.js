
var version = {
	nowVer : '',
	newVer : '',
	updateUrl : '',
	checkUrl : ''   //调用版本更新JS文件时，在相关页面定义version.checkUrl的值即可使用
},
phone_type = '';

//获取应用的当前版本
function getAppVersion(curVer,recVer){
	// 获取本地应用资源版本号
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
		version.nowVer = inf.version;
		// alert(version.nowVer);
		curVer.innerHTML = version.nowVer;
		// 获取最新版本
		getNewVersion(recVer);
	});
	
}

//获取应用的最新版本
function getNewVersion(recVer){
	if (mui.os.android){
       phone_type = "android";
	} else {
       phone_type = "ios";
	}
	// alert(phone_type);
	plus.nativeUI.showWaiting("正在检查版本");
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		switch(xhr.readyState){
			case 4:
				plus.nativeUI.closeWaiting();
				if(xhr.status==200){
					var obj = eval('(' + xhr.responseText + ')');
					 if('0' == obj.status){
						if(version.nowVer&&obj.data.version&&(version.nowVer!=obj.data.version)){
							version.newVer=obj.data.version;
							version.updateUrl=obj.data.url;
							recVer.innerHTML = "<span class='mui-badge mui-badge-danger'>new</span>"+version.newVer;
						}else{
							recVer.innerHTML = "目前已是最新版本";
						}
					 }
				}
				break;
			default:
				break;
		}
	}
	console.log(version.checkUrl+'&type='+phone_type+'&v='+version.nowVer);
	xhr.open('GET',version.checkUrl+'&type='+phone_type+'&v='+version.nowVer,true);
	xhr.send();	
}
//下载并安装更新包
function updateApp(){
	if(version.newVer != '' && version.updateUrl != ''){
		if(mui.os.android){ //若为android应用，则直接下载安装包
		   downWgt(version.updateUrl);
		}
		else {  //若为ios应用，则跳转到appstore进行应用下载
		    var url='itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8';// HelloH5应用在appstore的地址
			plus.runtime.openURL(url);
		}
	}
}
// 下载wgt文件
function downWgt(wgtUrl){
	var showupdate = plus.nativeUI.showWaiting("升级文件下载中...", {'width':'130px'});
	var dl = plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d, status){
		if ( status == 200 ) {
			console.log(d.filename);
			installWgt(d.filename);	// 安装wgt包
		} else {
			plus.nativeUI.alert("下载升级文件失败！");
		}
		plus.nativeUI.closeWaiting();
	});
	dl.addEventListener("statechanged", function(e){
		var a = dl.downloadedSize / dl.totalSize * 100;
		if (dl.state >= 0 && parseInt(a) >= 0) {
			showupdate.setTitle("已下载" + parseInt(a) + "% ");
		}
	});
	dl.start();
}

//删除下载目录下所有文件
function removeUpdateDir(){
	plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
		var obj = fs.root.getDirectory('update', {}, function(entry){
			entry.removeRecursively(function(){
				plus.nativeUI.alert("下载目录删除成功！");
			});
		}, function(){
			plus.nativeUI.alert("下载目录不存在！");
		});
	})	
}
// 更新应用资源
function installWgt(path){
	plus.nativeUI.showWaiting("升级中...");
	plus.runtime.install(path,{},function(){
		plus.nativeUI.closeWaiting();
		plus.nativeUI.alert("应用资源更新完成！",function(){
			plus.runtime.restart();
		});
	},function(e){
		plus.nativeUI.closeWaiting();
		plus.nativeUI.alert("安装文件失败");
	});
}