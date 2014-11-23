angular.module("ov.constant",[]).constant("MSG.ERROR.CODE","msg.codeshow").constant("LOGINED","status.logined").constant("STATUS.QUEST.LOAD","status.quest.load").constant("STATUS.USER.LOAD","status.user.load").constant("STATUS.LOGIN.STUDENT","status.login.student").constant("STATUS.LOGIN.TEACHER","status.login.TEACHER").constant("STATUS.QUOTA.LOAD","status.quota.load").constant("STATUS.TERM.LOAD","status.term.load").constant("STATUS.GRADE.CHANGE","status.grade.change").constant("STATUS.RELAT.GET","status.relat.get").constant("STATUS.STUDENT.GET","status.student.get").constant("STATUS.TERM.CHANGE","status.term.change").constant("STATUS.TEACHERGROUP.CHANGE","status.teachergroup.change").constant("STATUS.TEACHERGROUP.LOAD","status.teachergroup.load").constant("STATUS.QUOTAGROUP.CHANGE","status.quotagroup.change").constant("STATUS.GROUP.CHANGE","status.group.change").constant("STATUS.GROUP.LOAD","status.group.load").constant("STATUS.TABLE.CHANGE","status.table.change"),angular.module("ov.services.term",["ov.constant","ov.services.utils"]).service("termService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.TERM.LOAD",function(e,o,t,n,r,i){function s(o){if(o)_.each(e.termList,function(t){return t._id===o?void(e.nowTerm=t):void 0});else{var t=e.termList[0];_.each(e.termList,function(e){1===e.status&&(t=e)}),e.nowTerm=t}}function a(o){return o?_.find(e.termList,function(e){return e._id==o}):!1}function c(o){_.each(e.termList,function(t,n){t._id===o._id&&(e.termList[n]=o)})}function u(o){var t=[];_.each(e.termList,function(e){e._id!==o&&t.push(e)}),e.termList=t}var l=function(o,i,s){var a=(new Date).getTime(),c=n.object.toUrlencodedString(o);t.post("/api/term/create?_="+a,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,t){console.log(o),0===o.err&&(e.termList.push(o.result),0===e.termList.length&&(e.nowTerm=o.result),console.log("新建学期成功!",o)),e.$emit(r,o.err),i&&i(o,t)}).error(function(e,o){s&&s(e,o)})},d=function(o,i,s){var a=(new Date).getTime(),u=n.object.toUrlencodedString(o);t.post("/api/term/modify?_="+a,u,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,t){0===o.err&&(c(o.result),console.log("新建学期成功!",o)),e.$emit(r,o.err),i&&i(o,t)}).error(function(e,o){s&&s(e,o)})},p=function(o,i,s){var a=(new Date).getTime(),c=n.object.toUrlencodedString(o);t.post("/api/term/delete?_="+a,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(t,n){0===t.err&&(console.log("删除学期成功!",t),u(o.term)),e.$emit(r,t.err),i&&i(t,n)}).error(function(e,o){s&&s(e,o)})},m=function(o,a,c){{var u=(new Date).getTime();n.object.toUrlencodedString(e.param)}t.get("/api/term/list?_="+u,null,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,t){0===o.err?(e.termList=o.result,s(),e.$emit(i),console.log("拉学期成功!",o.result)):e.$emit(r,o.err),a&&a(o,t)}).error(function(e,o){c&&c(e,o)})};return{getTermList:m,createTerm:l,modifyTerm:d,delTerm:p,changeDefTerm:s,getOneTerm:a}}]),angular.module("ov.services.import",["ov.constant","ov.services.utils"]).service("importService",["$rootScope","$location","$http",function(){var e=function(e,o,t){{var n=(new Date).getTime(),n=(new Date).getTime();Util.object.toUrlencodedString(e)}Http.get("/api/indicator/list?_="+n+"&indicatorGroup="+e.indicatorGroup,null,{responseType:"json"}).success(function(e,t){0===e.code?(console.log("拉学生列表成功!",e),Root.$emit("status.student.load")):Root.$emit("msg.codeshow",e.code),o&&o(e,t)}).error(function(e,o){t&&t(e,o)})};return{getQuotaList:e}}]),angular.module("ov.services.login",["ov.constant","ov.services.utils"]).service("loginService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","LOGINED",function(e,o,t,n,r){function i(){var e="/api/login";location.href=e}function s(o,i,s){var a=(new Date).getTime(),c=n.object.toUrlencodedString(o);t.post("/api/login/student?_="+a,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,t){0===o.err?window.location="/overall.html":e.$emit(r,o.err),i&&i(o,t)}).error(function(e,o){s&&s(e,o)})}return{teacherLogin:i,studentLogin:s}}]),angular.module("ov.services.quota",["ov.constant","ov.services.utils"]).service("quotaService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.QUOTA.LOAD",function(e,o,t,n,r,i){function s(o){var t=_.find(e.quotaGroupList,function(e){return e._id==o.indicatorgroup});t.name=o.name}var a=function(o,t){o=o||0,e.quotaGroupList.length&&(e.nowQuotaGroup=e.quotaGroupList[o],o||(e.$emit(i),t&&8===e.my.role&&(e.nowQuotaGroup=e.defQuota),console.log("quota_load")))},c=function(){var o="/api/indicatorgroup/list?term="+e.nowTerm._id,n=(new Date).getTime();t.get(o+"&t="+n,null,{responseType:"json"}).success(function(o){console.log("拉取指标组成功！",o.result),0===o.err?(e.quotaGroupList=o.result,_.each(o.result,function(o){e.quotaGroupMap[o._id]=o}),a(!1,!0)):e.$emit(r,o.err)}).error(function(){})},u=function(o,i,s){var a=(new Date).getTime(),c=n.object.toUrlencodedString(e.newQuotaGroup);t.post("/api/indicatorgroup/create?_="+a,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,t){console.log(o),0===o.err&&(e.quotaGroupList.push(o.result),e.quotaGroupMap[o.result._id]=o.result,e.nowQuotaGroup._id||(e.nowQuotaGroup=o.result),console.log("新建指标组成功!",o)),e.$emit(r,o.err),i&&i(o,t)}).error(function(e,o){s&&s(e,o)})},l=function(o,i,a){var c=(new Date).getTime(),u=n.object.toUrlencodedString(o);t.post("/api/indicatorgroup/modify?_="+c,u,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(t,n){0===t.err&&(s(o),console.log("修改指标组成功!",t)),e.$emit(r,t.err),i&&i(t,n)}).error(function(e,o){a&&a(e,o)})},d=function(){return},p=function(){},m=function(o,n,i){var s=(new Date).getTime();t.get("/api/indicator/list?_="+s+"&indicatorGroup="+o.indicatorGroup,null,{responseType:"json"}).success(function(o,t){0===o.err?(e.quotaList=o.result,console.log(e.quotaList),console.log("拉指标列表成功!",o)):e.$emit(r,o.err),n&&n(o,t)}).error(function(e,o){i&&i(e,o)})},f=function(o){var t=((new Date).getTime(),"/api/indicator/import"),n=new XMLHttpRequest;n.addEventListener("load",function(){try{var o=JSON.parse(n.responseText);0===o.err&&c(),e.$emit(r,o.err),console.log(o)}catch(t){}}),n.addEventListener("error",function(e){console.log("error",e)}),n.open("POST",t),n.send(o)},T=function(o){var t=((new Date).getTime(),"/api/indicatorscore/import"),n=new XMLHttpRequest;n.addEventListener("load",function(){try{var o=JSON.parse(n.responseText);console.log("導入成功　",o),e.$emit(r,o.err)}catch(t){}}),n.addEventListener("error",function(e){console.log("error",e)}),n.open("POST",t),n.send(o)},g=function(o,t,n){var r=e.quotaGroupMap[o].indicators,i=_.sortBy(r,function(e){return n?(console.log("-",e,t),-e[t]):(console.log("+",e,t),+e[t])});e.quotaGroupMap[o].indicators=i};return{setDefQuotaGroup:a,getQuotaGroup:c,modifyQuotaGroup:l,createQuotaGroup:u,getQuotaList:m,importQuota:f,importQuotaScore:T,orderQuotaGroup:g,getQuotaScore:d,setQuotaScore:p}}]),angular.module("ov.services.student",["ov.constant","ov.services.utils"]).service("studentService",["$rootScope","$location","$http",function(e,o,t){var n=[],r=function(o){var t=((new Date).getTime(),"/api/student/import"),n=new XMLHttpRequest;n.addEventListener("load",function(){try{var o=JSON.parse(n.responseText);0===o.err&&i(),e.$emit(MSG,o.err),console.log(o)}catch(t){}}),n.addEventListener("error",function(e){console.log("error",e)}),n.open("POST",t),n.send(o)},i=function(o){var r=(new Date).getTime(),i="/api/student/list?term="+e.nowTerm._id;o=o||{},o.grade&&(i+="&grade="+o.grade),o.cls&&(i+="&cls="+o.cls),t.get(i+"&t="+r,null,{responseType:"json"}).success(function(o){0===o.err?(console.log("拉学生列表成功",o),e.studentList=o.result,n=o.result):e.$emit(MSG,o.err)}).error(function(){})},s=function(o,t){var n=e.studentList,r=_.sortBy(n,function(e){return t?-e[o]:+e[o]});e.studentList=r},a=function(){var o=[];o=e.nowGrade&&e.nowClass?_.filter(n,function(o){return o.grade===e.nowGrade&&o.class===e.nowClass}):e.nowGrade?_.filter(n,function(o){return o.grade===e.nowGrade}):_.filter(n,function(o){return o.class===e.nowClass}),e.studentList=o},c=function(){var o=[];console.log(e.studentKeyWord),_.each(e.studentList,function(t){t.name.indexOf(e.studentKeyWord)>=0&&o.push(t)}),e.studentList=o};return{searchStudent:c,filterStudent:a,importStudent:r,getStudentList:i,orderStudent:s}}]),angular.module("ov.services.teacher",["ov.constant","ov.services.utils"]).service("teacherService",["$rootScope","$location","$http","STATUS.TEACHERGROUP.LOAD",function(e,o,t,n){var r=function(o){var t=((new Date).getTime(),"/api/teachergroup/import"),n=new XMLHttpRequest;n.addEventListener("load",function(o){console.log(o);try{var t=JSON.parse(n.responseText);0===t.err&&s(),e.$emit(MSG,t.err),console.log(t)}catch(o){}}),n.addEventListener("error",function(e){console.log("error",e)}),n.open("POST",t),n.send(o)},i=function(o){var t=((new Date).getTime(),"/api/teacher/import"),n=new XMLHttpRequest;n.addEventListener("load",function(){try{var o=JSON.parse(n.responseText);console.log(o),0===o.err&&s(),e.$emit(MSG,o.err)}catch(t){}}),n.addEventListener("error",function(e){console.log("error",e)}),n.open("POST",t),n.send(o)},s=function(){var o="/api/teachergroup/list?term="+e.nowTerm._id,r=(new Date).getTime();t.get(o+"&t="+r,null,{responseType:"json"}).success(function(o){console.log("拉取老师分组成功！",o.result),0===o.err?(e.teacherGroup=o.result,e.teacherGroup.length>0&&(e.nowTeacherGroup=e.teacherGroup[0]),e.$emit(n),_.each(o.result,function(o){e.teacherGroupMap[o._id]=o})):e.$emit(MSG,o.err)}).error(function(){})};return{getTeacherGroupList:s,importTeacherGroup:r,importTeacher:i}}]),angular.module("ov.services.question",["ov.constant","ov.services.utils"]).service("questionService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.QUEST.LOAD",function(e,o,t,n,r,i){function s(o,t){_.each(e.overList,function(e){e.id==t.appraiseeId&&(e.totalScore=t.totalScore)})}function a(){e.nowQuestScore.scoremap={},e.nowQuestScore.detail?(console.log(e.nowQuestScore.detail.scores),_.each(e.nowQuestScore.questionnaire.questions,function(o){e.nowQuestScore.scoremap[o._id]&&(e.nowQuestScore.scoremap[o._id]={}),e.nowQuestScore.scoremap[o._id]={score:e.nowQuestScore.detail.scores[o._id].score,name:o.name,desc:o.desc,max:o.score,_id:o._id}})):_.each(e.nowQuestScore.questionnaire.questions,function(o){e.nowQuestScore.scoremap[o._id]&&(e.nowQuestScore.scoremap[o._id]={}),e.nowQuestScore.scoremap[o._id]={score:0,name:o.name,desc:o.desc,max:o.score,_id:o._id}})}function c(o,i,s){var a=(new Date).getTime(),c=n.object.toUrlencodedString(o);t.post("/api/questionnaire/modify?_="+a,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(t,n){0===t.err&&(u(o),console.log("修改卷成功!",t)),e.$emit(r,t.err),i&&i(t,n)}).error(function(e,o){s&&s(e,o)})}function u(o){var t=_.find(e.questionList,function(e){return e._id==o.questionnaire});t.name=o.name}var l=function(o){var t=((new Date).getTime(),"/api/questionnaire/import"),n=new XMLHttpRequest;n.addEventListener("load",function(){try{var o=JSON.parse(n.responseText);0===o.err&&(p(),e.$emit(r,o.err))}catch(t){}}),n.addEventListener("error",function(e){console.log("error",e)}),n.open("POST",t),n.send(o)},d=function(o,i,s){var a=(new Date).getTime(),c=n.object.toUrlencodedString(o);t.post("/api/questionnaire/create?_="+a,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(o,t){0===o.err&&(e.questionList.length||(e.nowQuestion=o.result),e.questionList.push(o.result),console.log("新建问卷成功!",o)),e.$emit(r,o.err),i&&i(o,t)}).error(function(e,o){s&&s(e,o)})},p=function(o){o=o||{};var n="/api/questionnaire/list?term="+e.nowTerm._id;o.order&&(n+="&order="+o.order);var s=(new Date).getTime();t.get(n+"&t="+s,null,{responseType:"json"}).success(function(o){console.log("拉取问卷分组成功！",o.result),0===o.err?(e.questionList=o.result,e.questionList.length>0&&!e.nowQuestion._id?e.nowQuestion=e.questionList[0]:e.nowQuestion._id&&(e.nowQuestion=_.find(e.questionList,function(o){return o._id===e.nowQuestion._id})),_.each(o.result,function(o){e.questionOrderMap[o.order]=o}),e.$emit(i)):e.$emit(r,o.err)}).error(function(){})},m=function(o){var n="/api/evaluation/detail?term="+e.nowTerm._id;o.appraiseeId&&(n+="&appraiseeId="+o.appraiseeId),"undefined"!=typeof o.evaluationType&&(n+="&evaluationType="+o.evaluationType);var s=(new Date).getTime();t.get(n+"&t="+s,null,{responseType:"json"}).success(function(o){console.log("拉取打分结果成功！",o.result),0===o.err?(e.nowQuestScore=o.result,a(),e.$emit(i)):e.$emit(r,o.err)}).error(function(){})},f=function(o){if(1!==e.nowTerm.status)return void e.$emit(r,12);var i="/api/evaluation/appraise?term="+e.nowTerm._id,a=(new Date).getTime(),c=n.object.toUrlencodedString(o);t.post(i+"&_="+a,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(t){0===t.err&&(s(o,t.result),console.log("评分成功",t.result)),e.$emit(r,t.err)}).error(function(){})};return{getQuestionList:p,importQuestion:l,getOneUserScore:m,saveScores:f,modifyQuestion:c,createQuestion:d}}]),angular.module("ov.services.relat",["ov.constant","ov.services.utils"]).service("relatService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.GROUP.LOAD",function(e,o,t,n,r){function i(){}function s(){var o=e.relatList[0]||!1;if(o){var t=o.teachers;_.each(t,function(o){e.relatTdList.push(o.name)})}}var a=function(o){var t=((new Date).getTime(),"/api/relationship/import"),n=new XMLHttpRequest;n.addEventListener("load",function(){try{var o=JSON.parse(n.responseText);console.log("导入成功",o),0===o.err&&c(),e.$emit(r,o.err)}catch(t){}}),n.addEventListener("error",function(e){console.log("error",e)}),n.open("POST",t),n.send(o)},c=function(o,n,i){var a=(new Date).getTime();t.get("/api/relationship/list?_="+a+"&term="+e.nowTerm._id,null,{responseType:"json"}).success(function(o,t){0===o.err?(e.relatList=o.result,0===e.relatTdList.length&&s(),e.nowTeacher&&e.nowTeacher.teacherId&&(e.teacherRelatList=_.find(e.relatList,function(o){return o.id===e.nowTeacher.teacherId})),console.log("拉互评关系列表成功!",o)):e.$emit(r,o.err),n&&n(o,t)}).error(function(e,o){i&&i(e,o)})},u=function(o,n,s){var a=(new Date).getTime();t.get("/api/evaluation/appraisees?_="+a+"&term="+e.nowTerm._id+"&evaluationType="+o.evaluationType,null,{responseType:"json"}).success(function(o,t){0===o.err?(e.overList=o.result,i(),console.log("拉互评关系列表成功@@!",o)):e.$emit(r,o.err),n&&n(o,t)}).error(function(e,o){s&&s(e,o)})};return{importRelat:a,getOverList:u,getRelatList:c}}]),angular.module("ov.services.user",["ov.constant","ov.services.utils"]).service("userService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.USER.LOAD",function(e,o,t,n,r,i){function s(){var o="/api/user/info";t.get(o,null,{responseType:"json"}).success(function(o){0===o.err?(e.my=o.result,console.log(e.my),e.$emit(i)):e.$emit(r,o.err)}).error(function(){})}function a(){location.href="/api/login/logout"}function c(o,n,i){o=o||{};var s=(new Date).getTime(),a="/api/user/search?_="+s;o.keyword&&(a+="&=keyword="+o.keyword),t.get(a,null,{responseType:"json"}).success(function(o,t){0===o.err?(e.userList=o.result,console.log("搜索用户成功",o.result)):e.$emit(r,o.err),n&&n(o,t)}).error(function(e,o){i&&i(e,o)})}function u(){var o="/api/user/import";t.get(o,null,{responseType:"json"}).success(function(o){e.$emit(r,o.err)}).error(function(){})}function l(o,i,s){var a=(new Date).getTime(),c=n.object.toUrlencodedString(o);t.post("/api/user/auth?_="+a,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(t,n){if(console.log(t),0===t.err){console.log("设置权限成功!",t);var s=_.find(e.userList,function(e){return e._id==o._id});s.role=o.role}e.$emit(r,t.err),i&&i(t,n)}).error(function(e,o){s&&s(e,o)})}return{getUserInfo:s,importUser:u,logout:a,setAuth:l,searchUser:c}}]),angular.module("ov.services.utils",[]).service("Util",[function(){var e={object:{toUrlencodedString:function(e){return _.map(e,function(e,o){return encodeURIComponent(o)+"="+encodeURIComponent(e)}).join("&")}},getParameter:function(e){var o=new RegExp("(\\?|#|&)"+e+"=([^&#]*)(&|#|$)"),t=location.href.match(o);return decodeURIComponent(t?t[2]:"")},cookie:{get:function(e){var o=document.cookie.split("; "),t=_.reduce(o,function(e,o){var t=o.split("=");return e[t[0]]=t[1],e},{});return t[e]},set:function(e){var o=null;if(document.cookie&&""!=document.cookie)for(var t=document.cookie.split(";"),n=0;n<t.length;n++){var r=$.trim(t[n]);if(r.substring(0,e.length+1)==e+"="){o=decodeURIComponent(r.substring(e.length+1));break}}return o}},time:{timezoneOffset:(new Date).getTimezoneOffset(),dateToDatetimePickerValue:function(o,t){return o||(o=new Date),o.setMinutes(o.getMinutes()-e.time.timezoneOffset),t||(o.setSeconds(0),o.setMilliseconds(0)),o.toISOString().split(".")[0]},datetimePickerValueToTs:function(o){if(o){var t=o.split(":").length<3?":00.000Z":".000Z",n=Date.parse(o+t)+60*e.time.timezoneOffset*1e3;return console.log(o,n,new Date(n)),n}return 0}}};return e}]),angular.module("ov.controllers.nav",["ov.constant"]).controller("navController",["$rootScope","$scope",function(){console.log("load navController")}]),angular.module("ov.controllers.term",["ov.constant","ov.services.term"]).controller("termController",["$rootScope","$scope","termService","STATUS.TERM.LOAD","STATUS.USER.LOAD","STATUS.TERM.CHANGE","MSG.ERROR.CODE",function(e,o,t,n,r,i,s){console.log("load termController"),e.termModalTit="新建学期",e.modifyTerm={},e.termList=[],e.nowTerm={},e.createTerm=function(){e.termModalTit="新建学期",e.modifyTerm={},$("#newTerm").modal("show")},e.modifyOneTerm=function(o){e.termModalTit="修改学期",e.modifyTerm={};var n=t.getOneTerm(o);$.extend(e.modifyTerm,n),$("#newTerm").modal("show")},e.changeTerm=function(o){t.changeDefTerm(o),e.$emit(i)},e.createNewTerm=function(){if("新建学期"===e.termModalTit)if(""!==e.modifyTerm.name){var o={name:e.modifyTerm.name};t.createTerm(o)}else e.$emit(s,11);else{var o={term:e.modifyTerm._id,name:e.modifyTerm.name,order:e.modifyTerm.order||0,status:e.modifyTerm.status};t.modifyTerm(o)}$("#newTerm").modal("hide")},e.deleteTerm=function(e){e&&t.delTerm({term:e})},e.changeTermStatus=function(o,n){e.modifyTerm={};var r=t.getOneTerm(o),i={term:r._id,name:r.name,order:r.order||0,status:n};t.modifyTerm(i)},e.$on(r,function(){t.getTermList()})}]),angular.module("ov.controllers.toolbar",["ov.constant","ov.services.utils","ov.services.login"]).controller("toolbarController",["$rootScope","$scope","Util","loginService",function(e,o,t,n){console.log("load toolbarController"),t.cookie.get("skey")||(console.log("not login"),n.teacherLogin())}]),angular.module("ov.controllers.import",["ov.constant","ov.services.quota"]).controller("quotaController",["$rootScope","$scope","quotaService","STATUS.TERM.LOAD","STATUS.QUOTA.LOAD","STATUS.QUOTAGROUP.CHANGE","STATUS.TERM.CHANGE",function(e,o,t,n,r,i,s){console.log("load quotaController"),e.quotaGroupList=[],e.quotaGroupMap={},e.nowQuotaGroup={},e.quotaList=[],e.newQuotaGroup={},e.modifyQuotaName="",e.modifyQuotaId="",e.quotaScoreList={},e.defQuota={name:"概要",_id:-1},e.nowDesc="",o.quotaOrder={name:0,order:0,gatherType:0,score:0},o.quotaScoreOrder={},o.orderQuotaGroup=function(n){o.quotaOrder[n]=!o.quotaOrder[n],t.orderQuotaGroup(e.nowQuotaGroup._id,n,o.quotaOrder[n]),$("#newQuotaGroupView").modal("hide")},o.orderQuotaScore=function(){o.quotaScoreOrder[name]=!o.quotaScoreOrder[name]},$("#importFile").bind("change",function(){var o=$(this)[0].files[0],n=new FormData;n.append("file",o),n.append("indicatorGroup",e.nowQuotaGroup._id),console.log(e.nowQuotaGroup),e.nowQuotaGroup._id&&t.importQuota(n)}),$("#importQuotaScore").bind("change",function(){var o=$(this)[0].files[0],n=new FormData;n.append("file",o),n.append("indicatorGroup",e.nowQuotaGroup._id),e.nowQuotaGroup._id&&t.importQuotaScore(n)}),e.selectQuotaGroup=function(n){if(0>n)return e.nowQuotaGroup=e.defQuota,void e.$emit(i,!0);t.setDefQuotaGroup(n);var r=e.nowQuotaGroup.indicators.length;o.quotaScoreOrder={};for(var s=0;r>s;s++)o.quotaScoreOrder[s]=0;e.$emit(i)},e.selectSearchQuotaGroup=function(){},e.showQuotaDesc=function(o,t,n){e.nowDesc=n},e.editQuotaGroup=function(){},e.createQuotaGroup=function(){},e.createNewQuotaGroup=function(){console.log(e.newQuotaGroup),e.newQuotaGroup.term=e.nowTerm._id,t.createQuotaGroup()},e.modifyQuota=function(o,t){e.modifyQuotaId=o,e.modifyQuotaName=t,$("#modifyQuota").modal("show")},e.modifyQuotaSub=function(){e.modifyQuotaName=$("#quotaModifyName").val(),t.modifyQuotaGroup({indicatorgroup:e.modifyQuotaId,name:e.modifyQuotaName})},e.$on(n,function(){t.getQuotaGroup()}),e.$on(s,function(){e.newQuotaGroup={},t.getQuotaGroup()}),e.$on(r,function(){})}]),angular.module("ov.controllers.student",["ov.constant","ov.services.student"]).controller("studentController",["$rootScope","$scope","studentService","STATUS.TERM.LOAD","STATUS.TERM.CHANGE",function(e,o,t,n,r){console.log("load studentController"),e.studentList=[],e.nowStudent={},e.nowGrade=0,e.nowClass=0,e.studentKeyWord="",e.gradeList=["全部年级","一年级","二年级","三年级","四年级","五年级","六年级"],e.classList=["全部班级","一班","二班","三班","四班","五班","六班","七班","八班","九班","十班","十一班","十二班"],o.studentOrder={name:0,id:0,grade:0,"class":0},o.orderStudent=function(e){o.studentOrder[e]=!o.studentOrder[e],t.orderStudent(e,o.studentOrder[e])},$("#importStudent").bind("change",function(){var o=$(this)[0].files[0],n=new FormData;n.append("file",o),n.append("term",e.nowTerm._id),e.nowQuotaGroup._id&&t.importStudent(n)}),e.changeGrade=function(o){e.nowGrade=o,t.filterStudent()},e.changeClass=function(o){e.nowClass=o,t.filterStudent()},e.studentSearch=function(){e.studentKeyWord=$("#studentKey").val(),t.searchStudent()},e.$on(n,function(){t.getStudentList()}),e.$on(r,function(){t.getStudentList()})}]),angular.module("ov.controllers.teacher",["ov.constant","ov.services.teacher"]).controller("teacherController",["$rootScope","$scope","teacherService","STATUS.TERM.LOAD","STATUS.TEACHERGROUP.CHANGE","STATUS.TERM.CHANGE",function(e,o,t,n,r,i){console.log("load teacherController"),e.teacherList=[],e.teacherGroup=[],e.teacherGroupMap={},e.nowTeacherGroup={},$("#importTeacher").bind("change",function(){var o=$(this)[0].files[0],n=new FormData;n.append("file",o),n.append("term",e.nowTerm._id),e.nowTerm._id&&t.importTeacher(n)}),$("#importTeacherGroup").bind("change",function(){var o=$(this)[0].files[0],n=new FormData;n.append("file",o),n.append("term",e.nowTerm._id),e.nowTerm._id&&t.importTeacherGroup(n)}),e.changeTeacherGroup=function(o){e.nowTeacherGroup=e.teacherGroupMap[o],e.$emit(r)},e.$on(n,function(){t.getTeacherGroupList()}),e.$on(i,function(){t.getTeacherGroupList()})}]),angular.module("ov.controllers.question",["ov.constant","ov.services.question"]).controller("questionController",["$rootScope","$scope","questionService","STATUS.TERM.LOAD","STATUS.TERM.CHANGE",function(e,o,t,n,r){console.log("load questionController"),e.nowQuestion={},e.questionList=[],e.questionName="",e.questionOrder=1,e.modifyQuestionName="",e.modifyQuestionId="",e.questionOrderMap={},o.questionOrder={name:0,order:0,desc:0,score:0},$("#importQuestion").bind("change",function(){var o=$(this)[0].files[0],n=new FormData;n.append("file",o),n.append("questionnaire",e.nowQuestion._id),e.nowQuotaGroup._id&&t.importQuestion(n)}),e.createQuestion=function(){e.questionName="",e.questionOrder=1,$("#newQuestion").modal("show")},e.createNewQuestion=function(){var o={term:e.nowTerm._id,name:$("#questionName").val(),order:$("#questionOrder").val()};t.createQuestion(o)},e.changeQuestion=function(o){console.log(o),e.nowQuestion=_.find(e.questionList,function(e){return e._id==o})},e.modifyQuestion=function(o,t){console.log(o,t),e.modifyQuestionName=t,e.modifyQuestionId=o,$("#modifyQuestion").modal("show")},e.modifyQuestionSub=function(){e.modifyQuestionName=$("#questionModifyName").val(),t.modifyQuestion({questionnaire:e.modifyQuestionId,name:e.modifyQuestionName})},e.$on(n,function(){t.getQuestionList()}),e.$on(r,function(){e.nowQuestion={},t.getQuestionList()})}]),angular.module("ov.controllers.relat",["ov.constant","ov.services.relat","ov.services.question"]).controller("relatController",["$rootScope","$scope","relatService","questionService","STATUS.TERM.LOAD","STATUS.LOGIN.STUDENT","STATUS.LOGIN.TEACHER","STATUS.QUEST.LOAD","STATUS.RELAT.GET","STATUS.TERM.LOAD","STATUS.TERM.CHANGE",function(e,o,t,n,r,i,s,a,c,r,u){function l(){var e=[];return _.each(o.nowScores,function(o,t){e.push({question:t,score:o.score})}),e}function d(){o.nowScores={},o.allScore=0;try{_.each(e.nowQuestScore.scoremap,function(e){o.nowScores[e._id]={max:e.max,score:e.score},o.allScore+=e.score}),console.log(o.nowScores)}catch(t){}}console.log("load relatController"),e.relatList=[],e.relatTdList=[],e.overList=[],e.nowQuestScore,e.nowOverType=0,o.nowName="",o.nowId="",o.nowQuestionOrder=0,o.nowScores={},o.allScore=0,$("#importRelat").bind("change",function(){var o=$(this)[0].files[0],n=new FormData;n.append("file",o),n.append("term",e.nowTerm._id),e.nowTerm._id&&t.importRelat(n)}),o.getQuestion=function(t,r,i){o.nowName=r,o.nowId=i,n.getOneUserScore({appraiseeId:i,evaluationType:e.nowOverType}),o.nowQuestionOrder=t},o.addScore=function(e){o.nowScores[e]&&o.nowScores[e].score<o.nowScores[e].max&&(o.nowScores[e].score++,o.allScore++)},o.removeScore=function(e){o.nowScores[e]&&o.nowScores[e].score>0&&(o.nowScores[e].score--,o.allScore--)},o.resetScore=function(){d()},o.saveScore=function(){var t={appraiseeId:o.nowId,evaluationType:e.nowOverType,questionnaire:e.nowQuestScore.questionnaire._id,scores:JSON.stringify(l())};n.saveScores(t)},e.$on(i,function(){e.nowOverType=1,t.getOverList({evaluationType:1})}),e.$on(s,function(){e.nowOverType=0,t.getOverList({evaluationType:0})}),e.$on(c,function(){0===e.relatList.length&&t.getRelatList()}),e.$on(u,function(){t.getRelatList()}),e.$on(r,function(){t.getRelatList()}),e.$on(a,function(){d()})}]),angular.module("ov.controllers.manage",["ov.constant","ov.services.quota"]).controller("manageController",["$rootScope","$scope","$location","quotaService","STATUS.GROUP.LOAD",function(e,o,t){console.log("load manageController"),o.switchMode=function(e){console.log(e,o.getMode()),e!==o.getMode()&&t.search("mode",e)},o.getMode=function(){return t.search().mode||!1}}]),angular.module("ov.controllers.user",["ov.constant","ov.services.utils","ov.services.user"]).controller("userController",["$rootScope","$scope","$location","Util","userService","STATUS.USER.LOAD",function(e,o,t,n,r,i){console.log("load userController"),e.my={},e.userList=[],n.cookie.get("skey")&&r.getUserInfo(),$(".auth-set").on("change",function(e){console.log(e),console.log($(this).val())}),e.showManage=function(){$("#authManage").modal("show")},window.authChange=function(o){var t=$(o).data("id"),n=$(o).data("tid"),r=o.value;r&&e.setAuth(t,r,n)},e.setAuth=function(e,o,t){var n={id:e,role:o,_id:t};r.setAuth(n)},e.quitLogin=function(){r.logout()},e.import71=function(){r.importUser()},e.showUser=function(e){console.log(e)},e.$on(i,function(){r.searchUser();var o=e.my.role,n=t.absUrl();return 1&o||2&o?void(n.indexOf("overall.html")<0&&(window.location.href="/overall.html")):4&o?void(n.indexOf("import.html")<0&&(window.location.href="/import.html")):8&o?void(n.indexOf("index.html")<0&&(window.location.href="/index.html#?mode=report")):22&o?void(n.indexOf("manage.html")<0&&(window.location.href="/manage.html")):void 0})}]),angular.module("ov.controllers.msg",["ov.constant"]).controller("msgController",["$rootScope","$scope","$location","MSG.ERROR.CODE",function(e,o,t,n){console.log("load msgcontroller"),Messenger().options={extraClasses:"messenger-fixed messenger-on-bottom",theme:"flat"};var r=(t.absUrl(),{0:"操作成功!",11:"学期名称不能为空",12:"该学期还未激活",1001:"您还没有登录!",1004:"没有找到资源!",1010:"您没有查看该资源的权限!",1011:"参数出错啦!",1013:"出错啦",1014:"同名啦,请修改名称!",1015:"已经归档啦!",1016:"该资源不能删除",1017:"该目录下还有其他文件，无法删除!",1041:"用户名或密码错误!",1043:"用户不存在!",1050:"时间交叉了!",1051:"已经有激活的学期"});e.$on(n,function(e,o){if(1001===o){var t="/api/login";return void(location.href=t)}var n={message:r[o]};parseInt(o)&&(n.type="error"),Messenger().post(n)})}]),function(){angular.module("manage",["ov.controllers.relat","ov.controllers.term","ov.controllers.user","ov.controllers.toolbar","ov.controllers.import","ov.controllers.question","ov.controllers.teacher","ov.controllers.student","ov.controllers.msg","ov.controllers.manage"])}();