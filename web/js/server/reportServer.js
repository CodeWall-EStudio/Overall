/*
报表的ｓｅｒｖｅｒ
summary 概要＆报表
report  选定指标组之后的分数
detail  生评和互评详情
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
                    //只有老师分组的时候是概要
                    if(param.teacherGroup){
                        url +='&teacherGroup='+param.teacherGroup;    
                    }else{
                        url +='&teacherGroup='+$root.nowTeacherGroup._id;
                    }                    
                    if(param.indicatorGroup){
                        url +='&indicatorGroup='+param.indicatorGroup;    
                    }else{
                        url +='&indicatorGroup='+$root.nowQuotaGroup._id;    
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
                    var url = '/api/indicatorscore/detail?_='+ts+'&term='+$root.nowTerm._id;
                    if(param.appraiseeId){
                        url +='&appraiseeId='+param.appraiseeId;
                    }
                    if(typeof param.type !== 'undefined'){
                        url  +='&type='+param.type;
                    }
                    console.log(url);
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
                                console.log($root.oneReport);
                                //$root.oneReport.scoresMap = {};
                                //$root.oneReport.total = 0;
                                // _.each( $root.oneReport.scores,function(item){
                                //     $root.oneReport.scoresMap[item.question] = item;
                                //     $root.oneReport.total += item.score;
                                // });
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
