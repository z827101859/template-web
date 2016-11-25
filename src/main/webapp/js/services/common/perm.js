/**
 * 权限数据
 */
angular.module('adminApp')
    .constant('permData', [{
        node_id: 100,
        node_name: '表单',
        children: [{
            node_id: 110,
            node_name: 'form'
        }, {
            node_id: 120,
            node_name: 'form1'
        }]
    }, {
        node_id: 200,
        node_name: '列表',
        children: [{
            node_id: 210,
            node_name: 'list',
            children: [{
                node_id: 211,
                node_name: '查询'
            },{
                node_id: 212,
                node_name: '详情'
            }]
        }, {
            node_id: 220,
            node_name: 'list1'
        }, {
            node_id: 230,
            node_name: 'list2'
        }]
    }, {
        node_id: 300,
        node_name: '其他',
        children: [{
            node_id: 310,
            node_name: 'htmleditor'
        }, {
            node_id: 320,
            node_name: 'perm',
            children: [{
                node_id: 321,
                node_name: '查询'
            },{
                node_id: 322,
                node_name: '新建'
            },{
                node_id: 323,
                node_name: '编辑'
            },{
                node_id: 324,
                node_name: '删除'
            }]
        }, {
            node_id: 330,
            node_name: 'modal'
        }, {
            node_id: 340,
            node_name: 'uib',
        }, {
            node_id: 350,
            node_name: 'navbar'
        }]
    }, {
        node_id: 400,
        node_name: '测试',
        children: [{
            node_id: 410,
            node_name: 'test'
        }]
    }]);
