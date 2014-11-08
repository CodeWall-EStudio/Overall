/*导入模块的ｓｅｒｖｅｒ*/
angular.module('ov.services.quota',[
		'ov.constant',
		'ov.services.utils'
	])
	.service('quotaService',[
	'$rootScope','$location','$http','Util','MSG.ERROR.CODE','STATUS.QUOTA.LOAD',function($root,$location,$http,Util,MSG,QUOTA_LOAD){
		/*工具函数＆方法*/
		var setDefQuotaGroup = function(num){
			num = num || 0;
			if($root.quotaGroupList.length){
				$root.nowQuotaGroup = $root.quotaGroupList[num];
				if(!num){
					$root.$emit(QUOTA_LOAD);

					console.log('quota_load');
				}
			}
		};

		/*ｈｔｔｐ　请求*/
		//拉指标组
		var getQuotaGroup = function(param,success,error){
			var url = '/api/indicatorgroup/list?term='+$root.nowTerm._id;
			var ts = new Date().getTime();
			$http.get(url+'&t='+ts,null,{responseType:'json'})
				.success(function(data,status){
					console.log('拉取指标组成功！',data.result);
					if(data.err === 0){
						$root.quotaGroupList = data.result;
						_.each(data.result,function(item,idx){
							$root.quotaGroupMap[item._id]  = item;
						});
						setDefQuotaGroup();
						//$root.$emit(GROUP_LOAD);
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
						$root.quotaGroupList.push(data.result);
						$root.quotaGroupMap[data.result._id] = data.result;
						if(!$root.nowQuotaGroup._id){
							$root.nowQuotaGroup = data.result;
						}
						console.log('新建指标组成功!', data);
					}else{
					}
					$root.$emit(MSG,data.err);
					if(success) success(data, status);
				})
				.error(function(data,status){
					if(error) error(data, status);
				});			
		}		

		//拉指标组评分
		var  getQuotaScore = function(param,success,error){
			return;
			var url = '/api/indicatorscore/report?term='+$root.nowTerm._id+'&indicatorGroup='+$root.nowQuotaGroup._id;
			var ts = new Date().getTime();
			$http.get(url+'&t='+ts,null,{responseType:'json'})
				.success(function(data,status){
					console.log('拉取指标分数成功！',data.result);
					if(data.err === 0){
						//$root.$emit(GROUP_LOAD);
						$root.quotaScoreList = data.result;
					}else{
						$root.$emit(MSG,data.err);
					}
				})
				.error(function(data,status){
				});
		}

		//设置分数
		var setQuotaScore = function(param,success,error){

		}

		//拉指标列表 作废。直接改成成指标组里面读了。
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
					if(json.err === 0){
						getQuotaGroup();	
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
		//导入指标分数
		var importQuotaScore = function(param,success,error){
			var ts = new Date().getTime();
			var url = '/api/indicatorscore/import';
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('load',function(e){
				try{
					var json = JSON.parse(xhr.responseText);
					console.log('導入成功　',json);
				}catch(e){

				}
			});
			xhr.addEventListener('error',function(e){
				console.log('error',e);
			});
			xhr.open("POST", url);
			xhr.send(param);			
		}

		//指标组排序函数
		var orderQuotaGroup = function(id,type,order){
			var list = $root.quotaGroupMap[id].indicators;
			var sort = _.sortBy(list,function(item){
				if(order){
					console.log('-',item,type);
					return -item[type];
				}else{
					console.log('+',item,type);
					return +item[type];
				}
			});
			$root.quotaGroupMap[id].indicators = sort;
		}

	return {
		setDefQuotaGroup : setDefQuotaGroup,
		getQuotaGroup : getQuotaGroup,
		createQuotaGroup : createQuotaGroup,
		getQuotaList : getQuotaList,
		importQuota : importQuota,
		importQuotaScore : importQuotaScore,
		orderQuotaGroup : orderQuotaGroup,
		getQuotaScore : getQuotaScore,
		setQuotaScore : setQuotaScore
	}
}]);
