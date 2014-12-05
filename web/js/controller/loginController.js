/*gongju */
angular.module('ov.controllers.login',[
        'ov.constant',
        'ov.services.utils',
        'ov.services.login'
    ]).
    controller('loginController',['$rootScope','$scope','Util','loginService',function($root,$scope,Util,Login){
        console.log('load toolbarController');

        $scope.username = '';
        $scope.pwd = '';

        $scope.studentLogin = function(){
            console.log($scope.username,$scope.pwd);
            Login.studentLogin({
                name : $scope.username,
                id : $scope.pwd
            })
        }
}]);