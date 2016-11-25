/**
 * @ngdoc filter
 * @name adminApp.filter:content2html
 * @function
 * @description
 * # content2html
 * Filter in the adminApp.
 */
angular.module('adminApp')
    .filter('content2html', function() {
        function escapeHTML(_html) {
            if (!_html) {
                return '';
            }
            if (typeof _html == "number") {
                _html = _html.toString();
            }
            return _html.replace(/[\u0000]/g, '').replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        };
        return function(input) {
            return escapeHTML(input).replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
        };
    });
