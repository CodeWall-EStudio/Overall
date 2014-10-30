/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.relat',[
        'ov.constant',
        'ov.services.utils'
    ])
    .service('relatService',[
    '$rootScope','$location','$http','Util','MSG.ERROR.CODE','STATUS.GROUP.LOAD',function($root,$location,$http,Util,MSG,GROUP_LOAD){

        //导入互评刮泥
        var importRelat = function(param,success,error){
            var ts = new Date().getTime();
            var url = '/api/relationship/import';
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load',function(e){
                try{
                    var json = JSON.parse(xhr.responseText);
                    $root.relatList = json.result;
                    console.log('导入成功',json);
                }catch(e){

                }
            });

            xhr.addEventListener('error',function(e){
                console.log('error',e);
            });
            xhr.open("POST", url);
            xhr.send(param);            
        }

        //拉取互评关系列表
        var getRelatList = function(param,success,error){
            var ts = new Date().getTime();
            $http.get('/api/relationship/list?_='+ts+'&term='+$root.nowTerm._id,null,{responseType:'json'})
                .success(function(data,status){
                    //conventStudent(data.student);
                    if(data.err === 0){
                        $root.relatList = data.result;
                        if($root.relatTdList.length === 0){
                            getTdList();
                        }
                        if($root.nowTeacher && $root.nowTeacher.teacherId){
                            $root.teacherRelatList = _.find($root.relatList,function(item){
                                return item.id === $root.nowTeacher.teacherId;
                            })
                        }
                        console.log('拉互评关系列表成功!', data);
                    }else{
                        $root.$emit(MSG,data.err);
                    }
                    if(success) success(data, status);
                })
                .error(function(data,status){
                    if(error) error(data, status);
                });             
        }
        //
        var getOverList = function(param,success,error){
            var ts = new Date().getTime();
            $http.get('/api/evaluation/appraisees?_='+ts+'&term='+$root.nowTerm._id+'&evaluationType='+param.evaluationType,null,{responseType:'json'})
                .success(function(data,status){
                    //conventStudent(data.student);
                    if(data.err === 0){
                         $root.overList = data.result;
                        // if($root.relatTdList.length === 0){
                        //     getTdList();
                        // }
                        console.log('拉互评关系列表成功!', data);
                    }else{
                        $root.$emit(MSG,data.err);
                    }
                    if(success) success(data, status);
                })
                .error(function(data,status){
                    if(error) error(data, status);
                });             
        }        

        /*工具*/
        function getTdList(){
            var item = $root.relatList[0] || false;
            if(item){
                var teacher = item.teachers;
                _.each(teacher,function(item){
                    $root.relatTdList.push(item.name);
                });
            }

        }

        return {
            importRelat : importRelat,
            getOverList : getOverList,
            getRelatList  : getRelatList
        }

    }]);