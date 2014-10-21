/*导入模块*/
angular.module('ov.controllers.import',[
		'ov.constant',
		'ov.services.quota'
	]).
	controller('quotaController',['$rootScope','$scope','quotaService','STATUS.TERM.LOAD',function($root,$scope,Quota,TERM_LOAD){
		console.log('load quotaController');
		/*初始化数据，先拉指标组*/
		$root.quotaGroupList = [];
		$root.quotaGroupMap = {};
		$root.nowQuotaGroup = {};
		$root.quotaList = [];
		$root.newQuotaGroup = {};

		//指标排序
		$scope.quotaOrder = {
			name : 0,
			order  : 0,
			gatherType : 0,
			score : 0
		};
		//指标分数排序
		$scope.quotaScoreOrder = {};

		//指标排序
		$scope.orderQuotaGroup = function(name){
			$scope.quotaOrder[name]  = !$scope.quotaOrder[name] ;
			Quota.orderQuotaGroup($root.nowQuotaGroup._id,name,$scope.quotaOrder[name]);
			$('#newQuotaGroup').modal('hide');
		}

		//指标分数排序
		$scope.orderQuotaScore = function(){
			$scope.quotaScoreOrder[name]  = !$scope.quotaScoreOrder[name] ;
		}


		//上传文件,导入指标
		$("#importFile").bind('change',function(){  
			var file = $(this)[0].files[0];
			var fd = new FormData();
			fd.append('file',file);
			fd.append('indicatorGroup',$root.nowQuotaGroup._id);

			if($root.nowQuotaGroup._id){
				Quota.importQuota(fd);
			}
		});

		//导入指标分数
		$('#importQuotaScore').bind('change',function(){
			var file = $(this)[0].files[0];
			var fd = new FormData();
			fd.append('file',file);
			fd.append('indicatorGroup',$root.nowQuotaGroup._id);

			if($root.nowQuotaGroup._id){
				Quota.importQuotaScore(fd);
			}
		})

		/*事件绑定*/
		//选择指标组
		$root.selectQuotaGroup = function(idx){
			Quota.setDefQuotaGroup(idx);
			var length = $root.nowQuotaGroup.indicators.length;
			//清空分数排序的内容,然后重新生成列表
			$scope.quotaScoreOrder = {};
			for(var i = 0;i<length;i++){
				$scope.quotaScoreOrder[i] = 0;
			}
			//$root.$emit(GROUP_LOAD);
		}
		//编辑指标组
		$root.editQuotaGroup = function(){

		}
		//新建指标组
		$root.createQuotaGroup = function(){
			
		}
		//保持新建的指标组
		$root.createNewQuotaGroup = function(){
			$root.newQuotaGroup.term = $root.nowTerm._id;
			Quota.createQuotaGroup();
		}	


		

		/*观察者*/
		//学期已经加载成功，或者已经改变，拉具体的指标
		$root.$on(TERM_LOAD,function(e,d){
			Quota.getQuotaGroup();
			// var param = {
			// 	indicatorGroup : $root.nowQuotaGroup._id
			// }
			// Quota.getQuotaList(param);
		});
		
}]);
