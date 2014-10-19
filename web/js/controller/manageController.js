/*导入模块*/
angular.module('ov.controllers.manage',[
		'ov.constant',
		'ov.services.quota'
	]).
	controller('manageController',['$rootScope','$scope','quotaService','STATUS.GROUP.LOAD',function($root,$scope,Quota,GROUP_LOAD){
		console.log('load manageController');

		
}]);
