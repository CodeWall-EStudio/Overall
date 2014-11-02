/*用户模块 */
angular.module('ov.controllers.user',[
        'ov.constant',
        'ov.services.utils',
        'ov.services.user'
    ]).
    controller('userController',['$rootScope','$scope','$location','Util','userService','STATUS.USER.LOAD',function($root,$scope,$location,Util,User,USERLOAD){
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

        /*
        role 1 : 学生
        ２　老师
        ４　管理干部
        ８　校领导
        16  系统管理员
        */

        $root.$on(USERLOAD,function(){
            //User.searchUser();
            var role = $root.my.role;
            var url = $location.absUrl();
            if(role & 0x1 || role & 0x2){
                if(url.indexOf('overall.html') < 0){
                    window.location.href='/overall.html';
                }
                return;
            }
            if(role & 0x4){
                if(url.indexOf('import.html') < 0){
                    window.location.href='/import.html';
                }
            }            
            if(role & 0x8){
                if(url.indexOf('index.html') < 0){
                    window.location.href='/index.html';
                }
            }    
            if(role & 0x16){
                if(url.indexOf('mange.html') < 0){
                    window.location.href='/mange.html';
                }
            }                

        });        
}]);