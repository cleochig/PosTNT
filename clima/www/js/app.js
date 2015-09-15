
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

        $cordovaSQLite.execute(dbclima, "DROP TABLE clima");
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

    $scope.select = function(){
        var query = "select textojson from clima";
        $cordovaSQLite.execute(dbclima,query,[]).then(function(result) {
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

        if (result.name!=null){

            // Deletando os dados da tabela
            var query = "delete from clima";
            $cordovaSQLite.execute(dbclima, query, []).then(
                function(result){
                    console.log("APAGOU");
                }, function(error){
                    console.log(error);
                }
            ); // fim do then

            // Inserindo os dados na tabela
            var query = "insert into clima (textojson) values (?)";
            $cordovaSQLite.execute(dbclima, query, [JSON.stringify(result)]).then(
                function(result){
                    console.log("INSERI");
                }, function(error){
                    console.log(error);
                }
            ); // fim do then
        }

        // Buscando os dados na tabela
        var query = "select textojson from clima";
        $cordovaSQLite.execute(dbclima,query,[]).then(function(result) {
            if(result.rows.length > 0){

                var climaJson = JSON.parse(result.rows.item(0).textojson);

                $scope.name = climaJson.name;
                $scope.country = climaJson.sys.country;
                $scope.lat = climaJson.coord.lat;
                $scope.lon = climaJson.coord.lon;

                //Convertendo Kelvin para Celsius
                var tmp = climaJson.main.temp - 273;
                $scope.temp = tmp.toFixed(2);

                $scope.pressure = climaJson.main.pressure;
                $scope.humidity = climaJson.main.humidity;
                $scope.speed = climaJson.wind.speed;

                climaJson.weather.forEach(function(b) {
                    $scope.description =   b.description;
                    $scope.icon        =   "http://openweathermap.org/img/w/"+ b.icon +".png";
                });

            } else {
                $scope.resultado = "Nao ACHEI";
                console.log("Nao achei");
            }

        }, function(error){
            console.log(error);
        });


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

