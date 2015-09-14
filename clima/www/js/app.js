//Temperatura, Umidade, Vento, nome da cidade, Ícone da Temperatura no momento, pressão, vento, latitude e longitude, Descricao

var clima = angular.module("clima",["ionic"]);

// Declarando o serviço e injetando dependencias
clima.service("climaSvc",["$http","$rootScope",climaSvc]);

// Declarenaod o controlador e injetando dependencias
clima.controller("climaCtrl",["$scope","$sce","$ionicLoading","$ionicListDelegate","$ionicPlatform","climaSvc", climaCtrl]);

function climaSvc($http, $rootScope){

    this.loadClimas = function(params){

        $http.get("http://api.openweathermap.org/data/2.5/weather?q=?", {params: params}).success(function(result){

        });
    }

}
