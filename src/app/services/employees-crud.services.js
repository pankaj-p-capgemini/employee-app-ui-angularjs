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