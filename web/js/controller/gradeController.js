angular.module('ov.controller.grade',[
		'ov.constant'
	]).
	controller('gradeController',['$rootScope','$scope',function($root,$scope){
		$root.gradeList = [];
		$root.classList = [];
}]);
