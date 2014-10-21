angular.module("ov.services.import",["ov.constant","ov.services.utils"]).service("importService",["$rootScope","$location","$http",function(){var o=function(o,e,t){{var r=(new Date).getTime(),r=(new Date).getTime();Util.object.toUrlencodedString(o)}Http.get("/api/indicator/list?_="+r+"&indicatorGroup="+o.indicatorGroup,null,{responseType:"json"}).success(function(o,t){0===o.code?(console.log("拉学生列表成功!",o),Root.$emit("status.student.load")):Root.$emit("msg.codeshow",o.code),e&&e(o,t)}).error(function(o,e){t&&t(o,e)})};return{getQuotaList:o}}]),angular.module("ov.services.quota",["ov.constant","ov.services.utils"]).service("quotaService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.GROUP.LOAD",function(o,e,t,r,n,a){var u=function(e){e=e||0,o.quotaGroupList.length&&(o.nowQuotaGroup=o.quotaGroupList[e])},i=function(){var e="/api/indicatorgroup/list?term="+o.nowTerm._id,r=(new Date).getTime();t.get(e+"&t="+r,null,{responseType:"json"}).success(function(e){console.log("拉取指标组成功！",e.result),0===e.err?(o.quotaGroupList=e.result,_.each(e.result,function(e){o.quotaGroupMap[e._id]=e}),u(),o.$emit(a)):o.$emit(n,e.err)}).error(function(){})},c=function(e,a,u){var i=(new Date).getTime(),c=r.object.toUrlencodedString(o.newQuotaGroup);t.post("/api/indicatorgroup/create?_="+i,c,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(e,t){console.log(e),0===e.err?console.log("新建指标组成功!",e):o.$emit(n,e.err),a&&a(e,t)}).error(function(o,e){u&&u(o,e)})},s=function(e,r,a){var u=(new Date).getTime();t.get("/api/indicator/list?_="+u+"&indicatorGroup="+e.indicatorGroup,null,{responseType:"json"}).success(function(e,t){0===e.err?(o.quotaList=e.result,console.log(o.quotaList),console.log("拉指标列表成功!",e)):o.$emit(n,e.err),r&&r(e,t)}).error(function(o,e){a&&a(o,e)})},l=function(o){var e=((new Date).getTime(),"/api/indicator/import"),t=new XMLHttpRequest;t.addEventListener("load",function(){try{var o=JSON.parse(t.responseText);console.log(o)}catch(e){}}),t.addEventListener("error",function(o){console.log("error",o)}),t.open("POST",e),t.send(o)},p=function(o){var e=((new Date).getTime(),"/api/indicatorscore/import"),t=new XMLHttpRequest;t.addEventListener("load",function(){try{var o=JSON.parse(t.responseText);console.log(o)}catch(e){}}),t.addEventListener("error",function(o){console.log("error",o)}),t.open("POST",e),t.send(o)},d=function(e,t,r){var n=o.quotaGroupMap[e].indicators,a=_.sortBy(n,function(o){return r?(console.log("-",o,t),-o[t]):(console.log("+",o,t),+o[t])});o.quotaGroupMap[e].indicators=a};return{setDefQuotaGroup:u,getQuotaGroup:i,createQuotaGroup:c,getQuotaList:s,importQuota:l,importQuotaScore:p,orderQuotaGroup:d}}]),angular.module("ov.services.student",["ov.constant","ov.services.utils"]).service("studentService",["$rootScope","$location","$http",function(){var o=function(o){var e=((new Date).getTime(),"/api/student/import"),t=new XMLHttpRequest;t.addEventListener("load",function(){try{var o=JSON.parse(t.responseText);console.log(o)}catch(e){}}),t.addEventListener("error",function(o){console.log("error",o)}),t.open("POST",e),t.send(o)};return{importStudent:o}}]),angular.module("ov.services.utils",[]).service("Util",[function(){var o={object:{toUrlencodedString:function(o){return _.map(o,function(o,e){return encodeURIComponent(e)+"="+encodeURIComponent(o)}).join("&")}},getParameter:function(o){var e=new RegExp("(\\?|#|&)"+o+"=([^&#]*)(&|#|$)"),t=location.href.match(e);return decodeURIComponent(t?t[2]:"")},cookie:{get:function(o){var e=document.cookie.split("; "),t=_.reduce(e,function(o,e){var t=e.split("=");return o[t[0]]=t[1],o},{});return t[o]},set:function(o){var e=null;if(document.cookie&&""!=document.cookie)for(var t=document.cookie.split(";"),r=0;r<t.length;r++){var n=$.trim(t[r]);if(n.substring(0,o.length+1)==o+"="){e=decodeURIComponent(n.substring(o.length+1));break}}return e}},time:{timezoneOffset:(new Date).getTimezoneOffset(),dateToDatetimePickerValue:function(e,t){return e||(e=new Date),e.setMinutes(e.getMinutes()-o.time.timezoneOffset),t||(e.setSeconds(0),e.setMilliseconds(0)),e.toISOString().split(".")[0]},datetimePickerValueToTs:function(e){if(e){var t=e.split(":").length<3?":00.000Z":".000Z",r=Date.parse(e+t)+60*o.time.timezoneOffset*1e3;return console.log(e,r,new Date(r)),r}return 0}}};return o}]),angular.module("ov.controllers.nav",["ov.constant"]).controller("navController",["$rootScope","$scope",function(){console.log("load navController")}]),angular.module("ov.controllers.toolbar",["ov.constant"]).controller("toolbarController",["$rootScope","$scope",function(){console.log("load toolbarController")}]),angular.module("ov.controllers.import",["ov.constant","ov.services.quota"]).controller("quotaController",["$rootScope","$scope","quotaService","STATUS.TERM.LOAD",function(o,e,t,r){console.log("load quotaController"),o.quotaGroupList=[],o.quotaGroupMap={},o.nowQuotaGroup={},o.quotaList=[],o.newQuotaGroup={},e.quotaOrder={name:0,order:0,gatherType:0,score:0},e.quotaScoreOrder={},e.orderQuotaGroup=function(r){e.quotaOrder[r]=!e.quotaOrder[r],t.orderQuotaGroup(o.nowQuotaGroup._id,r,e.quotaOrder[r]),$("#newQuotaGroup").modal("hide")},e.orderQuotaScore=function(){e.quotaScoreOrder[name]=!e.quotaScoreOrder[name]},$("#importFile").bind("change",function(){var e=$(this)[0].files[0],r=new FormData;r.append("file",e),r.append("indicatorGroup",o.nowQuotaGroup._id),o.nowQuotaGroup._id&&t.importQuota(r)}),$("#importQuotaScore").bind("change",function(){var e=$(this)[0].files[0],r=new FormData;r.append("file",e),r.append("indicatorGroup",o.nowQuotaGroup._id),o.nowQuotaGroup._id&&t.importQuotaScore(r)}),o.selectQuotaGroup=function(r){t.setDefQuotaGroup(r);var n=o.nowQuotaGroup.indicators.length;e.quotaScoreOrder={};for(var a=0;n>a;a++)e.quotaScoreOrder[a]=0},o.editQuotaGroup=function(){},o.createQuotaGroup=function(){},o.createNewQuotaGroup=function(){o.newQuotaGroup.term=o.nowTerm._id,t.createQuotaGroup()},o.$on(r,function(){t.getQuotaGroup()})}]),angular.module("ov.controllers.student",["ov.constant","ov.services.student"]).controller("studentController",["$rootScope","$scope","studentService","STATUS.TERM.LOAD",function(o,e,t){console.log("load studentController"),$("#importStudent").bind("change",function(){var e=$(this)[0].files[0],r=new FormData;r.append("file",e),r.append("term",o.nowTerm._id),o.nowQuotaGroup._id&&t.importStudent(r)})}]),angular.module("ov.controllers.manage",["ov.constant","ov.services.quota"]).controller("manageController",["$rootScope","$scope","quotaService","STATUS.GROUP.LOAD",function(){console.log("load manageController")}]),angular.module("ov.controllers.msg",["ov.constant"]).controller("msgController",["$rootScope","$scope","MSG.ERROR.CODE",function(o,e,t){console.log("load msgcontroller"),Messenger().options={extraClasses:"messenger-fixed messenger-on-bottom",theme:"flat"};var r={0:"操作成功!",1001:"您还没有登录!",1004:"没有找到资源!",1010:"您没有查看该资源的权限!",1011:"参数出错啦!",1013:"出错啦",1014:"同名啦,请修改名称!",1015:"已经归档啦!",1016:"该资源不能删除",1017:"该目录下还有其他文件，无法删除!",1041:"用户名或密码错误!",1043:"用户不存在!",1050:"时间交叉了!"};o.$on(t,function(o,e){var t={message:r[e]};parseInt(e)&&(t.type="error"),Messenger().post(t)})}]),function(){angular.module("manage",["ov.controllers.term","ov.controllers.toolbar","ov.controllers.import","ov.controllers.student","ov.controllers.msg","ov.controllers.manage"])}();