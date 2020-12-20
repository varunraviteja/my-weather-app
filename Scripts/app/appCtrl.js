app.controller('appCtrl', function ($scope) {

    $scope.onLoad = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                if (position != null && position.coords != null) {
                    var apiUrl = weatherAppUrl.replace('{0}', 'lat=' + position.coords.latitude + '&lon=' + position.coords.longitude);
                    $scope.getWeatherData(apiUrl);
                }
            });
        }
    }

    // This should be coming from Server config using API
    var apiKey = '23a51dcd8b5a43fb9c84ef4eb46005cf';
    var weatherAppUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?{0}&key=23a51dcd8b5a43fb9c84ef4eb46005cf';
    $scope.weatherData = {};

    $scope.onSearchClick = function () {
        if ($scope.zipCode != null && $scope.zipCode != '') {
            var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.zipCode);
            if (isValidZip) {
                var apiUrl = weatherAppUrl.replace('{0}', 'postal_code=' + $scope.zipCode);
                $scope.weatherData = {};
                $scope.getWeatherData(apiUrl);
            } else {
                alert('Please enter valid US ZipCode');
                $scope.zipCode = '';
            }
        } else {
            alert('Please enter US ZipCode first.');
        }
    }

    $scope.getWeatherData = function (apiUrl) {
        $.get(apiUrl, function (data) {
            console.log(data);
            $scope.weatherData = $scope.transformData(data);
            $scope.$apply();
        });
    }

    $scope.getFormattedDateTime = function (input, format) {
        return moment(input).format(format);
    }

    $scope.transformData = function (response) {
        if (response != null) {
            var weatherData = {
                cityName: response.city_name,
                countryCode: response.country_code,
                todayDateTime: $scope.getFormattedDateTime(response.data[0].datetime, 'dddd, Do MMMM'),
                weatherConditionIcon: 'https://www.weatherbit.io/static/img/icons/' + response.data[0].weather.icon + '.png',
                weatherCondition: response.data[0].weather.description,
                currentTemp: response.data[0].temp,
                minTemp: response.data[0].low_temp,
                maxTemp: response.data[0].max_temp,
                windSpeed: response.data[0].wind_spd != null ? response.data[0].wind_spd.toFixed(2) : 0,
                precip: response.data[0].pop,
                uv: response.data[0].uv != null ? response.data[0].uv.toFixed(2) : 0,
                windDir: response.data[0].wind_cdir_full,
                forcastDays: []
            };

            for (var i = 1; i < 8; i++) {
                var x = response.data[i];
                if (x != null) {
                    weatherData.forcastDays.push({
                        day: $scope.getFormattedDateTime(x.datetime, 'dddd'),
                        date: $scope.getFormattedDateTime(x.datetime, 'DD/MM'),
                        minTemp: x.low_temp,
                        maxTemp: x.max_temp,
                        windSpeed: x.wind_spd != null ? x.wind_spd.toFixed(2) : 0,
                        weatherConditionIcon: 'https://www.weatherbit.io/static/img/icons/' + x.weather.icon + '.png',
                        weatherCondition: x.weather.description,
                        precip: x.pop,
                    });
                }
            }
            return weatherData;
        }
    }

});
