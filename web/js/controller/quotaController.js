/*导入模块*/
angular.module('ov.controllers.import',[
		'ov.constant',
		'ov.services.quota'
	]).
	controller('quotaController',['$rootScope','$scope','quotaService','STATUS.GROUP.LOAD',function($root,$scope,Quota,GROUP_LOAD){
		console.log('load quotaController');
		/*初始化数据，先拉指标组*/
		$root.quotaGroupList = [];
		$root.nowQuotaGroup = {};
		$root.quotaList = [];
		$root.newQuotaGroup = {
			name : 'test'
		};

		//上传文件
		$("#importFile").bind('change',function(){  
			var file = $(this)[0].files[0];
			var fd = new FormData();
			fd.append('file',file);
			fd.append('indicatorGroup',$root.nowQuotaGroup._id);

			if($root.nowQuotaGroup._id){
				Quota.importQuota(fd);
			}
		});

		/*事件绑定*/
		//选择指标组
		$root.selectQuotaGroup = function(idx){
			Quota.setDefQuotaGroup(idx);
			$root.$emit(GROUP_LOAD);
		}
		//编辑指标组
		$root.editQuotaGroup = function(){

		}
		//新建指标组
		$root.createQuotaGroup = function(){
			
		}
		//保持新建的指标组
		$root.createNewQuotaGroup = function(){
			Quota.createQuotaGroup();
		}	

		Quota.getQuotaGroup();

		/*观察者*/
		//指标分组已经加载成功，或者已经改变，拉具体的指标
		$root.$on(GROUP_LOAD,function(e,d){
			var param = {
				indicatorGroup : $root.nowQuotaGroup._id
			}
			Quota.getQuotaList(param);
		});
		
}]);
