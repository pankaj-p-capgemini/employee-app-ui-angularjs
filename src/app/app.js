console.log("APP LOADED SUCCESFULLY!");
var app;
(function () {
    app = angular.module("app", ['ngRoute']);
    app.controller("MainController", ["$rootScope", function ($rootScope) {
        this.appTitle = "Employee App - AngularJS";

        // define alert handling object        
        $rootScope.alertHandler = {
            generated: false,
            type: 'success',
            message: '',
            showLink: false,
            linkText: '',
            linkRef: '/src/#!/view-employee'
        }

        $rootScope.showNotification = function(generated, type, message, showLink, linkText, linkRef) {
            $rootScope.alertHandler.generated = generated
            $rootScope.alertHandler.type = type
            $rootScope.alertHandler.message = message
            $rootScope.alertHandler.showLink = showLink
            $rootScope.alertHandler.linkText = linkText
            $rootScope.alertHandler.linkRef = linkRef
        }

        $rootScope.closeNotification = function() {
            $rootScope.alertHandler.generated = false
            $rootScope.alertHandler.showLink = false
        }

        // define common department data
        $rootScope.departmentData = [
            { text: 'select department', value: '' },
            { text: 'Production', value: 'Production' },
            { text: 'Research and Development (often abbreviated to RnD)', value: 'RnD' },
            { text: 'Purchasing', value: 'Purchasing' },
            { text: 'Marketing (including the selling function)', value: 'Marketing' },
            { text: 'Human Resource Management', value: 'HRD' },
            { text: 'Accounting and Finance', value: 'Accounting and Finance' }
        ];
    }]);
})();