//WEATHER FORM
var WF = {
    //Querying WF elements
    unitButtonsEl: document.querySelectorAll('input[name="unit"]'),
    citySearchEl: document.querySelector('.city-search'),
    citiesListEL: document.querySelector('.cities-list'),
    //Defining WF variables
    statartup: true,
    cityData: undefined,
    selectedCity: {
        name: undefined,
        lat: undefined,
        lng: undefined,
    },
    selectedUnit: undefined,
    //----------
    attachListeners: function(){
        //Attaches listeners to the toggle input and fires the update dashboard method
        this.unitButtonsEl.forEach(radioButton => {
            radioButton.addEventListener('click', function(){
                var unitValue = document.querySelector('input[name="unit"]:checked').value;
                if(WF.selectedUnit != unitValue){
                    WF.selectedUnit = unitValue;
                    if(!WF.statartup){
                        WD.updateDashboard();
                    }
                };
            });
        });
        //Attaches listeners to the search input and fires the search method
        this.citySearchEl.addEventListener('input', function(){
            if(WF.citySearchEl.value != ''){
                WF.searchCityData(WF.citySearchEl.value);
            } else {
                WF.citiesListEL.innerHTML = '';
            };
        });
        this.citySearchEl.addEventListener('blur', function(){
            WF.citySearchEl.value ='';
            WF.citiesListEL.innerHTML = '';
        });
        //Attaches listeners to the suggestions list and fires get weather method
        this.citiesListEL.addEventListener('mousedown', function(e){
            if(e.target.tagName == 'LI'){
                WF.selectedCity.name = e.target.getAttribute('name');
                WF.citySearchEl.setAttribute('placeholder', WF.selectedCity.name);
                WF.citySearchEl.value = '';
                WF.citiesListEL.innerHTML = '';
                WD.getWeatherData(e.target.dataset.lat, e.target.dataset.lng);
            };
        });
    },
    setUnit: function(unit){
        //Clicks on a unit button
        if(unit == 'imperial'){
            WF.unitButtonsEl[1].click();
        } else {
            WF.unitButtonsEl[0].click();
        }
    },
    getCityData: function(){
        //Updates the city data and fires a dashboard update
        fetch('data/cities.json').then(function(response){
            return response.json();
        }).then(function(data){
            WF.cityData = data;
        }).catch(function(error){
            console.error(error);
        });
    },
    searchCityData: function(value){
        //Searches the city data
        var maxResCuount = 10;
        function normalLC(string){
            //Removes accents, spaces and sets to lower case
            return string.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();;
        }
        this.citiesListEL.innerHTML = '';
        var res = WF.cityData.filter(city => normalLC(city.name).includes(normalLC(value)));
        if (res.length < maxResCuount){
            for(var i = 0; i < res.length; i++){
                WF.createSuggestions(res[i].country,res[i].name, res[i].lat, res[i].lng);
            }
        } else {
            for(var i = 0; i < maxResCuount; i++){
                WF.createSuggestions(res[i].country, res[i].name, res[i].lat, res[i].lng);
            }
        }
    },
    createSuggestions: function(counry, name, lat, lng){
        //Creates a suggested city list item
        var suggestionEl = document.createElement('LI');
        suggestionEl.textContent = name + ' (' + counry + ')';
        suggestionEl.setAttribute('name', name);
        suggestionEl.setAttribute('data-lat', lat);
        suggestionEl.setAttribute('data-lng', lng);
        this.citiesListEL.appendChild(suggestionEl);
    },
}

//WEATHER DASHBOARD
var WD = {
    //Querying WD elements
    dashboardWrapper: document.querySelector('.dashboard-wrapper'),
    currentDateEl: document.querySelector('.current-date'),
    currentTempValueEl: document.querySelector('.current-temp-value'),
    currentTempUnitEl: document.querySelector('.current-temp-unit'),
    currentConditionImageEl: document.querySelector('.current-condition-image'),
    currentConditionTextEl: document.querySelector('.current-condition-text'),
    currentFeelsLikeValueEl: document.querySelector('.current-feels_like-value'),
    currentFeelsLikeUnitEl: document.querySelector('.current-feels_like-unit'),
    hrTemperatureEl: document.getElementById('hr-temperature').getContext('2d'),


    //Defining WD variable
    weatherData: undefined,
    //----------
    getWeatherData: function(lat, lng){
        //Updates the weather data and fires a dashboard update
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lng+'&appid=031226dd1a2e459460726962ea5095fa').then(function(response){
            return response.json();
        }).then(function(data){
            console.log(data);
            WD.weatherData = data;
            WD.updateDashboard();
        }).catch(function(error){
            console.error(error);
        });
    },
    //Updates the dashboard UI elements
    updateDashboard: function(){
        if(WF.statartup){
            this.dashboardWrapper.style.display = 'block';
            WF.statartup = false;
        };
        //Setting date
        var currentDateObject = new Date(this.weatherData.current.dt * 1000);
        WD.currentDateEl.textContent = currentDateObject.toDateString();
        //Setting image and condition
        var iconNumber = this.weatherData.current.weather[0].icon;
        WD.currentConditionImageEl.setAttribute('src', 'assets/' + iconNumber + '.svg');
        WD.currentConditionTextEl.textContent = this.weatherData.current.weather[0].description;
        //Setting current temperature
        if(WF.selectedUnit == 'imperial'){
            this.currentTempValueEl.textContent = Math.round(this.weatherData.current.temp * 9 / 5 - 459.67);
            this.currentTempUnitEl.textContent = '°F';
            this.currentFeelsLikeValueEl.textContent = Math.round(this.weatherData.current.feels_like * 9 / 5 - 459.67);
            this.currentFeelsLikeUnitEl.textContent = '°F';
        } else {
            this.currentTempValueEl.textContent = Math.round(this.weatherData.current.temp - 273.15);
            this.currentTempUnitEl.textContent = '°C';
            this.currentFeelsLikeValueEl.textContent = Math.round(this.weatherData.current.feels_like - 273.15);
            this.currentFeelsLikeUnitEl.textContent = '°C';
        };
        //Setting chart labels
        var hrDataPoints = 24; //max 48
        var chartHours = new Array;
        for(var i = 0; i < hrDataPoints; i++){
            var hourlyDateObject = new Date(this.weatherData.hourly[i].dt * 1000);
            chartHours.push(hourlyDateObject.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }));
        };
        // var chartCondition = new Array;
        // for(var i = 0; i < hrDataPoints; i++){
        //     chartCondition.push(this.weatherData.hourly[i].weather[0].main);
        // };
        // var chartLabels = new Array;
        // for(var i = 0; i < hrDataPoints; i++){
        //     chartLabels.push([chartHours[i],chartCondition[i]]);
        // };

        //Setting chart data
        var chartTemp = new Array;
        for(var i = 0; i < hrDataPoints; i++){
            if(WF.selectedUnit == 'imperial'){
                chartTemp.push(Math.round(this.weatherData.hourly[i].temp * 9 / 5 - 459.67));
            } else {
                chartTemp.push(Math.round(this.weatherData.hourly[i].temp - 273.15));
            };
        };
        var chartTempMin = Math.min.apply(Math, chartTemp);
        var chartTempMax = Math.max.apply(Math, chartTemp);
        //Instantiating hourly chart
        if(window.bar != undefined) 
        window.bar.destroy(); 
        Chart.defaults.global.defaultFontFamily = '"Poppins", sans-serif';
        window.bar = new Chart(this.hrTemperatureEl, {
            type:'line',
            data: {
                labels: chartHours,
                datasets: [{
                    label: 'Temperature',
                    data: chartTemp,
                }],
            },
            options: { 
                layout: {
                    padding: {
                        top: 24,
                    }
                },
                tooltips: {
                    enabled: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            display: false,
                            suggestedMin: chartTempMin - 1,
                            suggestedMax: chartTempMax + 1,
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'rgba(255, 255, 255, 0.50)',
                            padding: 6,
                        },
                    }],
                },
                plugins: {
                    datalabels: {
                        formatter: function(value) {
                            return value + '°';
                        },
                        align: 'top',
                        color: '#fff',
                    }
                }, 
            },
        });
    },
}

//INITIALIZATION
WF.getCityData();
WF.setUnit(WF.selectedUnit);
WF.attachListeners();
