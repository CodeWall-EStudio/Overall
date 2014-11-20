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
                /*
                function getReportList(param,success,error){
                    param = param || {};
                    var ts = new Date().getTime();
                    var url = '/api/indicatorscore/summarylist?_='+ts+'&term='+$root.nowTerm._id;

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
                */

                //输出个人的详细资料
                function getReport(param,success,error){
                    param = param || {};
                    var ts = new Date().getTime();
                    var url = '/api/indicatorscore/report?_='+ts+'&term='+$root.nowTerm._id;

                    if(param.teacherId){
                        url +='&teacherId='+param.teacherId;    
                    }else{
                        url +='&teacherId='+$root.nowTeacher.teacherId;
                    }                    

                    //var url = '/api/indicatorscore/report?term='+$root.nowTerm._id+'&indicatorGroup='+$root.nowQuotaGroup._id;
                    $http.get(url,null,{responseType: 'json'})
                        .success(function(data,status){
                            //conventStudent(data.student);
                            if(data.err === 0){
                                    $root.reportDetail = data.result;
                                    var num = 0;
                                    var pnum = 0;
                                    _.each(data.result.results,function(item){
                                        num += item.weightedScore;
                                        pnum += item.averageWeightedScore;
                                    }); 
                                    $root.reportDetail.allNum = num.toFixed(2);
                                    $root.reportDetail.allPNum = pnum.toFixed(2);
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
                    if(param.indicatorGroup && param.indicatorGroup !== -1){
                        url += '&indicatorGroup='+param.indicatorGroup;
                    }
                    //url += '&type='+parseInt(param.type);
                    //console.log(url);
                    $http.get(url,null,{responseType:'json'})
                        .success(function(data,status){
                            if(data.err === 0){
                                if(param.teacherName){
                                    $root.reportSearch = data.result;
                                    $root.reportSearch.list = false;
                                }else{
                                    $root.reportSummary = data.result;    
                                }
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

                //详细报表
                function getSummaryList(param,success,error){
                    param = param || {};
                    var ts = new Date().getTime();
                    var url = '/api/indicatorscore/summarylist?_='+ts+'&term='+$root.nowTerm._id;
                    // 指定了老师分组　这个时候是概要和报表
                    if(param.teacherGroup){
                        url += '&teacherGroup='+param.teacherGroup;
                    //没有指定老师分组，则需要传ｔｅａｃｈｅｒＮame　这个时候是搜索老师
                    }else if(param.teacherName){
                        url += '&teacherName='+param.teacherName;
                    }
                    console.log(param);
                    if(param.indicatorGroup && param.indicatorGroup !== -1){
                        url += '&indicatorGroup='+param.indicatorGroup;
                    }
                    //url += '&type='+parseInt(param.type);
                    $http.get(url,null,{responseType:'json'})
                        .success(function(data,status){
                            if(data.err === 0){
                                if(param.teacherName){
                                    $root.reportSearch.results = data.result;
                                    $root.reportSearch.list = true;
                                }else{
                                    $root.reportSummary = data.result;    
                                }

                                //console.log($root.reportSummary,$root.reportSearch);
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
                    $root.reportSearch.quotaMap = {};
                    if($root.reportSearch.indicatorGroups){
                        _.each($root.reportSearch.indicatorGroups,function(item){
                            $root.reportSearch.quotaMap[item._id] = item;
                        });
                    }else if($root.reportSearch.results && $root.reportSearch.results[0]){
                        _.each($root.reportSearch.results[0].scores,function(item){
                            $root.reportSearch.quotaMap[item.indicator._id] = item.indicator;
                        });                        
                    }
                }

                //检查生评互评结果
                function checkDetail(){
                    // var list = [];
                    // _.each($root.oneReport.appraisers,function(item){
                    //     if(item.questionnaire){
                    //         list.push(item);
                    //     }
                    // });
                    // $root.oneReport.appraisers = list;
                    if($root.oneReport.students){
                        $root.oneReport.questionMap = {};
                        _.each($root.oneReport.questionnaire.questions,function(item){
                            $root.oneReport.questionMap[item._id] = item;
                        });
                    }
                    //console.log($root.oneReport);
                }

                return {
                    //getReportList : getReportList,
                    getSummaryList : getSummaryList,
                    getReport : getReport,
                    getSummary : getSummary,
                    getReportDetail : getReportDetail
                }
		
}]);
