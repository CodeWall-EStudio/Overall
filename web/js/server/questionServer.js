/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.question',[
        'ov.constant',
        'ov.services.utils'
    ])
    .service('questionService',[
    '$rootScope','$location','$http','Util','MSG.ERROR.CODE','STATUS.QUEST.LOAD',function($root,$location,$http,Util,MSG,QUEST_LOAD){

       //导入问卷
        var importQuestion = function(param,success,error){
            var ts = new Date().getTime();
            var url = '/api/questionnaire/import';
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load',function(e){
                try{
                    var json = JSON.parse(xhr.responseText);
                    console.log(json);
                }catch(e){

                }
            });

            xhr.addEventListener('error',function(e){
                console.log('error',e);
            });
            xhr.open("POST", url);
            xhr.send(param);            
        }

        var createQuestion = function(param,success,error){
            var ts = new Date().getTime();
            var body = Util.object.toUrlencodedString(param);
            $http.post('/api/questionnaire/create?_='+ts,
                body,
                {
                    responseType: 'json',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .success(function(data,status){
                    console.log(data);
                    //conventStudent(data.student);
                    if(data.err === 0){
                        $root.questionList.push(data.result);
                        console.log('新建问卷成功!', data);
                    }else{
                    $root.$emit(MSG,data.err);
                    }
                    if(success) success(data, status);
                })
                .error(function(data,status){
                    if(error) error(data, status);
            });                 
        }

        var getQuestionList = function(param,success,error){
            param = param || {};
            var url = '/api/questionnaire/list?term='+$root.nowTerm._id;
            if(param.order){
                url +='&order='+param.order
            }
            var ts = new Date().getTime();
            $http.get(url+'&t='+ts,null,{responseType:'json'})
                .success(function(data,status){
                    console.log('拉取问卷分组成功！',data.result);
                    if(data.err === 0){
                        $root.questionList = data.result;
                        if($root.questionList.length>0){
                            $root.nowQuestion = $root.questionList[0];
                        }
                        $root.$emit(QUEST_LOAD);
                    }else{
                        $root.$emit(MSG,data.err);
                    }
                })
                .error(function(data,status){
                });            
        }


        var getOneUserScore = function(param,success,error){
            var url = '/api/evaluation/detail?term='+$root.nowTerm._id;
            if(param.appraiseeId){
                url +='&appraiseeId='+param.appraiseeId
            }
            if(typeof param.evaluationType !== 'undefined'){
                url +='&evaluationType='+param.evaluationType
            }            
            var ts = new Date().getTime();
            $http.get(url+'&t='+ts,null,{responseType:'json'})
                .success(function(data,status){
                    console.log('拉取打分结果成功！',data.result);
                    if(data.err === 0){
                        $root.nowQuestScore = data.result;
                        $root.$emit(QUEST_LOAD);
                    }else{
                        $root.$emit(MSG,data.err);
                    }
                })
                .error(function(data,status){
                });            
        }        

        var saveScores = function(param,success,error){
            var url = '/api/evaluation/appraise?term='+$root.nowTerm._id;
            var ts = new Date().getTime();
            var body = Util.object.toUrlencodedString(param);
            $http.post(url+'&_='+ts,
                body,
                {
                    responseType: 'json',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })    
                .success(function(data,status){
                    if(data.err === 0){

                    }else{
                        $root.$emit(MSG,data.err);
                    }
                }) 
                .error(function(data,status){

                })       
        }

    return {
        getQuestionList  : getQuestionList,
        importQuestion : importQuestion,
        getOneUserScore : getOneUserScore,
        saveScores : saveScores,
        createQuestion : createQuestion
    }
}]);
