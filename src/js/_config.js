var titleNView = { //详情页原生导航配置
	height:'64px',
	backgroundColor: '#E44346', //导航栏背景色
	titleText: '首页',
	titleColor: '#FFFFFF', //文字颜色
	type: 'transparent', //透明渐变样式
	//autoBackButton: true, //自动绘制返回箭头
	splitLine: { //底部分割线
		color: '#cccccc'
	}
}
var subPageTop = "0";
var subPageBotton = "51px";
var subPages = [{
		url: 'main/product/prd_list.html',
		id: 'prd-list-html',
		index: true,
		styles: {
			top: subPageTop,
			bottom: subPageBotton
		}
	}, {
		url: 'main/user/user.html',
		id: 'user-html',
		styles: {
			top: subPageTop,
			bottom: subPageBotton,
			statusbar:{
				background:"#E44346"
			}
		}
	}, {
		url: 'main/index/ind_list_view.html',
		id: 'ind-list-view-html',
		styles: {
			top: subPageTop,
			bottom: subPageBotton,
			"render": "always",
			"popGesture": "hide",
			"bounce": "vertical",
			"bounceBackground": "#E44346",
			"titleNView": titleNView
		}
	},
	{
		url: 'main/notice/notice_index.html',
		id: 'notice-index-html',
		styles: {
			top: subPageTop,
			bottom: subPageBotton,
			statusbar:{
				background:"#E44346"
			}
		}
	}
];

var _config = {
	DEBUG: true,
	apiUrl: 'http://47.52.228.84:8081',
	debugUrl: ''
}