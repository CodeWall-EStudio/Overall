/*用户模块 */
angular.module('ov.controllers.user',[
        'ov.constant',
        'ov.services.utils',
        'ov.services.user'
    ]).
    controller('userController',['$rootScope','$scope','Util','userService','STATUS.USER.LOAD',function($root,$scope,Util,User,USERLOAD){
        console.log('load userController');

        $root.my = {};
        $root.userList = [];

        //拉个人信息
        User.getUserInfo();

        //事件
        $root.showUser = function(id){
            console.log(id);
        }

        $root.$on(USERLOAD,function(){
            User.searchUser();
        });        
}]);