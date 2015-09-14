var climaApp = angular.module("climaApp",["ionic"]);

// Criando o serviço e injetando dependencias
climaApp.service("obterClimaSvc",["$http","$rootScope",obterClimaSvc]);
// Criando o Controlador e injetando dependencias
climaApp.controller("climaCtrl",["$scope","obterClimaSvc",climaCtrl]);

function obterClimaSvc($http, $rootScope){

    this.loadClima = function(params){
        $http.get("http://api.openweathermap.org/data/2.5/weather", {params: params}).success(
                function(result){
                    $rootScope.$broadcast("climaApp.clima",result);
            }
        ).error(function(result) {
             alert("Requisição Falhou");
        });
    }
}

function climaCtrl ($scope, obterClimaSvc){

    $scope.params = {q:"Lins"};

    $scope.$on("climaApp.clima", function(_, result) {

        console.log(result.name);
        console.log(result.sys.country);
        console.log(result.coord.lat);
        console.log(result.coord.lon);
        console.log(result.main.temp);
        console.log(result.main.humidity);
        console.log(result.main.pressure);
        console.log(result.wind.speed);
        console.log(result.weather.description);
        console.log(result.weather.icon);

        $scope.name = result.name;
        $scope.country = result.sys.country;

        $scope.lat = result.coord.lat;
        $scope.lon = result.coord.lon;

        $scope.temp = result.main.temp;
        $scope.humidity = result.main.humidity;
        $scope.pressure = result.main.pressure;

        $scope.speed = result.wind.speed;

        $scope.humidity = result.weather.description;
        $scope.icon = result.weather.icon;



    });

    obterClimaSvc.loadClima($scope.params);

    $scope.obterClimaParam = function(p_city){
        console.log(p_city);
        if (p_city!=undefined){
            obterClimaSvc.loadClima({q:p_city});
        }
    }


}

