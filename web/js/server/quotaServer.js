/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.quota',[
		'ov.constant',
		'ov.services.utils'
	])
	.service('quotaService',[
	'$rootScope','$location','$http','Util','MSG.ERROR.CODE','STATUS.GROUP.LOAD',function($root,$location,$http,Util,MSG,GROUP_LOAD){
		/*工具函数＆方法*/
		var setDefQuotaGroup = function(num){
			num = num || 0;
			if($root.quotaGroupList.length){
				$root.nowQuotaGroup = $root.quotaGroupList[num];
			}
		};

		/*ｈｔｔｐ　请求*/
		//拉指标组
		var getQuotaGroup = function(param,success,error){
			var url = '/api/indicatorgroup/list';
			var ts = new Date().getTime();
			$http.get(url+'?t='+ts,null,{responseType:'json'})
				.success(function(data,status){
					console.log('拉取指标组成功！',data.result);
					if(data.err === 0){
						$root.quotaGroupList = data.result;
						setDefQuotaGroup();
						$root.$emit(GROUP_LOAD);
					}else{
						$root.$emit(MSG,data.err);
					}
				})
				.error(function(data,status){
				});

		}

		//c新建指标组
		var createQuotaGroup = function(param,success,error){
			var ts = new Date().getTime();
			var body = Util.object.toUrlencodedString($root.newQuotaGroup);
			$http.post('/api/indicatorgroup/create?_='+ts,
				body,
				{
					responseType: 'json',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data,status){
					console.log(data);
					//conventStudent(data.student);
					if(data.err === 0){
						console.log('新建指标组成功!', data);
					}else{
						$root.$emit(MSG,data.err);
					}
					if(success) success(data, status);
				})
				.error(function(data,status){
					if(error) error(data, status);
				});			
		}		

		//拉指标列表
		var getQuotaList = function(param,success,error){
			var ts = new Date().getTime();
			$http.get('/api/indicator/list?_='+ts+'&indicatorGroup='+param.indicatorGroup,null,{responseType:'json'})
				.success(function(data,status){
					//conventStudent(data.student);
					if(data.err === 0){
						$root.quotaList = data.result;
						console.log($root.quotaList);
						console.log('拉指标列表成功!', data);
					}else{
						$root.$emit(MSG,data.err);
					}
					if(success) success(data, status);
				})
				.error(function(data,status){
					if(error) error(data, status);
				});			
		}

		//导入指标
		var importQuota = function(param,success,error){
			var ts = new Date().getTime();
			var url = '/api/indicator/import';
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
		setDefQuotaGroup : setDefQuotaGroup,
		getQuotaGroup : getQuotaGroup,
		createQuotaGroup : createQuotaGroup,
		getQuotaList : getQuotaList,
		importQuota : importQuota
	}
}]);
