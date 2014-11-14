/*导入模块*/
angular.module('ov.controllers.student',[
        'ov.constant',
        'ov.services.student'
    ]).
    controller('studentController',['$rootScope','$scope','studentService','STATUS.TERM.LOAD','STATUS.TERM.CHANGE',function($root,$scope,Student,TERM_LOAD,TERM_CHANGE){
        console.log('load studentController');
        /*初始化数据，先拉指标组*/
        $root.studentList = [];
        $root.nowStudent = {};

        $root.nowGrade = 0;
        $root.nowClass = 0;
        $root.studentKeyWord = '';

        $root.gradeList = ['全部年级','一年级','二年级','三年级','四年级','五年级','六年级'];
        $root.classList = ['全部班级','一班','二班','三班','四班','五班','六班','七班','八班','九班','十班','十一班','十二班'];

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

        $root.changeGrade = function(idx){
            $root.nowGrade = idx;
            Student.filterStudent();
        }

        $root.changeClass = function(idx){
            $root.nowClass = idx;
            Student.filterStudent();
        }        

        $root.studentSearch = function(){
            $root.studentKeyWord = $('#studentKey').val();
            Student.searchStudent();
        }

        $root.$on(TERM_LOAD,function(e){
            
            Student.getStudentList();
        });

        $root.$on(TERM_CHANGE,function(){
            Student.getStudentList();
        })        

}]);
