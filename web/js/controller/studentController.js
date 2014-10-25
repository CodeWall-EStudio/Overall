/*导入模块*/
angular.module('ov.controllers.student',[
        'ov.constant',
        'ov.services.student'
    ]).
    controller('studentController',['$rootScope','$scope','studentService','STATUS.TERM.LOAD',function($root,$scope,Student,TERM_LOAD){
        console.log('load studentController');
        /*初始化数据，先拉指标组*/
        $root.studentList = [];
        $root.nowStudent = {};

        $scope.studentOrder = {
            name : 0,
            id : 0,
            grade : 0,
            'class' : 0
        }

        $scope.orderStudent = function(name){
            $scope.studentOrder[name]  = !$scope.studentOrder[name] ;
            Student.orderStudent(name,$scope.studentOrder[name]);            
        }

        //导入xue
        $('#importStudent').bind('change',function(){
            var file = $(this)[0].files[0];
            var fd = new FormData();
            fd.append('file',file);
            fd.append('term',$root.nowTerm._id);

            if($root.nowQuotaGroup._id){
                Student.importStudent(fd);
            }
        })

        $root.$on(TERM_LOAD,function(e){
            Student.getStudentList();
        });

}]);
