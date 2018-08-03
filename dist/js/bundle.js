(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (window) {
    window.__env = window.__env || {};

    // API url
    window.__env.apiBaseUrl = 'http://localhost:59632';

    // Base url
    window.__env.baseUrl = '/src/';

    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = true;
}(this));
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
var env = {};

// Import variables if present (from env.config.js)
if (window) {
    Object.assign(env, window.__env);
}

// Register environment in AngularJS as constant
app.constant('__env', env);

app.config(["$routeProvider", "$locationProvider", "__env", function ($routeProvider, $locationProvider, __env) {
    console.log('routeProvider---------------', $routeProvider)
    console.log('__env---------------', __env)
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/", {
            redirectTo: "/view-employee"
        })
        .when("/view-employee", {
            templateUrl: 'views/employees/employee-list.html',
            controller: "getEmployeesControllers"
        })
        .when("/add-employee", {
            templateUrl: 'views/employees/add-employee.html',
            controller: "addEmployeesControllers"
        })
        .when("/update-employee/:id", {
            templateUrl: 'views/employees/update-employee.html',
            controller: "updateEmployeesControllers"
        })
        .otherwise(
            {
                redirectTo: function () {
                    console.error('This is not a valid url!')
                    return "/src/";
                }
            }
        )
}]);
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
app.service("employeesServices", ["$http", "__env", function ($http, __env) {
    this.getEmployees = function () {
        console.log("getEmployees __env : ", __env)
        return $http({
            url: "http://localhost:59632/api/v1/employees",
            method: "GET"
        })
    }

    this.deleteEmployee = function (empID) {
        return $http({
            url: "http://localhost:59632/api/v1/employees/" + empID,
            method: "DELETE"
        })
    }

    this.addEmployee = function (emp) {
        return $http({
            url: "http://localhost:59632/api/v1/employees/",
            method: "POST",
            data: emp
        })
    }

    this.updateEmployee = function (empID, emp) {
        return $http({
            url: "http://localhost:59632/api/v1/employees/" + empID,
            method: "PUT",
            data: emp
        })
    }    
}])
},{}]},{},[1])