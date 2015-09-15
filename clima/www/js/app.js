

var climaApp = angular.module('climaApp',['ionic','ngCordova']);

// Declarando a variavel para criação do banco de dados
var db = null;


// Criando o serviço e injetando dependencias
climaApp.service("obterClimaSvc",["$http","$rootScope",obterClimaSvc]);
// Criando o Controlador e injetando dependencias
climaApp.controller("climaCtrl",["$scope","$cordovaSQLite","obterClimaSvc",climaCtrl]);

climaApp.run(function($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }


        db = $cordovaSQLite.openDB({name: "my.db"});

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS clima (id INTEGER PRIMARY KEY, textojson text)");

    });
})

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

function climaCtrl ($scope, $cordovaSQLite, obterClimaSvc){

    $scope.params = {q:"Lins"};
    $scope.resultado = "";

    $scope.insert = function(texojson) {
        var query = "insert into clima (texojson) values (?)";
        $cordovaSQLite.execute(db,query,[texojson]).then(function(result) {
            $scope.resultado = "Insert OK.";
        }, function(error){
            $scope.resultado = "Insert FAIL!";
        });
    }

    $scope.select = function(texojson){
        var query = "select texojson from clima where texojson = ?";
        $cordovaSQLite.execute(db,query,[texojson]).then(function(result) {
            if(result.rows.length > 0){
                $scope.resultado = result.rows.item(0).texojson + " encontrado.";
            } else {
                $scope.resultado = "Texo não encontrado!";
            }
        }, function(error){
            $scope.resultado = "Deu erro!";
        });
    }

    $scope.$on("climaApp.clima", function(_, result) {

        console.log("Cidade " + result.name);
        console.log("Pais " + result.sys.country);
        console.log("Lat. " + result.coord.lat);
        console.log("Lon. " + result.coord.lon);
        console.log("Temp. " + result.main.temp);
        console.log("humidity " + result.main.humidity);
        console.log("Pressure " + result.main.pressure);
        console.log("Speed " + result.wind.speed);
        console.log("description " + result.weather.description);
        console.log("icon " + result.weather.icon);

        $scope.name = result.name;
        $scope.country = result.sys.country;

        $scope.lat = result.coord.lat;
        $scope.lon = result.coord.lon;

        $scope.temp = result.main.temp;
        $scope.pressure = result.main.pressure;
        $scope.humidity = result.main.humidity;

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

