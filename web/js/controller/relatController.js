/*互评关系模块*/
angular.module('ov.controllers.relat',[
        'ov.constant',
        'ov.services.relat',
        'ov.services.question'
    ]).
    controller('relatController',['$rootScope','$scope','relatService','questionService','STATUS.TERM.LOAD','STATUS.LOGIN.STUDENT','STATUS.LOGIN.TEACHER','STATUS.QUEST.LOAD','STATUS.RELAT.GET','STATUS.TERM.LOAD','STATUS.TERM.CHANGE',function($root,$scope,Relat,Question,TERM_LOAD,STUDENT_LOGIN,TEACHER_LOGIN,QUEST_LOAD,GET_RELAT,TERM_LOAD,TERM_CHANGE){
        console.log('load relatController');
        $root.relatList = [];
        $root.relatTdList = [];
        $root.overList = [];
        $root.nowQuestScore;

        $root.nowOverType = 0;
        $scope.nowName = '';
        $scope.nowId = '';
        $scope.nowQuestionOrder = 0;
        $scope.nowScores = {};
        $scope.allScore = 0;


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
        $scope.getQuestion = function(value,name,id){
            $scope.nowName = name;
            $scope.nowId = id;
            //console.log(value,$scope.nowQuestionOrder);
            //if($scope.nowQuestionOrder !== value){
                Question.getOneUserScore({
                    appraiseeId : id,
                    evaluationType : $root.nowOverType
                });
                $scope.nowQuestionOrder = value;
            //}
        }

        //分数+1
        $scope.addScore = function(id){
            if($scope.nowScores[id]){
                if($scope.nowScores[id].score < $scope.nowScores[id].max){
                    $scope.nowScores[id].score++;
                    $scope.allScore++;
                }
            }
        }
         //分数-1
        $scope.removeScore = function(id){
            if($scope.nowScores[id]){
                if($scope.nowScores[id].score > 0){
                    $scope.nowScores[id].score--;
                    $scope.allScore--;
                }
            }
        }   

        //重置
        $scope.resetScore = function(){
            resetScores();
        }     
        //保存
        $scope.saveScore = function(){
            //console.log($root.nowQuestion);
            var param = {
                appraiseeId : $scope.nowId,
                evaluationType : $root.nowOverType,
                questionnaire : $root.nowQuestScore.questionnaire._id,
                scores : JSON.stringify(getNowScores())
            }
            Question.saveScores(param);
        }
        //取目前的评分
        function getNowScores(){
            var ql = [];
            _.each($scope.nowScores,function(item,idx){
                ql.push({
                    question : idx,
                    score : item.score
                })
            });
            return ql;
        }

        function resetScores(){
            //重置得分数据
            $scope.nowScores = {};
            $scope.allScore = 0;
            try{
                //$.extend($scope.nowScores,$root.nowQuestion.questions);
                _.each($root.nowQuestScore.scoremap,function(item){
                     $scope.nowScores[item._id] = {
                        max : item.max,
                        score : item.score
                     };
                     $scope.allScore +=  item.score;
                });
                console.log($scope.nowScores);
                //console.log($scope.nowScores);
                // if($root.nowQuestScore.scores){
                //     _.each($root.nowQuestScore.scores,function(item){
                //         $scope.nowScores[item.question].score = item.score;
                //         $scope.allScore +=  item.score;
                //     })
                // }
            }catch(e){
                
            }

            
        }

        //学生登陆了。
        $root.$on(STUDENT_LOGIN,function(){
            $root.nowOverType = 1;
            //Relat.getRelatList();
            Relat.getOverList({
                evaluationType : 1
            });
        });
        //老师登陆了。
        $root.$on(TEACHER_LOGIN,function(){
            $root.nowOverType = 0;
            //Relat.getRelatList();
            Relat.getOverList({
                evaluationType : 0
            });            
        });      

        $root.$on(GET_RELAT,function(e,d){
            if($root.relatList.length === 0){
                Relat.getRelatList();
            }
            // console.log($root.relatList,$root.nowTeacher);
        });

        $root.$on(TERM_CHANGE,function(e,d){
             Relat.getRelatList();
        });
        $root.$on(TERM_LOAD,function(e,d){
             Relat.getRelatList();
        });        

        //拉到问题分组了
        $root.$on(QUEST_LOAD,function(){
            resetScores();
        });  

        // //根据id拉问卷
        // $root.$on(TERM_LOAD,function(){

        //     Relat.getRelatList();
        //     Relat.getOverList();
        // });
    }]);