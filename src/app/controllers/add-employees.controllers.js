app.controller("addEmployeesControllers", ["$scope", "$rootScope", "$location", "employeesServices", function ($scope, $rootScope, $location, employeesServices) {
    // load department select options
    $scope.departmentData = $rootScope.departmentData

    $scope.addEmployee = function () {
        // confirmed
        console.log('add scope :: ', $scope.emp)

        // Submit validation
        employeesServices.addEmployee($scope.emp)
            .then(function (response) {
                console.log('addEmployee success response : ', response)
                $rootScope.showNotification(true, 'alert-success', 'Employee data added successfully.', true, 'Add More', '/src/#!/add-employee/')
                $location.path("/view-employee");
            }, function (response) {
                $rootScope.showNotification(true, 'alert-danger', response, false, '', '')
                console.log("Server error in addEmployee : ", response);
            }).catch(function (err) {
                $rootScope.showNotification(true, 'alert-danger', err, false, '', '')
                console.error("Error in addEmployee : ", err);
            })
    }
}])