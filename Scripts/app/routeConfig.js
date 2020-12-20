function appConfig($routeProvider) {
    $routeProvider
        .when('/',
            {
                templateUrl: 'Templates/weatherData.html',
                controller: 'appCtrl'
            })
        .otherwise({
            redirectTo: '/'
        });
}
app.config(appConfig);