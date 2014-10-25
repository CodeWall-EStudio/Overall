/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.teacher',[
        'ov.constant',
        'ov.services.utils'
    ])
    .service('teacherService',[
    '$rootScope','$location','$http',function($root,$location,$http){

       //导入老师分组
        var importTeacherGroup = function(param,success,error){
            var ts = new Date().getTime();
            var url = '/api/teachergroup/import';
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load',function(e){
                console.log(e);
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

        //导入老师
        var importTeacher = function(param,success,error){
            var ts = new Date().getTime();
            var url = '/api/teacher/import';
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

        var getTeacherGroupList = function(param,success,error){
            var url = '/api/teachergroup/list?term='+$root.nowTerm._id;
            var ts = new Date().getTime();
            $http.get(url+'&t='+ts,null,{responseType:'json'})
                .success(function(data,status){
                    console.log('拉取老师分组成功！',data.result);
                    if(data.err === 0){
                        $root.teacherGroup = data.result;
                        if($root.teacherGroup.length > 0){
                            $root.nowTeacherGroup = $root.teacherGroup[0];
                        }
                        _.each(data.result,function(item,idx){
                            $root.teacherGroupMap[item._id]  = item;
                        });
                    }else{
                        $root.$emit(MSG,data.err);
                    }
                })
                .error(function(data,status){
                });            
        }

    return {
        getTeacherGroupList  : getTeacherGroupList,
        importTeacherGroup : importTeacherGroup,
        importTeacher : importTeacher
    }
}]);
