/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.login',[
        'ov.constant',
        'ov.services.utils'
    ])
    .service('loginService',[
    '$rootScope','$location','$http','Util','MSG.ERROR.CODE','LOGINED',function($root,$location,$http,Util,MSG,LOGINED){
        /*工具函数＆方法*/
        function teacherLogin(){
            var url = '/api/login';
            location.href=url;
        }

        function studentLogin(param,success,error){
            var ts = new Date().getTime();
            var body = Util.object.toUrlencodedString(param);
            $http.post('/api/login/student?_='+ts,
                body,
                {
                    responseType: 'json',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .success(function(data,status){
                    //conventStudent(data.student);
                    if(data.err === 0){
                        window.location = '/overall.html'
                    }else{
                    $root.$emit(MSG,data.err);
                    }
                    if(success) success(data, status);
                })
                .error(function(data,status){
                    if(error) error(data, status);
            }); 
        }
    return {
        teacherLogin : teacherLogin,
        studentLogin : studentLogin
    }
}]);
