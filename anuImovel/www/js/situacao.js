anuimovelApp.service("obterSituacaoSvc",["$http","$rootScope","$ionicLoading",obterSituacaoSvc]);

function obterSituacaoSvc($http, $rootScope, $ionicLoading){

    this.loadSituacao = function(){
        console.log("Carregando Situações");
        url = "http://localhost:8080/ProjTCCWEB/rest/situacao";
        $http.get(url, {params: ""}).success(
            function(result){
                $ionicLoading.hide();
                console.log("Situação carregada com suecesso");
                $rootScope.$broadcast("anuimovelApp.obterSituacao",result);
            }
        ).error(
            function(result){
                $ionicLoading.hide();
                alert("Erro ao carregar dados");
                console.log("Erro ao carregar situação" + result);
            }
        );
    }

} // Fim do Service

anuimovelApp.service("deleteSituacaoSvc",["$http","$rootScope","$ionicLoading",deleteSituacaoSvc]);

function deleteSituacaoSvc($http, $rootScope, $ionicLoading){

    this.deleteSituacao = function(paramdel){
        console.log("Excluindo Situações");
        url = "http://localhost:8080/ProjTCCWEB/rest/situacao/excluir";
        $http.get(url, {params: paramdel}).success(
            function(result){
                $ionicLoading.hide();
                console.log("Situação excluida com suecesso");
                $rootScope.$broadcast("anuimovelApp.deleteSituacao",result);
            }
        ).error(
            function(result){
                $ionicLoading.hide();
                alert("Erro ao excluir dados");
                console.log("Erro ao excluir situação" + result);
            }
        );
    }

} // Fim do Service


anuimovelApp.service("incluirSituacaoSvc",["$http","$rootScope","$ionicLoading",incluirSituacaoSvc]);
function incluirSituacaoSvc($http, $rootScope, $ionicLoading){

    this.incluirSituacao = function(paramsincluir){
        console.log("Salvando Situação");
        url = "http://localhost:8080/ProjTCCWEB/rest/situacao/salvar";
        $http.get(url, {params: paramsincluir}).success(
            function(result){
                $ionicLoading.hide();
                console.log("Situação salva com suecesso");
                $rootScope.$broadcast("anuimovelApp.incluirSituacao",result);
            }
        ).error(
            function(result){
                $ionicLoading.hide();
                alert("Erro ao salvar dados");
                console.log("Erro ao salvar situação" + result);
            }
        );
    }

} // Fim do Service

anuimovelApp.service("alterarSituacaoSvc",["$http","$rootScope","$ionicLoading",alterarSituacaoSvc]);
function alterarSituacaoSvc($http, $rootScope, $ionicLoading){

    this.alterarSituacao = function(paramsalterar){
        console.log("Alterando Situação");
        url = "http://localhost:8080/ProjTCCWEB/rest/situacao/alterar";
        $http.get(url, {params: paramsalterar}).success(
            function(result){
                $ionicLoading.hide();
                console.log("Situação alterada com suecesso");
                $rootScope.$broadcast("anuimovelApp.alterarSituacao",result);
            }
        ).error(
            function(result){
                $ionicLoading.hide();
                alert("Erro ao alterar dados");
                console.log("Erro ao alterar situação" + result);
            }
        );
    }

} // Fim do Service

anuimovelApp.controller("situacaoCtrl",["$scope","$ionicLoading","$location","$ionicHistory","obterSituacaoSvc","deleteSituacaoSvc","incluirSituacaoSvc","alterarSituacaoSvc",situacaoCtrl]);

function situacaoCtrl($scope, $ionicLoading, $location, $ionicHistory, obterSituacaoSvc, deleteSituacaoSvc,incluirSituacaoSvc,alterarSituacaoSvc) {

    $scope.resultSit = [];

    $scope.item = {id:"",denominacao:"",descricao:""};

    $scope.obterSituacao = function() {
        $ionicLoading.show({template: "Aguarde Carregando"});
        // Invocar um serviço que se comunica com o Rest de Situações
        obterSituacaoSvc.loadSituacao();
        // Função invocada se carregar os dados
        $scope.$on("anuimovelApp.obterSituacao", function(_,result){
            $scope.resultSit = result;
            console.log($scope.resultSit);
            $ionicLoading.hide();
            $scope.limparEdit();
        });//Fim do anuimovelApp.login
    }

    $scope.listEdit = function(id, denominacao, descricao){
        $scope.item = {id:id,denominacao:denominacao,descricao:descricao};
    }

    $scope.limparEdit = function(){
        $scope.item = {id:"",denominacao:"",descricao:""};
    }

    $scope.deleteSituacao = function(id) {
        $ionicLoading.show({template: "Aguarde Excluindo"});
        $scope.paramdel = {id:id};
        // Invocar um serviço que se comunica com o Rest de Situações
        deleteSituacaoSvc.deleteSituacao($scope.paramdel);
        // Função invocada se carregar os dados
        $scope.$on("anuimovelApp.deleteSituacao", function(_,result){
            $scope.resultSit = result;
            console.log($scope.resultSit);
            $ionicLoading.hide();
            $scope.obterSituacao();

        });//Fim do anuimovelApp.deleteSituacao
    }

    $scope.salvarSituacao = function(id,denominacao,descricao){

        if(id == "" ||id == null){
            if ((denominacao.length>0) && (descricao.length>0)) {
                $scope.incluirSituacao(id,denominacao,descricao);
            }
        }else{
            if ((denominacao.length>0) && (descricao.length>0)) {
                $scope.alterarSituacao(id,denominacao,descricao);
            }
        }
    }

    $scope.incluirSituacao = function(id,denominacao,descricao) {
        $ionicLoading.show({template: "Aguarde Incluindo"});
        $scope.paramsincluir = {id:id,denominacao:denominacao,descricao:descricao};
        // Invocar um serviço que se comunica com o Rest de Situações
        incluirSituacaoSvc.incluirSituacao($scope.paramsincluir);
        // Função invocada se carregar os dados
        $scope.$on("anuimovelApp.incluirSituacao", function(_,result){
            $scope.resultSit = result;
            console.log($scope.resultSit);
            $ionicLoading.hide();
            $scope.obterSituacao();

        });//Fim do anuimovelApp.salvarSituacao
    }

    $scope.alterarSituacao = function(id,denominacao,descricao) {
        $ionicLoading.show({template: "Aguarde Alterando"});
        $scope.paramsalterar = {id:id,denominacao:denominacao,descricao:descricao};
        // Invocar um serviço que se comunica com o Rest de Situações
        alterarSituacaoSvc.alterarSituacao($scope.paramsalterar);
        // Função invocada se carregar os dados
        $scope.$on("anuimovelApp.alterarSituacao", function(_,result){
            $scope.resultSit = result;
            console.log($scope.resultSit);
            $ionicLoading.hide();
            $scope.obterSituacao();

        });//Fim do anuimovelApp.alterarSituacao
    }
}
