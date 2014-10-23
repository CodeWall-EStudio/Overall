/*导入模块*/
angular.module('ov.controllers.manage',[
        'ov.constant',
        'ov.services.quota'
    ]).
    controller('manageController',['$rootScope','$scope','$location','quotaService','STATUS.GROUP.LOAD',function($root,$scope,$location,Quota,GROUP_LOAD){
        console.log('load manageController');
        $scope.switchMode = function(mode){
            console.log(mode,$scope.getMode());
            if(mode !== $scope.getMode()){
               $location.search('mode', mode);
            }
        }

        $scope.getMode = function(mode){
            return $location.search()['mode'] || false;
        }
}]);
