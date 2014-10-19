/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.import',[
		'ov.constant',
		'ov.services.utils'
	])
	.service('importService',[
	'$rootScope','$location','$http',function($root,$location,$http){
		
		var getQuotaList = function(param,success,error){
			var ts = new Date().getTime();

			var ts = new Date().getTime();
			var body = Util.object.toUrlencodedString(param);

			Http.get('/api/indicator/list?_='+ts+'&indicatorGroup='+param.indicatorGroup,null,{responseType:'json'})
				.success(function(data,status){
					//conventStudent(data.student);
					if(data.code === 0){

						console.log('拉学生列表成功!', data);
						Root.$emit('status.student.load');
					}else{
						Root.$emit('msg.codeshow',data.code);
					}
					if(success) success(data, status);
				})
				.error(function(data,status){
					if(error) error(data, status);
				});			
		}

	return {
		getQuotaList : getQuotaList
	}
}]);
