/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.user',[
        'ov.constant',
        'ov.services.utils'
    ])
    .service('userService',[
    '$rootScope','$location','$http','Util','MSG.ERROR.CODE','STATUS.USER.LOAD',function($root,$location,$http,Util,MSG,USERLOAD){
        /*工具函数＆方法*/
        function getUserInfo(){
            var url = '/api/user/info';
            $http.get(url,
                null,
                {
                    responseType: 'json'
                })
                .success(function(data,status){
                    if(data.err === 0){
                        $root.my = data.result;
                        $root.$emit(USERLOAD);
                    }else{
                        $root.$emit(MSG,data.err);
                    }
                }) 
                .error(function(data,status){

                }) ;          
        }

        function logout(){
            location.href="/api/login/logout";
        }

        function searchUser(param,success,error){
            param = param || {};
            var ts = new Date().getTime();
            var url = '/api/user/search?_='+ts;
            if(param.keyword){
                url +='&=keyword='+param.keyword;    
            }            
            $http.get(url,
                null,
                {
                    responseType: 'json'
                })
                .success(function(data,status){
                    //conventStudent(data.student);
                    if(data.err === 0){
                        $root.userList = data.result;
                        console.log('搜索用户成功',data.result);
                    }else{
                        $root.$emit(MSG,data.err);
                    }
                    if(success) success(data, status);
                })
                .error(function(data,status){
                    if(error) error(data, status);
            }); 
        }

        function importUser(param){
            var url = '/api/user/import';
            $http.get(url,null,{
                responseType: 'json'
            })
            .success(function(data,status){
                $root.$emit(MSG,data.err);
            })
            .error(function(data,status){

            })
        }

        function setAuth(param,success,error){
            var ts = new Date().getTime();
            var body = Util.object.toUrlencodedString(param);
            $http.post('/api/user/auth?_='+ts,
                body,
                {
                    responseType: 'json',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .success(function(data,status){
                    console.log(data);
                    //conventStudent(data.student);
                    if(data.err === 0){
                        console.log('设置权限成功!', data);
                        var u = _.find($root.userList,function(item){
                            return item._id == param._id;
                        })     
                        u.role = param.role;
                    }
                    $root.$emit(MSG,data.err);
                    if(success) success(data, status);
                })
                .error(function(data,status){
                    if(error) error(data, status);
            });              
        }

    return {
        getUserInfo : getUserInfo,
        importUser : importUser,
        logout : logout,
        setAuth : setAuth,
        searchUser : searchUser
    }
}]);
