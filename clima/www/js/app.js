
// Declarand o módulo e injetando dependencias
var climaApp = angular.module('climaApp',['ionic','ngCordova']);

// Declarando a variavel para criação do banco de dados
var dbclima = null;


// Criando o serviço e injetando dependencias
climaApp.service("obterClimaSvc",["$http","$rootScope","$ionicLoading",obterClimaSvc]);
// Criando o Controlador e injetando dependencias
climaApp.controller("climaCtrl",["$scope","$sce","$ionicLoading","$ionicPlatform","$cordovaSQLite","obterClimaSvc",climaCtrl]);

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

        if(window.cordova) {
            // App syntax
            dbclima = $cordovaSQLite.openDB("dbclima");
        } else {
            // Ionic serve syntax
            dbclima = window.openDatabase("dbclima", "1.0", "Clima App", -1);
        }

        $cordovaSQLite.execute(dbclima, "CREATE TABLE IF NOT EXISTS clima (textojson text)");

    });
})

function obterClimaSvc($http, $rootScope, $ionicLoading){

    this.loadClima = function(params,funcao){
        $http.get("http://api.openweathermap.org/data/2.5/weather", {params: params}).success(
                function(result){
                    $rootScope.$broadcast("climaApp.clima",result);
                    $ionicLoading.hide();
            }
        ).error(function(result) {
             alert("Requisição Falhou");
        });
    }
}

function climaCtrl ($scope,$sce,$ionicLoading,$ionicPlatform,$cordovaSQLite,obterClimaSvc){

    $ionicLoading.show({template: "Carregando..."});

    $scope.params = {q:"Lins"};
    $scope.resultado = "";

    $scope.insert = function(textojson) {
        var query = "insert into clima (textojson) values (?)";
        $cordovaSQLite.execute(dbclima, query, [textojson]).then(
            function(result){
                console.log("INSERI");
            }, function(error){
                console.log(error);
            }
        ); // fim do then
    }; // fim do insert

    $scope.select = function(textojson){
        var query = "select textojson from clima where textojson = ?";
        $cordovaSQLite.execute(dbclima,query,[textojson]).then(function(result) {
            if(result.rows.length > 0){
                $scope.resultado = result.rows.item(0).textojson;
                console.log("Achei " + result.rows.item(0).textojson);
            } else {
                $scope.resultado = "Nao ACHEI";
                console.log("Nao achei");
            }

        }, function(error){
            console.log(error);
        });
    }


    $scope.$on("climaApp.clima", function(_, result) {

        $scope.name = result.name;
        $scope.country = result.sys.country;
        $scope.lat = result.coord.lat;
        $scope.lon = result.coord.lon;
        var tmp = result.main.temp / 10.3126;
        $scope.temp = tmp.toFixed(2);
        $scope.pressure = result.main.pressure;
        $scope.humidity = result.main.humidity;
        $scope.speed = result.wind.speed;
        result.weather.forEach(function(b) {
            $scope.description =   b.description;
            $scope.icon        =   "http://openweathermap.org/img/w/"+ b.icon +".png";
        });

        var query = "insert into clima (textojson) values (?)";
        $cordovaSQLite.execute(dbclima, query, [JSON.stringify(result)]).then(
            function(result){
                console.log("INSERI");
            }, function(error){
                console.log(error);
            }
        ); // fim do then

    });


    obterClimaSvc.loadClima($scope.params);


    $scope.obterClimaParam = function(p_city){

        if (p_city!=undefined){

            $scope.params = {};

            $ionicLoading.show({template: "Carregando..."});
            obterClimaSvc.loadClima({q:p_city});
        }
    }

}

