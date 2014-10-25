/*互评关系模块*/
angular.module('ov.controllers.relat',[
        'ov.constant',
        'ov.services.relat',
        'ov.services.question'
    ]).
    controller('relatController',['$rootScope','$scope','relatService','questionService','STATUS.TERM.LOAD','STATUS.LOGIN.STUDENT','STATUS.LOGIN.TEACHER',function($root,$scope,Relat,Question,TERM_LOAD,STUDENT_LOGIN,TEACHER_LOGIN){
        console.log('load relatController');
        $root.relatList = [];
        $root.relatTdList = [];
        $root.overList = [];

        $scope.nowQuestionOrder = 0;

        //上传文件,导入指标
        $("#importRelat").bind('change',function(){  
            var file = $(this)[0].files[0];
            var fd = new FormData();
            fd.append('file',file);
            fd.append('term',$root.nowTerm._id);

            if($root.nowTerm._id){
                Relat.importRelat(fd);
            }
        });        

        //事件
        $scope.getQuestion = function(value){
            if($scope.nowQuestionOrder === value){
                Question();
            }
        }

        //学生登陆了。
        $root.$on(STUDENT_LOGIN,function(){
            Relat.getRelatList();
            Relat.getOverList({
                evaluationType : 1
            });
        });
        //老师登陆了。
        $root.$on(TEACHER_LOGIN,function(){
            Relat.getRelatList();
            Relat.getOverList({
                evaluationType : 0
            });            
        });        

        // //根据id拉问卷
        // $root.$on(TERM_LOAD,function(){

        //     Relat.getRelatList();
        //     Relat.getOverList();
        // });
    }]);