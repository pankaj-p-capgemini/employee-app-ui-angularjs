app.controller("getEmployeesControllers", ["$scope", "$rootScope", "$location", "$route", "employeesServices", function ($scope, $rootScope, $location, $route, employeesServices) {
    var dTable;
    employeesServices.getEmployees()
        .then(function (response) {
            $scope.employees = response.data;
            angular.element(document).ready(function () {
                dTable = $('#emp-list-tbl').DataTable({
                    responsive: true,
                    "order": [[0, "desc"]],
                    "columnDefs": [{
                        "targets": -1,
                        "data": null,
                        "defaultContent": "<button type='button' onclick='angular.element(this).scope().updateEmployee(this)' class='btn btn-success update-emp mr-2'>Update</button><button type='button' onclick='angular.element(this).scope().deleteEmployee(this)' class='btn btn-danger delete-emp'>Delete</button>"
                    }]
                });
            });
        }, function (response) {
            $rootScope.showNotification(true, 'alert-danger', response, false, '', '')
            console.log("Server error in getEmployees : ", response)
        }).catch(function (err) {
            $rootScope.showNotification(true, 'alert-danger', err, false, '', '')
            console.error("Error in getEmployees : ", err)
        })


    $scope.updateEmployee = function (ele) {
        var data = dTable.row($(ele).parents('tr')).data()
        $rootScope.empUpdateTempData = data
        // redirect to update route
        $location.path("/update-employee/" + data[0])
        $scope.$apply()
    }

    $scope.deleteEmployee = function (ele) {
        var data = dTable.row($(ele).parents('tr')).data();
        if (confirm("Are you sure you want to delete '" + data[1] + "' record?")) {
            // confirmed
            employeesServices.deleteEmployee(data[0])
                .then(function (response) {
                    console.log('deleteEmployee success response : ', response)
                    $rootScope.showNotification(true, 'alert-success', 'Employee data deleted successfully.', false, '', '')
                    $location.path("/view-employee")
                    $route.reload();
                }, function (response) {
                    $rootScope.showNotification(true, 'alert-danger', response, false, '', '')
                    console.log("Server error in deleteEmployee : ", response)
                }).catch(function (err) {
                    $rootScope.showNotification(true, 'alert-danger', err, false, '', '')
                    console.error("Error in deleteEmployee : ", err)
                })
        }
    }
}])