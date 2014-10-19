/*导入模块*/
angular.module('ov.controllers.index',[
		'ov.constant',
		'ov.services.quota'
	]).
	controller('indexController',[
		'$rootScope',
		'$scope',
		'quotaService',
		function($root,$scope,$quota){
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

		//报表类型
		$root.reportType = {
			0 : '概要',
			1 : '教学指标组',
			2 : '教育指标组',
			3 : '行政指标组'
		};
		//指标组
		$root.quotaGroupList;		
		$root.quotaGroupMap;
		//指标
		$root.quotaList;
		$root.quotaMap;
}]);
