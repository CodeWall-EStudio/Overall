/*导入模块*/
angular.module('ov.controllers.overall',[
        'ov.constant',
        'ov.services.utils',
        'ov.services.quota'
    ]).
    controller('overallController',['$rootScope','$scope','$location','quotaService','Util','STATUS.TERM.LOAD','STATUS.LOGIN.STUDENT','STATUS.LOGIN.TEACHER',function($root,$scope,$location,Quota,Util,TERM_LOAD,STUDENT_LOGIN,TEACHER_LOGIN){
        console.log('load overallController');
        $scope.switchMode = function(mode){
            if(mode !== $scope.getMode()){
               $location.search('mode', mode);
            }
        }

        $scope.getMode = function(mode){
            return $location.search()['mode'] || false;
        }

        $root.$on(TERM_LOAD,function(){
           var flag = Util.cookie.get('skey');
            //学生
            if(flag.length === 32){
                $root.$emit(STUDENT_LOGIN);
            //老师
            }else{
                $root.$emit(TEACHER_LOGIN);
            }   
        });
 

}]);
