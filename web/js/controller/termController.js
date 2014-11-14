/*导入模块*/
angular.module('ov.controllers.term',[
        'ov.constant',
        'ov.services.term'
    ]).
    controller('termController',['$rootScope','$scope','termService','STATUS.TERM.LOAD','STATUS.USER.LOAD','STATUS.TERM.CHANGE','MSG.ERROR.CODE',function($root,$scope,Term ,TERM_LOAD,USERLOAD,TERM_CHANGE,MSG){
        console.log('load termController');
        $root.termModalTit = '新建学期';
        $root.modifyTerm = {};
        $root.termList = [];
        $root.nowTerm = {};
        //0: 未激活, 1: 激活, 2: 关闭, 4: 评价完成
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
            Term.changeDefTerm(id);
            console.log(id);
            $root.$emit(TERM_CHANGE);
        }
        
        //修改或者新建学期
        $root.createNewTerm = function(){
            if ($root.termModalTit === '新建学期'){
                if($root.modifyTerm.name !== ''){
                    var param = {
                        name : $root.modifyTerm.name
                    }
                    Term.createTerm(param);
                }else{
                    $root.$emit(MSG,11);
                }
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

        //删除学期
        $root.deleteTerm = function(id){
            if(id){
                Term.delTerm({
                    term : id
                })
            }
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

        $root.$on(USERLOAD,function(){
            Term.getTermList();    
        }); 
}]);
