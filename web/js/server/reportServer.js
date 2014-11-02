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

                //输出个人的详细资料
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
                    }else{
                        url +='&indicatorGroup='+$root.nowQuotaGroup._id;    
                    }
                    if(param.teacherName){
                        url +='&teacherName='+param.teacherName;      
                    }else{

                    }
                    //var url = '/api/indicatorscore/report?term='+$root.nowTerm._id+'&indicatorGroup='+$root.nowQuotaGroup._id;
                    $http.get(url,null,{responseType: 'json'})
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
                //互评和生评详情
                function getReportDetail(param,success,error){
                    param = param || {};
                    var ts = new Date().getTime();
                    var url = '/api/indicatorscore/detail?_='+ts+'&term='+$root.nowTerm._id;
                    if(param.appraiseeId){
                        url +='&appraiseeId='+param.appraiseeId;
                    }
                    if(typeof param.type !== 'undefined'){
                        url  +='&type='+param.type;
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
                                checkDetail();
                                console.log('拉生评互评成功',data.result);
                            }else{
                                $root.$emit(MSG,data.err);
                            }
                            if(success) success(data, status);
                        })
                        .error(function(data,status){
                            if(error) error(data, status);
                    }); 
                }

                //概要和报表
                function getSummary(param,success,error){
                    param = param || {};
                    var ts = new Date().getTime();
                    var url = '/api/indicatorscore/summary?_='+ts+'&term='+$root.nowTerm._id;
                    // 指定了老师分组　这个时候是概要和报表
                    if(param.teacherGroup){
                        url += '&teacherGroup='+param.teacherGroup;
                    //没有指定老师分组，则需要传ｔｅａｃｈｅｒＮame　这个时候是搜索老师
                    }else if(param.teacherName){
                        url += '&teacherName='+param.teacherName;
                    }
                    if(param.indicatorGroup){
                        url += '&indicatorGroup='+param.indicatorGroup;
                    }
                    //url += '&type='+parseInt(param.type);
                    $http.get(url,null,{responseType:'json'})
                        .success(function(data,status){
                            if(data.err === 0){
                                $root.reportSummary = data.result;
                                checkSummary();
                                console.log('概要或报表拉取成功',data);
                            }else{
                                    $root.$emit(MSG,data.err);
                            }
                        })
                        .error(function(data,status){
                            if(error) error(data, status);
                        }); 
                };

                //概要转化
                function checkSummary(){
                    $root.reportSummary.quotaMap = {};
                    _.each($root.reportSummary.indicatorGroups,function(item){
                        $root.reportSummary.quotaMap[item._id] = item;
                        var tmp = {};
                        _.each(item.indicators,function(obj){
                            tmp[obj._id] = obj;
                        });
                        $root.reportSummary.quotaMap[item._id].quotas = tmp;
                    });
                }

                //检查生评互评结果
                function checkDetail(){
                    var list = [];
                    _.each($root.oneReport.appraisers,function(item){
                        if(item.questionnare){
                            list.push(item);
                        }
                    });
                    $root.oneReport.appraisers = list;
                    if($root.oneReport.students){
                        $root.oneReport.questionMap = {};
                        _.each($root.oneReport.questionnare.questions,function(item){
                            $root.oneReport.questionMap[item._id] = item;
                        });
                    }
                }

                return {
                    getReportList : getReportList,
                    getSummary : getSummary,
                    getReportDetail : getReportDetail
                }
		
}]);
