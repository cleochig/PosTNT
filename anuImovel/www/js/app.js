var anuimovelApp = angular.module('starter', ['ionic'])

anuimovelApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl',
                cache: false
            })
            .state('situacao', {
                url: '/situacao',
                templateUrl: 'templates/situacao.html',
                controller: 'valCtrl',
                cache: false
            });
        $urlRouterProvider.otherwise('/situacao');
});


anuimovelApp.controller("valCtrl", function($scope, $location, $ionicHistory, $ionicPopup) {

    console.log(window.localStorage.getItem("auth"));

    if(window.localStorage.getItem("auth") == "-1" ||window.localStorage.getItem("auth") == "-2"){

        var alertPopup = $ionicPopup.alert({
            title: 'Autenticação!',
            template: 'Usuário ou Senha Invalidos'
        });

        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $location.path("/login");
    }
    $scope.status = "Bem Vindo!!";

    $scope.logout = function() {
        window.localStorage.setItem("auth", "-1");
        $location.path("/login");
    }
});


anuimovelApp.controller("loginCtrl",["$scope","$ionicLoading","$location","$ionicHistory","loginSvc",loginCtrl]);

function loginCtrl($scope, $ionicLoading, $location, $ionicHistory, loginSvc) {

    $scope.login = function(username,password) {

        $ionicLoading.show({template: "Aguarde Carregando"});

        // Seta por default -1 Não Autenticado
        window.localStorage.setItem("auth","-1");

        $scope.params = {nomusuario:username,senusuario:password};

        // Invocar um serviço que se comunica com o Login
        loginSvc.loadLogin($scope.params);


        // Função invocada se carregar os dados
        $scope.$on("anuimovelApp.login", function(_,result){

            // Seta o valor do retorno do login no localStorage
            window.localStorage.setItem("auth",result.codigo);

            $ionicLoading.hide();

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

            $location.path("/situacao");

        });//Fim do anuimovelApp.login

    }
}

anuimovelApp.service("loginSvc",["$http","$rootScope","$ionicLoading",loginSvc]);

function loginSvc($http, $rootScope, $ionicLoading){

    this.loadLogin = function(params){
        console.log("Carregando login");
        url = "http://localhost:8080/ProjTCCWEB/rest/login/valida";
        $http.get(url, {params: params}).success(
            function(result){
                $ionicLoading.hide();
                console.log("Login carregado com suecesso");
                $rootScope.$broadcast("anuimovelApp.login",result);
            }
        ).error(
            function(result){
                $ionicLoading.hide();
                alert("Erro ao carregar dados");
                console.log("Erro ao carregar login" + result);
            }
        );
    }
} // Fim do Service
