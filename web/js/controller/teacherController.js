/*导入模块*/
angular.module('ov.controllers.teacher',[
        'ov.constant',
        'ov.services.teacher'
    ]).
    controller('teacherController',['$rootScope','$scope','teacherService','STATUS.TERM.LOAD','STATUS.TEACHERGROUP.CHANGE','STATUS.TERM.CHANGE',function($root,$scope,Teacher,TERM_LOAD,TEACHERGROUP_CHANGE,TERM_CHANGE){
        console.log('load teacherController');
        /*初始化数据，先拉老师组*/
        $root.teacherList = []; //老师
        $root.teacherGroup = [];      //老师分组  
        $root.teacherGroupMap = {};
        $root.nowTeacherGroup = {}; //当前老苏分组

        //导入老师
        $('#importTeacher').bind('change',function(){
            var file = $(this)[0].files[0];
            var fd = new FormData();
            fd.append('file',file);
            fd.append('term',$root.nowTerm._id);

            if($root.nowTerm._id){
                Teacher.importTeacher(fd);
            }
        })

        //导入老师分组
        $('#importTeacherGroup').bind('change',function(){
            var file = $(this)[0].files[0];
            var fd = new FormData();
            fd.append('file',file);
            fd.append('term',$root.nowTerm._id);
            if($root.nowTerm._id){
                Teacher.importTeacherGroup(fd);
            }
        })        

        $root.changeTeacherGroup = function(id){
            $root.nowTeacherGroup = $root.teacherGroupMap[id];
            $root.$emit(TEACHERGROUP_CHANGE);
        }

        $root.$on(TERM_LOAD,function(){
            Teacher.getTeacherGroupList();
        })

        $root.$on(TERM_CHANGE,function(){
            Teacher.getTeacherGroupList();
        })

}]);
