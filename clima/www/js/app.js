
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

        $cordovaSQLite.execute(dbclima, "CREATE TABLE IF NOT EXISTS clima (textojson text, dtjson text)");

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
             //alert("Requisição Falhou");
            $rootScope.$broadcast("climaApp.clima",result);
            $ionicLoading.hide();
        });
    }
}

function climaCtrl ($scope,$sce,$ionicLoading,$ionicPlatform,$cordovaSQLite,obterClimaSvc){

    $ionicLoading.show({template: "Carregando..."});


    $scope.params = {q:"Lins"};
    $scope.resultado = "";

    var date = new Date();
    var month = date.getMonth()+ 1;
    $scope.dateString = date.getDate() + "/" + month + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

    console.log($scope.dateString);

    obterClimaSvc.loadClima($scope.params);
/*
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
*/

    $scope.$on("climaApp.clima", function(_, result) {

        console.log("Aqui 01");
        // Verifica se teve retorno do serviço http
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
            var query = "insert into clima (textojson,dtjson) values (?,?)";
            $cordovaSQLite.execute(dbclima, query, [JSON.stringify(result),$scope.dateString]).then(
                function(result){
                    console.log("INSERI");
                }, function(error){
                    console.log(error);
                }
            ); // fim do then
        }

        // Buscando os dados na tabela
        var query = "select textojson, dtjson from clima";
        $cordovaSQLite.execute(dbclima,query,[]).then(function(result) {
            if(result.rows.length > 0){

                var climaJson = JSON.parse(result.rows.item(0).textojson);

                $scope.dtclimaJson = result.rows.item(0).dtjson;

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


    $scope.obterClimaParam = function(p_city){

        if (p_city!=undefined){

            $scope.params = {};

            $ionicLoading.show({template: "Carregando..."});
            obterClimaSvc.loadClima({q:p_city});
        }
    }

}
