angular.module('ov.controllers.msg',[
		'ov.constant'
	])
	.controller('msgController',['$rootScope', '$scope','$location','MSG.ERROR.CODE',function ($root,$scope,$location,MSG) {
		console.log('load msgcontroller');
		// body...
		Messenger().options = {
		    extraClasses: 'messenger-fixed messenger-on-bottom',
		    theme: 'flat'
		}

		var url = $location.absUrl();

		var msg = {
			0 : '操作成功!',
			1001 : '您还没有登录!',
			1004 : '没有找到资源!',
			1010 : '您没有查看该资源的权限!',
			1011 : '参数出错啦!',
			1013 : '出错啦',
			1014 : '同名啦,请修改名称!',
			1015 : '已经归档啦!',
			1016 : '该资源不能删除',
			1017 : '该目录下还有其他文件，无法删除!',
			1041 : '用户名或密码错误!',
			1043 : '用户不存在!',
			1050 : '时间交叉了!'			
		}

		$root.$on(MSG,function(e,code){
			if(code === 1001){
			            var url = '/api/login';
			            location.href=url;				
				return;
			}
			var obj = {
				'message' : msg[code]
			}
			if(parseInt(code)){
				obj.type = 'error'
			}
			Messenger().post(obj);	
		});

	}]);