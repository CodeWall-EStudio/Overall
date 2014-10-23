/*导入模块*/
angular.module('ov.controllers.term',[
        'ov.constant',
        'ov.services.term'
    ]).
    controller('termController',['$rootScope','$scope','termService','STATUS.TERM.LOAD',function($root,$scope,Term ,TERM_LOAD){
        console.log('load termController');
        $root.termModalTit = '新建学期';
        $root.modifyTerm = {};
        $root.termList = [];
        $root.nowTerm = {};
        //新建学期
        $root.createTerm = function(){
            $root.termModalTit = '新建学期';
            $root.modifyTerm = {};
            $("#newTerm").modal('show');
        }
        //修改学期
        $root.modifyOneTerm = function(id){
            $root.termModalTit = '修改学期';
            $root.modifyTerm = {};
            var ret = Term.getOneTerm(id);
            $.extend($root.modifyTerm,ret);
            $("#newTerm").modal('show');
        }

        //变更当前学期
        $root.changeTerm = function(id){

        }
        
        //修改或者新建学期
        $root.createNewTerm = function(){
            if ($root.termModalTit === '新建学期'){
                var param = {
                    name : $root.modifyTerm.name
                }
                Term.createTerm(param);
            }else{
                var param = {
                    term : $root.modifyTerm._id,
                    name : $root.modifyTerm.name,
                    order : $root.modifyTerm.order || 0,
                    status : $root.modifyTerm.status
                }
                Term.modifyTerm(param);
            }
            $("#newTerm").modal('hide');
            //console.log(param);
        }

        //修改学期状态
        $root.changeTermStatus = function(id,status){
            $root.modifyTerm = {};
            var ret = Term.getOneTerm(id);
            var param = {
                term : ret._id,
                name : ret.name,
                order : ret.order || 0,
                status : status
            }
            Term.modifyTerm(param);
        }

        Term.getTermList();
        
}]);
