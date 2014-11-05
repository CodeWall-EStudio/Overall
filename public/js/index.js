angular.module("ov.services.term",["ov.constant","ov.services.utils"]).service("termService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.TERM.LOAD",function(e,o,r,t,n,i){function c(o){if(o)_.each(e.termList,function(r){return r._id===o?void(e.nowTerm=r):void 0});else{var r=e.termList[0];_.each(e.termList,function(o){return 1===o.status?void(e.nowTerm=o):void 0}),e.nowTerm=r}}function a(o){return o?_.find(e.termList,function(e){return e._id==o}):!1}function u(o){_.each(e.termList,function(r,t){r._id===o._id&&(e.termList[t]=o)})}var s=function(o,i,c){var a=(new Date).getTime(),u=t.object.toUrlencodedString(o);r.post("/api/term/create?_="+a,u,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,r){console.log(o),0===o.err?(e.termList.push(o.result),console.log("新建学期成功!",o)):e.$emit(n,o.err),i&&i(o,r)}).error(function(e,o){c&&c(e,o)})},l=function(o,i,c){var a=(new Date).getTime(),s=t.object.toUrlencodedString(o);r.post("/api/term/modify?_="+a,s,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,r){0===o.err?(u(o.result),console.log("新建学期成功!",o)):e.$emit(n,o.err),i&&i(o,r)}).error(function(e,o){c&&c(e,o)})},p=function(o,i,c){var a=(new Date).getTime(),u=t.object.toUrlencodedString(o);r.post("/api/term/create?_="+a,u,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,r){console.log(o),0===o.err?console.log("新建学期成功!",o):e.$emit(n,o.err),i&&i(o,r)}).error(function(e,o){c&&c(e,o)})},d=function(o,a,u){{var s=(new Date).getTime();t.object.toUrlencodedString(e.param)}r.get("/api/term/list?_="+s,null,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,r){0===o.err?(e.termList=o.result,c(),e.$emit(i),console.log("拉学期成功!",o.result)):e.$emit(n,o.err),a&&a(o,r)}).error(function(e,o){u&&u(e,o)})};return{getTermList:d,createTerm:s,modifyTerm:l,delTerm:p,changeDefTerm:c,getOneTerm:a}}]),angular.module("ov.services.report",["ov.constant","ov.services.utils"]).service("reportService",["$rootScope","$location","$http","MSG.ERROR.CODE",function(e,o,r,t){function n(o,n,i){o=o||{};var c=(new Date).getTime(),a="/api/indicatorscore/summarylist?_="+c+"&term="+e.nowTerm._id;a+=o.teacherGroup?"&teacherGroup="+o.teacherGroup:"&teacherGroup="+e.nowTeacherGroup._id,a+=o.indicatorGroup?"&indicatorGroup="+o.indicatorGroup:"&indicatorGroup="+e.nowQuotaGroup._id,o.teacherName&&(a+="&teacherName="+o.teacherName),r.get(a,null,{responseType:"json"}).success(function(r,i){0===r.err?(o.teacherName?e.nowTeacherReport=r.result[0]:e.reportList=r.result,console.log("拉报表成功",r.result)):e.$emit(t,r.err),n&&n(r,i)}).error(function(e,o){i&&i(e,o)})}function i(o,n,i){o=o||{};var c=(new Date).getTime(),a="/api/indicatorscore/report?_="+c+"&term="+e.nowTerm._id;a+=o.teacherId?"&teacherId="+o.teacherId:"&teacherId="+e.nowTeacher.teacherId,r.get(a,null,{responseType:"json"}).success(function(o,r){0===o.err?(e.reportDetail=o.result,console.log("拉报表成功",o.result)):e.$emit(t,o.err),n&&n(o,r)}).error(function(e,o){i&&i(e,o)})}function c(o,n,i){o=o||{};var c=(new Date).getTime(),a="/api/indicatorscore/detail?_="+c+"&term="+e.nowTerm._id;o.appraiseeId&&(a+="&appraiseeId="+o.appraiseeId),"undefined"!=typeof o.type&&(a+="&type="+o.type),r.get(a,null,{responseType:"json"}).success(function(o,r){0===o.err?(e.oneReport=o.result,s(),console.log("拉生评互评成功",o.result)):e.$emit(t,o.err),n&&n(o,r)}).error(function(e,o){i&&i(e,o)})}function a(o,n,i){o=o||{};var c=(new Date).getTime(),a="/api/indicatorscore/summary?_="+c+"&term="+e.nowTerm._id;o.teacherGroup?a+="&teacherGroup="+o.teacherGroup:o.teacherName&&(a+="&teacherName="+o.teacherName),o.indicatorGroup&&(a+="&indicatorGroup="+o.indicatorGroup),console.log(a),r.get(a,null,{responseType:"json"}).success(function(r){0===r.err?(o.teacherName?e.reportSearch=r.result:e.reportSummary=r.result,u(),console.log("概要或报表拉取成功",r)):e.$emit(t,r.err)}).error(function(e,o){i&&i(e,o)})}function u(){e.reportSummary.quotaMap={},_.each(e.reportSummary.indicatorGroups,function(o){e.reportSummary.quotaMap[o._id]=o;var r={};_.each(o.indicators,function(e){r[e._id]=e}),e.reportSummary.quotaMap[o._id].quotas=r})}function s(){var o=[];_.each(e.oneReport.appraisers,function(e){e.questionnare&&o.push(e)}),e.oneReport.appraisers=o,e.oneReport.students&&(e.oneReport.questionMap={},_.each(e.oneReport.questionnare.questions,function(o){e.oneReport.questionMap[o._id]=o}))}return{getReportList:n,getReport:i,getSummary:a,getReportDetail:c}}]),angular.module("ov.services.login",["ov.constant","ov.services.utils"]).service("loginService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","LOGINED",function(e,o,r,t,n){function i(){var e="/api/login";location.href=e}function c(o,i,c){var a=(new Date).getTime(),u=t.object.toUrlencodedString(o);r.post("/api/login/student?_="+a,u,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,r){0===o.err?window.location="/overall.html":e.$emit(n,o.err),i&&i(o,r)}).error(function(e,o){c&&c(e,o)})}return{teacherLogin:i,studentLogin:c}}]),angular.module("ov.services.teacher",["ov.constant","ov.services.utils"]).service("teacherService",["$rootScope","$location","$http",function(e,o,r){var t=function(e){var o=((new Date).getTime(),"/api/teachergroup/import"),r=new XMLHttpRequest;r.addEventListener("load",function(e){console.log(e);try{var o=JSON.parse(r.responseText);console.log(o)}catch(e){}}),r.addEventListener("error",function(e){console.log("error",e)}),r.open("POST",o),r.send(e)},n=function(e){var o=((new Date).getTime(),"/api/teacher/import"),r=new XMLHttpRequest;r.addEventListener("load",function(){try{var e=JSON.parse(r.responseText);console.log(e)}catch(o){}}),r.addEventListener("error",function(e){console.log("error",e)}),r.open("POST",o),r.send(e)},i=function(){var o="/api/teachergroup/list?term="+e.nowTerm._id,t=(new Date).getTime();r.get(o+"&t="+t,null,{responseType:"json"}).success(function(o){console.log("拉取老师分组成功！",o.result),0===o.err?(e.teacherGroup=o.result,e.teacherGroup.length>0&&(e.nowTeacherGroup=e.teacherGroup[0]),_.each(o.result,function(o){e.teacherGroupMap[o._id]=o})):e.$emit(MSG,o.err)}).error(function(){})};return{getTeacherGroupList:i,importTeacherGroup:t,importTeacher:n}}]),angular.module("ov.services.quota",["ov.constant","ov.services.utils"]).service("quotaService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.QUOTA.LOAD",function(e,o,r,t,n,i){var c=function(o){o=o||0,e.quotaGroupList.length&&(e.nowQuotaGroup=e.quotaGroupList[o],o||(e.$emit(i),console.log("quota_load")))},a=function(){var o="/api/indicatorgroup/list?term="+e.nowTerm._id,t=(new Date).getTime();r.get(o+"&t="+t,null,{responseType:"json"}).success(function(o){console.log("拉取指标组成功！",o.result),0===o.err?(e.quotaGroupList=o.result,_.each(o.result,function(o){e.quotaGroupMap[o._id]=o}),c()):e.$emit(n,o.err)}).error(function(){})},u=function(o,i,c){var a=(new Date).getTime(),u=t.object.toUrlencodedString(e.newQuotaGroup);r.post("/api/indicatorgroup/create?_="+a,u,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,r){console.log(o),0===o.err&&(e.quotaGroupList.push(o.result),e.quotaGroupMap[o.result._id]=o.result,console.log("新建指标组成功!",o)),e.$emit(n,o.err),i&&i(o,r)}).error(function(e,o){c&&c(e,o)})},s=function(){return},l=function(){},p=function(o,t,i){var c=(new Date).getTime();r.get("/api/indicator/list?_="+c+"&indicatorGroup="+o.indicatorGroup,null,{responseType:"json"}).success(function(o,r){0===o.err?(e.quotaList=o.result,console.log(e.quotaList),console.log("拉指标列表成功!",o)):e.$emit(n,o.err),t&&t(o,r)}).error(function(e,o){i&&i(e,o)})},d=function(e){var o=((new Date).getTime(),"/api/indicator/import"),r=new XMLHttpRequest;r.addEventListener("load",function(){try{var e=JSON.parse(r.responseText);console.log(e)}catch(o){}}),r.addEventListener("error",function(e){console.log("error",e)}),r.open("POST",o),r.send(e)},m=function(e){var o=((new Date).getTime(),"/api/indicatorscore/import"),r=new XMLHttpRequest;r.addEventListener("load",function(){try{var e=JSON.parse(r.responseText);console.log("導入成功　",e)}catch(o){}}),r.addEventListener("error",function(e){console.log("error",e)}),r.open("POST",o),r.send(e)},f=function(o,r,t){var n=e.quotaGroupMap[o].indicators,i=_.sortBy(n,function(e){return t?(console.log("-",e,r),-e[r]):(console.log("+",e,r),+e[r])});e.quotaGroupMap[o].indicators=i};return{setDefQuotaGroup:c,getQuotaGroup:a,createQuotaGroup:u,getQuotaList:p,importQuota:d,importQuotaScore:m,orderQuotaGroup:f,getQuotaScore:s,setQuotaScore:l}}]),angular.module("ov.services.user",["ov.constant","ov.services.utils"]).service("userService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.USER.LOAD",function(e,o,r,t,n,i){function c(){var o="/api/user/info";r.get(o,null,{responseType:"json"}).success(function(o){0===o.err?(e.my=o.result,console.log(e.my),e.$emit(i)):e.$emit(n,o.err)}).error(function(){})}function a(){location.href="/api/login/logout"}function u(o,t,i){o=o||{};var c=(new Date).getTime(),a="/api/user/search?_="+c;o.keyword&&(a+="&=keyword="+o.keyword),r.get(a,null,{responseType:"json"}).success(function(o,r){0===o.err?(e.userList=o.result,console.log("搜索用户成功",o.result)):e.$emit(n,o.err),t&&t(o,r)}).error(function(e,o){i&&i(e,o)})}function s(){var o="/api/user/import";r.get(o,null,{responseType:"json"}).success(function(o){e.$emit(n,o.err)}).error(function(){})}function l(o,i,c){var a=(new Date).getTime(),u=t.object.toUrlencodedString(o);r.post("/api/user/auth?_="+a,u,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(r,t){if(console.log(r),0===r.err){console.log("设置权限成功!",r);var c=_.find(e.userList,function(e){return e._id==o._id});c.role=o.role}e.$emit(n,r.err),i&&i(r,t)}).error(function(e,o){c&&c(e,o)})}return{getUserInfo:c,importUser:s,logout:a,setAuth:l,searchUser:u}}]),angular.module("ov.services.utils",[]).service("Util",[function(){var e={object:{toUrlencodedString:function(e){return _.map(e,function(e,o){return encodeURIComponent(o)+"="+encodeURIComponent(e)}).join("&")}},getParameter:function(e){var o=new RegExp("(\\?|#|&)"+e+"=([^&#]*)(&|#|$)"),r=location.href.match(o);return decodeURIComponent(r?r[2]:"")},cookie:{get:function(e){var o=document.cookie.split("; "),r=_.reduce(o,function(e,o){var r=o.split("=");return e[r[0]]=r[1],e},{});return r[e]},set:function(e){var o=null;if(document.cookie&&""!=document.cookie)for(var r=document.cookie.split(";"),t=0;t<r.length;t++){var n=$.trim(r[t]);if(n.substring(0,e.length+1)==e+"="){o=decodeURIComponent(n.substring(e.length+1));break}}return o}},time:{timezoneOffset:(new Date).getTimezoneOffset(),dateToDatetimePickerValue:function(o,r){return o||(o=new Date),o.setMinutes(o.getMinutes()-e.time.timezoneOffset),r||(o.setSeconds(0),o.setMilliseconds(0)),o.toISOString().split(".")[0]},datetimePickerValueToTs:function(o){if(o){var r=o.split(":").length<3?":00.000Z":".000Z",t=Date.parse(o+r)+60*e.time.timezoneOffset*1e3;return console.log(o,t,new Date(t)),t}return 0}}};return e}]),angular.module("ov.controllers.nav",["ov.constant"]).controller("navController",["$rootScope","$scope",function(){console.log("load navController")}]),angular.module("ov.controllers.grade",["ov.constant"]).controller("gradeController",["$rootScope","$scope",function(){}]),angular.module("ov.controllers.import",["ov.constant","ov.services.quota"]).controller("quotaController",["$rootScope","$scope","quotaService","STATUS.TERM.LOAD","STATUS.QUOTA.LOAD","STATUS.QUOTAGROUP.CHANGE",function(e,o,r,t,n,i){console.log("load quotaController"),e.quotaGroupList=[],e.quotaGroupMap={},e.nowQuotaGroup={},e.quotaList=[],e.newQuotaGroup={},e.quotaScoreList={},o.quotaOrder={name:0,order:0,gatherType:0,score:0},o.quotaScoreOrder={},o.orderQuotaGroup=function(t){o.quotaOrder[t]=!o.quotaOrder[t],r.orderQuotaGroup(e.nowQuotaGroup._id,t,o.quotaOrder[t]),$("#newQuotaGroup").modal("hide")},o.orderQuotaScore=function(){o.quotaScoreOrder[name]=!o.quotaScoreOrder[name]},$("#importFile").bind("change",function(){var o=$(this)[0].files[0],t=new FormData;t.append("file",o),t.append("indicatorGroup",e.nowQuotaGroup._id),console.log(e.nowQuotaGroup),e.nowQuotaGroup._id&&r.importQuota(t)}),$("#importQuotaScore").bind("change",function(){var o=$(this)[0].files[0],t=new FormData;t.append("file",o),t.append("indicatorGroup",e.nowQuotaGroup._id),e.nowQuotaGroup._id&&r.importQuotaScore(t)}),e.selectQuotaGroup=function(t){if(0>t)return e.nowQuotaGroup=!1,void e.$emit(i);r.setDefQuotaGroup(t);var n=e.nowQuotaGroup.indicators.length;o.quotaScoreOrder={};for(var c=0;n>c;c++)o.quotaScoreOrder[c]=0;e.$emit(i)},e.editQuotaGroup=function(){},e.createQuotaGroup=function(){},e.createNewQuotaGroup=function(){e.newQuotaGroup.term=e.nowTerm._id,r.createQuotaGroup()},e.$on(t,function(){r.getQuotaGroup()}),e.$on(n,function(){})}]),angular.module("ov.controllers.report",["ov.constant","ov.services.report"]).controller("reportController",["$rootScope","$scope","reportService","STATUS.USER.LOAD","STATUS.TERM.LOAD","STATUS.QUOTA.LOAD","STATUS.TERM.CHANGE","STATUS.TEACHERGROUP.CHANGE","STATUS.QUOTAGROUP.CHANGE","STATUS.RELAT.GET","STATUS.STUDENT.GET",function(e,o,r,t,n,i,c,a,u,s,l){function p(){"oneuse"===e.reportSMode?r.getReport({teacherId:e.nowTeacher.teacherId}):"teacher"===e.reportSMode?r.getReportDetail({appraiseeId:e.nowTeacher.teacherId,type:1}):"student"===e.reportSMode&&r.getReportDetail({appraiseeId:e.nowTeacher.teacherId,type:2})}e.reportList=[],e.reportMode="summary",e.reportSMode="oneuse",e.oneReport={},e.reportSummary={},e.reportSearch={},e.reportDetail={},e.reportMore={},e.nowTeacher={},e.teacherRelatList=[],e.nowTeacherReport={},e.searchKeyWord="",e.nowSelectedUserIdx=0;var d=!1,m=!1;e.$on(n,function(){d=!0}),e.$on(i,function(){m=!0,"summary"===e.reportMode&&m&&d&&r.getSummary({teacherGroup:e.nowTeacherGroup._id})}),e.$on(t,function(){}),e.$on(c,function(){r.getReportList()}),e.$on(a,function(){r.getSummary({teacherGroup:e.nowTeacherGroup._id})}),e.$on(u,function(){e.reportMode="group",r.getSummary({teacherGroup:e.nowTeacherGroup._id,indicatorGroup:e.nowQuotaGroup._id})}),e.showMore=function(o,r){var t={};t.name=r,console.log(o,e.reportDetail),e.reportMore=$.extend(t,e.reportDetail.results[o])},e.showoneuse=function(o){e.reportMode="show",e.reportSMode="oneuse",e.nowSelectedUserIdx=o},e.returnReport=function(){e.reportMode="summary"},e.startSearch=function(){e.searchKeyWord=$("#searchKey").val(),e.reportMode="search",r.getSummary({teacherName:e.searchKeyWord})},e.exportReport=function(o){var r=(new Date).getTime(),t="/api/indicatorscore/summary?_="+r+"&term="+e.nowTerm._id;t+="&indicatorGroup="+e.nowQuotaGroup._id,t+=""==e.searchKeyWord||o?"&teacherGroup="+e.nowTeacherGroup._id+"&export="+e.nowQuotaGroup.name+"报表":"&teacherName="+e.searchKeyWord+"&export="+e.searchKeyWord+"报表",window.location.href=t},e.isShow=function(o){if("report"===o){var r=e.getMode();if(e.reportMode="summary","report"===r&&("summary"==e.reportMode||"group"==e.reportMode))return!0}return!1},e.showReport=function(o){switch(e.reportMode="user",o){case 0:e.$emit(s),e.reportSMode="teacher";break;case 1:e.$emit(l),e.reportSMode="student";break;case 2:e.reportSMode="oneuse"}p()},e.showOneReport=function(o){e.nowTeacher={teacherId:o.teacherId,teacherName:o.teacherName},e.reportMode="show",e.reportSMode="oneuse",p()}}]),angular.module("ov.controllers.reportmore",["ov.constant","ov.services.report"]).controller("reportMoreController",["$rootScope","$scope",function(){}]),angular.module("ov.controllers.reportinfo",["ov.constant","ov.services.report"]).controller("reportInfoController",["$rootScope","$scope",function(){}]),angular.module("ov.controllers.toolbar",["ov.constant","ov.services.utils","ov.services.login"]).controller("toolbarController",["$rootScope","$scope","Util","loginService",function(e,o,r,t){console.log("load toolbarController"),r.cookie.get("skey")||(console.log("not login"),t.teacherLogin())}]),angular.module("ov.controllers.teacher",["ov.constant","ov.services.teacher"]).controller("teacherController",["$rootScope","$scope","teacherService","STATUS.TERM.LOAD","STATUS.TEACHERGROUP.CHANGE",function(e,o,r,t,n){console.log("load teacherController"),e.teacherList=[],e.teacherGroup=[],e.teacherGroupMap={},e.nowTeacherGroup={},$("#importTeacher").bind("change",function(){var o=$(this)[0].files[0],t=new FormData;t.append("file",o),t.append("term",e.nowTerm._id),e.nowTerm._id&&r.importTeacher(t)}),$("#importTeacherGroup").bind("change",function(){var o=$(this)[0].files[0],t=new FormData;t.append("file",o),t.append("term",e.nowTerm._id),e.nowTerm._id&&r.importTeacherGroup(t)}),e.changeTeacherGroup=function(o){e.nowTeacherGroup=e.teacherGroupMap[o],e.$emit(n)},e.$on(t,function(){r.getTeacherGroupList()})}]),angular.module("ov.controllers.user",["ov.constant","ov.services.utils","ov.services.user"]).controller("userController",["$rootScope","$scope","$location","Util","userService","STATUS.USER.LOAD",function(e,o,r,t,n,i){console.log("load userController"),e.my={},e.userList=[],n.getUserInfo(),e.showManage=function(){$("#authManage").modal("show")},e.setAuth=function(e,o,r){var t={id:e,role:o,_id:r};n.setAuth(t)},e.quitLogin=function(){console.log(2222),n.logout()},e.import71=function(){n.importUser()},e.showUser=function(e){console.log(e)},e.$on(i,function(){var o=e.my.role,t=r.absUrl();return 1&o||2&o?void(t.indexOf("overall.html")<0&&(window.location.href="/overall.html")):(4&o&&t.indexOf("import.html")<0&&(window.location.href="/import.html"),8&o&&t.indexOf("index.html")<0&&(window.location.href="/index.html"),void(22&o&&t.indexOf("mange.html")<0&&(window.location.href="/mange.html")))})}]),angular.module("ov.controllers.index",["ov.constant","ov.services.quota"]).controller("indexController",["$rootScope","$scope","$location",function(e,o,r){console.log("load indexController"),e.myInfo={},e.gradelist=[],e.teacherGroup={0:"班主任",1:"科任老师",2:"行政员工"},e.switchMode=function(t){t!==o.getMode()&&("report"===t&&(e.reportMode="summary"),r.search("mode",t))},e.getMode=function(){return r.search().mode||!1}}]),angular.module("ov.controllers.msg",["ov.constant"]).controller("msgController",["$rootScope","$scope","$location","MSG.ERROR.CODE",function(e,o,r,t){console.log("load msgcontroller"),Messenger().options={extraClasses:"messenger-fixed messenger-on-bottom",theme:"flat"};var n=(r.absUrl(),{0:"操作成功!",1001:"您还没有登录!",1004:"没有找到资源!",1010:"您没有查看该资源的权限!",1011:"参数出错啦!",1013:"出错啦",1014:"同名啦,请修改名称!",1015:"已经归档啦!",1016:"该资源不能删除",1017:"该目录下还有其他文件，无法删除!",1041:"用户名或密码错误!",1043:"用户不存在!",1050:"时间交叉了!"});e.$on(t,function(e,o){if(1001===o){var r="/api/login";return void(location.href=r)}var t={message:n[o]};parseInt(o)&&(t.type="error"),Messenger().post(t)})}]),function(){angular.module("index",["ov.controllers.report","ov.controllers.reportmore","ov.controllers.reportinfo","ov.controllers.toolbar","ov.controllers.relat","ov.controllers.term","ov.controllers.teacher","ov.controllers.user","ov.controllers.index","ov.controllers.import","ov.controllers.msg"])}();