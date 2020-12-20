var controllerProvider = null;
var app = angular.module('myWeatherApp', ['ng', 'ngRoute'], [
    "$controllerProvider", function ($controllerProvider) {
        controllerProvider = $controllerProvider;
    }
]);
