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

    return {
        importStudent : importStudent
    }
}]);
