/**
 * @ngdoc service
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
    .factory('module', ['permData',function(permData) {
        function initPerm(nodes,permMap,permList){
            if(!$.isArray(nodes) || nodes.length===0)
                return;
            for(var i=0;i<nodes.length;i++){
                permMap[nodes[i].node_id] = nodes[i];
                permList.push(nodes[i]);
                initPerm(nodes[i].children,permMap,permList);
            }
        }
        var service = {
            permList: [],
            permMap: {},
            setPermissions: function(permList) {
                for(var i=0;i<this.permList.length;i++){
                    if($.inArray(this.permList[i].node_id,permList)>-1){
                        this.permList[i].hasPermission = true;
                    }
                    else{
                        this.permList[i].hasPermission = false;
                    }
                };
            },
            hasPermission: function(perm) {
                if(this.permMap[perm] && this.permMap[perm].hasPermission){
                    return true;
                }
                else{
                    return false;
                }
            }
        };
        initPerm(permData,service.permMap,service.permList);
        return service;
    }]);
