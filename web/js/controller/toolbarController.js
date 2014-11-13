/*gongju */
angular.module('ov.controllers.toolbar',[
        'ov.constant',
        'ov.services.utils',
        'ov.services.login'
    ]).
    controller('toolbarController',['$rootScope','$scope','Util','loginService',function($root,$scope,Util,Login){
        console.log('load toolbarController');
        
        if(!Util.cookie.get('skey')){
            console.log('not login');
            Login.teacherLogin();
        }
}]);