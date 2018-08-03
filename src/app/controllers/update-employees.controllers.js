app.controller("updateEmployeesControllers", ["$scope", "$rootScope", "$location", "employeesServices", function ($scope, $rootScope, $location, employeesServices) {
    // load department select options
    $scope.departmentData = $rootScope.departmentData

    $scope.emp = {}
    $scope.empID = $rootScope.empUpdateTempData[0]
    $scope.emp.name = $rootScope.empUpdateTempData[1]
    $scope.emp.salary = parseInt($rootScope.empUpdateTempData[2])
    $scope.emp.department = $rootScope.empUpdateTempData[3]

    console.log('updateEmployeesControllers $scope', $scope)
    console.log('$rootScope.empUpdateTempData', $rootScope.empUpdateTempData)

    $scope.updateEmployee = function () {
        // add emp id to the payload
        $scope.emp.id = $scope.empID
        console.log('update scope :: ', $scope.emp)

        // Update submit validation
        employeesServices.updateEmployee($scope.empID, $scope.emp)
            .then(function (response) {
                console.log('updateEmployee success response : ', response)
                $rootScope.empUpdateTempData[0] = $scope.empID
                $rootScope.empUpdateTempData[1] = $scope.emp.name
                $rootScope.empUpdateTempData[2] = $scope.emp.salary
                $rootScope.empUpdateTempData[3] = $scope.emp.department
                $rootScope.showNotification(true, 'alert-success', 'Employee data updated successfully.', true, 'Update Again', '/src/#!/update-employee/' + $scope.empID);
                $location.path("/view-employee")
            }, function (response) {
                $rootScope.showNotification(true, 'alert-danger', response, false, '', '')
                console.log("Server error in updateEmployee : ", response)
            }).catch(function (err) {
                $rootScope.showNotification(true, 'alert-danger', err, false, '', '')
                console.error("Error in updateEmployee : ", err)
            })
    }
}])