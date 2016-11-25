angular.element(document).ready(function() {
    $.ajax({
        url: 'xhr/admin/getPermList.json',
        type: 'POST',
        dataType: 'json',
        success: function(res) {
            if (res.code === 200) {
                window.permissionList = res.data || [];
                angular.bootstrap(document, ['adminApp']);
            } else {
                alert('初始化权限信息失败！');
            }
        },
        error: function() {
            alert('初始化权限信息失败！');
        }
    });
});
