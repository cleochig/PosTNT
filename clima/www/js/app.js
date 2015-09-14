var lerClimas = angular.module("lerClimas", ["ionic"]);

lerClimas.service("lerClimasSvc", ["$http", "$rootScope", lerClimasSvc]);

lerClimas.controller("lerClimasCtrl", ["$scope","$sce","$ionicLoading","$ionicListDelegate","$ionicPlatform","lerClimasSvc", lerClimasCtrl]);

function lerClimasCtrl($scope, $sce, $ionicLoading, $ionicListDelegate, $ionicPlatform, lerClimasSvc) {

    $ionicLoading.show({template: "Carregando..."});

    $scope.deviceReady = false;

    $ionicPlatform.ready(function() {
        $scope.$apply(function() {
            $scope.deviceReady = true;
        });
    });

    $scope.climas = [];
    $scope.params = {};

    $scope.$on("lerClimas.climas", function(_, result) {
        result.forEach(function(b) {
            console.log(b.name);
            $scope.climas.push({
                name: b.name,

            });
        });

	$scope.$broadcast("scroll.infiniteScrollComplete");
			$scope.$broadcast("scroll.refreshComplete");

	});

    $scope.loadMore = function() {
        lerClimasSvc.loadClimas($scope.params);
        $ionicLoading.hide();
    }
    $scope.reload = function() {
        $scope.climas = [];
        $scope.params = {};
        lerClimasSvc.loadClimas();
    }


}

function lerClimasSvc($http, $rootScope) {
    this.loadClimas = function(params) {
        $http.get("http://api.openweathermap.org/data/2.5/weather?q=lins", {params: params})
            .success(function(result) {
                $rootScope.$broadcast("lerClimas.climas", result);
            });
    }
}
