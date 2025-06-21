const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weatherContainer")
const grantAccessContainer=document.querySelector(".grantLocationContainer")
const searchForm=document.querySelector("[data-searchForm]")
const loadingScreen=document.querySelector(".loadingContainer")
const userInfoContainer=document.querySelector(".user-info-container")
const grantAccessButton=document.querySelector("[data-grantAccess]")
let currentTab=userTab;


currentTab.classList.add('current-tab')
getFromSessionStorage()
//Switch tab
userTab.addEventListener('click',()=>{
//pass click tab
switchTab(userTab)
})


searchTab.addEventListener('click',()=>{
//pass click tab
switchTab(searchTab)
})
function switchTab(clickedTab){
//    apiErrorContainer.classList.remove("active")
    if(clickedTab!==currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab
        currentTab.classList.add("current-tab")
       if(!searchForm.classList.contains("active")){   //searchform is not active so we need to make it active
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")
       }
       else{
        searchForm.classList.remove("active")
        userInfoContainer.classList.remove("active")
        getFromSessionStorage()
       }


       

    }
}

//CHeck if coordinates are present in session
function getFromSessionStorage(){
const localCoordinate=sessionStorage.getItem("user-coordinate")
if(!localCoordinate){
    grantAccessContainer.classList.add('active')
}else{
    const coordinate=JSON.parse(localCoordinate)
    fetchUserWeatherInfo(coordinate)

}


}






//to get user weather
async function fetchUserWeatherInfo(coordinate){
    const {latitude,longitude}=coordinate
    grantAccessContainer.classList.remove('active')
    loadingScreen.classList.add('active')
    try{
      const response=await fetch(`https://api.weatherstack.com/current?access_key=${API_KEY}&query=${latitude},${longitude}`)
      const data=await response.json()
        loadingScreen.classList.remove('active')
        userInfoContainer.classList.add('active')
        renderWeatherInfor(data)
    }catch(e){
        console.log(e)
loadingScreen.classList.remove('active')
alert("Something went wrong.Please try again")
    }
}
async function renderWeatherInfor(data){
    const cityName=document.querySelector('[data-cityName]')
      const countryIcon=document.querySelector('[data-countryIcon]')
      const weatherDesc=document.querySelector("[data-weatherDesc]")
 const weatherIcon=document.querySelector("[data-weatherIcon]")
  const temp=document.querySelector("[data-temprature]")
   const windSpeed=document.querySelector("[data-windSpeed]")
    const humidity=document.querySelector("[data-humidity]")
   const cloud=document.querySelector("[data-cloud]")

   cityName.innerText=data?.location?.name
     const responseFlag = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(data?.location?.country)}`);
    const dataFlag = await responseFlag.json();
    
    // Extract the 2-letter country code (ISO 3166-1 alpha-2)
    const countryCode = dataFlag[0].cca2;
  
    // Step 2: Use FlagCDN to display the flag
    countryIcon.src = `https://flagcdn.com/144x108/${countryCode.toLowerCase()}.png`;

   weatherDesc.innerText=data?.current?.weather_descriptions[0]
   weatherIcon.src=data?.current?.weather_icons[0]
   temp.innerText=`${data?.current?.temperature} °C`;
 windSpeed.innerText = `${data?.current?.wind_speed} m/s`
humidity.innerText = `${data?.current?.humidity} %`
cloud.innerText = `${data?.current?.cloudcover} %`
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }else{
        alert("No location")
    }
}

function showPosition(Position){
    const userCordinates={
        latitude:Position.coords.latitude,
        longitude:Position.coords.longitude
    }
    sessionStorage.setItem('user-coordinate',JSON.stringify(userCordinates))
    fetchUserWeatherInfo(userCordinates)
}

grantAccessButton.addEventListener('click',getLocation)
const searchInput=document.querySelector("[data-searchInput]")

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value===''){
        return
    }
    fetchSearchrWeatherInfo(searchInput.value)

})



async function fetchSearchrWeatherInfo(city){
        loadingScreen.classList.add('active')
            grantAccessContainer.classList.remove('active')
            userInfoContainer.classList.remove('active')
            try{

const response=await fetch(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`)
const data=await response.json()
  loadingScreen.classList.remove('active')
     userInfoContainer.classList.add('active')
   renderWeatherInfor(data)

            }catch(e){
                alert("Error")
            }

}

