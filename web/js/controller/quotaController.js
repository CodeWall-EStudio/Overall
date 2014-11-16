/*导入模块*/
angular.module('ov.controllers.import',[
		'ov.constant',
		'ov.services.quota'
	]).
	controller('quotaController',['$rootScope','$scope','quotaService','STATUS.TERM.LOAD','STATUS.QUOTA.LOAD','STATUS.QUOTAGROUP.CHANGE','STATUS.TERM.CHANGE',function($root,$scope,Quota,TERM_LOAD,QUOTA_LOAD,QUOTA_CHANGE,TERM_CHANGE){
		console.log('load quotaController');
		/*初始化数据，先拉指标组*/
		$root.quotaGroupList = [];
		$root.quotaGroupMap = {};
		$root.nowQuotaGroup = {};
		$root.quotaList = [];
		$root.newQuotaGroup = {};
		
		$root.modifyQuotaName = '';
		$root.modifyQuotaId = '';

		$root.quotaScoreList = {};
		$root.defQuota = {
			name : '概要',
			_id : -1
		}		

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
			$('#newQuotaGroupView').modal('hide');
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

			console.log($root.nowQuotaGroup);
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
			if(idx<0){
				$root.nowQuotaGroup = $root.defQuota;
				$root.$emit(QUOTA_CHANGE,true);
				return;
			}
			Quota.setDefQuotaGroup(idx);
			var length = $root.nowQuotaGroup.indicators.length;
			//清空分数排序的内容,然后重新生成列表
			$scope.quotaScoreOrder = {};
			for(var i = 0;i<length;i++){
				$scope.quotaScoreOrder[i] = 0;
			}
			$root.$emit(QUOTA_CHANGE);
		}
		//编辑指标组
		$root.editQuotaGroup = function(){

		}
		//新建指标组
		$root.createQuotaGroup = function(){
			
		}

		//保持新建的指标组
		$root.createNewQuotaGroup = function(){
			console.log($root.newQuotaGroup);

			$root.newQuotaGroup.term = $root.nowTerm._id;
			Quota.createQuotaGroup();
		}	

		$root.modifyQuota = function(idx,name){
			$root.modifyQuotaId = idx;
			$root.modifyQuotaName = name;
			$('#modifyQuota').modal('show');
		}
		
		$root.modifyQuotaSub = function(){
			$root.modifyQuotaName = $("#quotaModifyName").val();
			Quota.modifyQuotaGroup({
				indicatorgroup : $root.modifyQuotaId,
				name : $root.modifyQuotaName
			});
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

		$root.$on(TERM_CHANGE,function(e,d){
			$root.newQuotaGroup = {};
			Quota.getQuotaGroup();
			// var param = {
			// 	indicatorGroup : $root.nowQuotaGroup._id
			// }
			// Quota.getQuotaList(param);
		});		

		$root.$on(QUOTA_LOAD,function(e,d){
			//Quota.getQuotaScore();
		})
		
}]);
