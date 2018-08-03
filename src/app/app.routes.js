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