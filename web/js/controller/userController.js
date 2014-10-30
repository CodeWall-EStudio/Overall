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

        $root.showManage = function(){
            $("#authManage").modal('show');
        }

        $root.setAuth = function(id,role,_id){
            var param = {
                id : id,
                role : role,
                _id : _id
            }
            User.setAuth(param);
        }

        $root.quitLogin = function(){
            console.log(2222);
            User.logout();
        }

        $root.import71 = function(){
            User.importUser();
        }

        //事件
        $root.showUser = function(id){
            console.log(id);
        }

        $root.$on(USERLOAD,function(){
            User.searchUser();
        });        
}]);