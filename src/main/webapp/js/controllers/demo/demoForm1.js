/**
 * @ngdoc controller
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
    .controller('DemoForm1', ['$scope', 'common','$sce', function($scope, Common,$sce) {
        $scope.html = $sce.trustAsHtml('<div style="color:red;">我是直接绑定的html</div>');
        $scope.carouselSource = ['http://pic.hanhande.com/files/130401/1283574_143007_1_lit.jpg','http://images.17173.com/2015/acg/2015/07/14/uv0714cr01s.jpg','http://img1.gamersky.com/image2016/05/20160521_sy_225_1/gamersky_02small_04_201652197D45.jpg','http://i0.hdslb.com/bfs/archive/c86e4823af195c4a144776394b6d8189931b5f12.jpg'];
        $scope.formData = {
            ips:['192.168.1.1'],
            cb1: true,
            cb2: false,
            cb3: false,
            cb4: true,
            rd1: 0,
            rd2: 1
        };

        $scope.unitList = [{
            name:'运营部'
        },{
            name:'市场部'
        },{
            name:'集团部'
        },{
            name:'人事部'
        }];

        //文件对象
        $scope.file = {
            key: '',
            name: '',
            url:''
        };
        
        $scope.filename = null;
        $scope.onselected = function(){
            console.log(arguments);
        };
        $scope.onuploading = function(){
            console.log(arguments);
        };
        $scope.onuploaded = function(file){
            $scope.filename = file.name;
            alert('上传成功');
        };
        $scope.onfailed = function(){
            console.log(arguments);
        };


        $scope.removeItem = function(index) {
            $scope.unitList.splice(index,1);
        };

        $scope.detailView = function() {
            alert('详情查看！');
        };

        $scope.content = "哈哈哈哈哈";

        $scope.log = function() {
            console.log($scope.formData);
        };

        $scope.account = "sweetyx";


    }]);
