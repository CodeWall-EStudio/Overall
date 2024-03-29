/*导入模块*/
angular.module('ov.controllers.index',[
		'ov.constant',
		'ov.services.quota'
	]).
	controller('indexController',[
		'$rootScope',
		'$scope',
		'$location',
		function($root,$scope,$location){
		console.log('load indexController');
		//初始化
		/*
		所有的变量都在这里初始化把。
		*/
		//个人信息
		$root.myInfo = {};

		//学期信息
		$root.gradelist = [];
		//老师分组
		$root.teacherGroup = {
			0 : '班主任',
			1 : '科任老师',
			2 : '行政员工'
		};

	        $root.switchMode = function(mode){
	            //console.log(mode,$scope.getMode());
	            if(mode !== $scope.getMode()){
	            	 if(mode === 'report'){
	            	 	$root.reportMode = 'summary';
	            	 }else if(mode ==='search'){
	            	 	$root.reportMode = 'search';
	            	 }
	               $location.search('mode', mode);
	            }
	        }

	        $root.getMode = function(mode){
	            return $location.search()['mode'] || false;
	        }		
}]);
