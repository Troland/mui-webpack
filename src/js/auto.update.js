(function($, doc) {
    //正式上线时请更改当前版本
    var nowVer   = null;
    var typeOS 	 = mui.os.android ? "android" : "ios";
    var checkUrl = "http://13.114.9.26:8082/Version/index/getVersionInfo?product=Ispace";

    function checkUpdate(callback) {
        // 获取本地应用资源版本号
        plus.runtime.getProperty(plus.runtime.appid, function(inf) {
            nowVer = inf.version;
            if(nowVer){
            		updateVersion();
            }
        });
    }
    //检查更新版本
    var updateVersion = function(callback){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            switch (xhr.readyState) {
                case 4:
                    //plus.nativeUI.closeWaiting();
                    if (xhr.status == 200) {
                        //console.log("检测更新成功：" +  xhr.responseText);
                        var result  = eval('(' + xhr.responseText + ')');
                        var newVer  = result.data.version;
                        var downUrl = result.data.url;
                        if (compareVersion(nowVer, newVer)) {
                           	if (!callback){
                            	downWgt(true, downUrl); 
                           	}else{
                            	callback(true);
                            }
                        } else {
                            //plus.nativeUI.alert("无新版本可更新！");
                            if (callback) callback(false);
                        }
                    } else {
                        plus.nativeUI.alert("检测更新失败！");
                    }
                    break;
                default:
                    break;
            }
        };
        console.log(checkUrl+'&type='+typeOS+'&v='+nowVer);
        xhr.open('GET', checkUrl+'&type='+typeOS+'&v='+nowVer);
        xhr.send();       	
    }
    function downWgt(key, url) {
        var w;
        var options = {'width':'70%'};
        if (key) {
            w = plus.nativeUI.showWaiting("更新检测中...", options);
        };
        var options = {
            filename: "_doc/update/"
        };
        var dtask = plus.downloader.createDownload(url, options, function(d, status) {
            if (status == 200) {
                setTimeout(installWgt(d.filename, key), 2000);
            } else {
                if (key) {
                    plus.nativeUI.alert("下载更新资源失败！");
                }
            }
        });
        if (key) {
            dtask.addEventListener("statechanged", function(task, status) {
                switch (task.state) {
                    case 1: // 开始
                        w.setTitle("更新检测中...");
                        break;
                    case 2: // 已连接到服务器
                        w.setTitle("更新检测中...");
                        break;
                    case 3:
                        var a = task.downloadedSize / task.totalSize * 100;
                        //console.log(a)
                        w.setTitle("发现新版本，开始下载" + parseInt(a) + "%");
                        break;
                    case 4: // 下载完成
                        w.close();
                        break;
                }
            });
        }
        dtask.start();
    }

	// 更新应用资源
    function installWgt(path, key) {
        if (key) {
            plus.nativeUI.showWaiting("在线升级，安装资源文件...");
        }
        plus.runtime.install(path, {}, function() {
            if (key) {
                plus.nativeUI.closeWaiting();
                //自动在线升级不重启
                plus.nativeUI.alert("软件更新已完成，确认后开始体验", function() {
                	removeUpdateDir();
                	plus.runtime.restart();
            	});
            }
            //console.log("安装wgt文件成功！");
        }, function(e) {
            //console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
            if (key) {
                plus.nativeUI.closeWaiting();
				removeUpdateDir();
                plus.nativeUI.alert("软件升级失败……");
            }
        });
    }
    /**
     * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
     */
    function compareVersion(ov, nv) {
        if (!ov || !nv || ov == "" || nv == "") {
            return false;
        }
        var b = false,
            ova = ov.split(".", 4),
            nva = nv.split(".", 4);
        for (var i = 0; i < ova.length && i < nva.length; i++) {
            var so = ova[i],
                no = parseInt(so),
                sn = nva[i],
                nn = parseInt(sn);
            if (nn > no || sn.length > so.length) {
                return true;
            } else if (nn < no) {
                return false;
            }
        }
        if (nva.length > ova.length && 0 == nv.indexOf(ov)) {
            return true;
        }
    }
    /**
     * 清除更新目录下的所有文件
     */
	function removeUpdateDir(){
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
			var obj = fs.root.getDirectory('update', {}, function(entry){
				entry.removeRecursively(function(){
					//plus.nativeUI.alert("下载目录删除成功！");
				});
			}, function(){
				plus.nativeUI.alert("下载目录不存在！");
			});
		})	
	}
    $.checkUpdate = checkUpdate;
    $.downWgt 	  = downWgt;
    return $;
}(mui, document));