const userTab = document.querySelector('.your-weather');
const searchTab = document.querySelector('.search-weather');

const grantAccessContainer = document.querySelector('.grant-location');
const searchForm = document.querySelector('.form-container');

const loadingContainer = document.querySelector('.loading-container');
const userUI = document.querySelector('.user-ui');

const error = document.querySelector('.not-found');




let currentTab = userTab ;
const API_KEY = "9fccf6a6592856e388b37be47417ec0c";
currentTab.classList.add("current-tab");
getFromSessionStroage();

function switchTab(clickedTab){

    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userUI.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            
        }
        else{
            searchForm.classList.remove("active");
            userUI.classList.remove("active");
            error.classList.remove('active');
            getFromSessionStroage();
        }
    }

}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

function getFromSessionStroage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWheatherInfo(coordinates)
    }
}

async function fetchUserWheatherInfo(coordinates){
    const {lat , lon} = coordinates;

    grantAccessContainer.classList.remove("active");

    loadingContainer.classList.add("active");

    try{
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        if(!res.ok){
            throw new Error("city not found");
          }
        loadingContainer.classList.remove("active");

        userUI.classList.add("active")

        renderData(data);

    }
    catch (err) {
        loadingContainer.classList.remove("active");
        userUI.classList.remove("active")
        error.classList.add('active');

    }
}
function renderData(weatherInfo){

    const cityName = document.querySelector(".cityName");
    const countryIcon = document.querySelector(".cuntryicon");
    const desc = document.querySelector(".weather-dec");
    const weatherIcon = document.querySelector(".weathericon");
    const temp = document.querySelector(".temp");
    const windSpeed = document.querySelector(".windSpeed");
    const humidity = document.querySelector(".humidity");
    const clouds = document.querySelector(".clouds");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
        alert("Location in not allowed or Browser don't support this feature")
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWheatherInfo(userCoordinates);

}


const grantAccessButton = document.querySelector(".location-access-btn");

grantAccessButton.addEventListener("click",getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") 
        return;

    else
        fetchSearchWeatherInfo(cityName);
     
})
async function fetchSearchWeatherInfo(city) {
    loadingContainer.classList.add("active");
    userUI.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          if(!response.ok){
            throw new Error("city not found");
          }
        const data = await response.json();
        loadingContainer.classList.remove("active");
        userUI.classList.add("active");
        renderData(data);
    }
    catch(err) {
        //hW
  
        loadingContainer.classList.remove("active");
        userUI.classList.remove("active")
        error.classList.add('active');
        console.error("Error fetching weather info:", err);
    }

}