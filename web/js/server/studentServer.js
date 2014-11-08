/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.student',[
        'ov.constant',
        'ov.services.utils'
    ])
    .service('studentService',[
    '$rootScope','$location','$http',function($root,$location,$http){
        
        //导入xuesheng
        var importStudent = function(param,success,error){
            var ts = new Date().getTime();
            var url = '/api/student/import';
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load',function(e){
                try{
                    var json = JSON.parse(xhr.responseText);
                    if(json.err===0){
                            getStudentList();
                    }
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

        var getStudentList = function(param,success,error){
            var ts = new Date().getTime();
             var url = '/api/student/list?term='+$root.nowTerm._id;
             param = param || {};
             if(param.grade){
                url+='&grade='+param.grade;
             }
             if(param.cls){
                url+='&cls='+param.cls;
             }
             $http.get(url+'&t='+ts,null,{responseType:'json'})
                .success(function(data,status){
                    if(data.err === 0){
                        console.log('拉学生列表成功',data);
                        $root.studentList = data.result;
                    }else{
                        $root.$emit(MSG,data.err);
                    }
                })
                .error(function(data,status){

                });
        }

        var orderStudent = function(type,order){
            var list = $root.studentList;
            var sort = _.sortBy(list,function(item){
                if(order){
                    return -item[type];
                }else{
                    return +item[type];
                }
            });
            $root.studentList = sort;            
        }

    return {
        importStudent : importStudent,
        getStudentList : getStudentList,
        orderStudent : orderStudent
    }
}]);
