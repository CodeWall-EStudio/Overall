angular.module("ov.services.import",["ov.constant","ov.services.utils"]).service("importService",["$rootScope","$location","$http",function(){var o=function(o,e,t){{var r=(new Date).getTime(),r=(new Date).getTime();Util.object.toUrlencodedString(o)}Http.get("/api/indicator/list?_="+r+"&indicatorGroup="+o.indicatorGroup,null,{responseType:"json"}).success(function(o,t){0===o.code?(console.log("拉学生列表成功!",o),Root.$emit("status.student.load")):Root.$emit("msg.codeshow",o.code),e&&e(o,t)}).error(function(o,e){t&&t(o,e)})};return{getQuotaList:o}}]),angular.module("ov.services.quota",["ov.constant","ov.services.utils"]).service("quotaService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.QUOTA.LOAD",function(o,e,t,r,n,i){var u=function(e){e=e||0,o.quotaGroupList.length&&(o.nowQuotaGroup=o.quotaGroupList[e],e||(o.$emit(i),console.log("quota_load")))},a=function(){var e="/api/indicatorgroup/list?term="+o.nowTerm._id,r=(new Date).getTime();t.get(e+"&t="+r,null,{responseType:"json"}).success(function(e){console.log("拉取指标组成功！",e.result),0===e.err?(o.quotaGroupList=e.result,_.each(e.result,function(e){o.quotaGroupMap[e._id]=e}),u()):o.$emit(n,e.err)}).error(function(){})},s=function(e,i,u){var a=(new Date).getTime(),s=r.object.toUrlencodedString(o.newQuotaGroup);t.post("/api/indicatorgroup/create?_="+a,s,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(e,t){console.log(e),0===e.err&&(o.quotaGroupList.push(e.result),o.quotaGroupMap[e.result._id]=e.result,o.nowQuotaGroup._id||(o.nowQuotaGroup=e.result),console.log("新建指标组成功!",e)),o.$emit(n,e.err),i&&i(e,t)}).error(function(o,e){u&&u(o,e)})},c=function(){return},l=function(){},p=function(e,r,i){var u=(new Date).getTime();t.get("/api/indicator/list?_="+u+"&indicatorGroup="+e.indicatorGroup,null,{responseType:"json"}).success(function(e,t){0===e.err?(o.quotaList=e.result,console.log(o.quotaList),console.log("拉指标列表成功!",e)):o.$emit(n,e.err),r&&r(e,t)}).error(function(o,e){i&&i(o,e)})},d=function(e){var t=((new Date).getTime(),"/api/indicator/import"),r=new XMLHttpRequest;r.addEventListener("load",function(){try{var e=JSON.parse(r.responseText);0===e.err&&a(),o.$emit(n,e.err),console.log(e)}catch(t){}}),r.addEventListener("error",function(o){console.log("error",o)}),r.open("POST",t),r.send(e)},f=function(e){var t=((new Date).getTime(),"/api/indicatorscore/import"),r=new XMLHttpRequest;r.addEventListener("load",function(){try{var e=JSON.parse(r.responseText);console.log("導入成功　",e),o.$emit(n,e.err)}catch(t){}}),r.addEventListener("error",function(o){console.log("error",o)}),r.open("POST",t),r.send(e)},g=function(e,t,r){var n=o.quotaGroupMap[e].indicators,i=_.sortBy(n,function(o){return r?(console.log("-",o,t),-o[t]):(console.log("+",o,t),+o[t])});o.quotaGroupMap[e].indicators=i};return{setDefQuotaGroup:u,getQuotaGroup:a,createQuotaGroup:s,getQuotaList:p,importQuota:d,importQuotaScore:f,orderQuotaGroup:g,getQuotaScore:c,setQuotaScore:l}}]),angular.module("ov.services.utils",[]).service("Util",[function(){var o={object:{toUrlencodedString:function(o){return _.map(o,function(o,e){return encodeURIComponent(e)+"="+encodeURIComponent(o)}).join("&")}},getParameter:function(o){var e=new RegExp("(\\?|#|&)"+o+"=([^&#]*)(&|#|$)"),t=location.href.match(e);return decodeURIComponent(t?t[2]:"")},cookie:{get:function(o){var e=document.cookie.split("; "),t=_.reduce(e,function(o,e){var t=e.split("=");return o[t[0]]=t[1],o},{});return t[o]},set:function(o){var e=null;if(document.cookie&&""!=document.cookie)for(var t=document.cookie.split(";"),r=0;r<t.length;r++){var n=$.trim(t[r]);if(n.substring(0,o.length+1)==o+"="){e=decodeURIComponent(n.substring(o.length+1));break}}return e}},time:{timezoneOffset:(new Date).getTimezoneOffset(),dateToDatetimePickerValue:function(e,t){return e||(e=new Date),e.setMinutes(e.getMinutes()-o.time.timezoneOffset),t||(e.setSeconds(0),e.setMilliseconds(0)),e.toISOString().split(".")[0]},datetimePickerValueToTs:function(e){if(e){var t=e.split(":").length<3?":00.000Z":".000Z",r=Date.parse(e+t)+60*o.time.timezoneOffset*1e3;return console.log(e,r,new Date(r)),r}return 0}}};return o}]),angular.module("ov.services.user",["ov.constant","ov.services.utils"]).service("userService",["$rootScope","$location","$http","Util","MSG.ERROR.CODE","STATUS.USER.LOAD",function(o,e,t,r,n,i){function u(){var e="/api/user/info";t.get(e,null,{responseType:"json"}).success(function(e){0===e.err?(o.my=e.result,console.log(o.my),o.$emit(i)):o.$emit(n,e.err)}).error(function(){})}function a(){location.href="/api/login/logout"}function s(e,r,i){e=e||{};var u=(new Date).getTime(),a="/api/user/search?_="+u;e.keyword&&(a+="&=keyword="+e.keyword),t.get(a,null,{responseType:"json"}).success(function(e,t){0===e.err?(o.userList=e.result,console.log("搜索用户成功",e.result)):o.$emit(n,e.err),r&&r(e,t)}).error(function(o,e){i&&i(o,e)})}function c(){var e="/api/user/import";t.get(e,null,{responseType:"json"}).success(function(e){o.$emit(n,e.err)}).error(function(){})}function l(e,i,u){var a=(new Date).getTime(),s=r.object.toUrlencodedString(e);t.post("/api/user/auth?_="+a,s,{responseType:"json",headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(t,r){if(console.log(t),0===t.err){console.log("设置权限成功!",t);var u=_.find(o.userList,function(o){return o._id==e._id});u.role=e.role}o.$emit(n,t.err),i&&i(t,r)}).error(function(o,e){u&&u(o,e)})}return{getUserInfo:u,importUser:c,logout:a,setAuth:l,searchUser:s}}]),angular.module("ov.controllers.nav",["ov.constant"]).controller("navController",["$rootScope","$scope",function(){console.log("load navController")}]),angular.module("ov.controllers.toolbar",["ov.constant","ov.services.utils","ov.services.login"]).controller("toolbarController",["$rootScope","$scope","Util","loginService",function(o,e,t,r){console.log("load toolbarController"),t.cookie.get("skey")||(console.log("not login"),r.teacherLogin())}]),angular.module("ov.controllers.import",["ov.constant","ov.services.quota"]).controller("quotaController",["$rootScope","$scope","quotaService","STATUS.TERM.LOAD","STATUS.QUOTA.LOAD","STATUS.QUOTAGROUP.CHANGE",function(o,e,t,r,n,i){console.log("load quotaController"),o.quotaGroupList=[],o.quotaGroupMap={},o.nowQuotaGroup={},o.quotaList=[],o.newQuotaGroup={},o.quotaScoreList={},e.quotaOrder={name:0,order:0,gatherType:0,score:0},e.quotaScoreOrder={},e.orderQuotaGroup=function(r){e.quotaOrder[r]=!e.quotaOrder[r],t.orderQuotaGroup(o.nowQuotaGroup._id,r,e.quotaOrder[r]),$("#newQuotaGroup").modal("hide")},e.orderQuotaScore=function(){e.quotaScoreOrder[name]=!e.quotaScoreOrder[name]},$("#importFile").bind("change",function(){var e=$(this)[0].files[0],r=new FormData;r.append("file",e),r.append("indicatorGroup",o.nowQuotaGroup._id),console.log(o.nowQuotaGroup),o.nowQuotaGroup._id&&t.importQuota(r)}),$("#importQuotaScore").bind("change",function(){var e=$(this)[0].files[0],r=new FormData;r.append("file",e),r.append("indicatorGroup",o.nowQuotaGroup._id),o.nowQuotaGroup._id&&t.importQuotaScore(r)}),o.selectQuotaGroup=function(r){if(0>r)return o.nowQuotaGroup=!1,void o.$emit(i);t.setDefQuotaGroup(r);var n=o.nowQuotaGroup.indicators.length;e.quotaScoreOrder={};for(var u=0;n>u;u++)e.quotaScoreOrder[u]=0;o.$emit(i)},o.editQuotaGroup=function(){},o.createQuotaGroup=function(){},o.createNewQuotaGroup=function(){o.newQuotaGroup.term=o.nowTerm._id,t.createQuotaGroup()},o.$on(r,function(){t.getQuotaGroup()}),o.$on(n,function(){})}]),angular.module("ov.controllers.user",["ov.constant","ov.services.utils","ov.services.user"]).controller("userController",["$rootScope","$scope","$location","Util","userService","STATUS.USER.LOAD",function(o,e,t,r,n,i){console.log("load userController"),o.my={},o.userList=[],n.getUserInfo(),$(".auth-set").on("change",function(o){console.log(o),console.log($(this).val())}),o.showManage=function(){$("#authManage").modal("show")},window.authChange=function(e){var t=$(e).data("id"),r=$(e).data("tid"),n=e.value;n&&o.setAuth(t,n,r)},o.setAuth=function(o,e,t){var r={id:o,role:e,_id:t};n.setAuth(r)},o.quitLogin=function(){console.log(2222),n.logout()},o.import71=function(){n.importUser()},o.showUser=function(o){console.log(o)},o.$on(i,function(){n.searchUser();var e=o.my.role,r=t.absUrl();return console.log(e),1&e||2&e?void(r.indexOf("overall.html")<0&&(window.location.href="/overall.html")):(4&e&&r.indexOf("import.html")<0&&(window.location.href="/import.html"),8&e&&r.indexOf("index.html")<0&&(window.location.href="/index.html"),void(22&e&&r.indexOf("manage.html")<0&&(window.location.href="/manage.html")))})}]),angular.module("ov.controllers.msg",["ov.constant"]).controller("msgController",["$rootScope","$scope","$location","MSG.ERROR.CODE",function(o,e,t,r){console.log("load msgcontroller"),Messenger().options={extraClasses:"messenger-fixed messenger-on-bottom",theme:"flat"};var n=(t.absUrl(),{0:"操作成功!",1001:"您还没有登录!",1004:"没有找到资源!",1010:"您没有查看该资源的权限!",1011:"参数出错啦!",1013:"出错啦",1014:"同名啦,请修改名称!",1015:"已经归档啦!",1016:"该资源不能删除",1017:"该目录下还有其他文件，无法删除!",1041:"用户名或密码错误!",1043:"用户不存在!",1050:"时间交叉了!"});o.$on(r,function(o,e){if(1001===e){var t="/api/login";return void(location.href=t)}var r={message:n[e]};parseInt(e)&&(r.type="error"),Messenger().post(r)})}]),function(){angular.module("import",["ov.controllers.toolbar","ov.controllers.user","ov.controllers.term","ov.controllers.import","ov.controllers.msg"])}();