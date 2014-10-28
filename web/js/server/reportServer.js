/*
报表的ｓｅｒｖｅｒ
*/
angular.module('ov.services.report',[
		'ov.constant',
		'ov.services.utils'		
	])
	.service('reportService',
	['$rootScope','$location','$http','MSG.ERROR.CODE',function($root,$location,$http,MSG){

                //
                function getReportList(param,success,error){
                    param = param || {};
                    var ts = new Date().getTime();
                    var url = '/api/indicatorscore/report?_='+ts+'&term='+$root.nowTerm._id;
                    if(param.teacherGroup){
                        url +='&teacherGroup='+param.teacherGroup;    
                    }else{
                        url +='&teacherGroup='+$root.nowTeacherGroup._id;
                    }                    
                    if(param.indicatorGroup){
                        url +='&indicatorGroup='+param.indicatorGroup;    
                    }
                    if(param.teacherName){
                        url +='&teacherName='+param.teacherName;      
                    }else{

                    }
                    //var url = '/api/indicatorscore/report?term='+$root.nowTerm._id+'&indicatorGroup='+$root.nowQuotaGroup._id;
                    $http.get(url,
                        null,
                        {
                            responseType: 'json'
                        })
                        .success(function(data,status){
                            //conventStudent(data.student);
                            if(data.err === 0){
                                if(param.teacherName){
                                    $root.nowTeacherReport = data.result[0];
                                }else{
                                    $root.reportList = data.result;   
                                }
                                 
                                    console.log('拉报表成功',data.result);
                            }else{
                                $root.$emit(MSG,data.err);
                            }
                            if(success) success(data, status);
                        })
                        .error(function(data,status){
                            if(error) error(data, status);
                    }); 
                }

                function getOneReport(param,success,error){
                    param = param || {};
                    var ts = new Date().getTime();
                    var url = '/api/evaluation/detail?_='+ts+'&term='+$root.nowTerm._id;
                    if(param.appraiseeId){
                        url +='&appraiseeId='+param.appraiseeId;
                    }
                    if(typeof param.evaluationType !== 'undefined'){
                        url  +='&evaluationType='+param.evaluationType;
                    }
       
                    $http.get(url,
                        null,
                        {
                            responseType: 'json'
                        })
                        .success(function(data,status){
                            //conventStudent(data.student);
                            if(data.err === 0){
                                //$root.userList = data.result;
                                $root.oneReport= data.result;
                                $root.oneReport.scoresMap = {};
                                $root.oneReport.total = 0;
                                _.each( $root.oneReport.scores,function(item){
                                    $root.oneReport.scoresMap[item.question] = item;
                                    $root.oneReport.total += item.score;
                                });
                                console.log('拉个人报表成功',data.result);
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
                    getReportList : getReportList,
                    getOneReport : getOneReport
                }
		
}]);
