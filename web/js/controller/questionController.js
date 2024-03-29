/*导入模块*/
angular.module('ov.controllers.question',[
        'ov.constant',
        'ov.services.question'
    ]).
    controller('questionController',['$rootScope','$scope','questionService','STATUS.TERM.LOAD','STATUS.TERM.CHANGE',function($root,$scope,Question,TERM_LOAD,TERM_CHANGE){
        console.log('load questionController');
        /*初始化数据，先拉指标组*/
        $root.nowQuestion = {};
        $root.questionList = [];
        $root.questionName = '';
        $root.questionOrder = 1;
        $root.modifyQuestionName = '';
        $root.modifyQuestionId = '';
        $root.questionOrderMap = {};

        $scope.questionOrder = {
            name : 0,
            order  : 0,
            desc : 0,
            score : 0            
        }

        //导入问卷
        $('#importQuestion').bind('change',function(){
            var file = $(this)[0].files[0];
            var fd = new FormData();
            fd.append('file',file);
            fd.append('questionnaire',$root.nowQuestion._id);

            if($root.nowQuotaGroup._id){
                Question.importQuestion(fd);
            }
        })     

        //显示问题框
        $root.createQuestion = function(){
            $root.questionName = '';
            $root.questionOrder = 1;
            $("#newQuestion").modal('show');
        }

        $root.createNewQuestion = function(){
            var param = {
                term : $root.nowTerm._id,
                name : $('#questionName').val(),
                order : $('#questionOrder').val()
            }
            Question.createQuestion(param);
        }

        $root.changeQuestion = function(id){
            console.log(id);
            $root.nowQuestion = _.find($root.questionList,function(item){
                return item._id == id;
            });
        }

        $root.modifyQuestion = function(id,name){
            console.log(id,name);
            $root.modifyQuestionName = name;
            $root.modifyQuestionId = id;
            $("#modifyQuestion").modal('show');
        }

        $root.modifyQuestionSub = function(){
            $root.modifyQuestionName = $("#questionModifyName").val();
            Question.modifyQuestion({
                questionnaire : $root.modifyQuestionId,
                name : $root.modifyQuestionName
            });
        }

        $root.$on(TERM_LOAD,function(){
            Question.getQuestionList();
        });
        
        $root.$on(TERM_CHANGE,function(){
            $root.nowQuestion = {};
            Question.getQuestionList();
        });        

}]);
