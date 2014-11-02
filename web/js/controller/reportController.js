angular.module('ov.controllers.report',[
		'ov.constant',
		'ov.services.report'
	]).
	controller('reportController',['$rootScope','$scope','reportService','STATUS.USER.LOAD','STATUS.TERM.LOAD','STATUS.QUOTA.LOAD','STATUS.TERM.CHANGE','STATUS.TEACHERGROUP.CHANGE','STATUS.QUOTAGROUP.CHANGE','STATUS.RELAT.GET','STATUS.STUDENT.GET',function($root,$scope,Report,USERLOAD,TERMLOAD,QUOTALOAD,TERM_CHANGE,TEACHREGROUP_CHANGE,QUOTAGROUP_CHANGE,GET_RELAT,GET_STUDENT){
/*
    .constant('STATUS.TERM.CHANGE','status.term.change')
    .constant('STATUS.TEACHERGROUP.CHANGE','status.teachergroup.change')
    .constant('STATUS.QUOTAGROUP.CHANGE','status.quotagroup.change')
*/        
            /*初始化变量*/
            $root.reportList = [];

            /*
            summary 概要，
            quotalist  指定了指标组
            search 搜索结果
            oneuser 查看单个老师的详情
            teacher 　互评
            student 　生评
            */
            $root.reportMode = 'summary';

            $root.reportSMode = 'all';


            $root.oneReport = {};
            $root.reportSummary = {}; //评分概要
            $root.reportDetail = {};//评分详情
            $root.nowTeacher = {};
            $root.teacherRelatList = [];
            $root.nowTeacherReport = {};
            $root.searchKeyWord = '';//搜索关键字


            $root.nowSelectedUserIdx = 0;

            var termLoad = false,
                   quotaLoad = false;

            /*登陆之后再拉报表*/
            $root.$on(TERMLOAD,function(){
                termLoad = true;
                if(quotaLoad && termLoad){
                    //Report.getReportList();
                }                
            });
            //这里指标组在学期之后。。。。囧
            $root.$on(QUOTALOAD,function(){
                quotaLoad = true;
                if(quotaLoad && termLoad){
                    //Report.getReportList();
                    Report.getSummary({
                        teacherGroup : $root.nowTeacherGroup._id
                    });
                }
            });

            $root.$on(USERLOAD,function(){
                console.log('load')
            }); 

            //事件通知 学期变更
            $root.$on(TERM_CHANGE,function(){
                Report.getReportList();
            });
            //事件通知 老师分组变更
            $root.$on(TEACHREGROUP_CHANGE,function(){
                Report.getReportList();
            });
            //事件通知 指标组变更
            $root.$on(QUOTAGROUP_CHANGE,function(){
                Report.getReportList();
            });    

            //选中了一个老师
            $root.showOneUser =  function(idx){
                $root.nowSelectedUserIdx = idx
            }
            //返回报表概要
            $root.returnReport = function(){
                $root.reportMode = 'summary';
            }
            //开始搜索
            $root.startSearch = function(){
                $root.searchKeyWord = $('#searchKey').val();
                    Report.getSummary({
                        teacherName : $root.searchKeyWord
                    });
            }

            //显示一种类型的报表
            $root.showReport = function(type){
                switch(type){
                    case 0: //互评
                        $root.$emit(GET_RELAT);
                        $root.reportSMode = 'teacher';
                        break;
                    case 1: //生评
                        $root.$emit(GET_STUDENT);
                        $root.reportSMode = 'student';
                        break;
                    case 2: //总览
                        $root.reportSMode = 'all';
                        break;
                }
                getReport();
            }

            //拉互评和生评
            $root.showOneReport = function(obj){
                $root.nowTeacher = {
                    teacherId : obj.teacherId,
                    teacherName : obj.teacherName
                }
                $root.reportMode = 'show';
                $root.reportSMode = 'all';
                getReport();
            }

            function getReport(){
                if($root.reportSMode === 'all'){
                    Report.getSummary({
                        type : 1
                    });
                    // Report.getReportList({
                    //     teacherName : $root.nowTeacher.teacherName
                    // });
                }else if($root.reportSMode === 'teacher'){
                    Report.getReportDetail({
                        appraiseeId : $root.nowTeacher.teacherId,
                        type : 1
                    });                    
                }else if($root.reportSMode === 'student'){
                    Report.getReportDetail({
                        appraiseeId : $root.nowTeacher.teacherId,
                        type : 2
                    });                                        
                }                
            }
}]);    