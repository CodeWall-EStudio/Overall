angular.module("ov.services.import",["ov.constant","ov.services.utils"]).service("importService",["$rootScope","$location","$http",function(){var e=function(e,o,t){{var r=(new Date).getTime(),r=(new Date).getTime();Util.object.toUrlencodedString(e)}Http.get("/api/indicator/list?_="+r+"&indicatorGroup="+e.indicatorGroup,null,{responseType:"json"}).success(function(e,t){0===e.code?(console.log("拉学生列表成功!",e),Root.$emit("status.student.load")):Root.$emit("msg.codeshow",e.code),o&&o(e,t)}).error(function(e,o){t&&t(e,o)})};return{getQuotaList:e}}]),angular.module("ov.services.quota",["ov.constant","ov.services.utils"]).service("quotaService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.QUOTA.LOAD",function(e,o,t,r,n,i){var s=function(o){o=o||0,e.quotaGroupList.length&&(e.nowQuotaGroup=e.quotaGroupList[o],e.$emit(i))},c=function(){var o="/api/indicatorgroup/list?term="+e.nowTerm._id,r=(new Date).getTime();t.get(o+"&t="+r,null,{responseType:"json"}).success(function(o){console.log("拉取指标组成功！",o.result),0===o.err?(e.quotaGroupList=o.result,_.each(o.result,function(o){e.quotaGroupMap[o._id]=o}),s()):e.$emit(n,o.err)}).error(function(){})},a=function(o,i,s){var c=(new Date).getTime(),a=r.object.toUrlencodedString(e.newQuotaGroup);t.post("/api/indicatorgroup/create?_="+c,a,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,t){console.log(o),0===o.err&&(e.quotaGroupList.push(o.result),e.quotaGroupMap[o.result._id]=o.result,console.log("新建指标组成功!",o)),e.$emit(n,o.err),i&&i(o,t)}).error(function(e,o){s&&s(e,o)})},u=function(){return},l=function(){},p=function(o,r,i){var s=(new Date).getTime();t.get("/api/indicator/list?_="+s+"&indicatorGroup="+o.indicatorGroup,null,{responseType:"json"}).success(function(o,t){0===o.err?(e.quotaList=o.result,console.log(e.quotaList),console.log("拉指标列表成功!",o)):e.$emit(n,o.err),r&&r(o,t)}).error(function(e,o){i&&i(e,o)})},d=function(e){var o=((new Date).getTime(),"/api/indicator/import"),t=new XMLHttpRequest;t.addEventListener("load",function(){try{var e=JSON.parse(t.responseText);console.log(e)}catch(o){}}),t.addEventListener("error",function(e){console.log("error",e)}),t.open("POST",o),t.send(e)},v=function(e){var o=((new Date).getTime(),"/api/indicatorscore/import"),t=new XMLHttpRequest;t.addEventListener("load",function(){try{var e=JSON.parse(t.responseText);console.log(e)}catch(o){}}),t.addEventListener("error",function(e){console.log("error",e)}),t.open("POST",o),t.send(e)},m=function(o,t,r){var n=e.quotaGroupMap[o].indicators,i=_.sortBy(n,function(e){return r?(console.log("-",e,t),-e[t]):(console.log("+",e,t),+e[t])});e.quotaGroupMap[o].indicators=i};return{setDefQuotaGroup:s,getQuotaGroup:c,createQuotaGroup:a,getQuotaList:p,importQuota:d,importQuotaScore:v,orderQuotaGroup:m,getQuotaScore:u,setQuotaScore:l}}]),angular.module("ov.services.student",["ov.constant","ov.services.utils"]).service("studentService",["$rootScope","$location","$http",function(e,o,t){var r=function(e){var o=((new Date).getTime(),"/api/student/import"),t=new XMLHttpRequest;t.addEventListener("load",function(){try{var e=JSON.parse(t.responseText);console.log(e)}catch(o){}}),t.addEventListener("error",function(e){console.log("error",e)}),t.open("POST",o),t.send(e)},n=function(o){var r=(new Date).getTime(),n="/api/student/list?term="+e.nowTerm._id;o=o||{},o.grade&&(n+="&grade="+o.grade),o.cls&&(n+="&cls="+o.cls),t.get(n+"&t="+r,null,{responseType:"json"}).success(function(o){0===o.err?(console.log("拉学生列表成功",o),e.studentList=o.result):e.$emit(MSG,o.err)}).error(function(){})},i=function(o,t){var r=e.studentList,n=_.sortBy(r,function(e){return t?-e[o]:+e[o]});e.studentList=n};return{importStudent:r,getStudentList:n,orderStudent:i}}]),angular.module("ov.services.teacher",["ov.constant","ov.services.utils"]).service("teacherService",["$rootScope","$location","$http",function(e,o,t){var r=function(e){var o=((new Date).getTime(),"/api/teachergroup/import"),t=new XMLHttpRequest;t.addEventListener("load",function(e){console.log(e);try{var o=JSON.parse(t.responseText);console.log(o)}catch(e){}}),t.addEventListener("error",function(e){console.log("error",e)}),t.open("POST",o),t.send(e)},n=function(e){var o=((new Date).getTime(),"/api/teacher/import"),t=new XMLHttpRequest;t.addEventListener("load",function(){try{var e=JSON.parse(t.responseText);console.log(e)}catch(o){}}),t.addEventListener("error",function(e){console.log("error",e)}),t.open("POST",o),t.send(e)},i=function(){var o="/api/teachergroup/list?term="+e.nowTerm._id,r=(new Date).getTime();t.get(o+"&t="+r,null,{responseType:"json"}).success(function(o){console.log("拉取老师分组成功！",o.result),0===o.err?(e.teacherGroup=o.result,e.teacherGroup.length>0&&(e.nowTeacherGroup=e.teacherGroup[0]),_.each(o.result,function(o){e.teacherGroupMap[o._id]=o})):e.$emit(MSG,o.err)}).error(function(){})};return{getTeacherGroupList:i,importTeacherGroup:r,importTeacher:n}}]),angular.module("ov.services.question",["ov.constant","ov.services.utils"]).service("questionService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.QUEST.LOAD",function(e,o,t,r,n,i){function s(){e.nowQuestScore.scoremap={},e.nowQuestScore.detail?_.each(e.nowQuestScore.questionnaire.questions,function(o,t){e.nowQuestScore.scoremap[o._id]={score:e.nowQuestScore.detail.scores[t].score,name:o.name,desc:o.desc,max:o.score,_id:o._id}}):_.each(e.nowQuestScore.questionnaire.questions,function(o){e.nowQuestScore.scoremap[o._id]={score:0,name:o.name,desc:o.desc,max:o.score,_id:o._id}})}var c=function(e){var o=((new Date).getTime(),"/api/questionnaire/import"),t=new XMLHttpRequest;t.addEventListener("load",function(){try{var e=JSON.parse(t.responseText);console.log(e)}catch(o){}}),t.addEventListener("error",function(e){console.log("error",e)}),t.open("POST",o),t.send(e)},a=function(o,i,s){var c=(new Date).getTime(),a=r.object.toUrlencodedString(o);t.post("/api/questionnaire/create?_="+c,a,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,t){console.log(o),0===o.err?(e.questionList.push(o.result),console.log("新建问卷成功!",o)):e.$emit(n,o.err),i&&i(o,t)}).error(function(e,o){s&&s(e,o)})},u=function(o){o=o||{};var r="/api/questionnaire/list?term="+e.nowTerm._id;o.order&&(r+="&order="+o.order);var s=(new Date).getTime();t.get(r+"&t="+s,null,{responseType:"json"}).success(function(o){console.log("拉取问卷分组成功！",o.result),0===o.err?(e.questionList=o.result,e.questionList.length>0&&(e.nowQuestion=e.questionList[0]),e.$emit(i)):e.$emit(n,o.err)}).error(function(){})},l=function(o){var r="/api/evaluation/detail?term="+e.nowTerm._id;o.appraiseeId&&(r+="&appraiseeId="+o.appraiseeId),"undefined"!=typeof o.evaluationType&&(r+="&evaluationType="+o.evaluationType);var c=(new Date).getTime();t.get(r+"&t="+c,null,{responseType:"json"}).success(function(o){console.log("拉取打分结果成功！",o.result),0===o.err?(e.nowQuestScore=o.result,s(),console.log(e.nowQuestScore),e.$emit(i)):e.$emit(n,o.err)}).error(function(){})},p=function(o){var i="/api/evaluation/appraise?term="+e.nowTerm._id,s=(new Date).getTime(),c=r.object.toUrlencodedString(o);t.post(i+"&_="+s,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o){0===o.err,e.$emit(n,o.err)}).error(function(){})};return{getQuestionList:u,importQuestion:c,getOneUserScore:l,saveScores:p,createQuestion:a}}]),angular.module("ov.services.relat",["ov.constant","ov.services.utils"]).service("relatService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.GROUP.LOAD",function(e,o,t,r,n){function i(){var o=e.relatList[0]||!1;if(o){var t=o.teachers;_.each(t,function(o){e.relatTdList.push(o.name)})}}var s=function(o){var t=((new Date).getTime(),"/api/relationship/import"),r=new XMLHttpRequest;r.addEventListener("load",function(){try{var o=JSON.parse(r.responseText);e.relatList=o.result,console.log("导入成功",o)}catch(t){}}),r.addEventListener("error",function(e){console.log("error",e)}),r.open("POST",t),r.send(o)},c=function(o,r,s){var c=(new Date).getTime();t.get("/api/relationship/list?_="+c+"&term="+e.nowTerm._id,null,{responseType:"json"}).success(function(o,t){0===o.err?(e.relatList=o.result,0===e.relatTdList.length&&i(),e.nowTeacher&&e.nowTeacher.teacherId&&(e.teacherRelatList=_.find(e.relatList,function(o){return o.id===e.nowTeacher.teacherId})),console.log("拉互评关系列表成功!",o)):e.$emit(n,o.err),r&&r(o,t)}).error(function(e,o){s&&s(e,o)})},a=function(o,r,i){var s=(new Date).getTime();t.get("/api/evaluation/appraisees?_="+s+"&term="+e.nowTerm._id+"&evaluationType="+o.evaluationType,null,{responseType:"json"}).success(function(o,t){0===o.err?(e.overList=o.result,console.log("拉互评关系列表成功!",o)):e.$emit(n,o.err),r&&r(o,t)}).error(function(e,o){i&&i(e,o)})};return{importRelat:s,getOverList:a,getRelatList:c}}]),angular.module("ov.services.user",["ov.constant","ov.services.utils"]).service("userService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.USER.LOAD",function(e,o,t,r,n,i){function s(){var o="/api/user/info";t.get(o,null,{responseType:"json"}).success(function(o){0===o.err?(e.my=o.result,e.$emit(i)):e.$emit(n,o.err)}).error(function(){})}function c(){location.href="/api/login/logout"}function a(o,r,i){o=o||{};var s=(new Date).getTime(),c="/api/user/search?_="+s;o.keyword&&(c+="&=keyword="+o.keyword),t.get(c,null,{responseType:"json"}).success(function(o,t){0===o.err?(e.userList=o.result,console.log("搜索用户成功",o.result)):e.$emit(n,o.err),r&&r(o,t)}).error(function(e,o){i&&i(e,o)})}function u(){var o="/api/user/import";t.get(o,null,{responseType:"json"}).success(function(o){e.$emit(n,o.err)}).error(function(){})}function l(o,i,s){var c=(new Date).getTime(),a=r.object.toUrlencodedString(o);t.post("/api/user/auth?_="+c,a,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(t,r){if(console.log(t),0===t.err){console.log("设置权限成功!",t);var s=_.find(e.userList,function(e){return e._id==o._id});s.role=o.role}e.$emit(n,t.err),i&&i(t,r)}).error(function(e,o){s&&s(e,o)})}return{getUserInfo:s,importUser:u,logout:c,setAuth:l,searchUser:a}}]),angular.module("ov.services.utils",[]).service("Util",[function(){var e={object:{toUrlencodedString:function(e){return _.map(e,function(e,o){return encodeURIComponent(o)+"="+encodeURIComponent(e)}).join("&")}},getParameter:function(e){var o=new RegExp("(\\?|#|&)"+e+"=([^&#]*)(&|#|$)"),t=location.href.match(o);return decodeURIComponent(t?t[2]:"")},cookie:{get:function(e){var o=document.cookie.split("; "),t=_.reduce(o,function(e,o){var t=o.split("=");return e[t[0]]=t[1],e},{});return t[e]},set:function(e){var o=null;if(document.cookie&&""!=document.cookie)for(var t=document.cookie.split(";"),r=0;r<t.length;r++){var n=$.trim(t[r]);if(n.substring(0,e.length+1)==e+"="){o=decodeURIComponent(n.substring(e.length+1));break}}return o}},time:{timezoneOffset:(new Date).getTimezoneOffset(),dateToDatetimePickerValue:function(o,t){return o||(o=new Date),o.setMinutes(o.getMinutes()-e.time.timezoneOffset),t||(o.setSeconds(0),o.setMilliseconds(0)),o.toISOString().split(".")[0]},datetimePickerValueToTs:function(o){if(o){var t=o.split(":").length<3?":00.000Z":".000Z",r=Date.parse(o+t)+60*e.time.timezoneOffset*1e3;return console.log(o,r,new Date(r)),r}return 0}}};return e}]),angular.module("ov.controllers.nav",["ov.constant"]).controller("navController",["$rootScope","$scope",function(){console.log("load navController")}]),angular.module("ov.controllers.toolbar",["ov.constant","ov.services.utils","ov.services.login"]).controller("toolbarController",["$rootScope","$scope","Util","loginService",function(e,o,t,r){console.log("load toolbarController"),t.cookie.get("skey")||(console.log("not login"),r.teacherLogin())}]),angular.module("ov.controllers.import",["ov.constant","ov.services.quota"]).controller("quotaController",["$rootScope","$scope","quotaService","STATUS.TERM.LOAD","STATUS.QUOTA.LOAD","STATUS.QUOTAGROUP.CHANGE",function(e,o,t,r,n,i){console.log("load quotaController"),e.quotaGroupList=[],e.quotaGroupMap={},e.nowQuotaGroup={},e.quotaList=[],e.newQuotaGroup={},e.quotaScoreList={},o.quotaOrder={name:0,order:0,gatherType:0,score:0},o.quotaScoreOrder={},o.orderQuotaGroup=function(r){o.quotaOrder[r]=!o.quotaOrder[r],t.orderQuotaGroup(e.nowQuotaGroup._id,r,o.quotaOrder[r]),$("#newQuotaGroup").modal("hide")},o.orderQuotaScore=function(){o.quotaScoreOrder[name]=!o.quotaScoreOrder[name]},$("#importFile").bind("change",function(){var o=$(this)[0].files[0],r=new FormData;r.append("file",o),r.append("indicatorGroup",e.nowQuotaGroup._id),console.log(e.nowQuotaGroup),e.nowQuotaGroup._id&&t.importQuota(r)}),$("#importQuotaScore").bind("change",function(){var o=$(this)[0].files[0],r=new FormData;r.append("file",o),r.append("indicatorGroup",e.nowQuotaGroup._id),e.nowQuotaGroup._id&&t.importQuotaScore(r)}),e.selectQuotaGroup=function(r){t.setDefQuotaGroup(r);var n=e.nowQuotaGroup.indicators.length;o.quotaScoreOrder={};for(var s=0;n>s;s++)o.quotaScoreOrder[s]=0;e.$emit(i)},e.editQuotaGroup=function(){},e.createQuotaGroup=function(){},e.createNewQuotaGroup=function(){e.newQuotaGroup.term=e.nowTerm._id,t.createQuotaGroup()},e.$on(r,function(){t.getQuotaGroup()}),e.$on(n,function(){})}]),angular.module("ov.controllers.student",["ov.constant","ov.services.student"]).controller("studentController",["$rootScope","$scope","studentService","STATUS.TERM.LOAD",function(e,o,t,r){console.log("load studentController"),e.studentList=[],e.nowStudent={},o.studentOrder={name:0,id:0,grade:0,"class":0},o.orderStudent=function(e){o.studentOrder[e]=!o.studentOrder[e],t.orderStudent(e,o.studentOrder[e])},$("#importStudent").bind("change",function(){var o=$(this)[0].files[0],r=new FormData;r.append("file",o),r.append("term",e.nowTerm._id),e.nowQuotaGroup._id&&t.importStudent(r)}),e.$on(r,function(){t.getStudentList()})}]),angular.module("ov.controllers.teacher",["ov.constant","ov.services.teacher"]).controller("teacherController",["$rootScope","$scope","teacherService","STATUS.TERM.LOAD","STATUS.TEACHERGROUP.CHANGE",function(e,o,t,r,n){console.log("load teacherController"),e.teacherList=[],e.teacherGroup=[],e.teacherGroupMap={},e.nowTeacherGroup={},$("#importTeacher").bind("change",function(){var o=$(this)[0].files[0],r=new FormData;r.append("file",o),r.append("term",e.nowTerm._id),e.nowTerm._id&&t.importTeacher(r)}),$("#importTeacherGroup").bind("change",function(){var o=$(this)[0].files[0],r=new FormData;r.append("file",o),r.append("term",e.nowTerm._id),e.nowTerm._id&&t.importTeacherGroup(r)}),e.changeTeacherGroup=function(o){e.nowTeacherGroup=e.teacherGroupMap[o],e.$emit(n)},e.$on(r,function(){t.getTeacherGroupList()})}]),angular.module("ov.controllers.question",["ov.constant","ov.services.question"]).controller("questionController",["$rootScope","$scope","questionService","STATUS.TERM.LOAD",function(e,o,t,r){console.log("load questionController"),e.nowQuestion={},e.questionList=[],e.questionName="",e.questionOrder=1,o.questionOrder={name:0,order:0,desc:0,score:0},$("#importQuestion").bind("change",function(){var o=$(this)[0].files[0],r=new FormData;r.append("file",o),r.append("questionnaire",e.nowQuestion._id),e.nowQuotaGroup._id&&t.importQuestion(r)}),e.createQuestion=function(){e.questionName="",e.questionOrder=1,$("#newQuestion").modal("show")},e.createNewQuestion=function(){var o={term:e.nowTerm._id,name:$("#questionName").val(),order:$("#questionOrder").val()};t.createQuestion(o)},e.changeQuestion=function(o){console.log(o),e.nowQuestion=_.find(e.questionList,function(e){return e._id==o})},e.$on(r,function(){t.getQuestionList()})}]),angular.module("ov.controllers.relat",["ov.constant","ov.services.relat","ov.services.question"]).controller("relatController",["$rootScope","$scope","relatService","questionService","STATUS.TERM.LOAD","STATUS.LOGIN.STUDENT","STATUS.LOGIN.TEACHER","STATUS.QUEST.LOAD","STATUS.RELAT.GET",function(e,o,t,r,n,i,s,c,a){function u(){var e=[];return _.each(o.nowScores,function(o,t){e.push({question:t,score:o.score})}),e}function l(){o.nowScores={},o.allScore=0;try{_.each(e.nowQuestScore.scoremap,function(e){o.nowScores[e._id]={max:e.max,score:e.score},o.allScore+=e.score}),console.log(o.nowScores)}catch(t){}}console.log("load relatController"),e.relatList=[],e.relatTdList=[],e.overList=[],e.nowQuestScore,e.nowOverType=0,o.nowName="",o.nowId="",o.nowQuestionOrder=0,o.nowScores={},o.allScore=0,$("#importRelat").bind("change",function(){var o=$(this)[0].files[0],r=new FormData;r.append("file",o),r.append("term",e.nowTerm._id),e.nowTerm._id&&t.importRelat(r)}),o.getQuestion=function(t,n,i){o.nowName=n,o.nowId=i,r.getOneUserScore({appraiseeId:i,evaluationType:e.nowOverType}),o.nowQuestionOrder=t},o.addScore=function(e){o.nowScores[e]&&o.nowScores[e].score<o.nowScores[e].max&&(o.nowScores[e].score++,o.allScore++)},o.removeScore=function(e){o.nowScores[e]&&o.nowScores[e].score>0&&(o.nowScores[e].score--,o.allScore--)},o.resetScore=function(){l()},o.saveScore=function(){var t={appraiseeId:o.nowId,evaluationType:e.nowOverType,questionnaire:e.nowQuestScore.questionnaire._id,scores:JSON.stringify(u())};r.saveScores(t)},e.$on(i,function(){e.nowOverType=1,t.getRelatList(),t.getOverList({evaluationType:1})}),e.$on(s,function(){e.nowOverType=0,t.getRelatList(),t.getOverList({evaluationType:0})}),e.$on(a,function(){0===e.relatList.length&&t.getRelatList()}),e.$on(c,function(){l()})}]),angular.module("ov.controllers.manage",["ov.constant","ov.services.quota"]).controller("manageController",["$rootScope","$scope","$location","quotaService","STATUS.GROUP.LOAD",function(e,o,t){console.log("load manageController"),o.switchMode=function(e){console.log(e,o.getMode()),e!==o.getMode()&&t.search("mode",e)},o.getMode=function(){return t.search().mode||!1}}]),angular.module("ov.controllers.user",["ov.constant","ov.services.utils","ov.services.user"]).controller("userController",["$rootScope","$scope","Util","userService","STATUS.USER.LOAD",function(e,o,t,r,n){console.log("load userController"),e.my={},e.userList=[],r.getUserInfo(),e.showManage=function(){$("#authManage").modal("show")},e.setAuth=function(e,o,t){var n={id:e,role:o,_id:t};r.setAuth(n)},e.quitLogin=function(){console.log(2222),r.logout()},e.import71=function(){r.importUser()},e.showUser=function(e){console.log(e)},e.$on(n,function(){r.searchUser()})}]),angular.module("ov.controllers.msg",["ov.constant"]).controller("msgController",["$rootScope","$scope","$location","MSG.ERROR.CODE",function(e,o,t,r){console.log("load msgcontroller"),Messenger().options={extraClasses:"messenger-fixed messenger-on-bottom",theme:"flat"};var n=(t.absUrl(),{0:"操作成功!",1001:"您还没有登录!",1004:"没有找到资源!",1010:"您没有查看该资源的权限!",1011:"参数出错啦!",1013:"出错啦",1014:"同名啦,请修改名称!",1015:"已经归档啦!",1016:"该资源不能删除",1017:"该目录下还有其他文件，无法删除!",1041:"用户名或密码错误!",1043:"用户不存在!",1050:"时间交叉了!"});e.$on(r,function(e,o){if(1001===o){var t="/api/login";return void(location.href=t)}var r={message:n[o]};parseInt(o)&&(r.type="error"),Messenger().post(r)})}]),function(){angular.module("manage",["ov.controllers.relat","ov.controllers.term","ov.controllers.user","ov.controllers.toolbar","ov.controllers.import","ov.controllers.question","ov.controllers.teacher","ov.controllers.student","ov.controllers.msg","ov.controllers.manage"])}();