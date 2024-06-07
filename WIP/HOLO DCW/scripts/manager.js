const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playground format
const createScene = function () {
    const scene = new BABYLON.Scene(engine);
    
    // Camera
    const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -12.2), scene)
    camera.viewport.height = 3.5;
    camera.viewport.width = 3.5;
    camera.viewport.x = -1.25;
    camera.viewport.y = -1.25;

    const light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 3;
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    
    // Text & Lines
    const advancedTexturePlane = BABYLON.Mesh.CreatePlane("advancedTexturePlane", 4);
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(advancedTexturePlane);

    const alignmentMap = {
      "left": BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
      "right": BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      "center": BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    };

    const secondsDot = new BABYLON.GUI.TextBlock();
    setupGuiText(secondsDot, 35, "normal", "white", 0.5, -330, -270, "•", "right")
    secondsDot.isVisible = false;
    
    const cityText = new BABYLON.GUI.TextBlock();
    setupGuiText(cityText, 35, "normal", "white", 1, -320, 270, "Welcome!", "left")

    const dateText = new BABYLON.GUI.TextBlock();
    setupGuiText(dateText, 25, "bold", "white", 1, -280, 270, "Please select a city.", "left")
    
    const timeText = new BABYLON.GUI.TextBlock();
    setupGuiText(timeText, 55, "bold", "white", 1, -210, 270, "", "left")

    const ampmText = new BABYLON.GUI.TextBlock();
    setupGuiText(ampmText, 25, "bold", "white", 1, -220, 425, "", "left")

    const currentTempText = new BABYLON.GUI.TextBlock();
    setupGuiText(currentTempText, 35, "bold", "white", 1, -135, 270, "", "left")

    const feelsLikeText = new BABYLON.GUI.TextBlock();
    setupGuiText(feelsLikeText, 25, "normal", "white", 1, -100, 270, "", "left")

    const lineOne = new BABYLON.GUI.Line();
    setupGuiLine(lineOne, 3, "white", 270, 455, 750, 455)
    lineOne.isVisible = false;

    const lineTwo = new BABYLON.GUI.Line();
    setupGuiLine(lineTwo, 3, "white", 270, 660, 750, 660)
    lineTwo.isVisible = false;

    const nextDayOneNameText = new BABYLON.GUI.TextBlock();
    setupGuiText(nextDayOneNameText, 20, "bold", "white", 1, 185, -180, "", "center")
    const nextDayOneTempText = new BABYLON.GUI.TextBlock();
    setupGuiText(nextDayOneTempText, 20, "normal", "white", 1, 315, -180, "", "center")

    const nextDayTwoNameText = new BABYLON.GUI.TextBlock();
    setupGuiText(nextDayTwoNameText, 20, "bold", "white", 1, 185, -60, "", "center")
    const nextDayTwoTempText = new BABYLON.GUI.TextBlock();
    setupGuiText(nextDayTwoTempText, 20, "normal", "white", 1, 315, -60, "", "center")

    const nextDayThreeNameText = new BABYLON.GUI.TextBlock();
    setupGuiText(nextDayThreeNameText, 20, "bold", "white", 1, 185, 60, "", "center")
    const nextDayThreeTempText = new BABYLON.GUI.TextBlock();
    setupGuiText(nextDayThreeTempText, 20, "normal", "white", 1, 315, 60, "", "center")

    const nextDayFourNameText = new BABYLON.GUI.TextBlock();
    setupGuiText(nextDayFourNameText, 20, "bold", "white", 1, 185, 180, "", "center")
    const nextDayFourTempText = new BABYLON.GUI.TextBlock();
    setupGuiText(nextDayFourTempText, 20, "normal", "white", 1, 315, 180, "", "center")
    
    function setupGuiText(textBlock, size, style, color, alpha, top, left, text, alignment){
      textBlock.fontSize = size;
      textBlock.fontStyle = style;
      textBlock.color = color;
      textBlock.alpha = alpha;
      textBlock.top = top; 
      textBlock.left = left;
      textBlock.text = text;
      textBlock.textHorizontalAlignment = alignmentMap[alignment]
      advancedTexture.addControl(textBlock);
    }

    function setupGuiLine(line, width, color, x1, y1, x2, y2){
      line.lineWidth = width;
      line.color = color;
      line.x1 = x1;
      line.y1 = y1;
      line.x2 = x2;
      line.y2 = y2;
      advancedTexture.addControl(line);
    }

    // Middle Stuff Y Position
    const middleOnePosX = -0.705;
    const middleTwoPosX = -0.235;
    const middleThreePosX = 0.235;
    const middleFourPosX = 0.705;
    const allMiddlePosX = [middleOnePosX, middleTwoPosX, middleThreePosX, middleFourPosX]

    // Icon Position & Scale
    const currentIconPos = new BABYLON.Vector3(0.35, 0.725, 0);
    const currentIconScele = new BABYLON.Vector3(1, 1, 1);
    
    const nextDayOneIconPos = new BABYLON.Vector3(-0.705, -0.96, 0); 
    const nextDayTwoIconPos = new BABYLON.Vector3(-0.235, -0.96, 0); 
    const nextDayThreeIconPos = new BABYLON.Vector3(0.235, -0.96, 0); 
    const nextDayFourIconPos = new BABYLON.Vector3(0.705, -0.96, 0); 
    const nextDayIconScale = new BABYLON.Vector3(0.4, 0.4, 0.4);

    // All Next Day Arrays
    const allNextDayNameText = [nextDayOneNameText, nextDayTwoNameText, nextDayThreeNameText, nextDayFourNameText]
    const allNextDayTempText = [nextDayOneTempText, nextDayTwoTempText, nextDayThreeTempText, nextDayFourTempText]
    const allNextDayIconPos = [nextDayOneIconPos, nextDayTwoIconPos, nextDayThreeIconPos, nextDayFourIconPos]

    // Model
    BABYLON.SceneLoader.Append("assets/", "model.glb", scene, async function(scene) {

      var fontArialRegular = await (await fetch("data/Arial_Regular.json")).json();
      var fontArialBold = await (await fetch("data/Arial_Bold.json")).json();

      // Meshes
      const wIcon0d = scene.getMeshByName("wIcon0d");
      const wIcon0n = scene.getMeshByName("wIcon0n");
      const wIcon1d_primitive0 = scene.getMeshByName("wIcon1d_primitive0");
      const wIcon1d_primitive1 = scene.getMeshByName("wIcon1d_primitive1");
      const wIcon1n_primitive0 = scene.getMeshByName("wIcon1n_primitive0");
      const wIcon1n_primitive1 = scene.getMeshByName("wIcon1n_primitive1");
      const wIcon2d_primitive0 = scene.getMeshByName("wIcon2d_primitive0");
      const wIcon2d_primitive1 = scene.getMeshByName("wIcon2d_primitive1");
      const wIcon2n_primitive0 = scene.getMeshByName("wIcon2n_primitive0");
      const wIcon2n_primitive1 = scene.getMeshByName("wIcon2n_primitive1");
      const wIcon3_primitive0 = scene.getMeshByName("wIcon3_primitive0");
      const wIcon3_primitive1 = scene.getMeshByName("wIcon3_primitive1");
      const wIcon45_primitive0 = scene.getMeshByName("wIcon45_primitive0");
      const wIcon45_primitive1 = scene.getMeshByName("wIcon45_primitive1");
      const wIcon48_primitive0 = scene.getMeshByName("wIcon48_primitive0");
      const wIcon48_primitive1 = scene.getMeshByName("wIcon48_primitive1");
      const wIcon51_primitive0 = scene.getMeshByName("wIcon51_primitive0");
      const wIcon51_primitive1 = scene.getMeshByName("wIcon51_primitive1");
      const wIcon53_primitive0 = scene.getMeshByName("wIcon53_primitive0");
      const wIcon53_primitive1 = scene.getMeshByName("wIcon53_primitive1");
      const wIcon55_primitive0 = scene.getMeshByName("wIcon55_primitive0");
      const wIcon55_primitive1 = scene.getMeshByName("wIcon55_primitive1");
      const wIcon56_primitive0 = scene.getMeshByName("wIcon56_primitive0");
      const wIcon56_primitive1 = scene.getMeshByName("wIcon56_primitive1");
      const wIcon57_primitive0 = scene.getMeshByName("wIcon57_primitive0");
      const wIcon57_primitive1 = scene.getMeshByName("wIcon57_primitive1");
      const wIcon61_primitive0 = scene.getMeshByName("wIcon61_primitive0");
      const wIcon61_primitive1 = scene.getMeshByName("wIcon61_primitive1");
      const wIcon63_primitive0 = scene.getMeshByName("wIcon63_primitive0");
      const wIcon63_primitive1 = scene.getMeshByName("wIcon63_primitive1");
      const wIcon65_primitive0 = scene.getMeshByName("wIcon65_primitive0");
      const wIcon65_primitive1 = scene.getMeshByName("wIcon65_primitive1");
      const wIcon66_primitive0 = scene.getMeshByName("wIcon66_primitive0");
      const wIcon66_primitive1 = scene.getMeshByName("wIcon66_primitive1");
      const wIcon67_primitive0 = scene.getMeshByName("wIcon67_primitive0");
      const wIcon67_primitive1 = scene.getMeshByName("wIcon67_primitive1");
      const wIcon71_primitive0 = scene.getMeshByName("wIcon71_primitive0");
      const wIcon71_primitive1 = scene.getMeshByName("wIcon71_primitive1");
      const wIcon73_primitive0 = scene.getMeshByName("wIcon73_primitive0");
      const wIcon73_primitive1 = scene.getMeshByName("wIcon73_primitive1");
      const wIcon75_primitive0 = scene.getMeshByName("wIcon75_primitive0");
      const wIcon75_primitive1 = scene.getMeshByName("wIcon75_primitive1");
      const wIcon77_primitive0 = scene.getMeshByName("wIcon77_primitive0");
      const wIcon77_primitive1 = scene.getMeshByName("wIcon77_primitive1");
      const wIcon80_primitive0 = scene.getMeshByName("wIcon80_primitive0");
      const wIcon80_primitive1 = scene.getMeshByName("wIcon80_primitive1");
      const wIcon81_primitive0 = scene.getMeshByName("wIcon81_primitive0");
      const wIcon81_primitive1 = scene.getMeshByName("wIcon81_primitive1");
      const wIcon82_primitive0 = scene.getMeshByName("wIcon82_primitive0");
      const wIcon82_primitive1 = scene.getMeshByName("wIcon82_primitive1");
      const wIcon85_primitive0 = scene.getMeshByName("wIcon85_primitive0");
      const wIcon85_primitive1 = scene.getMeshByName("wIcon85_primitive1");
      const wIcon86_primitive0 = scene.getMeshByName("wIcon86_primitive0");
      const wIcon86_primitive1 = scene.getMeshByName("wIcon86_primitive1");
      const wIcon95_primitive0 = scene.getMeshByName("wIcon95_primitive0");
      const wIcon95_primitive1 = scene.getMeshByName("wIcon95_primitive1");
      const wIcon96_primitive0 = scene.getMeshByName("wIcon96_primitive0");
      const wIcon96_primitive1 = scene.getMeshByName("wIcon96_primitive1");
      const wIcon99_primitive0 = scene.getMeshByName("wIcon99_primitive0");
      const wIcon99_primitive1 = scene.getMeshByName("wIcon99_primitive1");

      let weatherIcons = [
        wIcon0d,wIcon0n,wIcon1d_primitive0,wIcon1d_primitive1,wIcon1n_primitive0,wIcon1n_primitive1,wIcon2d_primitive0,wIcon2d_primitive1,wIcon2n_primitive0, wIcon2n_primitive1,wIcon3_primitive0,wIcon3_primitive1,wIcon45_primitive0,wIcon45_primitive1,wIcon48_primitive0,wIcon48_primitive1,wIcon51_primitive0,wIcon51_primitive1,wIcon53_primitive0,wIcon53_primitive1,wIcon55_primitive0,wIcon55_primitive1,wIcon56_primitive0,wIcon56_primitive1,wIcon57_primitive0,wIcon57_primitive1,wIcon61_primitive0,wIcon61_primitive1,wIcon63_primitive0,wIcon63_primitive1,wIcon65_primitive0,wIcon65_primitive1,wIcon66_primitive0,wIcon66_primitive1,wIcon67_primitive0,wIcon67_primitive1,wIcon71_primitive0,wIcon71_primitive1,wIcon73_primitive0,wIcon73_primitive1,wIcon75_primitive0,wIcon75_primitive1,wIcon77_primitive0,wIcon77_primitive1,wIcon80_primitive0,wIcon80_primitive1,wIcon81_primitive0, wIcon81_primitive1,wIcon82_primitive0,wIcon82_primitive1,wIcon85_primitive0,wIcon85_primitive1,wIcon86_primitive0,wIcon86_primitive1,wIcon95_primitive0,wIcon95_primitive1,wIcon96_primitive0,wIcon96_primitive1,wIcon99_primitive0,wIcon99_primitive1,
      ];

      for(let i = 0; i < weatherIcons.length; i++){
        weatherIcons[i].isVisible = false;
      };

      // Materials      
      const wIconMat1 =  scene.getMaterialByName("wIconMat1");
      const wIconMat2 =  scene.getMaterialByName("wIconMat2");
      const wIconMat3 =  scene.getMaterialByName("wIconMat3");

      wIconMat1.albedoColor = new BABYLON.Color3.FromHexString("#FFD600").toLinearSpace()
      wIconMat1.unlit = true;

      wIconMat2.albedoColor = new BABYLON.Color3.FromHexString("#FFFFFF").toLinearSpace()
      wIconMat2.unlit = true;

      wIconMat3.albedoColor = new BABYLON.Color3.FromHexString("#FFFFFF").toLinearSpace()
      wIconMat3.unlit = true;
      wIconMat3.transparencyMode = 2;
      wIconMat3.alpha = 0.25;

      const barBgMat = new BABYLON.PBRMaterial("barBgMat", scene);
      barBgMat.albedoColor = new BABYLON.Color3.FromHexString("#FFFFFF").toLinearSpace()
      barBgMat.unlit = true;
      barBgMat.transparencyMode = 2;
      barBgMat.alpha = 0.125;

      // Shaders
      const LeftViewShader = new BABYLON.NodeMaterial("LeftViewShader");
      LeftViewShader.loadAsync("assets/LeftViewShader.json").then(() => {
        LeftViewShader.build(false);
      });
      const FrontViewShader = new BABYLON.NodeMaterial("FrontViewShader");
      FrontViewShader.loadAsync("assets/FrontViewShader.json").then(() => {
        FrontViewShader.build(false);
      });
      const RightViewShader = new BABYLON.NodeMaterial("RightViewShader");
      RightViewShader.loadAsync("assets/RightViewShader.json").then(() => {
        RightViewShader.build(false);
      });
      const allShaders = [LeftViewShader, FrontViewShader, RightViewShader];

      // Bar Chart
      const lineMiddle = -0.575;
      const chartBarHeight = 0.4;
      const chartBarWidth = 0.2;
      let allChartBarMeshes = [];
      for (i=0; i < allMiddlePosX.length; i++) {
        const chartBarBgMesh = BABYLON.MeshBuilder.CreatePlane("chartBarBgMesh", {height: chartBarHeight, width: chartBarWidth});
        chartBarBgMesh.position.x = allMiddlePosX[i];
        chartBarBgMesh.position.y = lineMiddle + chartBarHeight / 2;
        chartBarBgMesh.material = barBgMat;
        chartBarBgMesh.isVisible = false;
        allChartBarMeshes.push(chartBarBgMesh);
      }

      // Enter Looking Glass
      const button = document.getElementById("xrButton");
      button.addEventListener("click", async () => {
        const xrHelper = await BABYLON.WebXRExperienceHelper.CreateAsync(scene);
        await xrHelper.enterXRAsync("immersive-vr", "local-floor");
      });

      // https://open-meteo.com/en/docs/#hourly=temperature_2m
      const citiesInput = document.getElementById("citiesInput");
      const citiesList = document.getElementById("citiesList");

      let selectedCity = {
        name: undefined,
        country: undefined,
        lat: undefined,
        lng: undefined,
      };

      let tempUnit = "celsius";
      tempUnitSymbol = "°C"
      let timeFormat = false;

      // Fetches cities data from json
      let cityData
      function getCityData(){
        fetch("data/cities.json").then(function(response){
          return response.json();
        }).then(function(data){
          cityData = data;
        }).catch(function(error){
          console.error(error);
        });
      }
      getCityData()

      //Attaches listeners to the search input and fires the search method
      citiesInput.addEventListener("input", function(){
        if(citiesInput.value != ""){
          searchCityData(citiesInput.value);
        } else {
          citiesList.innerHTML = "";
        };
      });

      citiesInput.addEventListener("blur", function(){
          citiesInput.value ="";
          citiesList.innerHTML = "";
      });

      //Attaches listeners to the suggestions list and fires get weather method
      citiesList.addEventListener("mousedown", function(e){
        if(e.target.tagName == "LI"){
          selectedCity.name = e.target.dataset.name;
          selectedCity.country = e.target.dataset.country;
          selectedCity.lat = e.target.dataset.lat;
          selectedCity.lng = e.target.dataset.lng;
          citiesInput.setAttribute("placeholder", selectedCity.name + ", " + selectedCity.country);
          citiesInput.value = "";
          citiesList.innerHTML = "";
          getWeatherData(selectedCity.lat, selectedCity.lng, tempUnit);
        };
      });

      //Searches the city data
      function searchCityData(value){
        let maxResCuount = 50;
        function normalLC(string){
          return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();;
        }
        citiesList.innerHTML = "";
        let res = cityData.filter(city => normalLC(city.name).includes(normalLC(value)));
        if (res.length < maxResCuount){
          for(let i = 0; i < res.length; i++){
            createSuggestion(res[i].country,res[i].name, res[i].lat, res[i].lng);
          }
        } else {
          for(let i = 0; i < maxResCuount; i++){
            createSuggestion(res[i].country, res[i].name, res[i].lat, res[i].lng);
          }
        }
      }

      // Creates a city sugestion and it appends it to the cities list
      function createSuggestion(country, name, lat, lng){
        let citySuggestion = document.createElement("LI");
        citySuggestion.textContent = name + ", " + country;
        citySuggestion.setAttribute("data-name", name);
        citySuggestion.setAttribute("data-country", country);
        citySuggestion.setAttribute("data-lat", lat);
        citySuggestion.setAttribute("data-lng", lng);
        citiesList.appendChild(citySuggestion);
      }


      // Time format toggle
      let timeFormat24 = document.getElementById("timeFormat24")
      timeFormat24.addEventListener("change", function() {
        if(this.checked){
          timeFormat = false;
        }
        updateDateTime()
        updateWeatherData()
      });
      let timeFormat12 = document.getElementById("timeFormat12");
      timeFormat12.addEventListener("change", function() {
        if(this.checked){
          timeFormat = true;
        }
        updateDateTime()
        updateWeatherData()
      });
      timeFormat24.checked = true;

      // Temperature unit toggle
      let celsiusTempUnit = document.getElementById("celsiusTempUnit")
      celsiusTempUnit.addEventListener("change", function() {
        if(this.checked){
          tempUnit = "celsius"
          updateWeatherData()
        }
      });
      let fahrenheitTempUnit = document.getElementById("fahrenheitTempUnit");
      fahrenheitTempUnit.addEventListener("change", function() {
        if(this.checked){
          tempUnit = "fahrenheit"
          updateWeatherData()
        }
      });
      celsiusTempUnit.checked = true;

      //Fetches the weather data and updates dislay
      let meteoData
      function getWeatherData(lat, lng, unit){
        fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+"&temperature_unit="+unit+"&current=temperature_2m,apparent_temperature,is_day,weather_code&hourly=precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto").then(function(response){
          return response.json();
        }).then(function(data){
          meteoData = data;
          console.log(meteoData) // TBD
          updateDateTime();
          updateLocationWeather();
        }).catch(function(error){
          console.error(error);
        });
      }

      function updateDateTime(){
        if(meteoData){
          let newDate = new Date(new Date().toLocaleString("en-US", { timeZone: meteoData.timezone }));
          dateText.text = newDate.toLocaleString("en-US", {weekday: "short",}).toUpperCase() + ", " + newDate.toLocaleString("en-US", {month: "long", day: "numeric",});
          let timeString = newDate.toLocaleString("en-US", {hour: "2-digit", minute: "2-digit", hour12: timeFormat, });
          let timeParts = timeString.split(" ");
          let time = timeParts[0];
          let ampm = timeParts[1];
          timeText.text = time;
          if(ampm){
            ampmText.text = ampm;
          } else {
            ampmText.text = "";
          };
          secondsDot.isVisible = !secondsDot.isVisible;
          console.log("date time updated"); // TBD
        }
      }
      setInterval(updateDateTime, 1000);
      updateDateTime();

      function updateWeatherData(){
        if(meteoData){
          getWeatherData(selectedCity.lat, selectedCity.lng, tempUnit);
        };
      };
      setInterval(updateWeatherData, 600000);
      updateWeatherData();

      let allMiddleInstances = []
      let allIconInstances = []

      function updateLocationWeather(){
        tempUnitSymbol = meteoData.current_units.temperature_2m;

        // Top
        cityText.text = limitStrig(selectedCity.name, 20) + ", " + selectedCity.country;
        currentTempText.text = Math.round(meteoData.current.temperature_2m) + tempUnitSymbol;
        feelsLikeText.text = "Feels like " +  Math.round(meteoData.current.apparent_temperature) + tempUnitSymbol;
        
        // Middle
        for (var i = 0; i < allMiddleInstances.length; i++) {
          allMiddleInstances[i].dispose();
        };
        let currentHour = detectHour(meteoData.timezone);
        let positionX
        let shader
        let iterator = 0
        for(let i = 0; i < 3; i++){
          shader = allShaders[i]
          for(let i = 0; i < 4; i++){
            positionX = allMiddlePosX[i]
            constructMiddle(meteoData.hourly.time[currentHour + iterator + 1], meteoData.hourly.precipitation_probability[currentHour + iterator + 1], positionX, shader)
            iterator += 1;
          };
        };
        
        lineOne.isVisible = true;
        lineTwo.isVisible = true;
        for (i = 0; i < allChartBarMeshes.length; i++){
          allChartBarMeshes[i].isVisible = true;
        }

        // Bottom
        for (var i = 0; i < allIconInstances.length; i++) {
          allIconInstances[i].dispose();
        };
        for(let i = 0; i < allNextDayNameText.length; i++){
          let shortWeekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
          let newDate = new Date(meteoData.daily.time[i+1]);
          let dayOfWeek = newDate.getDay();
          allNextDayNameText[i].text = shortWeekdays[dayOfWeek]
          allNextDayTempText[i].text = Math.round(meteoData.daily.temperature_2m_min[i+1]) + " / " + Math.round(meteoData.daily.temperature_2m_max[i+1]) + tempUnitSymbol;
          instantiateWeatherIcon(meteoData.daily.weather_code[i+1], 1, allNextDayIconPos[i], nextDayIconScale);
        };
        instantiateWeatherIcon(meteoData.current.weather_code, meteoData.current.is_day, currentIconPos, currentIconScele);
      };

      function constructMiddle(time, precipitation, positionX, shader){
        let newDate = new Date(time);
        let newHour
        if (timeFormat) {
          newHour = newDate.toLocaleString("en-US", {hour: "2-digit", hour12: timeFormat, });
        } else {
          newHour = newDate.toLocaleString("en-US", {hour: "2-digit", minute: "2-digit", hour12: timeFormat, });
        };

        let hourlyText = BABYLON.MeshBuilder.CreateText( "hourlyText", newHour, fontArialBold, {size: 0.0625, resolution: 8, depth: -1}, scene);
        hourlyText.position.x = positionX;
        hourlyText.position.y = 0.05;
        hourlyText.material = shader;
        allMiddleInstances.push(hourlyText);

        let precText = BABYLON.MeshBuilder.CreateText( "precText", precipitation + "%", fontArialRegular, {size: 0.0625, resolution: 8, depth: -1}, scene);
        precText.position.x = positionX;
        precText.position.y = -0.1;
        precText.material = shader;
        allMiddleInstances.push(precText);

        if (precipitation > 0){
          let newBarHeight = (precipitation / 100) * chartBarHeight;
          console.log(newBarHeight)
          let chartBarMesh = BABYLON.MeshBuilder.CreatePlane("chartBarMesh", {height: newBarHeight, width: chartBarWidth});
          chartBarMesh.position.x = positionX;
          chartBarMesh.position.y = lineMiddle + newBarHeight / 2;
          chartBarMesh.material = shader;
          allMiddleInstances.push(chartBarMesh);
        }
      };

      function instantiateWeatherIcon(code, day, position, scale){
        let newInstanceFirstPart
        let newInstanceSecondPart
        switch(code) {
          case 0:
            if (day == 1){
              newInstanceFirstPart = wIcon0d;
            } else {
              newInstanceFirstPart = wIcon0n;
            };
            break;
          case 1:
            if (day == 1){
              newInstanceFirstPart = wIcon1d_primitive0;
              newInstanceSecondPart = wIcon1d_primitive1;
            } else {
              newInstanceFirstPart = wIcon1n_primitive0;
              newInstanceSecondPart = wIcon1n_primitive1;
            };
          break;
          case 2:
            if (day == 1){
              newInstanceFirstPart = wIcon2d_primitive0;
              newInstanceSecondPart = wIcon2d_primitive1;
            } else {
              newInstanceFirstPart = wIcon2n_primitive0;
              newInstanceSecondPart = wIcon2n_primitive1;
            };
          break;
          case 3:
            newInstanceFirstPart = wIcon3_primitive0;
            newInstanceSecondPart = wIcon3_primitive1;
          break;
          case 45:
            newInstanceFirstPart = wIcon45_primitive0;
            newInstanceSecondPart = wIcon45_primitive1;
          break;
          case 48:
            newInstanceFirstPart = wIcon48_primitive0;
            newInstanceSecondPart = wIcon48_primitive1;
          break;
          case 51:
            newInstanceFirstPart = wIcon51_primitive0;
            newInstanceSecondPart = wIcon51_primitive1;
          break;
          case 53:
            newInstanceFirstPart = wIcon53_primitive0;
            newInstanceSecondPart = wIcon53_primitive1;
          break;
          case 55:
            newInstanceFirstPart = wIcon55_primitive0;
            newInstanceSecondPart = wIcon55_primitive1;
          break;
          case 56:
            newInstanceFirstPart = wIcon56_primitive0;
            newInstanceSecondPart = wIcon56_primitive1;
          break;
          case 57:
            newInstanceFirstPart = wIcon57_primitive0;
            newInstanceSecondPart = wIcon57_primitive1;
          break;
          case 61:
            newInstanceFirstPart = wIcon61_primitive0;
            newInstanceSecondPart = wIcon61_primitive1;
          break;
          case 63:
            newInstanceFirstPart = wIcon63_primitive0;
            newInstanceSecondPart = wIcon63_primitive1;
          break;
          case 65:
            newInstanceFirstPart = wIcon65_primitive0;
            newInstanceSecondPart = wIcon65_primitive1;
          break;
          case 66:
            newInstanceFirstPart = wIcon66_primitive0;
            newInstanceSecondPart = wIcon66_primitive1;
          break;
          case 67:
            newInstanceFirstPart = wIcon67_primitive0;
            newInstanceSecondPart = wIcon67_primitive1;
          break;
          case 71:
            newInstanceFirstPart = wIcon71_primitive0;
            newInstanceSecondPart = wIcon71_primitive1;
          break;
          case 73:
            newInstanceFirstPart = wIcon73_primitive0;
            newInstanceSecondPart = wIcon73_primitive1;
          break;
          case 75:
            newInstanceFirstPart = wIcon75_primitive0;
            newInstanceSecondPart = wIcon75_primitive1;
          break;
          case 77:
            newInstanceFirstPart = wIcon77_primitive0;
            newInstanceSecondPart = wIcon77_primitive1;
          break;
          case 80:
            newInstanceFirstPart = wIcon80_primitive0;
            newInstanceSecondPart = wIcon80_primitive1;
          break;
          case 81:
            newInstanceFirstPart = wIcon81_primitive0;
            newInstanceSecondPart = wIcon81_primitive1;
          break;
          case 82:
            newInstanceFirstPart = wIcon82_primitive0;
            newInstanceSecondPart = wIcon82_primitive1;
          break;
          case 85:
            newInstanceFirstPart = wIcon85_primitive0;
            newInstanceSecondPart = wIcon85_primitive1;
          break;
          case 86:
            newInstanceFirstPart = wIcon86_primitive0;
            newInstanceSecondPart = wIcon86_primitive1;
          break;
          case 95:
            newInstanceFirstPart = wIcon95_primitive0;
            newInstanceSecondPart = wIcon95_primitive1;
          break;
          case 96:
            newInstanceFirstPart = wIcon96_primitive0;
            newInstanceSecondPart = wIcon96_primitive1;
          break;
          case 99:
            newInstanceFirstPart = wIcon99_primitive0;
            newInstanceSecondPart = wIcon99_primitive1;
          break;
          default: console.log(code)
        };
        if(newInstanceFirstPart){
          let iconInstance = newInstanceFirstPart.createInstance();
          iconInstance.position = position;
          iconInstance.scaling = scale;
          allIconInstances.push(iconInstance);
        };
        if(newInstanceSecondPart){
          let iconInstance = newInstanceSecondPart.createInstance();
          iconInstance.position = position;
          iconInstance.scaling = scale;
          allIconInstances.push(iconInstance);
        };
      };

      // Background
      const background1 = scene.getMeshByName("background1");
      background1.receiveShadows = true;
      shadowGenerator.addShadowCaster(background1);
      
      const backgroundMaterial = new BABYLON.PBRMaterial("backgroundMaterial", scene);
      backgroundMaterial.metallic = 0.0;
      backgroundMaterial.roughness = 1.0;
      backgroundMaterial.albedoColor = BABYLON.Color3.FromHexString('#042940').toLinearSpace();
      backgroundMaterial.backFaceCulling = false;
      background1.material = backgroundMaterial;

    });

    // Helper Functions
    function limitStrig(str, maxLength){
      if (str.length <= maxLength){
        return str;
      } else {
        return str.substring(0, maxLength) + "...";
      };
    };

    function detectHour(timezone){
      let newDate = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
      return parseInt(newDate.toLocaleString("en-US", {hour: "2-digit", hour12: false }));
    };

    // ----------
    return scene;
  };

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});