angular.module('ov.services.term',[
        'ov.constant',
        'ov.services.utils'	
    ])
    .service('termService',[
    '$rootScope','$location','$http','Util','MSG.ERROR.CODE','STATUS.TERM.LOAD',function($root,$location,$http,Util,MSG,TERM_LOAD){

    //c新建学期
    var createTerm = function(param,success,error){
        var ts = new Date().getTime();
        var body = Util.object.toUrlencodedString(param);
        $http.post('/api/term/create?_='+ts,
            body,
            {
                responseType: 'json',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function(data,status){
                console.log(data);
                //conventStudent(data.student);
                if(data.err === 0){
                    $root.termList.push(data.result);
                    console.log('新建学期成功!', data);
                }else{
                $root.$emit(MSG,data.err);
                }
                if(success) success(data, status);
            })
            .error(function(data,status){
                if(error) error(data, status);
        });         
    }

    //c修改学期
    var modifyTerm = function(param,success,error){
        var ts = new Date().getTime();
        var body = Util.object.toUrlencodedString(param);
        $http.post('/api/term/modify?_='+ts,
            body,
            {
                responseType: 'json',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function(data,status){
                //conventStudent(data.student);
                if(data.err === 0){
                    updateTerm(data.result);
                    console.log('新建学期成功!', data);
                }else{
                $root.$emit(MSG,data.err);
                }
                if(success) success(data, status);
            })
            .error(function(data,status){
                if(error) error(data, status);
        });         
    }    

    //删除学期
    var delTerm = function(param,success,error){
        var ts = new Date().getTime();
        var body = Util.object.toUrlencodedString(param);
        $http.post('/api/term/delete?_='+ts,
            body,
            {
                responseType: 'json',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function(data,status){
                console.log(data);
                //conventStudent(data.student);
                if(data.err === 0){
                    console.log('删除学期成功!', data);
                    deleteUpdateTerm(param.term);
                }
                $root.$emit(MSG,data.err);
                
                if(success) success(data, status);
            })
            .error(function(data,status){
                if(error) error(data, status);
        });         
    }    
    //拉学期列表
    var getTermList = function(param,success,error){
        var ts = new Date().getTime();
        var body = Util.object.toUrlencodedString($root.param);
        $http.get('/api/term/list?_='+ts,
            null,
            {
                responseType: 'json',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function(data,status){
                //conventStudent(data.student);
                if(data.err === 0){
                    $root.termList = data.result;
                    changeDefTerm();
                    $root.$emit(TERM_LOAD);
                    console.log('拉学期成功!', data.result);
                }else{
                    $root.$emit(MSG,data.err);
                }
                if(success) success(data, status);
            })
            .error(function(data,status){
                if(error) error(data, status);
        });          
    }

    /*
    设置当前选择的学期
    */
    //status : 0: 未激活, 1: 激活, 2: 关闭, 4: 评价完成
    function changeDefTerm(id){
        if(id){
            _.each($root.termList,function(item){
                if(item._id === id){
                    $root.nowTerm  = item;
                    return;
                }
            })
        }else{
            var tepTerm = $root.termList[0];
            _.each($root.termList,function(item){
                if(item.status === 1){
                    $root.nowTerm = item;
                    return;
                }
            });
             $root.nowTerm = tepTerm;
        }
    }

    //取一个id对应的学期
    function getOneTerm(id){
        if(id){
             return  _.find($root.termList,function(item){
                return item._id == id;
            });
        }else{
            return false;
        }     
    }

    //更新学期id的数据
    function updateTerm(param){
        _.each($root.termList,function(item,idx){
            if(item._id === param._id){
                $root.termList[idx] = param;
            }
        });
    }
    //删除之后更新学期列表
    function deleteUpdateTerm(id){
        var list = [];
        _.each($root.termList,function(item){
            if(item._id !== id){
                list.push(item);
            }
        });
        $root.termList = list;
    }


    return{
        getTermList: getTermList,
        createTerm: createTerm,
        modifyTerm : modifyTerm,
        delTerm : delTerm,
        changeDefTerm : changeDefTerm,
        getOneTerm : getOneTerm
    }
		
}]);
